
import React, { useEffect, useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Service } from "@/models/service.model";
import { Product } from "@/models/product.model";
import { Staff } from "@/models/staff.model";
import { supabase } from "@/integrations/supabase/client";

const ServiceSelection = () => {
  const { orderState, setPrevStep, setNextStep, setSelectedService, addProduct, removeProduct } = useOrder();
  const { selectedService, selectedProducts } = orderState;
  
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*');
        
        if (error) {
          console.error("Error fetching services:", error);
          return;
        }
        
        if (data) {
          setServices(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch related products when a service is selected
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!selectedService) return;
      
      setProductLoading(true);
      try {
        // First fetch service_products to get related product ids
        const { data: relationData, error: relationError } = await supabase
          .from('service_products')
          .select('product_id')
          .eq('service_id', selectedService.id);
        
        if (relationError) {
          console.error("Error fetching service-product relations:", relationError);
          return;
        }
        
        if (relationData && relationData.length > 0) {
          const productIds = relationData.map(item => item.product_id);
          
          // Then fetch the actual products
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);
          
          if (productsError) {
            console.error("Error fetching related products:", productsError);
            return;
          }
          
          if (productsData) {
            setProducts(productsData);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setProductLoading(false);
      }
    };

    const fetchStaffForService = async () => {
      if (!selectedService) return;
      
      setStaffLoading(true);
      try {
        // In a real app, we would fetch staff who can perform this service
        // For now, let's just fetch all staff members
        const { data, error } = await supabase
          .from('staff')
          .select('*');
        
        if (error) {
          console.error("Error fetching staff:", error);
          return;
        }
        
        if (data) {
          // Process staff data with type-safe transformations
          const processedStaff: Staff[] = data.map(staffMember => {
            const staffName = staffMember.name || `Staff #${staffMember.id}`;
            const processedSpecializations = Array.isArray(staffMember.specializations) 
              ? staffMember.specializations.map(s => String(s)) // Convert numbers to strings
              : [];
              
            return {
              ...staffMember,
              name: staffName,
              specializations: processedSpecializations, // Ensure specializations is string[]
              position: staffMember.position || 'Staff Member' // Ensure position exists
            } as Staff;
          });
          
          setStaffMembers(processedStaff);
          // Reset selected staff when service changes
          setSelectedStaff(null);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setStaffLoading(false);
      }
    };

    fetchRelatedProducts();
    fetchStaffForService();
  }, [selectedService]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleProductToggle = (product: Product) => {
    if (selectedProducts.some(p => p.id === product.id)) {
      removeProduct(product);
    } else {
      addProduct(product);
    }
  };

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
  };

  const handleNext = () => {
    if (selectedService && selectedStaff) {
      // Save selected staff to order context
      // You'll need to update your OrderContext to include staff
      // For now, we'll just move to the next step
      setNextStep();
    } else {
      alert("Xahiş edirik xidmət və işçi seçin");
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Xidmətlər yüklənir...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Xidmət seçin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedService?.id === service.id
                  ? "border-purple-500 bg-purple-50"
                  : "hover:border-gray-400"
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{service.name}</h3>
                <span className="text-sm font-medium">
                  {service.price} AZN
                </span>
              </div>
              {service.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {service.description}
                </p>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Müddət: {service.duration} dəq
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <div>
          <h2 className="text-2xl font-bold mb-4">İşçi seçin</h2>
          {staffLoading ? (
            <div className="text-center">İşçilər yüklənir...</div>
          ) : staffMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedStaff?.id === staff.id
                      ? "border-purple-500 bg-purple-50"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => handleStaffSelect(staff)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                      {staff.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div>
                      <h3 className="font-semibold">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Bu xidmət üçün işçi tapılmadı.</p>
          )}
        </div>
      )}

      {selectedService && products.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Əlavə məhsullar</h2>
          {productLoading ? (
            <div className="text-center">Məhsullar yüklənir...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const isSelected = selectedProducts.some(p => p.id === product.id);
                return (
                  <div
                    key={product.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      isSelected
                        ? "border-purple-500 bg-purple-50"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => handleProductToggle(product)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{product.name}</h3>
                      <span className="text-sm font-medium">
                        {product.price} AZN
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {isSelected ? "Seçildi" : "Əlavə et"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={setPrevStep}>
          Geri
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedService || !selectedStaff}
        >
          Davam et
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;
