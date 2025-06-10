"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface CursoDetalle {
    cursoId: string;
    nombre: string;
    descripcion?: string;
    docente?: string;
    creditos?: number;
    progreso?: number;
    estado?: string;
    inscritoEn?: {
        seconds: number;
        nanoseconds: number;
    };
}

export default function CursoDetallePage() {

    useAuthGuard();

    const params = useParams();
    const cursoId = params?.id as string;
    const [curso, setCurso] = useState<CursoDetalle | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserId(user.uid);

                    const cursoRef = doc(db, "users", user.uid, "inscripciones", cursoId);
                    const snap = await getDoc(cursoRef);

                    if (snap.exists()) {
                        setCurso(snap.data() as CursoDetalle);
                    }
                }
                setLoading(false);
            });

            return () => unsubscribe();
        };

        if (cursoId) cargarDatos();
    }, [cursoId]);

    const actualizarProgreso = async (nuevoProgreso: number) => {
        if (!userId || !cursoId) return;

        const ref = doc(db, "users", userId, "inscripciones", cursoId);
        await setDoc(ref, { progreso: nuevoProgreso }, { merge: true });

        setCurso((prev) =>
            prev ? { ...prev, progreso: nuevoProgreso } : prev
        );
    };

    const handleFinalizar = async () => {
        if (!userId) return;

        const cursoRef = doc(db, "users", userId, "inscripciones", cursoId);
        await updateDoc(cursoRef, {
            estado: "finalizado",
        });

        setCurso((prev) => prev ? { ...prev, estado: "finalizado" } : prev);
    };


    if (loading) return <p className="text-center mt-10">Cargando curso...</p>;

    if (!curso) return <p className="text-center mt-10">No se encontró el curso.</p>;

    return (
        <section className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow text-black">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">{curso.nombre}</h1>
            <p className="text-gray-700 mb-2">{curso.descripcion}</p>
            <p className="text-gray-600 mb-2">👨‍🏫 Docente: {curso.docente}</p>
            <p className="text-gray-600 mb-2">🎓 Créditos: {curso.creditos}</p>
            <p className="text-gray-600 mb-2">
                📆 Inscrito el:{" "}
                {curso.inscritoEn?.seconds
                    ? new Date(curso.inscritoEn.seconds * 1000).toLocaleDateString()
                    : "Sin fecha"}
            </p>
            <p className="text-gray-600 mb-2">📌 Estado: {curso.estado || "activo"}</p>
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    📊 Actualizar progreso:
                </label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={curso.progreso || 0}
                    onChange={(e) => actualizarProgreso(Number(e.target.value))}
                    className="w-full"
                />
                <p className="mt-2 text-sm text-gray-600">
                    Progreso: {curso.progreso || 0}%
                </p>
                {curso.estado !== "finalizado" && (
                    <button
                        onClick={handleFinalizar}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Marcar como finalizado
                    </button>
                )}
            </div>

        </section>

    );
}
