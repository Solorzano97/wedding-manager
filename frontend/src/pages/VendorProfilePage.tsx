import { useState, useEffect, type FormEvent } from 'react'
import { Store, Save, Plus, Trash2, DollarSign, Tag, MapPin, Phone, Globe, FileText, Loader2 } from 'lucide-react'
import { vendorService, type VendorServiceResponse } from '../services/vendors'
import type { VendorProfile, ServiceCategory } from '../types'
import toast from 'react-hot-toast'

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices] = useState<VendorServiceResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(true)

  // Profile form
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [selectedCatSlugs, setSelectedCatSlugs] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Service form
  const [showAddService, setShowAddService] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    try {
      const [catRes] = await Promise.all([vendorService.getCategories()])
      setCategories(catRes.data)
      try {
        const profRes = await vendorService.getMyProfile()
        fillForm(profRes.data)
        setProfile(profRes.data)
        const svcRes = await vendorService.getMyServices()
        setServices(svcRes.data)
      } catch {
        setHasProfile(false)
      }
    } catch {} finally { setLoading(false) }
  }

  function fillForm(p: VendorProfile) {
    setBusinessName(p.businessName || ''); setDescription(p.description || '')
    setPhone(p.phone || ''); setWebsiteUrl(p.websiteUrl || '')
    setCity(p.city || ''); setState(p.state || '')
    // Map category names back to slugs
    const slugs = categories.length > 0
      ? p.serviceCategories.map(name => categories.find(c => c.name === name)?.slug).filter(Boolean) as string[]
      : p.serviceCategories.map(name => name.toLowerCase().replace(/\s+/g, '-'))
    setSelectedCatSlugs(slugs)
  }

  function toggleCat(slug: string) {
    setSelectedCatSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug])
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const data = { businessName, description, phone, websiteUrl, city, state, serviceCategorySlugs: selectedCatSlugs }
      const res = hasProfile
        ? await vendorService.updateProfile(data)
        : await vendorService.createProfile(data)
      setProfile(res.data); setHasProfile(true)
      toast.success(hasProfile ? 'Perfil actualizado' : '¡Perfil creado!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    } finally { setSaving(false) }
  }

  async function handleDeleteService(id: number) {
    try {
      await vendorService.deleteService(id)
      setServices(prev => prev.filter(s => s.id !== id))
      toast.success('Servicio eliminado')
    } catch { toast.error('Error') }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl text-stone-800">Mi <span className="italic text-sage-600">Perfil</span> de Proveedor</h2>
        <p className="text-stone-500 text-sm mt-1">{hasProfile ? 'Edita tu información para aparecer en el catálogo' : 'Completa tu perfil para que los novios te encuentren'}</p>
      </div>

      {!hasProfile && (
        <div className="bg-champagne-50 border border-champagne-200 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <Store className="w-6 h-6 text-champagne-600 flex-shrink-0 mt-0.5" />
            <div><p className="font-medium text-champagne-800">¡Bienvenido!</p><p className="text-sm text-champagne-700 mt-1">Completa tu perfil de negocio para aparecer en el catálogo de proveedores y que las parejas te contacten.</p></div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="card p-6">
          <h3 className="font-display text-lg text-stone-800 mb-5 flex items-center gap-2"><Store className="w-5 h-5 text-sage-600" /> Información del negocio</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nombre del negocio *</label>
              <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="input-field" required placeholder="Ej: Studio Moments Fotografía" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Descripción</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="input-field resize-none" placeholder="Describe tu negocio, experiencia, estilo de trabajo..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-stone-700 mb-1.5"><Phone className="w-3.5 h-3.5 inline mr-1" />Teléfono</label><input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="+502 1234 5678" /></div>
              <div><label className="block text-sm font-medium text-stone-700 mb-1.5"><Globe className="w-3.5 h-3.5 inline mr-1" />Sitio web</label><input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="input-field" placeholder="https://mi-negocio.com" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-stone-700 mb-1.5"><MapPin className="w-3.5 h-3.5 inline mr-1" />Ciudad</label><input value={city} onChange={e => setCity(e.target.value)} className="input-field" placeholder="Guatemala" /></div>
              <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Departamento</label><input value={state} onChange={e => setState(e.target.value)} className="input-field" placeholder="Guatemala" /></div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg text-stone-800 mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-sage-600" /> Categorías de servicio</h3>
          <p className="text-sm text-stone-400 mb-4">Selecciona las categorías que ofreces</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat.slug} type="button" onClick={() => toggleCat(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCatSlugs.includes(cat.slug) ? 'bg-sage-600 text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving || !businessName.trim()} className="btn-primary w-full sm:w-auto disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {hasProfile ? 'Guardar cambios' : 'Crear perfil'}
        </button>
      </form>

      {/* Services Section - only show if profile exists */}
      {hasProfile && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-xl text-stone-800">Mis <span className="italic text-sage-600">Servicios</span></h3>
              <p className="text-stone-400 text-sm mt-1">Los servicios que ofreces con sus precios</p>
            </div>
            <button onClick={() => setShowAddService(true)} className="btn-primary"><Plus className="w-4 h-4" /> Agregar servicio</button>
          </div>

          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map(svc => (
                <div key={svc.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0"><DollarSign className="w-6 h-6 text-sage-600" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800">{svc.name}</p>
                    {svc.description && <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">{svc.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                      {svc.priceUnit && <span>{svc.priceUnit}</span>}
                      {svc.minGuests && svc.maxGuests && <span>{svc.minGuests}-{svc.maxGuests} invitados</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl text-stone-800">Q{svc.basePrice.toLocaleString()}</p>
                    {svc.maxPrice && <p className="text-xs text-stone-400">hasta Q{svc.maxPrice.toLocaleString()}</p>}
                  </div>
                  <button onClick={() => handleDeleteService(svc.id)} className="p-2 rounded-xl hover:bg-blush-50 text-stone-400 hover:text-blush-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="font-display text-xl text-stone-700 mb-2">Sin servicios registrados</p>
              <p className="text-stone-400 text-sm mb-4">Agrega los servicios que ofreces para que los novios puedan cotizar</p>
              <button onClick={() => setShowAddService(true)} className="btn-primary"><Plus className="w-4 h-4" /> Agregar primer servicio</button>
            </div>
          )}
        </div>
      )}

      {showAddService && <AddServiceModal categories={categories} onClose={() => setShowAddService(false)} onAdded={svc => { setServices(prev => [...prev, svc]); setShowAddService(false) }} />}
    </div>
  )
}

function AddServiceModal({ categories, onClose, onAdded }: {
  categories: ServiceCategory[]; onClose: () => void; onAdded: (svc: VendorServiceResponse) => void
}) {
  const [name, setName] = useState('')
  const [catId, setCatId] = useState<number>(categories[0]?.id || 0)
  const [desc, setDesc] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [priceUnit, setPriceUnit] = useState('por evento')
  const [minGuests, setMinGuests] = useState('')
  const [maxGuests, setMaxGuests] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const { data } = await vendorService.addService({
        name, serviceCategoryId: catId, description: desc || undefined,
        basePrice: parseFloat(basePrice), maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        priceUnit: priceUnit || undefined,
        minGuests: minGuests ? parseInt(minGuests) : undefined,
        maxGuests: maxGuests ? parseInt(maxGuests) : undefined,
      })
      toast.success('Servicio agregado')
      onAdded(data)
    } catch { toast.error('Error al agregar') } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-up max-h-[90vh] overflow-y-auto">
        <h2 className="font-display text-xl text-stone-800 mb-6">Agregar <span className="italic text-sage-600">servicio</span></h2>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Nombre del servicio *</label><input value={name} onChange={e => setName(e.target.value)} className="input-field" required placeholder="Ej: Paquete Fotografía Premium" autoFocus /></div>
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Categoría *</label>
            <select value={catId} onChange={e => setCatId(parseInt(e.target.value))} className="input-field">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Descripción</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="input-field resize-none" placeholder="Describe lo que incluye este servicio..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-stone-700 mb-1">Precio base (Q) *</label><input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} className="input-field" required min="0" step="0.01" placeholder="5000" /></div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1">Precio máximo (Q)</label><input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-field" min="0" step="0.01" placeholder="15000" /></div>
          </div>
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Unidad de precio</label>
            <select value={priceUnit} onChange={e => setPriceUnit(e.target.value)} className="input-field">
              <option value="por evento">Por evento</option><option value="por hora">Por hora</option><option value="por persona">Por persona</option><option value="paquete">Paquete</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-stone-700 mb-1">Mín. invitados</label><input type="number" value={minGuests} onChange={e => setMinGuests(e.target.value)} className="input-field" min="0" placeholder="50" /></div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1">Máx. invitados</label><input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} className="input-field" min="0" placeholder="500" /></div>
          </div>
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button><button type="submit" disabled={loading || !name || !basePrice} className="btn-primary flex-1 disabled:opacity-50">{loading ? 'Agregando...' : 'Agregar'}</button></div>
        </form>
      </div>
    </div>
  )
}
