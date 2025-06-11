# 🎓 EduMaster - Plataforma de Gestión Académica

**EduMaster** es una plataforma web desarrollada con **Next.js**, **React**, **TypeScript** y **Firebase** que permite a estudiantes gestionar su información académica, inscribirse en cursos, visualizar su progreso y acceder a su perfil personalizado.

---

## 🚀 Tecnologías utilizadas

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Firebase** (Auth + Firestore)
- **Jest** + **React Testing Library** (Pruebas)
- **React Icons**
- **Modular CSS + Responsive Design**

---

## ✨ Características principales

### 🔐 Autenticación
- Registro e inicio de sesión con correo y contraseña.
- Autenticación con Google.
- Protección de rutas con hooks personalizados.

### 🧑‍🎓 Perfil del estudiante
- Información personal (correo, UID, fecha de registro).
- Métricas personalizadas: cursos activos, cursos finalizados, progreso global.

### 📚 Gestión de cursos
- Listado de cursos disponibles.
- Botón de inscripción con almacenamiento en subcolección de Firestore.
- Estado de cada curso: **activo / finalizado**.
- Posibilidad de actualizar progreso manualmente.
- Vista de detalle por curso con información extendida.

### ✅ Pruebas
- Pruebas unitarias con Jest + RTL.
- Mocking de Firebase y Next Router para testear componentes de forma aislada.

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/edumaster.git
cd edumaster
npm install
npm run dev
