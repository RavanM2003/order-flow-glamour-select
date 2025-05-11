import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Search, Scissors, Package, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const services = [
  { id: 1, name: "Facial Treatment", price: 150, duration: "60 min", description: "Deep cleansing facial with premium products", relatedProducts: [1, 2] },
  { id: 2, name: "Massage Therapy", price: 120, duration: "45 min", description: "Relaxing full body massage", relatedProducts: [3] },
  { id: 3, name: "Manicure", price: 50, duration: "30 min", description: "Nail care and polish application", relatedProducts: [] },
  { id: 4, name: "Hair Styling", price: 80, duration: "45 min", description: "Professional hair styling", relatedProducts: [3] },
  { id: 5, name: "Makeup Application", price: 90, duration: "60 min", description: "Full face makeup for special events", relatedProducts: [1, 2] }
];

const products = [
  { id: 1, name: "Moisturizer Cream", price: 45, description: "Hydrating face cream for daily use" },
  { id: 2, name: "Anti-Aging Serum", price: 75, description: "Premium anti-aging formula with collagen" },
  { id: 3, name: "Hair Care Kit", price: 60, description: "Complete kit for healthy hair" }
];

const ServiceSelection = () => {
  const { orderState, selectService, unselectService, selectProduct, unselectProduct, goToStep, updateTotal } = useOrder();
  const [selectedServices, setSelectedServices] = useState<number[]>(orderState.selectedServices || []);
  const [selectedProducts, setSelectedProducts] = useState<number[]>(orderState.selectedProducts || []);
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [view, setView] = useState<'services' | 'products'>('services');
  const [recommendedProducts, setRecommendedProducts] = useState<number[]>([]);

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
  }, [selectedServices]);

  const handleServiceToggle = (serviceId: number) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(updatedServices);
  };

  const handleProductToggle = (productId: number) => {
    const updatedProducts = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    
    setSelectedProducts(updatedProducts);
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
    // Clear existing selections
    orderState.selectedServices.forEach(serviceId => unselectService(serviceId));
    orderState.selectedProducts.forEach(productId => unselectProduct(productId));
    
    // Add new selections
    selectedServices.forEach(serviceId => selectService(serviceId));
    selectedProducts.forEach(productId => selectProduct(productId));
    
    // Update total
    updateTotal(calculateTotal());
    
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
              
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="flex items-start space-x-3 border rounded-md p-4 hover:bg-glamour-50 transition-colors">
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
                ))}
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
                {filteredProducts.map((product) => (
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
                ))}
              </div>
            </div>
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
