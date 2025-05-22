import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  OrderContextType,
  OrderState,
  BookingMode,
  Customer,
  Service,
  Staff,
  Product,
} from "./OrderContext.d";

type OrderProviderProps = {
  children: ReactNode;
  initialCustomer?: Customer;
};

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

export const OrderProvider: React.FC<OrderProviderProps> = ({
  children,
  initialCustomer,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingMode, setBookingMode] = useState<BookingMode>("salon");

  const [customer, setCustomerState] = useState<Customer>(
    initialCustomer || {
      id: "",
      name: "",
      email: "",
      phone: "",
      gender: "female",
      lastVisit: "",
      totalSpent: 0,
    }
  );

  const [selectedService, setSelectedServiceState] = useState<Service | null>(
    null
  );
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedStaff, setSelectedStaffState] = useState<Staff | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [serviceProviders, setServiceProviders] = useState<Array<{
    serviceId: number;
    name: string;
  }> | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const calculateTotal = useCallback((): number => {
    let total = 0;

    // Add service price
    if (selectedService) {
      total += selectedService.price;
    }

    // Add product prices
    total += selectedProducts.reduce(
      (sum, product) => sum + (product.price || 0),
      0
    );

    return total;
  }, [selectedService, selectedProducts]);

  const addProduct = useCallback((productId: number) => {
    setSelectedProducts((prev) => {
      // Check if product already exists to avoid duplicates
      if (prev.some((p) => p.id === productId)) {
        return prev;
      }
      // Here we would typically fetch the product details based on ID
      // For now, create a minimal product object
      const newProduct: Product = {
        id: productId,
        name: `Product ${productId}`,
        price: 0, // Default price, would be fetched from API
      };
      return [...prev, newProduct];
    });
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const setNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, []);

  const setPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const setStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  const resetOrder = useCallback(() => {
    setCurrentStep(1);
    setCustomerState(
      initialCustomer || {
        id: "",
        name: "",
        email: "",
        phone: "",
        gender: "female",
        lastVisit: "",
        totalSpent: 0,
      }
    );
    setSelectedServiceState(null);
    setSelectedStaffState(null);
    setSelectedProducts([]);
    setAppointmentDate(null);
    setAppointmentTime(null);
    setPaymentMethod(null);
    setServiceProviders(null);
    setOrderId(null);
    setSelectedServices([]);
  }, [initialCustomer]);

  const completeOrder = useCallback((id: string) => {
    setOrderId(id);
  }, []);

  const addServiceProvider = useCallback(
    (serviceId: number, staffName: string) => {
      setServiceProviders((prev) => {
        const newProviders = prev ? [...prev] : [];
        const existingIndex = newProviders.findIndex(
          (p) => p.serviceId === serviceId
        );

        if (existingIndex >= 0) {
          newProviders[existingIndex] = { serviceId, name: staffName };
        } else {
          newProviders.push({ serviceId, name: staffName });
        }

        return newProviders;
      });
    },
    []
  );

  const selectService = useCallback((serviceId: number) => {
    setSelectedServices((prev) => {
      if (!prev.includes(serviceId)) {
        return [...prev, serviceId];
      }
      return prev;
    });
  }, []);

  const unselectService = useCallback((serviceId: number) => {
    setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
  }, []);

  // Wrapper functions to handle type conversions
  const setCustomer = useCallback((customerData: Customer) => {
    setCustomerState(customerData);
  }, []);

  const setSelectedService = useCallback((service: Service | null) => {
    setSelectedServiceState(service);
  }, []);

  const setSelectedStaff = useCallback((staff: Staff | null) => {
    setSelectedStaffState(staff);
  }, []);

  const value: OrderContextType = {
    orderState: {
      currentStep,
      bookingMode,
      customer,
      selectedService,
      selectedStaff,
      selectedProducts,
      selectedServices,
      appointmentDate,
      appointmentTime,
      totalAmount: calculateTotal(),
      paymentMethod,
      serviceProviders,
    },
    setCustomer,
    setSelectedService,
    setSelectedStaff,
    addProduct,
    removeProduct,
    setAppointmentDate,
    setAppointmentTime,
    setNextStep,
    setPrevStep,
    goToStep,
    resetOrder,
    setPaymentMethod,
    completeOrder,
    addServiceProvider,
    selectService,
    unselectService,
    setBookingMode,
    calculateTotal,
    nextStep,
    prevStep,
    setStep,
    addService: (service: Service) => {
      setSelectedServiceState(service);
      selectService(service.id);
    },
    removeService: (serviceId: number) => {
      if (selectedService?.id === serviceId) {
        setSelectedServiceState(null);
      }
      unselectService(serviceId);
    },
    setStaff: (staff: Staff | null) => {
      setSelectedStaffState(staff);
    },
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
