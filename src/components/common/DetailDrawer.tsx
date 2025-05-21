
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Customer } from '@/models/customer.model';
import { DetailDrawerProps } from './DetailDrawer.d';

const DetailDrawer: React.FC<DetailDrawerProps> = ({ 
  children, 
  initialCustomer,
  open, 
  onOpenChange, 
  title, 
  className = '',
  position = 'right',
  showCloseButton = true,
  description
}) => {
  return (
    <div className={`fixed inset-0 z-50 bg-black/50 overflow-hidden ${open ? 'block' : 'hidden'}`}>
      <div className={`absolute inset-y-0 ${position === 'right' ? 'right-0' : 'left-0'} w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slide-in-${position}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          {showCloseButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange && onOpenChange(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
