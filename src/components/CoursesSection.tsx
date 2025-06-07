const courses = [
    {
        title: "Introducción a JavaScript",
        description: "Aprende los fundamentos del lenguaje más popular del frontend.",
    },
    {
        title: "Laravel desde cero",
        description: "Construye APIs RESTful con el framework PHP más usado.",
    },
    {
        title: "React y Next.js",
        description: "Domina el desarrollo moderno con React y SSR.",
    },
];

export default function CoursesSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                <h3 className="text-2xl font-semibold text-center mb-12 text-gray-800">
                    Cursos destacados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {courses.map((course, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                        >
                            <h4 className="text-lg font-bold text-gray-800 mb-2">
                                {course.title}
                            </h4>
                            <p className="text-gray-600 text-sm">{course.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
