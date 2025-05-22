
import React, { useContext } from 'react';
import { useServices } from '@/hooks/use-services';
import { OrderContext } from '@/context/OrderContext';
import { useOrder } from '@/context/OrderContext';

const ServiceSelection = () => {
  const { services, isLoading, error } = useServices();
  const { selectedService, selectService } = useOrder();

  const handleServiceSelect = (serviceId: number) => {
    selectService(serviceId);
  };

  if (isLoading) return <div>Loading services...</div>;
  if (error) return <div>Error loading services: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div 
          key={service.id}
          className={`p-4 border rounded-lg cursor-pointer ${
            selectedService === service.id ? 'bg-primary text-primary-foreground' : 'bg-card'
          }`}
          onClick={() => handleServiceSelect(service.id)}
        >
          <h3 className="text-lg font-medium">{service.name}</h3>
          <p>{service.description}</p>
          <div className="flex justify-between mt-2">
            <span>${service.price.toFixed(2)}</span>
            <span>{service.duration} min</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceSelection;
