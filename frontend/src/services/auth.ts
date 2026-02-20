import api from './api'
import type { AuthResponse, User } from '../types'
export const authService = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; role: string }) =>
    api.post<User>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
}
