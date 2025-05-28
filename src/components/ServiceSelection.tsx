
import React, { useState } from 'react';
import { useServices } from '@/hooks/use-services';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Info } from 'lucide-react';
import { Service } from '@/models/service.model';
import DiscountBadge from '@/components/ui/discount-badge';
import PriceDisplay from '@/components/ui/price-display';
import { useLanguage } from '@/context/LanguageContext';
import StaffSelection from './StaffSelection';
import ServiceSearchAndFilter from './ServiceSearchAndFilter';
import { formatDurationMultiLanguage } from '@/utils/validation';

const ServiceSelection = () => {
  const { services, isLoading, error } = useServices();
  const { selectService, unselectService, orderState, addServiceProvider } = useOrder();
  const { t } = useLanguage();
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const [selectedStaff, setSelectedStaff] = useState<Record<number, string>>({});
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedServices = orderState?.selectedServices || [];

  const handleServiceToggle = (service: Service) => {
    if (selectedServices.includes(service.id)) {
      unselectService(service.id);
      setExpandedServices(prev => {
        const newSet = new Set(prev);
        newSet.delete(service.id);
        return newSet;
      });
      setSelectedStaff(prev => {
        const newStaff = { ...prev };
        delete newStaff[service.id];
        return newStaff;
      });
    } else {
      selectService(service.id);
      setExpandedServices(prev => new Set([...prev, service.id]));
    }
  };

  const handleStaffSelect = (serviceId: number, staffId: string, staffName: string) => {
    setSelectedStaff(prev => ({
      ...prev,
      [serviceId]: staffId
    }));
    addServiceProvider(serviceId, staffName);
  };

  const toggleServiceExpansion = (serviceId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const totalDuration = selectedServices.reduce((total, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return total + (service?.duration || 0);
  }, 0);

  if (isLoading) return <div>Loading services...</div>;
  if (error) return <div>Error loading services: {error}</div>;

  return (
    <div className="space-y-4">
      <ServiceSearchAndFilter
        services={services}
        onFilteredServicesChange={setFilteredServices}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {totalDuration > 0 && (
        <div className="bg-glamour-50 p-4 rounded-lg">
          <h3 className="font-medium text-glamour-800 mb-2">{t('booking.totalDuration')}</h3>
          <p className="text-lg font-semibold text-glamour-700">
            {formatDurationMultiLanguage(totalDuration, t)}
          </p>
        </div>
      )}

      {filteredServices.map((service) => {
        const isSelected = selectedServices.includes(service.id);
        const isExpanded = expandedServices.has(service.id);
        
        return (
          <Card 
            key={service.id}
            className={`transition-all ${
              isSelected ? 'border-glamour-700 bg-glamour-50' : 'border-gray-200'
            }`}
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => handleServiceToggle(service)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                    <div className="flex items-center space-x-2">
                      <PriceDisplay 
                        price={service.price} 
                        discount={service.discount}
                        className="text-right"
                      />
                      {service.discount && service.discount > 0 && (
                        <DiscountBadge discount={service.discount} className="relative top-0 right-0" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDurationMultiLanguage(service.duration, t)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => toggleServiceExpansion(service.id, e)}
                      className="text-glamour-700 hover:text-glamour-800"
                    >
                      <Info className="h-4 w-4 mr-1" />
                      {t('booking.moreInfo')}
                    </Button>
                  </div>
                  
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                  )}
                </div>
              </div>
            </div>

            {isSelected && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <StaffSelection
                  serviceId={service.id}
                  onStaffSelect={(staffId, staffName) => handleStaffSelect(service.id, staffId, staffName)}
                  selectedStaffId={selectedStaff[service.id]}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ServiceSelection;
