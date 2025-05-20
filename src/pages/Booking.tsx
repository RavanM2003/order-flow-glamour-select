
import React from 'react';
import { OrderProvider } from '@/context/OrderContext';
import CheckoutFlow from "@/components/CheckoutFlow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';

const Booking = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-glamour-800 mb-8 text-center">
            {t('booking.title')}
          </h1>
          <OrderProvider>
            <CheckoutFlow />
          </OrderProvider>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(Booking);
