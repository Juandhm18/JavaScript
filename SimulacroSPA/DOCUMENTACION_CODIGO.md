# Documentación del Código - Sistema de Gestión Académica

## Introducción

Esta documentación explica la implementación del Sistema de Gestión Académica SPA, diseñado para ser una plantilla de estudio y posible examen. El código está organizado de manera modular y bien comentado para facilitar el aprendizaje.

## Arquitectura del Proyecto

### 1. Estructura de Archivos

```
SimulacroSPA/
├── index.html              # Punto de entrada de la SPA
├── styles.css              # Estilos CSS con variables y diseño responsivo
├── db.json                 # Base de datos JSON para json-server
├── package.json            # Configuración de dependencias y scripts
├── README.md               # Documentación general del proyecto
├── DOCUMENTACION_CODIGO.md # Esta documentación
└── js/
    ├── utils/              # Utilidades reutilizables
    │   ├── storage.js      # Manejo de localStorage/sessionStorage
    │   └── validation.js   # Validaciones de formularios
    ├── services/           # Lógica de negocio y API
    │   ├── api.js          # Cliente HTTP para json-server
    │   ├── auth.js         # Autenticación y gestión de sesiones
    │   ├── users.js        # CRUD de usuarios
    │   ├── courses.js      # CRUD de cursos
    │   └── enrollments.js  # Gestión de inscripciones
    ├── components/         # Componentes de UI
    │   ├── header.js       # Header con navegación
    │   ├── sidebar.js      # Sidebar para administradores
    │   └── modal.js        # Sistema de modales
    ├── routes.js           # Sistema de rutas SPA
    └── main.js             # Inicialización y eventos globales
```

## Explicación por Módulos

### 1. Utilidades (utils/)

#### storage.js
**Propósito**: Manejo centralizado de localStorage y sessionStorage.

**Clase Principal**: `StorageManager`
- Métodos estáticos para operaciones CRUD en almacenamiento
- Manejo de errores con try-catch
- Serialización/deserialización automática de JSON

**Uso**:
```javascript
// Guardar datos
StorageManager.setLocalStorage('key', {data: 'value'});

// Obtener datos
const data = StorageManager.getLocalStorage('key');

// Eliminar datos
StorageManager.removeLocalStorage('key');
```

#### validation.js
**Propósito**: Validación de formularios y datos.

**Clase Principal**: `ValidationUtils`
- Validaciones básicas (email, teléfono, fechas, etc.)
- Validaciones específicas para usuarios y cursos
- Manejo de errores de validación en el DOM

**Uso**:
```javascript
// Validar datos de usuario
const errors = ValidationUtils.validateUserRegistration(userData);
if (ValidationUtils.hasErrors(errors)) {
    ValidationUtils.showValidationErrors(errors, 'formId');
}
```

### 2. Servicios (services/)

#### api.js
**Propósito**: Cliente HTTP para comunicarse con json-server.

**Clase Principal**: `ApiService`
- Métodos para todas las operaciones HTTP (GET, POST, PUT, DELETE)
- Manejo de errores centralizado
- Headers automáticos para JSON

**Uso**:
```javascript
// Obtener todos los usuarios
const users = await apiService.getAll('users');

// Crear un usuario
const newUser = await apiService.create('users', userData);

// Actualizar un usuario
const updatedUser = await apiService.update('users', id, userData);
```

#### auth.js
**Propósito**: Gestión de autenticación y sesiones.

**Clase Principal**: `AuthService`
- Registro de usuarios
- Login/logout
- Gestión de sesiones con localStorage
- Verificación de roles y permisos

**Características**:
- Sesiones con expiración (24 horas)
- Tokens simulados para autenticación
- Validación de credenciales
- Gestión de roles (admin/visitor)

#### users.js
**Propósito**: Operaciones CRUD para usuarios.

**Clase Principal**: `UserService`
- Crear, leer, actualizar, eliminar usuarios
- Búsqueda y filtrado
- Estadísticas de usuarios
- Validación de datos únicos (email)

#### courses.js
**Propósito**: Operaciones CRUD para cursos.

**Clase Principal**: `CourseService`
- Gestión completa de cursos
- Control de cupos y inscripciones
- Estadísticas de cursos
- Búsqueda por título

#### enrollments.js
**Propósito**: Gestión de inscripciones a cursos.

**Clase Principal**: `EnrollmentService`
- Crear y cancelar inscripciones
- Verificar disponibilidad de cupos
- Obtener cursos por usuario y viceversa
- Estadísticas de inscripciones

### 3. Componentes (components/)

#### header.js
**Propósito**: Header de navegación dinámico.

**Clase Principal**: `HeaderComponent`
- Renderizado según estado de autenticación
- Navegación diferente para admin/visitor
- Manejo de logout
- Mensajes de notificación

#### sidebar.js
**Propósito**: Sidebar para panel de administración.

**Clase Principal**: `SidebarComponent`
- Solo visible para administradores
- Navegación entre secciones del panel
- Responsive (se oculta en móviles)
- Botón de toggle para móviles

#### modal.js
**Propósito**: Sistema de modales reutilizable.

**Clase Principal**: `ModalComponent`
- Modales de confirmación
- Modales de formularios
- Modales de alerta
- Modales de carga

### 4. Sistema de Rutas (routes.js)

**Propósito**: Navegación SPA sin recarga de página.

**Clase Principal**: `Router`
- Definición de rutas con permisos
- Templates dinámicos
- Control de acceso basado en roles
- Manejo de rutas no encontradas

**Estructura de Ruta**:
```javascript
{
    title: 'Título de la página',
    template: function, // Función que retorna HTML
    public: true, // Ruta pública
    requiresAuth: true, // Requiere autenticación
    roles: ['admin'] // Roles permitidos
}
```

### 5. Archivo Principal (main.js)

**Propósito**: Inicialización y eventos globales.

**Clase Principal**: `App`
- Inicialización de todos los componentes
- Verificación de disponibilidad de API
- Configuración de eventos globales
- Manejo de formularios

## Flujo de la Aplicación

### 1. Inicialización
1. Se carga `index.html`
2. Se cargan todos los scripts en orden
3. Se ejecuta `app.init()` cuando el DOM está listo
4. Se verifica la disponibilidad de la API
5. Se inicializan componentes (header, sidebar)
6. Se configura el router
7. Se maneja la ruta inicial

### 2. Autenticación
1. Usuario accede a `/login` o `/register`
2. Se valida el formulario
3. Se hace petición a la API
4. Se crea sesión en localStorage
5. Se actualiza el header y sidebar
6. Se redirige según el rol

### 3. Navegación
1. Usuario hace clic en enlace o cambia hash
2. Router detecta el cambio
3. Se verifica autenticación y permisos
4. Se carga el template correspondiente
5. Se renderiza el contenido
6. Se actualizan componentes

## Patrones de Diseño Utilizados

### 1. Singleton Pattern
- Instancias globales de servicios y componentes
- Acceso centralizado desde `window`

### 2. Module Pattern
- Cada archivo es un módulo independiente
- Exposición controlada de funcionalidad

### 3. Observer Pattern
- Eventos para comunicación entre componentes
- Actualización automática de UI

### 4. Factory Pattern
- Creación de modales dinámicos
- Templates de formularios

## Manejo de Errores

### 1. Errores de API
- Try-catch en todas las peticiones HTTP
- Mensajes de error específicos
- Fallback a estado anterior

### 2. Errores de Validación
- Validación en cliente antes de enviar
- Mensajes de error en formularios
- Limpieza automática de errores

### 3. Errores de Autenticación
- Verificación de sesión expirada
- Redirección automática a login
- Limpieza de datos corruptos

## Optimizaciones Implementadas

### 1. Performance
- Lazy loading de templates
- Debouncing en búsquedas
- Caché de datos en localStorage

### 2. UX
- Estados de carga
- Mensajes de confirmación
- Navegación intuitiva

### 3. Mantenibilidad
- Código modular y reutilizable
- Comentarios detallados
- Nombres descriptivos

## Consideraciones de Seguridad

### 1. Validación
- Validación en cliente y servidor
- Sanitización de datos de entrada
- Verificación de tipos

### 2. Autenticación
- Sesiones con expiración
- Verificación de roles
- Logout automático

### 3. Autorización
- Control de acceso por rutas
- Verificación de permisos
- Redirección automática

## Extensibilidad

### 1. Agregar Nuevas Funcionalidades
1. Crear servicio en `services/`
2. Agregar ruta en `routes.js`
3. Crear template en el router
4. Actualizar componentes si es necesario

### 2. Agregar Nuevos Roles
1. Modificar validaciones en `auth.js`
2. Actualizar templates en `routes.js`
3. Agregar lógica en componentes

### 3. Agregar Nuevas Entidades
1. Crear servicio CRUD
2. Agregar validaciones
3. Crear templates de gestión
4. Actualizar navegación

## Consejos para el Estudio

### 1. Orden de Lectura
1. `index.html` - Estructura básica
2. `styles.css` - Diseño y variables
3. `utils/` - Utilidades básicas
4. `services/api.js` - Comunicación con servidor
5. `services/auth.js` - Autenticación
6. `components/` - Interfaz de usuario
7. `routes.js` - Navegación
8. `main.js` - Inicialización

### 2. Conceptos Clave
- **SPA**: Single Page Application
- **CRUD**: Create, Read, Update, Delete
- **API REST**: Interfaz de programación
- **LocalStorage**: Almacenamiento local
- **Eventos**: Comunicación entre componentes
- **Promesas**: Manejo asíncrono

### 3. Prácticas Recomendadas
- Leer el código línea por línea
- Probar cada funcionalidad
- Modificar valores para ver cambios
- Agregar console.log para debugging
- Experimentar con la estructura

## Conclusión

Este proyecto demuestra una implementación completa de una SPA con JavaScript vanilla, siguiendo buenas prácticas de desarrollo y arquitectura modular. Es ideal para estudiar conceptos avanzados de JavaScript y desarrollo web moderno. 