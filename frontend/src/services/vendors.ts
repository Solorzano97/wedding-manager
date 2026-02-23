import api from './api'
import type { VendorProfile, ServiceCategory, PageResponse } from '../types'

export interface VendorServiceResponse {
  id: number; vendorProfileId: number; serviceCategoryId: number
  name: string; description: string | null; basePrice: number; maxPrice: number | null
  currencyCode: string; priceUnit: string | null; minGuests: number | null; maxGuests: number | null; active: boolean
}

export const vendorService = {
  // Public
  search: (params: { city?: string; category?: string; q?: string; page?: number; size?: number }) =>
    api.get<PageResponse<VendorProfile>>('/vendors', { params }),
  getBySlug: (slug: string) =>
    api.get<VendorProfile>(`/vendors/${slug}`),
  getCategories: () =>
    api.get<ServiceCategory[]>('/service-categories'),
  getVendorServices: (slug: string) =>
    api.get<VendorServiceResponse[]>(`/vendors/${slug}/services`),

  // Vendor-only
  getMyProfile: () =>
    api.get<VendorProfile>('/vendors/me'),
  createProfile: (data: { businessName: string; description?: string; phone?: string; websiteUrl?: string; city?: string; state?: string; serviceCategorySlugs?: string[] }) =>
    api.post<VendorProfile>('/vendors/profile', data),
  updateProfile: (data: { businessName?: string; description?: string; phone?: string; websiteUrl?: string; city?: string; state?: string; serviceCategorySlugs?: string[] }) =>
    api.put<VendorProfile>('/vendors/me', data),
  getMyServices: () =>
    api.get<VendorServiceResponse[]>('/vendors/me/services'),
  addService: (data: { name: string; serviceCategoryId: number; description?: string; basePrice: number; maxPrice?: number; priceUnit?: string; minGuests?: number; maxGuests?: number }) =>
    api.post<VendorServiceResponse>('/vendors/me/services', data),
  deleteService: (serviceId: number) =>
    api.delete(`/vendors/me/services/${serviceId}`),
}
