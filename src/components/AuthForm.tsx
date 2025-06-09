"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push("/dashboard");
            }
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (error) {
            setEmail("");
            setPassword("");

            const timer = setTimeout(() => {
                setError("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (isRegister) {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                const user = res.user;

                try {
                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        email: user.email,
                        createdAt: serverTimestamp(),
                    });
                } catch (firestoreErr) {
                    console.error("Error al guardar en Firestore:", firestoreErr);
                    setError("Registro incompleto. Intenta de nuevo.");
                    return;
                }

            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }

        } catch (err: any) {
            console.error("Error en autenticación:", err);

            switch (err.code) {
                case "auth/email-already-in-use":
                    setError("El correo ya está registrado.");
                    break;
                case "auth/invalid-email":
                    setError("El correo no es válido.");
                    break;
                case "auth/weak-password":
                    setError("La contraseña debe tener al menos 6 caracteres.");
                    break;
                case "auth/wrong-password":
                case "auth/user-not-found":
                    setError("Correo o contraseña incorrectos.");
                    break;
                case "auth/too-many-requests":
                    setError("Demasiados intentos. Intenta más tarde.");
                    break;
                default:
                    setError("Ocurrió un error. Intenta de nuevo.");
            }
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error("Error al iniciar sesión con Google", err);
            setError("No se pudo iniciar sesión con Google.");
        }
    };

    return (
        <section className="flex h-full items-center justify-center px-4 bg-white">
            <div className="w-full max-w-md bg-white p-7.5 rounded-xl text-black">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    {isRegister ? "Crear cuenta" : "Iniciar sesión en EduMaster"}
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        {isRegister ? "Registrarse" : "Ingresar"}
                    </button>

                    <button
                        type="button"
                        className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
                        onClick={loginWithGoogle}
                    >
                        <FcGoogle className="text-xl bg-white rounded-full" />
                        Iniciar sesión con Google
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        {isRegister ? "Inicia sesión" : "Regístrate"}
                    </button>
                </p>
            </div>
        </section>
    );
}
