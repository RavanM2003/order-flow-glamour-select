
// Mock data for local development

// Mock customers
export const mockCustomers = [
  {
    id: 1,
    name: 'Ayşə Məmmədova',
    email: 'ayse@example.com',
    phone: '+994 50 123 45 67',
    gender: 'female',
    lastVisit: '2024-05-01',
    totalSpent: 450
  },
  {
    id: 2,
    name: 'Elvin Əliyev',
    email: 'elvin@example.com',
    phone: '+994 55 987 65 43',
    gender: 'male',
    lastVisit: '2024-05-08',
    totalSpent: 320
  },
  {
    id: 3,
    name: 'Leyla Həsənova',
    email: 'leyla@example.com',
    phone: '+994 70 456 78 90',
    gender: 'female',
    lastVisit: '2024-05-10',
    totalSpent: 580
  },
  {
    id: 4,
    name: 'Farid Qasımov',
    email: 'farid@example.com',
    phone: '+994 51 234 56 78',
    gender: 'male',
    lastVisit: '2024-05-12',
    totalSpent: 210
  },
  {
    id: 5,
    name: 'Nigar Camalova',
    email: 'nigar@example.com',
    phone: '+994 77 345 67 89',
    gender: 'female',
    lastVisit: '2024-05-15',
    totalSpent: 680
  }
];

// Mock staff members
export const mockStaff = [
  { id: 1, name: 'Aynur Hüseynova', position: 'Makeup Artist', specializations: ['Makeup', 'Skincare'] },
  { id: 2, name: 'Samir Quliyev', position: 'Hair Stylist', specializations: ['Hair Cutting', 'Styling'] },
  { id: 3, name: 'Günay Əlizadə', position: 'Nail Technician', specializations: ['Manicure', 'Pedicure'] },
  { id: 4, name: 'Kamran Əhmədov', position: 'Barber', specializations: ['Men Haircuts', 'Shaving'] },
  { id: 5, name: 'Səbinə Rüstəmova', position: 'Esthetician', specializations: ['Facials', 'Waxing'] }
];

// Mock services
export const mockServices = [
  { 
    id: 1, 
    name: "Facial Treatment", 
    price: 150, 
    duration: "60 min", 
    description: "Deep cleansing facial with premium products",
    relatedProducts: [1, 2]
  },
  { 
    id: 2, 
    name: "Massage Therapy", 
    price: 120, 
    duration: "45 min", 
    description: "Relaxing full body massage",
    relatedProducts: [3]
  },
  { 
    id: 3, 
    name: "Manicure", 
    price: 50, 
    duration: "30 min", 
    description: "Nail care and polish application",
    relatedProducts: [4]
  },
  { 
    id: 4, 
    name: "Hair Styling", 
    price: 80, 
    duration: "45 min", 
    description: "Professional hair styling",
    relatedProducts: [5, 6]
  },
  { 
    id: 5, 
    name: "Makeup Application", 
    price: 90, 
    duration: "60 min", 
    description: "Full face makeup for special events",
    relatedProducts: [7, 8]
  }
];

// Mock products
export const mockProducts = [
  { id: 1, name: "Moisturizer Cream", price: 45, description: "Hydrating face cream for daily use" },
  { id: 2, name: "Anti-Aging Serum", price: 75, description: "Premium anti-aging formula with collagen" },
  { id: 3, name: "Massage Oil", price: 35, description: "Natural oils blend for body massage" },
  { id: 4, name: "Nail Care Kit", price: 30, description: "Complete kit for nail maintenance" },
  { id: 5, name: "Hair Care Kit", price: 60, description: "Complete kit for healthy hair" },
  { id: 6, name: "Hair Spray", price: 25, description: "Strong hold hair spray" },
  { id: 7, name: "Foundation", price: 40, description: "Long-lasting foundation with SPF" },
  { id: 8, name: "Makeup Brushes Set", price: 55, description: "Professional quality makeup brushes" }
];

// Mock appointments with detailed information
export const mockAppointments = [
  {
    id: 1,
    customerId: 1,
    date: '2024-06-10',
    startTime: '10:00',
    endTime: '11:00',
    status: 'completed',
    service: 'Facial Treatment',
    staff: ['Aynur Hüseynova'],
    products: ['Moisturizer Cream', 'Anti-Aging Serum'],
    totalAmount: 270,
    amountPaid: 270,
    remainingBalance: 0
  },
  {
    id: 2,
    customerId: 2,
    date: '2024-06-15',
    startTime: '14:00',
    endTime: '15:30',
    status: 'pending',
    service: 'Hair Styling',
    staff: ['Samir Quliyev'],
    products: ['Hair Care Kit'],
    totalAmount: 140,
    amountPaid: 70,
    remainingBalance: 70
  },
  {
    id: 3,
    customerId: 1,
    date: '2024-06-18',
    startTime: '16:00',
    endTime: '16:30',
    status: 'confirmed',
    service: 'Manicure',
    staff: ['Günay Əlizadə'],
    products: [],
    totalAmount: 50,
    amountPaid: 0,
    remainingBalance: 50
  },
  {
    id: 4,
    customerId: 3,
    date: '2024-06-20',
    startTime: '11:00',
    endTime: '12:00',
    status: 'pending',
    service: 'Makeup Application',
    staff: ['Aynur Hüseynova'],
    products: ['Foundation', 'Makeup Brushes Set'],
    totalAmount: 185,
    amountPaid: 100,
    remainingBalance: 85
  },
  {
    id: 5,
    customerId: 2,
    date: '2024-05-30',
    startTime: '13:00',
    endTime: '14:00',
    status: 'rejected',
    service: 'Massage Therapy',
    staff: [],
    products: [],
    totalAmount: 120,
    amountPaid: 0,
    remainingBalance: 0,
    rejectionReason: 'Customer canceled appointment'
  }
];
