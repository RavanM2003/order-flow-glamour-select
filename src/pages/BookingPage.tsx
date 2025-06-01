
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, User, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { az } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface BookingForm {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_note?: string;
  services: number[];
  products: { id: number; quantity: number }[];
  appointment_date?: Date;
  appointment_time: string;
  promo_code?: string;
}

const BookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BookingForm>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_note: '',
    services: [],
    products: [],
    appointment_time: '',
    promo_code: ''
  });
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xidmətləri yüklə
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Məhsulları yüklə
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Məcmu məbləği hesabla
  React.useEffect(() => {
    let serviceTotal = 0;
    let productTotal = 0;

    // Xidmət qiymətləri
    formData.services.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        serviceTotal += service.price - (service.discount || 0);
      }
    });

    // Məhsul qiymətləri
    formData.products.forEach(productItem => {
      const product = products.find(p => p.id === productItem.id);
      if (product) {
        const price = product.price - (product.discount || 0);
        productTotal += price * productItem.quantity;
      }
    });

    const subtotal = serviceTotal + productTotal;
    const finalTotal = subtotal - discount;
    setTotal(Math.max(0, finalTotal));
  }, [formData.services, formData.products, services, products, discount]);

  const handleServiceToggle = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleProductQuantityChange = (productId: number, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      products: quantity > 0
        ? prev.products.some(p => p.id === productId)
          ? prev.products.map(p => p.id === productId ? { ...p, quantity } : p)
          : [...prev.products, { id: productId, quantity }]
        : prev.products.filter(p => p.id !== productId)
    }));
  };

  const checkPromoCode = async () => {
    if (!formData.promo_code) return;

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', formData.promo_code)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Endirim kodu tapılmadı",
          description: "Daxil etdiyiniz endirim kodu mövcud deyil və ya vaxtı keçib."
        });
        return;
      }

      const discountAmount = (total * data.discount_percent) / 100;
      setDiscount(discountAmount);
      
      toast({
        title: "Endirim tətbiq edildi",
        description: `${data.discount_percent}% endirim (${discountAmount} ₼)`
      });
    } catch (error) {
      console.error('Promo code check error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      toast({
        variant: "destructive",
        title: "Məlumatları doldurun",
        description: "Zəhmət olmasa, bütün məcburi sahələri doldurun."
      });
      return;
    }

    if (formData.services.length === 0) {
      toast({
        variant: "destructive",
        title: "Xidmət seçin",
        description: "Ən azı bir xidmət seçməlisiniz."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Müştəri yaradılması və ya tapılması
      let customerId;
      const { data: existingCustomer } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.customer_email)
        .eq('phone', formData.customer_phone)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('users')
          .insert({
            full_name: formData.customer_name,
            email: formData.customer_email,
            phone: formData.customer_phone,
            note: formData.customer_note,
            role: 'customer',
            hashed_password: 'temporary' // Müştərilər üçün müvəqqəti
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Rezervasiya yaradılması
      const confirmationToken = Math.random().toString(36).substring(2, 15);
      
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_user_id: customerId,
          appointment_date: formData.appointment_date,
          start_time: formData.appointment_time,
          end_time: formData.appointment_time, // Bu sonradan hesablanacaq
          total: total,
          status: 'awaiting_confirmation',
          promo_code: formData.promo_code,
          discount_amount: discount,
          confirmation_token: confirmationToken,
          notes: formData.customer_note
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Xidmətləri əlavə et
      for (const serviceId of formData.services) {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          await supabase
            .from('appointment_services')
            .insert({
              appointment_id: appointment.id,
              service_id: serviceId,
              duration: service.duration,
              price: service.price - (service.discount || 0)
            });
        }
      }

      // Məhsulları əlavə et
      for (const productItem of formData.products) {
        const product = products.find(p => p.id === productItem.id);
        if (product) {
          await supabase
            .from('appointment_products')
            .insert({
              appointment_id: appointment.id,
              product_id: productItem.id,
              quantity: productItem.quantity,
              price: product.price - (product.discount || 0),
              amount: (product.price - (product.discount || 0)) * productItem.quantity
            });
        }
      }

      toast({
        title: "Rezervasiya təsdiqləndi!",
        description: "Email vasitəsilə təsdiqləmə göndəriləcək."
      });

      // Təsdiqləmə səhifəsinə yönləndir
      navigate(`/booking-confirmation/${appointment.id}?token=${confirmationToken}`);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Rezervasiya zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervasiya</h1>
            <p className="text-gray-600">Gözəllik xidmətlərimizə rezervasiya edin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Müştəri məlumatları */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Müştəri məlumatları
                </CardTitle>
                <CardDescription>
                  Əlaqə məlumatlarınızı daxil edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Ad Soyad *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                      placeholder="Adınız və soyadınız"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Telefon *</Label>
                    <Input
                      id="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                      placeholder="+994 XX XXX XX XX"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customer_email">Email *</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer_note">Qeyd</Label>
                  <Textarea
                    id="customer_note"
                    value={formData.customer_note}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_note: e.target.value }))}
                    placeholder="Əlavə məlumatlar..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Xidmət seçimi */}
            <Card>
              <CardHeader>
                <CardTitle>Xidmətlər</CardTitle>
                <CardDescription>İstədiyiniz xidmətləri seçin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.services.includes(service.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration} dəq
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {service.price - (service.discount || 0)} ₼
                          </div>
                          {service.discount > 0 && (
                            <div className="text-sm text-gray-500 line-through">
                              {service.price} ₼
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Məhsul seçimi */}
            <Card>
              <CardHeader>
                <CardTitle>Məhsullar (İsteğe bağlı)</CardTitle>
                <CardDescription>Əlavə məhsullar sifariş edə bilərsiniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => {
                    const currentQuantity = formData.products.find(p => p.id === product.id)?.quantity || 0;
                    return (
                      <div key={product.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              {product.price - (product.discount || 0)} ₼
                            </div>
                            {product.discount > 0 && (
                              <div className="text-sm text-gray-500 line-through">
                                {product.price} ₼
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`product_${product.id}`}>Miqdar:</Label>
                          <Input
                            id={`product_${product.id}`}
                            type="number"
                            min="0"
                            max={product.stock}
                            value={currentQuantity}
                            onChange={(e) => handleProductQuantityChange(product.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">/ {product.stock}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tarix və vaxt */}
            <Card>
              <CardHeader>
                <CardTitle>Tarix və Vaxt</CardTitle>
                <CardDescription>Rezervasiya tarixinizi seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tarix</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.appointment_date ? (
                            format(formData.appointment_date, "PPP", { locale: az })
                          ) : (
                            <span>Tarix seçin</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.appointment_date}
                          onSelect={(date) => setFormData(prev => ({ ...prev, appointment_date: date }))}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>Vaxt</Label>
                    <Select
                      value={formData.appointment_time}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, appointment_time: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vaxt seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endirim kodu və ödəmə */}
            <Card>
              <CardHeader>
                <CardTitle>Ödəmə</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Endirim kodu"
                    value={formData.promo_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, promo_code: e.target.value }))}
                  />
                  <Button type="button" variant="outline" onClick={checkPromoCode}>
                    Tətbiq et
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Məcmu məbləğ:</span>
                    <span>{total} ₼</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span>Endirim:</span>
                      <span>-{discount} ₼</span>
                    </div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Rezervasiya edilir...' : 'Rezervasiya et'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
