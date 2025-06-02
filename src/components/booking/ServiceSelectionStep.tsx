
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  discount: number;
}

interface Staff {
  id: string;
  full_name: string;
  position: string;
}

interface SelectedService {
  serviceId: number;
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
  const [staffByService, setStaffByService] = useState<Record<number, Staff[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data: servicesData, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffForService = async (serviceId: number) => {
    if (staffByService[serviceId]) return;

    try {
      const { data: staffData, error } = await supabase
        .rpc('get_staff_by_service', { service_id: serviceId });

      if (error) throw error;

      // Also check availability for the selected date
      const selectedDateObj = new Date(selectedDate);
      const weekday = selectedDateObj.getDay();

      const { data: availableStaff, error: availError } = await supabase
        .from('staff_availability')
        .select(`
          staff_user_id,
          users!inner(id, full_name)
        `)
        .eq('weekday', weekday)
        .in('staff_user_id', staffData?.map((s: any) => s.user_id) || []);

      if (availError) throw availError;

      const mappedStaff = availableStaff?.map((s: any) => ({
        id: s.staff_user_id,
        full_name: s.users.full_name,
        position: 'Ustad'
      })) || [];

      setStaffByService(prev => ({
        ...prev,
        [serviceId]: mappedStaff
      }));
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaffByService(prev => ({
        ...prev,
        [serviceId]: []
      }));
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  const handleServiceSelect = async (service: Service) => {
    await fetchStaffForService(service.id);
    
    const isSelected = selectedServices.some(s => s.serviceId === service.id);
    if (isSelected) {
      // Remove service
      onUpdate(selectedServices.filter(s => s.serviceId !== service.id));
    }
  };

  const handleStaffSelect = (service: Service, staff: Staff) => {
    const discountedPrice = calculateDiscountedPrice(service.price, service.discount || 0);
    
    const newService: SelectedService = {
      serviceId: service.id,
      serviceName: service.name,
      staffId: staff.id,
      staffName: staff.full_name,
      duration: service.duration,
      price: service.price,
      discount: service.discount || 0,
      discountedPrice
    };

    const updated = selectedServices.filter(s => s.serviceId !== service.id);
    onUpdate([...updated, newService]);
  };

  const isServiceSelected = (serviceId: number) => {
    return selectedServices.some(s => s.serviceId === serviceId);
  };

  const getSelectedStaff = (serviceId: number) => {
    return selectedServices.find(s => s.serviceId === serviceId);
  };

  if (loading) {
    return <div className="text-center py-8">Xidmətlər yüklənir...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-glamour-800 mb-2">Xidmət Seçimi</h2>
        <p className="text-gray-600">İstədiyiniz xidmətləri və işçini seçin</p>
      </div>

      <div className="grid gap-4">
        {services.map(service => {
          const isSelected = isServiceSelected(service.id);
          const selectedStaff = getSelectedStaff(service.id);
          const availableStaff = staffByService[service.id] || [];
          
          return (
            <Card key={service.id} className={`p-4 transition-all ${isSelected ? 'ring-2 ring-glamour-500' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {isSelected && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                  
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
                  </div>
                  
                  {availableStaff.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableStaff.map(staff => (
                        <Button
                          key={staff.id}
                          onClick={() => handleStaffSelect(service, staff)}
                          variant={selectedStaff?.staffId === staff.id ? "default" : "outline"}
                          size="sm"
                          className="justify-start"
                        >
                          {staff.full_name}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-600 text-sm">Bu tarix üçün uyğun işçi yoxdur</p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Geri
        </Button>
        <Button 
          onClick={onNext} 
          disabled={selectedServices.length === 0}
          className="bg-glamour-600 hover:bg-glamour-700"
        >
          Növbəti Addım
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
