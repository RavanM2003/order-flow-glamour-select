
import { ReactNode } from 'react';

export interface DetailDrawerProps {
  children: ReactNode;
  initialCustomer?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  className?: string;
  position?: 'left' | 'right';
  showCloseButton?: boolean;
  description?: string;
}
