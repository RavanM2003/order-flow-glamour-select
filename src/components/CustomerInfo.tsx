
import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GenderSelector from '@/components/GenderSelector';
import BookingDatePicker from '@/components/BookingDatePicker';
import { useLanguage } from '@/context/LanguageContext';

const CustomerInfo = () => {
  const { t } = useLanguage();
  const { orderState, setCustomer, setAppointmentDate, setAppointmentTime, setNextStep } = useOrder();
  
  const [formData, setFormData] = useState({
    name: orderState.customer?.name || '',
    email: orderState.customer?.email || '',
    phone: orderState.customer?.phone || '',
    gender: orderState.customer?.gender || 'female',
    appointmentNotes: orderState.customer?.notes || '' // This will be saved to appointments.notes
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    orderState.appointmentDate || undefined
  );
  const [selectedTime, setSelectedTime] = useState(orderState.appointmentTime || '');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Validate that the date is not in the past
      if (date < today) {
        return; // Don't set past dates
      }
    }
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !selectedDate || !selectedTime) {
      alert(t('booking.fillAllFields'));
      return;
    }

    // Validate that selected services have available staff
    if (orderState.selectedServices && orderState.selectedServices.length > 0) {
      const servicesWithoutStaff = orderState.selectedServices.filter(serviceId => {
        const serviceProvider = orderState.serviceProviders?.find(sp => sp.serviceId === serviceId);
        return !serviceProvider;
      });

      if (servicesWithoutStaff.length > 0) {
        alert(t('booking.selectStaffForAllServices'));
        return;
      }
    }

    setCustomer({
      id: '',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender as 'male' | 'female' | 'other',
      lastVisit: '',
      totalSpent: 0,
      notes: formData.appointmentNotes // Store notes for appointment
    });
    
    setAppointmentDate(selectedDate);
    setAppointmentTime(selectedTime);
    setNextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">{t('booking.fullName')} *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder={t('booking.enterFullName')}
        />
      </div>

      <div>
        <Label htmlFor="email">{t('booking.email')} *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder={t('booking.enterEmail')}
        />
      </div>

      <div>
        <Label htmlFor="phone">{t('booking.phone')} *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder={t('booking.enterPhone')}
        />
      </div>

      <div>
        <Label>{t('booking.gender')} *</Label>
        <GenderSelector
          selectedGender={formData.gender}
          onGenderSelect={(value) => handleInputChange('gender', value)}
        />
      </div>

      <div>
        <Label>{t('booking.date')} *</Label>
        <BookingDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          disablePastDates={true}
        />
      </div>

      <div>
        <Label>{t('booking.time')} *</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="appointmentNotes">{t('booking.notes')}</Label>
        <Textarea
          id="appointmentNotes"
          value={formData.appointmentNotes}
          onChange={(e) => handleInputChange('appointmentNotes', e.target.value)}
          placeholder={t('booking.enterNotes')}
          rows={3}
        />
      </div>

      <Button onClick={handleSubmit} className="w-full">
        {t('booking.continue')}
      </Button>
    </div>
  );
};

export default CustomerInfo;
