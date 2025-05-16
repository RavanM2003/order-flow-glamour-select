
/**
 * Feature Detail Component
 * 
 * Displays detailed information about a single feature
 * 
 * USAGE:
 * 1. Rename all instances of "Feature" to your feature name
 * 2. Update displayed properties to match your data model
 * 3. Customize UI as needed
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Feature } from '../types';
import { featureService } from '../services/feature.service';
import { useFeatureActions } from '../hooks/useFeatureActions';

// Interface for component props
interface FeatureDetailProps {
  featureId?: string | number; // Either pass id as prop or use from URL params
  onEdit?: (feature: Feature) => void;
  onBack?: () => void;
}

const FeatureDetail: React.FC<FeatureDetailProps> = ({
  featureId: propFeatureId,
  onEdit,
  onBack
}) => {
  // Get ID from props or URL params
  const { id: urlFeatureId } = useParams<{ id: string }>();
  const featureId = propFeatureId || urlFeatureId;
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteFeature } = useFeatureActions();
  
  const [feature, setFeature] = useState<Feature | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch feature data
  useEffect(() => {
    const fetchFeature = async () => {
      if (!featureId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await featureService.getById(featureId);
        if (response.error) {
          setError(response.error);
          toast({
            title: 'Error',
            description: response.error,
            variant: 'destructive',
          });
        } else if (response.data) {
          setFeature(response.data);
        } else {
          setError('Feature not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeature();
  }, [featureId, toast]);
  
  // Handle delete action
  const handleDelete = async () => {
    if (!feature) return;
    
    const response = await deleteFeature(feature.id);
    if (response.error) {
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Feature deleted successfully',
      });
      if (onBack) {
        onBack();
      } else {
        // Navigate back to features list
        navigate('/features');
      }
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Navigate back to features list
      navigate('/features');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading feature details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBack}>Back</Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (!feature) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Feature Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested feature could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBack}>Back</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{feature.name}</CardTitle>
        <CardDescription>
          Feature ID: {feature.id}
          {feature.createdAt && ` • Created: ${new Date(feature.createdAt).toLocaleDateString()}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Feature Details */}
        <div>
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground">{feature.description || 'No description available'}</p>
        </div>
        
        <Separator />
        
        {/* Add more details sections as needed */}
        {/* For example:
        <div>
          <h3 className="font-medium">Custom Property</h3>
          <p className="text-muted-foreground">{feature.customProperty}</p>
        </div>
        */}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        
        <div className="flex space-x-2">
          {onEdit && (
            <Button onClick={() => onEdit(feature)}>
              Edit
            </Button>
          )}
          
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FeatureDetail;
