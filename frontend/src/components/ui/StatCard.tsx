import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
    icon: LucideIcon
    label: string
    value: string
    color: 'sage' | 'blush' | 'champagne'
}

const colors: Record<string, string> = {
    sage: 'bg-sage-50 text-sage-600',
    blush: 'bg-blush-50 text-blush-600',
    champagne: 'bg-champagne-50 text-champagne-700',
}

export default function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
    return (
        <div className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-medium text-stone-800">{value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{label}</p>
        </div>
    )
}
