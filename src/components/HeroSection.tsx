export default function HeroSection() {
    return (
        <section className="bg-gray-50 py-24 px-6 text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Aprende a tu ritmo con <span className="text-red-600">EduMaster</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                    Cursos prácticos, instructores expertos y una experiencia diseñada para ti.
                </p>
                <a
                    href="#"
                    className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition"
                >
                    Ver cursos
                </a>
            </div>
        </section>
    );
}
