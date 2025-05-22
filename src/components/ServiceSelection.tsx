import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/context/OrderContext';
import { Service as ServiceType } from '@/models/service.model';
import { Staff } from '@/models/staff.model';
import { useQuery } from '@tanstack/react-query';
import { serviceService } from '@/services/service.service';
import { staffService } from '@/services/staff.service';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceSelection = () => {
  const { 
    orderState, 
    setSelectedService, 
    setSelectedStaff,
    selectService,
    unselectService,
    setStaff,
    nextStep
  } = useOrder();

  const [services, setServices] = useState<ServiceType[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getServices();
        if (response.data) {
          setServices(response.data);
        }
      } catch (error) {
        setError('Failed to load services');
        console.error(error);
      }
    };

    const fetchStaff = async () => {
      try {
        const response = await staffService.getStaffMembers();
        if (response.data) {
          setStaffMembers(response.data);
        }
      } catch (error) {
        setError('Failed to load staff');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    fetchStaff();
  }, []);

  const handleSelectService = (service: ServiceType) => {
    setSelectedService(service);
    selectService(service.id);
  };

  const handleUnselectService = (serviceId: number) => {
    unselectService(serviceId);
  };

  const handleSelectStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setStaff(staff);
  };

  const isServiceSelected = (serviceId: number) => {
    if (orderState.selectedService?.id === serviceId) return true;
    return orderState.selectedServices.includes(serviceId);
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Xidmət seçin</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-5">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Xidmət seçin</h2>

      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`border rounded-lg p-5 ${isServiceSelected(service.id) ? 'bg-blue-50 border-blue-300' : 'hover:border-blue-200'}`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold">{service.name}</h3>
                <div className="text-sm text-gray-600">
                  <span>{service.duration} dəq</span>
                  <span className="mx-2">•</span>
                  <span>{service.price} AZN</span>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
              <Button 
                variant={isServiceSelected(service.id) ? "destructive" : "outline"} 
                size="sm"
                onClick={() => isServiceSelected(service.id) 
                  ? handleUnselectService(service.id) 
                  : handleSelectService(service)
                }
              >
                {isServiceSelected(service.id) ? 'Ləğv et' : 'Seç'}
              </Button>
            </div>

            {isServiceSelected(service.id) && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-2 text-sm font-medium">Əməkdaş seçin:</div>
                <div className="flex flex-wrap gap-2">
                  {staffMembers.map((staff) => (
                    <Button 
                      key={staff.id} 
                      variant={orderState.selectedStaff?.id === staff.id ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleSelectStaff(staff)}
                    >
                      {staff.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          disabled={!orderState.selectedService && orderState.selectedServices.length === 0}
          onClick={nextStep}
          className="mt-4"
        >
          Növbəti
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;
