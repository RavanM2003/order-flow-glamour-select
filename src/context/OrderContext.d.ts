
import { ReactNode } from 'react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  gender: string;
  lastVisit: string;
  totalSpent: number;
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
  created_at?: string;
  updated_at?: string;
  user_id?: string;
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
  currentStep: number;
  bookingMode: BookingMode;
  customer: Customer;
  selectedService: Service | null;
  selectedStaff: Staff | null;
  selectedProducts: Product[];
  selectedServices: number[];
  appointmentDate: Date | null;
  appointmentTime: string | null;
  totalAmount: number;
  paymentMethod: string | null;
  serviceProviders: Array<{serviceId: number, name: string}> | null;
}

export interface OrderContextType {
  orderState: OrderState;
  setCustomer: (customer: Customer) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  addProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
  setAppointmentDate: (date: Date | null) => void;
  setAppointmentTime: (time: string | null) => void;
  setBookingMode: (mode: BookingMode) => void;
  calculateTotal: () => number;
  setNextStep: () => void;
  setPrevStep: () => void;
  goToStep: (step: number) => void;
  resetOrder: () => void;
  setPaymentMethod: (method: string | null) => void;
  completeOrder: (id: string) => void;
  addServiceProvider: (serviceId: number, staffName: string) => void;
  selectService: (serviceId: number) => void;
  unselectService: (serviceId: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

export interface OrderProviderProps {
  children: ReactNode;
  initialCustomer?: Customer;
}
