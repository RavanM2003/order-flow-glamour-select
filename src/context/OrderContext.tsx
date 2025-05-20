
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { Service } from "@/models/service.model";
import { Product } from "@/models/product.model";
import { Staff } from "@/models/staff.model";

export interface Customer {
  name: string;
  email: string;
  phone: string;
  gender: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  gender: string;
  date: string;
  time: string;
  notes: string;
}

interface OrderContextType {
  orderState: {
    currentStep: number;
    customer: Customer;
    customerInfo: CustomerInfo | null;
    selectedService: Service | null;
    selectedStaff: Staff | null;
    selectedProducts: Product[];
    selectedServices: number[];
    appointmentDate: Date | null;
    appointmentTime: string | null;
    totalAmount: number;
    paymentMethod: string | null;
    serviceProviders: Array<{serviceId: number, name: string}> | null;
  };
  setCustomer: (customer: Customer) => void;
  updateCustomerInfo: (info: CustomerInfo) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  setAppointmentDate: (date: Date | null) => void;
  setAppointmentTime: (time: string | null) => void;
  setNextStep: () => void;
  setPrevStep: () => void;
  goToStep: (step: number) => void;
  resetOrder: () => void;
  setPaymentMethod: (method: string) => void;
  completeOrder: (orderId: string) => void;
  addServiceProvider: (serviceId: number, staffName: string) => void;
  selectService: (serviceId: number) => void;
  unselectService: (serviceId: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    gender: "female"
  });
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [serviceProviders, setServiceProviders] = useState<Array<{serviceId: number, name: string}> | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const calculateTotal = useCallback((): number => {
    let total = 0;
    
    // Add service price
    if (selectedService) {
      total += selectedService.price;
    }
    
    // Add product prices
    total += selectedProducts.reduce((sum, product) => sum + (product.price || 0), 0);
    
    return total;
  }, [selectedService, selectedProducts]);

  const addProduct = useCallback((product: Product) => {
    setSelectedProducts((prev) => [...prev, product]);
  }, []);

  const removeProduct = useCallback((product: Product) => {
    setSelectedProducts((prev) => 
      prev.filter((p) => p.id !== product.id)
    );
  }, []);

  const setNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, []);

  const setPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  const updateCustomerInfo = useCallback((info: CustomerInfo) => {
    setCustomerInfo(info);
  }, []);

  const resetOrder = useCallback(() => {
    setCurrentStep(1);
    setCustomer({
      name: "",
      email: "",
      phone: "",
      gender: "female",
    });
    setCustomerInfo(null);
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedProducts([]);
    setAppointmentDate(null);
    setAppointmentTime(null);
    setPaymentMethod(null);
    setServiceProviders(null);
    setOrderId(null);
    setSelectedServices([]);
  }, []);

  const completeOrder = useCallback((id: string) => {
    setOrderId(id);
  }, []);

  const addServiceProvider = useCallback((serviceId: number, staffName: string) => {
    setServiceProviders(prev => {
      const newProviders = prev ? [...prev] : [];
      const existingIndex = newProviders.findIndex(p => p.serviceId === serviceId);
      
      if (existingIndex >= 0) {
        newProviders[existingIndex] = { serviceId, name: staffName };
      } else {
        newProviders.push({ serviceId, name: staffName });
      }
      
      return newProviders;
    });
  }, []);

  const selectService = useCallback((serviceId: number) => {
    setSelectedServices(prev => {
      if (!prev.includes(serviceId)) {
        return [...prev, serviceId];
      }
      return prev;
    });
  }, []);

  const unselectService = useCallback((serviceId: number) => {
    setSelectedServices(prev => prev.filter(id => id !== serviceId));
  }, []);

  const value = {
    orderState: {
      currentStep,
      customer,
      customerInfo,
      selectedService,
      selectedStaff,
      selectedProducts,
      selectedServices,
      appointmentDate,
      appointmentTime,
      totalAmount: calculateTotal(),
      paymentMethod,
      serviceProviders,
    },
    setCustomer,
    updateCustomerInfo,
    setSelectedService,
    setSelectedStaff,
    addProduct,
    removeProduct,
    setAppointmentDate,
    setAppointmentTime,
    setNextStep,
    setPrevStep,
    goToStep,
    resetOrder,
    setPaymentMethod,
    completeOrder,
    addServiceProvider,
    selectService,
    unselectService,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
