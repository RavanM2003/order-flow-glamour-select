// Mock data for development and testing
import { Customer } from "@/models/customer.model";
import { Staff } from "@/models/staff.model";
import { Service } from "@/models/service.model";
import { Product } from "@/models/product.model";
import { Appointment, AppointmentStatus } from "@/models/appointment.model";
import { User, UserRole } from "@/models/user.model";
import { addDays, format, addHours, addMinutes, parseISO } from "date-fns";

// Generate a random date within the next 30 days
const getRandomFutureDate = () => {
  const daysToAdd = Math.floor(Math.random() * 30) + 1;
  return addDays(new Date(), daysToAdd);
};

// Format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

// Format time as HH:mm
const formatTime = (date: Date) => {
  return format(date, "HH:mm");
};

// Generate a random time between 9 AM and 6 PM
const getRandomBusinessHourTime = () => {
  const baseHour = 9 + Math.floor(Math.random() * 9); // 9 AM to 6 PM
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    baseHour,
    minutes
  );
};

// Generate a random appointment duration (30, 45, 60, 90, or 120 minutes)
const getRandomDuration = () => {
  return [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)];
};

// Generate a random price between min and max
const getRandomPrice = (min: number, max: number) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random boolean
const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

// Generate a random element from an array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a random subset of an array
const getRandomSubset = <T>(array: T[], maxSize?: number): T[] => {
  const size = maxSize
    ? Math.floor(Math.random() * maxSize) + 1
    : Math.floor(Math.random() * array.length) + 1;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
};

// Generate a random phone number
const getRandomPhone = () => {
  return `+994${Math.floor(Math.random() * 10)}${Math.floor(
    Math.random() * 10000000
  )
    .toString()
    .padStart(7, "0")}`;
};

// Generate a random email
const getRandomEmail = (name: string) => {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "mail.ru"];
  const sanitizedName = name.toLowerCase().replace(/\s+/g, ".");
  return `${sanitizedName}${Math.floor(
    Math.random() * 1000
  )}@${getRandomElement(domains)}`;
};

// Generate a random date in the past
const getRandomPastDate = (yearsBack = 1) => {
  const now = new Date();
  const pastDate = new Date(
    now.getFullYear() - Math.floor(Math.random() * yearsBack),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );
  return pastDate;
};

// Generate a random appointment status
const getRandomAppointmentStatus = (): AppointmentStatus => {
  const statuses: AppointmentStatus[] = ["scheduled", "completed", "cancelled"];
  return getRandomElement(statuses);
};

// Generate a random payment status
const getRandomPaymentStatus = () => {
  return getRandomElement(["paid", "unpaid", "partial"]);
};

// Generate mock customers
export const generateMockCustomers = (count: number): Customer[] => {
  const femaleNames = [
    "Aysel Mammadova",
    "Leyla Aliyeva",
    "Nigar Jafarova",
    "Gunel Hasanova",
    "Sabina Ahmadova",
    "Konul Karimova",
    "Fidan Huseynova",
    "Narmin Ismayilova",
    "Aygun Valiyeva",
    "Sevinj Rustamova",
  ];

  const maleNames = [
    "Elchin Mammadov",
    "Farid Aliyev",
    "Rashad Jafarov",
    "Tural Hasanov",
    "Orkhan Ahmadov",
    "Vugar Karimov",
    "Anar Huseynov",
    "Elvin Ismayilov",
    "Samir Valiyev",
    "Fuad Rustamov",
  ];

  return Array.from({ length: count }, (_, i) => {
    const isFemale = Math.random() > 0.5;
    const name = isFemale
      ? getRandomElement(femaleNames)
      : getRandomElement(maleNames);
    const gender = isFemale ? "female" : "male";
    const lastVisit = formatDate(getRandomPastDate());
    const totalSpent = getRandomPrice(50, 2000);

    return {
      id: (i + 1).toString(),
      name,
      email: getRandomEmail(name),
      phone: getRandomPhone(),
      gender,
      lastVisit,
      totalSpent,
      full_name: name,
      birth_date: formatDate(getRandomPastDate(30)),
      note: Math.random() > 0.7 ? "Regular customer" : "",
    };
  });
};

// Generate mock staff members
export const generateMockStaff = (count: number): Staff[] => {
  const femaleNames = [
    "Aysel Mammadova",
    "Leyla Aliyeva",
    "Nigar Jafarova",
    "Gunel Hasanova",
    "Sabina Ahmadova",
  ];

  const maleNames = [
    "Elchin Mammadov",
    "Farid Aliyev",
    "Rashad Jafarov",
    "Tural Hasanov",
    "Orkhan Ahmadov",
  ];

  const positions = [
    "Hair Stylist",
    "Nail Technician",
    "Makeup Artist",
    "Esthetician",
    "Massage Therapist",
    "Barber",
    "Salon Manager",
  ];

  return Array.from({ length: count }, (_, i) => {
    const isFemale = Math.random() > 0.5;
    const name = isFemale
      ? getRandomElement(femaleNames)
      : getRandomElement(maleNames);
    const position = getRandomElement(positions);
    const specializations = Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => Math.floor(Math.random() * 10) + 1
    );

    return {
      id: (i + 1).toString(),
      name,
      position,
      specializations,
      email: getRandomEmail(name),
      phone: getRandomPhone(),
      role_id: i + 1,
      salary: Math.random() > 0.5 ? getRandomInt(1000, 3000) : undefined,
      commissionRate: Math.random() > 0.5 ? getRandomInt(5, 25) : undefined,
      paymentType: getRandomElement(["salary", "commission", "hybrid"]),
    };
  });
};

// Generate mock services
export const generateMockServices = (count: number): Service[] => {
  const serviceNames = [
    "Haircut",
    "Hair Coloring",
    "Manicure",
    "Pedicure",
    "Facial",
    "Massage",
    "Waxing",
    "Hair Styling",
    "Makeup Application",
    "Hair Treatment",
    "Nail Art",
    "Eyebrow Shaping",
    "Eyelash Extensions",
    "Body Scrub",
    "Hair Extensions",
  ];

  const benefits = [
    "Relaxing experience",
    "Professional products used",
    "Long-lasting results",
    "Includes consultation",
    "Customized to your needs",
    "Organic products available",
    "Includes aftercare advice",
  ];

  return Array.from({ length: count }, (_, i) => {
    const name =
      i < serviceNames.length
        ? serviceNames[i]
        : `${getRandomElement(serviceNames)} Premium`;
    const duration = getRandomElement([30, 45, 60, 90, 120]);
    const price = getRandomPrice(20, 200);
    const serviceBenefits = getRandomSubset(benefits, 3);

    return {
      id: i + 1,
      name,
      description: `Professional ${name.toLowerCase()} service tailored to your preferences.`,
      duration,
      price,
      benefits: serviceBenefits,
      category_id: Math.floor(i / 3) + 1,
      is_active: Math.random() > 0.1, // 90% are active
    };
  });
};

// Generate mock products
export const generateMockProducts = (count: number): Product[] => {
  const productNames = [
    "Shampoo",
    "Conditioner",
    "Hair Mask",
    "Hair Spray",
    "Nail Polish",
    "Facial Cleanser",
    "Moisturizer",
    "Serum",
    "Body Lotion",
    "Hair Gel",
    "Hair Oil",
    "Face Mask",
    "Makeup Remover",
    "Sunscreen",
    "Lip Balm",
  ];

  const categories = [
    "Hair Care",
    "Skin Care",
    "Nail Care",
    "Makeup",
    "Body Care",
  ];

  return Array.from({ length: count }, (_, i) => {
    const name =
      i < productNames.length
        ? productNames[i]
        : `${getRandomElement(productNames)} Premium`;
    const price = getRandomPrice(10, 100);
    const stock = getRandomInt(5, 50);
    const category = getRandomElement(categories);

    return {
      id: i + 1,
      name,
      description: `High-quality ${name.toLowerCase()} for professional results.`,
      price,
      stock,
      category,
      image_url: Math.random() > 0.3 ? `https://picsum.photos/200?random=${i}` : undefined,
      isServiceRelated: Math.random() > 0.5,
    };
  });
};

// Generate mock appointments
export const generateMockAppointments = (
  count: number,
  customers: Customer[],
  staff: Staff[],
  services: Service[]
): Appointment[] => {
  return Array.from({ length: count }, (_, i) => {
    const customer = getRandomElement(customers);
    const service = getRandomElement(services);
    const staffMembers = getRandomSubset(staff, 2);
    const appointmentDate = getRandomFutureDate();
    const startTime = getRandomBusinessHourTime();
    const duration = service.duration || getRandomDuration();
    const endTime = addMinutes(startTime, duration);
    const status = getRandomAppointmentStatus();
    const totalAmount = service.price;
    const amountPaid =
      status === "completed"
        ? Math.random() > 0.8
          ? totalAmount * 0.5
          : totalAmount
        : 0;
    const isPaid = amountPaid >= totalAmount;
    const isNoShow = status === "cancelled" && Math.random() > 0.7;
    const cancelReason =
      status === "cancelled"
        ? isNoShow
          ? "No show"
          : "Customer cancelled"
        : "";

    return {
      id: (i + 1).toString(),
      customer_user_id: customer.id.toString(),
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
      notes: Math.random() > 0.7 ? "Customer requested specific stylist" : "",
      status: status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total: totalAmount,
      is_no_show: isNoShow,
      cancel_reason: cancelReason,
      appointment_date: formatDate(appointmentDate),
      
      // Additional properties for UI compatibility
      customerId: parseInt(customer.id.toString()),
      date: formatDate(appointmentDate),
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      service: service.name,
      staff: staffMembers.map(s => s.name),
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      remainingBalance: totalAmount - amountPaid,
      isPaid: isPaid,
      orderReference: `ORD-${10000 + i}`,
      duration: duration,
      servicePrice: service.price,
      paymentMethod: getRandomElement(["Cash", "Card", "Bank Transfer"]),
      services: [service],
      serviceProviders: staffMembers.map(s => ({
        id: parseInt(s.id.toString()),
        name: s.name,
        serviceId: service.id
      }))
    };
  });
};

// Generate mock users
export const generateMockUsers = (count: number): User[] => {
  const roles: UserRole[] = [
    "super_admin",
    "admin",
    "staff",
    "customer",
    "cash",
    "appointment",
    "service",
    "product",
    "reception"
  ];

  return Array.from({ length: count }, (_, i) => {
    const isFemale = Math.random() > 0.5;
    const firstName = isFemale
      ? getRandomElement([
          "Aysel",
          "Leyla",
          "Nigar",
          "Gunel",
          "Sabina",
          "Konul",
          "Fidan",
        ])
      : getRandomElement([
          "Elchin",
          "Farid",
          "Rashad",
          "Tural",
          "Orkhan",
          "Vugar",
          "Anar",
        ]);
    const lastName = isFemale
      ? getRandomElement([
          "Mammadova",
          "Aliyeva",
          "Jafarova",
          "Hasanova",
          "Ahmadova",
        ])
      : getRandomElement([
          "Mammadov",
          "Aliyev",
          "Jafarov",
          "Hasanov",
          "Ahmadov",
        ]);
    const fullName = `${firstName} ${lastName}`;
    const email = getRandomEmail(fullName);
    const role = i === 0 ? "super_admin" : getRandomElement(roles);

    return {
      id: (i + 1).toString(),
      email,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      gender: isFemale ? "female" : "male",
      role,
      phone: getRandomPhone(),
      avatar_url:
        Math.random() > 0.3
          ? `https://i.pravatar.cc/150?u=${email}`
          : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Compatibility fields
      firstName: firstName,
      lastName: lastName,
      isActive: true,
    };
  });
};

// Generate all mock data
export const generateMockData = (seed?: number) => {
  // If a seed is provided, use it to make the random data deterministic
  if (seed !== undefined) {
    Math.random = () => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  }

  const customers = generateMockCustomers(20);
  const staff = generateMockStaff(10);
  const services = generateMockServices(15);
  const products = generateMockProducts(25);
  const appointments = generateMockAppointments(30, customers, staff, services);
  const users = generateMockUsers(15);

  return {
    customers,
    staff,
    services,
    products,
    appointments,
    users,
  };
};

// Default export of mock data
export default generateMockData();
