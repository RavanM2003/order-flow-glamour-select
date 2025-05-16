
// Mock data for local development
import { AppointmentStatus } from '@/models/appointment.model';

// Helper function to create date strings for mock appointments 
const getDateString = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

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

// Generate appointments for the next 10 days
const generateMockAppointments = () => {
  const appointments = [];
  const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'rejected', 'cancelled'];
  let id = 1;
  
  // Generate 2-3 appointments per day for the next 10 days
  for (let day = 0; day < 10; day++) {
    const appointmentsPerDay = 2 + Math.floor(Math.random() * 2); // 2-3 appointments
    
    for (let i = 0; i < appointmentsPerDay; i++) {
      // Ensure a good mix of statuses, but more confirmed/pending for recent days
      let status: AppointmentStatus;
      if (day < 3) {
        // For more recent days, mostly pending and confirmed
        status = statuses[Math.floor(Math.random() * 2)];
      } else if (day < 7) {
        // Mid-range days, mix of all statuses
        status = statuses[Math.floor(Math.random() * statuses.length)];
      } else {
        // Past days, mostly completed with some rejected
        status = Math.random() > 0.2 ? 'completed' : 'rejected';
      }
      
      // Random customer
      const customerId = Math.floor(Math.random() * mockCustomers.length) + 1;
      
      // Random service
      const serviceIndex = Math.floor(Math.random() * mockServices.length);
      const service = mockServices[serviceIndex];
      
      // Random staff members (1-2)
      const staffCount = 1 + Math.floor(Math.random() * 2);
      const staffMembers = [];
      for (let s = 0; s < staffCount; s++) {
        const staffIndex = Math.floor(Math.random() * mockStaff.length);
        staffMembers.push(mockStaff[staffIndex].name);
      }
      
      // Random products (0-2)
      const productCount = Math.floor(Math.random() * 3);
      const products = [];
      let productTotal = 0;
      for (let p = 0; p < productCount; p++) {
        const productIndex = Math.floor(Math.random() * mockProducts.length);
        const product = mockProducts[productIndex];
        products.push(product.name);
        productTotal += product.price;
      }
      
      // Calculate times
      const hour = 9 + Math.floor(Math.random() * 8); // 9 AM - 5 PM
      const minute = Math.random() > 0.5 ? 0 : 30;
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Duration based on service
      const durationMinutes = parseInt(service.duration.split(' ')[0]);
      const endHour = hour + Math.floor((minute + durationMinutes) / 60);
      const endMinute = (minute + durationMinutes) % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      // Calculate total
      const servicePrice = service.price;
      const totalAmount = servicePrice + productTotal;
      
      // Calculate payment based on status
      let amountPaid = 0;
      let remainingBalance = totalAmount;
      
      if (status === 'completed') {
        amountPaid = totalAmount;
        remainingBalance = 0;
      } else if (status === 'confirmed') {
        // Some have partial payments
        if (Math.random() > 0.5) {
          amountPaid = Math.round(totalAmount * 0.5);
          remainingBalance = totalAmount - amountPaid;
        }
      }
      
      // Create appointment
      const appointment = {
        id: id++,
        customerId,
        date: getDateString(day),
        startTime,
        endTime,
        status,
        service: service.name,
        staff: staffMembers,
        products,
        totalAmount,
        amountPaid,
        remainingBalance,
        rejectionReason: status === 'rejected' ? 'Customer canceled appointment' : ''
      };
      
      appointments.push(appointment);
    }
  }
  
  return appointments;
};

// Mock appointments with detailed information
export const mockAppointments = generateMockAppointments();
