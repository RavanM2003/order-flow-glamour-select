
import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Clock, User } from "lucide-react";

const CustomerInfo = () => {
  const { orderState, updateCustomerInfo, goToStep } = useOrder();
  const [formData, setFormData] = useState({
    name: orderState.customerInfo?.name || '',
    email: orderState.customerInfo?.email || '',
    phone: orderState.customerInfo?.phone || '',
    date: orderState.customerInfo?.date || '',
    time: orderState.customerInfo?.time || '',
    notes: orderState.customerInfo?.notes || '',
    gender: orderState.customerInfo?.gender || 'female'
  });

  // Work hours
  const workHours = {
    start: "09:00",
    end: "19:00"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerInfo(formData);
    goToStep(2);
  };

  // Calculate min and max date (today + 7 days) for date picker
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  // Calculate max date (today + 7 days)
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-glamour-800">Customer Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Gender Selection */}
              <div>
                <Label className="mb-2 block">Gender</Label>
                <RadioGroup 
                  value={formData.gender} 
                  onValueChange={handleGenderChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label htmlFor="gender-female" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-1" />
                      <span>Female</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label htmlFor="gender-male" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-1" />
                      <span>Male</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="gender-other" />
                    <Label htmlFor="gender-other" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-1" />
                      <span>Other</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+994 XX XXX XX XX"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="date" className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Preferred Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={minDate}
                    max={maxDateString}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">You can only book up to 7 days in advance</p>
                </div>
                
                <div>
                  <Label htmlFor="time" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Preferred Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    min={workHours.start}
                    max={workHours.end}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Business hours: {workHours.start} - {workHours.end}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Special Requests or Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any specific requests or information we should know about"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit"
                  className="bg-glamour-700 hover:bg-glamour-800"
                >
                  Continue to Services
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInfo;
