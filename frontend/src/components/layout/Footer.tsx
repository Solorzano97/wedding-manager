import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-400 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Heart className="w-6 h-6 text-blush-400" />
                            <span className="font-display text-2xl text-white">Celebra</span>
                        </div>
                        <p className="text-sm leading-relaxed">La plataforma de gestión de bodas más completa de Guatemala.</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-white mb-4">Para Novios</h4>
                        <nav className="space-y-2 text-sm">
                            <a href="#" className="block hover:text-white transition-colors">Planificador</a>
                            <a href="#" className="block hover:text-white transition-colors">Invitaciones</a>
                            <a href="#" className="block hover:text-white transition-colors">Sitio web</a>
                        </nav>
                    </div>
                    <div>
                        <h4 className="font-medium text-white mb-4">Para Proveedores</h4>
                        <nav className="space-y-2 text-sm">
                            <a href="#" className="block hover:text-white transition-colors">Registrarse</a>
                            <a href="#" className="block hover:text-white transition-colors">Planes</a>
                            <a href="#" className="block hover:text-white transition-colors">Recursos</a>
                        </nav>
                    </div>
                    <div>
                        <h4 className="font-medium text-white mb-4">Compañía</h4>
                        <nav className="space-y-2 text-sm">
                            <a href="#" className="block hover:text-white transition-colors">Acerca de</a>
                            <a href="#" className="block hover:text-white transition-colors">Contacto</a>
                            <a href="#" className="block hover:text-white transition-colors">Privacidad</a>
                        </nav>
                    </div>
                </div>
                <div className="border-t border-stone-800 mt-12 pt-8 text-center text-sm">
                    <p>© 2026 Celebra. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
