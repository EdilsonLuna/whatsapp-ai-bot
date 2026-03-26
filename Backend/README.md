# Backend — AI Social Messaging Platform

API REST que actúa como núcleo del sistema. Gestiona la integración con el webhook de Meta (WhatsApp), procesa los mensajes con OpenAI y expone endpoints para el portal de administración.

---

## Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | >= 18 | Entorno de ejecución |
| Express | 5 | Framework HTTP |
| TypeScript | — | Tipado estático |
| PostgreSQL | >= 14 | Base de datos relacional |
| Prisma | 7 | ORM y migraciones |
| OpenAI SDK | 6 | Generación de respuestas con IA |
| JWT | 9 | Autenticación de usuarios |
| bcrypt | 6 | Hash de contraseñas |
| axios | — | Llamadas HTTP externas |
| express-rate-limit | — | Límite de peticiones por IP |
| cookie-parser | — | Lectura de cookies |
| cors | — | Control de acceso entre orígenes |
| ngrok | — | Túnel para pruebas locales del webhook |
| dotenv | — | Variables de entorno |

---

## Estructura de carpetas

```
Backend/
└── src/
    ├── app.ts                   # Punto de entrada
    ├── server.ts                # Configuración de Express y middlewares
    ├── config/
    │   ├── env.ts               # Variables de entorno
    │   └── db.ts                # Configuración de base de datos
    ├── middlewares/
    │   └── auth.middleware.ts   # Validación JWT
    ├── routes/
    │   └── router.ts            # Enrutador principal (/api)
    ├── modules/
    │   ├── chats/               # Conversaciones e historial
    │   ├── meta/                # Webhook de WhatsApp (Meta)
    │   ├── openai/              # Integración con OpenAI
    │   ├── products/            # Catálogo de productos
    │   ├── settings/            # Configuración del asistente
    │   ├── users/               # Gestión de usuarios y autenticación
    │   └── prisma/              # Cliente Prisma compartido
    └── prisma/
        ├── schema.prisma        # Esquema de la base de datos
        └── migrations/          # Historial de migraciones
```

Cada módulo sigue la arquitectura **Controller → Service → Repository**.

---

## Instalación

```bash
# Instalar dependencias
npm install

# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones en la base de datos
npx prisma migrate deploy
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz de `Backend/` con las siguientes variables:

```env
NODE_ENV=development
PORT=3000

# PostgreSQL
DB_URL_PRISMA=postgresql://usuario:contraseña@localhost:5432/nombre_bd

# JWT
JWT_SECRET=tu_secreto_jwt
JWT_REFRESH_SECRET=tu_secreto_refresh
FIRMA_ACCESS_TOKEN=tu_firma_access
FIRMA_REFRESH_TOKEN=tu_firma_refresh

# Meta WhatsApp API
VERIFY_TOKEN=token_verificacion_webhook

# OpenAI
OPENAI_API_KEY=sk-...
```

---

## Inicio

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm run build
npm start
```

El servidor escucha por defecto en el puerto `3000`. La base de la URL de la API es:

```
http://localhost:3000/api
```

---

## Endpoints disponibles

### Webhook Meta (WhatsApp)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/webhook` | Verificación del webhook por Meta | No |
| `POST` | `/api/webhook` | Recepción de mensajes desde WhatsApp | No |

---

### Conversaciones — `/api/conversations`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/conversations` | Lista todas las conversaciones con su último mensaje | No |
| `GET` | `/api/conversations/:conversationId/history` | Historial de mensajes de una conversación | No |

---

### Productos — `/api/products`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/products` | Obtiene todos los productos registrados | No |

---

### Configuración — `/api/settings`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/settings` | Obtiene la configuración actual del asistente | No |
| `PUT` | `/api/settings` | Actualiza la configuración del asistente | No |
| `GET` | `/api/settings/answer-types` | Lista los tipos de respuesta disponibles | No |

---

### Usuarios — `/api/users`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/users/login` | Autenticación de usuario, devuelve JWT | No |
| `POST` | `/api/users/crear` | Registro de nuevo usuario | No |
| `GET` | `/api/users/consultar` | Datos del usuario autenticado | JWT requerido |

---

### OpenAI — `/api/openai`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/openai/pruebaOpenAI` | Envía un mensaje de prueba directamente a OpenAI | No |

---

## Modelos de base de datos (Prisma)

| Modelo | Descripción |
|--------|-------------|
| `usuarios` | Cuentas de usuario de la plataforma |
| `roles` | Roles del sistema |
| `permisos` | Permisos individuales |
| `roles_permiso` | Relación roles ↔ permisos |
| `usuarios_roles` | Relación usuarios ↔ roles |
| `usuarios_token` | Tokens de refresco activos |
