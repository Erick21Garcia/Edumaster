"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/auth");
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 mt-6 cursor-pointer"
        >
            <FaSignOutAlt /> Cerrar sesión
        </button>
    );
}
