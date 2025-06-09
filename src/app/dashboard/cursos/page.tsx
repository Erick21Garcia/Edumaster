"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Curso {
    id: string;
    nombre: string;
    descripcion: string;
    creditos: number;
    docente: string;
}

export default function CursosPage() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "cursos"));
                const cursosData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Curso[];

                setCursos(cursosData);
            } catch (error) {
                console.error("Error al cargar cursos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Cargando cursos...</p>;
    }

    return (
        <section>
            <h1 className="text-2xl font-bold mb-6">📚 Cursos disponibles</h1>

            {loading ? (
                <p>Cargando cursos...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cursos.map((curso) => (
                        <div key={curso.id} className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-lg font-semibold text-blue-700 mb-2">{curso.nombre}</h2>
                            <p className="text-gray-600 text-sm mb-2">{curso.descripcion}</p>
                            <p className="text-sm text-gray-500">👨‍🏫 {curso.docente}</p>
                            <p className="text-sm text-gray-500">🎓 Créditos: {curso.creditos}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
