import type { LucideIcon } from 'lucide-react'

interface SidebarLinkProps {
    icon: LucideIcon
    label: string
    active?: boolean
    badge?: number
}

export default function SidebarLink({ icon: Icon, label, active, badge }: SidebarLinkProps) {
    return (
        <button className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-all ${active ? 'bg-sage-50 text-sage-700 font-medium' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
            }`}>
            <Icon className="w-5 h-5" />
            <span className="flex-1 text-left">{label}</span>
            {badge && (
                <span className="w-5 h-5 rounded-full bg-blush-500 text-white text-xs flex items-center justify-center font-bold">{badge}</span>
            )}
        </button>
    )
}
