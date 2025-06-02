
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';

interface CustomerInfo {
  fullName: string;
  gender: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  note: string;
}

interface CustomerInfoStepProps {
  customerInfo: CustomerInfo;
  onUpdate: (info: CustomerInfo) => void;
  onNext: () => void;
}

const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  customerInfo,
  onUpdate,
  onNext
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.fullName.trim()) newErrors.fullName = 'Ad və soyad tələb olunur';
    if (!customerInfo.gender) newErrors.gender = 'Cins seçin';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Telefon nömrəsi tələb olunur';
    if (!customerInfo.email.trim()) newErrors.email = 'Email tələb olunur';
    if (!customerInfo.date) newErrors.date = 'Tarix seçin';
    if (!customerInfo.time) newErrors.time = 'Vaxt seçin';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-glamour-800 mb-2">Müştəri Məlumatları</h2>
        <p className="text-gray-600">Rezervasiya üçün məlumatlarınızı daxil edin</p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tam Ad */}
          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2" />
              Tam Ad və Soyad
            </label>
            <Input
              value={customerInfo.fullName}
              onChange={(e) => onUpdate({ ...customerInfo, fullName: e.target.value })}
              placeholder="Adınız və soyadınız"
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Cins */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Cins</label>
            <Select value={customerInfo.gender} onValueChange={(value) => onUpdate({ ...customerInfo, gender: value })}>
              <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                <SelectValue placeholder="Cins seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Kişi</SelectItem>
                <SelectItem value="female">Qadın</SelectItem>
                <SelectItem value="other">Digər</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          {/* Telefon */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 mr-2" />
              Telefon
            </label>
            <Input
              value={customerInfo.phone}
              onChange={(e) => onUpdate({ ...customerInfo, phone: e.target.value })}
              placeholder="+994501234567"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </label>
            <Input
              type="email"
              value={customerInfo.email}
              onChange={(e) => onUpdate({ ...customerInfo, email: e.target.value })}
              placeholder="email@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Tarix */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              Tarix
            </label>
            <Input
              type="date"
              value={customerInfo.date}
              onChange={(e) => onUpdate({ ...customerInfo, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Vaxt */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              Vaxt
            </label>
            <Select value={customerInfo.time} onValueChange={(value) => onUpdate({ ...customerInfo, time: value })}>
              <SelectTrigger className={errors.time ? 'border-red-500' : ''}>
                <SelectValue placeholder="Vaxt seçin" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(time => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>

          {/* Qeyd */}
          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              Qeyd (İstəyə görə)
            </label>
            <Textarea
              value={customerInfo.note}
              onChange={(e) => onUpdate({ ...customerInfo, note: e.target.value })}
              placeholder="Əlavə qeydləriniz..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleNext} className="bg-glamour-600 hover:bg-glamour-700">
            Növbəti Addım
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerInfoStep;
