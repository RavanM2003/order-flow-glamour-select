import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useServiceData } from '../hooks/useServiceData';
import { useServiceActions } from '../hooks/useServiceActions';
import { ServiceFormData } from '../types';

const formSchema = z.object({
  name: z.string().min(1, 'Xidmət adı tələb olunur'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Müddət 1 dəqiqədən az ola bilməz'),
  price: z.number().min(0, 'Qiymət mənfi ola bilməz'),
  discount: z.number().min(0).max(100).optional(),
  benefits: z.array(z.string()).optional(),
});

const ServiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const { services, getServiceById } = useServiceData();
  const { createService, updateService, isCreating, isUpdating } = useServiceActions(() => {
    navigate('/services');
  });

  const [benefitInput, setBenefitInput] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 30,
      price: 0,
      discount: 0,
      benefits: [],
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const loadService = async () => {
        const service = await getServiceById(id); // Use string ID directly
        if (service) {
          form.reset({
            name: service.name,
            description: service.description || '',
            duration: service.duration,
            price: service.price,
            discount: service.discount || 0,
            benefits: service.benefits || [],
          });
          setBenefits(service.benefits || []);
        }
      };
      loadService();
    }
  }, [id, isEditing, getServiceById, form]);

  const onSubmit = async (data: ServiceFormData) => {
    const formData = {
      ...data,
      benefits,
    };

    if (isEditing && id) {
      await updateService(id, formData); // Use string ID directly
    } else {
      await createService(formData);
    }
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim() !== '') {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = [...benefits];
    newBenefits.splice(index, 1);
    setBenefits(newBenefits);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Xidməti redaktə et' : 'Xidmət yarat'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad</FormLabel>
                  <FormControl>
                    <Input placeholder="Xidmət adını daxil edin" {...field} />
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
                  <FormLabel>Təsvir</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Xidmət haqqında məlumat daxil edin"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Müddət (dəqiqə)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Qiymət</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endirim (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Faydalar</FormLabel>
              <div className="flex space-x-2 mb-2">
                <Input
                  type="text"
                  placeholder="Fayda əlavə edin"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                />
                <Button type="button" onClick={handleAddBenefit}>
                  Əlavə et
                </Button>
              </div>
              {benefits.length > 0 && (
                <div className="space-y-1">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <p>{benefit}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBenefit(index)}
                      >
                        Sil
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Yüklənir...' : 'Təsdiqlə'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ServiceForm;
