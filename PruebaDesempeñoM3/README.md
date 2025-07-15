# 📚 SPA Events App - Sistema de Gestión de Eventos

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E5.0+-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-3.0+-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Tabla de Contenidos

- [Información del Desarrollador](#-información-del-desarrollador)
- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Guía de Uso](#-guía-de-uso)
- [API Endpoints](#-api-endpoints)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Consideraciones de Seguridad](#-consideraciones-de-seguridad)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 👨‍💻 Información del Desarrollador

- **Nombre Completo:** Juan Diego Hernandez Martinez
- **Clan:** Linus
- **Correo Electrónico:** juandhm20@gmail.com
- **Documento de Identidad:** 1192766051
- **GitHub:** [Juandhm18](https://github.com/Juandhm18)

## 🎯 Descripción del Proyecto

Esta es una **Single Page Application (SPA)** desarrollada para gestionar eventos y reservas. La aplicación ofrece diferentes funcionalidades según el tipo de usuario:

- **👨‍💼 Administradores:** Gestión completa de eventos (CRUD)
- **👥 Visitantes:** Consulta de eventos y sistema de inscripciones

### 🎨 Características Destacadas

- ✅ **Interfaz moderna y responsiva** con diseño adaptativo
- ✅ **Sistema de autenticación** con roles y protección de rutas
- ✅ **Navegación fluida** sin recargas de página
- ✅ **Gestión de estado** con localStorage
- ✅ **Validaciones de formularios** en tiempo real
- ✅ **Manejo de errores** robusto
- ✅ **Código modular** y bien documentado

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación de datos
- **Inicio de sesión** seguro con persistencia
- **Gestión de roles** (admin/visitor)
- **Protección de rutas** según permisos
- **Cierre de sesión** con limpieza de datos

### 📊 Gestión de Eventos
- **Crear eventos** con información completa
- **Editar eventos** existentes
- **Eliminar eventos** con confirmación
- **Visualizar eventos** en formato tabla
- **Control de capacidad** automático

### 🎫 Sistema de Inscripciones
- **Inscripción a eventos** para visitantes
- **Control de disponibilidad** en tiempo real
- **Historial de inscripciones** personal
- **Validación de cupos** automática

### 🎨 Interfaz de Usuario
- **Diseño responsivo** para todos los dispositivos
- **Navegación intuitiva** con breadcrumbs
- **Formularios optimizados** con validaciones
- **Feedback visual** para todas las acciones
- **Accesibilidad** mejorada

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica y accesible
- **CSS3** - Estilos modernos con Flexbox y Grid
- **JavaScript ES6+** - Lógica de aplicación y manipulación del DOM
- **Hash Routing** - Navegación SPA personalizada

### Backend (Simulado)
- **JSON Server** - API REST simulada
- **LocalStorage** - Persistencia de datos del cliente
- **Fetch API** - Comunicación HTTP

### Herramientas de Desarrollo
- **Git** - Control de versiones
- **VS Code** - Editor de código
- **Live Server** - Servidor de desarrollo

## 📦 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **npm** (incluido con Node.js)
- **Navegador web** moderno (Chrome, Firefox, Safari, Edge)

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/Juandhm18/JavaScript.git
cd JavaScript/PruebaDesempeñoM3
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Iniciar el Servidor de Base de Datos
```bash
# Opción 1: Usando el script de npm
npm run test

# Opción 2: Instalación global de json-server
npm install -g json-server
json-server --watch db.json --port 3000
```

### Paso 4: Iniciar la Aplicación
```bash
# Opción 1: Servidor Python
python -m http.server 8000

# Opción 2: Servidor Node.js (si tienes http-server)
npx http-server

# Opción 3: Abrir directamente en el navegador
# Abre index.html en tu navegador
```

### Paso 5: Acceder a la Aplicación
- **URL Frontend:** `http://localhost:8000`
- **URL API Backend:** `http://localhost:3000`

## 📁 Estructura del Proyecto

```
PruebaDesempeñoM3/
├── 📄 index.html              # Página principal de la aplicación
├── 📄 index.js                # Lógica principal y routing
├── 📄 package.json            # Configuración del proyecto
├── 📄 db.json                 # Base de datos simulada
├── 📄 README.md               # Documentación del proyecto
├── 📁 app/
│   ├── 📄 auth.js             # Módulo de autenticación
│   ├── 📁 css/
│   │   ├── 📄 styles.css      # Estilos principales
│   │   └── 📄 login.css       # Estilos específicos de login
│   └── 📁 views/
│       ├── 📄 login.js        # Vista de inicio de sesión
│       ├── 📄 register.js     # Vista de registro
│       ├── 📄 dashboard.js    # Dashboard principal
│       ├── 📄 create-event.js # Formulario de crear evento
│       ├── 📄 edit-event.js   # Formulario de editar evento
│       ├── 📄 visitor.js      # Vista para visitantes
│       ├── 📄 my-events.js    # Mis eventos inscritos
│       ├── 📄 enrollments.js  # Gestión de inscripciones
│       └── 📄 notFound.js     # Página 404
└── 📁 .gitignore              # Archivos ignorados por Git
```

## 🎮 Guía de Uso

### 👤 Usuarios de Prueba

#### Administrador
```
Usuario: admin
Contraseña: admin123
Rol: admin
```

#### Visitante
```
Usuario: juan
Contraseña: juan123
Rol: visitor
```

### 🔐 Proceso de Autenticación

1. **Acceso inicial:** La aplicación redirige automáticamente al login
2. **Registro:** Los nuevos usuarios pueden registrarse como visitantes
3. **Login:** Ingreso con credenciales válidas
4. **Dashboard:** Redirección automática según el rol

### 👨‍💼 Funcionalidades de Administrador

#### Gestión de Eventos
- **Ver todos los eventos** en formato tabla
- **Crear nuevo evento** con formulario completo
- **Editar evento existente** con datos precargados
- **Eliminar evento** con confirmación de seguridad

#### Formulario de Evento
```javascript
{
  name: "Nombre del Evento",
  description: "Descripción detallada",
  date: "2025-01-15",
  capacity: 50,
  image: "URL de la imagen"
}
```

### 👥 Funcionalidades de Visitante

#### Consulta de Eventos
- **Ver eventos disponibles** con información completa
- **Filtrar por disponibilidad** automáticamente
- **Inscribirse en eventos** con cupos disponibles

#### Mis Eventos
- **Ver eventos inscritos** personal
- **Historial de inscripciones** completo
- **Información detallada** de cada evento

## 🔌 API Endpoints

### Usuarios
```http
GET    /users                    # Obtener todos los usuarios
POST   /users                    # Crear nuevo usuario
GET    /users?email={email}      # Buscar usuario por email
```

### Eventos
```http
GET    /events                   # Obtener todos los eventos
POST   /events                   # Crear nuevo evento
GET    /events/{id}              # Obtener evento específico
PUT    /events/{id}              # Actualizar evento
PATCH  /events/{id}              # Actualizar parcialmente
DELETE /events/{id}              # Eliminar evento
```

### Inscripciones
```http
GET    /enrollments              # Obtener todas las inscripciones
POST   /enrollments              # Crear nueva inscripción
GET    /enrollments?userId={id}  # Inscripciones de un usuario
```

## 🏗️ Arquitectura del Sistema

### Patrón de Diseño
La aplicación sigue el patrón **MVC (Model-View-Controller)** simplificado:

- **Model:** `db.json` (datos) y `auth.js` (lógica de negocio)
- **View:** Archivos en `app/views/` (interfaz de usuario)
- **Controller:** `index.js` (lógica de control y routing)

### Flujo de Datos
```
Usuario → Event Listener → Controller → API → Database
   ↑                                        ↓
   ←────────── View ←─── Response ←─────────
```

### Sistema de Routing
```javascript
const routes = {
  '/': '/login',
  '/login': { component: Login, public: true },
  '/register': { component: Register, public: true },
  '/dashboard': { component: Dashboard, requiresAuth: true },
  '/dashboard/events/create': { component: CreateEvent, requiresRole: 'admin' },
  '/dashboard/events/edit/:id': { component: EditEvent, requiresRole: 'admin' },
  '/dashboard/my-events': { component: MyEvents, requiresRole: 'visitor' }
};
```

### Gestión de Estado
- **LocalStorage:** Persistencia de sesión de usuario
- **Estado Global:** Información del usuario actual
- **Estado Local:** Datos específicos de cada vista

## 🔒 Consideraciones de Seguridad

### Implementado
- ✅ **Validación de entrada** en formularios
- ✅ **Protección de rutas** según roles
- ✅ **Sanitización básica** de datos
- ✅ **Manejo de errores** sin exposición de información sensible

### Mejoras Recomendadas para Producción
- 🔒 **Hash de contraseñas** (bcrypt)
- 🔒 **Tokens JWT** para autenticación
- 🔒 **HTTPS** obligatorio
- 🔒 **Rate limiting** en API
- 🔒 **Validación del lado servidor**
- 🔒 **CORS** configurado correctamente
- 🔒 **Headers de seguridad** (HSTS, CSP)

### Ejemplo de Implementación de Seguridad
```javascript
// Hash de contraseñas (recomendado)
import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Validación de entrada
const validateEventData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }
  
  if (!data.date || new Date(data.date) < new Date()) {
    errors.push('La fecha debe ser futura');
  }
  
  if (!data.capacity || data.capacity <= 0) {
    errors.push('La capacidad debe ser mayor a 0');
  }
  
  return errors;
};
```

## 🐛 Solución de Problemas

### Error de Conexión con json-server
```bash
# Verificar que json-server esté ejecutándose
curl http://localhost:3000/events

# Reiniciar el servidor
json-server --watch db.json --port 3000 --host 0.0.0.0
```

### Problemas de CORS
```javascript
// Configuración de json-server con CORS
json-server --watch db.json --port 3000 --middlewares ./cors.js

// cors.js
module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};
```

### Problemas de Rendimiento
- **Paginación:** Implementar para grandes volúmenes de datos
- **Caché:** Usar localStorage para datos frecuentes
- **Lazy Loading:** Cargar vistas bajo demanda

### Debugging
```javascript
// Habilitar logs detallados
localStorage.setItem('debug', 'true');

// Verificar estado de la aplicación
console.log('Usuario actual:', getCurrentUser());
console.log('Rutas disponibles:', routes);
```

## 🤝 Contribución

### Cómo Contribuir
1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request

### Estándares de Código
- **ESLint** para linting de JavaScript
- **Prettier** para formateo de código
- **Comentarios JSDoc** para documentación
- **Tests unitarios** para nuevas funcionalidades

### Estructura de Commits
```
feat: agregar sistema de notificaciones
fix: corregir error en validación de formularios
docs: actualizar documentación de API
style: mejorar estilos del dashboard
refactor: optimizar función de carga de eventos
test: agregar tests para módulo de autenticación
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

```mit
MIT License

Copyright (c) 2025 Juan Diego Hernandez Martinez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contacto

Para cualquier consulta sobre este proyecto:

- **Email:** [juandhm20@gmail.com](mailto:juandhm20@gmail.com)
- **GitHub:** [Juandhm18](https://github.com/Juandhm18)
- **LinkedIn:** [Juan Diego Hernandez](https://linkedin.com/in/juandhm18)

---

**Nota:** Este proyecto fue desarrollado como parte de un reto de desarrollo frontend para demostrar habilidades en JavaScript, HTML5, CSS y gestión de aplicaciones SPA. El código está optimizado para aprendizaje y puede ser mejorado para uso en producción. 