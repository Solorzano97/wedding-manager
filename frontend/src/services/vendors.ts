import api from './api'
import type { VendorProfile, ServiceCategory, PageResponse } from '../types'
export const vendorService = {
  search: (params: { city?: string; category?: string; q?: string; page?: number }) =>
    api.get<PageResponse<VendorProfile>>('/vendors', { params }),
  getBySlug: (slug: string) => api.get<VendorProfile>(`/vendors/${slug}`),
  getCategories: () => api.get<ServiceCategory[]>('/service-categories'),
}
