
import { ApiService } from './api.service';
import { Staff, StaffPayment, StaffServiceRecord, StaffFormData, StaffWorkingHours } from '@/models/staff.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockStaff } from '@/lib/mock-data';

// Mock data for staff payments and service records
const mockStaffPayments: StaffPayment[] = [
  {
    id: 1,
    staff_id: 1,
    amount: 500,
    payment_date: '2025-05-01',
    payment_type: 'salary',
    note: 'Monthly salary for May 2025',
    created_at: new Date().toISOString(),
    // Compatibility properties
    date: '2025-05-01',
    type: 'salary',
    description: 'Monthly salary for May 2025'
  },
  {
    id: 2,
    staff_id: 1,
    amount: 125,
    payment_date: '2025-05-12',
    payment_type: 'commission',
    note: 'Commission for services provided',
    created_at: new Date().toISOString(),
    date: '2025-05-12',
    type: 'commission',
    description: 'Commission for services provided'
  },
  {
    id: 3,
    staff_id: 2,
    amount: 450,
    payment_date: '2025-05-01',
    payment_type: 'salary',
    note: 'Monthly salary for May 2025',
    created_at: new Date().toISOString(),
    date: '2025-05-01',
    type: 'salary',
    description: 'Monthly salary for May 2025'
  },
  {
    id: 4,
    staff_id: 1,
    amount: 75,
    payment_date: '2025-05-15',
    payment_type: 'expense',
    note: 'Equipment expense',
    created_at: new Date().toISOString(),
    date: '2025-05-15',
    type: 'expense',
    description: 'Equipment expense'
  }
];

const mockServiceRecords: StaffServiceRecord[] = [
  {
    id: 1,
    staff_id: 1,
    customer_id: 201,
    customer_name: 'John Doe',
    service_id: 301,
    service_name: 'Facial Treatment',
    date: '2025-05-10',
    created_at: new Date().toISOString(),
    price: 250,
    amount: 250,
    commission: 25
  },
  {
    id: 2,
    staff_id: 1,
    customer_id: 202,
    customer_name: 'Jane Smith',
    service_id: 302,
    service_name: 'Massage Therapy',
    date: '2025-05-11',
    created_at: new Date().toISOString(),
    price: 300,
    amount: 300,
    commission: 30
  },
  {
    id: 3,
    staff_id: 2,
    customer_id: 203,
    customer_name: 'Alice Johnson',
    service_id: 303,
    service_name: 'Hair Styling',
    date: '2025-05-09',
    created_at: new Date().toISOString(),
    price: 150,
    amount: 150,
    commission: 15
  }
];

// Mock data for staff working hours
const mockWorkingHours: StaffWorkingHours[] = [
  {
    id: 1,
    staff_id: 1,
    day_of_week: 1, // Monday
    start_time: "09:00",
    end_time: "17:00",
    is_day_off: false
  },
  {
    id: 2,
    staff_id: 1,
    day_of_week: 2, // Tuesday
    start_time: "09:00",
    end_time: "17:00",
    is_day_off: false
  },
  {
    id: 3,
    staff_id: 1,
    day_of_week: 3, // Wednesday
    start_time: "09:00",
    end_time: "17:00",
    is_day_off: false
  },
  {
    id: 4,
    staff_id: 1,
    day_of_week: 4, // Thursday
    start_time: "09:00",
    end_time: "17:00",
    is_day_off: false
  },
  {
    id: 5,
    staff_id: 1,
    day_of_week: 5, // Friday
    start_time: "09:00",
    end_time: "17:00",
    is_day_off: false
  },
  {
    id: 6,
    staff_id: 1,
    day_of_week: 6, // Saturday
    start_time: "10:00",
    end_time: "14:00",
    is_day_off: false
  },
  {
    id: 7,
    staff_id: 1,
    day_of_week: 0, // Sunday
    start_time: "00:00",
    end_time: "00:00",
    is_day_off: true
  }
];

export class StaffService extends ApiService {
  // Get all staff
  async getAll(): Promise<ApiResponse<Staff[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      // Ensure position and specializations are set for all staff
      const staffList = [...mockStaff].map(s => {
        // Create a valid Staff object with all required properties
        const staffMember: Staff = {
          id: s.id,
          name: s.name || `Staff #${s.id}`, // Ensure name is set
          position: s.position || 'Staff Member', // Default position if not set
          specializations: (s.specializations || []).map(String), // Convert to string[]
          created_at: s.created_at || new Date().toISOString(),
          updated_at: s.updated_at || new Date().toISOString(),
          user_id: s.user_id || '',
          // Add optional fields with defaults if present
          ...(s.email !== undefined ? { email: s.email } : {}),
          ...(s.phone !== undefined ? { phone: s.phone } : {}),
          ...(s.role_id !== undefined ? { role_id: s.role_id } : {}),
          ...(s.avatar_url !== undefined ? { avatar_url: s.avatar_url } : {}),
          ...(s.salary !== undefined ? { salary: s.salary } : {}),
          ...(s.commissionRate !== undefined ? { commissionRate: s.commissionRate } : {}),
          ...(s.paymentType !== undefined ? { paymentType: s.paymentType } : {})
        };
        return staffMember;
      });
      
      return { data: staffList };
    }
    
    return this.get('/staff');
  }
  
  // Get a single staff member by id
  async getById(id: number | string): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const staff = mockStaff.find(s => s.id === Number(id));
      if (!staff) {
        return { error: 'Staff not found' };
      }
      
      // Ensure all required properties are set
      const staffMember: Staff = {
        id: staff.id,
        name: staff.name || `Staff #${staff.id}`,
        position: staff.position || 'Staff Member',
        specializations: (staff.specializations || []).map(String), // Convert to string[]
        created_at: staff.created_at || new Date().toISOString(),
        updated_at: staff.updated_at || new Date().toISOString(),
        user_id: staff.user_id || '',
        // Add optional fields if present
        ...(staff.email !== undefined ? { email: staff.email } : {}),
        ...(staff.phone !== undefined ? { phone: staff.phone } : {}),
        ...(staff.role_id !== undefined ? { role_id: staff.role_id } : {}),
        ...(staff.avatar_url !== undefined ? { avatar_url: staff.avatar_url } : {}),
        ...(staff.salary !== undefined ? { salary: staff.salary } : {}),
        ...(staff.commissionRate !== undefined ? { commissionRate: staff.commissionRate } : {}),
        ...(staff.paymentType !== undefined ? { paymentType: staff.paymentType } : {})
      };
      
      return { data: staffMember };
    }
    
    return this.get(`/staff/${id}`);
  }
  
  // Create a new staff member
  async create(data: StaffFormData): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newId = Math.max(...mockStaff.map(s => s.id || 0), 0) + 1;
      
      // Create a new valid Staff object
      const newStaff: Staff = { 
        id: newId,
        name: data.name,
        position: data.position,
        specializations: data.specializations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: '',
        email: data.email,
        phone: data.phone,
        salary: data.salary,
        commissionRate: data.commissionRate,
        paymentType: data.paymentType,
        role_id: data.role_id
      };
      
      mockStaff.push(newStaff);
      
      // Create default working hours for new staff member
      this.createDefaultWorkingHours(newId);
      
      return { data: newStaff };
    }
    
    return this.post('/staff', data);
  }
  
  // Update an existing staff member
  async update(id: number | string, data: Partial<StaffFormData>): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockStaff.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        // Update the staff member with proper type handling
        const existingStaff = mockStaff[index];
        
        // Create a valid Staff object with updated fields
        const updatedStaff: Staff = { 
          id: existingStaff.id,
          name: data.name || existingStaff.name || `Staff #${existingStaff.id}`,
          position: data.position || existingStaff.position || 'Staff Member',
          specializations: (data.specializations || existingStaff.specializations || []).map(String),
          updated_at: new Date().toISOString(),
          created_at: existingStaff.created_at || new Date().toISOString(),
          user_id: existingStaff.user_id || '',
          // Preserve other optional fields
          ...(existingStaff.email !== undefined || data.email !== undefined ? 
              { email: data.email || existingStaff.email } : {}),
          ...(existingStaff.phone !== undefined || data.phone !== undefined ? 
              { phone: data.phone || existingStaff.phone } : {}),
          ...(existingStaff.role_id !== undefined || data.role_id !== undefined ? 
              { role_id: data.role_id || existingStaff.role_id } : {}),
          ...(existingStaff.avatar_url !== undefined ? 
              { avatar_url: existingStaff.avatar_url } : {}),
          ...(existingStaff.salary !== undefined || data.salary !== undefined ? 
              { salary: data.salary || existingStaff.salary } : {}),
          ...(existingStaff.commissionRate !== undefined || data.commissionRate !== undefined ? 
              { commissionRate: data.commissionRate || existingStaff.commissionRate } : {}),
          ...(existingStaff.paymentType !== undefined || data.paymentType !== undefined ? 
              { paymentType: data.paymentType || existingStaff.paymentType } : {})
        };
        
        mockStaff[index] = updatedStaff;
        return { data: updatedStaff };
      }
      return { error: 'Staff not found' };
    }
    
    return this.put(`/staff/${id}`, data);
  }
  
  // Delete a staff member
  async delete(id: number | string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockStaff.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        mockStaff.splice(index, 1);
        return { data: true };
      }
      return { error: 'Staff not found' };
    }
    
    return super.delete(`/staff/${id}`);
  }
  
  // Get payments for a staff member
  async getPayments(id: number | string): Promise<ApiResponse<StaffPayment[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const payments = mockStaffPayments.filter(p => p.staff_id === Number(id));
      return { data: [...payments] };
    }
    
    return this.get(`/staff/${id}/payments`);
  }
  
  // Get service records for a staff member
  async getServiceRecords(id: number | string): Promise<ApiResponse<StaffServiceRecord[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const records = mockServiceRecords.filter(r => r.staff_id === Number(id));
      return { data: [...records] };
    }
    
    return this.get(`/staff/${id}/service-records`);
  }
  
  // Calculate earnings for a staff member
  async calculateEarnings(id: number | string, month: number, year: number): Promise<ApiResponse<{
    salary: number;
    commission: number;
    expenses: number;
    total: number;
  }>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get staff data
      const staff = mockStaff.find(s => s.id === Number(id));
      if (!staff) {
        return { error: 'Staff not found' };
      }
      
      // Filter payments for the specified month
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      
      const payments = mockStaffPayments.filter(p => {
        const paymentDate = new Date(p.payment_date || p.date || '');
        return p.staff_id === Number(id) && 
               paymentDate >= monthStart && 
               paymentDate <= monthEnd;
      });
      
      // Calculate totals
      const salary = payments
        .filter(p => p.payment_type === 'salary' || p.type === 'salary')
        .reduce((sum, p) => sum + p.amount, 0);
        
      const commission = payments
        .filter(p => p.payment_type === 'commission' || p.type === 'commission')
        .reduce((sum, p) => sum + p.amount, 0);
        
      const expenses = payments
        .filter(p => p.payment_type === 'expense' || p.type === 'expense')
        .reduce((sum, p) => sum + p.amount, 0);
      
      return { 
        data: {
          salary,
          commission,
          expenses,
          total: salary + commission - expenses
        }
      };
    }
    
    return this.get(`/staff/${id}/earnings?month=${month}&year=${year}`);
  }

  // NEW FUNCTIONS FOR WORKING HOURS

  // Get working hours for a staff member
  async getWorkingHours(id: number | string): Promise<ApiResponse<StaffWorkingHours[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const hours = mockWorkingHours.filter(h => h.staff_id === Number(id));
      return { data: [...hours] };
    }
    
    return this.get(`/staff/${id}/working-hours`);
  }

  // Update working hours for a staff member
  async updateWorkingHours(staffId: number | string, dayOfWeek: number, hours: Partial<StaffWorkingHours>): Promise<ApiResponse<StaffWorkingHours>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockWorkingHours.findIndex(h => 
        h.staff_id === Number(staffId) && h.day_of_week === dayOfWeek
      );
      
      if (index >= 0) {
        // Create a normalized version with the correct property names
        const updatedHours: StaffWorkingHours = {
          ...mockWorkingHours[index],
          ...hours,
          staff_id: Number(staffId),
          day_of_week: dayOfWeek,
          start_time: hours.start_time || mockWorkingHours[index].start_time,
          end_time: hours.end_time || mockWorkingHours[index].end_time,
          is_day_off: hours.is_day_off !== undefined ? hours.is_day_off : mockWorkingHours[index].is_day_off
        };
        
        mockWorkingHours[index] = updatedHours;
        return { data: updatedHours };
      }
      
      // If not found, create new working hour entry
      const newId = Math.max(...mockWorkingHours.map(h => h.id || 0), 0) + 1;
      const newHours: StaffWorkingHours = {
        id: newId,
        staff_id: Number(staffId),
        day_of_week: dayOfWeek,
        start_time: hours.start_time || "09:00",
        end_time: hours.end_time || "17:00",
        is_day_off: hours.is_day_off !== undefined ? hours.is_day_off : false
      };
      
      mockWorkingHours.push(newHours);
      return { data: newHours };
    }
    
    return this.put(`/staff/${staffId}/working-hours/${dayOfWeek}`, hours);
  }

  // Create default working hours for a new staff member
  private createDefaultWorkingHours(staffId: number): void {
    if (config.usesMockData) {
      // Generate default working hours for each day of the week
      const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // 0 = Sunday, 1 = Monday, etc.
      
      daysOfWeek.forEach(day => {
        const isWeekend = (day === 0 || day === 6);
        const newId = Math.max(...mockWorkingHours.map(h => h.id || 0), 0) + 1 + day;
        const isDayOff = day === 0; // Sunday is off
        const startTime = isWeekend ? (day === 6 ? "10:00" : "00:00") : "09:00"; // Saturday: 10:00, Sunday: Off
        const endTime = isWeekend ? (day === 6 ? "14:00" : "00:00") : "17:00"; // Saturday: 14:00, Sunday: Off
        
        mockWorkingHours.push({
          id: newId,
          staff_id: staffId,
          day_of_week: day,
          start_time: startTime,
          end_time: endTime,
          is_day_off: isDayOff
        });
      });
    }
  }

  // Check if staff is available at a specific time
  async checkAvailability(staffId: number | string, date: Date): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get day of week (0-6, where 0 is Sunday)
      const dayOfWeek = date.getDay();
      
      // Get hours for this day
      const workingHoursForDay = mockWorkingHours.find(h => 
        h.staff_id === Number(staffId) && h.day_of_week === dayOfWeek
      );
      
      if (!workingHoursForDay) {
        return { data: false }; // No working hours defined for this day
      }
      
      if (workingHoursForDay.is_day_off) {
        return { data: false }; // Not a working day
      }
      
      // Check if time is within working hours
      const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      const isAfterStart = timeString >= workingHoursForDay.start_time;
      const isBeforeEnd = timeString <= workingHoursForDay.end_time;
      
      return { data: isAfterStart && isBeforeEnd };
    }
    
    return this.get(`/staff/${staffId}/availability?date=${date.toISOString()}`);
  }
}

// Create a singleton instance
export const staffService = new StaffService();
