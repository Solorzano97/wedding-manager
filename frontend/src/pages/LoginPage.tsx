import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authService.login({ email, password })
      login(data)
      toast.success('¡Bienvenido de vuelta!')
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Credenciales inválidas'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-sage-700 via-sage-800 to-sage-900 overflow-hidden">
        <div className="absolute inset-0 pattern-floral opacity-10" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blush-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-champagne-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16">
          <Heart className="w-14 h-14 text-blush-300 mb-8 animate-float" />
          <h2 className="font-display text-5xl text-white font-light text-center leading-tight">
            Cada gran historia de amor<br />
            <span className="italic text-champagne-300">merece ser celebrada</span>
          </h2>
          <p className="text-sage-300 mt-6 text-center max-w-md leading-relaxed">
            Planifica la boda de tus sueños con las herramientas más completas y los mejores proveedores.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-sage-700 bg-gradient-to-br from-sage-400 to-sage-600" />
              ))}
            </div>
            <p className="text-sage-400 text-sm">+2,500 parejas nos eligieron</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-ivory-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10" aria-label="Volver al inicio">
            <Heart className="w-7 h-7 text-blush-500" />
            <span className="font-display text-2xl text-stone-800">Celebra</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-light text-stone-800">
              Bienvenido de <span className="italic text-sage-600">vuelta</span>
            </h1>
            <p className="text-stone-500 mt-2">
              Ingresa a tu cuenta para continuar planificando
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@correo.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-sage-600 hover:text-sage-700 font-medium transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-stone-500 mt-8">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-sage-600 font-semibold hover:text-sage-700 transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
