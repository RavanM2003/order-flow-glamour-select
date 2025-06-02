
import React, { useState } from "react";
import { OrderProvider } from "@/context/OrderContext";
import SimpleBookingFlow, { BookingMode } from "@/components/SimpleBookingFlow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const Booking = () => {
  const { t } = useLanguage();
  const [bookingMode] = useState<BookingMode>("customer");

  return (
    <div className="min-h-screen bg-gradient-to-br from-glamour-50 to-white">
      <Header />

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-glamour-800 mb-3">
              {t("booking.title")}
            </h1>
            <p className="text-lg text-gray-600">
              Rezervasiya etmək üçün aşağıdakı addımları izləyin
            </p>
          </div>

          <OrderProvider>
            <SimpleBookingFlow bookingMode={bookingMode} />
          </OrderProvider>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(Booking);
