"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/auth");
            } else {
                setUserEmail(user.email ?? "");
            }
        });

        return () => unsub();
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-16 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Panel de usuario</h1>
            <p className="text-lg text-gray-600 mb-8">
                ¡Bienvenido, <span className="text-blue-600 font-semibold">{userEmail}</span>!
            </p>
            <button
                onClick={async () => {
                    await auth.signOut();
                    router.push("/auth");
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition"
            >
                Cerrar sesión
            </button>
        </div>

    );
}