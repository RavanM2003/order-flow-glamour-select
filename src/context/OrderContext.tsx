
import { createContext, useContext, ReactNode, useState } from "react";
import { Service } from "@/models/service.model";
import { Product } from "@/models/product.model";
import { Staff } from "@/models/staff.model";

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface OrderContextType {
  orderState: {
    currentStep: number;
    customer: Customer;
    selectedService: Service | null;
    selectedStaff: Staff | null;
    selectedProducts: Product[];
    appointmentDate: Date | null;
    appointmentTime: string | null;
    totalAmount: number;
  };
  setCustomer: (customer: Customer) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  setAppointmentDate: (date: Date | null) => void;
  setAppointmentTime: (time: string | null) => void;
  setNextStep: () => void;
  setPrevStep: () => void;
  resetOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
  });
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);

  const calculateTotal = (): number => {
    let total = 0;
    
    // Add service price
    if (selectedService) {
      total += selectedService.price;
    }
    
    // Add product prices
    total += selectedProducts.reduce((sum, product) => sum + (product.price || 0), 0);
    
    return total;
  };

  const addProduct = (product: Product) => {
    setSelectedProducts((prev) => [...prev, product]);
  };

  const removeProduct = (product: Product) => {
    setSelectedProducts((prev) => 
      prev.filter((p) => p.id !== product.id)
    );
  };

  const setNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const setPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetOrder = () => {
    setCurrentStep(1);
    setCustomer({
      name: "",
      email: "",
      phone: "",
    });
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedProducts([]);
    setAppointmentDate(null);
    setAppointmentTime(null);
  };

  const value = {
    orderState: {
      currentStep,
      customer,
      selectedService,
      selectedStaff,
      selectedProducts,
      appointmentDate,
      appointmentTime,
      totalAmount: calculateTotal(),
    },
    setCustomer,
    setSelectedService,
    setSelectedStaff,
    addProduct,
    removeProduct,
    setAppointmentDate,
    setAppointmentTime,
    setNextStep,
    setPrevStep,
    resetOrder,
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
