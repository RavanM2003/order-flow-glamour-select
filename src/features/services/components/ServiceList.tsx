
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/models/service.model';

const ServiceList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const servicesPerPage = 6;
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async (reset = false) => {
    const currentPage = reset ? 1 : page;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .range((currentPage - 1) * servicesPerPage, currentPage * servicesPerPage - 1)
        .order('id', { ascending: false });
      
      if (error) {
        console.error("Error fetching services:", error);
        return;
      }
      
      if (data) {
        if (reset) {
          setServices(data);
          setPage(2);
        } else {
          setServices(prev => [...prev, ...data]);
          setPage(currentPage + 1);
        }
        
        setHasMore(data.length === servicesPerPage);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Reset services and fetch based on search term
    if (value) {
      searchServices(value);
    } else {
      fetchServices(true);
    }
  };
  
  const searchServices = async (term: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .ilike('name', `%${term}%`)
        .limit(servicesPerPage);
      
      if (error) {
        console.error("Error searching services:", error);
        return;
      }
      
      if (data) {
        setServices(data);
        setHasMore(false); // Disable load more during search
      }
    } catch (error) {
      console.error("Failed to search services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter services based on search term if needed
  const filteredServices = services;
  
  if (loading && services.length === 0) {
    return (
      <div>
        <div className="mb-8 max-w-md">
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Xidmətləri axtar..." 
            value={searchTerm} 
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {service.image_urls && service.image_urls.length > 0 ? (
                <img 
                  src={service.image_urls[0]} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-glamour-600">Şəkil yoxdur</p>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-glamour-800">{service.name}</h2>
                <div className="text-glamour-700 font-semibold">{service.price} AZN</div>
              </div>
              <p className="text-sm text-gray-500 mb-4">Müddət: {service.duration} dəq</p>
              <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
              {service.benefits && service.benefits.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-glamour-800 mb-2">Faydaları:</h3>
                  <ul className="space-y-1">
                    {service.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="text-glamour-700 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                    {service.benefits.length > 3 && (
                      <li className="text-sm text-glamour-700">
                        +{service.benefits.length - 3} daha çox fayda
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                <Link to={`/services/${service.id}`}>
                  Ətraflı bax
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {loading && (
          <>
            {[1, 2, 3].map((index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>
      
      {filteredServices.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">"{searchTerm}" üçün heç bir xidmət tapılmadı</p>
          <Button
            variant="link"
            className="text-glamour-700"
            onClick={() => {
              setSearchTerm("");
              fetchServices(true);
            }}
          >
            Axtarışı təmizlə
          </Button>
        </div>
      )}
      
      {hasMore && !searchTerm && (
        <div className="mt-8 text-center">
          <Button 
            onClick={() => fetchServices()}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Yüklənir..." : "Daha çox göstər"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
