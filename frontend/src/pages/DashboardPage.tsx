import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, Plus, Calendar, Users, DollarSign, MessageCircle, Clock, ChevronRight,
  Sparkles, MapPin, Search, Store
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { weddingService } from '../services/weddings'
import StatCard from '../components/ui/StatCard'
import CreateWeddingModal from '../components/ui/CreateWeddingModal'
import type { Wedding } from '../types'
import { daysUntil, formatDate } from '../utils/date'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
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
    <>
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

      {/* Create Wedding Modal */}
      {showCreateModal && <CreateWeddingModal onClose={() => setShowCreateModal(false)} onCreated={(w) => { setWeddings(prev => [w, ...prev]); setShowCreateModal(false) }} />}
    </>
  )
}
