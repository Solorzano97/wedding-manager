export interface GuestResponse {
  id: number; weddingId: number; firstName: string; lastName: string
  email: string | null; phone: string | null; rsvpStatus: string
  rsvpRespondedAt: string | null; plusOneAllowed: boolean
  plusOneName: string | null; dietaryRestrictions: string | null; notes: string | null
}
export interface GuestStatsResponse { total: number; confirmed: number; declined: number; pending: number; tentative: number }
