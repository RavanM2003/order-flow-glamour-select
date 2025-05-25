
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MapPin, CreditCard, Package, Scissors } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDurationMultiLanguage } from '@/utils/validation';

interface BookingDetailsProps {
  invoiceId?: string;
  invoiceNumber?: string;
  appointmentId?: string;
}

interface AppointmentJson {
  customer_info?: {
    full_name?: string;
    email?: string;
    number?: string;
    date?: string;
    time?: string;
    note?: string;
  };
  services?: Array<{
    id: number;
    name: string;
    duration: number;
    price: number;
    discount: number;
    discounted_price: number;
  }>;
  products?: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    discounted_price: number;
  }>;
  payment_details?: {
    method: string;
    total_amount: number;
    discount_amount: number;
    paid_amount: number;
  };
}

interface BookingData {
  id: number;
  invoice_number: string;
  status: string;
  appointment_json: any; // Use any to match Supabase Json type
  appointment_id?: number;
  appointment_status?: string;
  issued_at?: string;
  total_amount: number;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ invoiceId, invoiceNumber, appointmentId }) => {
  const { t } = useLanguage();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canCancel, setCanCancel] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        let query = supabase.from('invoices').select('*');
        
        if (invoiceId) {
          query = query.eq('id', parseInt(invoiceId));
        } else if (invoiceNumber) {
          query = query.eq('invoice_number', invoiceNumber);
        } else if (appointmentId) {
          query = query.eq('id', parseInt(appointmentId));
        }
        
        const { data, error } = await query.single();
        
        if (error) throw error;
        
        setBooking(data);
        
        // Check if booking can be cancelled (2 hours before appointment)
        const customerInfo = (data.appointment_json as AppointmentJson)?.customer_info;
        if (customerInfo?.date && customerInfo?.time) {
          const appointmentDate = new Date(`${customerInfo.date} ${customerInfo.time}`);
          const now = new Date();
          const timeDiff = appointmentDate.getTime() - now.getTime();
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          setCanCancel(hoursDiff > 2 && data.status !== 'cancelled');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId || invoiceNumber || appointmentId) {
      fetchBookingDetails();
    }
  }, [invoiceId, invoiceNumber, appointmentId]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'cancelled',
          appointment_status: 'cancelled'
        })
        .eq('id', booking.id);
      
      if (error) throw error;
      
      setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
      setCanCancel(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center p-8">
        <div className="text-lg text-gray-600">Rezervasiya tapılmadı</div>
      </div>
    );
  }

  const appointmentJson = booking.appointment_json as AppointmentJson;
  const customerInfo = appointmentJson?.customer_info;
  const services = appointmentJson?.services || [];
  const products = appointmentJson?.products || [];
  const paymentDetails = appointmentJson?.payment_details;

  const totalDuration = services.reduce((total: number, service: any) => total + (service.duration || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-glamour-800">
              {t('booking.detailed')}
            </h2>
            <p className="text-gray-600">#{booking.invoice_number}</p>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.status === 'waiting' ? 'Gözləyir' :
               booking.status === 'confirmed' ? 'Təsdiqlənib' :
               booking.status === 'cancelled' ? 'Ləğv edilib' : booking.status}
            </div>
          </div>
        </div>

        {canCancel && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-orange-800 mb-2">
              {t('booking.cancelDeadline')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelBooking}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              {t('booking.cancelBooking')}
            </Button>
          </div>
        )}
      </Card>

      {/* Customer Information */}
      {customerInfo && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2 text-glamour-700" />
            <h3 className="text-lg font-semibold">{t('booking.customerInfo')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span>{customerInfo.full_name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <span>{customerInfo.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <span>{customerInfo.number}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>{customerInfo.date} - {customerInfo.time}</span>
            </div>
          </div>
          {customerInfo.note && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">{t('booking.notes')}</h4>
              <p className="text-gray-600">{customerInfo.note}</p>
            </div>
          )}
        </Card>
      )}

      {/* Services */}
      {services.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Scissors className="h-5 w-5 mr-2 text-glamour-700" />
            <h3 className="text-lg font-semibold">{t('booking.services')}</h3>
          </div>
          <div className="space-y-3">
            {services.map((service: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDurationMultiLanguage(service.duration || 0, t)}</span>
                  </div>
                </div>
                <div className="text-right">
                  {service.discount > 0 ? (
                    <div>
                      <div className="text-sm text-gray-500 line-through">
                        {service.price} AZN
                      </div>
                      <div className="font-semibold text-glamour-700">
                        {service.discounted_price} AZN
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-glamour-700">
                      {service.price} AZN
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between">
              <span className="font-medium">{t('booking.totalDuration')}:</span>
              <span>{formatDurationMultiLanguage(totalDuration, t)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Products */}
      {products.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 mr-2 text-glamour-700" />
            <h3 className="text-lg font-semibold">{t('booking.products')}</h3>
          </div>
          <div className="space-y-3">
            {products.map((product: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <div className="text-sm text-gray-600">
                    Miqdar: {product.quantity}
                  </div>
                </div>
                <div className="text-right">
                  {product.discount > 0 ? (
                    <div>
                      <div className="text-sm text-gray-500 line-through">
                        {(product.price * product.quantity).toFixed(2)} AZN
                      </div>
                      <div className="font-semibold text-glamour-700">
                        {(product.discounted_price * product.quantity).toFixed(2)} AZN
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-glamour-700">
                      {(product.price * product.quantity).toFixed(2)} AZN
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Payment Summary */}
      {paymentDetails && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 mr-2 text-glamour-700" />
            <h3 className="text-lg font-semibold">{t('booking.payment')}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Cəmi məbləğ:</span>
              <span>{paymentDetails.total_amount} AZN</span>
            </div>
            {paymentDetails.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Endirim:</span>
                <span>-{paymentDetails.discount_amount} AZN</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Ödənilən məbləğ:</span>
              <span className="text-glamour-700">{paymentDetails.paid_amount} AZN</span>
            </div>
            <div className="text-sm text-gray-600">
              Ödəniş üsulu: {
                paymentDetails.method === 'cash' ? 'Nəğd' :
                paymentDetails.method === 'card' ? 'Kart' :
                paymentDetails.method === 'bank' ? 'Bank köçürməsi' :
                paymentDetails.method
              }
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BookingDetails;
