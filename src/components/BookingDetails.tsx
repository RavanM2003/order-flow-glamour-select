
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail, CreditCard, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceData {
  id: number;
  invoice_number: string;
  total_amount: number;
  status: string;
  appointment_status: string;
  appointment_json: any;
  issued_at: string;
}

interface BookingDetailsProps {
  invoiceId?: string;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ invoiceId }) => {
  const { t } = useLanguage();
  const { orderId } = useParams();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentInvoiceId = invoiceId || orderId;

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!currentInvoiceId) {
        setError('No invoice ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('invoice_number', currentInvoiceId)
          .single();

        if (error) throw error;

        setInvoiceData(data);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch invoice data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [currentInvoiceId]);

  const canCancelAppointment = () => {
    if (!invoiceData?.appointment_json?.customer_info) return false;
    
    const appointmentDate = invoiceData.appointment_json.customer_info.date;
    const appointmentTime = invoiceData.appointment_json.customer_info.time;
    
    if (!appointmentDate || !appointmentTime) return false;
    
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    const timeDifference = appointmentDateTime.getTime() - now.getTime();
    const hoursUntilAppointment = timeDifference / (1000 * 60 * 60);
    
    return hoursUntilAppointment >= 2 && invoiceData.appointment_status !== 'cancelled';
  };

  const handleCancelAppointment = async () => {
    if (!invoiceData || !canCancelAppointment()) return;
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ appointment_status: 'cancelled' })
        .eq('id', invoiceData.id);

      if (error) throw error;

      setInvoiceData(prev => prev ? { ...prev, appointment_status: 'cancelled' } : null);
      alert(t('booking.appointmentCancelled'));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(t('booking.cancelError'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">{t('common.loading')}...</div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">{t('booking.errorTitle')}</h2>
          <p>{error || t('booking.invoiceNotFound')}</p>
        </div>
      </Card>
    );
  }

  const { appointment_json } = invoiceData;
  const customerInfo = appointment_json?.customer_info || {};
  const services = appointment_json?.services || [];
  const products = appointment_json?.products || [];
  const paymentDetails = appointment_json?.payment_details || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-glamour-800">
              {t('booking.bookingDetails')}
            </h1>
            <p className="text-gray-600">{t('booking.invoiceNumber')}: {invoiceData.invoice_number}</p>
          </div>
          <div className="text-right">
            <Badge 
              variant={invoiceData.status === 'paid' ? 'default' : 'secondary'}
              className="mb-2"
            >
              {invoiceData.status}
            </Badge>
            <br />
            <Badge 
              variant={invoiceData.appointment_status === 'confirmed' ? 'default' : 'secondary'}
            >
              {invoiceData.appointment_status}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Customer Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          {t('booking.customerInfo')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
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
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>{customerInfo.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>{customerInfo.time}</span>
            </div>
            {customerInfo.note && (
              <div className="flex items-start">
                <span className="text-sm text-gray-600">{t('booking.notes')}: {customerInfo.note}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Services */}
      {services.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('booking.selectedServices')}</h2>
          <div className="space-y-3">
            {services.map((service: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-600">
                    {t('booking.duration')}: {service.duration} {t('booking.minutes')}
                  </p>
                  {service.staff_name && (
                    <p className="text-sm text-gray-600">
                      {t('booking.staff')}: {service.staff_name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-semibold">{service.discounted_price} AZN</span>
                  {service.price !== service.discounted_price && (
                    <div className="text-sm text-gray-500 line-through">
                      {service.price} AZN
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Products */}
      {products.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('booking.selectedProducts')}</h2>
          <div className="space-y-3">
            {products.map((product: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {t('booking.quantity')}: {product.quantity || 1}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    {((product.discounted_price || product.price) * (product.quantity || 1)).toFixed(2)} AZN
                  </span>
                  {product.price !== product.discounted_price && (
                    <div className="text-sm text-gray-500 line-through">
                      {(product.price * (product.quantity || 1)).toFixed(2)} AZN
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Payment Details */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          {t('booking.paymentDetails')}
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t('booking.paymentMethod')}:</span>
            <span className="capitalize">{paymentDetails.method}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>{t('booking.total')}:</span>
            <span>{invoiceData.total_amount} AZN</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      {canCancelAppointment() && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('booking.actions')}</h2>
          <Button 
            variant="destructive" 
            onClick={handleCancelAppointment}
            className="w-full"
          >
            {t('booking.cancelAppointment')}
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            {t('booking.cancelPolicy')}
          </p>
        </Card>
      )}
    </div>
  );
};

export default BookingDetails;
