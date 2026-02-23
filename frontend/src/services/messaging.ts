import api from './api'
import type { PageResponse } from '../types'
import type { ConversationResponse, MessageResponse } from '../types/messaging'
export const messagingService = {
  startConversation: (data: { weddingId: number; vendorProfileId: number; initialMessage: string }) =>
    api.post<ConversationResponse>('/messages/conversations', data),
  myConversations: (profileId: number, isVendor = false, page = 0, size = 20) =>
    api.get<PageResponse<ConversationResponse>>('/messages/conversations', { params: { profileId, isVendor, page, size } }),
  getMessages: (uuid: string, page = 0, size = 50) =>
    api.get<PageResponse<MessageResponse>>(`/messages/conversations/${uuid}/messages`, { params: { page, size } }),
  sendMessage: (uuid: string, content: string) =>
    api.post<MessageResponse>(`/messages/conversations/${uuid}/messages`, { content, messageType: 'text' }),
  markRead: (uuid: string) =>
    api.post(`/messages/conversations/${uuid}/read`),
}
