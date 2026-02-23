import { useState, useEffect, type FormEvent } from 'react'
import { DollarSign, Plus, Trash2, ChevronDown, ChevronRight, PieChart } from 'lucide-react'
import { budgetService } from '../services/budget'
import { weddingService } from '../services/weddings'
import type { BudgetSummaryResponse, CategoryResponse } from '../types/budget'
import type { Wedding } from '../types'
import toast from 'react-hot-toast'

export default function BudgetPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [summary, setSummary] = useState<BudgetSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddCat, setShowAddCat] = useState(false)
  const [showAddItem, setShowAddItem] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  useEffect(() => {
    weddingService.getMyWeddings().then(({ data }) => {
      if (data.content.length > 0) { const w = data.content[0]; setWedding(w); loadSummary(w) }
      else setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function loadSummary(w: Wedding) {
    budgetService.summary(w.id, w.totalBudget || undefined)
      .then(({ data }) => { setSummary(data); setExpanded(new Set(data.categories.map(c => c.id))) })
      .catch(() => {}).finally(() => setLoading(false))
  }

  function toggle(id: number) { setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }) }

  function handleDeleteCat(catId: number) {
    if (!wedding) return
    budgetService.deleteCategory(wedding.id, catId).then(() => { toast.success('Categoría eliminada'); loadSummary(wedding) }).catch(() => toast.error('Error'))
  }

  function handleDeleteItem(itemId: number) {
    if (!wedding) return
    budgetService.deleteItem(wedding.id, itemId).then(() => { toast.success('Item eliminado'); loadSummary(wedding) }).catch(() => toast.error('Error'))
  }

  const pctUsed = summary && summary.totalBudget > 0 ? Math.min(100, Math.round((summary.totalActual || summary.totalEstimated) / summary.totalBudget * 100)) : 0

  if (!wedding && !loading) return <div className="text-center py-20"><p className="text-stone-500">Crea una boda primero para gestionar tu presupuesto.</p></div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div><h2 className="font-display text-2xl text-stone-800">Mi <span className="italic text-sage-600">Presupuesto</span></h2><p className="text-stone-500 text-sm mt-1">{wedding?.title}</p></div>
        <button onClick={() => setShowAddCat(true)} className="btn-primary"><Plus className="w-4 h-4" /> Nueva categoría</button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-5"><p className="text-xs text-stone-400 mb-1">Presupuesto total</p><p className="font-display text-2xl text-stone-800">Q{(summary.totalBudget || 0).toLocaleString()}</p></div>
          <div className="card p-5"><p className="text-xs text-stone-400 mb-1">Estimado</p><p className="font-display text-2xl text-champagne-700">Q{summary.totalEstimated.toLocaleString()}</p></div>
          <div className="card p-5"><p className="text-xs text-stone-400 mb-1">Gastado real</p><p className="font-display text-2xl text-blush-600">Q{summary.totalActual.toLocaleString()}</p></div>
          <div className="card p-5"><p className="text-xs text-stone-400 mb-1">Restante</p><p className={`font-display text-2xl ${summary.remaining >= 0 ? 'text-sage-600' : 'text-blush-600'}`}>Q{summary.remaining.toLocaleString()}</p></div>
        </div>
      )}

      {summary && summary.totalBudget > 0 && (
        <div className="card p-5 mb-8">
          <div className="flex justify-between text-sm mb-2"><span className="text-stone-500">Uso del presupuesto</span><span className="font-medium text-stone-700">{pctUsed}%</span></div>
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${pctUsed > 90 ? 'bg-blush-500' : pctUsed > 70 ? 'bg-champagne-500' : 'bg-sage-500'}`} style={{ width: `${pctUsed}%` }} /></div>
        </div>
      )}

      {loading ? <div className="card p-12 flex justify-center"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>
      : summary && summary.categories.length > 0 ? (
        <div className="space-y-3">
          {summary.categories.map(cat => (
            <div key={cat.id} className="card overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-stone-50 transition-colors" onClick={() => toggle(cat.id)}>
                {expanded.has(cat.id) ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800">{cat.name}</p>
                  <p className="text-xs text-stone-400">Asignado: Q{cat.allocatedAmount.toLocaleString()}</p>
                </div>
                <div className="text-right mr-2">
                  <p className="text-sm font-medium text-stone-700">Q{cat.totalEstimated.toLocaleString()}</p>
                  {cat.totalActual > 0 && <p className="text-xs text-blush-500">Real: Q{cat.totalActual.toLocaleString()}</p>}
                </div>
                <button onClick={e => { e.stopPropagation(); setShowAddItem(cat.id) }} className="p-1.5 rounded-lg hover:bg-sage-50 text-sage-600"><Plus className="w-4 h-4" /></button>
                <button onClick={e => { e.stopPropagation(); handleDeleteCat(cat.id) }} className="p-1.5 rounded-lg hover:bg-blush-50 text-stone-400 hover:text-blush-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              {expanded.has(cat.id) && cat.items.length > 0 && (
                <div className="border-t border-stone-100">
                  {cat.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-5 py-3 pl-12 hover:bg-stone-50/50 border-b border-stone-50 last:border-0">
                      <div className={`w-2 h-2 rounded-full ${item.paid ? 'bg-sage-500' : 'bg-stone-300'}`} />
                      <div className="flex-1 min-w-0"><p className="text-sm text-stone-700">{item.name}</p>{item.notes && <p className="text-xs text-stone-400">{item.notes}</p>}</div>
                      <div className="text-right">
                        <p className="text-sm text-stone-600">Q{item.estimatedCost.toLocaleString()}</p>
                        {item.actualCost !== null && <p className="text-xs text-blush-500">Real: Q{item.actualCost.toLocaleString()}</p>}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${item.paid ? 'bg-sage-100 text-sage-700' : 'bg-stone-100 text-stone-500'}`}>{item.paid ? 'Pagado' : 'Pendiente'}</span>
                      <button onClick={() => handleDeleteItem(item.id)} className="text-stone-400 hover:text-blush-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center"><PieChart className="w-12 h-12 text-stone-300 mx-auto mb-4" /><p className="text-stone-500 mb-4">No hay categorías de presupuesto</p><button onClick={() => setShowAddCat(true)} className="btn-primary"><Plus className="w-4 h-4" /> Crear primera categoría</button></div>
      )}

      {showAddCat && wedding && <AddCategoryModal weddingId={wedding.id} onClose={() => setShowAddCat(false)} onDone={() => { setShowAddCat(false); loadSummary(wedding) }} />}
      {showAddItem !== null && wedding && <AddItemModal weddingId={wedding.id} categoryId={showAddItem} onClose={() => setShowAddItem(null)} onDone={() => { setShowAddItem(null); loadSummary(wedding) }} />}
    </div>
  )
}

function AddCategoryModal({ weddingId, onClose, onDone }: { weddingId: number; onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState(''); const [amount, setAmount] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try { await budgetService.addCategory(weddingId, { name, allocatedAmount: parseFloat(amount) || 0 }); toast.success('Categoría creada'); onDone() }
    catch { toast.error('Error') } finally { setLoading(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-fade-up">
        <h3 className="font-display text-xl text-stone-800 mb-5">Nueva categoría</h3>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label><input value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Ej: Fotografía" required autoFocus /></div>
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Monto asignado (Q)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" placeholder="5000" min="0" /></div>
          <div className="flex gap-3"><button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button><button type="submit" disabled={loading || !name} className="btn-primary flex-1 disabled:opacity-50">{loading ? 'Creando...' : 'Crear'}</button></div>
        </form>
      </div>
    </div>
  )
}

function AddItemModal({ weddingId, categoryId, onClose, onDone }: { weddingId: number; categoryId: number; onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState(''); const [est, setEst] = useState(''); const [actual, setActual] = useState(''); const [notes, setNotes] = useState(''); const [paid, setPaid] = useState(false); const [loading, setLoading] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try { await budgetService.addItem(weddingId, categoryId, { name, estimatedCost: parseFloat(est) || 0, actualCost: actual ? parseFloat(actual) : undefined, paid, notes: notes || undefined }); toast.success('Item agregado'); onDone() }
    catch { toast.error('Error') } finally { setLoading(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-fade-up">
        <h3 className="font-display text-xl text-stone-800 mb-5">Agregar gasto</h3>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label><input value={name} onChange={e => setName(e.target.value)} className="input-field" required autoFocus /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-stone-700 mb-1">Estimado (Q)</label><input type="number" value={est} onChange={e => setEst(e.target.value)} className="input-field" min="0" /></div><div><label className="block text-sm font-medium text-stone-700 mb-1">Costo real (Q)</label><input type="number" value={actual} onChange={e => setActual(e.target.value)} className="input-field" min="0" /></div></div>
          <div><label className="block text-sm font-medium text-stone-700 mb-1">Notas</label><input value={notes} onChange={e => setNotes(e.target.value)} className="input-field" /></div>
          <label className="flex items-center gap-2 text-sm text-stone-600"><input type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)} className="rounded" /> Ya está pagado</label>
          <div className="flex gap-3"><button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button><button type="submit" disabled={loading || !name} className="btn-primary flex-1 disabled:opacity-50">{loading ? 'Agregando...' : 'Agregar'}</button></div>
        </form>
      </div>
    </div>
  )
}
