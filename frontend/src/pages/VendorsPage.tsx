import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, ChevronDown, MapPin, Camera, Utensils, Flower2, Music, Palette, Building2, Cake, Car, Gem, Sparkles, X } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import VendorCard from '../components/ui/VendorCard'
import { vendorService } from '../services/vendors'
import type { VendorProfile } from '../types'

const CATEGORIES = [
  { slug: 'fotografia', name: 'Fotografía', icon: Camera },
  { slug: 'catering', name: 'Catering', icon: Utensils },
  { slug: 'floristeria', name: 'Floristería', icon: Flower2 },
  { slug: 'musica', name: 'Música & DJ', icon: Music },
  { slug: 'decoracion', name: 'Decoración', icon: Palette },
  { slug: 'salones', name: 'Salones', icon: Building2 },
  { slug: 'pasteleria', name: 'Pastelería', icon: Cake },
  { slug: 'transporte', name: 'Transporte', icon: Car },
  { slug: 'joyeria', name: 'Joyería', icon: Gem },
  { slug: 'coordinacion', name: 'Coordinación', icon: Sparkles },
]
const CITIES = ['Guatemala', 'Antigua Guatemala', 'Quetzaltenango', 'Escuintla', 'Mixco']

const DEMO_VENDORS: VendorProfile[] = [
  { id: 1, businessName: 'Studio Moments', slug: 'studio-moments', description: 'Capturamos los momentos más especiales de tu boda con un estilo artístico y emocional único.', logoUrl: null, coverImageUrl: null, phone: null, websiteUrl: null, city: 'Antigua Guatemala', state: 'Sacatepéquez', country: 'Guatemala', avgRating: 4.9, totalReviews: 127, verified: true, featured: true, serviceCategories: ['Fotografía', 'Video'] },
  { id: 2, businessName: 'Flores del Valle', slug: 'flores-del-valle', description: 'Arreglos florales personalizados que transforman cada espacio en un jardín de sueños.', logoUrl: null, coverImageUrl: null, phone: null, websiteUrl: null, city: 'Guatemala', state: 'Guatemala', country: 'Guatemala', avgRating: 4.8, totalReviews: 89, verified: true, featured: true, serviceCategories: ['Floristería'] },
  { id: 3, businessName: 'Sabor Divino Catering', slug: 'sabor-divino', description: 'Gastronomía de autor para bodas. Menús personalizados con ingredientes locales premium.', logoUrl: null, coverImageUrl: null, phone: null, websiteUrl: null, city: 'Guatemala', state: 'Guatemala', country: 'Guatemala', avgRating: 4.7, totalReviews: 203, verified: true, featured: false, serviceCategories: ['Catering'] },
  { id: 4, businessName: 'DJ Eclipse', slug: 'dj-eclipse', description: 'La mejor música y entretenimiento para que tu fiesta sea inolvidable.', logoUrl: null, coverImageUrl: null, phone: null, websiteUrl: null, city: 'Mixco', state: 'Guatemala', country: 'Guatemala', avgRating: 4.6, totalReviews: 65, verified: false, featured: false, serviceCategories: ['Música & DJ'] },
  { id: 5, businessName: 'Dulce Tentación', slug: 'dulce-tentacion', description: 'Pasteles de boda artesanales, diseñados a medida para tu gran día.', logoUrl: null, coverImageUrl: null, phone: null, websiteUrl: null, city: 'Antigua Guatemala', state: 'Sacatepéquez', country: 'Guatemala', avgRating: 4.9, totalReviews: 156, verified: true, featured: true, serviceCategories: ['Pastelería'] },
  { id: 6, businessName: 'Hacienda Las Rosas', slug: 'hacienda-las-rosas', description: 'Un salón de ensueño rodeado de jardines coloniales con capacidad para 300 invitados.', logoUrl: null, coverImageUrl: null, phone: null, websiteUrl: null, city: 'Antigua Guatemala', state: 'Sacatepéquez', country: 'Guatemala', avgRating: 4.8, totalReviews: 91, verified: true, featured: true, serviceCategories: ['Salones'] },
]

export default function VendorsPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [vendors, setVendors] = useState<VendorProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { searchVendors() }, [])

  function searchVendors() {
    setLoading(true)
    vendorService.search({ city: selectedCity || undefined, category: selectedCategory || undefined, q: query || undefined })
      .then(({ data }) => {
        if (data.content && data.content.length > 0) setVendors(data.content)
        else setVendors(filterDemo())
      })
      .catch(() => setVendors(filterDemo()))
      .finally(() => setLoading(false))
  }

  function filterDemo() {
    return DEMO_VENDORS.filter(v => {
      if (selectedCity && v.city !== selectedCity) return false
      if (selectedCategory && !v.serviceCategories.some(c => c.toLowerCase().includes(selectedCategory))) return false
      if (query && !v.businessName.toLowerCase().includes(query.toLowerCase()) && !v.description?.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }

  const clearFilters = () => { setQuery(''); setSelectedCity(''); setSelectedCategory('') }
  const hasActiveFilters = query || selectedCity || selectedCategory

  return (
    <div className="min-h-screen bg-ivory-50">
      <Navbar />
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sage-50/80 to-ivory-50 pattern-floral" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="font-display text-4xl sm:text-5xl font-light text-stone-800">Encuentra a los <span className="italic text-sage-600">mejores</span> proveedores</h1>
            <p className="text-stone-500 mt-3">Proveedores verificados y calificados por parejas reales</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" /><input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar proveedores..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-0 focus:bg-white focus:ring-2 focus:ring-sage-200 transition-all text-stone-800 placeholder:text-stone-400" onKeyDown={e => e.key === 'Enter' && searchVendors()} /></div>
              <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" /><select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="appearance-none w-full sm:w-52 pl-12 pr-10 py-3 rounded-xl bg-stone-50 border-0 focus:bg-white focus:ring-2 focus:ring-sage-200 text-stone-700 cursor-pointer transition-all"><option value="">Todas las ciudades</option>{CITIES.map(c => <option key={c} value={c}>{c}</option>)}</select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" /></div>
              <button onClick={searchVendors} className="btn-primary py-3 px-6 rounded-xl"><Search className="w-5 h-5" /><span className="sm:hidden">Buscar</span></button>
            </div>
          </div>
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            <button onClick={() => { setSelectedCategory(''); searchVendors() }} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!selectedCategory ? 'bg-sage-600 text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:border-sage-300'}`}><Sparkles className="w-4 h-4" /> Todos</button>
            {CATEGORIES.map(cat => (<button key={cat.slug} onClick={() => { setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug); setTimeout(searchVendors, 0) }} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.slug ? 'bg-sage-600 text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:border-sage-300'}`}><cat.icon className="w-4 h-4" /> {cat.name}</button>))}
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-600 font-medium"><span className="text-sage-600 font-bold">{vendors.length}</span> proveedores encontrados</p>
          {hasActiveFilters && <button onClick={() => { clearFilters(); setTimeout(searchVendors, 0) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blush-600 bg-blush-50 hover:bg-blush-100 transition-colors"><X className="w-3.5 h-3.5" /> Limpiar filtros</button>}
        </div>
        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>
        : vendors.length > 0 ? (<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{vendors.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)}</div>)
        : (<div className="text-center py-20"><div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6"><Search className="w-10 h-10 text-stone-300" /></div><h3 className="font-display text-2xl text-stone-700 mb-2">No encontramos proveedores</h3><p className="text-stone-400 mb-6">Intenta con otros filtros</p><button onClick={() => { clearFilters(); setTimeout(searchVendors, 0) }} className="btn-secondary">Limpiar filtros</button></div>)}
      </main>
    </div>
  )
}
