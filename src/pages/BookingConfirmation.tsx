
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BookingDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  total: number;
  services: string[];
  products: string[];
  status: string;
}

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock booking details - in real app this would fetch from API
    const mockBooking: BookingDetails = {
      id: id || '1',
      customer_name: 'Nərmin Əliyeva',
      customer_email: 'nermin@example.com',
      customer_phone: '+994501234567',
      appointment_date: '2024-01-15',
      start_time: '14:00',
      end_time: '15:30',
      total: 60,
      services: ['Saç kəsilməsi', 'Makyaj'],
      products: ['Şampun', 'Krem'],
      status: 'confirmed'
    };

    setTimeout(() => {
      setBooking(mockBooking);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Rezervasiya məlumatları yüklənir...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Rezervasiya tapılmadı</h1>
            <Link to="/">
              <Button>Ana səhifəyə qayıt</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervasiya Təsdiqləndi!</h1>
            <p className="text-gray-600">Rezervasiyanız uğurla qeydə alındı</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rezervasiya Detalları</CardTitle>
              <CardDescription>Rezervasiya nömrəsi: #{booking.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Müştəri</p>
                    <p className="font-medium">{booking.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{booking.customer_email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="font-medium">{booking.customer_phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Tarix</p>
                    <p className="font-medium">{booking.appointment_date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Vaxt</p>
                    <p className="font-medium">{booking.start_time} - {booking.end_time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Ünvan</p>
                    <p className="font-medium">Glamour Studio, Bakı</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Seçilmiş Xidmətlər</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {booking.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>

              {booking.products.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Əlavə Məhsullar</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {booking.products.map((product, index) => (
                      <li key={index}>{product}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Ümumi məbləğ:</span>
                  <span className="text-2xl font-bold text-purple-600">{booking.total} ₼</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8 space-y-4">
            <p className="text-gray-600">
              Rezervasiyanızın təsdiqi üçün email göndərildi. 
              Suallarınız olarsa bizimlə əlaqə saxlayın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/">Ana səhifə</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Bizimlə əlaqə</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
