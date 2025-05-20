
import { ReactNode } from 'react';
import { Customer } from '@/models/customer.model';

export interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  position?: 'right' | 'left';
  initialCustomer?: Customer;
}
