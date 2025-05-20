
import { ReactNode } from 'react';
import { Customer } from '@/models/customer.model';

export interface DetailDrawerProps {
  children: ReactNode;
  initialCustomer?: Customer;
  // Add other props as needed for future expansion
}

export default function DetailDrawer(props: DetailDrawerProps): JSX.Element;
