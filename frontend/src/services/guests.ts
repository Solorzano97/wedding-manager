import api from './api'
import type { PageResponse } from '../types'
import type { GuestResponse, GuestStatsResponse } from '../types/guests'
export const guestService = {
  list: (weddingId: number, params: { status?: string; page?: number; size?: number }) =>
    api.get<PageResponse<GuestResponse>>(`/weddings/${weddingId}/guests`, { params }),
  add: (weddingId: number, data: { firstName: string; lastName: string; email?: string; phone?: string; plusOneAllowed?: boolean; dietaryRestrictions?: string }) =>
    api.post<GuestResponse>(`/weddings/${weddingId}/guests`, data),
  updateRsvp: (weddingId: number, guestId: number, rsvpStatus: string) =>
    api.patch<GuestResponse>(`/weddings/${weddingId}/guests/${guestId}/rsvp`, { rsvpStatus }),
  remove: (weddingId: number, guestId: number) =>
    api.delete(`/weddings/${weddingId}/guests/${guestId}`),
  stats: (weddingId: number) =>
    api.get<GuestStatsResponse>(`/weddings/${weddingId}/guests/stats`),
}
