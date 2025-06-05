import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Mail, Phone, CreditCard } from 'lucide-react';
import { SelectedService } from './ServiceSelectionStep';

interface CustomerInfo {
  fullName: string;
  gender: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  note: string;
}

interface BookingSummaryProps {
  customerInfo: CustomerInfo;
  selectedServices: SelectedService[];
  paymentMethod: string;
  onBack: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  customerInfo,
  selectedServices,
  paymentMethod,
  onBack,
  onConfirm,
  loading = false
}) => {
  const totalOriginalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalDiscountedPrice = selectedServices.reduce((sum, service) => sum + service.discountedPrice, 0);
  const totalDiscount = totalOriginalPrice - totalDiscountedPrice;
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} saat ${mins > 0 ? `${mins} dəqiqə` : ''}`;
    }
    return `${mins} dəqiqə`;
  };

  const genderText = {
    male: 'Kişi',
    female: 'Qadın',
    other: 'Digər'
  };

  const paymentMethodText = {
    cash: 'Nağd',
    card: 'Kartla',
    bank: 'Bank köçürməsi'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-glamour-800 mb-2">Rezervasiya Təsdiqi</h2>
        <p className="text-gray-600">Məlumatları yoxlayın və təsdiqləyin</p>
      </div>

      {/* Customer Information */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Müştəri Məlumatları
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tam Ad</p>
            <p className="font-medium">{customerInfo.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cins</p>
            <p className="font-medium">{genderText[customerInfo.gender as keyof typeof genderText]}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefon</p>
            <p className="font-medium flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {customerInfo.phone}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {customerInfo.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tarix</p>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(customerInfo.date).toLocaleDateString('az-AZ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vaxt</p>
            <p className="font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {customerInfo.time}
            </p>
          </div>
          {customerInfo.note && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Qeyd</p>
              <p className="font-medium">{customerInfo.note}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Selected Services */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Seçilən Xidmətlər</h3>
        
        <div className="space-y-4">
          {selectedServices.map((service, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{service.serviceName}</h4>
                  {service.discount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      -{service.discount}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {service.staffName}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {service.duration} dəqiqə
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-glamour-700">
                  {service.discountedPrice.toFixed(2)} AZN
                </div>
                {service.discount > 0 && (
                  <div className="text-gray-400 line-through text-sm">
                    {service.price.toFixed(2)} AZN
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />
        
        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ümumi müddət:</span>
            <span className="font-medium">{formatDuration(totalDuration)}</span>
          </div>
          
          {totalDiscount > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span>Əsas məbləğ:</span>
                <span>{totalOriginalPrice.toFixed(2)} AZN</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Endirim:</span>
                <span>-{totalDiscount.toFixed(2)} AZN</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between text-lg font-semibold text-glamour-800">
            <span>Ümumi məbləğ:</span>
            <span>{totalDiscountedPrice.toFixed(2)} AZN</span>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Ödəniş Növü
        </h3>
        <p className="font-medium">{paymentMethodText[paymentMethod as keyof typeof paymentMethodText]}</p>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Geri
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={loading}
          className="bg-glamour-600 hover:bg-glamour-700"
        >
          {loading ? 'Təsdiqlənir...' : 'Rezervasiyanı Təsdiqlə'}
        </Button>
      </div>
    </div>
  );
};

export default BookingSummary;
