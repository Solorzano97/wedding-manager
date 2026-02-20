export function daysUntil(dateStr: string): string {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? `${diff}` : diff === 0 ? 'Hoy' : 'Pasada'
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })
}
