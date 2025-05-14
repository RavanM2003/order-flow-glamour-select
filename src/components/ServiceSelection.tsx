
import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Search, Package, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { API } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
  relatedProducts?: number[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface Staff {
  id: number;
  name: string;
  position: string;
  specializations: string[];
}

export interface ServiceProvider {
  serviceId: number;
  name: string;
}

const ServiceSelection = () => {
  const { orderState, selectService, unselectService, selectProduct, unselectProduct, goToStep, updateTotal, updateServiceProviders } = useOrder();
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>(orderState.selectedServices || []);
  const [selectedProducts, setSelectedProducts] = useState<number[]>(orderState.selectedProducts || []);
  const [selectedStaff, setSelectedStaff] = useState<Record<number, string>>({});
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [view, setView] = useState<'services' | 'products'>('services');
  const [recommendedProducts, setRecommendedProducts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, productsRes, staffRes] = await Promise.all([
          API.services.list(),
          API.products.list(),
          API.staff.list()
        ]);
        
        setServices(servicesRes.data || []);
        setProducts(productsRes.data || []);
        setStaff(staffRes.data || []);
        
        // Initialize staff selection for any already-selected services
        const initialStaffSelections: Record<number, string> = {};
        orderState.serviceProviders.forEach(provider => {
          initialStaffSelections[provider.serviceId] = provider.name;
        });
        setSelectedStaff(initialStaffSelections);
        
      } catch (error) {
        console.error("Failed to load services, products, and staff:", error);
        toast({
          title: "Error loading data",
          description: "Could not load services, products, or staff information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [orderState.serviceProviders]);

  useEffect(() => {
    // Find all unique related products based on selected services
    const uniqueRelatedProducts = Array.from(
      new Set(
        selectedServices
          .map(sId => services.find(s => s.id === sId)?.relatedProducts || [])
          .flat()
      )
    );
    
    setRecommendedProducts(uniqueRelatedProducts);
  }, [selectedServices, services]);

  const handleServiceToggle = (serviceId: number) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(updatedServices);
    
    // Initialize staff selection for this service if it's newly selected
    if (!selectedServices.includes(serviceId) && !selectedStaff[serviceId]) {
      setSelectedStaff(prev => ({ ...prev, [serviceId]: "" }));
    }
  };

  const handleProductToggle = (productId: number) => {
    const updatedProducts = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    
    setSelectedProducts(updatedProducts);
  };

  const handleStaffSelect = (serviceId: number, staffName: string) => {
    setSelectedStaff(prev => ({ ...prev, [serviceId]: staffName }));
  };

  const calculateTotal = () => {
    const servicesTotal = services
      .filter(service => selectedServices.includes(service.id))
      .reduce((sum, service) => sum + service.price, 0);
    
    const productsTotal = products
      .filter(product => selectedProducts.includes(product.id))
      .reduce((sum, product) => sum + product.price, 0);
    
    return servicesTotal + productsTotal;
  };

  const handleContinue = () => {
    // Validate that all selected services have a staff member assigned
    const missingStaff = selectedServices.some(serviceId => !selectedStaff[serviceId]);
    
    if (missingStaff) {
      toast({
        title: "Missing staff selection",
        description: "Please assign a staff member to each service",
        variant: "destructive"
      });
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service to continue",
        variant: "destructive"
      });
      return;
    }

    // Clear existing selections
    orderState.selectedServices.forEach(serviceId => unselectService(serviceId));
    orderState.selectedProducts.forEach(productId => unselectProduct(productId));
    
    // Add new selections
    selectedServices.forEach(serviceId => selectService(serviceId));
    selectedProducts.forEach(productId => selectProduct(productId));
    
    // Update total
    updateTotal(calculateTotal());
    
    // Prepare service providers information
    const serviceProviders: ServiceProvider[] = [];
    Object.entries(selectedStaff).forEach(([serviceId, staffName]) => {
      const serviceIdNum = parseInt(serviceId, 10);
      if (selectedServices.includes(serviceIdNum) && staffName) {
        serviceProviders.push({
          serviceId: serviceIdNum,
          name: staffName
        });
      }
    });
    
    // Update service providers in context
    updateServiceProviders(serviceProviders);
    
    // Go to payment step
    goToStep(3);
  };

  const handleBack = () => {
    goToStep(1);
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-glamour-800">Select Services & Products</h2>
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant={view === 'services' ? 'default' : 'outline'} 
              onClick={() => setView('services')}
              className={view === 'services' ? "bg-glamour-700 hover:bg-glamour-800" : ""}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Services
              {selectedServices.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white text-glamour-700">
                  {selectedServices.length}
                </Badge>
              )}
            </Button>
            <Button 
              variant={view === 'products' ? 'default' : 'outline'} 
              onClick={() => setView('products')}
              className={view === 'products' ? "bg-glamour-700 hover:bg-glamour-800" : ""}
            >
              <Package className="h-4 w-4 mr-2" />
              Products
              {selectedProducts.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white text-glamour-700">
                  {selectedProducts.length}
                </Badge>
              )}
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading services and products...</div>
          ) : (
            <>
              {view === 'services' && (
                <div className="mb-8">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="Search services..." 
                      value={serviceSearchTerm} 
                      onChange={e => setServiceSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    {filteredServices.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No services match your search</div>
                    ) : (
                      filteredServices.map((service) => (
                        <div key={service.id} className="border rounded-md p-4 hover:bg-glamour-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <Checkbox 
                              id={`service-${service.id}`} 
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={() => handleServiceToggle(service.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label htmlFor={`service-${service.id}`} className="font-medium text-base cursor-pointer flex justify-between">
                                <span>{service.name}</span>
                                <span>${service.price}</span>
                              </Label>
                              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-muted-foreground">Duration: {service.duration}</p>
                                <Link 
                                  to={`/services/${service.id}`} 
                                  className="text-xs text-glamour-700 hover:text-glamour-800 underline"
                                >
                                  View details
                                </Link>
                              </div>
                            </div>
                          </div>
                          
                          {/* Staff selection for this service */}
                          {selectedServices.includes(service.id) && staff.length > 0 && (
                            <div className="mt-4 pt-3 border-t">
                              <Label htmlFor={`staff-${service.id}`} className="block text-sm font-medium mb-1">
                                Select Staff for this Service:
                              </Label>
                              <Select 
                                value={selectedStaff[service.id] || ""}
                                onValueChange={(value) => handleStaffSelect(service.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                  {staff.map((member) => (
                                    <SelectItem key={member.id} value={member.name}>
                                      {member.name} ({member.position})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1">
                                Only one staff member can be assigned to each service
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {view === 'products' && (
                <div className="mb-8">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="Search products..." 
                      value={productSearchTerm} 
                      onChange={e => setProductSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {recommendedProducts.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-glamour-700 mb-2">Recommended products based on your services:</h4>
                      <div className="space-y-3">
                        {products
                          .filter(product => recommendedProducts.includes(product.id))
                          .filter((product, index, self) => self.findIndex(p => p.id === product.id) === index)
                          .map((product) => (
                            <div key={product.id} className="flex items-start space-x-3 border border-glamour-200 bg-glamour-50 rounded-md p-4 hover:bg-glamour-100 transition-colors">
                              <Checkbox 
                                id={`recommended-product-${product.id}`} 
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={() => handleProductToggle(product.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label htmlFor={`recommended-product-${product.id}`} className="font-medium text-base cursor-pointer flex justify-between">
                                  <span>{product.name}</span>
                                  <span>${product.price}</span>
                                </Label>
                                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                                <div className="flex justify-end mt-2">
                                  <Link 
                                    to={`/products/${product.id}`} 
                                    className="text-xs text-glamour-700 hover:text-glamour-800 underline"
                                  >
                                    View details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <Separator className="my-4" />
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No products match your search</div>
                    ) : (
                      filteredProducts.map((product) => (
                        <div key={product.id} className="flex items-start space-x-3 border rounded-md p-4 hover:bg-glamour-50 transition-colors">
                          <Checkbox 
                            id={`product-${product.id}`} 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => handleProductToggle(product.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor={`product-${product.id}`} className="font-medium text-base cursor-pointer flex justify-between">
                              <span>{product.name}</span>
                              <span>${product.price}</span>
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                            <div className="flex justify-end mt-2">
                              <Link 
                                to={`/products/${product.id}`} 
                                className="text-xs text-glamour-700 hover:text-glamour-800 underline"
                              >
                                View details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="flex justify-between text-lg font-medium">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>Back</Button>
            <Button 
              onClick={handleContinue}
              disabled={selectedServices.length === 0}
              className="bg-glamour-700 hover:bg-glamour-800"
            >
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceSelection;
