
import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const BookingDetails = () => {
  const { orderState } = useOrder();
  const { orderId } = useParams<{ orderId: string }>();
  const [appointmentData, setAppointmentData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [localStatus, setLocalStatus] = useState("Gözləmədə");
  const [cancelMsg, setCancelMsg] = useState("");

  // Demo data for when no real data is available
  const demoData = {
    orderId: "GS-123456-789",
    customerInfo: {
      name: "Aysel Məmmədova",
      gender: "Qadın",
      phone: "+994501234567",
      email: "aysel@example.com",
      date: "2024-06-10",
      time: "15:00",
      notes: "Zəhmət olmasa vaxtında gəlin.",
    },
    selectedServices: [1, 3],
    selectedProducts: [2],
    services: [
      { id: 1, name: "Facial Treatment", price: 150, duration: "60 min" },
      { id: 3, name: "Manicure", price: 50, duration: "30 min" },
    ],
    products: [
      { id: 2, name: "Anti-Aging Serum", price: 75 }
    ],
    paymentMethod: "Nəğd",
    serviceProviders: [
      { serviceId: 1, name: "Elvin Əliyev" },
      { serviceId: 3, name: "Aygün Qasımova" }
    ],
    status: "Gözləmədə"
  };

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (orderId) {
        try {
          const { data, error } = await supabase
            .from('appointments')
            .select(`
              *,
              appointment_services(*,
                service:services(*),
                staff:staff(*)
              ),
              appointment_products(*,
                product:products(*),
                staff:staff(*)
              ),
              customer:customers(*)
            `)
            .eq('id', orderId)
            .single();

          if (error) throw error;
          
          if (data) {
            setAppointmentData({
              orderId: data.id,
              status: data.status,
              customerInfo: {
                name: data.customer.full_name,
                gender: data.customer.gender || 'N/A',
                phone: data.customer.phone,
                email: data.customer.email,
                date: data.appointment_date,
                time: data.start_time,
                notes: data.notes || '',
              },
              services: data.appointment_services.map((as: any) => ({
                id: as.service.id,
                name: as.service.name,
                price: as.price,
                duration: `${as.service.duration} min`,
              })),
              selectedServices: data.appointment_services.map((as: any) => as.service.id),
              products: data.appointment_products.map((ap: any) => ({
                id: ap.product.id,
                name: ap.product.name,
                price: ap.price,
              })),
              selectedProducts: data.appointment_products.map((ap: any) => ap.product.id),
              paymentMethod: data.payment_method || 'Nəğd',
              serviceProviders: data.appointment_services.map((as: any) => ({
                serviceId: as.service.id,
                name: as.staff.name,
              })),
            });
            setLocalStatus(data.status);
          }
        } catch (error) {
          console.error("Error fetching appointment:", error);
          // Fall back to demo data
          setAppointmentData(demoData);
          setLocalStatus(demoData.status);
        } finally {
          setLoading(false);
        }
      } else {
        // If no orderId, use demo data
        setAppointmentData(demoData);
        setLocalStatus(demoData.status);
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Yüklənir...</p>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No booking details found.</p>
      </div>
    );
  }

  // Use the fetched data or demo data
  const data = appointmentData;
  const bookingUrl = `${window.location.origin}/booking-details/${data.orderId}`;

  // Calculate total duration in minutes
  const totalDuration = data.services.reduce((sum: number, service: any) => {
    const match = service.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  // Calculate total
  const total = data.services.reduce((sum: number, service: any) => sum + service.price, 0) +
               (data.products ? data.products.reduce((sum: number, product: any) => sum + product.price, 0) : 0);

  // Calculate inTime and outTime
  const inTime = data.customerInfo.time || "00:00";
  const [inHour, inMinute] = inTime.split(":").map(Number);
  const extraMinutes = 10;
  const outTotalMinutes = inHour * 60 + inMinute + totalDuration + extraMinutes;
  const outHour = Math.floor(outTotalMinutes / 60) % 24;
  const outMinute = outTotalMinutes % 60;
  const outTime = `${outHour.toString().padStart(2, '0')}:${outMinute.toString().padStart(2, '0')}`;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <Receipt className="h-6 w-6 text-glamour-700" />
              <h2 className="text-2xl font-bold text-glamour-800">Booking Details</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-glamour-50 p-4 rounded-lg">
                <Badge variant="secondary" className="text-lg font-mono bg-white text-glamour-700 mb-2">
                  {data.orderId}
                </Badge>
                <p className="text-sm text-gray-600">Booking Reference</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-glamour-800">Selected Services</h3>
                {data.services && data.services.map((service: any) => {
                  const provider = data.serviceProviders && data.serviceProviders.find((p: any) => p.serviceId === service.id);
                  return (
                    <div key={service.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.duration}</p>
                        {provider && (
                          <p className="text-xs text-gray-500">Xidmət göstərən: {provider.name}</p>
                        )}
                      </div>
                      <p className="font-medium">${service.price}</p>
                    </div>
                  );
                })}
                <div className="text-sm text-glamour-700 font-medium mt-2">
                  Selected Services Total duration: {totalDuration} min
                </div>

                {data.products && data.products.length > 0 && (
                  <>
                    <h3 className="font-semibold text-glamour-800 mt-6">Selected Products</h3>
                    {data.products.map((product: any) => (
                      <div key={product.id} className="flex justify-between items-center">
                        <p className="font-medium">{product.name}</p>
                        <p className="font-medium">${product.price}</p>
                      </div>
                    ))}
                  </>
                )}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Total</p>
                    <p className="font-bold text-lg">${total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-64 flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <QRCodeSVG 
                value={bookingUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Scan to view booking details
            </p>
            <div className="w-full bg-glamour-50 rounded-lg p-4 space-y-2 text-glamour-800 text-sm">
              <div>
                <span className="font-semibold">Ödənişin Qaydası</span><br />
                {data.paymentMethod}
              </div>
              <div>
                <span className="font-semibold">Status</span><br />
                {localStatus}
              </div>
              <div>
                <span className="font-semibold">In time</span><br />
                {inTime}
              </div>
              <div>
                <span className="font-semibold">Out time</span><br />
                {outTime}
              </div>
              <div>
                <span className="font-semibold">{data.customerInfo.name}</span>
              </div>
              <div>{data.customerInfo.gender}</div>
              <div>{data.customerInfo.phone}</div>
              <div>{data.customerInfo.email}</div>
              <div>{data.customerInfo.date}</div>
              <div>{data.customerInfo.time}</div>
              {/* Cancel button */}
              {localStatus !== "Ləğv edildi" ? (
                <button
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                  onClick={async () => {
                    if (orderId) {
                      try {
                        const { error } = await supabase
                          .from('appointments')
                          .update({ status: 'cancelled' })
                          .eq('id', orderId);
                          
                        if (error) throw error;
                      } catch (error) {
                        console.error("Error cancelling appointment:", error);
                      }
                    }
                    setLocalStatus("Ləğv edildi");
                    setCancelMsg("Sifariş uğurla ləğv edildi.");
                  }}
                >
                  Sifarişi ləğv et
                </button>
              ) : (
                <div className="mt-4 text-center text-red-600 font-semibold">Sifariş artıq ləğv edilib</div>
              )}
              {cancelMsg && (
                <div className="mt-2 text-green-700 text-center">{cancelMsg}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingDetails;
