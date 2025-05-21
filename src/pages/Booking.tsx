
import React, { useState } from "react";
import { OrderProvider } from "@/context/OrderContext";
import CheckoutFlow, { BookingMode } from "@/components/CheckoutFlow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Booking = () => {
  const { t } = useLanguage();
  const [bookingMode] = useState<BookingMode>("customer");
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-glamour-800 mb-8 text-center">
            {t("booking.title")}
          </h1>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[800px] p-0">
              <div className="p-6">
                <OrderProvider>
                  <CheckoutFlow bookingMode={bookingMode} />
                </OrderProvider>
              </div>
            </DialogContent>
          </Dialog>

          <div className="hidden">
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
