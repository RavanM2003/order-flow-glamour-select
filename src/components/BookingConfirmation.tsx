import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const { orderState, resetOrder } = useOrder();
  const { customer, selectedService, selectedStaff, selectedProducts, appointmentDate, appointmentTime, totalAmount } = orderState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmitBooking = async () => {
    if (!selectedService || !appointmentDate || !appointmentTime || !selectedStaff) {
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
      const [hours, minutes] = appointmentTime.split(':').map(Number);
      const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Calculate end time based on service duration
      const durationMinutes = selectedService.duration;
      let endHours = hours + Math.floor(durationMinutes / 60);
      let endMinutes = minutes + (durationMinutes % 60);
      
      if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
      }
      
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Format the date
      const formattedDate = format(appointmentDate, 'yyyy-MM-dd');

      // 1. First create user in users table
      let userId;
      let customerId;
      
      // Check if the user already exists by email
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', customer.email)
        .limit(1);
        
      if (userCheckError) {
        console.error("Error checking existing user:", userCheckError);
      }
      
      if (existingUser && existingUser.length > 0) {
        userId = existingUser[0].id;
        
        // Update user information
        await supabase
          .from('users')
          .update({
            first_name: customer.name.split(' ')[0] || '',
            last_name: customer.name.split(' ').slice(1).join(' ') || '',
            phone: customer.phone
          })
          .eq('id', userId);
      } else {
        // Create new user
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            email: customer.email,
            first_name: customer.name.split(' ')[0] || '',
            last_name: customer.name.split(' ').slice(1).join(' ') || '',
            phone: customer.phone,
            role: 'customer',
            hashed_password: 'default-password' // In production, generate a random password or handle this differently
          })
          .select('id')
          .single();
          
        if (createUserError) {
          console.error("Error creating user:", createUserError);
          throw createUserError;
        }
        
        userId = newUser.id;
      }
      
      // 2. We don't use a separate customers table anymore. Instead, we work with 'users' with role='customer'
      customerId = userId;
      
      // 3. Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            customer_user_id: customerId,
            user_id: userId,
            appointment_date: formattedDate,
            start_time: startTime,
            end_time: endTime,
            total: totalAmount,
            status: 'scheduled'
          }
        ])
        .select('id')
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
        quantity: 1
      };
      
      const { error: serviceError } = await supabase
        .from('appointment_services')
        .insert(appointmentService);
        
      if (serviceError) {
        console.error("Error adding service to appointment:", serviceError);
        throw serviceError;
      }
      
      // 5. Add products to appointment if any
      if (selectedProducts.length > 0) {
        const appointmentProducts = selectedProducts.map(product => ({
          appointment_id: appointment.id,
          product_id: product.id,
          staff_id: selectedStaff.id.toString(),
          price: product.price,
          quantity: 1
        }));
        
        for (const product of appointmentProducts) {
          const { error: productError } = await supabase
            .from('appointment_products')
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
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-purple-800">Təyinatınız</h2>
        
        <div className="space-y-6">
          {/* Customer information */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Müştəri məlumatları</h3>
            <div className="bg-white p-4 rounded border">
              <p><span className="font-medium">Ad:</span> {customer.name}</p>
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">Telefon:</span> {customer.phone}</p>
            </div>
          </div>
          
          {/* Appointment time */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Təyinat vaxtı</h3>
            <div className="bg-white p-4 rounded border">
              <p>
                <span className="font-medium">Tarix:</span>{" "}
                {appointmentDate ? format(appointmentDate, "MMMM d, yyyy") : "Tarix seçilməyib"}
              </p>
              <p>
                <span className="font-medium">Saat:</span>{" "}
                {appointmentTime || "Saat seçilməyib"}
              </p>
            </div>
          </div>
          
          {/* Selected service */}
          {selectedService && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Seçilən xidmət</h3>
              <div className="bg-white p-4 rounded border">
                <p><span className="font-medium">Xidmət adı:</span> {selectedService.name}</p>
                <p><span className="font-medium">Müddət:</span> {selectedService.duration} dəqiqə</p>
                <p><span className="font-medium">Qiymət:</span> {selectedService.price} AZN</p>
              </div>
            </div>
          )}
          
          {/* Selected staff */}
          {selectedStaff && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Seçilən işçi</h3>
              <div className="bg-white p-4 rounded border">
                <p><span className="font-medium">İşçi adı:</span> {selectedStaff.name}</p>
                <p><span className="font-medium">Mövqe:</span> {selectedStaff.position}</p>
              </div>
            </div>
          )}
          
          {/* Selected products */}
          {selectedProducts.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Əlavə məhsullar</h3>
              <div className="bg-white p-4 rounded border">
                <ul className="list-disc list-inside">
                  {selectedProducts.map((product) => (
                    <li key={product.id}>
                      {product.name} - {product.price} AZN
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Total amount */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Ümumi məbləğ</h3>
            <div className="bg-purple-100 p-4 rounded border border-purple-200">
              <p className="text-xl font-bold text-purple-900">{totalAmount} AZN</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => resetOrder()}>
          Təyinatı ləğv et
        </Button>
        <Button 
          onClick={handleSubmitBooking}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Təyinat yaradılır..." : "Təyinatı təsdiq et"}
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
