import { Customer } from "@/models/customer.model";
import { Service } from "@/models/service.model";
import { Staff } from "@/models/staff.model";

export interface OrderContextType {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  selectedService: Service | null;
  setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
  selectedStaff: Staff | null;
  setSelectedStaff: React.Dispatch<React.SetStateAction<Staff | null>>;
  selectedTime: { date: Date; time: string } | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<{ date: Date; time: string } | null>>;
  selectedCustomer: Customer | null;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  addService: (service: Service) => void;
  removeService: (serviceId: number) => void;
  clearOrder: () => void;
  calculateTotal: () => number;
  isOrderValid: () => boolean;
  submitOrder: () => Promise<boolean>;
  isSubmitting: boolean;
  orderError: string | null;
  orderSuccess: boolean;
  resetOrderStatus: () => void;
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
