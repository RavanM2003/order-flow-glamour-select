
// Enhanced API Services Index
export * from './base.service';
export * from './enhanced-supabase.service';

// Re-export enhanced service instances for easy access
export { 
  enhancedUserService as userService,
  enhancedServiceService as serviceService,
  enhancedAppointmentService as appointmentService
} from './enhanced-supabase.service';
