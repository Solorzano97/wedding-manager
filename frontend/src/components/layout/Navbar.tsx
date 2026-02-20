import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, X, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  const navBg = scrolled || !isLanding
    ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-stone-100'
    : 'bg-transparent'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Inicio">
            <div className="relative">
              <Heart className="w-7 h-7 text-blush-500 transition-transform duration-300 group-hover:scale-110" />
              <Heart className="w-7 h-7 text-blush-300 absolute inset-0 animate-ping opacity-20" />
            </div>
            <span className="font-display text-2xl font-medium text-stone-800 tracking-tight">
              Celebra
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/vendors" label="Proveedores" />
            <NavLink to="/#features" label="Características" />
            <NavLink to="/#pricing" label="Precios" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-secondary text-sm py-2.5 px-5">
                  <LayoutDashboard className="w-4 h-4" />
                  Mi Panel
                </Link>
                <button onClick={logout} className="p-2.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all" aria-label="Cerrar sesión">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2.5 text-stone-600 font-medium hover:text-sage-700 transition-colors text-sm">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2.5 px-5">
                  Comenzar gratis
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-stone-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute inset-x-0 top-full bg-white/95 backdrop-blur-xl border-b border-stone-100 shadow-lg animate-fade-in">
            <div className="px-4 py-6 space-y-1">
              <MobileLink to="/vendors" label="Proveedores" />
              <MobileLink to="/#features" label="Características" />
              <MobileLink to="/#pricing" label="Precios" />
              <div className="border-t border-stone-100 my-4" />
              {isAuthenticated ? (
                <>
                  <MobileLink to="/dashboard" label="Mi Panel" />
                  <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl text-blush-600 font-medium hover:bg-blush-50 transition-colors">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <Link to="/login" className="block text-center py-3 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-colors">
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="btn-primary w-full text-center">
                    Comenzar gratis
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="px-4 py-2 rounded-xl text-sm font-medium text-stone-500 hover:text-sage-700 hover:bg-sage-50/60 transition-all duration-200">
      {label}
    </Link>
  )
}

function MobileLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="block px-4 py-3 rounded-xl text-stone-700 font-medium hover:bg-sage-50 transition-colors">
      {label}
    </Link>
  )
}
