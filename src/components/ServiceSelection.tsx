
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { ServiceItem, ProductItem, CartItem, useOrder } from "@/context/OrderContext";

const ServiceSelection = () => {
  const { services, products, addToCart, removeFromCart, orderState, getTotal, nextStep } = useOrder();
  const [selectedTab, setSelectedTab] = useState<string>("services");
  
  const isSelected = (id: string): boolean => {
    return orderState.cartItems.some(item => item.id === id);
  };

  const handleServiceToggle = (service: ServiceItem) => {
    if (isSelected(service.id)) {
      removeFromCart(service.id);
    } else {
      const cartItem: CartItem = {
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: 1,
        type: 'service'
      };
      addToCart(cartItem);
    }
  };

  const handleProductToggle = (product: ProductItem) => {
    if (isSelected(product.id)) {
      removeFromCart(product.id);
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        type: 'product'
      };
      addToCart(cartItem);
    }
  };

  const categoryMap = {
    services: [...new Set(services.map(service => service.category))],
    products: [...new Set(products.map(product => product.category))]
  };

  return (
    <div className="checkout-step space-y-6 pb-12 pt-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-glamour-800">Select Services & Products</h2>
        <p className="text-muted-foreground">Choose the services and products you would like to book.</p>
      </div>

      <Tabs defaultValue="services" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-6 pt-4">
          {categoryMap.services.map(category => (
            <div key={`service-category-${category}`} className="space-y-4">
              <h3 className="text-xl font-semibold text-glamour-700">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services
                  .filter(service => service.category === category)
                  .map(service => (
                    <Card key={service.id} className={`service-card p-4 cursor-pointer relative overflow-hidden transition-all ${isSelected(service.id) ? 'selected' : ''}`} onClick={() => handleServiceToggle(service)}>
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        {isSelected(service.id) && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check size={16} />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline">{service.duration}</Badge>
                        <p className="font-bold text-glamour-700">${service.price}</p>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="products" className="space-y-6 pt-4">
          {categoryMap.products.map(category => (
            <div key={`product-category-${category}`} className="space-y-4">
              <h3 className="text-xl font-semibold text-glamour-700">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter(product => product.category === category)
                  .map(product => (
                    <Card key={product.id} className={`service-card p-4 cursor-pointer relative overflow-hidden transition-all ${isSelected(product.id) ? 'selected' : ''}`} onClick={() => handleProductToggle(product)}>
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        {isSelected(product.id) && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check size={16} />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-end justify-end">
                        <p className="font-bold text-glamour-700">${product.price}</p>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              {orderState.cartItems.length} {orderState.cartItems.length === 1 ? 'item' : 'items'} selected
            </p>
            <p className="text-xl font-bold">Total: ${getTotal()}</p>
          </div>
          <Button 
            onClick={nextStep} 
            className="bg-glamour-700 hover:bg-glamour-800"
            disabled={orderState.cartItems.length === 0}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
