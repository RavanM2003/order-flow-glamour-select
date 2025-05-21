
import { ReactNode } from 'react';
import { Customer } from '@/models/customer.model';

export interface DetailDrawerProps {
  children: ReactNode;
  initialCustomer?: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  position?: 'right' | 'left';
}
