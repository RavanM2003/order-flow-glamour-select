
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Separator,
  Switch,
} from '@/components/ui/index';
import { Clock, Calendar } from 'lucide-react';

const SettingsTab = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [maxBookingDays, setMaxBookingDays] = useState("7");
  
  const [companyInfo, setCompanyInfo] = useState({
    name: "Glamour Studio",
    email: "info@glamourstudio.az",
    phone: "+994 50 123 4567",
    address: "123 Beauty Street, Baku, Azerbaijan",
    description: "Providing premium beauty services since 2020. We're dedicated to enhancing your natural beauty and building your confidence."
  });
  
  const [workingHours, setWorkingHours] = useState({
    monday: { open: true, start: "09:00", end: "19:00" },
    tuesday: { open: true, start: "09:00", end: "19:00" },
    wednesday: { open: true, start: "09:00", end: "19:00" },
    thursday: { open: true, start: "09:00", end: "19:00" },
    friday: { open: true, start: "09:00", end: "19:00" },
    saturday: { open: true, start: "10:00", end: "18:00" },
    sunday: { open: false, start: "10:00", end: "16:00" }
  });
  
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleWorkingHoursChange = (day: string, field: 'open' | 'start' | 'end', value: boolean | string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof workingHours],
        [field]: value
      }
    }));
  };
  
  const handleSaveGeneral = () => {
    toast({
      title: "Settings Saved",
      description: "Your company information has been updated successfully.",
    });
  };
  
  const handleSaveHours = () => {
    toast({
      title: "Working Hours Saved",
      description: "Your business hours have been updated successfully.",
    });
  };
  
  const handleSaveBooking = () => {
    toast({
      title: "Booking Settings Saved",
      description: "Your booking configuration has been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details that will be displayed on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={companyInfo.name}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email"
                      value={companyInfo.email}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={companyInfo.phone}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address"
                    value={companyInfo.address}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={companyInfo.description}
                    onChange={handleCompanyInfoChange}
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="button" 
                  className="bg-glamour-700 hover:bg-glamour-800"
                  onClick={handleSaveGeneral}
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hours" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Working Hours
              </CardTitle>
              <CardDescription>
                Set your business hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                {Object.entries(workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="w-1/4">
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={hours.open}
                        onCheckedChange={(checked) => 
                          handleWorkingHoursChange(day, 'open', checked)
                        }
                      />
                      <span className="text-sm">{hours.open ? 'Open' : 'Closed'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="time"
                        value={hours.start}
                        onChange={(e) => 
                          handleWorkingHoursChange(day, 'start', e.target.value)
                        }
                        disabled={!hours.open}
                        className="w-32"
                      />
                      <span className="text-sm">to</span>
                      <Input 
                        type="time"
                        value={hours.end}
                        onChange={(e) => 
                          handleWorkingHoursChange(day, 'end', e.target.value)
                        }
                        disabled={!hours.open}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <Button 
                  type="button" 
                  className="bg-glamour-700 hover:bg-glamour-800"
                  onClick={handleSaveHours}
                >
                  Save Hours
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="booking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Booking Settings
              </CardTitle>
              <CardDescription>
                Configure how far in advance customers can book appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="maxBookingDays">Maximum Booking Days in Advance</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="maxBookingDays" 
                      name="maxBookingDays"
                      value={maxBookingDays}
                      onChange={(e) => setMaxBookingDays(e.target.value)}
                      className="w-20"
                      type="number"
                      min="1"
                      max="90"
                    />
                    <span className="text-sm">days</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customers will be able to book appointments up to {maxBookingDays} days in advance.
                  </p>
                </div>
                
                <Button 
                  type="button" 
                  className="bg-glamour-700 hover:bg-glamour-800"
                  onClick={handleSaveBooking}
                >
                  Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
