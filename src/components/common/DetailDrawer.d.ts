
import { ReactNode } from "react";
import { Customer } from "@/models/customer.model";

export interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
  initialCustomer?: Customer;
  position?: 'left' | 'right';
  showCloseButton?: boolean;
  description?: string;
}
