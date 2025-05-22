
import React, { useState, useEffect } from 'react';
import { useServices } from '@/hooks/use-services';
import { useOrder } from "@/context/OrderContext";
import { useStaff } from '@/hooks/use-staff';

const ServiceSelection = () => {
  const { orderState, dispatch } = useOrder();
  const { services, fetchServices, isLoading, error } = useServices();
  const { staff, fetchStaff, isLoading: staffLoading } = useStaff();
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  useEffect(() => {
    fetchServices();
    fetchStaff();
  }, [fetchServices, fetchStaff]);

  const handleServiceSelect = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
      dispatch({
        type: 'ADD_SERVICE',
        payload: {
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration
        }
      });
    }
  };

  const handleStaffSelect = (staffId: string) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStaff.length > 0) {
      dispatch({
        type: 'SELECT_STAFF',
        payload: selectedStaff
      });
    }
    
    dispatch({
      type: 'NEXT_STEP'
    });
  };

  if (isLoading || staffLoading) {
    return <div className="p-4 text-center">Loading services...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading services: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Select a Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
              <div
                key={service.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedServiceId === service.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => handleServiceSelect(service.id as number)}
              >
                <h4 className="font-medium">{service.name}</h4>
                <p className="text-sm text-gray-500 mb-2">Duration: {service.duration} min</p>
                <p className="font-semibold">${service.price}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedServiceId && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Select Staff (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map(staffMember => (
                <div
                  key={staffMember.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedStaff.includes(staffMember.id.toString())
                      ? 'border-purple-500 bg-purple-50'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => handleStaffSelect(staffMember.id.toString())}
                >
                  <h4 className="font-medium">{staffMember.name}</h4>
                  <p className="text-sm text-gray-500">{staffMember.position || 'Staff Member'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!selectedServiceId}
            className={`px-4 py-2 rounded-md ${
              selectedServiceId
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceSelection;
