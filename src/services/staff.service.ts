import { ApiService } from './api.service';
import { Staff, StaffPayment, StaffServiceRecord } from '@/models/staff.model';
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
  }
];

const mockServiceRecords: StaffServiceRecord[] = [
  {
    id: 1,
    staffId: 1,
    appointmentId: 101,
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
    appointmentId: 102,
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
    appointmentId: 103,
    customerId: 203,
    customerName: 'Alice Johnson',
    serviceId: 303,
    serviceName: 'Hair Styling',
    date: '2025-05-09',
    amount: 150,
    commission: 15
  }
];

export class StaffService extends ApiService {
  // Get all staff
  async getAll(): Promise<ApiResponse<Staff[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return { data: [...mockStaff] };
    }
    
    return this.get<Staff[]>('/staff');
  }
  
  // Get a single staff member by id
  async getById(id: number | string): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const staff = mockStaff.find(s => s.id === Number(id));
      return { data: staff ? {...staff} : undefined, error: staff ? undefined : 'Staff not found' };
    }
    
    return this.get<Staff>(`/staff/${id}`);
  }
  
  // Create a new staff member
  async create(data: Partial<Staff>): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newId = Math.max(...mockStaff.map(s => s.id), 0) + 1;
      // Fix: Make sure position is properly handled
      const newStaff: Staff = { 
        ...data, 
        id: newId,
        position: data.position || '',
        specializations: data.specializations || []
      };
      mockStaff.push(newStaff);
      return { data: newStaff };
    }
    
    return this.post<Staff>('/staff', data);
  }
  
  // Update an existing staff member
  async update(id: number | string, data: Partial<Staff>): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockStaff.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        mockStaff[index] = { ...mockStaff[index], ...data };
        return { data: mockStaff[index] };
      }
      return { error: 'Staff not found' };
    }
    
    return this.put<Staff>(`/staff/${id}`, data);
  }
  
  // Delete a staff member - Override the base method to match the expected signature
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
    
    return this.delete(`/staff/${id}`);
  }
  
  // Get payments for a staff member
  async getPayments(id: number | string): Promise<ApiResponse<StaffPayment[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const payments = mockStaffPayments.filter(p => p.staffId === Number(id));
      return { data: [...payments] };
    }
    
    return this.get<StaffPayment[]>(`/staff/${id}/payments`);
  }
  
  // Get service records for a staff member
  async getServiceRecords(id: number | string): Promise<ApiResponse<StaffServiceRecord[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const records = mockServiceRecords.filter(r => r.staffId === Number(id));
      return { data: [...records] };
    }
    
    return this.get<StaffServiceRecord[]>(`/staff/${id}/service-records`);
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
    
    return this.get<{
      salary: number;
      commission: number;
      expenses: number;
      total: number;
    }>(`/staff/${id}/earnings?month=${month}&year=${year}`);
  }
}

// Create a singleton instance
export const staffService = new StaffService();
