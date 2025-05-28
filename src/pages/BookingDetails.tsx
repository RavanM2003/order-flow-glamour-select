
import React from 'react';
import { OrderProvider } from '@/context/OrderContext';
import BookingDetails from '@/components/BookingDetails';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BookingDetailsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full px-2 sm:px-4 md:container md:py-8">
        <div className="w-full">
          <OrderProvider>
            <BookingDetails />
          </OrderProvider>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(BookingDetailsPage);
