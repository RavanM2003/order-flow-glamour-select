
import { Customer } from "@/models/customer.model";
import { Service } from "@/models/service.model";
import { Staff } from "@/models/staff.model";

export type BookingMode = 'salon' | 'home' | 'customer';

export interface Product {
  id: number;
  name: string;
  price?: number;
  description?: string;
  image?: string;
  quantity?: number;
}

export interface OrderState {
  currentStep: number;
  bookingMode: BookingMode;
  customer: Customer;
  selectedService: Service | null;
  selectedStaff: Staff | null;
  selectedProducts: Product[];
  selectedServices: string[]; // Changed from number[] to string[]
  appointmentDate: Date | null;
  appointmentTime: string | null;
  totalAmount: number;
  paymentMethod: string | null;
  serviceProviders: Array<{
    serviceId: string; // Changed from number to string
    name: string;
  }> | null;
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
  setNextStep: () => void;
  setPrevStep: () => void;
  goToStep: (step: number) => void;
  resetOrder: () => void;
  setPaymentMethod: (method: string | null) => void;
  completeOrder: (id: string) => void;
  addServiceProvider: (serviceId: string, staffName: string) => void; // Changed from number to string
  selectService: (serviceId: string) => void; // Changed from number to string
  unselectService: (serviceId: string) => void; // Changed from number to string
  setBookingMode: (mode: BookingMode) => void;
  calculateTotal: () => number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void; // Changed from number to string
  setStaff: (staff: Staff | null) => void;
  order?: Order;
}

export interface Order {
  id?: string;
  customer_id?: string;
  staff_id?: string;
  services: Service[];
  appointment_date?: string;
  appointment_time?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  payment_status?: 'unpaid' | 'paid' | 'partial';
  payment_method?: 'cash' | 'card' | 'transfer';
}

export { Service, Staff };
