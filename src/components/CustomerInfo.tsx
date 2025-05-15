
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserCircle, CalendarIcon, Clock } from 'lucide-react';

const BusinessHours = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

const CustomerInfo = () => {
  const { orderState, updateCustomerInfo, goToStep } = useOrder();
  
  // Initialize form state from orderState if available
  const [formData, setFormData] = useState({
    name: orderState.customerInfo?.name || '',
    email: orderState.customerInfo?.email || '',
    phone: orderState.customerInfo?.phone || '',
    gender: orderState.customerInfo?.gender || 'female',
    date: orderState.customerInfo?.date || '',
    time: orderState.customerInfo?.time || '',
    notes: orderState.customerInfo?.notes || '',
  });
  
  // For calendar
  const [date, setDate] = useState<Date | undefined>(
    formData.date ? new Date(formData.date) : undefined
  );
  
  // Update date in form when calendar date changes
  useEffect(() => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd')
      }));
    }
  }, [date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerInfo(formData);
    goToStep(2);
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0; // Sunday is disabled, Saturday (6) is enabled
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-glamour-800">Customer Information</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            required
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <Label>Gender</Label>
          <RadioGroup 
            value={formData.gender} 
            onValueChange={(value) => setFormData({...formData, gender: value})}
            className="grid grid-cols-3 gap-4 mt-1"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="flex items-center cursor-pointer flex-1">
                <UserCircle className="h-5 w-5 mr-2 text-pink-500" />
                <span>Female</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="flex items-center cursor-pointer flex-1">
                <UserCircle className="h-5 w-5 mr-2 text-blue-500" />
                <span>Male</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-glamour-50 transition-colors">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="flex items-center cursor-pointer flex-1">
                <UserCircle className="h-5 w-5 mr-2 text-gray-500" />
                <span>Other</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              required
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => 
                    date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                    isWeekend(date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label>Appointment Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.time && "text-muted-foreground"
                  )}
                  disabled={!date}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {formData.time || <span>Select a time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0">
                <div className="p-2 grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {BusinessHours.map((time) => (
                    <Button
                      key={time}
                      variant={formData.time === time ? "default" : "outline"}
                      className={cn(
                        formData.time === time && "bg-glamour-700 text-white",
                        "h-8"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTimeSelect(time);
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requirements or information we should know?"
            className="h-24"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-glamour-700 hover:bg-glamour-800 text-white"
        disabled={!formData.name || !formData.phone || !formData.date || !formData.time}
      >
        Continue to Services
      </Button>
    </form>
  );
};

export default CustomerInfo;
