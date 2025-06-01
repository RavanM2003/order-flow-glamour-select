
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, User, Phone, Mail, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const BookingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    appointment_date: '',
    start_time: '',
    notes: '',
    promo_code: ''
  });

  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Mock data
  const services: Service[] = [
    { id: 1, name: 'Saç kəsilməsi və üslublandırma', price: 25, duration: 60 },
    { id: 2, name: 'Makyaj xidməti', price: 35, duration: 45 },
    { id: 3, name: 'Manikür', price: 15, duration: 60 },
    { id: 4, name: 'Pedikür', price: 20, duration: 75 },
    { id: 5, name: 'Qaş dizaynı', price: 10, duration: 30 }
  ];

  const products: Product[] = [
    { id: 1, name: 'Professional Şampun', price: 25 },
    { id: 2, name: 'Saç Maskası', price: 30 },
    { id: 3, name: 'Nail Polish', price: 15 },
    { id: 4, name: 'Moisturizer Krem', price: 40 }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Calculate total
  const calculateTotal = () => {
    const serviceTotal = selectedServices.reduce((sum, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);

    const productTotal = selectedProducts.reduce((sum, productId) => {
      const product = products.find(p => p.id === productId);
      return sum + (product?.price || 0);
    }, 0);

    return serviceTotal + productTotal;
  };

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleProductToggle = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      toast({
        title: "Xəta",
        description: "Ən azı bir xidmət seçməlisiniz",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Calculate end time based on selected services
      const totalDuration = selectedServices.reduce((sum, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return sum + (service?.duration || 0);
      }, 0);

      const [hours, minutes] = formData.start_time.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(startDate.getTime() + totalDuration * 60000);
      const endTime = endDate.toTimeString().slice(0, 5);

      // Mock API call
      const appointmentData = {
        ...formData,
        end_time: endTime,
        total: calculateTotal(),
        selected_services: selectedServices,
        selected_products: selectedProducts,
        status: 'awaiting_confirmation'
      };

      console.log('Creating appointment:', appointmentData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Uğurlu!",
        description: "Rezervasiyanız qeydə alındı. Təsdiq üçün email göndərildi."
      });

      // Navigate to confirmation page
      navigate('/booking-confirmation/123');

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Xəta",
        description: "Rezervasiya yaradarkən xəta baş verdi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervasiya Et</h1>
            <p className="text-gray-600">Asan və sürətli rezervasiya sistemi</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Şəxsi Məlumatlar
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Ad və Soyad *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({...prev, customer_name: e.target.value}))}
                    placeholder="Adınızı daxil edin"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer_phone">Telefon *</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData(prev => ({...prev, customer_phone: e.target.value}))}
                    placeholder="+994501234567"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="customer_email">Email</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData(prev => ({...prev, customer_email: e.target.value}))}
                    placeholder="email@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date and Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tarix və Vaxt
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointment_date">Tarix *</Label>
                  <Input
                    id="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData(prev => ({...prev, appointment_date: e.target.value}))}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="start_time">Vaxt *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({...prev, start_time: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vaxt seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Xidmət Seçimi *</CardTitle>
                <CardDescription>İstədiyiniz xidmətləri seçin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <div key={service.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={`service-${service.id}`} className="text-sm font-medium cursor-pointer">
                          {service.name}
                        </label>
                        <div className="text-xs text-gray-500">
                          {service.price} ₼ • {service.duration} dəqiqə
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Əlavə Məhsullar</CardTitle>
                <CardDescription>İstəyə görə məhsul əlavə edə bilərsiniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductToggle(product.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={`product-${product.id}`} className="text-sm font-medium cursor-pointer">
                          {product.name}
                        </label>
                        <div className="text-xs text-gray-500">
                          {product.price} ₼
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes and Promo */}
            <Card>
              <CardHeader>
                <CardTitle>Əlavə Məlumatlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Qeydlər</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Əlavə qeydləriniz varsa yazın..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="promo_code">Endirim Kodu</Label>
                  <Input
                    id="promo_code"
                    value={formData.promo_code}
                    onChange={(e) => setFormData(prev => ({...prev, promo_code: e.target.value}))}
                    placeholder="Endirim kodunuz varsa daxil edin"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Məbləğ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Ümumi məbləğ:</span>
                  <span className="text-purple-600">{calculateTotal()} ₼</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  * Ödəniş studiyada həyata keçirilir
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit" 
                size="lg" 
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? 'Rezervasiya edilir...' : 'Rezervasiya Et'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
