
/**
 * Main feature export file
 * 
 * This file exports all components, hooks, and other utilities from the feature
 * so they can be imported from a single location.
 * 
 * USAGE:
 * 1. Rename all instances of "Feature" to your feature name (e.g., "Product", "Customer")
 * 2. Export any additional components you create
 */

// Export components
export { default as FeatureList } from './components/FeatureList';
export { default as FeatureForm } from './components/FeatureForm';
export { default as FeatureDetail } from './components/FeatureDetail';

// Export hooks
export { useFeatureData } from './hooks/useFeatureData';
export { useFeatureActions } from './hooks/useFeatureActions';

// Export types
export type { Feature, FeatureFormData } from './types';

// Export service
export { featureService } from './services/feature.service';

// Export routes
export { default as featureRoutes } from './routes';
