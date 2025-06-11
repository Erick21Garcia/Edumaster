"use client";
import Link from "next/link";
import { FaUser, FaBook, FaChartPie } from "react-icons/fa";
import LogoutButton from "@/components/LogoutButton";
import "../globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen bg-gray-100 text-black">

            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-white shadow p-2 rounded"
                aria-label="Toggle menu"
            >
                ☰
            </button>

            <aside
                className={`
                    fixed top-0 left-0 bg-white shadow-lg p-6 space-y-6
                    w-64 h-screen overflow-y-auto
                    transform
                    transition-transform duration-300 ease-in-out
                    md:translate-x-0
                    ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
                    md:static md:block
                    z-40
                `}
            >
                <h2 className="text-xl font-bold mb-4 text-center">EduMaster</h2>

                <nav className="space-y-4">
                    <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600">
                        <FaChartPie /> Panel
                    </Link>
                    <Link href="/dashboard/cursos" className="flex items-center gap-2 hover:text-blue-600">
                        <FaBook /> Cursos
                    </Link>
                    <Link href="/dashboard/perfil" className="flex items-center gap-2 hover:text-blue-600">
                        <FaUser /> Perfil
                    </Link>
                </nav>
                <LogoutButton />
            </aside>

            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <main className="flex-1 p-4 md:ml-20 pr-4 md:pr-8 max-w-full overflow-x-auto">
                {children}
            </main>

        </div>
    );
}
