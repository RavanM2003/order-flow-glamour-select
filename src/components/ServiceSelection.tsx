
import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const services = [
  { id: 1, name: "Facial Treatment", price: 150, duration: "60 min", description: "Deep cleansing facial with premium products" },
  { id: 2, name: "Massage Therapy", price: 120, duration: "45 min", description: "Relaxing full body massage" },
  { id: 3, name: "Manicure", price: 50, duration: "30 min", description: "Nail care and polish application" },
  { id: 4, name: "Hair Styling", price: 80, duration: "45 min", description: "Professional hair styling" },
  { id: 5, name: "Makeup Application", price: 90, duration: "60 min", description: "Full face makeup for special events" }
];

const products = [
  { id: 1, name: "Moisturizer Cream", price: 45, description: "Hydrating face cream for daily use" },
  { id: 2, name: "Anti-Aging Serum", price: 75, description: "Premium anti-aging formula with collagen" },
  { id: 3, name: "Hair Care Kit", price: 60, description: "Complete kit for healthy hair" }
];

const ServiceSelection = () => {
  const { orderState, selectService, selectProduct, goToStep, updateTotal } = useOrder();
  const [selectedServices, setSelectedServices] = useState<number[]>(orderState.selectedServices || []);
  const [selectedProducts, setSelectedProducts] = useState<number[]>(orderState.selectedProducts || []);

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
    // Save selected services and products to order context
    selectedServices.forEach(serviceId => {
      selectService(serviceId);
    });
    
    selectedProducts.forEach(productId => {
      selectProduct(productId);
    });
    
    // Update total
    updateTotal(calculateTotal());
    
    // Go to payment step
    goToStep(3);
  };

  const handleBack = () => {
    goToStep(1);
  };

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-glamour-800">Select Services & Products</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <div className="space-y-4">
              {services.map((service) => (
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
                    <p className="text-xs text-muted-foreground mt-1">Duration: {service.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <div className="space-y-4">
              {products.map((product) => (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
          
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
