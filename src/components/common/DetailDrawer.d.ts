
import { ReactNode } from "react";

export interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
  initialCustomer?: any; // Support for CustomersTab.tsx
  position?: 'left' | 'right';
  showCloseButton?: boolean;
  description?: string;
}
