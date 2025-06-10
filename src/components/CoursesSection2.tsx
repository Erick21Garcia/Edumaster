"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

interface Curso {
    id: string;
    nombre: string;
    descripcion: string;
    creditos: number;
    docente: string;
}

export default function CursosPublicosPage() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarCursos = async () => {
            try {
                const snapshot = await getDocs(collection(db, "cursos"));
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Curso[];

                setCursos(data);
            } catch (err) {
                console.error("Error cargando cursos", err);
            } finally {
                setLoading(false);
            }
        };

        cargarCursos();
    }, []);

    return (
        <main className="max-w-6xl mx-auto py-10 px-4 text-black">
            <section className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-blue-700 mb-2">🎓 Catálogo de Cursos</h1>
                <p className="text-gray-600 text-lg">
                    Explora todos los cursos disponibles en EduMaster. ¡Inicia sesión para inscribirte!
                </p>
            </section>

            {loading ? (
                <p className="text-center">Cargando cursos...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cursos.map((curso) => (
                        <div key={curso.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold text-blue-700 mb-2">{curso.nombre}</h2>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-3">{curso.descripcion}</p>
                            <p className="text-sm text-gray-500">👨‍🏫 {curso.docente}</p>
                            <p className="text-sm text-gray-500">🎓 Créditos: {curso.creditos}</p>
                            <Link
                                href="/auth"
                                className="block mt-4 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                            >
                                Iniciar sesión para ver más
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
