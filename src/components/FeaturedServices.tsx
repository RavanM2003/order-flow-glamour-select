
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Service } from "@/models/service.model";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .limit(3);
        
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <Skeleton className="h-10 w-10 rounded mb-4" />
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {services.map((service) => (
          <div key={service.id} className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">{service.description || "Xidmət haqqında məlumat yoxdur"}</p>
            <div className="text-sm text-muted-foreground">Müddət: {service.duration} dəq</div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Button asChild variant="outline">
          <Link to="/services">
            Bütün xidmətlərə bax
            <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedServices;
