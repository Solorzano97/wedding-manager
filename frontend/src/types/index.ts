export interface User {
  id: number; uuid: string; email: string
  firstName: string | null; lastName: string | null; roles: string[]
}
export interface AuthResponse {
  accessToken: string; refreshToken: string; tokenType: string
  expiresIn: number; user: User
}
export interface Wedding {
  id: number; uuid: string; slug: string; title: string
  weddingDate: string | null; venueName: string | null
  totalBudget: number | null; currencyCode: string; status: string
}
export interface VendorProfile {
  id: number; businessName: string; slug: string; description: string | null
  logoUrl: string | null; coverImageUrl: string | null; phone: string | null
  city: string | null; state: string | null; country: string
  avgRating: number; totalReviews: number; verified: boolean; featured: boolean
  serviceCategories: string[]
}
export interface ServiceCategory {
  id: number; name: string; slug: string; iconUrl: string | null; description: string | null
}
export interface Guest {
  id: number; firstName: string; lastName: string; email: string | null; phone: string | null
  rsvpStatus: string; plusOneAllowed: boolean; plusOneName: string | null; dietaryRestrictions: string | null
}
export interface PageResponse<T> {
  content: T[]; page: number; size: number; totalElements: number
  totalPages: number; first: boolean; last: boolean
}
export interface ApiError {
  timestamp: string; status: number; errorCode: string; message: string
  path: string; fieldErrors?: { field: string; message: string }[]
}
