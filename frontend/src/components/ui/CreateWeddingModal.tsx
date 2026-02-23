import { useState, type FormEvent } from 'react'
import { Heart } from 'lucide-react'
import { weddingService } from '../../services/weddings'
import type { Wedding } from '../../types'
import toast from 'react-hot-toast'
export default function CreateWeddingModal({ onClose, onCreated }: { onClose: () => void; onCreated: (w: Wedding) => void }) {
    const [title, setTitle] = useState(''); const [date, setDate] = useState(''); const [venue, setVenue] = useState(''); const [budget, setBudget] = useState(''); const [loading, setLoading] = useState(false)
    async function handleCreate(e: FormEvent) {
        e.preventDefault(); setLoading(true)
        try { const { data } = await weddingService.create({ title, weddingDate: date || undefined, venueName: venue || undefined, totalBudget: budget ? parseFloat(budget) : undefined }); toast.success('¡Boda creada!'); onCreated(data) }
        catch (err: any) { toast.error(err.response?.data?.message || 'Error al crear la boda') }
        finally { setLoading(false) }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fade-up">
                <div className="text-center mb-6"><div className="w-14 h-14 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-4"><Heart className="w-7 h-7 text-sage-500" /></div><h2 className="font-display text-2xl text-stone-800">Crea tu <span className="italic text-sage-600">boda</span></h2></div>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Nombre de la boda *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="Ej: Boda Juan & María" required autoFocus /></div>
                    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-stone-700 mb-1.5">Fecha</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" /></div><div><label className="block text-sm font-medium text-stone-700 mb-1.5">Presupuesto (Q)</label><input type="number" value={budget} onChange={e => setBudget(e.target.value)} className="input-field" placeholder="50,000" min="0" /></div></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Lugar</label><input type="text" value={venue} onChange={e => setVenue(e.target.value)} className="input-field" placeholder="Ej: Antigua Guatemala" /></div>
                    <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button><button type="submit" disabled={loading || !title} className="btn-primary flex-1 disabled:opacity-50">{loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Crear boda'}</button></div>
                </form>
            </div>
        </div>
    )
}
