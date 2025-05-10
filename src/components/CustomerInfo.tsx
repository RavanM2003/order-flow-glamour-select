
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const CustomerInfo = () => {
  const { orderState, setCustomerInfo, setDateTime, nextStep } = useOrder();
  const [name, setName] = useState(orderState.customer.name);
  const [email, setEmail] = useState(orderState.customer.email);
  const [phone, setPhone] = useState(orderState.customer.phone);
  const [date, setDate] = useState<Date | undefined>(orderState.selectedDate);
  const [time, setTime] = useState(orderState.selectedTime || "");
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: ''
    };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
      isValid = false;
    }

    if (!date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }

    if (!time) {
      newErrors.time = 'Time is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCustomerInfo(name, email, phone);
      if (date && time) {
        setDateTime(date, time);
      }
      nextStep();
    }
  };

  return (
    <div className="checkout-step space-y-6 pb-12 pt-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-glamour-800">Customer Information</h2>
        <p className="text-muted-foreground">Please provide your details and preferred appointment time.</p>
      </div>

      <Card className="max-w-xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter your phone number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time" className={cn(!time && "text-muted-foreground")}>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-glamour-700 hover:bg-glamour-800">
            Continue to Services
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CustomerInfo;
