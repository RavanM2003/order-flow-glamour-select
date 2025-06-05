import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import CustomerInfoStep from './booking/CustomerInfoStep';
import ServiceSelectionStep, { SelectedService } from './booking/ServiceSelectionStep';
import PaymentStep from './booking/PaymentStep';
import BookingSummary from './booking/BookingSummary';
import SimpleLogin from './auth/SimpleLogin';
import { createBooking } from '@/services/booking.service';
import { Button } from '@/components/ui/button';

export type BookingMode = "customer" | "admin";

interface CustomerInfo {
  fullName: string;
  gender: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  note: string;
}

interface SimpleBookingFlowProps {
  bookingMode: BookingMode;
}

const SimpleBookingFlow: React.FC<SimpleBookingFlowProps> = ({ bookingMode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    gender: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    note: ''
  });
  
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    // Reset form
    setCurrentStep(1);
    setCustomerInfo({
      fullName: '',
      gender: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      note: ''
    });
    setSelectedServices([]);
    setPaymentMethod('');
  };

  // Əgər admin mode-dadırsa və login olmayıbsa, login səhifəsini göstər
  if (bookingMode === 'admin' && !isLoggedIn) {
    return <SimpleLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    
    try {
      const totalAmount = selectedServices.reduce((sum, service) => sum + service.discountedPrice, 0);
      const discountAmount = selectedServices.reduce((sum, service) => sum + (service.price - service.discountedPrice), 0);

      const bookingData = {
        invoice_number: generateInvoiceNumber(),
        customer_info: {
          full_name: customerInfo.fullName,
          gender: customerInfo.gender,
          email: customerInfo.email,
          number: customerInfo.phone,
          note: customerInfo.note,
          date: customerInfo.date,
          time: customerInfo.time
        },
        services: selectedServices.map(service => ({
          id: service.serviceId,
          name: service.serviceName,
          price: service.price,
          duration: service.duration,
          discount: service.discount,
          discounted_price: service.discountedPrice,
          user_id: service.staffId
        })),
        products: [],
        request_info: {
          ip: 'unknown',
          device: 'web',
          os: 'unknown',
          browser: 'unknown',
          entry_time: new Date().toISOString(),
          page: 'booking'
        },
        payment_details: {
          method: paymentMethod,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          paid_amount: totalAmount
        }
      };

      const result = await createBooking(bookingData);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: `Rezervasiya yaradılmadı: ${result.error}`
        });
      } else {
        toast({
          title: "Uğurlu!",
          description: "Rezervasiyanız uğurla yaradıldı!"
        });
        
        // Reset form
        setCurrentStep(1);
        setCustomerInfo({
          fullName: '',
          gender: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          note: ''
        });
        setSelectedServices([]);
        setPaymentMethod('');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Rezervasiya yaradılarkən xəta baş verdi"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerInfoStep
            customerInfo={customerInfo}
            onUpdate={setCustomerInfo}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <ServiceSelectionStep
            selectedDate={customerInfo.date}
            selectedServices={selectedServices}
            onUpdate={setSelectedServices}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <PaymentStep
            paymentMethod={paymentMethod}
            onUpdate={setPaymentMethod}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <BookingSummary
            customerInfo={customerInfo}
            selectedServices={selectedServices}
            paymentMethod={paymentMethod}
            onBack={() => setCurrentStep(3)}
            onConfirm={handleConfirmBooking}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header - admin mode üçün logout düyməsi */}
      {bookingMode === 'admin' && isLoggedIn && (
        <div className="flex justify-end mb-4">
          <Button onClick={handleLogout} variant="outline" size="sm">
            Çıxış
          </Button>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-glamour-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-glamour-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {currentStep === 1 && 'Müştəri məlumatları'}
            {currentStep === 2 && 'Xidmət seçimi'}
            {currentStep === 3 && 'Ödəniş növü'}
            {currentStep === 4 && 'Təsdiqləmə'}
          </p>
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default SimpleBookingFlow;
