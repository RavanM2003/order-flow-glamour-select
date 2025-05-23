import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "./ui/button";
import { Check, ChevronLeft, ChevronRight, User, CreditCard, Calendar, CheckCircle, Search, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/hooks/use-settings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/models/service.model";
import { Staff } from "@/models/staff.model";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import DiscountBadge from "./ui/discount-badge";
import PriceDisplay from "./ui/price-display";

export type BookingMode = "customer" | "staff";

interface CheckoutFlowProps {
  bookingMode?: BookingMode;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  bookingMode = "customer",
}) => {
  const { t } = useLanguage();
  const { getLocalizedSetting } = useSettings();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Record<number, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [servicesSearchTerm, setServicesSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    notes: "",
    date: null as Date | null,
    time: "",
  });

  // Fetch services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*");
      if (error) throw error;
      return data as Service[];
    },
  });

  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, role")
        .neq("role", "customer");
      if (error) throw error;
      return data as unknown as Staff[];
    },
  });

  // Get settings for booking
  const maxBookingDays = parseInt(getLocalizedSetting("max_booking_days", "30")) || 30;
  const workingHoursStart = getLocalizedSetting("working_hours_start", "09:00");
  const workingHoursEnd = getLocalizedSetting("working_hours_end", "19:00");
  const bankName = getLocalizedSetting("bank_name");
  const bankAccountName = getLocalizedSetting("bank_account_name");
  const bankAccountNumber = getLocalizedSetting("bank_account_number");
  const bankSwift = getLocalizedSetting("bank_swift");

  // Step calculation
  const totalSteps = 4; // Removed products step

  // Step icons
  const stepIcons = [
    { icon: User, label: t("booking.customerInfo", "Müştəri məlumatları") },
    { icon: Calendar, label: t("booking.services", "Xidmətlər") },
    { icon: CreditCard, label: t("booking.payment", "Ödəniş") },
    { icon: CheckCircle, label: t("booking.confirmation", "Təsdiq") },
  ];

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    
    // Add services price with discounts
    if (services) {
      services.forEach(service => {
        if (selectedServices.includes(service.id)) {
          const price = parseFloat(service.price.toString());
          const discount = service.discount || 0;
          const discountedPrice = price * (1 - discount / 100);
          total += discountedPrice;
        }
      });
    }
    
    return total.toFixed(2);
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle form data changes
  const handleFormChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Toggle service selection
  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
    
    // If unselecting a service, remove the staff assignment
    if (selectedServices.includes(serviceId)) {
      const newStaffAssignments = { ...selectedStaff };
      delete newStaffAssignments[serviceId];
      setSelectedStaff(newStaffAssignments);
    }
  };

  // Assign staff to service
  const assignStaff = (serviceId: number, staffId: string) => {
    setSelectedStaff(prev => ({
      ...prev,
      [serviceId]: staffId,
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    if (method === "bank") {
      setShowBankDetails(true);
    } else {
      setShowBankDetails(false);
    }
  };

  // Handle submit booking
  const handleSubmitBooking = async () => {
    console.log("Booking submitted:", {
      customer: formData,
      services: selectedServices,
      staffAssignments: selectedStaff,
      paymentMethod,
      total: calculateTotal()
    });
    
    // Here you would submit the booking to your API
    // For now, just move to the confirmation step
    handleNextStep();
  };

  // Filter services based on search
  const filteredServices = services?.filter(service =>
    service.name.toLowerCase().includes(servicesSearchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(servicesSearchTerm.toLowerCase()))
  ) || [];

  // Validation for proceeding to next step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.date && formData.time;
      case 2:
        return selectedServices.length > 0 && Object.keys(selectedStaff).length === selectedServices.length;
      case 3:
        return true; // Payment step doesn't need validation
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {stepIcons.map((step, index) => {
            const stepNumber = index + 1;
            const StepIcon = step.icon;
            return (
              <div
                key={stepNumber}
                className={`flex flex-col items-center ${
                  currentStep >= stepNumber ? "text-glamour-800" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= stepNumber
                      ? "bg-glamour-700 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > stepNumber ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <StepIcon className="h-6 w-6" />
                  )}
                </div>
                <span className="text-xs sm:text-sm text-center hidden sm:block">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Step 1: Customer Information */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("booking.customerInfo", "Müştəri məlumatları")}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.fullName", "Ad və soyad")} *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleFormChange("fullName", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.gender", "Cins")}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={() => handleFormChange("gender", "male")}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                      formData.gender === "male" 
                        ? "border-glamour-700 bg-glamour-50" 
                        : "border-gray-300"
                    )}>
                      👨
                    </div>
                    <span className="ml-2">{t("booking.male", "Kişi")}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={() => handleFormChange("gender", "female")}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                      formData.gender === "female" 
                        ? "border-glamour-700 bg-glamour-50" 
                        : "border-gray-300"
                    )}>
                      👩
                    </div>
                    <span className="ml-2">{t("booking.female", "Qadın")}</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.email", "E-poçt")} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.phone", "Telefon")} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.notes", "Qeydiyyat məlumatları")}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    {t("booking.date", "Tarix")} *
                  </label>
                  <input
                    type="date"
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      handleFormChange("date", date);
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + maxBookingDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("booking.availableForNextDays", "Növbəti")} {maxBookingDays} {t("booking.days", "gün ərzində")}
                  </p>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    {t("booking.time", "Vaxt")} *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleFormChange("time", e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                    min={workingHoursStart}
                    max={workingHoursEnd}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("booking.workingHours", "İş saatları")}: {workingHoursStart} - {workingHoursEnd}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Services Selection */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("booking.services", "Xidmətlər")}</h2>
            
            {/* Search Services */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("booking.searchServices", "Xidmətləri axtar...")}
                  value={servicesSearchTerm}
                  onChange={(e) => setServicesSearchTerm(e.target.value)}
                  className="w-full pl-10 p-2 border rounded-md"
                />
              </div>
            </div>
            
            {servicesLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredServices && filteredServices.length > 0 ? (
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div 
                    key={service.id} 
                    className={`border rounded-lg p-4 relative ${
                      selectedServices.includes(service.id) ? "border-glamour-500 bg-glamour-50" : ""
                    }`}
                  >
                    <DiscountBadge discount={service.discount || 0} className="top-0 right-0" />
                    
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="mt-1"
                      />
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between items-start">
                          <label htmlFor={`service-${service.id}`} className="font-medium cursor-pointer">
                            {service.name}
                          </label>
                          <PriceDisplay 
                            price={service.price} 
                            discount={service.discount}
                            className="ml-4"
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{service.duration} min</span>
                          </div>
                          <Link to={`/services/${service.id}`} className="text-glamour-700 hover:underline">
                            {t("booking.moreInfo", "Ətraflı")}
                          </Link>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {service.description || t("booking.noDescription", "Təsvir yoxdur")}
                        </p>
                        
                        {/* Staff selection for this service */}
                        {selectedServices.includes(service.id) && (
                          <div className="mt-4">
                            <label className="block mb-1 text-sm font-medium">
                              {t("booking.selectStaff", "Personal seçin")}
                            </label>
                            <select
                              value={selectedStaff[service.id] || ""}
                              onChange={(e) => assignStaff(service.id, e.target.value)}
                              className="w-full p-2 border rounded-md"
                              required
                            >
                              <option value="">{t("booking.chooseStaff", "Personal seçin")}</option>
                              {!staffLoading && staffMembers?.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                  {staff.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">{t("booking.noServices", "Xidmət tapılmadı")}</div>
            )}
            
            {selectedServices.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">{t("booking.selectedServices", "Seçilmiş xidmətlər")}</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {services?.filter(s => selectedServices.includes(s.id)).map((service) => {
                    const discount = service.discount || 0;
                    const originalPrice = parseFloat(service.price.toString());
                    const discountedPrice = originalPrice * (1 - discount / 100);
                    
                    return (
                      <div key={service.id} className="flex justify-between mb-2">
                        <span>{service.name}</span>
                        <PriceDisplay 
                          price={originalPrice} 
                          discount={discount}
                          showCurrency={true}
                        />
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                    <span>{t("booking.total", "Cəmi")}:</span>
                    <span>{calculateTotal()} AZN</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("booking.payment", "Ödəniş")}</h2>
            
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-4">{t("booking.orderSummary", "Sifariş xülasəsi")}</h3>
              
              {/* Customer Details */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">{t("booking.customerDetails", "Müştəri məlumatları")}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">{t("booking.fullName", "Ad və soyad")}:</div>
                  <div>{formData.fullName}</div>
                  
                  <div className="text-gray-600">{t("booking.email", "E-poçt")}:</div>
                  <div>{formData.email}</div>
                  
                  <div className="text-gray-600">{t("booking.phone", "Telefon")}:</div>
                  <div>{formData.phone}</div>
                  
                  <div className="text-gray-600">{t("booking.appointmentDate", "Təyinat tarixi")}:</div>
                  <div>{formData.date?.toLocaleDateString()} {formData.time}</div>
                </div>
              </div>
              
              {/* Services */}
              {selectedServices.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{t("booking.services", "Xidmətlər")}</h4>
                  {services?.filter(s => selectedServices.includes(s.id)).map((service) => (
                    <div key={service.id} className="flex justify-between text-sm mb-1">
                      <div>
                        {service.name}
                        <span className="text-gray-500 ml-2">
                          ({service.duration} min)
                          {selectedStaff[service.id] && staffMembers && (
                            <span className="ml-1">
                              - {staffMembers.find(s => s.id === selectedStaff[service.id])?.full_name}
                            </span>
                          )}
                        </span>
                      </div>
                      <PriceDisplay 
                        price={service.price} 
                        discount={service.discount}
                        showCurrency={true}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Total */}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>{t("booking.total", "Cəmi")}:</span>
                  <span>{calculateTotal()} AZN</span>
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div>
              <h3 className="font-medium mb-4">{t("booking.paymentMethod", "Ödəniş üsulu")}</h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => handlePaymentMethodChange("cash")}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t("booking.cashPayment", "Nöqtəli ödəniş")}</div>
                    <div className="text-sm text-gray-500">{t("booking.cashPaymentDesc", "Nöqtəli ödəniş")}</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => handlePaymentMethodChange("card")}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t("booking.cardPayment", "Kart ödəniş")}</div>
                    <div className="text-sm text-gray-500">{t("booking.cardPaymentDesc", "Kart ödəniş")}</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pos"
                    checked={paymentMethod === "pos"}
                    onChange={() => handlePaymentMethodChange("pos")}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t("booking.posTerminal", "POS terminali")}</div>
                    <div className="text-sm text-gray-500">{t("booking.posTerminalDesc", "POS terminali")}</div>
                  </div>
                </label>
                
                <div>
                  <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={() => handlePaymentMethodChange("bank")}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">{t("booking.bankTransfer", "Bank transferi")}</div>
                      <div className="text-sm text-gray-500">{t("booking.bankTransferDesc", "Bank transferi")}</div>
                    </div>
                  </label>
                  
                  {showBankDetails && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-md text-sm">
                      <h4 className="font-medium mb-2">{t("booking.bankDetails", "Bank məlumatları")}</h4>
                      <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-gray-600">{t("booking.bankName", "Bank adı")}:</div>
                        <div>{bankName}</div>
                        
                        <div className="text-gray-600">{t("booking.accountName", "Hesab adı")}:</div>
                        <div>{bankAccountName}</div>
                        
                        <div className="text-gray-600">{t("booking.accountNumber", "Hesab nömrəsi")}:</div>
                        <div>{bankAccountNumber}</div>
                        
                        <div className="text-gray-600">{t("booking.swiftCode", "SWIFT kodu")}:</div>
                        <div>{bankSwift}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{t("booking.bookingConfirmed", "Rezervasiya təsdiqləndi")}</h2>
            <p className="text-gray-600 mb-6">
              {t("booking.confirmationMessage", "Sizin rezervasiyanız uğurla təsdiqləndi. Tezliklə sizinlə əlaqə saxlayacağıq.")}
            </p>
            
            {/* QR Code would go here */}
            <div className="w-48 h-48 bg-gray-200 mx-auto mb-6 flex items-center justify-center">
              <p className="text-gray-500">QR Code</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
              <h3 className="font-medium mb-4">{t("booking.bookingDetails", "Rezervasiya məlumatları")}</h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="text-gray-600">{t("booking.bookingDate", "Təyinat tarixi")}:</div>
                <div>{formData.date?.toLocaleDateString()} {formData.time}</div>
                
                <div className="text-gray-600">{t("booking.customer", "Müştəri")}:</div>
                <div>{formData.fullName}</div>
                
                <div className="text-gray-600">{t("booking.contact", "Əlaqə")}:</div>
                <div>{formData.phone}</div>
                
                <div className="text-gray-600">{t("booking.paymentMethod", "Ödəniş üsulu")}:</div>
                <div>{paymentMethod}</div>
                
                <div className="text-gray-600">{t("booking.totalAmount", "Cəmi")}:</div>
                <div className="font-medium">{calculateTotal()} AZN</div>
              </div>
              
              <p className="text-sm text-gray-500">
                {t("booking.saveBookingDetails", "Rezervasiyanızı saxlayın")}
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                {t("booking.print", "Çap et")}
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
              >
                {t("booking.backToHome", "Ana səhifəyə qayıt")}
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("booking.previous", "Əvvəlki")}
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNextStep}
                disabled={!canProceedToNextStep()}
              >
                {t("booking.next", "Növbəti")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : currentStep === 3 ? (
              <Button 
                onClick={handleSubmitBooking}
                disabled={!canProceedToNextStep()}
              >
                {t("booking.confirmBooking", "Rezervasiyanı təsdiqlə")}
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CheckoutFlow);
