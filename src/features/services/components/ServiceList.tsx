
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useServiceData } from '../hooks/useServiceData';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceList: React.FC = () => {
  const { services, isLoading, error, filters, updateFilters, refetch } = useServiceData();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilters({ search: value });
  };
  
  // Filter services based on search term
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  if (isLoading) {
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600 mb-4">Error loading services</p>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search services..." 
            value={searchTerm} 
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <Button className="bg-green-700 hover:bg-green-800" asChild>
          <Link to="/services/create">
            <Plus className="mr-2 h-4 w-4" /> New Service
          </Link>
        </Button>
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
                <p className="text-glamour-600">No Image</p>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-glamour-800">{service.name}</h2>
                <div className="text-glamour-700 font-semibold">${service.price}</div>
              </div>
              <p className="text-sm text-gray-500 mb-4">Duration: {service.duration} min</p>
              <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
              {service.benefits && service.benefits.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-glamour-800 mb-2">Benefits:</h3>
                  <ul className="space-y-1">
                    {service.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="text-glamour-700 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                    {service.benefits.length > 3 && (
                      <li className="text-sm text-glamour-700">
                        +{service.benefits.length - 3} more benefits
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                <Link to={`/services/${service.id}`}>
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No services found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
