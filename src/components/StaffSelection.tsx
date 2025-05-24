
import React, { useEffect } from 'react';
import { useStaffByService } from '@/hooks/use-staff-by-service';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface StaffSelectionProps {
  serviceId: number;
  onStaffSelect: (staffId: string, staffName: string) => void;
  selectedStaffId?: string;
}

const StaffSelection: React.FC<StaffSelectionProps> = ({ 
  serviceId, 
  onStaffSelect, 
  selectedStaffId 
}) => {
  const { staff, loading, error, fetchStaffByService } = useStaffByService();
  const { orderState } = useOrder();
  const { t } = useLanguage();

  useEffect(() => {
    if (serviceId && orderState.appointmentDate) {
      console.log('Fetching staff for service:', serviceId, 'date:', orderState.appointmentDate);
      fetchStaffByService(serviceId, orderState.appointmentDate);
    }
  }, [serviceId, orderState.appointmentDate, fetchStaffByService]);

  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">{t('booking.selectStaff')}</p>
        <div className="grid grid-cols-1 gap-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">{t('booking.selectStaff')}</p>
        <p className="text-sm text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!staff || staff.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">{t('booking.selectStaff')}</p>
        <p className="text-sm text-gray-500">No staff available for this service</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">{t('booking.selectStaff')}</p>
      <div className="grid grid-cols-1 gap-2">
        {staff.map((staffMember) => (
          <Card 
            key={staffMember.id}
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedStaffId === staffMember.id 
                ? 'border-glamour-700 bg-glamour-50' 
                : 'border-gray-200'
            }`}
            onClick={() => onStaffSelect(staffMember.id, staffMember.full_name || staffMember.name || '')}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-glamour-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {staffMember.full_name || staffMember.name}
                </p>
                {staffMember.position && (
                  <p className="text-xs text-gray-500">{staffMember.position}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffSelection;
