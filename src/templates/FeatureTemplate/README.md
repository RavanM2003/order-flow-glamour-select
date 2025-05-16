# Feature Module Template

This is a template for creating new feature modules in the application.

## Usage Guide

1. Copy the entire `FeatureTemplate` directory to create a new feature
2. Rename the directory to match your feature name (e.g., `Products`, `Orders`, etc.)
3. Search and replace all instances of "Feature" or "feature" with your feature name
4. Update the types, components, and services to match your specific requirements
5. Import and use the feature in your application

## Directory Structure

```
FeatureTemplate/
├── components/            # UI components for the feature
│   ├── FeatureList.tsx    # List/table view of features
│   ├── FeatureForm.tsx    # Create/update form
│   └── FeatureDetail.tsx  # Detailed view of a single feature
├── hooks/                 # Custom React hooks
│   ├── useFeatureData.ts  # Data fetching and state management
│   └── useFeatureActions.ts # Actions like create, update, delete
├── services/              # API and data services
│   └── feature.service.ts # Service for API calls
├── types.ts               # TypeScript types and interfaces
├── routes.tsx             # Feature-specific routes
└── index.ts               # Main exports file
```

## Integration Guide

### 1. Adding Routes

Import your feature's routes in the main routing file:

```tsx
// In src/app/routes.tsx or App.tsx
import { featureRoutes } from '../features/YourFeature/routes';

// Then include in your Routes component
<Routes>
  {featureRoutes}
  {/* Other routes */}
</Routes>
```

### 2. Adding to Navigation

Add your feature to the navigation menu:

```tsx
// In your navigation component
<NavItem to="/your-features">Your Features</NavItem>
```

### 3. Accessing in Other Components

Import and use components and hooks from your feature:

```tsx
import { YourFeatureList, useYourFeatureData } from '../features/YourFeature';

const SomeComponent = () => {
  const { features } = useYourFeatureData();
  
  return (
    <div>
      <h2>Features</h2>
      <YourFeatureList />
    </div>
  );
};
```

## Customization

Each file contains detailed comments on how to customize it for your specific feature. Look for the "USAGE" comments at the top of each file for specific instructions.
