import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import CustomerInfo from "./CustomerInfo";
import { Button } from "./ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/hooks/use-settings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/models/service.model";
import { Product } from "@/models/product.model";
import { Staff } from "@/models/staff.model";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showBankDetails, setShowBankDetails] = useState(false);
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

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data as Product[];
    },
  });

  // Fetch staff
  const { data: staffMembers, isLoading: staffLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, role, position")
        .eq("role", "staff");
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
  const totalSteps = 5;

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    
    // Add services price
    if (services) {
      services.forEach(service => {
        if (selectedServices.includes(service.id)) {
          total += parseFloat(service.price.toString());
        }
      });
    }
    
    // Add products price
    if (products) {
      products.forEach(product => {
        if (selectedProducts.includes(product.id)) {
          total += parseFloat(product.price.toString());
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

  // Toggle product selection
  const toggleProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
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
      products: selectedProducts,
      paymentMethod,
      total: calculateTotal()
    });
    
    // Here you would submit the booking to your API
    // For now, just move to the confirmation step
    handleNextStep();
  };

  // Get service related products
  const getServiceRelatedProducts = () => {
    if (!products || selectedServices.length === 0) return [];
    
    // For this example, we'll just return all products
    // In a real application, you would filter based on related services
    return products;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center ${
                currentStep >= step ? "text-glamour-800" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? "bg-glamour-700 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              {step < totalSteps && (
                <div
                  className={`hidden sm:block h-1 w-10 ${
                    currentStep > step ? "bg-glamour-700" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-5 gap-2 text-xs sm:text-sm text-center">
          <div className={currentStep === 1 ? "font-semibold text-glamour-800" : ""}>
            {t("booking.customerInfo")}
          </div>
          <div className={currentStep === 2 ? "font-semibold text-glamour-800" : ""}>
            {t("booking.services")}
          </div>
          <div className={currentStep === 3 ? "font-semibold text-glamour-800" : ""}>
            {t("booking.products")}
          </div>
          <div className={currentStep === 4 ? "font-semibold text-glamour-800" : ""}>
            {t("booking.payment")}
          </div>
          <div className={currentStep === 5 ? "font-semibold text-glamour-800" : ""}>
            {t("booking.confirmation")}
          </div>
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
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.gender")}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={() => handleFormChange("gender", "male")}
                      className="mr-2"
                    />
                    <span>{t("booking.male")}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={() => handleFormChange("gender", "female")}
                      className="mr-2"
                    />
                    <span>{t("booking.female")}</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t("booking.email")} *
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
                  {t("booking.phone")} *
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
                  {t("booking.notes")}
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
                    {t("booking.date")} *
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
                    {t("booking.availableForNextDays", { days: maxBookingDays })}
                  </p>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    {t("booking.time")} *
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
                    {t("booking.workingHours", { start: workingHoursStart, end: workingHoursEnd })}
                  </p>
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
              <input
                type="text"
                placeholder={t("booking.searchServices")}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            {servicesLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : services && services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className={`border rounded-lg p-4 ${
                      selectedServices.includes(service.id) ? "border-glamour-500 bg-glamour-50" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="mt-1"
                      />
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between">
                          <label htmlFor={`service-${service.id}`} className="font-medium cursor-pointer">
                            {service.name}
                          </label>
                          <span className="font-semibold">{service.price} AZN</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>{service.duration} min</span>
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
              <div className="text-center py-8">{t("booking.noServices")}</div>
            )}
            
            {selectedServices.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">{t("booking.selectedServices")}</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {services?.filter(s => selectedServices.includes(s.id)).map((service) => (
                    <div key={service.id} className="flex justify-between mb-2">
                      <span>{service.name}</span>
                      <span>{service.price} AZN</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                    <span>{t("booking.servicesTotal")}:</span>
                    <span>
                      {services?.reduce((total, service) => 
                        selectedServices.includes(service.id) ? 
                          total + parseFloat(service.price.toString()) : total, 0
                      ).toFixed(2)} AZN
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Products Selection */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("booking.products")}</h2>
            
            {/* Search Products */}
            <div className="mb-6">
              <input
                type="text"
                placeholder={t("booking.searchProducts")}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            {/* Recommended Products based on selected services */}
            {selectedServices.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">{t("booking.recommendedProducts")}</h3>
                {productsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getServiceRelatedProducts().slice(0, 4).map((product) => (
                      <div 
                        key={product.id}
                        className={`border rounded-lg p-4 ${
                          selectedProducts.includes(product.id) ? "border-glamour-500 bg-glamour-50" : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProduct(product.id)}
                            className="mt-1"
                          />
                          <div className="ml-3 flex-grow">
                            <div className="flex justify-between">
                              <label htmlFor={`product-${product.id}`} className="font-medium cursor-pointer">
                                {product.name}
                              </label>
                              <span className="font-semibold">{product.price} AZN</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {product.description || t("booking.noDescription")}
                            </p>
                            <div className="text-right mt-2">
                              <Link to={`/products/${product.id}`} className="text-sm text-glamour-700 hover:underline">
                                {t("booking.moreInfo")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* All Products */}
            <div>
              <h3 className="text-lg font-medium mb-4">{t("booking.allProducts")}</h3>
              {productsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div 
                      key={product.id}
                      className={`border rounded-lg p-4 ${
                        selectedProducts.includes(product.id) ? "border-glamour-500 bg-glamour-50" : ""
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id={`product-all-${product.id}`}
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProduct(product.id)}
                          className="mt-1"
                        />
                        <div className="ml-3 flex-grow">
                          <div className="flex justify-between">
                            <label htmlFor={`product-all-${product.id}`} className="font-medium cursor-pointer">
                              {product.name}
                            </label>
                            <span className="font-semibold">{product.price} AZN</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {product.description || t("booking.noDescription")}
                          </p>
                          <div className="text-right mt-2">
                            <Link to={`/products/${product.id}`} className="text-sm text-glamour-700 hover:underline">
                              {t("booking.moreInfo")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">{t("booking.noProducts")}</div>
              )}
            </div>
            
            {selectedProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">{t("booking.selectedProducts")}</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {products?.filter(p => selectedProducts.includes(p.id)).map((product) => (
                    <div key={product.id} className="flex justify-between mb-2">
                      <span>{product.name}</span>
                      <span>{product.price} AZN</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                    <span>{t("booking.productsTotal")}:</span>
                    <span>
                      {products?.reduce((total, product) => 
                        selectedProducts.includes(product.id) ? 
                          total + parseFloat(product.price.toString()) : total, 0
                      ).toFixed(2)} AZN
                    </span>
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
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">{t("booking.fullName")}:</div>
                  <div>{formData.fullName}</div>
                  
                  <div className="text-gray-600">{t("booking.email")}:</div>
                  <div>{formData.email}</div>
                  
                  <div className="text-gray-600">{t("booking.phone")}:</div>
                  <div>{formData.phone}</div>
                  
                  <div className="text-gray-600">{t("booking.appointmentDate")}:</div>
                  <div>{formData.date?.toLocaleDateString()} {formData.time}</div>
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
                          ({service.duration} min)
                          {selectedStaff[service.id] && staffMembers && (
                            <span className="ml-1">
                              - {staffMembers.find(s => s.id === selectedStaff[service.id])?.full_name}
                            </span>
                          )}
                        </span>
                      </div>
                      <div>{service.price} AZN</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Products */}
              {selectedProducts.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{t("booking.products")}</h4>
                  {products?.filter(p => selectedProducts.includes(p.id)).map((product) => (
                    <div key={product.id} className="flex justify-between text-sm mb-1">
                      <div>{product.name}</div>
                      <div>{product.price} AZN</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Total */}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>{t("booking.total")}:</span>
                  <span>{calculateTotal()} AZN</span>
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
                    <div>
                      <div className="font-medium">{t("booking.bankTransfer")}</div>
                      <div className="text-sm text-gray-500">{t("booking.bankTransferDesc")}</div>
                    </div>
                  </label>
                  
                  {showBankDetails && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-md text-sm">
                      <h4 className="font-medium mb-2">{t("booking.bankDetails")}</h4>
                      <div className="grid grid-cols-2 gap-y-2">
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
            
            {/* QR Code would go here */}
            <div className="w-48 h-48 bg-gray-200 mx-auto mb-6 flex items-center justify-center">
              <p className="text-gray-500">QR Code</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
              <h3 className="font-medium mb-4">{t("booking.bookingDetails")}</h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="text-gray-600">{t("booking.bookingDate")}:</div>
                <div>{formData.date?.toLocaleDateString()} {formData.time}</div>
                
                <div className="text-gray-600">{t("booking.customer")}:</div>
                <div>{formData.fullName}</div>
                
                <div className="text-gray-600">{t("booking.contact")}:</div>
                <div>{formData.phone}</div>
                
                <div className="text-gray-600">{t("booking.paymentMethod")}:</div>
                <div>{paymentMethod}</div>
                
                <div className="text-gray-600">{t("booking.totalAmount")}:</div>
                <div className="font-medium">{calculateTotal()} AZN</div>
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
              <Button onClick={handleNextStep}>
                {t("booking.next")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : currentStep === 4 ? (
              <Button 
                onClick={handleSubmitBooking}
                disabled={
                  // Validation checks
                  !formData.fullName || 
                  !formData.email ||
                  !formData.phone || 
                  !formData.date ||
                  !formData.time ||
                  selectedServices.length === 0 ||
                  // Check if all selected services have staff assigned
                  Object.keys(selectedStaff).length !== selectedServices.length
                }
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
