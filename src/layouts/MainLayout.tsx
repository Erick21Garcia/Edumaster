import { ReactNode } from "react";
import Link from 'next/link';

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-md">
                <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-red-600">EduMaster</h1>
                    <ul className="flex space-x-6 text-gray-700">
                        <li><Link href="/" className="hover:text-red-600">Inicio</Link></li>
                        <li><Link href="/curso" className="hover:text-red-600">Cursos</Link></li>
                        <li><Link href="/auth" className="hover:text-red-600">Iniciar sesión</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow">{children}</main>

            <footer className="bg-gray-100 p-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} EduMaster. Todos los derechos reservados.
            </footer>
        </div>
    );
}
