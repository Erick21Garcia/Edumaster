"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

    useAuthGuard();

    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    setUserData({ email: user.email, uid: user.uid });
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <p className="text-center mt-10">Cargando datos...</p>;

    return (
        <main className="min-h-screen bg-gray-100 p-8 text-black">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">
                        👋 Bienvenido, {userData?.email?.split("@")[0] || "usuario"}
                    </h1>
                </header>

                <section className="bg-white shadow-md rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Tu perfil</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li>
                            <strong>Correo:</strong> {userData.email}
                        </li>
                        <li>
                            <strong>UID:</strong> {userData.uid}
                        </li>
                        <li>
                            <strong>Registrado el:</strong>{" "}
                            {userData.createdAt?.seconds
                                ? new Date(userData.createdAt.seconds * 1000).toLocaleString()
                                : "Sin fecha"}
                        </li>
                    </ul>
                </section>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-md text-center mt-4">
                        <p className="text-4xl font-bold text-blue-600">3</p>
                        <p className="text-gray-600 mt-2">Cursos activos</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md text-center mt-4">
                        <p className="text-4xl font-bold text-green-600">38</p>
                        <p className="text-gray-600 mt-2">Notas registradas</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md text-center mt-4">
                        <p className="text-4xl font-bold text-purple-600">80%</p>
                        <p className="text-gray-600 mt-2">Progreso general</p>
                    </div>
                </section>
            </div>
        </main>
    );
}
