import { Link } from 'react-router-dom'
import { Heart, Sparkles, Calendar, Users, MessageCircle, Star, ArrowRight, Check, Camera, Music, Utensils, Flower2 } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const features = [
  { icon: Calendar, title: 'Planifica sin estrés', desc: 'Organiza cada detalle de tu boda con herramientas intuitivas y un asistente inteligente.' },
  { icon: Users, title: 'Gestión de invitados', desc: 'Invitaciones digitales, confirmación de asistencia y asignación de mesas en un solo lugar.' },
  { icon: Sparkles, title: 'Proveedores verificados', desc: 'Encuentra y cotiza los mejores fotógrafos, catering, decoración y más.' },
  { icon: MessageCircle, title: 'Chat directo', desc: 'Comunícate con proveedores de forma segura sin compartir datos personales.' },
]

const categories = [
  { icon: Camera, name: 'Fotografía', count: 48 },
  { icon: Utensils, name: 'Catering', count: 35 },
  { icon: Flower2, name: 'Floristería', count: 27 },
  { icon: Music, name: 'Música & DJ', count: 22 },
]

const testimonials = [
  { name: 'María & Carlos', text: 'Celebra nos ayudó a organizar nuestra boda de ensueño. Los proveedores fueron increíbles.', rating: 5 },
  { name: 'Ana & Roberto', text: 'La gestión de invitados fue facilísima. Todos confirmaron desde su celular.', rating: 5 },
  { name: 'Lucía & Diego', text: 'Encontramos al fotógrafo perfecto gracias al catálogo. ¡Superó nuestras expectativas!', rating: 5 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pattern-floral">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-sage-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blush-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-champagne-200/25 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span>La plataforma #1 para bodas en Guatemala</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] text-stone-800 animate-fade-up">
                Tu boda,{' '}
                <span className="italic text-sage-600 font-normal">perfectamente</span>
                <br />
                planificada
              </h1>

              <p className="text-lg text-stone-500 max-w-lg leading-relaxed animate-fade-up" style={{ animationDelay: '0.15s' }}>
                Todo lo que necesitas para crear el día más especial de tu vida.
                Proveedores verificados, herramientas intuitivas y un asistente
                inteligente que te guía en cada paso.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Comienza gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/vendors" className="btn-secondary text-lg px-8 py-4">
                  Explorar proveedores
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 animate-fade-up" style={{ animationDelay: '0.45s' }}>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-champagne-400 text-champagne-400" />)}
                  </div>
                  <p className="text-sm text-stone-500">+2,500 parejas felices</p>
                </div>
              </div>
            </div>

            {/* Hero visual - Wedding card mockup */}
            <div className="hidden lg:block relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="glass rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-sage-100 via-ivory-100 to-blush-50 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 pattern-floral opacity-40" />
                    <Heart className="w-12 h-12 text-blush-400 mb-4 animate-float" />
                    <p className="font-display text-4xl text-stone-700 italic">Juan & María</p>
                    <p className="text-stone-500 mt-2 font-body">15 de Marzo, 2026</p>
                    <div className="mt-8 w-24 h-px bg-stone-300" />
                    <p className="mt-4 text-sm text-stone-400 font-body">Antigua Guatemala</p>
                  </div>
                </div>
                {/* Floating notification cards */}
                <div className="absolute -left-8 top-1/4 glass rounded-2xl px-4 py-3 flex items-center gap-3 animate-slide-in" style={{ animationDelay: '0.8s' }}>
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-sage-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">Ana confirmó</p>
                    <p className="text-xs text-stone-400">hace 2 min</p>
                  </div>
                </div>
                <div className="absolute -right-4 bottom-1/3 glass rounded-2xl px-4 py-3 flex items-center gap-3 animate-slide-in" style={{ animationDelay: '1.2s' }}>
                  <div className="w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-champagne-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">Cotización recibida</p>
                    <p className="text-xs text-stone-400">Studio Moments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sage-600 font-medium mb-3">Todo en un solo lugar</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-stone-800">
              Herramientas que simplifican tu <span className="italic text-sage-600">planificación</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-sage-50 flex items-center justify-center mb-5 group-hover:bg-sage-100 transition-colors">
                  <f.icon className="w-7 h-7 text-sage-600" />
                </div>
                <h3 className="font-display text-xl font-medium text-stone-800 mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-24 pattern-floral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-sage-600 font-medium mb-2">Catálogo de proveedores</p>
              <h2 className="font-display text-4xl font-light text-stone-800">
                Encuentra a los <span className="italic text-sage-600">mejores</span>
              </h2>
            </div>
            <Link to="/vendors" className="btn-secondary text-sm">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} to={`/vendors?category=${cat.name.toLowerCase()}`}
                className="card p-6 text-center group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="font-display text-lg font-medium text-stone-800">{cat.name}</h3>
                <p className="text-sm text-stone-400 mt-1">{cat.count} proveedores</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blush-500 font-medium mb-3">Historias reales</p>
            <h2 className="font-display text-4xl font-light text-stone-800">
              Parejas que dijeron <span className="italic text-blush-500">"sí, acepto"</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-8 relative">
                <div className="absolute top-6 right-6 text-sage-200 font-display text-6xl leading-none">"</div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-champagne-400 text-champagne-400" />)}
                </div>
                <p className="text-stone-600 leading-relaxed mb-6 relative z-10">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-medium text-stone-700">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-700 via-sage-800 to-sage-900" />
        <div className="absolute inset-0 pattern-floral opacity-10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Heart className="w-10 h-10 text-blush-300 mx-auto mb-6 animate-float" />
          <h2 className="font-display text-4xl sm:text-5xl font-light text-white mb-6">
            Comienza a planificar la boda de tus <span className="italic text-champagne-300">sueños</span>
          </h2>
          <p className="text-sage-200 text-lg mb-10 max-w-lg mx-auto">
            Únete a miles de parejas que ya están usando Celebra. Es gratis para los novios.
          </p>
          <Link to="/register" className="btn-accent text-lg px-10 py-4">
            Crear cuenta gratis
            <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
