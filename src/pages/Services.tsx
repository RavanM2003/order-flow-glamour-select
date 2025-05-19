
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useServices } from '@/hooks/use-services';
import { Service } from '@/models/service.model';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { services: apiServices, fetchServices, isLoading } = useServices();
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();
  
  // Fetch services from API
  useEffect(() => {
    const getServices = async () => {
      try {
        // Try to fetch from Supabase directly as a fallback
        const { data: supabaseServices, error } = await supabase
          .from('services')
          .select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          return;
        }
        
        if (supabaseServices && supabaseServices.length > 0) {
          // Convert to Service type and ensure duration is a number
          const formattedServices = supabaseServices.map(s => ({
            ...s,
            duration: typeof s.duration === 'string' ? parseInt(s.duration, 10) : s.duration
          })) as Service[];
          
          setServices(formattedServices);
        }
      } catch (error) {
        console.error('Error fetching services directly:', error);
      }
    };
    
    // First try regular fetch
    fetchServices();
    
    // If no services are loaded after 2 seconds, try direct Supabase fetch
    const timer = setTimeout(() => {
      if (services.length === 0 && !apiServices?.length) {
        getServices();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [fetchServices, services.length, apiServices]);
  
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

  // Create mock services for demo
  const createMockServices = () => {
    const mockServices = [
      { 
        id: 1,
        name: "Üz müalicəsi", 
        price: 150, 
        duration: 60, 
        description: "Premium məhsullarla dərin təmizləyici üz müalicəsi"
      },
      { 
        id: 2,
        name: "Masaj terapiyası", 
        price: 120, 
        duration: 45, 
        description: "Rahatlaşdırıcı tam bədən masajı"
      },
      { 
        id: 3,
        name: "Manikür", 
        price: 50, 
        duration: 30, 
        description: "Dırnaq baxımı və lak tətbiqi"
      },
      { 
        id: 4,
        name: "Saç stilləşdirmə", 
        price: 80, 
        duration: 45, 
        description: "Peşəkar saç stilləşdirmə xidməti"
      },
      { 
        id: 5,
        name: "Makiyaj tətbiqi", 
        price: 90, 
        duration: 60, 
        description: "Xüsusi tədbirlər üçün tam üz makiyajı"
      }
    ];
    
    setServices(mockServices as Service[]);
    toast({
      title: "Nümunə xidmətlər yükləndi",
      description: "5 nümunə xidmət göstərilir.",
    });
  };
  
  // Add to Supabase
  const addMockServicesToSupabase = async () => {
    try {
      toast({
        title: "Yüklənir...",
        description: "Xidmətlər Supabase-ə əlavə olunur.",
      });
      
      const mockServices = [
        { 
          name: "Üz müalicəsi", 
          price: 150, 
          duration: 60, 
          description: "Premium məhsullarla dərin təmizləyici üz müalicəsi"
        },
        { 
          name: "Masaj terapiyası", 
          price: 120, 
          duration: 45, 
          description: "Rahatlaşdırıcı tam bədən masajı"
        },
        { 
          name: "Manikür", 
          price: 50, 
          duration: 30, 
          description: "Dırnaq baxımı və lak tətbiqi"
        },
        { 
          name: "Saç stilləşdirmə", 
          price: 80, 
          duration: 45, 
          description: "Peşəkar saç stilləşdirmə xidməti"
        },
        { 
          name: "Makiyaj tətbiqi", 
          price: 90, 
          duration: 60, 
          description: "Xüsusi tədbirlər üçün tam üz makiyajı"
        }
      ];
      
      // Add to Supabase
      const { data, error } = await supabase
        .from('services')
        .upsert(mockServices, { onConflict: 'name' })
        .select();
      
      if (error) {
        console.error('Error adding services to Supabase:', error);
        toast({
          variant: "destructive",
          title: "Xəta baş verdi",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: "Uğurla əlavə edildi",
        description: `${data.length} xidmət Supabase-ə əlavə edildi.`,
      });
      
      // Refresh services
      fetchServices();
    } catch (error) {
      console.error('Error in addMockServicesToSupabase:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi", 
        description: "Xidmətlər əlavə edilərkən xəta baş verdi.",
      });
    }
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
                <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
                  <Button onClick={createMockServices}>
                    Nümunə xidmətləri göstər
                  </Button>
                  <Button variant="outline" onClick={addMockServicesToSupabase}>
                    Nümunələri Supabase-ə əlavə et
                  </Button>
                </div>
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
