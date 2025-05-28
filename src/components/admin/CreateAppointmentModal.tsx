
import React, { useState } from 'react';
import { Customer } from '@/models/customer.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BookingDatePicker from '@/components/BookingDatePicker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreateAppointmentModalProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  customer,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    // TODO: Create appointment logic here
    console.log('Creating appointment for:', {
      customer: customer.id,
      date: selectedDate,
      time: selectedTime,
      notes,
    });

    // Reset form
    setSelectedDate(undefined);
    setSelectedTime('');
    setNotes('');
    
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Customer Info - Read Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-600">Customer Name</Label>
              <Input value={customer.name} readOnly className="bg-white" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Email</Label>
              <Input value={customer.email} readOnly className="bg-white" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Phone</Label>
              <Input value={customer.phone} readOnly className="bg-white" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Gender</Label>
              <Input value={customer.gender} readOnly className="bg-white capitalize" />
            </div>
          </div>

          {/* Editable Fields */}
          <div>
            <Label>Appointment Date *</Label>
            <BookingDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              disablePastDates={true}
            />
          </div>

          <div>
            <Label>Appointment Time *</Label>
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
            <Label htmlFor="notes">Appointment Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any notes for this appointment..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentModal;
