
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  gender: string;
}

interface OrderState {
  currentStep: number;
  customerInfo: CustomerInfo | null;
  selectedServices: number[];
  selectedProducts: number[];
  paymentMethod: string;
  total: number;
  orderId: string | null;
}

interface OrderContextType {
  orderState: OrderState;
  goToStep: (step: number) => void;
  updateCustomerInfo: (info: CustomerInfo) => void;
  selectService: (serviceId: number) => void;
  unselectService: (serviceId: number) => void;
  selectProduct: (productId: number) => void;
  unselectProduct: (productId: number) => void;
  setPaymentMethod: (method: string) => void;
  updateTotal: (total: number) => void;
  completeOrder: (orderId: string) => void;
  resetOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
  initialCustomer?: any;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children, initialCustomer }) => {
  // Initialize with customer data if provided
  const initialCustomerInfo = initialCustomer ? {
    name: initialCustomer.name || '',
    email: initialCustomer.email || '',
    phone: initialCustomer.phone || '',
    date: '',
    time: '',
    notes: '',
    gender: initialCustomer.gender || 'female'
  } : null;

  const [orderState, setOrderState] = useState<OrderState>({
    currentStep: 1,
    customerInfo: initialCustomerInfo,
    selectedServices: [],
    selectedProducts: [],
    paymentMethod: 'cash',
    total: 0,
    orderId: null
  });

  const goToStep = (step: number) => {
    setOrderState(prev => ({ ...prev, currentStep: step }));
  };

  const updateCustomerInfo = (info: CustomerInfo) => {
    setOrderState(prev => ({ ...prev, customerInfo: info }));
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

  const setPaymentMethod = (method: string) => {
    setOrderState(prev => ({ ...prev, paymentMethod: method }));
  };

  const updateTotal = (total: number) => {
    setOrderState(prev => ({ ...prev, total }));
  };

  const completeOrder = (orderId: string) => {
    setOrderState(prev => ({ ...prev, orderId }));
  };

  const resetOrder = () => {
    setOrderState({
      currentStep: 1,
      customerInfo: null,
      selectedServices: [],
      selectedProducts: [],
      paymentMethod: 'cash',
      total: 0,
      orderId: null
    });
  };

  return (
    <OrderContext.Provider value={{
      orderState,
      goToStep,
      updateCustomerInfo,
      selectService,
      unselectService,
      selectProduct,
      unselectProduct,
      setPaymentMethod,
      updateTotal,
      completeOrder,
      resetOrder
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
