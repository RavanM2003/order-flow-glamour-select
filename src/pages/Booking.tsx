
import React, { useState } from 'react';
import { OrderProvider } from '@/context/OrderContext';
import CheckoutFlow, { BookingMode } from "@/components/CheckoutFlow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Booking = () => {
  const { t } = useLanguage();
  const [bookingMode, setBookingMode] = useState<BookingMode>("customer");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-glamour-800 mb-8 text-center">
            {t('booking.title')}
          </h1>
          
          <div className="mb-8">
            <Tabs 
              defaultValue="customer" 
              onValueChange={(value) => setBookingMode(value as BookingMode)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">{t('booking.customerBooking')}</TabsTrigger>
                <TabsTrigger value="staff">{t('booking.staffBooking')}</TabsTrigger>
              </TabsList>
              <TabsContent value="customer">
                <div className="p-4 bg-muted rounded-lg mb-6">
                  <p className="text-sm">{t('booking.customerBookingDescription')}</p>
                </div>
              </TabsContent>
              <TabsContent value="staff">
                <div className="p-4 bg-muted rounded-lg mb-6">
                  <p className="text-sm">{t('booking.staffBookingDescription')}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <OrderProvider>
            <CheckoutFlow bookingMode={bookingMode} />
          </OrderProvider>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(Booking);
