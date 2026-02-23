import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Heart } from 'lucide-react'
interface Props { children: ReactNode }
interface State { hasError: boolean }
export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) { super(props); this.state = { hasError: false } }
    static getDerivedStateFromError(): State { return { hasError: true } }
    componentDidCatch(error: Error, info: ErrorInfo) { console.error('ErrorBoundary:', error, info.componentStack) }
    render() {
        if (this.state.hasError) return (<div className="min-h-screen flex items-center justify-center bg-ivory-50 p-4"><div className="text-center max-w-md"><div className="w-16 h-16 rounded-full bg-blush-50 flex items-center justify-center mx-auto mb-6"><Heart className="w-8 h-8 text-blush-400" /></div><h1 className="font-display text-2xl text-stone-800 mb-2">Algo salió <span className="italic text-blush-500">mal</span></h1><p className="text-stone-500 mb-6">Ocurrió un error inesperado.</p><button onClick={() => window.location.reload()} className="btn-primary">Recargar página</button></div></div>)
        return this.props.children
    }
}
