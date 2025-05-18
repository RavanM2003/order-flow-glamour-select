
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from "@/models/product.model";
import { Upload, Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    stock_quantity: initialData?.stock_quantity || 0,
    category: initialData?.category || "",
    image_url: initialData?.image_url || "",
    isServiceRelated: initialData?.isServiceRelated || false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const [hasServiceRelation, setHasServiceRelation] = useState<boolean>(
    initialData?.isServiceRelated || false
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || 0,
        description: initialData.description || "",
        stock_quantity: initialData.stock_quantity || 0,
        category: initialData.category || "",
        image_url: initialData.image_url || "",
        isServiceRelated: initialData.isServiceRelated || false,
      });
      setHasServiceRelation(initialData.isServiceRelated || false);
      setImagePreview(initialData.image_url || null);
    }
  }, [initialData]);

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
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // In a real app, you would upload this file to your server/storage
      // and get back a URL. For now, we'll just use a local preview.
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ 
          ...prev, 
          image_url: reader.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleServiceRelated = (checked: boolean) => {
    setHasServiceRelation(checked);
    setFormData((prev) => ({
      ...prev,
      isServiceRelated: checked,
    }));
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image_url: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <Label>Product Image</Label>
              <div className="relative">
                <div 
                  className="mt-2 flex justify-center border-2 border-dashed border-gray-300 px-6 py-10 rounded-md cursor-pointer"
                  onClick={triggerFileInput}
                >
                  {imagePreview ? (
                    <div className="text-center">
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
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
                {imagePreview && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Price and Stock - side by side */}
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
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>
            
            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Product category"
              />
            </div>
            
            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this product"
                rows={3}
              />
            </div>
            
            {/* Service Related Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="service-related">Related to Services</Label>
                <p className="text-xs text-muted-foreground">
                  Enable if this product is related to any services
                </p>
              </div>
              <Switch
                id="service-related"
                checked={hasServiceRelation}
                onCheckedChange={toggleServiceRelated}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-700 hover:bg-green-800"
              >
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
