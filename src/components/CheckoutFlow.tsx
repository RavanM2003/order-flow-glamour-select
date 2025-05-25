import React, { useState, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "./ui/button";
import { Check, ChevronLeft, ChevronRight, User, CreditCard, Calendar, CheckCircle, Search, Clock, Package, CreditCard as CardIcon, Banknote, Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/hooks/use-settings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/models/service.model";
import { Product } from "@/models/product.model";
import { Staff } from "@/models/staff.model";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import DiscountBadge from "./ui/discount-badge";
import PriceDisplay from "./ui/price-display";
import GenderSelector from "./GenderSelector";
import { useStaffByService } from "@/hooks/use-staff-by-service";
import { generateOrderId, calculateDiscountedPrice, formatDuration } from "@/utils/orderUtils";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, getCurrentDate, isWithinWorkingHours } from "@/utils/validation";

export type BookingMode = "customer" | "staff";

interface CheckoutFlowProps {
  bookingMode?: BookingMode;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  bookingMode = "customer",
}) => {
  const { t } = useLanguage();
  const { getLocalizedSetting } = useSettings();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});
  const [selectedStaff, setSelectedStaff] = useState<Record<number, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [servicesSearchTerm, setServicesSearchTerm] = useState("");
  const [productsSearchTerm, setProductsSearchTerm] = useState("");
  const [servicesPage, setServicesPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const { staff, loading: staffLoading, fetchStaffByService } = useStaffByService();
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    notes: "",
    date: null as Date | null,
    time: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch services with lazy loading
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services", servicesSearchTerm, servicesPage],
    queryFn: async () => {
      let query = supabase.from("services").select("*");
      
      if (servicesSearchTerm) {
        query = query.or(`name.ilike.%${servicesSearchTerm}%,description.ilike.%${servicesSearchTerm}%`);
      }
      
      const { data, error } = await query
        .order('discount', { ascending: false })
        .order('created_at', { ascending: false })
        .range((servicesPage - 1) * 6, servicesPage * 6 - 1);
      
      if (error) throw error;
      return data as Service[];
    },
  });

  // Fetch products with lazy loading
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", productsSearchTerm, productsPage],
    queryFn: async () => {
      let query = supabase.from("products").select("*");
      
      if (productsSearchTerm) {
        query = query.or(`name.ilike.%${productsSearchTerm}%,description.ilike.%${productsSearchTerm}%`);
      }
      
      const { data, error } = await query
        .order('discount', { ascending: false })
        .order('created_at', { ascending: false })
        .range((productsPage - 1) * 6, productsPage * 6 - 1);
      
      if (error) throw error;
      return data as Product[];
    },
  });

  // Fetch recommended products for selected services
  const { data: recommendedProducts } = useQuery({
    queryKey: ["recommended-products", selectedServices],
    queryFn: async () => {
      if (selectedServices.length === 0) return [];
      
      const { data, error } = await supabase
        .from("service_products")
        .select(`
          product_id,
          products (*)
        `)
        .in('service_id', selectedServices);
      
      if (error) throw error;
      return data?.map(item => item.products).filter(Boolean) as Product[];
    },
    enabled: selectedServices.length > 0,
  });

  // Get settings for booking
  const maxBookingDays = parseInt(getLocalizedSetting("max_booking_days") || "30");
  const workingHoursStart = getLocalizedSetting("working_hours_start") || "09:00";
  const workingHoursEnd = getLocalizedSetting("working_hours_end") || "19:00";
  const bankName = getLocalizedSetting("bank_name");
  const bankAccountName = getLocalizedSetting("bank_account_name");
  const bankAccountNumber = getLocalizedSetting("bank_account_number");
  const bankSwift = getLocalizedSetting("bank_swift");

  // Step calculation
  const totalSteps = 5;

  // Step icons
  const stepIcons = [
    { icon: User, label: t("booking.customerInfo") },
    { icon: Calendar, label: t("booking.services") },
    { icon: Package, label: t("booking.products") },
    { icon: CreditCard, label: t("booking.payment") },
    { icon: CheckCircle, label: t("booking.confirmation") },
  ];

  // Validation function
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.fullName || formData.fullName.length < 10 || formData.fullName.length > 100) {
          errors.fullName = t("booking.fullNameValidation");
        }
        if (!formData.gender) {
          errors.gender = t("booking.genderRequired");
        }
        if (!formData.email || !validateEmail(formData.email)) {
          errors.email = t("booking.emailValidation");
        }
        if (!formData.phone) {
          errors.phone = t("booking.phoneRequired");
        }
        if (!formData.date) {
          errors.date = t("booking.dateRequired");
        }
        if (!formData.time) {
          errors.time = t("booking.timeRequired");
        } else if (!isWithinWorkingHours(formData.time, workingHoursStart, workingHoursEnd)) {
          errors.time = t("booking.timeOutsideWorkingHours");
        }
        break;
      case 2:
        if (selectedServices.length === 0) {
          errors.services = t("booking.servicesRequired");
        }
        // Check if all selected services have assigned staff
        const missingStaff = selectedServices.filter(serviceId => !selectedStaff[serviceId]);
        if (missingStaff.length > 0) {
          errors.staff = t("booking.staffRequired");
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Load staff when service is selected and date is available
  useEffect(() => {
    if (selectedServices.length > 0 && formData.date) {
      selectedServices.forEach(serviceId => {
        fetchStaffByService(serviceId, formData.date!);
      });
    }
  }, [selectedServices, formData.date, fetchStaffByService]);

  // Calculate totals
  const calculateServiceTotal = () => {
    let total = 0;
    let originalTotal = 0;
    
    if (services) {
      services.forEach(service => {
        if (selectedServices.includes(service.id)) {
          const originalPrice = parseFloat(service.price.toString());
          const discountedPrice = calculateDiscountedPrice(originalPrice, service.discount);
          originalTotal += originalPrice;
          total += discountedPrice;
        }
      });
    }
    
    return { total, originalTotal, savings: originalTotal - total };
  };

  const calculateProductTotal = () => {
    let total = 0;
    let originalTotal = 0;
    
    if (products) {
      products.forEach(product => {
        const quantity = selectedProducts[product.id] || 0;
        if (quantity > 0) {
          const originalPrice = parseFloat(product.price.toString()) * quantity;
          const discountedPrice = calculateDiscountedPrice(parseFloat(product.price.toString()), product.discount) * quantity;
          originalTotal += originalPrice;
          total += discountedPrice;
        }
      });
    }
    
    return { total, originalTotal, savings: originalTotal - total };
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    
    if (services) {
      services.forEach(service => {
        if (selectedServices.includes(service.id)) {
          totalMinutes += service.duration;
        }
      });
    }
    
    return totalMinutes;
  };

  const calculateEndTime = () => {
    if (!formData.time) return "";
    
    const totalMinutes = calculateTotalDuration();
    const bufferMinutes = Math.ceil(totalMinutes * 0.05); // 5% buffer
    const totalWithBuffer = totalMinutes + bufferMinutes;
    
    const [hours, minutes] = formData.time.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(startTime.getTime() + totalWithBuffer * 60000);
    return endTime.toTimeString().slice(0, 5);
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
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
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Toggle service selection
  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => {
      const newSelected = prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      // If deselecting, remove staff assignment
      if (prev.includes(serviceId)) {
        const newStaffAssignments = { ...selectedStaff };
        delete newStaffAssignments[serviceId];
        setSelectedStaff(newStaffAssignments);
      }
      
      return newSelected;
    });
  };

  // Toggle product selection
  const toggleProduct = (productId: number, quantity: number = 1) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: quantity > 0 ? quantity : 0
    }));
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
    setShowBankDetails(method === "bank");
  };

  // Handle submit booking
  const handleSubmitBooking = async () => {
    try {
      const orderId = generateOrderId();
      const serviceTotal = calculateServiceTotal();
      const productTotal = calculateProductTotal();
      const totalAmount = serviceTotal.total + productTotal.total;
      const totalOriginalAmount = serviceTotal.originalTotal + productTotal.originalTotal;
      const totalSavings = serviceTotal.savings + productTotal.savings;

      // Prepare services data
      const servicesData = services?.filter(s => selectedServices.includes(s.id)).map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        discount: service.discount || 0,
        discounted_price: calculateDiscountedPrice(service.price, service.discount),
        user_id: selectedStaff[service.id]
      })) || [];

      // Prepare products data
      const productsData = products?.filter(p => selectedProducts[p.id] > 0).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: selectedProducts[product.id],
        discount: product.discount || 0,
        discounted_price: calculateDiscountedPrice(product.price, product.discount)
      })) || [];

      // Prepare invoice data
      const invoiceData = {
        invoice_number: orderId,
        total_amount: totalAmount,
        status: 'waiting',
        appointment_json: {
          customer_info: {
            full_name: formData.fullName,
            gender: formData.gender,
            email: formData.email,
            number: formData.phone,
            note: formData.notes,
            date: formData.date?.toISOString().split('T')[0],
            time: formData.time
          },
          services: servicesData,
          products: productsData,
          request_info: {
            ip: "127.0.0.1", // Would be actual IP in production
            device: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
            os: navigator.platform,
            browser: navigator.userAgent.split(' ').pop(),
            entry_time: new Date().toISOString(),
            page: "/booking"
          },
          payment_details: {
            method: paymentMethod,
            total_amount: totalOriginalAmount,
            discount_amount: totalSavings,
            paid_amount: totalAmount
          }
        }
      };

      // Insert into invoices table
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Send confirmation email (would be implemented with an edge function)
      console.log("Booking submitted:", data);
      
      // Store invoice data for confirmation page
      setFormData(prev => ({ ...prev, invoiceId: data.id, orderNumber: orderId }));
      
      toast({
        title: t("booking.bookingConfirmed"),
        description: t("booking.confirmationMessage"),
      });
      
      handleNextStep();
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        variant: "destructive",
        title: t("booking.error"),
        description: t("booking.errorMessage"),
      });
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
                <span className="text-xs sm:text-sm text-center hidden md:block">
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
            <h2 className="text-2xl font-bold mb-6">{t("booking.customerInfo")}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.fullName")} *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleFormChange("fullName", e.target.value)}
                  className={cn(
                    "w-full p-2 border rounded-md",
                    validationErrors.fullName ? "border-red-500" : ""
                  )}
                  placeholder={t("booking.fullNamePlaceholder")}
                  required
                />
                {validationErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                )}
              </div>
              
              <GenderSelector
                selectedGender={formData.gender}
                onGenderSelect={(gender) => handleFormChange("gender", gender)}
              />
              {validationErrors.gender && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
              )}
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.email")} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className={cn(
                    "w-full p-2 border rounded-md",
                    validationErrors.email ? "border-red-500" : ""
                  )}
                  placeholder={t("booking.emailPlaceholder")}
                  required
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.phone")} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className={cn(
                    "w-full p-2 border rounded-md",
                    validationErrors.phone ? "border-red-500" : ""
                  )}
                  placeholder={t("booking.phonePlaceholder")}
                  required
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.notes")}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder={t("booking.notesPlaceholder")}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    {t("booking.date")} *
                  </label>
                  <input
                    type="date"
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      handleFormChange("date", date);
                    }}
                    className={cn(
                      "w-full p-2 border rounded-md",
                      validationErrors.date ? "border-red-500" : ""
                    )}
                    required
                    min={getCurrentDate()}
                    max={new Date(Date.now() + maxBookingDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("booking.availableForNextDays")} {maxBookingDays} {t("booking.days")}
                  </p>
                  {validationErrors.date && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    {t("booking.time")} *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleFormChange("time", e.target.value)}
                    className={cn(
                      "w-full p-2 border rounded-md",
                      validationErrors.time ? "border-red-500" : ""
                    )}
                    required
                    min={workingHoursStart}
                    max={workingHoursEnd}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("booking.workingHours")}: {workingHoursStart} - {workingHoursEnd}
                  </p>
                  {validationErrors.time && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.time}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Services Selection */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("booking.services")}</h2>
            
            {/* Search Services */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("booking.searchServices")}
                  value={servicesSearchTerm}
                  onChange={(e) => setServicesSearchTerm(e.target.value)}
                  className="w-full pl-10 p-2 border rounded-md"
                />
              </div>
            </div>
            
            {servicesLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : services && services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className={cn(
                      "border rounded-lg p-4 relative",
                      selectedServices.includes(service.id) ? "border-glamour-500 bg-glamour-50" : "",
                      service.discount && service.discount > 0 ? "border-red-200" : ""
                    )}
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
                            <span>{service.duration} {t("booking.minutes")}</span>
                          </div>
                          <Link to={`/services/${service.id}`} className="text-glamour-700 hover:underline">
                            {t("booking.moreInfo")}
                          </Link>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {service.description || t("booking.noDescription")}
                        </p>
                        
                        {/* Staff selection for this service */}
                        {selectedServices.includes(service.id) && (
                          <div className="mt-4">
                            <label className="block mb-1 text-sm font-medium">
                              {t("booking.selectStaff")}
                            </label>
                            <select
                              value={selectedStaff[service.id] || ""}
                              onChange={(e) => assignStaff(service.id, e.target.value)}
                              className="w-full p-2 border rounded-md"
                              required
                            >
                              <option value="">{t("booking.chooseStaff")}</option>
                              {!staffLoading && staff?.map((staffMember) => (
                                <option key={staffMember.id} value={staffMember.id}>
                                  {staffMember.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Load More Services */}
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setServicesPage(prev => prev + 1)}
                    disabled={servicesLoading}
                  >
                    {t("booking.loadMore")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">{t("booking.noServices")}</div>
            )}
            
            {selectedServices.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">{t("booking.selectedServices")}</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {services?.filter(s => selectedServices.includes(s.id)).map((service) => (
                    <div key={service.id} className="flex justify-between items-center mb-2">
                      <div className="flex-grow">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          ({service.duration} {t("booking.minutes")})
                          {selectedStaff[service.id] && staff && (
                            <span className="ml-1">
                              - {staff.find(s => s.id === selectedStaff[service.id])?.full_name}
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
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>{t("booking.servicesTotal")}:</span>
                      <span>{calculateServiceTotal().total.toFixed(2)} AZN</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{t("booking.totalDuration")}:</span>
                      <span>{formatDuration(calculateTotalDuration())}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {validationErrors.services && (
              <p className="text-red-500 text-sm mt-2">{validationErrors.services}</p>
            )}
            {validationErrors.staff && (
              <p className="text-red-500 text-sm mt-2">{validationErrors.staff}</p>
            )}
          </div>
        )}

        {/* Step 3: Products Selection */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("booking.products")}</h2>
            
            {/* Search Products */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("booking.searchProducts")}
                  value={productsSearchTerm}
                  onChange={(e) => setProductsSearchTerm(e.target.value)}
                  className="w-full pl-10 p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Recommended Products */}
            {recommendedProducts && recommendedProducts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">{t("booking.recommendedProducts")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className={cn(
                        "border rounded-lg p-4 relative",
                        selectedProducts[product.id] > 0 ? "border-glamour-500 bg-glamour-50" : "",
                        product.discount && product.discount > 0 ? "border-red-200" : ""
                      )}
                    >
                      <DiscountBadge discount={product.discount || 0} />
                      
                      <h4 className="font-medium mb-2">{product.name}</h4>
                      <PriceDisplay 
                        price={product.price} 
                        discount={product.discount}
                        className="mb-2"
                      />
                      <Link to={`/products/${product.id}`} className="text-glamour-700 hover:underline text-sm">
                        {t("booking.moreInfo")}
                      </Link>
                      
                      <div className="mt-4 flex items-center space-x-2">
                        <button
                          onClick={() => toggleProduct(product.id, Math.max(0, (selectedProducts[product.id] || 0) - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{selectedProducts[product.id] || 0}</span>
                        <button
                          onClick={() => toggleProduct(product.id, (selectedProducts[product.id] || 0) + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("booking.allProducts")}</h3>
              {productsLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : products && products.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products
                      .filter(product => !recommendedProducts?.some(rp => rp.id === product.id))
                      .map((product) => (
                        <div 
                          key={product.id} 
                          className={cn(
                            "border rounded-lg p-4 relative",
                            selectedProducts[product.id] > 0 ? "border-glamour-500 bg-glamour-50" : "",
                            product.discount && product.discount > 0 ? "border-red-200" : ""
                          )}
                        >
                          <DiscountBadge discount={product.discount || 0} />
                          
                          <h4 className="font-medium mb-2">{product.name}</h4>
                          <PriceDisplay 
                            price={product.price} 
                            discount={product.discount}
                            className="mb-2"
                          />
                          <Link to={`/products/${product.id}`} className="text-glamour-700 hover:underline text-sm">
                            {t("booking.moreInfo")}
                          </Link>
                          
                          <div className="mt-4 flex items-center space-x-2">
                            <button
                              onClick={() => toggleProduct(product.id, Math.max(0, (selectedProducts[product.id] || 0) - 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{selectedProducts[product.id] || 0}</span>
                            <button
                              onClick={() => toggleProduct(product.id, (selectedProducts[product.id] || 0) + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  {/* Load More Products */}
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setProductsPage(prev => prev + 1)}
                      disabled={productsLoading}
                    >
                      {t("booking.loadMore")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">{t("booking.noProducts")}</div>
              )}
            </div>

            {/* Selected Products Summary */}
            {Object.values(selectedProducts).some(qty => qty > 0) && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">{t("booking.selectedProducts")}</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {products?.filter(p => selectedProducts[p.id] > 0).map((product) => (
                    <div key={product.id} className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-gray-600 ml-2">x{selectedProducts[product.id]}</span>
                      </div>
                      <PriceDisplay 
                        price={product.price * selectedProducts[product.id]} 
                        discount={product.discount}
                        showCurrency={true}
                      />
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                    <span>{t("booking.productsTotal")}:</span>
                    <span>{calculateProductTotal().total.toFixed(2)} AZN</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("booking.payment")}</h2>
            
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-4">{t("booking.orderSummary")}</h3>
              
              {/* Customer Details */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">{t("booking.customerDetails")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">{t("booking.fullName")}:</div>
                  <div>{formData.fullName}</div>
                  
                  <div className="text-gray-600">{t("booking.email")}:</div>
                  <div>{formData.email}</div>
                  
                  <div className="text-gray-600">{t("booking.phone")}:</div>
                  <div>{formData.phone}</div>
                  
                  <div className="text-gray-600">{t("booking.appointmentDate")}:</div>
                  <div>
                    {formData.date?.toLocaleDateString()} {formData.time}
                    <div className="text-xs text-gray-500">
                      {t("booking.duration")}: {formatDuration(calculateTotalDuration())}
                      <br />
                      {t("booking.endTime")}: {calculateEndTime()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Services */}
              {selectedServices.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{t("booking.services")}</h4>
                  {services?.filter(s => selectedServices.includes(s.id)).map((service) => (
                    <div key={service.id} className="flex justify-between text-sm mb-1">
                      <div>
                        {service.name}
                        <span className="text-gray-500 ml-2">
                          ({service.duration} {t("booking.minutes")})
                          {selectedStaff[service.id] && staff && (
                            <span className="ml-1">
                              - {staff.find(s => s.id === selectedStaff[service.id])?.full_name}
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
                  <div className="text-sm mt-2 pt-2 border-t">
                    <div className="flex justify-between">
                      <span>{t("booking.servicesTotal")}:</span>
                      <PriceDisplay 
                        price={calculateServiceTotal().originalTotal} 
                        discount={calculateServiceTotal().savings > 0 ? (calculateServiceTotal().savings / calculateServiceTotal().originalTotal) * 100 : 0}
                        showCurrency={true}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Products */}
              {Object.values(selectedProducts).some(qty => qty > 0) && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{t("booking.products")}</h4>
                  {products?.filter(p => selectedProducts[p.id] > 0).map((product) => (
                    <div key={product.id} className="flex justify-between text-sm mb-1">
                      <div>
                        {product.name}
                        <span className="text-gray-500 ml-2">x{selectedProducts[product.id]}</span>
                      </div>
                      <PriceDisplay 
                        price={product.price * selectedProducts[product.id]} 
                        discount={product.discount}
                        showCurrency={true}
                      />
                    </div>
                  ))}
                  <div className="text-sm mt-2 pt-2 border-t">
                    <div className="flex justify-between">
                      <span>{t("booking.productsTotal")}:</span>
                      <PriceDisplay 
                        price={calculateProductTotal().originalTotal} 
                        discount={calculateProductTotal().savings > 0 ? (calculateProductTotal().savings / calculateProductTotal().originalTotal) * 100 : 0}
                        showCurrency={true}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Total */}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>{t("booking.total")}:</span>
                  <PriceDisplay 
                    price={calculateServiceTotal().originalTotal + calculateProductTotal().originalTotal} 
                    discount={((calculateServiceTotal().savings + calculateProductTotal().savings) / (calculateServiceTotal().originalTotal + calculateProductTotal().originalTotal)) * 100}
                    showCurrency={true}
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div>
              <h3 className="font-medium mb-4">{t("booking.paymentMethod")}</h3>
              
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
                  <Banknote className="h-5 w-5 mr-3 text-green-600" />
                  <div>
                    <div className="font-medium">{t("booking.cashPayment")}</div>
                    <div className="text-sm text-gray-500">{t("booking.cashPaymentDesc")}</div>
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
                  <CardIcon className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">{t("booking.cardPayment")}</div>
                    <div className="text-sm text-gray-500">{t("booking.cardPaymentDesc")}</div>
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
                  <CreditCard className="h-5 w-5 mr-3 text-purple-600" />
                  <div>
                    <div className="font-medium">{t("booking.posTerminal")}</div>
                    <div className="text-sm text-gray-500">{t("booking.posTerminalDesc")}</div>
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
                    <Building2 className="h-5 w-5 mr-3 text-red-600" />
                    <div>
                      <div className="font-medium">{t("booking.bankTransfer")}</div>
                      <div className="text-sm text-gray-500">{t("booking.bankTransferDesc")}</div>
                    </div>
                  </label>
                  
                  {showBankDetails && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-md text-sm">
                      <h4 className="font-medium mb-2">{t("booking.bankDetails")}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                        <div className="text-gray-600">{t("booking.bankName")}:</div>
                        <div>{bankName}</div>
                        
                        <div className="text-gray-600">{t("booking.accountName")}:</div>
                        <div>{bankAccountName}</div>
                        
                        <div className="text-gray-600">{t("booking.accountNumber")}:</div>
                        <div>{bankAccountNumber}</div>
                        
                        <div className="text-gray-600">{t("booking.swiftCode")}:</div>
                        <div>{bankSwift}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{t("booking.bookingConfirmed")}</h2>
            <p className="text-gray-600 mb-6">
              {t("booking.confirmationMessage")}
            </p>
            
            <div className="w-48 h-48 bg-gray-200 mx-auto mb-6 flex items-center justify-center">
              <p className="text-gray-500">QR Code - /booking/{(formData as any).orderNumber}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
              <h3 className="font-medium mb-4">{t("booking.bookingDetails")}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
                <div className="text-gray-600">{t("booking.bookingDate")}:</div>
                <div>{formData.date?.toLocaleDateString()} {formData.time}</div>
                
                <div className="text-gray-600">{t("booking.customer")}:</div>
                <div>{formData.fullName}</div>
                
                <div className="text-gray-600">{t("booking.contact")}:</div>
                <div>{formData.phone}</div>
                
                <div className="text-gray-600">{t("booking.paymentMethod")}:</div>
                <div>{paymentMethod}</div>
                
                <div className="text-gray-600">{t("booking.totalAmount")}:</div>
                <div className="font-medium">{(calculateServiceTotal().total + calculateProductTotal().total).toFixed(2)} AZN</div>
              </div>
              
              <p className="text-sm text-gray-500">
                {t("booking.saveBookingDetails")}
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                {t("booking.print")}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = `/booking/${(formData as any).orderNumber}`}
              >
                {t("booking.detailed")}
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
              >
                {t("booking.backToHome")}
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("booking.previous")}
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 4 ? (
              <Button 
                onClick={handleNextStep}
              >
                {t("booking.next")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : currentStep === 4 ? (
              <Button 
                onClick={handleSubmitBooking}
              >
                {t("booking.confirmBooking")}
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
