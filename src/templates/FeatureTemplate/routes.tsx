
/**
 * Feature Routes
 * 
 * Defines the routes for this feature
 * 
 * USAGE:
 * 1. Rename all instances of "feature" to your feature name
 * 2. Import your feature components
 * 3. Update route paths as needed
 * 4. Import these routes in your main App.tsx or routes file
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { FeatureList, FeatureDetail } from './index';

// You can wrap your routes with layout components or authentication as needed
// This is just a basic example
export const featureRoutes = (
  <>
    {/* List View */}
    <Route 
      path="/features" 
      element={<FeatureList />} 
    />
    
    {/* Detail View */}
    <Route 
      path="/features/:id" 
      element={<FeatureDetail />} 
    />
    
    {/* Add more routes as needed */}
  </>
);

/**
 * INTEGRATION GUIDE:
 * 
 * To integrate these routes into your main routing setup, you have two options:
 * 
 * Option 1: Import directly in your App.tsx or main routes file
 * ```
 * // In your App.tsx or routes.tsx file
 * import { featureRoutes } from './features/YourFeature/routes';
 * 
 * // Then include it in your Routes
 * <Routes>
 *   {featureRoutes}
 *   {/* Other routes */}
 * </Routes>
 * ```
 * 
 * Option 2: Use React Router's useRoutes hook for more flexibility
 * ```
 * // Define your routes as objects
 * export const featureRoutesConfig = [
 *   {
 *     path: '/features',
 *     element: <FeatureList />
 *   },
 *   {
 *     path: '/features/:id',
 *     element: <FeatureDetail />
 *   }
 * ];
 * 
 * // In your main routes file
 * import { featureRoutesConfig } from './features/YourFeature/routes';
 * 
 * const routesConfig = [
 *   ...featureRoutesConfig,
 *   // other routes
 * ];
 * 
 * const Router = () => {
 *   const routes = useRoutes(routesConfig);
 *   return routes;
 * };
 * ```
 */
