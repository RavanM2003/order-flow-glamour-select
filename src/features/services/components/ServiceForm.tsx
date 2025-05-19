
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/use-products";
import { ServiceFormData } from "../types";
import { Plus, Trash, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import MultiSelect from "@/components/common/MultiSelect";
import { useParams, useNavigate } from "react-router-dom";
import { useServiceData, useServiceActions } from "../hooks";

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  isSubmitting?: boolean;
}

const MAX_BENEFITS = 6;

const ServiceFormWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { service, fetchService, isLoading: isLoadingService } = useServiceData();
  const { createService, updateService, isCreating, isUpdating } = useServiceActions(() => {
    navigate("/services");
  });
  
  // Fetch service if editing
  useEffect(() => {
    if (id) {
      fetchService(parseInt(id, 10));
    }
  }, [id, fetchService]);
  
  const isSubmitting = isCreating || isUpdating;
  
  const handleSubmit = async (data: ServiceFormData) => {
    if (id) {
      await updateService(parseInt(id, 10), data);
    } else {
      await createService(data);
    }
  };
  
  if (id && isLoadingService && !service) {
    return (
      <div className="p-6">
        <p>Loading service data...</p>
      </div>
    );
  }
  
  return <ServiceForm 
    initialData={service || undefined} 
    onSubmit={handleSubmit} 
    isSubmitting={isSubmitting} 
  />;
};

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const { products } = useProducts();
  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    duration: initialData?.duration || 60,
    description: initialData?.description || "",
    relatedProducts: initialData?.relatedProducts || [],
    benefits: initialData?.benefits || [],
    image_urls: initialData?.image_urls || [],
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_urls?.[0] || null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server/storage
      // and get back a URL. For now, we'll just use a local preview.
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setFormData((prev) => ({ 
          ...prev, 
          image_urls: [imageUrl] 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleProductsChange = (selectedProducts: string[]) => {
    setFormData((prev) => ({
      ...prev,
      relatedProducts: selectedProducts.map(id => Number(id)),
    }));
  };

  const addBenefit = () => {
    if (formData.benefits && formData.benefits.length >= MAX_BENEFITS) {
      toast({
        title: "Maximum benefits reached",
        description: `You can only add up to ${MAX_BENEFITS} benefits.`,
      });
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      benefits: [...(prev.benefits || []), ""],
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    const updatedBenefits = [...(formData.benefits || [])];
    updatedBenefits[index] = value;
    
    setFormData((prev) => ({
      ...prev,
      benefits: updatedBenefits,
    }));
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = [...(formData.benefits || [])];
    updatedBenefits.splice(index, 1);
    
    setFormData((prev) => ({
      ...prev,
      benefits: updatedBenefits,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Transform products for MultiSelect
  const productOptions = products.map((product) => ({
    value: product.id?.toString() || "",
    label: product.name,
  }));

  // Get selected product IDs as strings
  const selectedProductIds = formData.relatedProducts?.map(id => id.toString()) || [];

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Service Name */}
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter service name"
                required
              />
            </div>
            
            {/* Price and Duration - side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₼)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="60"
                  required
                />
              </div>
            </div>
            
            {/* Image Upload */}
            <div>
              <Label>Service Image</Label>
              <div 
                className="mt-2 flex justify-center border-2 border-dashed border-gray-300 px-6 py-10 rounded-md cursor-pointer"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <div className="text-center">
                    <img 
                      src={imagePreview} 
                      alt="Service preview" 
                      className="mx-auto mb-4 max-h-40 object-cover rounded"
                    />
                    <p className="text-sm text-muted-foreground">Click to change image</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-green-400" />
                    <p className="mt-2 text-sm font-semibold text-green-600">Click to upload an image</p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this service"
                rows={3}
              />
            </div>
            
            {/* Related Products */}
            <div>
              <Label>Related Products</Label>
              <MultiSelect
                options={productOptions}
                value={selectedProductIds}
                onChange={handleProductsChange}
                placeholder="Select related products"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select products that are commonly used with this service
              </p>
            </div>
            
            {/* Benefits */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Benefits</Label>
                {(formData.benefits?.length || 0) < MAX_BENEFITS && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBenefit}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Benefit
                  </Button>
                )}
              </div>
              
              {formData.benefits && formData.benefits.length > 0 ? (
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        placeholder={`Benefit ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeBenefit(index)}
                        className="h-10 w-10 flex-shrink-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No benefits added. Add up to {MAX_BENEFITS} benefits to highlight the advantages of this service.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-700 hover:bg-green-800"
              >
                {isSubmitting ? "Saving..." : initialData?.id ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceFormWrapper;
