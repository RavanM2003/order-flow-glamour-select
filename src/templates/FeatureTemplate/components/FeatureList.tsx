
/**
 * Feature List Component
 * 
 * Displays a list of features with search, sort, and filter capabilities
 * 
 * USAGE:
 * 1. Rename all instances of "Feature" to your feature name
 * 2. Update column definitions to match your data model
 * 3. Customize the table UI as needed
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useFeatureData } from '../hooks/useFeatureData';
import { useFeatureActions } from '../hooks/useFeatureActions';
import { Feature } from '../types';

// Interface for component props
interface FeatureListProps {
  onSelect?: (feature: Feature) => void;
  onEdit?: (feature: Feature) => void;
  onAdd?: () => void;
}

const FeatureList: React.FC<FeatureListProps> = ({
  onSelect,
  onEdit,
  onAdd
}) => {
  // Fetch features using the custom hook
  const { features, isLoading, error, filters, updateFilters, refetch } = useFeatureData();
  
  // Feature actions
  const { deleteFeature, isDeleting } = useFeatureActions();
  
  // Local state for search input
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  // Handle delete confirmation
  const handleDelete = async (id: number | string) => {
    await deleteFeature(id);
    refetch();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Features</CardTitle>
        <div className="flex gap-2">
          {onAdd && (
            <Button onClick={onAdd}>
              Add New Feature
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline">Search</Button>
        </form>

        {/* Features Table */}
        {isLoading ? (
          <div className="flex justify-center p-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 p-4">Error: {String(error)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features && features.length > 0 ? (
                features.map((feature) => (
                  <TableRow key={feature.id} className="cursor-pointer">
                    <TableCell onClick={() => onSelect?.(feature)}>
                      {feature.name}
                    </TableCell>
                    <TableCell onClick={() => onSelect?.(feature)}>
                      {feature.description || 'N/A'}
                    </TableCell>
                    <TableCell onClick={() => onSelect?.(feature)}>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEdit?.(feature)}
                        >
                          Edit
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this feature?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(feature.id)}
                                className="bg-red-500 hover:bg-red-600"
                                disabled={isDeleting}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No features found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureList;
