
import { Service as BaseService, ServiceFormData as BaseServiceFormData } from '@/models/service.model';

export type Service = BaseService;
export type ServiceFormData = BaseServiceFormData;

export interface ServiceFilters {
  isActive?: boolean;
  search?: string;
}
