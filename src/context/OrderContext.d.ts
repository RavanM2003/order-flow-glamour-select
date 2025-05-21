
import { ReactNode } from 'react';

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  benefits?: string[];
  category_id?: number;
}

export interface Staff {
  id: string;
  name: string;
  position?: string;
  specializations?: number[];
  avatar_url?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock?: number;
}

export type BookingMode = 'salon' | 'home';

export interface OrderState {
  step: number;
  bookingMode: BookingMode;
  customer: Customer;
  selectedService: Service | null;
  selectedStaff: Staff | null;
  selectedProducts: Product[];
  appointmentDate: Date | null;
  appointmentTime: string;
  totalAmount: number;
}

export interface OrderContextType {
  orderState: OrderState;
  setBookingMode: (mode: BookingMode) => void;
  setCustomer: (customer: Customer) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  setAppointmentDate: (date: Date | null) => void;
  setAppointmentTime: (time: string) => void;
  calculateTotal: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setNextStep: () => void;
  setPrevStep: () => void;
  setStep: (step: number) => void;
  resetOrder: () => void;
}

export interface OrderProviderProps {
  children: ReactNode;
}
