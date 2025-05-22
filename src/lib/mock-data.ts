
// Mock data for users
import { User, UserRole } from "@/models/user.model";
import { Appointment, AppointmentStatus } from "@/models/appointment.model";
import { Service } from "@/models/service.model";
import { Staff } from "@/models/staff.model";

// Fix the fullName property to use full_name
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    full_name: "Admin User",
    role: "admin",
    gender: "male",
    phone: "+1234567890",
    hashed_password: "password123",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "staff@example.com",
    full_name: "Staff User",
    role: "staff",
    gender: "female",
    phone: "+1234567891",
    hashed_password: "password123",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "customer@example.com",
    full_name: "Customer User",
    role: "customer",
    gender: "other",
    phone: "+1234567892",
    hashed_password: "password123",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  }
];

// Mock data for services
const mockServices = [
  {
    id: 1,
    name: "Haircut",
    description: "A professional haircut service",
    price: 30.0,
    duration: 30,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Manicure",
    description: "A relaxing manicure service",
    price: 25.0,
    duration: 45,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Facial",
    description: "A rejuvenating facial service",
    price: 50.0,
    duration: 60,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  }
];

// Mock data for staff members
const mockStaffMembers = [
  {
    id: "1",
    name: "John Doe",
    position: "Hair Stylist",
    specializations: [1],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    user_id: "2",
  },
  {
    id: "2",
    name: "Jane Smith",
    position: "Manicurist",
    specializations: [2],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    user_id: "2",
  },
  {
    id: "3",
    name: "Peter Jones",
    position: "Facialist",
    specializations: [3],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    user_id: "2",
  }
];

// Fix appointment status to use AppointmentStatus type
const mockAppointments = [
  {
    id: 1,
    customer_user_id: "3",
    appointment_date: "2023-06-01",
    start_time: "10:00:00",
    end_time: "11:00:00",
    status: "scheduled" as AppointmentStatus,
    total: 50.0,
    user_id: "2",
    cancel_reason: "",
    created_at: "2023-05-25T10:00:00Z",
    updated_at: "2023-05-25T10:00:00Z",
    is_no_show: false
  },
  {
    id: 2,
    customer_user_id: "3",
    appointment_date: "2023-06-02",
    start_time: "14:00:00",
    end_time: "15:00:00",
    status: "completed" as AppointmentStatus,
    total: 75.0,
    user_id: "2",
    cancel_reason: "",
    created_at: "2023-05-25T14:00:00Z",
    updated_at: "2023-06-02T15:15:00Z",
    is_no_show: false
  },
  {
    id: 3,
    customer_user_id: "3",
    appointment_date: "2023-06-03",
    start_time: "11:00:00",
    end_time: "12:00:00",
    status: "cancelled" as AppointmentStatus,
    total: 60.0,
    user_id: "2",
    cancel_reason: "Customer requested cancellation",
    created_at: "2023-05-26T11:00:00Z",
    updated_at: "2023-05-30T09:30:00Z",
    is_no_show: false
  }
];

export { mockUsers, mockServices, mockStaffMembers, mockAppointments };
