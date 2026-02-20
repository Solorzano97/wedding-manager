import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, Plus, Calendar, Users, DollarSign, MessageCircle, Clock, ChevronRight,
  Sparkles, MapPin, Settings, Bell, Search, LogOut, LayoutDashboard, Store
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { weddingService } from '../services/weddings'
import type { Wedding } from '../types'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const isCouple = user?.roles?.includes('couple')
  const isVendor = user?.roles?.includes('vendor')

  useEffect(() => {
    if (isCouple) {
      weddingService.getMyWeddings()
        .then(({ data }) => setWeddings(data.content))
        .catch(() => { })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [isCouple])

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-stone-100">
        <div className="flex flex-col h-full">
          <Link to="/" className="flex items-center gap-2.5 px-6 h-20 border-b border-stone-100">
            <Heart className="w-6 h-6 text-blush-500" />
            <span className="font-display text-xl text-stone-800">Celebra</span>
          </Link>

          <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Panel principal">
            <SidebarLink icon={LayoutDashboard} label="Resumen" active />
            {isCouple && (
              <>
                <SidebarLink icon={Calendar} label="Mi Boda" />
                <SidebarLink icon={Users} label="Invitados" />
                <SidebarLink icon={Search} label="Proveedores" />
                <SidebarLink icon={DollarSign} label="Presupuesto" />
                <SidebarLink icon={MessageCircle} label="Mensajes" badge={3} />
              </>
            )}
            {isVendor && (
              <>
                <SidebarLink icon={Store} label="Mi Perfil" />
                <SidebarLink icon={Calendar} label="Citas" />
                <SidebarLink icon={MessageCircle} label="Mensajes" badge={5} />
                <SidebarLink icon={DollarSign} label="Cotizaciones" />
              </>
            )}
          </nav>

          <div className="px-3 py-4 border-t border-stone-100">
            <SidebarLink icon={Settings} label="Configuración" />
            <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-all text-sm">
              <LogOut className="w-5 h-5" /> Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-100">
          <div className="flex items-center justify-between px-4 sm:px-8 h-16">
            {/* Mobile logo */}
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <Heart className="w-5 h-5 text-blush-500" />
              <span className="font-display text-lg text-stone-800">Celebra</span>
            </Link>

            <div className="hidden lg:block">
              <h1 className="font-display text-xl text-stone-800">
                Hola, <span className="italic text-sage-600">{user?.firstName || user?.email?.split('@')[0]}</span> ✨
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl hover:bg-stone-100 transition-colors relative" aria-label="Notificaciones">
                <Bell className="w-5 h-5 text-stone-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blush-500 rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white text-sm font-bold">
                {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
          {/* Welcome banner */}
          <div className="relative rounded-3xl bg-gradient-to-br from-sage-600 via-sage-700 to-sage-800 overflow-hidden mb-8">
            <div className="absolute inset-0 pattern-floral opacity-10" />
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-champagne-400/10 rounded-full blur-3xl" />
            <div className="relative px-6 sm:px-8 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-white font-light">
                  {isCouple ? (
                    weddings.length > 0
                      ? <>Tu boda te <span className="italic text-champagne-300">espera</span></>
                      : <>Comienza a planificar tu <span className="italic text-champagne-300">gran día</span></>
                  ) : (
                    <>Bienvenido a tu <span className="italic text-champagne-300">panel de proveedor</span></>
                  )}
                </h2>
                <p className="text-sage-200 mt-2 text-sm sm:text-base max-w-md">
                  {isCouple
                    ? 'Organiza cada detalle de tu boda con nuestras herramientas.'
                    : 'Gestiona tus citas, cotizaciones y mensajes con novios.'}
                </p>
              </div>
              {isCouple && (
                <button onClick={() => setShowCreateModal(true)} className="btn-accent flex-shrink-0">
                  <Plus className="w-5 h-5" /> Nueva Boda
                </button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          {isCouple && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Calendar} label="Días restantes" value={weddings[0]?.weddingDate ? daysUntil(weddings[0].weddingDate) : '—'} color="sage" />
              <StatCard icon={Users} label="Invitados" value="0" color="blush" />
              <StatCard icon={DollarSign} label="Presupuesto" value={weddings[0]?.totalBudget ? `Q${weddings[0].totalBudget.toLocaleString()}` : 'Q0'} color="champagne" />
              <StatCard icon={MessageCircle} label="Mensajes" value="0" color="sage" />
            </div>
          )}

          {/* My Weddings / Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="font-display text-xl text-stone-800 mb-4">
                {isCouple ? 'Mis bodas' : 'Próximas citas'}
              </h3>
              {loading ? (
                <div className="card p-12 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
                </div>
              ) : weddings.length > 0 ? (
                <div className="space-y-3">
                  {weddings.map(w => (
                    <div key={w.uuid} className="card p-5 flex items-center gap-4 group cursor-pointer hover:-translate-y-0.5 transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-7 h-7 text-sage-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">{w.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-stone-400">
                          {w.weddingDate && (
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(w.weddingDate)}</span>
                          )}
                          {w.venueName && (
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{w.venueName}</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${w.status === 'planning' ? 'bg-champagne-100 text-champagne-700'
                          : w.status === 'confirmed' ? 'bg-sage-100 text-sage-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                        {w.status === 'draft' ? 'Borrador' : w.status === 'planning' ? 'Planificando' : w.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-sage-500 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-sage-400" />
                  </div>
                  <p className="font-display text-xl text-stone-700 mb-2">Aún no tienes bodas</p>
                  <p className="text-stone-400 text-sm mb-6">Crea tu primera boda para comenzar a planificar</p>
                  <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                    <Plus className="w-4 h-4" /> Crear mi boda
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-display text-xl text-stone-800 mb-4">Acciones rápidas</h3>
              <div className="space-y-3">
                {(isCouple ? [
                  { icon: Search, label: 'Buscar proveedores', desc: 'Encuentra tu equipo ideal', to: '/vendors' },
                  { icon: Users, label: 'Agregar invitados', desc: 'Gestiona tu lista', to: '#' },
                  { icon: DollarSign, label: 'Ver presupuesto', desc: 'Controla tus gastos', to: '#' },
                ] : [
                  { icon: Store, label: 'Editar perfil', desc: 'Actualiza tu información', to: '#' },
                  { icon: MessageCircle, label: 'Ver mensajes', desc: '5 mensajes nuevos', to: '#' },
                  { icon: Calendar, label: 'Mis citas', desc: 'Próximas reuniones', to: '#' },
                ]).map((action, i) => (
                  <Link key={i} to={action.to}
                    className="card px-5 py-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-sage-50 flex items-center justify-center group-hover:bg-sage-100 transition-colors">
                      <action.icon className="w-5 h-5 text-sage-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-700">{action.label}</p>
                      <p className="text-xs text-stone-400">{action.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                  </Link>
                ))}
              </div>

              {/* Timeline teaser */}
              <div className="card mt-6 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-sage-500" />
                  <h4 className="font-medium text-stone-700 text-sm">Timeline</h4>
                </div>
                <div className="space-y-4 pl-2">
                  {[
                    { time: 'Hoy', text: 'Crear lista de invitados', done: false },
                    { time: 'Esta semana', text: 'Cotizar fotógrafo', done: false },
                    { time: 'Este mes', text: 'Confirmar venue', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full mt-1 ${item.done ? 'bg-sage-500' : 'border-2 border-stone-300 bg-white'}`} />
                        {i < 2 && <div className="absolute top-4 left-1.5 w-px h-6 bg-stone-200 -translate-x-1/2" />}
                      </div>
                      <div>
                        <p className="text-xs text-stone-400">{item.time}</p>
                        <p className="text-sm text-stone-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Wedding Modal */}
      {showCreateModal && <CreateWeddingModal onClose={() => setShowCreateModal(false)} onCreated={(w) => { setWeddings(prev => [w, ...prev]); setShowCreateModal(false) }} />}
    </div>
  )
}

/* ─── Sub-components ─── */

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    sage: 'bg-sage-50 text-sage-600',
    blush: 'bg-blush-50 text-blush-600',
    champagne: 'bg-champagne-50 text-champagne-700',
  }
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-display text-2xl font-medium text-stone-800">{value}</p>
      <p className="text-xs text-stone-400 mt-0.5">{label}</p>
    </div>
  )
}

function SidebarLink({ icon: Icon, label, active, badge }: { icon: any; label: string; active?: boolean; badge?: number }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-all ${active ? 'bg-sage-50 text-sage-700 font-medium' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
      }`}>
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="w-5 h-5 rounded-full bg-blush-500 text-white text-xs flex items-center justify-center font-bold">{badge}</span>
      )}
    </button>
  )
}

function CreateWeddingModal({ onClose, onCreated }: { onClose: () => void; onCreated: (w: Wedding) => void }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await weddingService.create({
        title,
        weddingDate: date || undefined,
        venueName: venue || undefined,
        totalBudget: budget ? parseFloat(budget) : undefined,
      })
      toast.success('¡Boda creada!')
      onCreated(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear la boda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fade-up">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-sage-500" />
          </div>
          <h2 id="modal-title" className="font-display text-2xl text-stone-800">
            Crea tu <span className="italic text-sage-600">boda</span>
          </h2>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="wTitle" className="block text-sm font-medium text-stone-700 mb-1.5">Nombre de la boda *</label>
            <input id="wTitle" type="text" value={title} onChange={e => setTitle(e.target.value)}
              className="input-field" placeholder="Ej: Boda Juan & María" required autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="wDate" className="block text-sm font-medium text-stone-700 mb-1.5">Fecha</label>
              <input id="wDate" type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor="wBudget" className="block text-sm font-medium text-stone-700 mb-1.5">Presupuesto (Q)</label>
              <input id="wBudget" type="number" value={budget} onChange={e => setBudget(e.target.value)}
                className="input-field" placeholder="50,000" min="0" />
            </div>
          </div>
          <div>
            <label htmlFor="wVenue" className="block text-sm font-medium text-stone-700 mb-1.5">Lugar</label>
            <input id="wVenue" type="text" value={venue} onChange={e => setVenue(e.target.value)}
              className="input-field" placeholder="Ej: Antigua Guatemala" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading || !title} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Crear boda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── Helpers ─── */
function daysUntil(dateStr: string): string {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? `${diff}` : diff === 0 ? 'Hoy' : 'Pasada'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })
}
