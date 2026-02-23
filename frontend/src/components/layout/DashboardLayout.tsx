import { Link, Outlet, useLocation } from 'react-router-dom'
import { Heart, Calendar, Users, DollarSign, MessageCircle, Settings, Bell, LogOut, LayoutDashboard, Store, FileText, ClipboardList } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const isCouple = user?.roles?.includes('couple')
    const isVendor = user?.roles?.includes('vendor')
    const path = location.pathname

    return (
        <div className="min-h-screen bg-ivory-50">
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-stone-100">
                <div className="flex flex-col h-full">
                    <Link to="/" className="flex items-center gap-2.5 px-6 h-20 border-b border-stone-100">
                        <Heart className="w-6 h-6 text-blush-500" />
                        <span className="font-display text-xl text-stone-800">Celebra</span>
                    </Link>
                    <nav className="flex-1 px-3 py-6 space-y-1">
                        <SLink to="/dashboard" icon={LayoutDashboard} label="Resumen" active={path === '/dashboard'} />
                        {isCouple && (<>
                            <SLink to="/dashboard/guests" icon={Users} label="Invitados" active={path.includes('/guests')} />
                            <SLink to="/dashboard/budget" icon={DollarSign} label="Presupuesto" active={path.includes('/budget')} />
                            <SLink to="/dashboard/quotes" icon={FileText} label="Cotizaciones" active={path.includes('/quotes')} />
                            <SLink to="/dashboard/appointments" icon={Calendar} label="Citas" active={path.includes('/appointments')} />
                            <SLink to="/dashboard/messages" icon={MessageCircle} label="Mensajes" active={path.includes('/messages')} />
                            <SLink to="/vendors" icon={Store} label="Proveedores" active={false} />
                        </>)}
                        {isVendor && (<>
                            <SLink to="/dashboard/vendor-profile" icon={Store} label="Mi Perfil" active={path.includes('/vendor-profile')} />
                            <SLink to="/dashboard/appointments" icon={Calendar} label="Citas" active={path.includes('/appointments')} />
                            <SLink to="/dashboard/messages" icon={MessageCircle} label="Mensajes" active={path.includes('/messages')} />
                            <SLink to="/dashboard/quotes" icon={ClipboardList} label="Cotizaciones" active={path.includes('/quotes')} />
                        </>)}
                    </nav>
                    <div className="px-3 py-4 border-t border-stone-100">
                        <SLink to="#" icon={Settings} label="Configuración" active={false} />
                        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-all text-sm">
                            <LogOut className="w-5 h-5" /> Cerrar sesión
                        </button>
                    </div>
                </div>
            </aside>
            <main className="lg:pl-64">
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-100">
                    <div className="flex items-center justify-between px-4 sm:px-8 h-16">
                        <Link to="/" className="lg:hidden flex items-center gap-2">
                            <Heart className="w-5 h-5 text-blush-500" />
                            <span className="font-display text-lg text-stone-800">Celebra</span>
                        </Link>
                        <div className="hidden lg:block">
                            <h1 className="font-display text-xl text-stone-800">
                                Hola, <span className="italic text-sage-600">{user?.firstName || user?.email?.split('@')[0]}</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 rounded-xl hover:bg-stone-100 transition-colors relative">
                                <Bell className="w-5 h-5 text-stone-500" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blush-500 rounded-full" />
                            </button>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white text-sm font-bold">
                                {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto"><Outlet /></div>
            </main>
        </div>
    )
}

function SLink({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) {
    return (
        <Link to={to} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-all ${active ? 'bg-sage-50 text-sage-700 font-medium' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'}`}>
            <Icon className="w-5 h-5" /><span>{label}</span>
        </Link>
    )
}
