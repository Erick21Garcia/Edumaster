"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
    uid: string;
    email: string;
    createdAt?: {
        seconds: number;
        nanoseconds: number;
    };
}

export default function PerfilPage() {

    useAuthGuard();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUserData(docSnap.data() as UserData);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Cargando perfil...</p>;
    }

    if (!userData) {
        return <p className="text-center mt-10">No se pudo cargar tu perfil.</p>;
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">👤 Tu perfil</h1>
                </header>
                <section className="bg-white shadow-md rounded-xl p-6">
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
            </div>
        </section>

    );

}
