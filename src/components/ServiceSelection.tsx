
import React from 'react';
import { useOrder } from '@/context/OrderContext';
import { Product } from '@/models/product.model';

// Define the correct props type for internal use
export interface ServiceSelectionProps {
  // Define any props here if needed
}

// Main component with named export
export const ServiceSelection: React.FC<ServiceSelectionProps> = () => {
  const { orderState, addService, removeService, addProduct, setStaff } = useOrder();

  // Component implementation
  return (
    <div>
      {/* Service selection implementation */}
      <h2>Service Selection Component</h2>
      {/* The rest of the component implementation goes here */}
    </div>
  );
};

// Export as default for backward compatibility
export default ServiceSelection;
