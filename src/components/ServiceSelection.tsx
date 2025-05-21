
import React, { useEffect, useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Service } from "@/models/service.model";
import { Product as ModelProduct } from "@/models/product.model";
import { Staff as ModelStaff } from "@/models/staff.model";
import { Product, Staff } from "@/context/OrderContext.d";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

const ServiceSelection = () => {
  const { orderState, setPrevStep, setNextStep, setSelectedService, setSelectedStaff, addProduct, removeProduct, selectService } = useOrder();
  const { selectedService, selectedProducts } = orderState;
  const { t } = useLanguage();
  
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<ModelProduct[]>([]);
  const [staffMembers, setStaffMembers] = useState<ModelStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  
  // Fetch services when component mounts
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

  // Fetch products and staff when service is selected
  useEffect(() => {
    if (!selectedService) return;
    
    const fetchRelatedProducts = async () => {
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
          // Create a valid Staff array with proper type checking
          const processedStaff: ModelStaff[] = data.map(staffMember => {
            // Instead of trying to access name directly, create a name from available data
            const staffId = staffMember.id ? staffMember.id : 0;
            const staffName = `Staff #${staffId}`;
            
            // Create a base staff object with required properties
            const staffObject: ModelStaff = {
              id: staffId,
              name: staffName,
              position: typeof staffMember.position === 'string' ? staffMember.position : 'Staff Member',
              specializations: Array.isArray(staffMember.specializations) 
                ? staffMember.specializations.map(String)
                : [],
              created_at: typeof staffMember.created_at === 'string' 
                ? staffMember.created_at 
                : new Date().toISOString(),
              updated_at: typeof staffMember.updated_at === 'string'
                ? staffMember.updated_at
                : new Date().toISOString(),
              user_id: typeof staffMember.user_id === 'string'
                ? staffMember.user_id
                : '',
            };
            
            // Add optional properties only if they exist in the data
            if ('email' in staffMember && staffMember.email !== undefined) 
              staffObject.email = String(staffMember.email);
            
            if ('phone' in staffMember && staffMember.phone !== undefined) 
              staffObject.phone = String(staffMember.phone);
            
            if ('role_id' in staffMember && staffMember.role_id !== undefined) 
              staffObject.role_id = Number(staffMember.role_id);
            
            if ('avatar_url' in staffMember && staffMember.avatar_url !== undefined) 
              staffObject.avatar_url = String(staffMember.avatar_url);
            
            if ('salary' in staffMember && staffMember.salary !== undefined) 
              staffObject.salary = Number(staffMember.salary);
            
            if ('commissionRate' in staffMember && staffMember.commissionRate !== undefined) 
              staffObject.commissionRate = Number(staffMember.commissionRate);
            
            if ('paymentType' in staffMember && staffMember.paymentType !== undefined) 
              staffObject.paymentType = String(staffMember.paymentType);
            
            return staffObject;
          });
          
          setStaffMembers(processedStaff);
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
    selectService(service.id);
  };

  const handleProductToggle = (product: ModelProduct) => {
    if (selectedProducts.some(p => p.id === product.id)) {
      removeProduct(product.id);
    } else {
      addProduct(product.id);
    }
  };

  const handleStaffSelect = (staff: ModelStaff) => {
    // Convert ModelStaff to OrderContext Staff type
    const contextStaff: Staff = {
      id: String(staff.id),
      name: staff.name,
      position: staff.position,
      specializations: staff.specializations?.map(Number),
      avatar_url: staff.avatar_url
    };
    
    setSelectedStaff(contextStaff);
  };

  const handleNext = () => {
    const selectedStaff = orderState.selectedStaff;
    if (selectedService && selectedStaff) {
      setNextStep();
    } else {
      alert(t('booking.selectServiceAndStaff'));
    }
  };

  if (loading) {
    return <div className="py-8 text-center">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('booking.selectService')}</h2>
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
                {t('booking.duration')}: {service.duration} {t('booking.minutes')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('booking.selectStaff')}</h2>
          {staffLoading ? (
            <div className="text-center">{t('common.loading')}</div>
          ) : staffMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    orderState.selectedStaff?.id === String(staff.id)
                      ? "border-purple-500 bg-purple-50"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => handleStaffSelect(staff)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                      {staff.name.charAt(0).toUpperCase()}
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
            <p className="text-gray-500">{t('booking.noStaffForService')}</p>
          )}
        </div>
      )}

      {selectedService && products.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('booking.additionalProducts')}</h2>
          {productLoading ? (
            <div className="text-center">{t('common.loading')}</div>
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
                      {isSelected ? t('booking.selected') : t('booking.addItem')}
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
          {t('common.back')}
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedService || !orderState.selectedStaff}
        >
          {t('common.continue')}
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;
