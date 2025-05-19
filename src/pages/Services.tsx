
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useServices } from '@/hooks/use-services';
import { Service } from '@/models/service.model';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { services: apiServices, fetchServices, isLoading } = useServices();
  const [services, setServices] = useState<Service[]>([]);
  
  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  // Update local state when API services change
  useEffect(() => {
    if (apiServices && apiServices.length > 0) {
      setServices(apiServices);
    }
  }, [apiServices]);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format duration for display (convert minutes to a readable format)
  const formatDuration = (minutes: number): string => {
    return `${minutes} dəq`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <h1 className="text-4xl font-bold text-glamour-800 mb-2">Xidmətlərimiz</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          Təbii gözəlliyinizi artırmaq və rifahınızı təşviq etmək üçün hazırlanmış hərtərəfli gözəllik və sağlamlıq xidmətlərimizi kəşf edin.
        </p>
        
        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Xidmətləri axtar..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Xidmətlər yüklənir...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <p className="text-glamour-600">Xidmət Şəkli</p>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-bold text-glamour-800">{service.name}</h2>
                      <div className="text-glamour-700 font-semibold">${service.price}</div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Müddət: {formatDuration(service.duration)}</p>
                    <p className="text-gray-600 mb-6 line-clamp-3">{service.description}</p>
                    <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                      <Link to={`/services/${service.id}`}>
                        Ətraflı bax
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 col-span-3">
                <p className="text-lg text-gray-600">Heç bir xidmət tapılmadı.</p>
                <p className="text-gray-500 mt-2">Nümunə xidmətlər göstərmək üçün aşağıdakı düyməyə basın.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    // Set mock services if no services are found
                    const mockServices = [
                      { 
                        id: 1, // Changed from string to number
                        name: "Üz müalicəsi", 
                        price: 150, 
                        duration: 60, 
                        description: "Premium məhsullarla dərin təmizləyici üz müalicəsi"
                      },
                      { 
                        id: 2, // Changed from string to number
                        name: "Masaj terapiyası", 
                        price: 120, 
                        duration: 45, 
                        description: "Rahatlaşdırıcı tam bədən masajı"
                      },
                      { 
                        id: 3, // Changed from string to number
                        name: "Manikür", 
                        price: 50, 
                        duration: 30, 
                        description: "Dırnaq baxımı və lak tətbiqi"
                      },
                      { 
                        id: 4, // Changed from string to number
                        name: "Saç stilləşdirmə", 
                        price: 80, 
                        duration: 45, 
                        description: "Peşəkar saç stilləşdirmə xidməti"
                      },
                      { 
                        id: 5, // Changed from string to number
                        name: "Makiyaj tətbiqi", 
                        price: 90, 
                        duration: 60, 
                        description: "Xüsusi tədbirlər üçün tam üz makiyajı"
                      }
                    ];
                    setServices(mockServices as Service[]);
                  }}
                >
                  Nümunə xidmətləri göstər
                </Button>
              </div>
            )}
          </div>
        )}
        
        {!isLoading && filteredServices.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">"{searchTerm}" ilə uyğun xidmət tapılmadı</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-6">Premium xidmətlərimizi təcrübə etməyə hazırsınız?</p>
          <Button size="lg" className="bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to="/booking">Randevu təyin edin</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
