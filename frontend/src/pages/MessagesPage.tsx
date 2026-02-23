import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, ArrowLeft, User } from 'lucide-react'
import { messagingService } from '../services/messaging'
import { vendorService } from '../services/vendors'
import { useAuth } from '../context/AuthContext'
import type { ConversationResponse, MessageResponse } from '../types/messaging'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const { user } = useAuth()
  const isVendor = user?.roles?.includes('vendor')

  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [selected, setSelected] = useState<ConversationResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [user])

  async function loadConversations() {
    if (!user) { setLoading(false); return }
    try {
      if (isVendor) {
        // Vendor: get vendorProfileId via /vendors/me, then fetch conversations
        const { data: profile } = await vendorService.getMyProfile()
        const { data } = await messagingService.myConversations(profile.id, true)
        setConversations(data.content)
      } else {
        // Couple: profileId = user.id (the couple profile is linked to user)
        const { data } = await messagingService.myConversations(user.id, false)
        setConversations(data.content)
      }
    } catch {
      // No profile yet or no conversations - that's fine
    } finally { setLoading(false) }
  }

  function selectConvo(c: ConversationResponse) {
    setSelected(c)
    messagingService.getMessages(c.uuid).then(({ data }) => {
      setMessages(data.content.reverse())
      messagingService.markRead(c.uuid).catch(() => {})
      scrollBottom()
    }).catch(() => toast.error('Error al cargar mensajes'))
  }

  function scrollBottom() { setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100) }

  async function handleSend() {
    if (!selected || !newMsg.trim()) return
    setSending(true)
    try {
      const { data } = await messagingService.sendMessage(selected.uuid, newMsg.trim())
      setMessages(prev => [...prev, data])
      setNewMsg('')
      scrollBottom()
    } catch { toast.error('Error al enviar') }
    finally { setSending(false) }
  }

  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-stone-800">Mis <span className="italic text-sage-600">Mensajes</span></h2>
      </div>

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: 500 }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={`w-full sm:w-80 border-r border-stone-100 flex flex-col ${selected ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-4 border-b border-stone-100"><h3 className="font-medium text-stone-700 text-sm">Conversaciones</h3></div>
            <div className="flex-1 overflow-y-auto">
              {loading ? <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>
              : conversations.length > 0 ? conversations.map(c => (
                <button key={c.uuid} onClick={() => selectConvo(c)}
                  className={`w-full text-left px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors ${selected?.uuid === c.uuid ? 'bg-sage-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-stone-800 truncate">
                          {isVendor ? `Pareja #${c.coupleProfileId}` : `Proveedor #${c.vendorProfileId}`}
                        </p>
                        {c.unreadCount > 0 && <span className="w-5 h-5 rounded-full bg-blush-500 text-white text-xs flex items-center justify-center">{c.unreadCount}</span>}
                      </div>
                      {c.lastMessageAt && <p className="text-xs text-stone-400 mt-0.5">{new Date(c.lastMessageAt).toLocaleDateString('es-GT')}</p>}
                    </div>
                  </div>
                </button>
              )) : (
                <div className="p-8 text-center"><MessageCircle className="w-10 h-10 text-stone-300 mx-auto mb-3" /><p className="text-sm text-stone-400">No hay conversaciones</p><p className="text-xs text-stone-400 mt-1">{isVendor ? 'Las parejas te contactarán desde tu perfil' : 'Inicia una desde el perfil de un proveedor'}</p></div>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div className={`flex-1 flex flex-col ${!selected ? 'hidden sm:flex' : 'flex'}`}>
            {selected ? (<>
              <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-3">
                <button onClick={() => setSelected(null)} className="sm:hidden p-1"><ArrowLeft className="w-5 h-5 text-stone-500" /></button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                <p className="font-medium text-sm text-stone-700">
                  {isVendor ? `Pareja #${selected.coupleProfileId}` : `Proveedor #${selected.vendorProfileId}`}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(m => {
                  const isMine = m.senderUserId === user?.id
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-sage-600 text-white rounded-br-md' : 'bg-stone-100 text-stone-700 rounded-bl-md'}`}>
                        <p>{m.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-sage-200' : 'text-stone-400'}`}>{new Date(m.createdAt).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEnd} />
              </div>

              <div className="p-4 border-t border-stone-100">
                <div className="flex gap-2">
                  <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Escribe un mensaje..." className="input-field flex-1 py-2.5 text-sm" />
                  <button onClick={handleSend} disabled={sending || !newMsg.trim()}
                    className="btn-primary px-4 py-2.5 disabled:opacity-50"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </>) : (
              <div className="flex-1 flex items-center justify-center"><div className="text-center"><MessageCircle className="w-16 h-16 text-stone-200 mx-auto mb-4" /><p className="text-stone-400">Selecciona una conversación</p></div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
