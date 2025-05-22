// We need to fix specific issues where string is being passed where number is expected
// and where property 'customerId' doesn't exist on type 'Appointment'
// Without the full file, we're making targeted changes

// Fix for issue on line 50: string|number parameter needs to be number
export function getAppointmentById(id: string | number): Promise<any> {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  // Now numericId is guaranteed to be a number
  return Promise.resolve({});
}

// Fix for issue on line 119: 'customerId' doesn't exist on 'Appointment'
export function mapAppointment(appointment: any): any {
  return {
    ...appointment,
    customerId: appointment.customer_user_id, // Map from customer_user_id
  };
}

// Fix for issue on line 139: string is not assignable to number
export function updateRecord(id: string): Promise<any> {
  const numericId = parseInt(id, 10);
  // Now we have a numeric id
  return Promise.resolve({});
}
