
import { ApiService } from './api.service';
import { Staff, StaffPayment, StaffServiceRecord, StaffFormData, StaffWorkingHours } from '@/models/staff.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockStaff } from '@/lib/mock-data';

// Mock data for staff payments and service records
const mockStaffPayments: StaffPayment[] = [
  {
    id: 1,
    staffId: 1,
    amount: 500,
    date: '2025-05-01',
    type: 'salary',
    description: 'Monthly salary for May 2025'
  },
  {
    id: 2,
    staffId: 1,
    amount: 125,
    date: '2025-05-12',
    type: 'commission',
    description: 'Commission for services provided'
  },
  {
    id: 3,
    staffId: 2,
    amount: 450,
    date: '2025-05-01',
    type: 'salary',
    description: 'Monthly salary for May 2025'
  },
  {
    id: 4,
    staffId: 1,
    amount: 75,
    date: '2025-05-15',
    type: 'expense',
    description: 'Equipment expense'
  }
];

const mockServiceRecords: StaffServiceRecord[] = [
  {
    id: 1,
    staffId: 1,
    customerId: 201,
    customerName: 'John Doe',
    serviceId: 301,
    serviceName: 'Facial Treatment',
    date: '2025-05-10',
    amount: 250,
    commission: 25
  },
  {
    id: 2,
    staffId: 1,
    customerId: 202,
    customerName: 'Jane Smith',
    serviceId: 302,
    serviceName: 'Massage Therapy',
    date: '2025-05-11',
    amount: 300,
    commission: 30
  },
  {
    id: 3,
    staffId: 2,
    customerId: 203,
    customerName: 'Alice Johnson',
    serviceId: 303,
    serviceName: 'Hair Styling',
    date: '2025-05-09',
    amount: 150,
    commission: 15
  }
];

// Mock data for staff working hours
const mockWorkingHours: StaffWorkingHours[] = [
  {
    id: 1,
    staffId: 1,
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "17:00",
    isWorkingDay: true
  },
  {
    id: 2,
    staffId: 1,
    dayOfWeek: 2, // Tuesday
    startTime: "09:00",
    endTime: "17:00",
    isWorkingDay: true
  },
  {
    id: 3,
    staffId: 1,
    dayOfWeek: 3, // Wednesday
    startTime: "09:00",
    endTime: "17:00",
    isWorkingDay: true
  },
  {
    id: 4,
    staffId: 1,
    dayOfWeek: 4, // Thursday
    startTime: "09:00",
    endTime: "17:00",
    isWorkingDay: true
  },
  {
    id: 5,
    staffId: 1,
    dayOfWeek: 5, // Friday
    startTime: "09:00",
    endTime: "17:00",
    isWorkingDay: true
  },
  {
    id: 6,
    staffId: 1,
    dayOfWeek: 6, // Saturday
    startTime: "10:00",
    endTime: "14:00",
    isWorkingDay: true
  },
  {
    id: 7,
    staffId: 1,
    dayOfWeek: 0, // Sunday
    startTime: "00:00",
    endTime: "00:00",
    isWorkingDay: false
  }
];

export class StaffService extends ApiService {
  // Get all staff
  async getAll(): Promise<ApiResponse<Staff[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      // Ensure position is set for all staff
      const staffList = [...mockStaff].map(s => ({
        ...s,
        position: s.position || 'Staff Member' // Default position if not set
      })) as Staff[];
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
      // Ensure position is set
      return { 
        data: {
          ...staff,
          position: staff.position || 'Staff Member' // Default position if not set
        } as Staff
      };
    }
    
    return this.get(`/staff/${id}`);
  }
  
  // Create a new staff member
  async create(data: StaffFormData): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newId = Math.max(...mockStaff.map(s => s.id || 0), 0) + 1;
      
      // Ensure required fields
      const newStaff: Staff = { 
        id: newId,
        name: data.name,
        position: data.position || 'Staff Member', // Ensure position is never empty
        specializations: data.specializations || [],
        email: data.email,
        phone: data.phone,
        salary: data.salary,
        commissionRate: data.commissionRate,
        paymentType: data.paymentType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        // Ensure position remains set when updating
        mockStaff[index] = { 
          ...mockStaff[index], 
          ...data,
          position: data.position || mockStaff[index].position || 'Staff Member',
          updated_at: new Date().toISOString()
        } as Staff;
        return { data: mockStaff[index] as Staff };
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
      const payments = mockStaffPayments.filter(p => p.staffId === Number(id));
      return { data: [...payments] };
    }
    
    return this.get(`/staff/${id}/payments`);
  }
  
  // Get service records for a staff member
  async getServiceRecords(id: number | string): Promise<ApiResponse<StaffServiceRecord[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const records = mockServiceRecords.filter(r => r.staffId === Number(id));
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
        const paymentDate = new Date(p.date);
        return p.staffId === Number(id) && 
               paymentDate >= monthStart && 
               paymentDate <= monthEnd;
      });
      
      // Calculate totals
      const salary = payments
        .filter(p => p.type === 'salary')
        .reduce((sum, p) => sum + p.amount, 0);
        
      const commission = payments
        .filter(p => p.type === 'commission')
        .reduce((sum, p) => sum + p.amount, 0);
        
      const expenses = payments
        .filter(p => p.type === 'expense')
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
      const hours = mockWorkingHours.filter(h => h.staffId === Number(id));
      return { data: [...hours] };
    }
    
    return this.get(`/staff/${id}/working-hours`);
  }

  // Update working hours for a staff member
  async updateWorkingHours(staffId: number | string, dayOfWeek: number, hours: Partial<StaffWorkingHours>): Promise<ApiResponse<StaffWorkingHours>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockWorkingHours.findIndex(h => 
        h.staffId === Number(staffId) && h.dayOfWeek === dayOfWeek
      );
      
      if (index >= 0) {
        mockWorkingHours[index] = {
          ...mockWorkingHours[index],
          ...hours,
          staffId: Number(staffId),
          dayOfWeek
        };
        return { data: mockWorkingHours[index] };
      }
      
      // If not found, create new working hour entry
      const newId = Math.max(...mockWorkingHours.map(h => h.id || 0), 0) + 1;
      const newHours: StaffWorkingHours = {
        id: newId,
        staffId: Number(staffId),
        dayOfWeek,
        startTime: hours.startTime || "09:00",
        endTime: hours.endTime || "17:00",
        isWorkingDay: hours.isWorkingDay !== undefined ? hours.isWorkingDay : true
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
        
        mockWorkingHours.push({
          id: newId,
          staffId,
          dayOfWeek: day,
          startTime: isWeekend ? (day === 6 ? "10:00" : "00:00") : "09:00", // Saturday: 10:00, Sunday: Off
          endTime: isWeekend ? (day === 6 ? "14:00" : "00:00") : "17:00",   // Saturday: 14:00, Sunday: Off
          isWorkingDay: day !== 0 // Sunday is off by default
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
        h.staffId === Number(staffId) && h.dayOfWeek === dayOfWeek
      );
      
      if (!workingHoursForDay) {
        return { data: false }; // No working hours defined for this day
      }
      
      if (!workingHoursForDay.isWorkingDay) {
        return { data: false }; // Not a working day
      }
      
      // Check if time is within working hours
      const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      const isAfterStart = timeString >= workingHoursForDay.startTime;
      const isBeforeEnd = timeString <= workingHoursForDay.endTime;
      
      return { data: isAfterStart && isBeforeEnd };
    }
    
    return this.get(`/staff/${staffId}/availability?date=${date.toISOString()}`);
  }
}

// Create a singleton instance
export const staffService = new StaffService();
