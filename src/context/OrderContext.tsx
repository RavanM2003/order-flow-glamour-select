
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image?: string;
};

export type ProductItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
};

export type PaymentMethod = 'credit_card' | 'cash' | 'paypal';

export type OrderState = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  selectedDate?: Date;
  selectedTime?: string;
  cartItems: CartItem[];
  paymentMethod?: PaymentMethod;
  notes?: string;
  step: number;
};

type OrderContextType = {
  orderState: OrderState;
  services: ServiceItem[];
  products: ProductItem[];
  setCustomerInfo: (name: string, email: string, phone: string) => void;
  setDateTime: (date: Date, time: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setNotes: (notes: string) => void;
  getTotal: () => number;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  resetOrder: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const initialOrderState: OrderState = {
  customer: {
    name: '',
    email: '',
    phone: '',
  },
  cartItems: [],
  step: 1,
};

// Sample data
const sampleServices: ServiceItem[] = [
  {
    id: 's1',
    name: 'Classic Manicure',
    description: 'Basic nail care and polish application',
    price: 30,
    duration: '30 min',
    category: 'Nails',
    image: '/placeholder.svg'
  },
  {
    id: 's2',
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish application',
    price: 45,
    duration: '45 min',
    category: 'Nails',
    image: '/placeholder.svg'
  },
  {
    id: 's3',
    name: 'Full Face Makeup',
    description: 'Complete makeup application for any occasion',
    price: 75,
    duration: '60 min',
    category: 'Makeup',
    image: '/placeholder.svg'
  },
  {
    id: 's4',
    name: 'Hair Styling',
    description: 'Professional hair styling and blowout',
    price: 60,
    duration: '45 min',
    category: 'Hair',
    image: '/placeholder.svg'
  },
  {
    id: 's5',
    name: 'Facial Treatment',
    description: 'Rejuvenating facial with premium products',
    price: 85,
    duration: '60 min',
    category: 'Skin',
    image: '/placeholder.svg'
  },
  {
    id: 's6',
    name: 'Eyebrow Shaping',
    description: 'Professional eyebrow waxing and styling',
    price: 25,
    duration: '20 min',
    category: 'Brows',
    image: '/placeholder.svg'
  },
];

const sampleProducts: ProductItem[] = [
  {
    id: 'p1',
    name: 'Luxury Nail Polish',
    description: 'Premium long-lasting formula',
    price: 18,
    category: 'Nails',
    image: '/placeholder.svg'
  },
  {
    id: 'p2',
    name: 'Hydrating Face Mask',
    description: 'Deep hydration for all skin types',
    price: 25,
    category: 'Skin',
    image: '/placeholder.svg'
  },
  {
    id: 'p3',
    name: 'Hair Serum',
    description: 'Smoothing and anti-frizz treatment',
    price: 35,
    category: 'Hair',
    image: '/placeholder.svg'
  },
  {
    id: 'p4',
    name: 'Lip Gloss Collection',
    description: 'Set of 3 premium lip glosses',
    price: 40,
    category: 'Makeup',
    image: '/placeholder.svg'
  }
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderState, setOrderState] = useState<OrderState>(initialOrderState);
  
  const setCustomerInfo = (name: string, email: string, phone: string) => {
    setOrderState(prev => ({
      ...prev,
      customer: { name, email, phone }
    }));
  };

  const setDateTime = (date: Date, time: string) => {
    setOrderState(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: time
    }));
  };

  const addToCart = (item: CartItem) => {
    setOrderState(prev => {
      // Check if item already exists
      const existingItemIndex = prev.cartItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prev.cartItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return {
          ...prev,
          cartItems: updatedItems
        };
      }
      
      // Add new item
      return {
        ...prev,
        cartItems: [...prev.cartItems, item]
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setOrderState(prev => ({
      ...prev,
      cartItems: prev.cartItems.filter(item => item.id !== itemId)
    }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setOrderState(prev => ({
      ...prev,
      cartItems: prev.cartItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    }));
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setOrderState(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const setNotes = (notes: string) => {
    setOrderState(prev => ({
      ...prev,
      notes
    }));
  };

  const getTotal = () => {
    return orderState.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const nextStep = () => {
    setOrderState(prev => ({
      ...prev,
      step: prev.step + 1
    }));
  };

  const previousStep = () => {
    setOrderState(prev => ({
      ...prev,
      step: Math.max(1, prev.step - 1)
    }));
  };

  const goToStep = (step: number) => {
    setOrderState(prev => ({
      ...prev,
      step
    }));
  };

  const resetOrder = () => {
    setOrderState(initialOrderState);
  };

  return (
    <OrderContext.Provider value={{
      orderState,
      services: sampleServices,
      products: sampleProducts,
      setCustomerInfo,
      setDateTime,
      addToCart,
      removeFromCart,
      updateQuantity,
      setPaymentMethod,
      setNotes,
      getTotal,
      nextStep,
      previousStep,
      goToStep,
      resetOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
