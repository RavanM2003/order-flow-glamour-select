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
import { Clock, Calendar, Edit, Trash } from 'lucide-react';
import DetailDrawer from '@/components/common/DetailDrawer';

// Bank type
type Bank = {
  id: number;
  name: string;
  iban: string;
  branch?: string;
};

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
  
  // TAX state
  const [tax, setTax] = useState(18);
  const [taxSaved, setTaxSaved] = useState(false);

  // Bank state
  const [banks, setBanks] = useState<Bank[]>([
    { id: 1, name: 'Kapital Bank', iban: 'AZ00XXXX1234567890', branch: 'Bakı' },
    { id: 2, name: 'PAŞA Bank', iban: 'AZ11YYYY9876543210', branch: 'Sumqayıt' },
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Bank | null>(null);
  const [bankForm, setBankForm] = useState<Omit<Bank, 'id'>>({ name: '', iban: '', branch: '' });
  const [formError, setFormError] = useState('');
  
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

  // TAX save handler
  const saveTax = () => {
    setTaxSaved(true);
    setTimeout(() => setTaxSaved(false), 1500);
  };

  // Bank handlers
  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.name || !bankForm.iban) {
      setFormError('Bank adı və IBAN vacibdir');
      return;
    }
    if (editMode && selected) {
      setBanks(banks.map(b => b.id === selected.id ? { ...b, ...bankForm } : b));
      setEditMode(false);
      setSelected(null);
    } else {
      setBanks([{ id: Date.now(), ...bankForm }, ...banks]);
    }
    setDrawerOpen(false);
    setBankForm({ name: '', iban: '', branch: '' });
    setFormError('');
  };
  const handleEdit = (bank: Bank) => {
    setSelected(bank);
    setBankForm({ name: bank.name, iban: bank.iban, branch: bank.branch || '' });
    setEditMode(true);
    setDrawerOpen(true);
  };
  const handleDelete = (id: number) => {
    setBanks(banks.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-8 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 max-w-2xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
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

        <TabsContent value="tax" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-glamour-800">Vergi Sazlamaları</h2>
            <div className="flex items-end gap-4">
              <div>
                <label className="block mb-1 font-medium">Vergi dərəcəsi (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={tax}
                  onChange={e => setTax(Number(e.target.value))}
                  className="w-32 border rounded px-3 py-2"
                />
              </div>
              <Button className="bg-glamour-700 text-white" onClick={saveTax}>Saxla</Button>
              {taxSaved && <span className="text-green-600 font-medium">Yadda saxlanıldı!</span>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="banks" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-glamour-800">Bank Hesabları</h2>
              <Button className="bg-glamour-700 text-white" onClick={() => { setDrawerOpen(true); setEditMode(false); setSelected(null); }}>Bank əlavə et</Button>
            </div>
            <div className="divide-y">
              {banks.length === 0 && <div className="text-gray-500 py-4">Bank hesabı əlavə olunmayıb.</div>}
              {banks.map(b => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                  <div>
                    <div className="font-medium text-glamour-800">{b.name}</div>
                    <div className="text-sm text-gray-600">{b.iban}</div>
                    {b.branch && <div className="text-xs text-gray-400">Filial: {b.branch}</div>}
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(b)} aria-label="Düzəliş et">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(b.id)} aria-label="Sil">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} title={editMode ? 'Bankı Düzəliş et' : 'Bank əlavə et'}>
            <form className="space-y-4 p-2" onSubmit={handleBankSubmit}>
              <div>
                <label className="block mb-1 font-medium">Bank adı <span className="text-red-500">*</span></label>
                <input className="w-full border rounded px-3 py-2" value={bankForm.name} onChange={e => setBankForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">IBAN <span className="text-red-500">*</span></label>
                <input className="w-full border rounded px-3 py-2" value={bankForm.iban} onChange={e => setBankForm(f => ({ ...f, iban: e.target.value }))} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Filial</label>
                <input className="w-full border rounded px-3 py-2" value={bankForm.branch} onChange={e => setBankForm(f => ({ ...f, branch: e.target.value }))} />
              </div>
              {formError && <div className="text-red-600 text-sm">{formError}</div>}
              <Button type="submit" className="bg-glamour-700 text-white w-full">{editMode ? 'Yadda saxla' : 'Əlavə et'}</Button>
            </form>
          </DetailDrawer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
