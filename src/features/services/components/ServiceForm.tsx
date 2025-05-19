
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useServiceData, useServiceActions } from '../hooks';
import { Service } from '../types';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import MultiSelect from '@/components/common/MultiSelect';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 minute' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  benefits: z.array(z.string()).optional(),
  relatedProducts: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ServiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { service, fetchService } = useServiceData();
  const { createService, updateService, isCreating, isUpdating } = useServiceActions(() => {
    navigate('/services');
  });
  const { products } = useProducts();
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 30,
      price: 0,
      benefits: [],
      relatedProducts: [],
    },
  });

  // Fetch service data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchService(parseInt(id, 10))
        .then((data) => {
          if (data) {
            form.reset({
              name: data.name,
              description: data.description || '',
              duration: data.duration,
              price: data.price,
              benefits: data.benefits || [],
              relatedProducts: data.relatedProducts || [],
            });
            setBenefits(data.benefits || []);
          }
        })
        .catch((error) => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to load service: ${error.message}`,
          });
        });
    }
  }, [isEditing, id, fetchService, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      // Ensure all required fields are present
      const serviceData = {
        name: values.name,
        description: values.description || '',
        duration: values.duration,
        price: values.price,
        benefits: values.benefits || [],
        relatedProducts: values.relatedProducts || []
      };
      
      if (isEditing && id) {
        await updateService(parseInt(id, 10), serviceData);
      } else {
        await createService(serviceData);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to save service: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  // Handle adding a benefit
  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      const updatedBenefits = [...benefits, newBenefit.trim()];
      setBenefits(updatedBenefits);
      form.setValue('benefits', updatedBenefits);
      setNewBenefit('');
    }
  };

  // Handle removing a benefit
  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
    form.setValue('benefits', updatedBenefits);
  };

  // Product options for multi-select - Convert numbers to strings to match MultiSelectOption type
  const productOptions = products.map(product => ({
    value: String(product.id), // Convert number to string
    label: product.name
  }));

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Service' : 'Create New Service'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter service description"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="relatedProducts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Products</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={productOptions}
                      selected={field.value?.map(v => String(v)) || []} // Convert numbers to strings
                      onChange={(selected) => field.onChange(selected.map(Number))}
                      placeholder="Select related products"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Benefits</FormLabel>
              <div className="flex mt-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit"
                  className="flex-1 mr-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddBenefit}>
                  Add
                </Button>
              </div>
              {benefits.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{benefit}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBenefit(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/services')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? 'Update Service' : 'Create Service'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ServiceForm;
