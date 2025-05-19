
// Export components
export { default as ServiceList } from './components/ServiceList';
export { default as ServiceForm } from './components/ServiceForm';
export { default as ServiceDetail } from './components/ServiceDetail';

// Export hooks
export { useServiceData } from './hooks/useServiceData';
export { useServiceActions } from './hooks/useServiceActions';

// Export types
export type { Service, ServiceFormData } from './types';

// Export service
export { serviceService } from './services/service.service';

// Export routes
export { default as serviceRoutes } from './routes';
