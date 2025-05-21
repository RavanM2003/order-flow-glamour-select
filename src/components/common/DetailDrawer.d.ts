
import { ReactNode } from "react";

export interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
  initialCustomer?: any; // Add this property to fix the CustomersTab.tsx error
}
