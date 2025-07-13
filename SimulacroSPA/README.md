# Sistema de Gestión Académica - SPA

Una Single Page Application (SPA) completa para la gestión de usuarios y cursos con autenticación y roles diferenciados.

## Características

### Funcionalidades Principales
- **Autenticación de usuarios** con registro e inicio de sesión
- **Roles diferenciados**: Administrador y Visitante
- **Gestión completa de usuarios** (CRUD)
- **Gestión completa de cursos** (CRUD)
- **Sistema de inscripciones** a cursos
- **Panel de administración** con estadísticas
- **Interfaz responsiva** y accesible

### Tecnologías Utilizadas
- HTML5
- CSS3 (Flexbox/Grid)
- JavaScript Vanilla (ES6+)
- json-server (API REST simulada)
- LocalStorage/SessionStorage

## Estructura del Proyecto

```
SimulacroSPA/
├── index.html              # Página principal
├── styles.css              # Estilos de la aplicación
├── db.json                 # Base de datos JSON
├── package.json            # Configuración del proyecto
├── README.md               # Documentación
└── js/
    ├── utils/
    │   ├── storage.js      # Utilidades de almacenamiento
    │   └── validation.js   # Validaciones de formularios
    ├── services/
    │   ├── api.js          # Servicio de API
    │   ├── auth.js         # Servicio de autenticación
    │   ├── users.js        # Servicio de usuarios
    │   ├── courses.js      # Servicio de cursos
    │   └── enrollments.js  # Servicio de inscripciones
    ├── components/
    │   ├── header.js       # Componente header
    │   ├── sidebar.js      # Componente sidebar
    │   └── modal.js        # Componente modal
    ├── routes.js           # Sistema de rutas
    └── main.js             # Archivo principal
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd SimulacroSPA
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar json-server**
   ```bash
   npm run server
   ```

4. **Abrir la aplicación**
   - Abrir `index.html` en el navegador
   - O usar un servidor local como Live Server

### Scripts Disponibles

```json
{
  "scripts": {
    "server": "json-server --watch db.json --port 3000",
    "dev": "concurrently \"npm run server\" \"live-server --port 8080\""
  }
}
```

## Uso de la Aplicación

### Usuarios por Defecto

**Administrador:**
- Email: `admin@admin.com`
- Contraseña: `admin123`

### Flujo de Usuario

#### 1. Usuario Público
- Ver cursos disponibles
- Registrarse como nuevo usuario
- Iniciar sesión

#### 2. Usuario Visitante (Autenticado)
- Ver cursos disponibles
- Inscribirse en cursos
- Ver mis cursos inscritos
- Cancelar inscripciones

#### 3. Usuario Administrador
- Acceso al panel de administración
- Gestión completa de usuarios
- Gestión completa de cursos
- Gestión de inscripciones
- Ver reportes y estadísticas

### Funcionalidades por Rol

#### Administrador
- **Dashboard**: Estadísticas generales del sistema
- **Usuarios**: Crear, editar, eliminar y gestionar usuarios
- **Cursos**: Crear, editar, eliminar y gestionar cursos
- **Inscripciones**: Ver y gestionar todas las inscripciones
- **Reportes**: Generar reportes del sistema

#### Visitante
- **Cursos Disponibles**: Ver y buscar cursos
- **Mis Cursos**: Ver cursos en los que está inscrito
- **Inscripciones**: Inscribirse y cancelar inscripciones

## Estructura de Datos

### Usuarios
```json
{
  "id": 1,
  "name": "Nombre del Usuario",
  "email": "usuario@email.com",
  "password": "contraseña",
  "role": "admin|visitor",
  "phone": "1234567890",
  "enrollNumber": "98765432100000",
  "dateOfAdmission": "01-Jan-2020"
}
```

### Cursos
```json
{
  "id": 1,
  "title": "Título del Curso",
  "description": "Descripción del curso",
  "startDate": "10-Jul-2025",
  "duration": "4 semanas",
  "capacity": 20,
  "enrolled": 0
}
```

### Inscripciones
```json
{
  "id": 1,
  "userId": 2,
  "courseId": 1,
  "enrollmentDate": "2025-01-13T18:00:00.000Z",
  "status": "active"
}
```

## API Endpoints

La aplicación utiliza json-server que proporciona automáticamente los siguientes endpoints:

- `GET /users` - Obtener todos los usuarios
- `POST /users` - Crear usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

- `GET /courses` - Obtener todos los cursos
- `POST /courses` - Crear curso
- `PUT /courses/:id` - Actualizar curso
- `DELETE /courses/:id` - Eliminar curso

- `GET /enrollments` - Obtener todas las inscripciones
- `POST /enrollments` - Crear inscripción
- `DELETE /enrollments/:id` - Eliminar inscripción

## Características Técnicas

### Arquitectura
- **SPA (Single Page Application)**: Navegación sin recarga de página
- **Módulos JavaScript**: Código organizado en módulos reutilizables
- **Servicios**: Lógica de negocio separada de la interfaz
- **Componentes**: Elementos de UI reutilizables

### Seguridad
- **Validación de formularios**: Cliente y servidor
- **Autenticación**: Sistema de sesiones con localStorage
- **Autorización**: Control de acceso basado en roles
- **Sanitización**: Validación de datos de entrada

### Persistencia
- **LocalStorage**: Datos de sesión del usuario
- **SessionStorage**: Datos temporales de la sesión
- **json-server**: Base de datos JSON persistente

### Responsividad
- **Mobile-first**: Diseño adaptativo
- **Flexbox/Grid**: Layouts modernos
- **CSS Variables**: Sistema de diseño consistente

## Desarrollo

### Agregar Nuevas Funcionalidades

1. **Crear servicio** en `js/services/`
2. **Agregar ruta** en `js/routes.js`
3. **Crear template** en el router
4. **Actualizar componentes** si es necesario

### Estructura de un Servicio

```javascript
class MiServicio {
    constructor() {
        this.resource = 'mi-recurso';
    }
    
    async getAll() {
        return await apiService.getAll(this.resource);
    }
    
    async create(data) {
        return await apiService.create(this.resource, data);
    }
    
    // ... más métodos
}
```

### Estructura de un Componente

```javascript
class MiComponente {
    constructor() {
        this.element = document.getElementById('mi-elemento');
    }
    
    init() {
        this.render();
        this.bindEvents();
    }
    
    render() {
        // Renderizar contenido
    }
    
    bindEvents() {
        // Vincular eventos
    }
}
```

## Solución de Problemas

### Error: "API no disponible"
- Verificar que json-server esté ejecutándose
- Comprobar que el puerto 3000 esté libre
- Verificar que el archivo `db.json` exista

### Error: "Usuario no encontrado"
- Verificar credenciales de login
- Comprobar que el usuario exista en `db.json`

### Error: "CORS"
- Usar un servidor local (Live Server)
- Verificar configuración de json-server

### Error: "LocalStorage no disponible"
- Verificar que el navegador soporte localStorage
- Comprobar que no esté en modo incógnito

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

Para preguntas o soporte, contactar al desarrollador.

---

**Nota**: Este proyecto está diseñado para fines educativos y de práctica. En un entorno de producción, se recomienda implementar medidas de seguridad adicionales. 