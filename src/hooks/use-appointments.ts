
// Fixing the string/number type issues in use-appointments.ts

// Fix line 34:5 - convert customerId type to string if necessary
const transformAppointment = (
  dbAppointment: DatabaseAppointment
): Appointment => {
  return {
    id: dbAppointment.id.toString(), // Convert to string
    customerId: dbAppointment.customer_user_id,
    date: dbAppointment.appointment_date,
    startTime: dbAppointment.start_time,
    endTime: dbAppointment.end_time,
    status: dbAppointment.status as AppointmentStatus,
    service: dbAppointment.service || "",
    totalAmount: dbAppointment.total,
    createdAt: dbAppointment.created_at,
    isPaid: dbAppointment.is_paid || false,
    rejectionReason: dbAppointment.cancel_reason,
  };
};

// Fix all the instances of string/number type issues
const getAppointmentsByCustomer = useCallback(
  async (customerId: number | string) => {
    const id = typeof customerId === 'number' ? customerId.toString() : customerId;
    const response = await appointmentService.getByCustomerId(id);
    return response.data || [];
  },
  []
);

const createAppointment = useCallback(
  async (data: AppointmentFormData) => {
    // Convert AppointmentFormData to AppointmentCreate
    const appointmentData: AppointmentCreate = {
      customer_user_id: typeof data.customerId === 'number' ? data.customerId.toString() : data.customerId,
      start_time: data.startTime || data.start_time || '',
      end_time: data.endTime || data.end_time || '',
      appointment_date: data.date || data.appointment_date || '',
      status: data.status,
      notes: data.notes,
      total: data.totalAmount
    };

    const result = await api.execute(() => appointmentService.create(appointmentData), {
      showSuccessToast: true,
      successMessage: "Appointment created successfully",
      errorPrefix: "Failed to create appointment",
      onSuccess: () => {
        fetchAppointments(true);
      },
    });

    return result;
  },
  [api, fetchAppointments]
);

const updateAppointment = useCallback(
  async (id: number | string, data: Partial<AppointmentFormData>) => {
    const appointmentId = typeof id === 'number' ? id.toString() : id;
    
    const result = await api.execute(
      () => appointmentService.update(appointmentId, data),
      {
        showSuccessToast: true,
        successMessage: "Appointment updated successfully",
        errorPrefix: "Failed to update appointment",
        onSuccess: () => {
          fetchAppointments(true);
        },
      }
    );

    return result;
  },
  [api, fetchAppointments]
);

const confirmAppointment = useCallback(
  async (id: number | string) => {
    const appointmentId = typeof id === 'number' ? id.toString() : id;
    
    const result = await api.execute(
      () => appointmentService.confirmAppointment(appointmentId),
      {
        showSuccessToast: true,
        successMessage: "Appointment confirmed successfully",
        errorPrefix: "Failed to confirm appointment",
        onSuccess: () => {
          fetchAppointments(true);
          // Create a cash entry for this appointment - this would typically be done by the backend
          toast({
            title: "Payment Pending",
            description: "A pending payment was created for this appointment",
          });
        },
      }
    );

    return result;
  },
  [api, fetchAppointments, toast]
);

const rejectAppointment = useCallback(
  async (id: number | string, reason: string) => {
    const appointmentId = typeof id === 'number' ? id.toString() : id;
    
    const result = await api.execute(
      () => appointmentService.rejectAppointment(appointmentId, reason),
      {
        showSuccessToast: true,
        successMessage: "Appointment rejected",
        errorPrefix: "Failed to reject appointment",
        onSuccess: () => {
          fetchAppointments(true);
        },
      }
    );

    return result;
  },
  [api, fetchAppointments]
);

const completeAppointment = useCallback(
  async (id: number | string) => {
    const appointmentId = typeof id === 'number' ? id.toString() : id;
    
    const result = await api.execute(
      () => appointmentService.completeAppointment(appointmentId),
      {
        showSuccessToast: true,
        successMessage: "Appointment marked as completed",
        errorPrefix: "Failed to complete appointment",
        onSuccess: () => {
          fetchAppointments(true);
        },
      }
    );

    return result;
  },
  [api, fetchAppointments]
);

const markAsPaid = useCallback(
  async (id: number | string) => {
    const appointmentId = typeof id === 'number' ? id.toString() : id;
    
    const result = await api.execute(
      () => appointmentService.markAsPaid(appointmentId),
      {
        showSuccessToast: true,
        successMessage: "Appointment marked as paid",
        errorPrefix: "Failed to mark appointment as paid",
        onSuccess: () => {
          fetchAppointments(true);
        },
      }
    );

    return result;
  },
  [api, fetchAppointments]
);
