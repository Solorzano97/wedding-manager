import { useState, useEffect, type FormEvent } from 'react'
import { Users, Plus, UserCheck, UserX, Clock, X, Search, Filter } from 'lucide-react'
import { guestService } from '../services/guests'
import { weddingService } from '../services/weddings'
import type { GuestResponse, GuestStatsResponse } from '../types/guests'
import type { Wedding } from '../types'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-sage-100 text-sage-700', declined: 'bg-blush-100 text-blush-700',
  pending: 'bg-champagne-100 text-champagne-700', tentative: 'bg-stone-100 text-stone-600',
}
const STATUS_LABELS: Record<string, string> = { confirmed: 'Confirmado', declined: 'Declinado', pending: 'Pendiente', tentative: 'Tentativo' }

export default function GuestsPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [guests, setGuests] = useState<GuestResponse[]>([])
  const [stats, setStats] = useState<GuestStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    weddingService.getMyWeddings().then(({ data }) => {
      if (data.content.length > 0) {
        const w = data.content[0]; setWedding(w); loadGuests(w.id); loadStats(w.id)
      } else setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function loadGuests(wid: number) {
    guestService.list(wid, { status: filter || undefined, size: 200 }).then(({ data }) => setGuests(data.content)).catch(() => {}).finally(() => setLoading(false))
  }
  function loadStats(wid: number) { guestService.stats(wid).then(({ data }) => setStats(data)).catch(() => {}) }

  function handleRsvp(guestId: number, status: string) {
    if (!wedding) return
    guestService.updateRsvp(wedding.id, guestId, status).then(({ data }) => {
      setGuests(prev => prev.map(g => g.id === data.id ? data : g)); loadStats(wedding.id)
      toast.success(`RSVP actualizado a ${STATUS_LABELS[status]}`)
    }).catch(() => toast.error('Error al actualizar'))
  }

  function handleDelete(guestId: number) {
    if (!wedding) return
    guestService.remove(wedding.id, guestId).then(() => {
      setGuests(prev => prev.filter(g => g.id !== guestId)); loadStats(wedding.id)
      toast.success('Invitado eliminado')
    }).catch(() => toast.error('Error al eliminar'))
  }

  const filtered = guests.filter(g => {
    const name = `${g.firstName} ${g.lastName}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  if (!wedding && !loading) return (
    <div className="text-center py-20"><p className="text-stone-500">Crea una boda primero para gestionar invitados.</p></div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div><h2 className="font-display text-2xl text-stone-800">Gestión de <span className="italic text-sage-600">Invitados</span></h2><p className="text-stone-500 text-sm mt-1">{wedding?.title}</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" /> Agregar invitado</button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {[{ icon: Users, label: 'Total', value: stats.total, color: 'bg-stone-50 text-stone-600' },
            { icon: UserCheck, label: 'Confirmados', value: stats.confirmed, color: 'bg-sage-50 text-sage-600' },
            { icon: Clock, label: 'Pendientes', value: stats.pending, color: 'bg-champagne-50 text-champagne-700' },
            { icon: UserX, label: 'Declinados', value: stats.declined, color: 'bg-blush-50 text-blush-600' },
            { icon: Users, label: 'Tentativos', value: stats.tentative, color: 'bg-stone-50 text-stone-500' },
          ].map((s, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div><p className="font-display text-xl font-medium text-stone-800">{s.value}</p><p className="text-xs text-stone-400">{s.label}</p></div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar invitado..." className="input-field pl-10 py-2.5 text-sm" /></div>
        <select value={filter} onChange={e => { setFilter(e.target.value); if (wedding) { setLoading(true); guestService.list(wedding.id, { status: e.target.value || undefined, size: 200 }).then(({ data }) => setGuests(data.content)).finally(() => setLoading(false)) } }} className="input-field w-44 py-2.5 text-sm">
          <option value="">Todos</option><option value="confirmed">Confirmados</option><option value="pending">Pendientes</option><option value="declined">Declinados</option><option value="tentative">Tentativos</option>
        </select>
      </div>

      {loading ? <div className="card p-12 flex justify-center"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div> : filtered.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-stone-50 border-b border-stone-100">
              <th className="text-left px-5 py-3 font-medium text-stone-500">Nombre</th>
              <th className="text-left px-5 py-3 font-medium text-stone-500 hidden sm:table-cell">Email</th>
              <th className="text-left px-5 py-3 font-medium text-stone-500">Estado RSVP</th>
              <th className="text-left px-5 py-3 font-medium text-stone-500 hidden md:table-cell">Dieta</th>
              <th className="px-5 py-3"></th>
            </tr></thead>
            <tbody>{filtered.map(g => (
              <tr key={g.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-3 font-medium text-stone-800">{g.firstName} {g.lastName}{g.plusOneAllowed && <span className="text-xs text-stone-400 ml-2">+1</span>}</td>
                <td className="px-5 py-3 text-stone-500 hidden sm:table-cell">{g.email || '—'}</td>
                <td className="px-5 py-3">
                  <select value={g.rsvpStatus} onChange={e => handleRsvp(g.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[g.rsvpStatus]}`}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td className="px-5 py-3 text-stone-400 hidden md:table-cell">{g.dietaryRestrictions || '—'}</td>
                <td className="px-5 py-3"><button onClick={() => handleDelete(g.id)} className="text-stone-400 hover:text-blush-500 transition-colors"><X className="w-4 h-4" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center"><Users className="w-12 h-12 text-stone-300 mx-auto mb-4" /><p className="text-stone-500">No hay invitados aún</p></div>
      )}

      {showAdd && wedding && <AddGuestModal weddingId={wedding.id} onClose={() => setShowAdd(false)} onAdded={g => { setGuests(prev => [...prev, g]); setShowAdd(false); loadStats(wedding.id) }} />}
    </div>
  )
}

function AddGuestModal({ weddingId, onClose, onAdded }: { weddingId: number; onClose: () => void; onAdded: (g: GuestResponse) => void }) {
  const [fn, setFn] = useState(''); const [ln, setLn] = useState(''); const [email, setEmail] = useState(''); const [phone, setPhone] = useState(''); const [diet, setDiet] = useState(''); const [plus, setPlus] = useState(false); const [loading, setLoading] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try { const { data } = await guestService.add(weddingId, { firstName: fn, lastName: ln, email: email || undefined, phone: phone || undefined, plusOneAllowed: plus, dietaryRestrictions: diet || undefined }); toast.success('Invitado agregado'); onAdded(data) }
    catch { toast.error('Error al agregar') } finally { setLoading(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-up">
        <h2 className="font-display text-xl text-stone-800 mb-6">Agregar <span className="italic text-sage-600">invitado</span></h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label><input value={fn} onChange={e => setFn(e.target.value)} className="input-field" required autoFocus /></div><div><label className="block text-sm font-medium text-stone-700 mb-1">Apellido *</label><input value={ln} onChange={e => setLn(e.target.value)} className="input-field" required /></div></div>
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label><input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Restricciones dietéticas</label><input value={diet} onChange={e => setDiet(e.target.value)} className="input-field" /></div>
          <label className="flex items-center gap-2 text-sm text-stone-600"><input type="checkbox" checked={plus} onChange={e => setPlus(e.target.checked)} className="rounded" /> Permitir acompañante (+1)</label>
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button><button type="submit" disabled={loading || !fn || !ln} className="btn-primary flex-1 disabled:opacity-50">{loading ? 'Agregando...' : 'Agregar'}</button></div>
        </form>
      </div>
    </div>
  )
}
