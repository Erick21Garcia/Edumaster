import Link from "next/link";
import { FaUser, FaBook, FaChartPie } from "react-icons/fa";
import LogoutButton from "@/components/LogoutButton";
import "../globals.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex min-h-screen bg-gray-100 text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
                <h2 className="text-xl font-bold mb-4">EduMaster</h2>
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

            {/* Main content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
