import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStaffByService } from '@/hooks/use-staff-by-service';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  discount: number;
}

export interface SelectedService {
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  duration: number;
  price: number;
  discount: number;
  discountedPrice: number;
}

interface ServiceSelectionStepProps {
  selectedDate: string;
  selectedServices: SelectedService[];
  onUpdate: (services: SelectedService[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  selectedDate,
  selectedServices,
  onUpdate,
  onNext,
  onBack
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchStaffByService, getStaffForService } = useStaffByService();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const { data: servicesData, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      console.log('Services fetched:', servicesData);
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  const handleServiceSelect = async (service: Service) => {
    console.log('Service selected:', service);
    
    const isSelected = selectedServices.some(s => s.serviceId === service.id);
    if (isSelected) {
      // Remove service
      const updated = selectedServices.filter(s => s.serviceId !== service.id);
      onUpdate(updated);
      console.log('Service removed, updated services:', updated);
    } else {
      // Add service and fetch staff
      const date = selectedDate ? new Date(selectedDate) : undefined;
      await fetchStaffByService(service.id, date);
    }
  };

  const handleStaffSelect = (service: Service, staffId: string, staffName: string) => {
    console.log('Staff selected:', { staffId, staffName }, 'for service:', service);
    
    const discountedPrice = calculateDiscountedPrice(service.price, service.discount || 0);
    
    const newService: SelectedService = {
      serviceId: service.id,
      serviceName: service.name,
      staffId: staffId,
      staffName: staffName,
      duration: service.duration,
      price: service.price,
      discount: service.discount || 0,
      discountedPrice
    };

    const updated = selectedServices.filter(s => s.serviceId !== service.id);
    const finalUpdated = [...updated, newService];
    onUpdate(finalUpdated);
    console.log('Staff selected, updated services:', finalUpdated);
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(s => s.serviceId === serviceId);
  };

  const getSelectedStaff = (serviceId: string) => {
    return selectedServices.find(s => s.serviceId === serviceId);
  };

  const isReadyForNext = () => {
    return selectedServices.length > 0 && 
           selectedServices.every(service => service.staffId && service.staffName);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Xidmətlər yüklənir...</div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-gray-600">Heç bir xidmət tapılmadı</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-glamour-800 mb-2">Xidmət Seçimi</h2>
        <p className="text-gray-600">İstədiyiniz xidmətləri və işçini seçin</p>
        {selectedDate && (
          <p className="text-sm text-gray-500 mt-1">
            Seçilən tarix: {new Date(selectedDate).toLocaleDateString('az-AZ')}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {services.map(service => {
          const isSelected = isServiceSelected(service.id);
          const selectedStaff = getSelectedStaff(service.id);
          const { staff: availableStaff, loading: isStaffLoading, error: staffError } = getStaffForService(service.id);
          
          return (
            <Card key={service.id} className={`p-4 transition-all ${isSelected ? 'ring-2 ring-glamour-500' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {isSelected && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration} dəqiqə
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {service.discount > 0 ? (
                    <div>
                      <div className="text-red-500 font-semibold">
                        {calculateDiscountedPrice(service.price, service.discount).toFixed(2)} AZN
                      </div>
                      <div className="text-gray-400 line-through text-sm">
                        {service.price.toFixed(2)} AZN
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        -{service.discount}%
                      </Badge>
                    </div>
                  ) : (
                    <div className="font-semibold">{service.price.toFixed(2)} AZN</div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <Button
                  onClick={() => handleServiceSelect(service)}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={isSelected ? "bg-glamour-600 hover:bg-glamour-700" : ""}
                >
                  {isSelected ? 'Seçildi' : 'Seç'}
                </Button>
              </div>

              {/* Staff Selection */}
              {isSelected && (
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">İşçi seçin:</span>
                    {selectedStaff && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedStaff.staffName} seçildi
                      </Badge>
                    )}
                  </div>
                  
                  {isStaffLoading ? (
                    <div className="text-sm text-gray-500">İşçilər yüklənir...</div>
                  ) : staffError ? (
                    <div className="text-sm text-red-600">Xəta: {staffError}</div>
                  ) : availableStaff.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableStaff.map(staff => (
                        <Button
                          key={staff.id}
                          onClick={() => handleStaffSelect(service, staff.id, staff.full_name || staff.name || 'Unknown')}
                          variant={selectedStaff?.staffId === staff.id ? "default" : "outline"}
                          size="sm"
                          className={`justify-start ${
                            selectedStaff?.staffId === staff.id 
                              ? "bg-glamour-600 hover:bg-glamour-700" 
                              : ""
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium">{staff.full_name || staff.name}</div>
                            {staff.position && (
                              <div className="text-xs opacity-75">{staff.position}</div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-600 text-sm">
                      {selectedDate 
                        ? "Bu tarix üçün uyğun işçi yoxdur" 
                        : "Bu xidmət üçün işçi tapılmadı"
                      }
                    </p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <Card className="p-4 bg-glamour-50">
          <h3 className="font-semibold mb-3">Seçilən Xidmətlər:</h3>
          <div className="space-y-2">
            {selectedServices.map((service, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">{service.serviceName}</span>
                  <span className="text-gray-600 ml-2">- {service.staffName}</span>
                </div>
                <span className="font-semibold text-glamour-700">
                  {service.discountedPrice.toFixed(2)} AZN
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-2">
            <div className="flex justify-between font-bold text-glamour-800">
              <span>Cəmi:</span>
              <span>{selectedServices.reduce((total, service) => total + service.discountedPrice, 0).toFixed(2)} AZN</span>
            </div>
          </div>
        </Card>
      )}

      {/* Validation Messages */}
      {selectedServices.length > 0 && !isReadyForNext() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-yellow-800 text-sm">
            Bütün seçilmiş xidmətlər üçün işçi seçilməlidir
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Geri
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isReadyForNext()}
          className="bg-glamour-600 hover:bg-glamour-700"
        >
          Növbəti Addım ({selectedServices.length} xidmət seçildi)
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
