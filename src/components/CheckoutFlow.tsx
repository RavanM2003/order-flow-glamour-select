
import React from "react";
import { useOrder } from "@/context/OrderContext";
import CustomerInfo from "./CustomerInfo";
import { ServiceSelection } from "./ServiceSelection";
import PaymentDetails from "./PaymentDetails";
import BookingConfirmation from "./BookingConfirmation";
import { useLanguage } from "@/context/LanguageContext";
import { BookingMode as CustomerBookingMode } from "@/context/OrderContext.d";

export type BookingMode = "customer" | "staff";

interface CheckoutFlowProps {
  bookingMode?: BookingMode;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = React.memo(({
  bookingMode = "customer",
}) => {
  const { orderState } = useOrder();
  const { currentStep } = orderState;
  const { t } = useLanguage();

  // Map the BookingMode to CustomerBookingMode
  const mapBookingMode = (mode: BookingMode): CustomerBookingMode => {
    return mode === "customer" ? "salon" : "home";
  };

  const customerBookingMode = mapBookingMode(bookingMode);

  // Simplified step titles
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return t('booking.customerInfo');
      case 2:
        return t('booking.services');
      case 3:
        return t('booking.payment');
      case 4:
        return t('booking.confirmation');
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">{getStepTitle(1)}</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">{getStepTitle(2)}</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">{getStepTitle(3)}</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
            <div className="step-number">4</div>
            <div className="step-label">{getStepTitle(4)}</div>
          </div>
        </div>
      </div>

      {currentStep === 1 && <CustomerInfo bookingMode={customerBookingMode} onSubmit={() => {}} />}
      {currentStep === 2 && <ServiceSelection />}
      {currentStep === 3 && <PaymentDetails />}
      {currentStep === 4 && <BookingConfirmation />}

      <style>
        {`
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .step-label {
          font-size: 14px;
          color: #6b7280;
        }
        .step.active .step-number {
          background-color: #9f7aea;
          color: white;
        }
        .step.active .step-label {
          color: #4b5563;
          font-weight: 600;
        }
        .step-connector {
          flex-grow: 1;
          height: 2px;
          background-color: #e5e7eb;
          margin: 0 8px;
          margin-bottom: 25px;
        }
        `}
      </style>
    </div>
  );
});

export default React.memo(CheckoutFlow);
