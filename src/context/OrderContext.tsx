import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
  gender: string; // Add gender field to the interface
}

interface OrderState {
  step: number;
  customerInfo: CustomerInfo | null;
  selectedServices: number[];
  selectedProducts: number[];
  total: number;
  completed: boolean;
  orderId: string | null;
  paymentMethod: string;
  serviceProviders: { serviceId: number, name: string }[];
  status: string;
}

interface OrderContextType {
  orderState: OrderState;
  updateCustomerInfo: (info: CustomerInfo) => void;
  selectService: (serviceId: number) => void;
  unselectService: (serviceId: number) => void;
  selectProduct: (productId: number) => void;
  unselectProduct: (productId: number) => void;
  updateTotal: (amount: number) => void;
  goToStep: (step: number) => void;
  resetOrder: () => void;
  completeOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Initial state
const initialState: OrderState = {
  step: 1,
  customerInfo: null,
  selectedServices: [],
  selectedProducts: [],
  total: 0,
  completed: false,
  orderId: null,
  paymentMethod: "",
  serviceProviders: [],
  status: "Gözləmədə"
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderState, setOrderState] = useState<OrderState>(initialState);
  
  const updateCustomerInfo = (info: CustomerInfo) => {
    setOrderState(prev => ({
      ...prev,
      customerInfo: info
    }));
  };
  
  const selectService = (serviceId: number) => {
    setOrderState(prev => ({
      ...prev,
      selectedServices: [...prev.selectedServices, serviceId]
    }));
  };
  
  const unselectService = (serviceId: number) => {
    setOrderState(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(id => id !== serviceId)
    }));
  };
  
  const selectProduct = (productId: number) => {
    setOrderState(prev => ({
      ...prev,
      selectedProducts: [...prev.selectedProducts, productId]
    }));
  };
  
  const unselectProduct = (productId: number) => {
    setOrderState(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(id => id !== productId)
    }));
  };
  
  const updateTotal = (amount: number) => {
    setOrderState(prev => ({
      ...prev,
      total: amount
    }));
  };
  
  const goToStep = (step: number) => {
    setOrderState(prev => ({
      ...prev,
      step
    }));
  };
  
  const resetOrder = () => {
    setOrderState(initialState);
  };
  
  const generateOrderId = () => {
    const prefix = "GS";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };
  
  const completeOrder = () => {
    setOrderState(prev => ({
      ...prev,
      completed: true,
      step: 1,
      orderId: generateOrderId()
    }));
  };
  
  return (
    <OrderContext.Provider value={{
      orderState,
      updateCustomerInfo,
      selectService,
      unselectService,
      selectProduct,
      unselectProduct,
      updateTotal,
      goToStep,
      resetOrder,
      completeOrder
    }}>
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
