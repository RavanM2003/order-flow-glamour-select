
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  gender: string;
}

export interface ServiceProvider {
  serviceId: number;
  name: string;
}

export interface OrderState {
  currentStep: number;
  customerInfo: CustomerInfo | null;
  selectedServices: number[];
  selectedProducts: number[];
  paymentMethod: string;
  total: number;
  orderId: string | null;
  orderReference: string | null;
  status: string;
  serviceProviders: ServiceProvider[];
  appliedProducts?: Record<number, number[]>;
  amountPaid?: number;
  remainingBalance?: number;
  createdAt?: string;
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
  updateStatus: (status: string) => void;
  updateServiceProviders: (providers: ServiceProvider[]) => void;
  updateAppliedProducts: (appliedProducts: Record<number, number[]>) => void;
  resetOrder: () => void;
  updatePaymentDetails: (amountPaid: number) => void;
}

const defaultCustomer: CustomerInfo = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  notes: '',
  gender: 'female'
};

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
    orderId: null,
    orderReference: null,
    status: 'pending',
    serviceProviders: [],
    appliedProducts: {},
    amountPaid: 0,
    remainingBalance: 0,
    createdAt: new Date().toISOString()
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
      selectedServices: prev.selectedServices.filter(id => id !== serviceId),
      // Also remove any service providers associated with this service
      serviceProviders: prev.serviceProviders.filter(sp => sp.serviceId !== serviceId)
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
    setOrderState(prev => ({ 
      ...prev, 
      total, 
      remainingBalance: total - (prev.amountPaid || 0)
    }));
  };

  const completeOrder = (orderId: string) => {
    // Generate an order reference number
    const orderReference = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    
    setOrderState(prev => ({ 
      ...prev, 
      orderId, 
      orderReference,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }));
  };

  const updateStatus = (status: string) => {
    setOrderState(prev => ({ ...prev, status }));
  };

  const updateServiceProviders = (providers: ServiceProvider[]) => {
    setOrderState(prev => ({ ...prev, serviceProviders: providers }));
  };

  const updateAppliedProducts = (appliedProducts: Record<number, number[]>) => {
    setOrderState(prev => ({ ...prev, appliedProducts }));
  };

  const updatePaymentDetails = (amountPaid: number) => {
    setOrderState(prev => ({ 
      ...prev, 
      amountPaid,
      remainingBalance: prev.total - amountPaid
    }));
  };

  const resetOrder = () => {
    setOrderState({
      currentStep: 1,
      customerInfo: null,
      selectedServices: [],
      selectedProducts: [],
      paymentMethod: 'cash',
      total: 0,
      orderId: null,
      orderReference: null,
      status: 'pending',
      serviceProviders: [],
      appliedProducts: {},
      amountPaid: 0,
      remainingBalance: 0,
      createdAt: new Date().toISOString()
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
      updateStatus,
      updateServiceProviders,
      updateAppliedProducts,
      updatePaymentDetails,
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
