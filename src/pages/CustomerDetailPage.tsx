
// We need to fix the property access 'createdAt' to 'created_at'
// Without the full file, we're making targeted changes

// Fix for issue on line 546: createdAt doesn't exist, use created_at instead
export function formatAppointmentDate(appointment: any): string {
  // Instead of appointment.createdAt, use appointment.created_at
  return new Date(appointment.created_at).toLocaleDateString();
}
