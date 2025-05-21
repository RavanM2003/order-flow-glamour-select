
import { ReactNode } from 'react';

export interface DetailDrawerProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  className?: string;
  position?: 'left' | 'right';
  showCloseButton?: boolean;
  description?: string;
  initialCustomer?: any;
}
