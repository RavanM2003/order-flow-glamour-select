
import React from 'react';
import { useParams } from 'react-router-dom';
import { OrderProvider } from '@/context/OrderContext';
import BookingDetails from '@/components/BookingDetails';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BookingDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full px-2 sm:px-4 md:container md:py-8">
        <div className="w-full md:max-w-4xl md:mx-auto">
          <h1 className="text-3xl font-bold text-glamour-800 mb-8 text-center">Booking Details</h1>
          <OrderProvider>
            <BookingDetails invoiceId={orderId} />
          </OrderProvider>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(BookingDetailsPage);
