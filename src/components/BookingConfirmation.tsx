import { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import type { Staff } from "@/models/staff.model";

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  price?: number;
}

const InfoSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
    <div className="bg-white p-4 rounded border">{children}</div>
  </div>
);

const CustomerInfo = ({ customer }: { customer: Customer }) => (
  <div>
    <p>
      <span className="font-medium">Ad:</span> {customer.name}
    </p>
    <p>
      <span className="font-medium">Email:</span> {customer.email}
    </p>
    <p>
      <span className="font-medium">Telefon:</span> {customer.phone}
    </p>
  </div>
);

const AppointmentTimeInfo = ({
  date,
  time,
}: {
  date: Date | null;
  time: string;
}) => (
  <div>
    <p>
      <span className="font-medium">Tarix:</span>{" "}
      {date ? format(date, "MMMM d, yyyy") : "Tarix seçilməyib"}
    </p>
    <p>
      <span className="font-medium">Saat:</span> {time || "Saat seçilməyib"}
    </p>
  </div>
);

const ServiceInfo = ({ service }: { service: Service }) => (
  <div>
    <p>
      <span className="font-medium">Xidmət adı:</span> {service.name}
    </p>
    <p>
      <span className="font-medium">Müddət:</span> {service.duration} dəqiqə
    </p>
    <p>
      <span className="font-medium">Qiymət:</span> {service.price} AZN
    </p>
  </div>
);

const StaffInfo = ({ staff }: { staff: Staff }) => (
  <div>
    <p>
      <span className="font-medium">İşçi adı:</span> {staff.name}
    </p>
    <p>
      <span className="font-medium">Mövqe:</span> {staff.position}
    </p>
  </div>
);

const ProductsInfo = ({ products }: { products: Product[] }) => (
  <ul className="list-disc list-inside">
    {products.map((product) => (
      <li key={product.id}>
        {product.name} - {product.price} AZN
      </li>
    ))}
  </ul>
);

const TotalAmount = ({ amount }: { amount: number }) => (
  <div>
    <h3 className="font-semibold text-gray-700 mb-2">Ümumi məbləğ</h3>
    <div className="bg-purple-100 p-4 rounded border border-purple-200">
      <p className="text-xl font-bold text-purple-900">{amount} AZN</p>
    </div>
  </div>
);

const BookingDetails = ({
  customer,
  appointmentDate,
  appointmentTime,
  selectedService,
  selectedStaff,
  selectedProducts,
  totalAmount,
}: {
  customer: Customer;
  appointmentDate: Date | null;
  appointmentTime: string;
  selectedService: Service | null;
  selectedStaff: Staff | null;
  selectedProducts: Product[];
  totalAmount: number;
}) => (
  <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
    <h2 className="text-3xl font-bold mb-6 text-purple-800">Təyinatınız</h2>
    <div className="space-y-6">
      <InfoSection title="Müştəri məlumatları">
        <CustomerInfo customer={customer} />
      </InfoSection>

      <InfoSection title="Təyinat vaxtı">
        <AppointmentTimeInfo date={appointmentDate} time={appointmentTime} />
      </InfoSection>

      {selectedService && (
        <InfoSection title="Seçilən xidmət">
          <ServiceInfo service={selectedService} />
        </InfoSection>
      )}

      {selectedStaff && (
        <InfoSection title="Seçilən işçi">
          <StaffInfo staff={selectedStaff} />
        </InfoSection>
      )}

      {selectedProducts.length > 0 && (
        <InfoSection title="Əlavə məhsullar">
          <ProductsInfo products={selectedProducts} />
        </InfoSection>
      )}

      <TotalAmount amount={totalAmount} />
    </div>
  </div>
);

const BookingConfirmation = () => {
  const { orderState, resetOrder } = useOrder();
  const {
    customer,
    selectedService,
    selectedStaff,
    selectedProducts,
    appointmentDate,
    appointmentTime,
    totalAmount,
  } = orderState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmitBooking = async () => {
    if (
      !selectedService ||
      !appointmentDate ||
      !appointmentTime ||
      !selectedStaff
    ) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Zəhmət olmasa bütün məlumatları doldurun",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the time correctly
      const [hours, minutes] = appointmentTime.split(":").map(Number);
      const startTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      // Calculate end time based on service duration
      const durationMinutes = selectedService.duration;
      let endHours = hours + Math.floor(durationMinutes / 60);
      let endMinutes = minutes + (durationMinutes % 60);

      if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
      }

      const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes
        .toString()
        .padStart(2, "0")}`;

      // Format the date
      const formattedDate = format(appointmentDate, "yyyy-MM-dd");

      // 1. First check if the user already exists by email
      let userId;

      const { data: existingUser, error: userCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("email", customer.email)
        .eq("role", "customer")
        .limit(1);

      if (userCheckError) {
        console.error("Error checking existing user:", userCheckError);
      }

      if (existingUser && existingUser.length > 0) {
        userId = existingUser[0].id;

        // Update user information
        await supabase
          .from("users")
          .update({
            first_name: customer.name.split(" ")[0] || "",
            last_name: customer.name.split(" ").slice(1).join(" ") || "",
            full_name: customer.name,
            phone: customer.phone,
          })
          .eq("id", userId);
      } else {
        // Create new user
        const { data: newUser, error: createUserError } = await supabase
          .from("users")
          .insert({
            email: customer.email,
            first_name: customer.name.split(" ")[0] || "",
            last_name: customer.name.split(" ").slice(1).join(" ") || "",
            full_name: customer.name,
            phone: customer.phone,
            role: "customer",
            hashed_password: "default-password", // In production, generate a random password or handle this differently
          })
          .select("id")
          .single();

        if (createUserError) {
          console.error("Error creating user:", createUserError);
          throw createUserError;
        }

        userId = newUser.id;
      }

      // 2. Now the customer is represented by a user with role='customer'
      const customerId = userId;

      // 3. Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .insert([
          {
            customer_user_id: customerId,
            user_id: userId, // Same as customer_user_id since the customer is creating the appointment
            appointment_date: formattedDate,
            start_time: startTime,
            end_time: endTime,
            total: totalAmount,
            status: "scheduled",
          },
        ])
        .select("id")
        .single();

      if (appointmentError) {
        console.error("Error creating appointment:", appointmentError);
        throw appointmentError;
      }

      // 4. Add service to appointment
      const appointmentService = {
        appointment_id: appointment.id,
        service_id: selectedService.id,
        staff_id: selectedStaff.id.toString(),
        price: selectedService.price,
        duration: selectedService.duration,
        quantity: 1,
      };

      const { error: serviceError } = await supabase
        .from("appointment_services")
        .insert(appointmentService);

      if (serviceError) {
        console.error("Error adding service to appointment:", serviceError);
        throw serviceError;
      }

      // 5. Add products to appointment if any
      if (selectedProducts.length > 0) {
        const appointmentProducts = selectedProducts.map((product) => ({
          appointment_id: appointment.id,
          product_id: product.id,
          staff_id: selectedStaff.id.toString(),
          price: Number(product.price),
          quantity: 1,
          amount: Number(product.price),
        }));

        for (const product of appointmentProducts) {
          const { error: productError } = await supabase
            .from("appointment_products")
            .insert(product);

          if (productError) {
            console.error("Error adding product to appointment:", productError);
            throw productError;
          }
        }
      }

      // Show success message
      toast({
        title: "Təyinat uğurla yaradıldı",
        description: `Təyinat nömrəsi: ${appointment.id}`,
      });

      // Reset the form
      resetOrder();

      // Navigate to a thank you page or back to home
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Təyinat yaradılmadı",
        description: "Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <BookingDetails
        customer={customer}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
        selectedService={selectedService}
        selectedStaff={selectedStaff}
        selectedProducts={selectedProducts}
        totalAmount={totalAmount}
      />

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => resetOrder()}>
          Təyinatı ləğv et
        </Button>
        <Button onClick={handleSubmitBooking} disabled={isSubmitting}>
          {isSubmitting ? "Təyinat yaradılır..." : "Təyinatı təsdiq et"}
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
