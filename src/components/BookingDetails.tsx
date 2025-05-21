
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface BookingDetailsProps {
  appointmentId: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AppointmentWithDetails {
  id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total: number;
  customer: Customer;
  services: Array<{
    id: number;
    name: string;
    price: number;
    duration: number;
    staffName: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ appointmentId }) => {
  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch appointment basic info
        const { data: appointmentData, error: appointmentError } =
          await supabase
            .from("appointments")
            .select("*")
            .eq("id", appointmentId)
            .single();

        if (appointmentError) throw appointmentError;
        if (!appointmentData) {
          throw new Error("Appointment not found");
        }

        // Fetch the customer (user with role='customer')
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, full_name, email, phone")
          .eq("id", appointmentData.customer_user_id)
          .eq("role", "customer")
          .single();

        if (userError) throw userError;

        // Convert customer data to our model
        const customer: Customer = {
          id: userData.id,
          name: userData.full_name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        };

        // Fetch appointment services
        const { data: serviceEntries, error: serviceError } = await supabase
          .from("appointment_services")
          .select(`
            id, 
            service_id,
            price,
            quantity,
            staff_id,
            duration,
            services:service_id(name)
          `)
          .eq("appointment_id", appointmentId);

        if (serviceError) throw serviceError;

        // Fetch staff names
        const staffIds = serviceEntries.map((entry) => entry.staff_id);
        const { data: staffData, error: staffError } = await supabase
          .from("users")
          .select("id, full_name")
          .in("id", staffIds);

        if (staffError) throw staffError;

        // Map staff data
        const staffMap = staffData.reduce(
          (acc, staff) => ({
            ...acc,
            [staff.id]: staff.full_name,
          }),
          {}
        );

        // Format services data
        const services = serviceEntries.map((entry) => ({
          id: entry.service_id,
          name: entry.services?.name || "Unknown Service",
          price: entry.price || 0,
          duration: entry.duration || 0,
          staffName: staffMap[entry.staff_id] || "Unknown Staff",
        }));

        // Fetch appointment products
        const { data: productEntries, error: productError } = await supabase
          .from("appointment_products")
          .select(`
            id,
            product_id,
            price,
            quantity,
            products:product_id(name)
          `)
          .eq("appointment_id", appointmentId);

        if (productError) throw productError;

        // Format products data
        const products = productEntries.map((entry) => ({
          id: entry.product_id,
          name: entry.products?.name || "Unknown Product",
          price: entry.price || 0,
          quantity: entry.quantity || 1,
        }));

        // Construct the full appointment object
        const fullAppointment: AppointmentWithDetails = {
          ...appointmentData,
          customer,
          services,
          products,
        };

        setAppointment(fullAppointment);
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while loading appointment details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  if (loading) {
    return <p>Loading appointment details...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!appointment) {
    return <p>No appointment data found</p>;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Təyinat #{appointment.id}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">
              {appointment.status === "completed"
                ? "Tamamlanıb"
                : appointment.status === "scheduled"
                ? "Planlaşdırılıb"
                : "Ləğv edilib"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tarix</p>
            <p className="font-medium">
              {formatDate(appointment.appointment_date)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vaxt</p>
            <p className="font-medium">
              {appointment.start_time} - {appointment.end_time}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ümumi məbləğ</p>
            <p className="font-bold text-xl">{appointment.total} AZN</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Müştəri məlumatları</h3>
          <div className="bg-gray-50 p-3 rounded">
            <p>
              <span className="font-medium">Ad:</span> {appointment.customer.name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {appointment.customer.email}
            </p>
            <p>
              <span className="font-medium">Telefon:</span>{" "}
              {appointment.customer.phone}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Xidmətlər</h3>
          {appointment.services.length > 0 ? (
            <div className="divide-y border rounded overflow-hidden">
              {appointment.services.map((service) => (
                <div key={service.id} className="p-3 bg-white">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-gray-500 text-sm">
                        {service.duration} dəqiqə | {service.staffName}
                      </p>
                    </div>
                    <p className="font-semibold">{service.price} AZN</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No services found</p>
          )}
        </div>

        {appointment.products.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Məhsullar</h3>
            <div className="divide-y border rounded overflow-hidden">
              {appointment.products.map((product) => (
                <div key={product.id} className="p-3 bg-white">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-gray-500 text-sm">
                        {product.quantity} ədəd
                      </p>
                    </div>
                    <p className="font-semibold">
                      {product.price * product.quantity} AZN
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
