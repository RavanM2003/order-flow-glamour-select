
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock, Star, Phone, Mail, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const services = [
    {
      id: 1,
      name: 'Saç kəsilməsi və üslublandırma',
      description: 'Professional saç kəsilməsi və stilizasiya xidməti',
      price: 25,
      duration: 60,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Makyaj xidməti',
      description: 'Günlük və gecə makyajı, mərasim makyajı',
      price: 35,
      duration: 45,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Manikür',
      description: 'Klassik və gel manikür xidməti',
      price: 15,
      duration: 60,
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Gözəllik <span className="text-purple-600">Glamour</span> Studio
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Professional gözəllik xidmətləri ilə özünüzü ən gözəl halınızda hiss edin. 
              Təcrübəli ustalarımız sizə ən yaxşı xidməti təqdim edir.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link to="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  İndi Rezervasiya Et
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/services">
                  Xidmətlərimiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Populyar Xidmətlər */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Populyar Xidmətlərimiz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ən çox istənilən xidmətlərimizə göz atın və sizə uyğun olanı seçin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 rounded-t-lg">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge variant="secondary">{service.price} ₼</Badge>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration} dəqiqə
                    </div>
                    <Button size="sm" asChild>
                      <Link to="/booking">Rezervasiya et</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/services">
                Bütün xidmətləri gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Niyə Bizi Seçməlisiniz */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Niyə Glamour Studio?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bizim üstünlüklərimiz sizə ən yaxşı təcrübəni yaşatmaq üçündür
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Professional Ustalar</h3>
                <p className="text-sm text-gray-600">Təcrübəli və sertifikatlı ustalarımız</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Rahat Rezervasiya</h3>
                <p className="text-sm text-gray-600">Online rezervasiya sistemi</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Vaxtında Xidmət</h3>
                <p className="text-sm text-gray-600">Vaxtınıza hörmət və punktuallıq</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Keyfiyyət Zəmanəti</h3>
                <p className="text-sm text-gray-600">100% müştəri məmnuniyyəti</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hazırsan Gözəlliyini Kəşf etməyə?</h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Bugün bizə rezervasiya et və professional xidmətlərimizlə tanış ol
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Rezervasiya Et
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Bizimlə Əlaqə
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Əlaqə məlumatları */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-2">Telefon</h3>
              <p className="text-gray-300">+994 50 123 45 67</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-300">info@glamour.az</p>
            </div>
            
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-2">Ünvan</h3>
              <p className="text-gray-300">Bakı şəhəri, Nəsimi rayonu</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
