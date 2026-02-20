import { Link, Outlet } from 'react-router-dom'
import {
    Heart, Calendar, Users, DollarSign, MessageCircle,
    Settings, Bell, Search, LogOut, LayoutDashboard, Store
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SidebarLink from '../ui/SidebarLink'

export default function DashboardLayout() {
    const { user, logout } = useAuth()

    const isCouple = user?.roles?.includes('couple')
    const isVendor = user?.roles?.includes('vendor')

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

                {/* Page content rendered here via nested routes */}
                <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
