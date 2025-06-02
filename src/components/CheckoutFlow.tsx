
import React, { useState, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";
import ServiceSelection from "./ServiceSelection";
import ProductSelection from "./ProductSelection";
import BookingDatePicker from "./BookingDatePicker";
import CustomerInfo from "./CustomerInfo";
import PaymentDetails from "./PaymentDetails";
import BookingConfirmation from "./BookingConfirmation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type BookingMode = "customer" | "admin";

interface CheckoutFlowProps {
  bookingMode: BookingMode;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ bookingMode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { orderState, resetOrder, setAppointmentDate } = useOrder();
  const { t } = useLanguage();

  const steps = [
    { key: "services", label: t("booking.selectServices"), component: ServiceSelection },
    { key: "products", label: t("booking.selectProducts"), component: ProductSelection },
    { key: "date", label: t("booking.selectDate"), component: BookingDatePicker },
    { key: "customer", label: t("booking.customerInfo"), component: CustomerInfo },
    { key: "payment", label: t("booking.paymentDetails"), component: PaymentDetails },
    { key: "confirmation", label: t("booking.confirmation"), component: BookingConfirmation },
  ];

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: // Services
        return orderState.selectedServices && orderState.selectedServices.length > 0;
      case 1: // Products - optional, always can proceed
        return true;
      case 2: // Date
        return orderState.appointmentDate && orderState.appointmentTime;
      case 3: // Customer
        return (
          orderState.customer &&
          orderState.customer.name &&
          orderState.customer.email &&
          orderState.customer.phone
        );
      case 4: // Payment
        return orderState.paymentMethod;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || canProceedToNextStep()) {
      setCurrentStep(stepIndex);
    }
  };

  const resetFlow = () => {
    setCurrentStep(0);
    resetOrder();
  };

  // Render the current step component with proper props
  const renderCurrentStep = () => {
    const currentStepData = steps[currentStep];
    const CurrentStepComponent = currentStepData.component;
    
    // Handle BookingDatePicker specifically since it requires props
    if (currentStepData.key === "date") {
      return (
        <BookingDatePicker
          value={orderState.appointmentDate}
          onChange={setAppointmentDate}
        />
      );
    }
    
    // For other components that don't require specific props
    return <CurrentStepComponent />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center cursor-pointer ${
                index <= currentStep ? "text-glamour-700" : "text-gray-400"
              }`}
              onClick={() => handleStepClick(index)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep
                    ? "bg-glamour-700 text-white"
                    : index === currentStep
                    ? "bg-glamour-100 text-glamour-700 border-2 border-glamour-700"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-1 mx-2 ${
                    index < currentStep ? "bg-glamour-700" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={`${step.key}-label`}
              className={`text-xs text-center ${
                index <= currentStep ? "text-glamour-700" : "text-gray-400"
              }`}
              style={{ width: `${100 / steps.length}%` }}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < steps.length - 1 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("common.previous")}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
            className="flex items-center bg-glamour-700 hover:bg-glamour-800"
          >
            {t("common.next")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Reset Button on Confirmation Step */}
      {currentStep === steps.length - 1 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={resetFlow}
            variant="outline"
            className="border-glamour-700 text-glamour-700 hover:bg-glamour-50"
          >
            {t("booking.newBooking")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutFlow;
