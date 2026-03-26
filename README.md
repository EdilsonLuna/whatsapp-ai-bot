# AI Social Messaging Platform

Plataforma inteligente para la gestión y respuesta automática de mensajes provenientes de redes sociales, actualmente integrada con **WhatsApp Business API (Meta)**. El sistema utiliza **Inteligencia Artificial (OpenAI)** para generar respuestas contextuales y coherentes, permitiendo a negocios automatizar su atención al cliente a través de canales de mensajería.

La plataforma cuenta con un portal de administración web donde los operadores pueden visualizar conversaciones en tiempo real, gestionar el catálogo de productos y configurar el comportamiento del asistente de IA.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js · Express 5 · TypeScript |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Autenticación | JWT (JSON Web Tokens) · bcrypt |
| IA | OpenAI API |
| Integración | Meta WhatsApp Cloud API |
| Frontend | Angular 19 · TypeScript |
| Estilos | Bootstrap 5 · Bootstrap Icons |
| Tabla de datos | AG Grid |
| Renderizado | Angular SSR |

---

## Estructura del proyecto

```
whatsapp-ai-bot/
├── Backend/          # API REST en Node.js + Express
└── Frontend/
    └── ai_commerce_portal/   # Portal de administración en Angular
```

---

## Backend

API REST construida con **Express 5** y **TypeScript**. Se encarga de:

- Recibir y validar los mensajes entrantes desde el webhook de Meta (WhatsApp).
- Procesar los mensajes mediante **OpenAI** y generar respuestas automáticas.
- Gestionar conversaciones, usuarios, productos y configuración del sistema.
- Exponer endpoints autenticados con **JWT** para el consumo del portal web.

Organización modular por dominio: `chats`, `users`, `products`, `settings`, `openai`, `meta`.

> Ver [Backend/README.md](Backend/README.md) para instrucciones de instalación, variables de entorno y documentación completa de endpoints.

---

## Frontend

Portal de administración SPA desarrollado con **Angular 19** con soporte para **Server-Side Rendering (SSR)**.

Funcionalidades principales:
- **Dashboard**: Vista general del sistema.
- **Conversaciones**: Listado de chats activos e historial de mensajes por conversación.
- **Productos**: Visualización del catálogo de productos registrados.
- **Configuración**: Ajuste del comportamiento del asistente de IA.

> Ver [Frontend/ai_commerce_portal/README.md](Frontend/ai_commerce_portal/README.md) para instrucciones de instalación e inicio.

---

## Requisitos previos

- Node.js >= 18
- PostgreSQL >= 14
- Cuenta de OpenAI con API Key
- Cuenta de Meta Developer con acceso a WhatsApp Business API
