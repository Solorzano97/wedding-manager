import { useState, useEffect, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, BadgeCheck, Phone, Globe, MessageCircle, Calendar, FileText, Heart, X, Clock, Video, MapPinIcon, PhoneCall, Send, DollarSign } from 'lucide-react'
import { vendorService, type VendorServiceResponse } from '../services/vendors'
import { bookingService } from '../services/bookings'
import { messagingService } from '../services/messaging'
import { weddingService } from '../services/weddings'
import { useAuth } from '../context/AuthContext'
import type { VendorProfile, Wedding } from '../types'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'

const gradients = ['from-sage-400 to-sage-600','from-blush-400 to-blush-600','from-champagne-500 to-champagne-700','from-sage-500 to-sage-700']

export default function VendorDetailPage() {
  const { slug } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [vendor, setVendor] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [wedding, setWedding] = useState<Wedding | null>(null)

  // Modal states
  const [showAppointment, setShowAppointment] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [vendorServices, setVendorServices] = useState<VendorServiceResponse[]>([])

  const isCouple = user?.roles?.includes('couple')

  useEffect(() => {
    if (slug) {
      vendorService.getBySlug(slug)
        .then(({ data }) => {
          setVendor(data)
          // Load vendor's services
          vendorService.getVendorServices(slug)
            .then(({ data: svcs }) => setVendorServices(svcs))
            .catch(() => {})
        })
        .catch(() => toast.error('Proveedor no encontrado'))
        .finally(() => setLoading(false))
    }
    // Load couple's wedding for creating appointments/quotes
    if (isAuthenticated && isCouple) {
      weddingService.getMyWeddings()
        .then(({ data }) => { if (data.content.length > 0) setWedding(data.content[0]) })
        .catch(() => {})
    }
  }, [slug, isAuthenticated, isCouple])

  if (loading) return (
    <div className="min-h-screen bg-ivory-50"><Navbar />
      <div className="pt-28 flex justify-center"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>
    </div>
  )

  if (!vendor) return (
    <div className="min-h-screen bg-ivory-50"><Navbar />
      <div className="pt-28 text-center"><p className="text-stone-500">Proveedor no encontrado</p><Link to="/vendors" className="btn-primary mt-4 inline-flex">Volver al catálogo</Link></div>
    </div>
  )

  const initials = vendor.businessName.split(' ').map(w => w[0]).join('').slice(0, 2)
  const gradient = gradients[vendor.id % gradients.length]

  function handleAction(action: 'appointment' | 'message' | 'quote') {
    if (!wedding) {
      toast.error('Primero crea una boda desde tu dashboard')
      return
    }
    if (action === 'appointment') setShowAppointment(true)
    else if (action === 'message') setShowMessage(true)
    else if (action === 'quote') setShowQuote(true)
  }

  return (
    <div className="min-h-screen bg-ivory-50">
      <Navbar />

      {/* Cover */}
      <div className={`h-64 sm:h-80 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 pattern-floral opacity-20" />
        <div className="absolute top-24 left-4 sm:left-8"><Link to="/vendors" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm hover:bg-white/30 transition-all"><ArrowLeft className="w-4 h-4" /> Volver</Link></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-16 relative z-10 pb-20">
        <div className="card p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-lg flex items-center justify-center border-4 border-white -mt-16 sm:-mt-20 flex-shrink-0">
              <span className="font-display text-3xl font-bold text-sage-700">{initials}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-medium text-stone-800">{vendor.businessName}</h1>
                {vendor.verified && <BadgeCheck className="w-6 h-6 text-sage-500" />}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-500">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {vendor.city}, {vendor.state}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-champagne-400 text-champagne-400" /> {vendor.avgRating} ({vendor.totalReviews} reseñas)</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {vendor.serviceCategories.map(cat => (<span key={cat} className="px-3 py-1 rounded-full bg-sage-50 text-sage-700 text-sm font-medium">{cat}</span>))}
              </div>
            </div>
          </div>

          {/* Description */}
          {vendor.description && (
            <div className="mt-8"><h3 className="font-display text-lg text-stone-800 mb-3">Acerca de</h3><p className="text-stone-600 leading-relaxed">{vendor.description}</p></div>
          )}

          {/* Contact info */}
          <div className="mt-8 flex flex-wrap gap-4">
            {vendor.phone && <div className="flex items-center gap-2 text-sm text-stone-500"><Phone className="w-4 h-4" /> {vendor.phone}</div>}
          </div>

          {/* Services offered */}
          {vendorServices.length > 0 && (
            <div className="mt-8 pt-6 border-t border-stone-100">
              <h3 className="font-display text-lg text-stone-800 mb-4">Servicios disponibles</h3>
              <div className="space-y-3">
                {vendorServices.map(svc => (
                  <div key={svc.id} className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-sage-50/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0"><DollarSign className="w-5 h-5 text-sage-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800">{svc.name}</p>
                      {svc.description && <p className="text-sm text-stone-500 line-clamp-1">{svc.description}</p>}
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-400">
                        {svc.priceUnit && <span>{svc.priceUnit}</span>}
                        {svc.minGuests && svc.maxGuests && <span>• {svc.minGuests}-{svc.maxGuests} invitados</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-lg font-medium text-stone-800">Q{svc.basePrice.toLocaleString()}</p>
                      {svc.maxPrice && <p className="text-xs text-stone-400">hasta Q{svc.maxPrice.toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions for couple */}
          {isAuthenticated && isCouple && (
            <div className="mt-8 pt-6 border-t border-stone-100">
              <h3 className="font-display text-lg text-stone-800 mb-4">¿Te interesa este proveedor?</h3>
              {!wedding && (
                <div className="bg-champagne-50 border border-champagne-200 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-champagne-800">Para contactar proveedores necesitas crear tu boda primero. <Link to="/dashboard" className="font-semibold underline">Ir al dashboard →</Link></p>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleAction('message')} className="btn-primary"><MessageCircle className="w-4 h-4" /> Enviar mensaje</button>
                <button onClick={() => handleAction('appointment')} className="btn-secondary"><Calendar className="w-4 h-4" /> Agendar cita</button>
                <button onClick={() => handleAction('quote')} className="btn-secondary"><FileText className="w-4 h-4" /> Solicitar cotización</button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
              <p className="text-stone-500 mb-4">Inicia sesión para contactar a este proveedor</p>
              <Link to="/register" className="btn-primary">Crear cuenta gratis</Link>
            </div>
          )}
        </div>
      </div>

      {/* === MODALS === */}
      {showAppointment && wedding && vendor && (
        <AppointmentModal vendorProfileId={vendor.id} vendorName={vendor.businessName}
          weddingId={wedding.id} onClose={() => setShowAppointment(false)} />
      )}
      {showMessage && wedding && vendor && (
        <MessageModal vendorProfileId={vendor.id} vendorName={vendor.businessName}
          weddingId={wedding.id} onClose={() => setShowMessage(false)} />
      )}
      {showQuote && wedding && vendor && (
        <QuoteModal vendorProfileId={vendor.id} vendorName={vendor.businessName}
          weddingId={wedding.id} weddingDate={wedding.weddingDate} onClose={() => setShowQuote(false)} />
      )}
    </div>
  )
}

// ======= APPOINTMENT MODAL =======
function AppointmentModal({ vendorProfileId, vendorName, weddingId, onClose }: {
  vendorProfileId: number; vendorName: string; weddingId: number; onClose: () => void
}) {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('11:00')
  const [meetingType, setMeetingType] = useState('video_call')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await bookingService.createAppointment(weddingId, {
        vendorProfileId, appointmentDate: date, startTime, endTime,
        meetingType, notes: notes || undefined
      })
      toast.success('¡Cita solicitada! El proveedor confirmará pronto.')
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al agendar cita')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-stone-100"><X className="w-5 h-5 text-stone-400" /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center"><Calendar className="w-6 h-6 text-sage-600" /></div>
          <div><h2 className="font-display text-xl text-stone-800">Agendar cita</h2><p className="text-sm text-stone-400">con {vendorName}</p></div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Fecha *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="input-field" required min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Hora inicio *</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Hora fin *</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="input-field" required /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tipo de reunión</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ value: 'video_call', label: 'Video', icon: Video }, { value: 'in_person', label: 'Presencial', icon: MapPinIcon }, { value: 'phone', label: 'Teléfono', icon: PhoneCall }]
                .map(t => (
                  <button key={t.value} type="button" onClick={() => setMeetingType(t.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm ${meetingType === t.value ? 'border-sage-500 bg-sage-50 text-sage-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                    <t.icon className="w-5 h-5" />{t.label}
                  </button>
                ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Notas (opcional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className="input-field resize-none" placeholder="Ej: Quiero conocer sus paquetes para 150 invitados" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading || !date} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Solicitar cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ======= MESSAGE MODAL =======
function MessageModal({ vendorProfileId, vendorName, weddingId, onClose }: {
  vendorProfileId: number; vendorName: string; weddingId: number; onClose: () => void
}) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await messagingService.startConversation({ weddingId, vendorProfileId, initialMessage: message })
      toast.success('¡Mensaje enviado! Revisa tus conversaciones para ver la respuesta.')
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al enviar mensaje')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-stone-100"><X className="w-5 h-5 text-stone-400" /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center"><MessageCircle className="w-6 h-6 text-sage-600" /></div>
          <div><h2 className="font-display text-xl text-stone-800">Enviar mensaje</h2><p className="text-sm text-stone-400">a {vendorName}</p></div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tu mensaje *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
              className="input-field resize-none" required
              placeholder="Ej: Hola, estamos interesados en sus servicios para nuestra boda en junio. ¿Podría darnos información sobre sus paquetes?" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading || !message.trim()} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Enviar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ======= QUOTE REQUEST MODAL =======
function QuoteModal({ vendorProfileId, vendorName, weddingId, weddingDate, onClose }: {
  vendorProfileId: number; vendorName: string; weddingId: number; weddingDate?: string | null; onClose: () => void
}) {
  const [eventDate, setEventDate] = useState(weddingDate || '')
  const [guestCount, setGuestCount] = useState('')
  const [requirements, setRequirements] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await bookingService.createQuote(weddingId, {
        vendorProfileId,
        eventDate: eventDate || undefined,
        guestCount: guestCount ? parseInt(guestCount) : undefined,
        customRequirements: requirements || undefined,
        notes: notes || undefined,
      })
      toast.success('¡Cotización solicitada! Revisa el estado en tu dashboard.')
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al solicitar cotización')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-stone-100"><X className="w-5 h-5 text-stone-400" /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center"><FileText className="w-6 h-6 text-sage-600" /></div>
          <div><h2 className="font-display text-xl text-stone-800">Solicitar cotización</h2><p className="text-sm text-stone-400">a {vendorName}</p></div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Fecha del evento</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Núm. invitados</label>
              <input type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)} className="input-field" placeholder="150" min="1" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">¿Qué necesitas? *</label>
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={3}
              className="input-field resize-none" required
              placeholder="Ej: Necesitamos servicio de fotografía y video para ceremonia y recepción, con álbum digital y video highlight" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Notas adicionales</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className="input-field resize-none" placeholder="Presupuesto aproximado, estilo preferido, etc." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading || !requirements.trim()} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Solicitar cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
