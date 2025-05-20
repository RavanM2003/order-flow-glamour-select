
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface DetailDrawerProps {
  children: ReactNode;
  initialCustomer?: any; // For CustomerTab compatibility
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  className?: string;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ 
  children, 
  initialCustomer,
  open, 
  onOpenChange, 
  title, 
  className = '' 
}) => {
  return (
    <div className={`fixed inset-0 z-50 bg-black/50 overflow-hidden ${open ? 'block' : 'hidden'}`}>
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slide-in-right">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
