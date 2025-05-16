#!/usr/bin/env node

/**
 * This script helps create a new feature from the FeatureTemplate
 * 
 * Usage:
 * node create-feature.js MyFeatureName
 * 
 * Requirements:
 * - Node.js
 * - fs-extra package (npm install fs-extra)
 */

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

// Get the feature name from command line arguments
const featureName = process.argv[2];

if (!featureName) {
  console.error('Please provide a feature name. Example: node create-feature.js Products');
  process.exit(1);
}

// Convert feature name to different cases
const pascalCase = featureName.charAt(0).toUpperCase() + featureName.slice(1); // ProductFeature
const camelCase = featureName.charAt(0).toLowerCase() + featureName.slice(1);  // productFeature
const kebabCase = featureName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); // product-feature

// Paths
const templateDir = path.join(__dirname, 'FeatureTemplate');
const targetDir = path.join(__dirname, '..', 'features', pascalCase);

// Check if template exists
if (!fs.existsSync(templateDir)) {
  console.error('Template directory not found. Make sure you run this script from the correct location.');
  process.exit(1);
}

// Check if target directory already exists
if (fs.existsSync(targetDir)) {
  console.error(`Directory ${targetDir} already exists. Choose a different name or delete the existing directory.`);
  process.exit(1);
}

// Copy the template to the new location
console.log(`Creating new feature: ${pascalCase}...`);
fs.copySync(templateDir, targetDir);

// Function to replace content in a file
const replaceInFile = (filePath, searchRegex, replacement) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(searchRegex, replacement);
  fs.writeFileSync(filePath, newContent, 'utf8');
};

// Function to rename a file
const renameFile = (directory, oldName, newName) => {
  const oldPath = path.join(directory, oldName);
  const newPath = path.join(directory, newName);
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
};

// Walk through all files in the new directory
const processDirectory = (dir) => {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Process subdirectories
      processDirectory(itemPath);
      
      // Rename directory if it has "Feature" in the name
      if (item.includes('Feature')) {
        const newName = item.replace(/Feature/g, pascalCase);
        renameFile(dir, item, newName);
      }
    } else {
      // Process files
      if (item.includes('Feature')) {
        // Rename file
        const newName = item.replace(/Feature/g, pascalCase);
        renameFile(dir, item, newName);
        
        // Update the renamed file path for content replacement
        const newPath = path.join(dir, newName);
        
        // Replace content in the file
        replaceInFile(newPath, /Feature/g, pascalCase);
        replaceInFile(newPath, /feature/g, camelCase);
        replaceInFile(newPath, /features/g, `${camelCase}s`);
        replaceInFile(newPath, /\/features\//g, `/${kebabCase}s/`);
      } else {
        // No need to rename, just replace content
        replaceInFile(itemPath, /Feature/g, pascalCase);
        replaceInFile(itemPath, /feature/g, camelCase);
        replaceInFile(itemPath, /features/g, `${camelCase}s`);
        replaceInFile(itemPath, /\/features\//g, `/${kebabCase}s/`);
      }
    }
  }
};

// Process the new feature directory
processDirectory(targetDir);

console.log(`
✅ Feature "${pascalCase}" created successfully!

Next steps:
1. Update the types in src/features/${pascalCase}/types.ts to match your data model
2. Customize the components in src/features/${pascalCase}/components/
3. Update the API service in src/features/${pascalCase}/services/${camelCase}.service.ts
4. Import the routes in your main App.tsx or routes.tsx file:

   import { ${camelCase}Routes } from './features/${pascalCase}/routes';
   
   Then add them to your Routes component:
   
   <Routes>
     {${camelCase}Routes}
     {/* Other routes */}
   </Routes>

Happy coding! 🚀
`);
