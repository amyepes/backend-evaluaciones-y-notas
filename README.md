# 📇 Contact List App

Aplicación **Full Stack** para la gestión de contactos, desarrollada con un stack moderno que incluye **NestJS**, **React + Vite**, **PostgreSQL**, **Tailwind CSS** y **shadcn/ui**.  
El proyecto cubre desde la **autenticación de usuarios** hasta el **CRUD completo** de contactos.

---

## 🚀 Tecnologías utilizadas

### Backend (API REST)
- **[NestJS](https://nestjs.com/)** → Framework progresivo para Node.js con arquitectura modular.
- **TypeScript** → Tipado estático para mayor mantenibilidad.
- **[PostgreSQL](https://www.postgresql.org/)** → Base de datos relacional potente y robusta.
- **[Prisma ORM](https://www.prisma.io/)** → Mapeo objeto-relacional para interacción con PostgreSQL.
- **JWT (JSON Web Tokens)** → Implementación de autenticación segura.

### Frontend
- **[React](https://react.dev/)** + **[Vite](https://vitejs.dev/)** → Renderizado rápido y entorno de desarrollo optimizado.
- **[Tailwind CSS](https://tailwindcss.com/)** → Estilos rápidos y responsivos con utilidades.
- **[shadcn/ui](https://ui.shadcn.com/)** → Componentes UI listos para producción con integración en Tailwind.

---

## 🔑 Funcionalidades principales

- **Autenticación de usuarios** (registro, login, logout) con JWT.
- **CRUD de contactos**: Crear, leer, actualizar y eliminar.
- **Validación de datos** en frontend y backend.
- **UI moderna y responsive** usando Tailwind + shadcn/ui.
- **Arquitectura modular y escalable**.
- **Integración completa** entre backend y frontend.

---

## 📦 Instalación y configuración

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/luisangelf11/contact-list-app-yt.git
cd contact-list-app-yt
```

### 2️⃣ Instalar dependencias

```bash
cd server
npm install
cd ..
cd client
npm install
```

Recuerda crear los archivos .env tanto en el cliente como en el servidor.

### 3️⃣ Migrar la base de datos
```bash
npx prisma db push
```