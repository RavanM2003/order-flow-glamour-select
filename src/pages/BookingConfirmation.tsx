
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Clock, Mail, Phone, User } from 'lucide-react';
import { format } from 'date-fns';
import { az } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

const BookingConfirmation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', id, token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customer:users!customer_user_id(full_name, email, phone),
          appointment_services(
            id,
            service:services(name, duration, price, discount)
          ),
          appointment_products(
            id,
            quantity,
            price,
            product:products(name, price, discount)
          )
        `)
        .eq('id', id)
        .eq('confirmation_token', token)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!token
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Rezervasiya yoxlanılır...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center pt-6">
            <div className="text-red-500 mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Rezervasiya tapılmadı</h2>
            <p className="text-gray-600">Bu link etibarsızdır və ya vaxtı keçib.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const servicesTotal = appointment.appointment_services?.reduce((sum, item) => {
    const service = item.service;
    return sum + (service.price - (service.discount || 0));
  }, 0) || 0;

  const productsTotal = appointment.appointment_products?.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Uğur mesajı */}
          <Card className="mb-6">
            <CardContent className="text-center pt-6">
              <div className="text-green-500 mb-4">
                <CheckCircle className="h-16 w-16 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Rezervasiya Təsdiqləndi!
              </h1>
              <p className="text-gray-600">
                Rezervasiyanız uğurla qeydə alındı. Tezliklə sizinlə əlaqə saxlanılacaq.
              </p>
              <Badge variant="outline" className="mt-4">
                Rezervasiya ID: #{appointment.id}
              </Badge>
            </CardContent>
          </Card>

          {/* Müştəri məlumatları */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Müştəri məlumatları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{appointment.customer.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{appointment.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{appointment.customer.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Rezervasiya detalları */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Rezervasiya detalları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  {format(new Date(appointment.appointment_date), "PPP", { locale: az })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{appointment.start_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={appointment.status === 'awaiting_confirmation' ? 'secondary' : 'default'}>
                  {appointment.status === 'awaiting_confirmation' ? 'Təsdiq gözlənilir' : appointment.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Seçilmiş xidmətlər */}
          {appointment.appointment_services && appointment.appointment_services.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Seçilmiş xidmətlər</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointment.appointment_services.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.service.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.service.duration} dəq
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {item.service.price - (item.service.discount || 0)} ₼
                        </div>
                        {item.service.discount > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            {item.service.price} ₼
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seçilmiş məhsullar */}
          {appointment.appointment_products && appointment.appointment_products.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Seçilmiş məhsullar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointment.appointment_products.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">Miqdar: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {item.price * item.quantity} ₼
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.price} ₼ × {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ödəmə məlumatları */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ödəmə məlumatları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Xidmətlər:</span>
                  <span>{servicesTotal} ₼</span>
                </div>
                {productsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Məhsullar:</span>
                    <span>{productsTotal} ₼</span>
                  </div>
                )}
                {appointment.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Endirim ({appointment.promo_code}):</span>
                    <span>-{appointment.discount_amount} ₼</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Məcmu məbləğ:</span>
                  <span>{appointment.total} ₼</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qeydlər */}
          {appointment.notes && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Əlavə qeydlər</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{appointment.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Əlaqə məlumatları */}
          <Card>
            <CardHeader>
              <CardTitle>Bizə müraciət edin</CardTitle>
              <CardDescription>
                Suallarınız varsa, bizimləə əlaqə saxlaya bilərsiniz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>+994 50 123 45 67</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>info@glamour.az</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
