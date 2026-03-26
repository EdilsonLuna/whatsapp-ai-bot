# Frontend — AI Social Messaging Platform (Portal de Administración)

Portal web de administración construido con **Angular 19**. Permite a los operadores monitorear conversaciones de WhatsApp gestionadas por la IA, administrar el catálogo de productos y ajustar la configuración del asistente.

---

## Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Angular | 19 | Framework SPA principal |
| TypeScript | — | Tipado estático |
| Angular SSR | — | Server-Side Rendering |
| Bootstrap | 5 | Framework de estilos y componentes UI |
| Bootstrap Icons | — | Iconografía |
| AG Grid | 35 | Grillas de datos avanzadas |
| RxJS | 7.8 | Manejo de flujos asíncronos |
| Angular Router | — | Navegación entre vistas |

---

## Estructura de carpetas

```
src/
└── app/
    ├── app.routes.ts              # Definición de rutas
    ├── app.config.ts              # Configuración de la aplicación
    ├── components/
    │   ├── dashboard/             # Vista contenedora principal
    │   ├── side-bar/              # Barra de navegación lateral
    │   ├── chats/
    │   │   ├── list-chats/        # Listado de conversaciones
    │   │   │   └── info-chat/     # Historial de una conversación
    │   │   └── create-chat/       # Iniciar nueva conversación
    │   ├── products/              # Catálogo de productos
    │   └── configuration/         # Configuración del asistente
    ├── services/
    │   ├── products.service.ts    # Llamadas a la API de productos
    │   └── settings.service.ts   # Llamadas a la API de configuración
    ├── guards/
    │   └── unsaved-changes.guard.ts  # Protección ante cambios sin guardar
    └── models/                    # Interfaces TypeScript
```

---

## Instalación

```bash
# Instalar dependencias
npm install
```

> Requiere Node.js >= 18 y Angular CLI instalado globalmente (`npm install -g @angular/cli`).

---

## Inicio

```bash
# Servidor de desarrollo (http://localhost:4200)
npm start

# Build de producción
npm run build

# Servidor SSR (tras el build)
npm run serve:ssr:ai_commerce_portal
```

El portal se conecta al backend en `http://localhost:3000/api`. Asegúrate de que la API esté en ejecución antes de iniciar el frontend.

---

## Rutas de la aplicación

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | — | Redirige a `/Dashboard` |
| `/Dashboard` | `DashboardComponent` | Contenedor principal con sidebar |
| `/Dashboard/list-chats` | `ListChatsComponent` | Listado de conversaciones activas |
| `/Dashboard/list-chats/chat/:id` | `InfoChatComponent` | Historial de mensajes de un chat |
| `/Dashboard/create-conversation` | `CreateChatComponent` | Iniciar una nueva conversación |
| `/Dashboard/products` | `ProductsComponent` | Catálogo de productos |
| `/Dashboard/configuration` | `ConfigurationComponent` | Configuración del asistente de IA |

> La ruta `/Dashboard/configuration` tiene activado el guard `unsavedChangesGuard` para advertir al usuario si intenta salir con cambios sin guardar.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
