
import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from 'qrcode.react';

const services = [
  { id: 1, name: "Facial Treatment", price: 150, duration: "60 min" },
  { id: 2, name: "Massage Therapy", price: 120, duration: "45 min" },
  { id: 3, name: "Manicure", price: 50, duration: "30 min" },
  { id: 4, name: "Hair Styling", price: 80, duration: "45 min" },
  { id: 5, name: "Makeup Application", price: 90, duration: "60 min" }
];

const products = [
  { id: 1, name: "Moisturizer Cream", price: 45 },
  { id: 2, name: "Anti-Aging Serum", price: 75 },
  { id: 3, name: "Hair Care Kit", price: 60 }
];

const demoOrder = {
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
  paymentMethod: "Nəğd",
  serviceProviders: [
    { serviceId: 1, name: "Elvin Əliyev" },
    { serviceId: 3, name: "Aygün Qasımova" }
  ],
  status: "Gözləmədə"
};

const BookingDetails = () => {
  const { orderState } = useOrder();
  // Use demo data if orderState is missing or incomplete
  const [localStatus, setLocalStatus] = useState(
    (orderState && orderState.orderId ? orderState.status : demoOrder.status) || "Gözləmədə"
  );
  
  // Merge demo data with actual order state or use demo data if no order state is available
  const data = orderState && orderState.orderId 
    ? { ...orderState, status: localStatus } 
    : { ...demoOrder, status: localStatus };
  
  const bookingUrl = `${window.location.origin}/booking-details/${data.orderId}`;
  const [cancelMsg, setCancelMsg] = useState("");

  if (!data.customerInfo || !data.orderId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No booking details found.</p>
      </div>
    );
  }

  const selectedServices = services.filter(service => 
    data.selectedServices.includes(service.id)
  );

  const selectedProducts = products.filter(product => 
    data.selectedProducts.includes(product.id)
  );

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0) +
                selectedProducts.reduce((sum, product) => sum + product.price, 0);

  // Calculate total duration in minutes
  const totalDuration = selectedServices.reduce((sum, service) => {
    const match = service.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

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
                {selectedServices.map(service => {
                  const provider = data.serviceProviders && data.serviceProviders.find(p => p.serviceId === service.id);
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

                {selectedProducts.length > 0 && (
                  <>
                    <h3 className="font-semibold text-glamour-800 mt-6">Selected Products</h3>
                    {selectedProducts.map(product => (
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
                  onClick={() => {
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
