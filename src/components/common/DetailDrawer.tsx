
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface DetailDrawerProps {
  children: ReactNode;
  initialCustomer?: any; // Add this prop to make TypeScript happy
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ children, initialCustomer }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slide-in-right">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
