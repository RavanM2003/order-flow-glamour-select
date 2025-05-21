
import { ReactNode } from 'react';
import { Customer } from '@/models/customer.model';

export interface DetailDrawerProps {
  children: ReactNode;
  initialCustomer?: Customer;
}
