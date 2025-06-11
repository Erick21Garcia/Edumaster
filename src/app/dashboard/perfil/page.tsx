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
        <section className="max-w-md mx-auto bg-white p-6 rounded-xl shadow text-black">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">👤 Tu perfil</h1>
            <ul className="space-y-4 text-gray-700 text-sm sm:text-base">
                <li>
                    <strong>Correo:</strong> {userData.email}
                </li>
                <li>
                    <strong>UID:</strong> {userData.uid}
                </li>
                <li>
                    <strong>Fecha de registro:</strong>{" "}
                    {userData.createdAt?.seconds
                        ? new Date(userData.createdAt.seconds * 1000).toLocaleString()
                        : "No disponible"}
                </li>
            </ul>
        </section>
    );

}
