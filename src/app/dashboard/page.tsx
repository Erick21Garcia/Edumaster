"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";

interface UserData {
    uid: string;
    email: string;
    createdAt?: {
        seconds: number;
        nanoseconds: number;
    };
}

export default function DashboardPage() {

    useAuthGuard();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [progresoGlobal, setProgresoGlobal] = useState(0);
    const [finalizados, setFinalizados] = useState(0);
    const [activos, setActivos] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data() as UserData);
                } else {
                    setUserData({ email: user.email || "", uid: user.uid });
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        const obtenerInscripciones = async () => {
            if (!userData?.uid) return;

            const ref = collection(db, "users", userData.uid, "inscripciones");
            const snapshot = await getDocs(ref);

            const data = snapshot.docs.map((doc) => doc.data());

            const total = data.length;
            const completados = data.filter((c) => c.estado === "finalizado").length;
            const activos = total - completados;
            const progreso = total
                ? Math.round(data.reduce((sum, c) => sum + (c.progreso || 0), 0) / total)
                : 0;

            setFinalizados(completados);
            setActivos(activos);
            setProgresoGlobal(progreso);
        };

        obtenerInscripciones();
    }, [userData]);

    if (loading) return <p className="text-center mt-10">Cargando datos...</p>;

    if (!userData) return <p className="text-center mt-10">No se pudo cargar tu perfil</p>;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-md text-center mt-4">
                        <p className="text-4xl font-bold text-blue-600">{activos}</p>
                        <p className="text-gray-600 mt-2">Cursos activos</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md text-center mt-4">
                        <p className="text-4xl font-bold text-green-600">{finalizados}</p>
                        <p className="text-gray-600 mt-2">Cursos finalizados</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md text-center mt-4">
                        <p className="text-4xl font-bold text-purple-600">{progresoGlobal}%</p>
                        <p className="text-gray-600 mt-2">Progreso general</p>
                    </div>
                </section>
            </div>
        </section>
    );
}
