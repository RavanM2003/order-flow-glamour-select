
import { ReactNode } from 'react';
import { Customer } from '@/models/customer.model';

export interface OrderProviderProps {
  children: ReactNode;
  initialCustomer?: Customer | null;
}
