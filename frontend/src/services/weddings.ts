import api from './api'
import type { Wedding, PageResponse } from '../types'
export const weddingService = {
  getMyWeddings: (page = 0, size = 10) =>
    api.get<PageResponse<Wedding>>('/weddings/me', { params: { page, size } }),
  getByUuid: (uuid: string) => api.get<Wedding>(`/weddings/${uuid}`),
  create: (data: { title: string; weddingDate?: string; venueName?: string; totalBudget?: number }) =>
    api.post<Wedding>('/weddings', data),
}
