
import React from 'react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  discount?: number;
  className?: string;
  showCurrency?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  discount, 
  className,
  showCurrency = true 
}) => {
  const hasDiscount = discount && discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;

  if (!hasDiscount) {
    return (
      <div className={cn("flex flex-col items-start", className)}>
        <span className="font-semibold text-glamour-700">
          {price.toFixed(2)} {showCurrency ? 'AZN' : ''}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-end", className)}>
      <span className="text-sm text-gray-500 line-through">
        {price.toFixed(2)} {showCurrency ? 'AZN' : ''}
      </span>
      <span className="font-semibold text-red-600">
        {discountedPrice.toFixed(2)} {showCurrency ? 'AZN' : ''}
      </span>
    </div>
  );
};

export default PriceDisplay;
