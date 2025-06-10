"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Link from "next/link";

interface Inscripcion {
    cursoId: string;
    nombre?: string;
    descripcion?: string;
    creditos?: number;
    docente?: string;
    inscritoEn?: {
        seconds: number;
        nanoseconds: number;
    };
    estado?: string;
    progreso?: number;
}

export default function MisCursosPage() {

    useAuthGuard();

    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const obtenerInscripciones = async () => {
            if (!userId) return;

            const ref = collection(db, "users", userId, "inscripciones");
            const snapshot = await getDocs(ref);

            const data = snapshot.docs.map((doc) => ({
                ...(doc.data() as Inscripcion),
            }));

            setInscripciones(data);
            setLoading(false);
        };

        obtenerInscripciones();
    }, [userId]);

    const cancelarInscripcion = async (cursoId: string) => {
        if (!userId) return;
        await deleteDoc(doc(db, "users", userId, "inscripciones", cursoId));
        setInscripciones((prev) => prev.filter((c) => c.cursoId !== cursoId));
    };

    if (loading) return <p className="text-center mt-10">Cargando tus cursos...</p>;

    if (inscripciones.length === 0) {
        return <p className="text-center mt-10">Aún no estás inscrito en ningún curso.</p>;
    }

    return (
        <section>
            <h1 className="text-2xl font-bold mb-6">🎓 Mis cursos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inscripciones.map((curso) => (
                    <div key={curso.cursoId} className={`p-6 rounded-xl shadow ${curso.estado === "finalizado"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-white text-black"
                        }`}>
                        <h2 className="text-lg font-semibold text-blue-700 mb-2">
                            {curso.nombre || "Sin nombre"}
                        </h2>
                        <p className="text-gray-600 text-sm mb-1">
                            {curso.descripcion || "Sin descripción"}
                        </p>
                        <p className="text-gray-500 text-sm">👨‍🏫 {curso.docente || "No asignado"}</p>
                        <p className="text-gray-500 text-sm">
                            🎓 Créditos: {curso.creditos ?? "N/A"}
                        </p>
                        <p className="text-sm">
                            Estado:{" "}
                            <span
                                className={`font-semibold ${curso.estado === "finalizado" ? "text-green-700" : "text-gray-700"
                                    }`}
                            >
                                {curso.estado || "activo"}
                            </span>
                        </p>
                        <p className="text-gray-500 text-sm">
                            Progreso: <strong>{curso.progreso ?? 0}%</strong>
                        </p>
                        <p className="text-gray-500 text-sm">
                            Inscrito el:{" "}
                            <strong>
                                {curso.inscritoEn?.seconds
                                    ? new Date(curso.inscritoEn.seconds * 1000).toLocaleDateString()
                                    : "Desconocido"}
                            </strong>
                        </p>

                        <div className="mt-4 flex flex-col gap-2">
                            <Link
                                href={`/dashboard/cursos/${curso.cursoId}`}
                                className="text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                            >
                                Ver curso
                            </Link>
                            <button
                                onClick={() => cancelarInscripcion(curso.cursoId)}
                                className="text-center bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                            >
                                Cancelar inscripción
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
