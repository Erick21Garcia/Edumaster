import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "@/components/AuthForm";

// ✅ Mock useRouter
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// ✅ Mock Firebase con retorno correcto para onAuthStateChanged
jest.mock("firebase/auth", () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(),
    onAuthStateChanged: jest.fn(() => () => { }), // <- esta es la clave
}));

// ✅ Mock archivo de configuración de Firebase
jest.mock("@/lib/firebase", () => ({
    auth: {},
}));

describe("AuthForm", () => {
    it("muestra título de inicio de sesión por defecto", () => {
        render(<AuthForm />);
        expect(screen.getByText(/Iniciar sesión en EduMaster/i)).toBeInTheDocument();
    });

    it("cambia a modo registro", () => {
        render(<AuthForm />);
        const switchBtn = screen.getByText(/Regístrate/i);
        fireEvent.click(switchBtn);
        expect(screen.getByText(/Crear cuenta/i)).toBeInTheDocument();
    });
});
