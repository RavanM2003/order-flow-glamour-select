# Troubleshooting Guide

This guide addresses common issues you might encounter when using the feature template.

## Common Issues

### 1. Routes Not Showing Up

**Problem**: Your new feature's routes don't appear in the application.

**Solutions**:
- Make sure you've imported the routes in your main App.tsx or routes file:
  ```tsx
  import { yourFeatureRoutes } from './features/YourFeature/routes';
  
  // Then include in your Routes component
  <Routes>
    {yourFeatureRoutes}
    {/* Other routes */}
  </Routes>
  ```
- Check that the paths in your feature's routes.tsx don't conflict with existing routes
- Verify that your route components are properly exported

### 2. API Calls Returning Errors

**Problem**: API calls from your feature's service are failing.

**Solutions**:
- Check if your API endpoint URLs are correct
- Verify authentication headers are properly set
- Ensure the API expects the data format you're sending
- Check for CORS issues if calling external APIs
- Make sure your mock data format matches what the components expect

### 3. Type Errors

**Problem**: TypeScript errors related to your feature's types.

**Solutions**:
- Make sure your component props match the interfaces defined in types.ts
- Check that your API response handling correctly maps to your defined types
- Ensure you're using the proper exported types from your feature

### 4. Feature Not Self-Contained

**Problem**: Your feature has unexpected dependencies on other parts of the application.

**Solutions**:
- Move shared utilities to a common utils folder
- Use dependency injection for services when needed
- Create adapters for integrating with global state or services

### 5. Naming Conflicts

**Problem**: Name collisions with existing components or functions.

**Solutions**:
- Use more specific prefixes for your feature's exports
- Consider namespacing your exports in index.ts
- Check for duplicate export names across features

## Integration Issues

### Using with Global State (Redux, Context, etc.)

If your feature needs to interact with global state:

1. Create custom hooks within your feature that use the global state
2. Keep the feature's internal state separate from global state
3. Use adapters to connect your feature's actions to global state actions

### Authentication and Authorization

For features that require authentication:

1. Create a higher-order component or custom hook in your feature to handle auth checks
2. Use your app's authentication context or service
3. Add route guards in your feature's routes.tsx

## Advanced Customization

### Extending the Template

To add additional functionality to the template:

1. Add new component files in the components directory
2. Create additional hooks for specialized logic
3. Export all new files through index.ts
4. Update the create-feature.js script if needed

### Testing

To add tests for your feature:

1. Create a `__tests__` directory in your feature folder
2. Add test files that match your component names with .test.tsx extension
3. Consider adding test utilities specific to your feature

## Performance Optimizations

If your feature deals with large amounts of data:

1. Add pagination to your list component
2. Implement virtualization for long lists
3. Add memoization to expensive computations
4. Use the `React.memo` HOC for components that render frequently

## Accessibility

Ensure your components are accessible:

1. Use proper ARIA attributes
2. Ensure keyboard navigation works
3. Test with screen readers
4. Maintain proper contrast ratios

Need more help? Check the official documentation or ask your team lead.
