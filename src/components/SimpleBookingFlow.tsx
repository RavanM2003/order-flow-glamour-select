
import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import ServiceSelection from "./ServiceSelection";
import ProductSelection from "./ProductSelection";
import BookingDatePicker from "./BookingDatePicker";
import CustomerInfo from "./CustomerInfo";
import PaymentDetails from "./PaymentDetails";
import BookingConfirmation from "./BookingConfirmation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, User, CreditCard, CheckCircle, ShoppingBag, Briefcase } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type BookingMode = "customer" | "admin";

interface SimpleBookingFlowProps {
  bookingMode: BookingMode;
}

const SimpleBookingFlow: React.FC<SimpleBookingFlowProps> = ({ bookingMode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { orderState, resetOrder, setAppointmentDate } = useOrder();
  const { t } = useLanguage();

  const steps = [
    { 
      key: "services", 
      label: t("booking.selectServices"), 
      icon: Briefcase,
      component: ServiceSelection 
    },
    { 
      key: "products", 
      label: t("booking.selectProducts"), 
      icon: ShoppingBag,
      component: ProductSelection 
    },
    { 
      key: "date", 
      label: t("booking.selectDate"), 
      icon: Calendar,
      component: BookingDatePicker 
    },
    { 
      key: "customer", 
      label: t("booking.customerInfo"), 
      icon: User,
      component: CustomerInfo 
    },
    { 
      key: "payment", 
      label: t("booking.paymentDetails"), 
      icon: CreditCard,
      component: PaymentDetails 
    },
    { 
      key: "confirmation", 
      label: t("booking.confirmation"), 
      icon: CheckCircle,
      component: BookingConfirmation 
    },
  ];

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: // Services
        return orderState.selectedServices && orderState.selectedServices.length > 0;
      case 1: // Products - optional
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
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const resetFlow = () => {
    setCurrentStep(0);
    resetOrder();
  };

  const renderCurrentStep = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData.key) {
      case "services":
        return <ServiceSelection />;
      case "products":
        return <ProductSelection />;
      case "date":
        return (
          <BookingDatePicker
            value={orderState.appointmentDate}
            onChange={setAppointmentDate}
          />
        );
      case "customer":
        return <CustomerInfo />;
      case "payment":
        return <PaymentDetails />;
      case "confirmation":
        return <BookingConfirmation />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Modern Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
            <div 
              className="h-full bg-glamour-600 transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = index <= currentStep;
            
            return (
              <div
                key={step.key}
                className={`relative z-10 flex flex-col items-center cursor-pointer transition-all duration-200 ${
                  isClickable ? "hover:scale-105" : "cursor-not-allowed"
                }`}
                onClick={() => isClickable && handleStepClick(index)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isCompleted
                      ? "bg-glamour-600 text-white shadow-lg"
                      : isCurrent
                      ? "bg-white text-glamour-600 border-2 border-glamour-600 shadow-md"
                      : "bg-gray-200 text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-20 ${
                    isCompleted || isCurrent ? "text-glamour-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 min-h-[400px]">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {React.createElement(steps[currentStep].icon, { className: "w-5 h-5 text-glamour-600" })}
            {steps[currentStep].label}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Addım {currentStep + 1} / {steps.length}
          </p>
        </div>
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        {currentStep < steps.length - 1 ? (
          <>
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 border-gray-300 hover:border-glamour-600 hover:text-glamour-600"
            >
              <ChevronLeft className="w-4 h-4" />
              Əvvəlki
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceedToNextStep()}
              className="flex items-center gap-2 bg-glamour-600 hover:bg-glamour-700 text-white px-6"
            >
              Növbəti
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <Button
              onClick={resetFlow}
              variant="outline"
              className="border-glamour-600 text-glamour-600 hover:bg-glamour-50 px-8"
            >
              Yeni rezervasiya
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleBookingFlow;
