
import { ApiService } from './api.service';
import { Appointment, AppointmentFormData } from '@/models/appointment.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockAppointments } from '@/lib/mock-data';

export class AppointmentService extends ApiService {
  // Get all appointments
  async getAll(): Promise<ApiResponse<Appointment[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { data: [...mockAppointments] };
    }
    
    return this.get<Appointment[]>('/appointments');
  }
  
  // Get appointments for a specific customer
  async getByCustomerId(customerId: number | string): Promise<ApiResponse<Appointment[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const appointments = mockAppointments.filter(a => 
        a.customerId === Number(customerId)
      );
      return { data: [...appointments] };
    }
    
    return this.get<Appointment[]>(`/customers/${customerId}/appointments`);
  }
  
  // Create a new appointment
  async create(appointment: AppointmentFormData): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newAppointment = { 
        ...appointment, 
        id: Math.max(0, ...mockAppointments.map(a => a.id)) + 1,
        date: appointment.date || new Date().toISOString().split('T')[0],
        status: 'pending'
      } as Appointment;
      
      mockAppointments.push(newAppointment);
      return { data: {...newAppointment} };
    }
    
    return this.post<Appointment>('/appointments', appointment);
  }
  
  // Update an existing appointment
  async update(id: number | string, appointment: Partial<AppointmentFormData>): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockAppointments.findIndex(a => a.id === Number(id));
      if (index >= 0) {
        mockAppointments[index] = { ...mockAppointments[index], ...appointment };
        return { data: {...mockAppointments[index]} };
      }
      return { error: 'Appointment not found' };
    }
    
    return this.put<Appointment>(`/appointments/${id}`, appointment);
  }
}

// Create a singleton instance
export const appointmentService = new AppointmentService();
