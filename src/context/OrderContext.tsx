import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer } from '@/models/customer.model';
import { OrderContextType } from './OrderContext.d';

type OrderProviderProps = {
  children: ReactNode;
  initialCustomer?: Customer;
};

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<OrderProviderProps> = ({ children, initialCustomer }) => {
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

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
