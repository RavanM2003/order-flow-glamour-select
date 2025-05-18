
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useServices } from '@/hooks/use-services';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { services: apiServices, fetchServices, isLoading } = useServices();
  const [services, setServices] = useState([]);
  
  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  // Update local state when API services change
  useEffect(() => {
    if (apiServices.length > 0) {
      setServices(apiServices);
    }
  }, [apiServices]);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format duration for display (convert minutes to a readable format)
  const formatDuration = (minutes) => {
    return `${minutes} min`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <h1 className="text-4xl font-bold text-glamour-800 mb-2">Our Services</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          Discover our comprehensive range of beauty and wellness services designed to enhance your natural beauty and promote wellbeing.
        </p>
        
        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search services..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <p className="text-glamour-600">Service Image</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-glamour-800">{service.name}</h2>
                    <div className="text-glamour-700 font-semibold">${service.price}</div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Duration: {formatDuration(service.duration)}</p>
                  <p className="text-gray-600 mb-6 line-clamp-3">{service.description}</p>
                  <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                    <Link to={`/services/${service.id}`}>
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No services found matching "{searchTerm}"</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-6">Ready to experience our premium services?</p>
          <Button size="lg" className="bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to="/booking">Book an Appointment</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
