
import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Banknote, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CardPayment from './CardPayment';
import { createBooking } from '@/services/booking.service';
import { formatDurationMultiLanguage } from '@/utils/validation';
import PriceDisplay from '@/components/ui/price-display';

const PaymentDetails = () => {
  const { t } = useLanguage();
  const { orderState, setPaymentMethod, completeOrder, resetOrder } = useOrder();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  // Calculate totals
  const serviceTotal = orderState.selectedService?.price || 0;
  const productTotal = orderState.selectedProducts.reduce((sum, product) => sum + (product.price || 0), 0);
  const totalAmount = serviceTotal + productTotal;

  // Calculate total duration for services
  const totalDuration = orderState.selectedServices?.reduce((total, serviceId) => {
    // In a real app, you'd get the actual service duration from your services data
    return total + 30; // Default 30 minutes per service
  }, 0) || 0;

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setPaymentMethod(method);
    
    if (method === 'card') {
      setShowCardForm(true);
    } else {
      setShowCardForm(false);
    }
  };

  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${time}-${random}`;
  };

  const processBooking = async (cardData?: any) => {
    setIsProcessing(true);
    
    try {
      const invoiceNumber = generateInvoiceNumber();
      
      // Prepare booking data
      const bookingData = {
        invoice_number: invoiceNumber,
        customer_info: {
          customer_id: orderState.customer.id || '',
          full_name: orderState.customer.name,
          gender: orderState.customer.gender,
          email: orderState.customer.email,
          number: orderState.customer.phone,
          note: orderState.customer.appointmentNotes || '', // Store notes for appointments
          date: orderState.appointmentDate?.toISOString().split('T')[0] || '',
          time: orderState.appointmentTime || '',
        },
        services: orderState.selectedServices?.map(serviceId => ({
          id: serviceId,
          name: `Service ${serviceId}`, // In real app, get from services data
          price: 50, // Default price, get from actual service data
          duration: 30, // Default duration, get from actual service data
          discount: 0,
          discounted_price: 50,
          user_id: orderState.serviceProviders?.find(sp => sp.serviceId === serviceId)?.name || '',
        })) || [],
        products: orderState.selectedProducts?.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price || 0,
          quantity: 1, // Always 1 as per requirement
          discount: 0,
          discounted_price: product.price || 0,
        })) || [],
        request_info: {
          ip: '127.0.0.1',
          device: navigator.userAgent,
          os: navigator.platform,
          browser: navigator.userAgent,
          entry_time: new Date().toISOString(),
          page: window.location.pathname,
        },
        payment_details: {
          method: selectedPaymentMethod,
          total_amount: totalAmount,
          discount_amount: 0,
          paid_amount: totalAmount,
        },
      };

      console.log('Creating booking with data:', bookingData);
      
      const result = await createBooking(bookingData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        completeOrder(result.data.invoice_number);
        // Navigate to booking details or confirmation page
        window.location.href = `/booking-details/${result.data.invoice_number}`;
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = () => {
    processBooking();
  };

  const handleCardPayment = (cardData: any) => {
    processBooking(cardData);
  };

  if (showCardForm) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => setShowCardForm(false)}
          className="mb-4"
        >
          ← {t('common.back')}
        </Button>
        
        <CardPayment 
          totalAmount={totalAmount}
          onPaymentSubmit={handleCardPayment}
          isLoading={isProcessing}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('booking.orderSummary')}</h3>
        
        {/* Services */}
        {orderState.selectedServices && orderState.selectedServices.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">{t('booking.selectedServices')}</h4>
            {orderState.selectedServices.map((serviceId) => {
              const staffProvider = orderState.serviceProviders?.find(sp => sp.serviceId === serviceId);
              return (
                <div key={serviceId} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Service {serviceId}</span>
                    {staffProvider && (
                      <p className="text-sm text-gray-600">Staff: {staffProvider.name}</p>
                    )}
                  </div>
                  <PriceDisplay price={50} className="text-sm" />
                </div>
              );
            })}
          </div>
        )}

        {/* Products */}
        {orderState.selectedProducts && orderState.selectedProducts.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">{t('booking.selectedProducts')}</h4>
            {orderState.selectedProducts.map((product) => (
              <div key={product.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <Badge variant="secondary" className="ml-2">1x</Badge>
                </div>
                <PriceDisplay price={product.price || 0} className="text-sm" />
              </div>
            ))}
          </div>
        )}

        {/* Duration */}
        {totalDuration > 0 && (
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{t('booking.totalDuration')}</span>
            </div>
            <span className="font-medium">
              {formatDurationMultiLanguage(totalDuration, t)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t font-semibold text-lg">
          <span>{t('booking.total')}</span>
          <PriceDisplay price={totalAmount} />
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('booking.paymentMethod')}</h3>
        
        <div className="space-y-3">
          {/* Cash Payment */}
          <Card 
            className={`p-4 cursor-pointer transition-all ${
              selectedPaymentMethod === 'cash' ? 'border-glamour-700 bg-glamour-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handlePaymentMethodSelect('cash')}
          >
            <div className="flex items-center space-x-3">
              <Banknote className="h-5 w-5 text-glamour-700" />
              <div>
                <h4 className="font-medium">{t('booking.cashPayment')}</h4>
                <p className="text-sm text-gray-600">{t('booking.payAtSalon')}</p>
              </div>
            </div>
          </Card>

          {/* Card Payment */}
          <Card 
            className={`p-4 cursor-pointer transition-all ${
              selectedPaymentMethod === 'card' ? 'border-glamour-700 bg-glamour-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handlePaymentMethodSelect('card')}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-glamour-700" />
              <div>
                <h4 className="font-medium">{t('booking.cardPayment')}</h4>
                <p className="text-sm text-gray-600">Вы можете оплатить кредитной или дебетовой картой</p>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      {/* Complete Booking Button */}
      {selectedPaymentMethod && (
        <Button 
          onClick={selectedPaymentMethod === 'cash' ? handleCashPayment : () => setShowCardForm(true)}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? t('booking.processing') : `${t('booking.completeBooking')} - ${totalAmount.toFixed(2)} AZN`}
        </Button>
      )}
    </div>
  );
};

export default PaymentDetails;
