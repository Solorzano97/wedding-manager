import { useState, useEffect } from 'react'
import { Calendar, Clock, Video, MapPin, Phone, CheckCircle, XCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { bookingService } from '../services/bookings'
import { weddingService } from '../services/weddings'
import { useAuth } from '../context/AuthContext'
import type { AppointmentResponse } from '../types/bookings'
import type { Wedding } from '../types'
import toast from 'react-hot-toast'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  requested: { label: 'Pendiente', color: 'bg-champagne-100 text-champagne-700' },
  confirmed: { label: 'Confirmada', color: 'bg-sage-100 text-sage-700' },
  cancelled: { label: 'Cancelada', color: 'bg-blush-100 text-blush-700' },
  completed: { label: 'Completada', color: 'bg-stone-100 text-stone-600' },
  no_show: { label: 'No asistió', color: 'bg-champagne-100 text-champagne-700' },
}
const TYPE_ICONS: Record<string, any> = { video_call: Video, in_person: MapPin, phone: Phone }
const TYPE_LABELS: Record<string, string> = { video_call: 'Videollamada', in_person: 'Presencial', phone: 'Teléfono' }

export default function AppointmentsPage() {
  const { user } = useAuth()
  const isVendor = user?.roles?.includes('vendor')
  const isCouple = user?.roles?.includes('couple')

  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [calMonth, setCalMonth] = useState(new Date())

  useEffect(() => {
    if (isVendor) {
      bookingService.vendorAppointments(0, 50)
        .then(({ data }) => setAppointments(data.content))
        .catch(() => {})
        .finally(() => setLoading(false))
    } else if (isCouple) {
      weddingService.getMyWeddings().then(({ data }) => {
        if (data.content.length > 0) {
          const w = data.content[0]; setWedding(w)
          bookingService.listAppointments(w.id, 0, 50)
            .then(({ data }) => setAppointments(data.content))
            .catch(() => {})
            .finally(() => setLoading(false))
        } else setLoading(false)
      }).catch(() => setLoading(false))
    } else setLoading(false)
  }, [isVendor, isCouple])

  function handleStatus(uuid: string, status: string) {
    const promise = isVendor
      ? bookingService.vendorUpdateAppointmentStatus(uuid, status)
      : wedding ? bookingService.updateAppointmentStatus(wedding.id, uuid, status) : null
    if (!promise) return
    promise.then(({ data }) => {
      setAppointments(prev => prev.map(a => a.uuid === data.uuid ? data : a))
      toast.success(status === 'confirmed' ? '¡Cita confirmada!' : status === 'cancelled' ? 'Cita cancelada' : 'Estado actualizado')
    }).catch(() => toast.error('Error'))
  }

  if (!loading && !isVendor && !wedding) return (
    <div className="text-center py-20"><p className="text-stone-500">Crea una boda primero para gestionar citas.</p></div>
  )

  // Calendar helper
  const year = calMonth.getFullYear(); const month = calMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().split('T')[0]

  function apptsForDate(dateStr: string) {
    return appointments.filter(a => a.appointmentDate === dateStr && a.status !== 'cancelled')
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl text-stone-800">
          {isVendor ? <>Mi <span className="italic text-sage-600">Agenda</span></> : <>Citas con <span className="italic text-sage-600">Proveedores</span></>}
        </h2>
        {wedding && <p className="text-stone-500 text-sm mt-1">{wedding.title}</p>}
      </div>

      {loading ? <div className="card p-12 flex justify-center"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>
      : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCalMonth(new Date(year, month - 1))} className="p-1.5 rounded-lg hover:bg-stone-100"><ChevronLeft className="w-5 h-5 text-stone-500" /></button>
                <h3 className="font-display text-lg text-stone-800 capitalize">{calMonth.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => setCalMonth(new Date(year, month + 1))} className="p-1.5 rounded-lg hover:bg-stone-100"><ChevronRight className="w-5 h-5 text-stone-500" /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-stone-400 mb-2">
                {['D','L','M','Mi','J','V','S'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={'e' + i} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                  const dayAppts = apptsForDate(dateStr)
                  const isToday = dateStr === today
                  const hasConfirmed = dayAppts.some(a => a.status === 'confirmed')
                  const hasPending = dayAppts.some(a => a.status === 'requested')
                  return (
                    <div key={day} className={`relative aspect-square flex items-center justify-center rounded-lg text-sm
                      ${isToday ? 'bg-sage-600 text-white font-bold' : 'text-stone-600'}
                      ${dayAppts.length > 0 && !isToday ? 'font-semibold' : ''}`}>
                      {day}
                      {dayAppts.length > 0 && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {hasConfirmed && <div className="w-1.5 h-1.5 rounded-full bg-sage-500" />}
                          {hasPending && <div className="w-1.5 h-1.5 rounded-full bg-champagne-400" />}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-stone-400">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sage-500" /> Confirmada</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-champagne-400" /> Pendiente</span>
              </div>
            </div>
          </div>

          {/* Appointments list */}
          <div className="lg:col-span-2 space-y-3">
            {appointments.length > 0 ? appointments.map(a => {
              const st = STATUS_MAP[a.status] || STATUS_MAP.requested
              const TypeIcon = TYPE_ICONS[a.meetingType] || Video
              const dateStr = new Date(a.appointmentDate + 'T00:00:00').toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })

              // PERMISSIONS: only vendor can confirm/reject. Couple can only cancel their own.
              const vendorCanConfirm = isVendor && a.status === 'requested'
              const canCancel = (isVendor || isCouple) && (a.status === 'requested' || a.status === 'confirmed')

              return (
                <div key={a.uuid} className="card overflow-hidden">
                  <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${a.status === 'confirmed' ? 'bg-sage-50' : a.status === 'requested' ? 'bg-champagne-50' : 'bg-stone-50'}`}>
                      <TypeIcon className={`w-7 h-7 ${a.status === 'confirmed' ? 'text-sage-600' : a.status === 'requested' ? 'text-champagne-600' : 'text-stone-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                        <span className="text-xs text-stone-400">{TYPE_LABELS[a.meetingType] || a.meetingType}</span>
                      </div>
                      <p className="text-sm font-medium text-stone-800 capitalize">{dateStr}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-400">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.startTime?.slice(0,5)} - {a.endTime?.slice(0,5)}</span>
                        {a.meetingType === 'phone' && a.location && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {a.location}</span>}
                        {a.meetingType === 'in_person' && a.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {a.location}</span>}
                      </div>
                      {a.meetingUrl && a.meetingType === 'video_call' && (
                        <a href={a.meetingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-xs text-sage-600 hover:text-sage-700 bg-sage-50 px-3 py-1.5 rounded-lg font-medium">
                          <Video className="w-3.5 h-3.5" /> Unirse a Google Meet <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {a.notes && <p className="text-xs text-stone-400 mt-2 italic">{a.notes}</p>}
                    </div>
                  </div>

                  {(vendorCanConfirm || canCancel) && (
                    <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex flex-wrap gap-2">
                      {vendorCanConfirm && (
                        <button onClick={() => handleStatus(a.uuid, 'confirmed')} className="btn-primary text-sm py-2">
                          <CheckCircle className="w-4 h-4" /> Confirmar cita
                        </button>
                      )}
                      {canCancel && (
                        <button onClick={() => handleStatus(a.uuid, 'cancelled')} className="btn-secondary text-sm py-2 text-blush-600 border-blush-200 hover:bg-blush-50">
                          <XCircle className="w-4 h-4" /> Cancelar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            }) : (
              <div className="card p-12 text-center">
                <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="font-display text-xl text-stone-700 mb-2">Sin citas programadas</p>
                <p className="text-stone-400 text-sm">{isVendor ? 'Las parejas podrán agendar citas contigo desde tu perfil' : 'Agenda citas con proveedores desde su perfil'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
