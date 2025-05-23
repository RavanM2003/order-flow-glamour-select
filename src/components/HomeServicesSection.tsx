
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, DollarSign } from "lucide-react";
import { Service } from "@/models/service.model";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const HomeServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching services:", error);
          return;
        }
        
        if (data) {
          setServices(data as Service[]);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
            <Skeleton className="h-48 w-full" />
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {service.image_urls && service.image_urls.length > 0 ? (
                <img 
                  src={service.image_urls[0]} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-glamour-600">Xidmət şəkli</p>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-glamour-800">{service.name}</h3>
                <div className="text-glamour-700 font-semibold">{service.price} AZN</div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="mr-1 h-4 w-4" />
                <span>Müddət: {service.duration} dəq</span>
              </div>
              <p className="text-gray-600 mb-6 line-clamp-3">{service.description || "Xidmət haqqında məlumat yoxdur"}</p>
              <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                <Link to={`/services/${service.id}`}>
                  Ətraflı bax
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {services.length > 0 && (
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/services">
              Bütün xidmətlərə bax
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
      
      {services.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-6">Hələ heç bir xidmət əlavə edilməyib</p>
          <Button asChild variant="outline">
            <Link to="/services">Xidmətlər səhifəsinə bax</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomeServicesSection;
