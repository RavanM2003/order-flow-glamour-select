import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addMonths } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const CustomerInfo = () => {
  const { orderState, updateOrder } = useOrder();
  const [formData, setFormData] = useState({
    name: orderState.customerInfo?.name || '',
    email: orderState.customerInfo?.email || '',
    phone: orderState.customerInfo?.phone || '',
    gender: orderState.customerInfo?.gender || 'female',
    date: orderState.customerInfo?.date || '',
    time: orderState.customerInfo?.time || '',
    notes: orderState.customerInfo?.notes || ''
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    phone: false,
    email: false,
    date: false
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(formData.date ? new Date(formData.date) : undefined);
  
  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00"
  ];
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!formData.name || !formData.phone) {
      setFormErrors({
        name: !formData.name,
        phone: !formData.phone,
        email: false,
        date: false
      });
      return;
    }
    
    updateOrder({
      step: 2,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      }
    });
    
    toast({
      title: "Customer information saved",
      description: "Continue to service selection"
    });
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') });
      setFormErrors({ ...formErrors, date: false });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-base">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 ${formErrors.name ? 'border-red-500' : ''}`}
          />
          {formErrors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <Label htmlFor="phone" className="text-base">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+994 XX XXX XX XX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`mt-1 ${formErrors.phone ? 'border-red-500' : ''}`}
            />
            {formErrors.phone && <p className="text-red-500 text-xs mt-1">Phone number is required</p>}
          </div>
          
          <div>
            <Label htmlFor="email" className="text-base">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base">Gender</Label>
          <div className="grid grid-cols-3 gap-3">
            <div 
              className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors ${formData.gender === 'female' ? 'bg-glamour-50 border-glamour-300' : ''}`}
              onClick={() => setFormData({ ...formData, gender: 'female' })}
            >
              <input type="radio" checked={formData.gender === 'female'} readOnly />
              <span>Female</span>
            </div>
            <div 
              className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors ${formData.gender === 'male' ? 'bg-glamour-50 border-glamour-300' : ''}`}
              onClick={() => setFormData({ ...formData, gender: 'male' })}
            >
              <input type="radio" checked={formData.gender === 'male'} readOnly />
              <span>Male</span>
            </div>
            <div 
              className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors ${formData.gender === 'other' ? 'bg-glamour-50 border-glamour-300' : ''}`}
              onClick={() => setFormData({ ...formData, gender: 'other' })}
            >
              <input type="radio" checked={formData.gender === 'other'} readOnly />
              <span>Other</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base">Appointment Date & Time</Label>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full mt-1 justify-start text-left font-normal ${
                      formErrors.date ? 'border-red-500' : ''
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => handleDateSelect(date)}
                    disabled={(date) => date < new Date() || date > addMonths(new Date(), 3)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.date && <p className="text-red-500 text-xs mt-1">Date is required</p>}
            </div>
            
            <div>
              <Label htmlFor="time">Select Time</Label>
              <Select 
                value={formData.time} 
                onValueChange={(value) => setFormData({ ...formData, time: value })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes" className="text-base">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Special requests or comments"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800 text-white">
          Continue to Services
        </Button>
      </div>
    </form>
  );
};

export default CustomerInfo;
