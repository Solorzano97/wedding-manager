import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Eye, EyeOff, ArrowRight, Loader2, Users, Store, Check } from 'lucide-react'
import { authService } from '../services/auth'
import toast from 'react-hot-toast'

type Role = 'couple' | 'vendor'

export default function RegisterPage() {
  const [role, setRole] = useState<Role | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!role) return toast.error('Selecciona un tipo de cuenta')
    setLoading(true)
    try {
      await authService.register({ email, password, firstName, lastName, role })
      toast.success('¡Cuenta creada! Ahora inicia sesión.')
      navigate('/login')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear la cuenta'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-sage-700 via-sage-800 to-sage-900 overflow-hidden">
        <div className="absolute inset-0 pattern-floral opacity-10" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-champagne-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-blush-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16">
          <Heart className="w-14 h-14 text-blush-300 mb-8 animate-float" />
          <h2 className="font-display text-5xl text-white font-light text-center leading-tight">
            Comienza tu viaje hacia el
            <br />
            <span className="italic text-champagne-300">día perfecto</span>
          </h2>
          <div className="mt-16 space-y-4 w-full max-w-sm">
            {['Herramientas de planificación gratuitas', 'Proveedores verificados y confiables', 'Gestión de invitados simplificada'].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sage-200">
                <div className="w-6 h-6 rounded-full bg-sage-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-ivory-50">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10" aria-label="Volver al inicio">
            <Heart className="w-7 h-7 text-blush-500" />
            <span className="font-display text-2xl text-stone-800">Celebra</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-light text-stone-800">
              Crea tu <span className="italic text-sage-600">cuenta</span>
            </h1>
            <p className="text-stone-500 mt-2">
              Empieza a planificar tu boda hoy mismo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Role Selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-stone-700 mb-3">
                ¿Cómo usarás Celebra?
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard
                  icon={Users}
                  title="Soy novio/a"
                  desc="Planificar mi boda"
                  selected={role === 'couple'}
                  onClick={() => setRole('couple')}
                />
                <RoleCard
                  icon={Store}
                  title="Soy proveedor"
                  desc="Ofrecer mis servicios"
                  selected={role === 'vendor'}
                  onClick={() => setRole('vendor')}
                />
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-1.5">Nombre</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="input-field" placeholder="Juan" required autoComplete="given-name" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-1.5">Apellido</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  className="input-field" placeholder="Pérez" required autoComplete="family-name" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">Correo electrónico</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-field" placeholder="tu@correo.com" required autoComplete="email" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} className="input-field pr-12"
                  placeholder="Mínimo 8 caracteres" required autoComplete="new-password" minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex gap-1.5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      password.length >= i * 3 ? (password.length >= 12 ? 'bg-sage-500' : password.length >= 8 ? 'bg-champagne-500' : 'bg-blush-400') : 'bg-stone-200'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || !email || !password || !firstName || !role}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Crear cuenta<ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <p className="text-xs text-stone-400 text-center">
              Al registrarte, aceptas nuestros{' '}
              <a href="#" className="text-sage-600 hover:underline">Términos</a> y{' '}
              <a href="#" className="text-sage-600 hover:underline">Política de Privacidad</a>
            </p>
          </form>

          <p className="text-center text-stone-500 mt-8">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-sage-600 font-semibold hover:text-sage-700 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function RoleCard({ icon: Icon, title, desc, selected, onClick }: {
  icon: any; title: string; desc: string; selected: boolean; onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
        selected
          ? 'border-sage-500 bg-sage-50 shadow-md shadow-sage-100'
          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
      }`}>
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-sage-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <Icon className={`w-7 h-7 mb-2 ${selected ? 'text-sage-600' : 'text-stone-400'}`} />
      <p className={`font-medium text-sm ${selected ? 'text-sage-800' : 'text-stone-700'}`}>{title}</p>
      <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
    </button>
  )
}
