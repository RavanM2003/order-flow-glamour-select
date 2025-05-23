
import React, { useState } from "react";
import { OrderProvider } from "@/context/OrderContext";
import CheckoutFlow, { BookingMode } from "@/components/CheckoutFlow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const Booking = () => {
  const { t } = useLanguage();
  const [bookingMode] = useState<BookingMode>("customer");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-glamour-800 mb-8 text-center">
            {t("booking.title")}
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <OrderProvider>
              <CheckoutFlow bookingMode={bookingMode} />
            </OrderProvider>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(Booking);
