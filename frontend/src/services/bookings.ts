import api from './api'
import type { PageResponse } from '../types'
import type { QuoteResponse, AppointmentResponse } from '../types/bookings'

export const bookingService = {
  // === COUPLE endpoints (require weddingId) ===
  createQuote: (weddingId: number, data: { vendorProfileId: number; vendorServiceId?: number; eventDate?: string; guestCount?: number; customRequirements?: string; notes?: string }) =>
    api.post<QuoteResponse>(`/weddings/${weddingId}/quotes`, data),
  listQuotes: (weddingId: number, page = 0, size = 10) =>
    api.get<PageResponse<QuoteResponse>>(`/weddings/${weddingId}/quotes`, { params: { page, size } }),
  updateQuoteStatus: (weddingId: number, uuid: string, status: string) =>
    api.patch<QuoteResponse>(`/weddings/${weddingId}/quotes/${uuid}/status`, { status }),

  createAppointment: (weddingId: number, data: { vendorProfileId: number; appointmentDate: string; startTime: string; endTime: string; meetingType?: string; meetingUrl?: string; location?: string; notes?: string }) =>
    api.post<AppointmentResponse>(`/weddings/${weddingId}/appointments`, data),
  listAppointments: (weddingId: number, page = 0, size = 10) =>
    api.get<PageResponse<AppointmentResponse>>(`/weddings/${weddingId}/appointments`, { params: { page, size } }),
  updateAppointmentStatus: (weddingId: number, uuid: string, status: string, cancellationReason?: string) =>
    api.patch<AppointmentResponse>(`/weddings/${weddingId}/appointments/${uuid}/status`, { status, cancellationReason }),

  // === VENDOR endpoints (no weddingId needed) ===
  vendorAppointments: (page = 0, size = 10) =>
    api.get<PageResponse<AppointmentResponse>>('/vendors/me/appointments', { params: { page, size } }),
  vendorUpdateAppointmentStatus: (uuid: string, status: string, cancellationReason?: string) =>
    api.patch<AppointmentResponse>(`/vendors/me/appointments/${uuid}/status`, { status, cancellationReason }),
  vendorQuotes: (page = 0, size = 10) =>
    api.get<PageResponse<QuoteResponse>>('/vendors/me/quotes', { params: { page, size } }),
  vendorUpdateQuoteStatus: (uuid: string, status: string) =>
    api.patch<QuoteResponse>(`/vendors/me/quotes/${uuid}/status`, { status }),
  vendorRespondQuote: (uuid: string, data: { subtotal: number; discountAmount?: number; taxAmount?: number; totalAmount: number; validUntil?: string; notes?: string }) =>
    api.put<QuoteResponse>(`/vendors/me/quotes/${uuid}/respond`, data),

  // Public availability
  getBookedSlots: (vendorProfileId: number, from: string, to: string) =>
    api.get<{ date: string; startTime: string; endTime: string; meetingType: string; status: string }[]>(
      `/vendors/${vendorProfileId}/booked-slots`, { params: { from, to } }),
}
