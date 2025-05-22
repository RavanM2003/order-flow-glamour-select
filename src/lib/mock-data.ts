import { Appointment, AppointmentStatus } from "@/models/appointment.model";
import { Customer } from "@/models/customer.model";
import { Product } from "@/models/product.model";
import { Service } from "@/models/service.model";
import { Staff } from "@/models/staff.model";
import { User, UserRole } from "@/models/user.model";

export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    role: 'admin',
    phone: '123-456-7890',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    roleId: '1'
  },
  {
    id: 'user2',
    email: 'staff@example.com',
    firstName: 'Staff',
    lastName: 'User',
    fullName: 'Staff User',
    role: 'staff',
    phone: '123-456-7891',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    staffId: 'staff1',
    roleId: '2'
  },
  {
    id: 'user3',
    email: 'customer@example.com',
    firstName: 'Customer',
    lastName: 'User',
    fullName: 'Customer User',
    role: 'customer',
    phone: '123-456-7892',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    roleId: '3'
  },
];

export const mockStaff: Staff[] = [
  {
    id: 'staff1',
    name: 'John Doe',
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    position: 'Hair Stylist',
    specializations: [1, 2],
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    user_id: 'user2',
    paymentType: 'salary',
    salary: 50000,
    commissionRate: 0.1,
    role_id: '2'
  },
  {
    id: 'staff2',
    name: 'Jane Smith',
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    position: 'Nail Technician',
    specializations: [3],
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    user_id: 'user3',
    paymentType: 'commission',
    salary: 0,
    commissionRate: 0.2,
    role_id: '3'
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust123',
    name: 'Alice Johnson',
    full_name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-111-2222',
    gender: 'female',
    birth_date: '1990-05-15',
    note: 'Prefers organic products',
    created_at: '2023-01-05T00:00:00.000Z',
    updated_at: '2023-01-05T00:00:00.000Z',
    lastVisit: '2023-04-20T00:00:00.000Z',
    totalSpent: 250.00,
    user_id: 'user3'
  },
  {
    id: 'cust456',
    name: 'Bob Williams',
    full_name: 'Bob Williams',
    email: 'bob.williams@example.com',
    phone: '555-333-4444',
    gender: 'male',
    birth_date: '1985-10-20',
    note: 'Interested in new services',
    created_at: '2023-02-10T00:00:00.000Z',
    updated_at: '2023-02-10T00:00:00.000Z',
    lastVisit: '2023-04-25T00:00:00.000Z',
    totalSpent: 180.50,
    user_id: 'user3'
  },
];

export const mockServices: Service[] = [
  {
    id: 1,
    name: 'Haircut',
    description: 'A professional haircut service',
    price: 35.00,
    duration: 30,
    created_at: '2023-04-01T00:00:00.000Z',
    updated_at: '2023-04-01T00:00:00.000Z',
    relatedProducts: []
  },
  {
    id: 2,
    name: 'Manicure',
    description: 'A relaxing manicure session',
    price: 25.00,
    duration: 45,
    created_at: '2023-04-01T00:00:00.000Z',
    updated_at: '2023-04-01T00:00:00.000Z',
    relatedProducts: []
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Shampoo',
    description: 'A high-quality shampoo for all hair types',
    price: 15.00,
    stock: 50,
    created_at: '2023-04-01T00:00:00.000Z',
    updated_at: '2023-04-01T00:00:00.000Z',
    stock_quantity: 50
  },
  {
    id: 2,
    name: 'Nail Polish',
    description: 'A vibrant nail polish collection',
    price: 8.00,
    stock: 100,
    created_at: '2023-04-01T00:00:00.000Z',
    updated_at: '2023-04-01T00:00:00.000Z',
    stock_quantity: 100
  },
];

// Update to use AppointmentStatus type
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    customer_user_id: 'cust123',
    appointment_date: '2023-05-01',
    start_time: '10:00',
    end_time: '11:00',
    status: 'scheduled', // Ensure this is a valid AppointmentStatus
    total: 50,
    user_id: 'user123',
    cancel_reason: '',
    created_at: '2023-04-28T10:00:00Z',
    updated_at: '2023-04-28T10:00:00Z',
    is_no_show: false
  },
  {
    id: 2,
    customer_user_id: 'cust456',
    appointment_date: '2023-05-02',
    start_time: '14:00',
    end_time: '15:30',
    status: 'confirmed', // Ensure this is a valid AppointmentStatus
    total: 75,
    user_id: 'user123',
    cancel_reason: '',
    created_at: '2023-04-29T14:00:00Z',
    updated_at: '2023-04-29T14:00:00Z',
    is_no_show: false
  },
  {
    id: 3,
    customer_user_id: 'cust123',
    appointment_date: '2023-05-03',
    start_time: '16:00',
    end_time: '17:00',
    status: 'completed', // Ensure this is a valid AppointmentStatus
    total: 60,
    user_id: 'user123',
    cancel_reason: '',
    created_at: '2023-04-30T16:00:00Z',
    updated_at: '2023-04-30T16:00:00Z',
    is_no_show: false
  },
  {
    id: 4,
    customer_user_id: 'cust456',
    appointment_date: '2023-05-04',
    start_time: '09:00',
    end_time: '10:00',
    status: 'cancelled', // Ensure this is a valid AppointmentStatus
    total: 0,
    user_id: 'user123',
    cancel_reason: 'Customer request',
    created_at: '2023-05-01T09:00:00Z',
    updated_at: '2023-05-01T09:00:00Z',
    is_no_show: false
  },
  {
    id: 5,
    customer_user_id: 'cust123',
    appointment_date: '2023-05-05',
    start_time: '11:00',
    end_time: '12:00',
    status: 'no_show', // Ensure this is a valid AppointmentStatus
    total: 40,
    user_id: 'user123',
    cancel_reason: '',
    created_at: '2023-05-02T11:00:00Z',
    updated_at: '2023-05-02T11:00:00Z',
    is_no_show: true
  },
];
