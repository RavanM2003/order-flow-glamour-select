
import { ReactNode } from 'react';
import { Customer } from '@/models/customer.model';
import { Staff } from '@/models/staff.model';
import { Product } from '@/models/product.model';
import { Service } from '@/models/service.model';

// Define the CustomerInfo type needed for OrderContext
export interface CustomerInfo {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  // Additional fields needed by CustomerInfo.tsx
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  gender?: string;
}

export interface OrderContextType {
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
  setPaymentMethod: (method: string | null) => void;
  completeOrder: (orderId: string) => void;
  addServiceProvider: (serviceId: number, staffName: string) => void;
  selectService: (serviceId: number) => void;
  unselectService: (serviceId: number) => void;
}

export interface OrderProviderProps {
  children: ReactNode;
  initialCustomer?: Customer;
}
