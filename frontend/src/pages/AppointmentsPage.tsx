import { useState, useEffect } from 'react'
import { Calendar, Clock, Video, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react'
import { bookingService } from '../services/bookings'
import { weddingService } from '../services/weddings'
import { useAuth } from '../context/AuthContext'
import type { AppointmentResponse } from '../types/bookings'
import type { Wedding } from '../types'
import toast from 'react-hot-toast'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  requested: { label: 'Solicitada', color: 'bg-champagne-100 text-champagne-700' },
  scheduled: { label: 'Programada', color: 'bg-sage-100 text-sage-700' },
  confirmed: { label: 'Confirmada', color: 'bg-sage-100 text-sage-700' },
  cancelled: { label: 'Cancelada', color: 'bg-blush-100 text-blush-700' },
  completed: { label: 'Completada', color: 'bg-stone-100 text-stone-600' },
  no_show: { label: 'No asistió', color: 'bg-champagne-100 text-champagne-700' },
}
const TYPE_ICONS: Record<string, any> = { video_call: Video, in_person: MapPin, phone: Phone }

export default function AppointmentsPage() {
  const { user } = useAuth()
  const isVendor = user?.roles?.includes('vendor')
  const isCouple = user?.roles?.includes('couple')

  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isVendor) {
      // Vendor: fetch appointments directly via /vendors/me/appointments
      bookingService.vendorAppointments()
        .then(({ data }) => setAppointments(data.content))
        .catch(() => {})
        .finally(() => setLoading(false))
    } else if (isCouple) {
      // Couple: need weddingId first
      weddingService.getMyWeddings().then(({ data }) => {
        if (data.content.length > 0) {
          const w = data.content[0]; setWedding(w)
          bookingService.listAppointments(w.id)
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
      toast.success(`Cita ${STATUS_MAP[status]?.label || status}`)
    }).catch(() => toast.error('Error'))
  }

  if (!loading && !isVendor && !wedding) return (
    <div className="text-center py-20"><p className="text-stone-500">Crea una boda primero para gestionar citas.</p></div>
  )

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl text-stone-800">
          {isVendor ? <>Mis <span className="italic text-sage-600">Citas</span></> : <>Citas con <span className="italic text-sage-600">Proveedores</span></>}
        </h2>
        {wedding && <p className="text-stone-500 text-sm mt-1">{wedding.title}</p>}
      </div>

      {loading ? <div className="card p-12 flex justify-center"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>
      : appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map(a => {
            const st = STATUS_MAP[a.status] || STATUS_MAP.requested
            const TypeIcon = TYPE_ICONS[a.meetingType] || Video
            const dateStr = new Date(a.appointmentDate + 'T00:00:00').toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })
            return (
              <div key={a.uuid} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-7 h-7 text-sage-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                      <span className="text-xs text-stone-400 capitalize">{a.meetingType.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-stone-700 capitalize">{dateStr}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.startTime} - {a.endTime}</span>
                      {a.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.location}</span>}
                      {a.meetingUrl && <a href={a.meetingUrl} target="_blank" rel="noreferrer" className="text-sage-600 hover:underline">Enlace de reunión</a>}
                    </div>
                    {a.notes && <p className="text-xs text-stone-400 mt-1">{a.notes}</p>}
                  </div>
                  {(a.status === 'requested' || a.status === 'scheduled' || a.status === 'confirmed') && (
                    <div className="flex gap-2">
                      {(a.status === 'requested' || a.status === 'scheduled') && (
                        <button onClick={() => handleStatus(a.uuid, 'confirmed')} className="p-2 rounded-xl bg-sage-50 text-sage-600 hover:bg-sage-100 transition-colors" title="Confirmar"><CheckCircle className="w-5 h-5" /></button>
                      )}
                      <button onClick={() => handleStatus(a.uuid, 'cancelled')} className="p-2 rounded-xl bg-blush-50 text-blush-600 hover:bg-blush-100 transition-colors" title="Cancelar"><XCircle className="w-5 h-5" /></button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="font-display text-xl text-stone-700 mb-2">Sin citas programadas</p>
          <p className="text-stone-400 text-sm">
            {isVendor ? 'Las parejas podrán agendar citas contigo desde tu perfil' : 'Agenda citas con proveedores desde su perfil'}
          </p>
        </div>
      )}
    </div>
  )
}
