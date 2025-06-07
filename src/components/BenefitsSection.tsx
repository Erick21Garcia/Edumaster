import { BookOpen, Users, Star } from "lucide-react";

const benefits = [
    { icon: BookOpen, title: "Contenido actualizado" },
    { icon: Users, title: "Comunidad activa" },
    { icon: Star, title: "Certificaciones reconocidas" },
];

export default function BenefitsSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <h3 className="text-2xl font-semibold text-center mb-12 text-gray-800">
                    ¿Por qué elegir EduMaster?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {benefits.map(({ icon: Icon, title }) => (
                        <div
                            key={title}
                            className="flex flex-col items-center bg-gray-50 p-6 rounded-xl shadow hover:scale-105 transition"
                        >
                            <Icon className="w-12 h-12 text-blue-600 mb-4" />
                            <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
