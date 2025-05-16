
/**
 * Feature Form Component
 * 
 * Form for creating or editing features
 * 
 * USAGE:
 * 1. Rename all instances of "Feature" to your feature name
 * 2. Update form fields to match your data model
 * 3. Adjust validation rules as needed
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Feature, FeatureFormData } from '../types';
import { useFeatureActions } from '../hooks/useFeatureActions';

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  // Add more fields as needed
});

// Interface for component props
interface FeatureFormProps {
  feature?: Feature; // Provide for edit mode, omit for create mode
  onSuccess?: (feature: Feature) => void;
  onCancel?: () => void;
}

const FeatureForm: React.FC<FeatureFormProps> = ({
  feature,
  onSuccess,
  onCancel
}) => {
  const isEditMode = !!feature;
  const { createFeature, updateFeature, isCreating, isUpdating } = useFeatureActions();
  
  // Initialize form with schema validation
  const form = useForm<FeatureFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      // Initialize other fields as needed
    }
  });
  
  // Populate form when feature data is available (edit mode)
  useEffect(() => {
    if (feature) {
      form.reset({
        name: feature.name,
        description: feature.description || '',
        // Set other fields from feature
      });
    }
  }, [feature, form]);
  
  // Handle form submission
  const onSubmit = async (data: FeatureFormData) => {
    try {
      let response;
      
      if (isEditMode && feature) {
        response = await updateFeature(feature.id, data);
      } else {
        response = await createFeature(data);
      }
      
      if (response.data && onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Feature' : 'Create New Feature'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Feature name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Feature description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Add more form fields here as needed */}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default FeatureForm;
