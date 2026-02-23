import { Link } from 'react-router-dom'
import { MapPin, Star, Heart, BadgeCheck, Sparkles } from 'lucide-react'
import type { VendorProfile } from '../../types'
const gradients = ['from-sage-400 to-sage-600','from-blush-400 to-blush-600','from-champagne-500 to-champagne-700','from-sage-500 to-sage-700']
export default function VendorCard({ vendor }: { vendor: VendorProfile }) {
    const initials = vendor.businessName.split(' ').map(w => w[0]).join('').slice(0, 2)
    const gradient = gradients[vendor.id % gradients.length]
    return (
        <article className="card group overflow-hidden hover:-translate-y-1 transition-all duration-300">
            <div className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden`}>
                <div className="absolute inset-0 pattern-floral opacity-20" />
                {vendor.featured && (<div className="absolute top-3 left-3 flex items-center gap-1.5 bg-champagne-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"><Sparkles className="w-3 h-3" /> Destacado</div>)}
                <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all"><Heart className="w-4 h-4 text-white" /></button>
                <div className="absolute -bottom-6 left-5"><div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center border-2 border-white"><span className="font-display text-xl font-bold text-sage-700">{initials}</span></div></div>
            </div>
            <div className="pt-9 px-5 pb-5">
                <div className="flex items-center gap-1.5"><h3 className="font-display text-lg font-medium text-stone-800 truncate">{vendor.businessName}</h3>{vendor.verified && <BadgeCheck className="w-5 h-5 text-sage-500 flex-shrink-0" />}</div>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-stone-400"><MapPin className="w-3.5 h-3.5" /><span>{vendor.city}, {vendor.state}</span></div>
                <p className="text-sm text-stone-500 mt-3 line-clamp-2 leading-relaxed">{vendor.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{vendor.serviceCategories.map(cat => (<span key={cat} className="px-2.5 py-0.5 rounded-full bg-sage-50 text-sage-700 text-xs font-medium">{cat}</span>))}</div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-champagne-400 text-champagne-400" /><span className="font-bold text-stone-800">{vendor.avgRating}</span><span className="text-xs text-stone-400">({vendor.totalReviews})</span></div>
                    <Link to={`/vendors/${vendor.slug}`} className="text-sm font-semibold text-sage-600 hover:text-sage-700 transition-colors">Ver perfil →</Link>
                </div>
            </div>
        </article>
    )
}
