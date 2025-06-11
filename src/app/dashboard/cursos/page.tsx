"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Curso {
    id: string;
    nombre: string;
    descripcion: string;
    creditos: number;
    docente: string;
}

export default function CursosPage() {
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

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

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setUserId(user.uid);
        });

        return () => unsubscribe();
    }, [isMounted]);

    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => setMensaje(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    const handleInscribirse = async (curso: Curso) => {
        if (!userId) return;

        const cursoRef = doc(db, "users", userId, "inscripciones", curso.id);
        await setDoc(cursoRef, {
            cursoId: curso.id,
            nombre: curso.nombre,
            descripcion: curso.descripcion,
            creditos: curso.creditos,
            docente: curso.docente,
            estado: "activo",
            progreso: 0,
            inscritoEn: serverTimestamp(),
        });

        setMensaje(`Te has inscrito en: ${curso.nombre}`);
    };

    if (!isMounted || loading) {
        return <p className="text-center mt-10">Cargando cursos...</p>;
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">📚 Cursos disponibles</h1>
                <a
                    href="/dashboard/miscursos"
                    className="mt-3 sm:mt-0 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base font-medium"
                >
                    Ver mis cursos
                </a>
            </div>
            {mensaje && (
                <div className="bg-green-100 text-green-700 border border-green-300 px-4 py-3 rounded mb-6">
                    {mensaje}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map((curso) => (
                    <div
                        key={curso.id}
                        className="bg-white p-6 rounded-xl shadow flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3">{curso.nombre}</h2>
                            <p className="text-gray-600 text-sm sm:text-base mb-2">{curso.descripcion}</p>
                            <p className="text-sm sm:text-base text-gray-500">👨‍🏫 {curso.docente}</p>
                            <p className="text-sm sm:text-base text-gray-500">🎓 Créditos: {curso.creditos}</p>
                        </div>
                        <button
                            className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base font-semibold"
                            onClick={() => handleInscribirse(curso)}
                        >
                            Inscribirme
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}