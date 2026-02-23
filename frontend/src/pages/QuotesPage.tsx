import { useState, useEffect, type FormEvent } from 'react'
import { FileText, Clock, CheckCircle, XCircle, Send, DollarSign, Eye, X, Calendar, Users, MessageSquare, ArrowRight } from 'lucide-react'
import { bookingService } from '../services/bookings'
import { weddingService } from '../services/weddings'
import { useAuth } from '../context/AuthContext'
import type { QuoteResponse } from '../types/bookings'
import type { Wedding } from '../types'
import toast from 'react-hot-toast'

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: 'Nueva solicitud', color: 'bg-champagne-100 text-champagne-700', icon: FileText },
  sent: { label: 'Cotización enviada', color: 'bg-sage-100 text-sage-700', icon: Send },
  viewed: { label: 'Vista por novios', color: 'bg-champagne-100 text-champagne-700', icon: Eye },
  accepted: { label: 'Aceptada', color: 'bg-sage-100 text-sage-700', icon: CheckCircle },
  rejected: { label: 'Rechazada', color: 'bg-blush-100 text-blush-700', icon: XCircle },
  expired: { label: 'Expirada', color: 'bg-stone-100 text-stone-500', icon: Clock },
}

export default function QuotesPage() {
  const { user } = useAuth()
  const isVendor = user?.roles?.includes('vendor')
  const isCouple = user?.roles?.includes('couple')

  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [quotes, setQuotes] = useState<QuoteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<QuoteResponse | null>(null)
  const [showRespondModal, setShowRespondModal] = useState(false)

  useEffect(() => {
    if (isVendor) {
      bookingService.vendorQuotes()
        .then(({ data }) => setQuotes(data.content))
        .catch(() => {})
        .finally(() => setLoading(false))
    } else if (isCouple) {
      weddingService.getMyWeddings().then(({ data }) => {
        if (data.content.length > 0) {
          const w = data.content[0]; setWedding(w)
          bookingService.listQuotes(w.id)
            .then(({ data }) => setQuotes(data.content))
            .catch(() => {})
            .finally(() => setLoading(false))
        } else setLoading(false)
      }).catch(() => setLoading(false))
    } else setLoading(false)
  }, [isVendor, isCouple])

  function handleStatus(uuid: string, status: string) {
    const promise = isVendor
      ? bookingService.vendorUpdateQuoteStatus(uuid, status)
      : wedding ? bookingService.updateQuoteStatus(wedding.id, uuid, status) : null
    if (!promise) return
    promise.then(({ data }) => {
      setQuotes(prev => prev.map(q => q.uuid === data.uuid ? data : q))
      toast.success(`Cotización ${STATUS_MAP[status]?.label || status}`)
    }).catch(() => toast.error('Error al actualizar'))
  }

  function openRespond(q: QuoteResponse) {
    setSelectedQuote(q)
    setShowRespondModal(true)
  }

  function handleResponded(updated: QuoteResponse) {
    setQuotes(prev => prev.map(q => q.uuid === updated.uuid ? updated : q))
    setShowRespondModal(false)
    setSelectedQuote(null)
  }

  if (!loading && !isVendor && !wedding) return (
    <div className="text-center py-20"><p className="text-stone-500">Crea una boda primero.</p></div>
  )

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl text-stone-800">
          {isVendor ? <>Cotizaciones <span className="italic text-sage-600">Recibidas</span></> : <>Mis <span className="italic text-sage-600">Cotizaciones</span></>}
        </h2>
        {wedding && <p className="text-stone-500 text-sm mt-1">{wedding.title}</p>}
      </div>

      {loading ? <div className="card p-12 flex justify-center"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>
      : quotes.length > 0 ? (
        <div className="space-y-4">
          {quotes.map(q => {
            const st = STATUS_MAP[q.status] || STATUS_MAP.draft
            const canVendorRespond = isVendor && (q.status === 'draft' || q.status === 'viewed')
            const canCoupleAct = isCouple && q.status === 'sent'
            const hasPricing = q.totalAmount > 0
            return (
              <div key={q.uuid} className="card overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                        <st.icon className="w-3 h-3" /> {st.label}
                      </span>
                      <span className="text-xs text-stone-400">#{q.uuid.slice(0, 8)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
                      {q.eventDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(q.eventDate).toLocaleDateString('es-GT')}</span>}
                      {q.guestCount && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {q.guestCount} invitados</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(q.createdAt).toLocaleDateString('es-GT')}</span>
                    </div>
                  </div>
                  {hasPricing && (
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-2xl font-medium text-stone-800">{q.currencyCode} {q.totalAmount.toLocaleString()}</p>
                      {q.validUntil && <p className="text-xs text-stone-400">Válida hasta {new Date(q.validUntil).toLocaleDateString('es-GT')}</p>}
                    </div>
                  )}
                </div>

                {/* Request details */}
                {q.customRequirements && (
                  <div className="px-5 py-3 bg-stone-50 border-y border-stone-100">
                    <p className="text-xs font-medium text-stone-400 mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Lo que solicitan los novios:</p>
                    <p className="text-sm text-stone-600">{q.customRequirements}</p>
                  </div>
                )}

                {/* Pricing breakdown (when vendor has responded) */}
                {hasPricing && (q.subtotal > 0 || q.discountAmount > 0 || q.taxAmount > 0) && (
                  <div className="px-5 py-3 bg-sage-50/50 border-t border-stone-100">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-stone-500">Subtotal: <b className="text-stone-700">Q{q.subtotal.toLocaleString()}</b></span>
                      {q.discountAmount > 0 && <span className="text-sage-600">Descuento: -Q{q.discountAmount.toLocaleString()}</span>}
                      {q.taxAmount > 0 && <span className="text-stone-500">IVA: Q{q.taxAmount.toLocaleString()}</span>}
                    </div>
                  </div>
                )}

                {/* Vendor notes */}
                {q.notes && q.status !== 'draft' && (
                  <div className="px-5 py-3 border-t border-stone-100">
                    <p className="text-xs font-medium text-stone-400 mb-1">Notas del proveedor:</p>
                    <p className="text-sm text-stone-600">{q.notes}</p>
                  </div>
                )}

                {/* Actions */}
                {(canVendorRespond || canCoupleAct) && (
                  <div className="px-5 py-4 border-t border-stone-100 flex flex-wrap gap-3">
                    {canVendorRespond && (<>
                      <button onClick={() => openRespond(q)} className="btn-primary text-sm">
                        <DollarSign className="w-4 h-4" /> Elaborar cotización <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleStatus(q.uuid, 'rejected')} className="btn-secondary text-sm text-blush-600 border-blush-200 hover:bg-blush-50">
                        <XCircle className="w-4 h-4" /> Rechazar solicitud
                      </button>
                    </>)}
                    {canCoupleAct && (<>
                      <button onClick={() => handleStatus(q.uuid, 'accepted')} className="btn-primary text-sm">
                        <CheckCircle className="w-4 h-4" /> Aceptar cotización
                      </button>
                      <button onClick={() => handleStatus(q.uuid, 'rejected')} className="btn-secondary text-sm text-blush-600 border-blush-200 hover:bg-blush-50">
                        <XCircle className="w-4 h-4" /> Rechazar
                      </button>
                    </>)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <DollarSign className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="font-display text-xl text-stone-700 mb-2">Sin cotizaciones</p>
          <p className="text-stone-400 text-sm">
            {isVendor ? 'Las parejas podrán solicitarte cotizaciones desde tu perfil' : 'Busca proveedores y solicita cotizaciones desde su perfil'}
          </p>
        </div>
      )}

      {showRespondModal && selectedQuote && (
        <RespondQuoteModal quote={selectedQuote} onClose={() => { setShowRespondModal(false); setSelectedQuote(null) }} onResponded={handleResponded} />
      )}
    </div>
  )
}

// ======= VENDOR RESPOND MODAL =======
function RespondQuoteModal({ quote, onClose, onResponded }: {
  quote: QuoteResponse; onClose: () => void; onResponded: (q: QuoteResponse) => void
}) {
  const [subtotal, setSubtotal] = useState('')
  const [discount, setDiscount] = useState('')
  const [tax, setTax] = useState('')
  const [total, setTotal] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-calculate total
  useEffect(() => {
    const sub = parseFloat(subtotal) || 0
    const disc = parseFloat(discount) || 0
    const tx = parseFloat(tax) || 0
    setTotal((sub - disc + tx).toFixed(2))
  }, [subtotal, discount, tax])

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const { data } = await bookingService.vendorRespondQuote(quote.uuid, {
        subtotal: parseFloat(subtotal), discountAmount: discount ? parseFloat(discount) : undefined,
        taxAmount: tax ? parseFloat(tax) : undefined, totalAmount: parseFloat(total),
        validUntil: validUntil || undefined, notes: notes || undefined,
      })
      toast.success('¡Cotización enviada a los novios!')
      onResponded(data)
    } catch { toast.error('Error al enviar cotización') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fade-up max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-stone-100"><X className="w-5 h-5 text-stone-400" /></button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center"><DollarSign className="w-6 h-6 text-sage-600" /></div>
          <div><h2 className="font-display text-xl text-stone-800">Elaborar cotización</h2><p className="text-xs text-stone-400">#{quote.uuid.slice(0, 8)}</p></div>
        </div>

        {/* What the couple requested */}
        <div className="bg-stone-50 rounded-2xl p-4 mb-6">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Solicitud de los novios</p>
          <div className="flex flex-wrap gap-3 text-sm text-stone-600 mb-2">
            {quote.eventDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-stone-400" /> {new Date(quote.eventDate).toLocaleDateString('es-GT')}</span>}
            {quote.guestCount && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-stone-400" /> {quote.guestCount} invitados</span>}
          </div>
          {quote.customRequirements && <p className="text-sm text-stone-700 leading-relaxed">{quote.customRequirements}</p>}
          {quote.notes && <p className="text-sm text-stone-500 mt-2 italic">Nota: {quote.notes}</p>}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Tu cotización</p>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Subtotal (Q) *</label>
            <input type="number" value={subtotal} onChange={e => setSubtotal(e.target.value)} className="input-field" required min="0" step="0.01" placeholder="5000.00" autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Descuento (Q)</label>
              <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="input-field" min="0" step="0.01" placeholder="0.00" /></div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1.5">IVA / Impuesto (Q)</label>
              <input type="number" value={tax} onChange={e => setTax(e.target.value)} className="input-field" min="0" step="0.01" placeholder="0.00" /></div>
          </div>

          <div className="bg-sage-50 rounded-xl p-4 flex items-center justify-between">
            <span className="font-medium text-sage-700">Total a cobrar</span>
            <span className="font-display text-2xl font-bold text-sage-800">Q {parseFloat(total || '0').toLocaleString()}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Válida hasta</label>
            <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Notas / Detalle del servicio</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="input-field resize-none"
              placeholder="Describe lo que incluye tu cotización: paquetes, horas de servicio, entregables, condiciones de pago, etc." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading || !subtotal} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Enviar cotización</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
