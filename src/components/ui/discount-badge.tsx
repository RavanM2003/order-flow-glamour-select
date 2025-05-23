
import React from 'react';
import { cn } from '@/lib/utils';

interface DiscountBadgeProps {
  discount: number;
  className?: string;
}

const DiscountBadge: React.FC<DiscountBadgeProps> = ({ discount, className }) => {
  if (!discount || discount <= 0) return null;

  return (
    <div className={cn(
      "absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10",
      className
    )}>
      -{discount}% ENDIRIM
    </div>
  );
};

export default DiscountBadge;
