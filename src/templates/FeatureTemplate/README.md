# Feature Module Template

This is a plug-and-play feature module template designed to be copied and customized for new features. It follows a modular, feature-based architecture that encapsulates all related components, hooks, services, and routes in one place.

## Structure

```
FeatureTemplate/
├── components/           # UI components specific to this feature
│   ├── FeatureDetail.tsx # Detail view component 
│   ├── FeatureForm.tsx   # Create/edit form component
│   └── FeatureList.tsx   # List view component
├── hooks/                # Custom hooks for feature logic
│   ├── useFeatureActions.ts # CRUD operations
│   └── useFeatureData.ts    # Data fetching and state
├── services/             # API integration
│   └── feature.service.ts   # REST API calls
├── types.ts              # TypeScript interfaces and types
├── routes.tsx            # Feature-specific routes
└── index.ts              # Main exports file

```

## Using this Template

### Option 1: Manual Copy

1. Copy the entire `FeatureTemplate` directory
2. Rename it to your feature name (e.g., `Products`, `Customers`)
3. Replace all instances of "Feature" with your feature name
4. Customize the components, hooks, and services as needed

### Option 2: Using the Script

The repository includes a script to automate the creation process:

```bash
# Navigate to the src/templates directory
cd src/templates

# Run the creation script (requires Node.js and fs-extra)
node create-feature.js YourFeatureName
```

The script will:
1. Create a new feature folder with your specified name
2. Rename all files and replace all occurrences of "Feature" with your feature name
3. Generate proper exports and imports

### Integrating with Your App

After creating your feature module:

1. Import the routes in your main App.tsx or routes file:
   ```tsx
   import { yourFeatureRoutes } from './features/YourFeature/routes';
   
   // Then include it in your Routes
   <Routes>
     {yourFeatureRoutes}
     {/* Other routes */}
   </Routes>
   ```

2. Use the components and hooks in your app:
   ```tsx
   import { YourFeatureList, useYourFeatureData } from './features/YourFeature';
   ```

## Customization

- **Data Model**: Update `types.ts` to match your feature's data model
- **API Integration**: Modify `services/yourFeature.service.ts` to connect to your API endpoints
- **Components**: Customize the UI components in the `components` folder
- **Routes**: Adjust the routes in `routes.tsx` to match your app's routing structure

## Best Practices

- Keep components focused on a single responsibility
- Use the hooks for logic and data fetching, keeping components presentational
- Export everything through the `index.ts` file for clean imports
- Maintain consistency in naming and folder structure across features
