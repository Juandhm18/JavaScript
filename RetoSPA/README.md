# 📚 Biblioteca Pública - Sistema de Reservas

## Información del Desarrollador

- **Nombre Completo:** [Tu Nombre Completo]
- **Clan:** [Tu Clan]
- **Correo Electrónico:** [tu.email@ejemplo.com]
- **Documento de Identidad:** [Tu Número de Documento]

## Descripción del Proyecto

Esta es una aplicación de página única (SPA) desarrollada para una biblioteca pública que permite gestionar reservas de libros. La aplicación ofrece diferentes funcionalidades según el tipo de usuario: personal bibliotecario o visitante.

## Funcionalidades Implementadas

### 🔐 Autenticación de Usuarios
- **Registro de nuevos usuarios** con roles: bibliotecario y visitante
- **Inicio de sesión** para usuarios registrados
- **Protección de rutas** según el rol usando un guardián en Router.js
- **Persistencia de sesión** usando localStorage

### 👥 Funcionalidades por Tipo de Usuario

#### Bibliotecario
- ✅ Acceso completo al módulo de libros (crear, editar, eliminar)
- ✅ Visualización de todas las reservas
- ✅ Gestión completa del catálogo

#### Visitante
- ✅ Consulta del catálogo disponible
- ✅ Posibilidad de reservar libros si hay disponibilidad
- ✅ Visualización de sus propias reservas

### 🛣️ Comportamiento de Rutas
- ✅ Usuarios no autenticados son redirigidos a login
- ✅ Usuarios autenticados que intentan acceder a /login o /register son redirigidos a /dashboard
- ✅ Rutas protegidas según rol de usuario
- ✅ Página 404 personalizada para rutas no encontradas

### 📱 Interfaz de Usuario
- ✅ Diseño completamente responsivo
- ✅ Navegación fluida entre secciones
- ✅ Formularios intuitivos
- ✅ Interfaz moderna con gradientes y efectos visuales

## Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** json-server (simulación de base de datos)
- **Autenticación:** localStorage para persistencia de sesión
- **Rutas:** Sistema de rutas personalizado con protección de acceso

## Instrucciones de Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Paso 1: Instalar json-server
```bash
npm install -g json-server
```

### Paso 2: Iniciar el servidor de base de datos
```bash
# Desde la carpeta del proyecto
json-server --watch db.json --port 3000
```

### Paso 3: Abrir la aplicación
1. Abre el archivo `index.html` en tu navegador web
2. O si tienes un servidor local, puedes usar:
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   ```

### Paso 4: Acceder a la aplicación
- **URL:** `http://localhost:8000` (o el puerto que uses)
- **API Backend:** `http://localhost:3000`

## Datos de Prueba

### Usuarios Predefinidos

#### Bibliotecario
- **Email:** admin@biblioteca.com
- **Contraseña:** admin123
- **Rol:** bibliotecario

#### Visitante
- **Email:** juan@email.com
- **Contraseña:** user123
- **Rol:** visitante

### Libros de Ejemplo
- El Señor de los Anillos (J.R.R. Tolkien)
- Cien años de soledad (Gabriel García Márquez)
- 1984 (George Orwell)

## Estructura del Proyecto

```
RetoSPA/
├── index.html          # Página principal de la aplicación
├── app.js             # Lógica principal de la SPA
├── styles.css         # Estilos CSS de la aplicación
├── db.json           # Base de datos simulada
└── README.md         # Este archivo
```

## Funcionamiento Paso a Paso

### 1. Inicio de la Aplicación
- Al cargar la aplicación, se verifica si hay una sesión activa en localStorage
- Si no hay sesión, se redirige automáticamente a la página de login
- Si hay sesión, se redirige al dashboard correspondiente

### 2. Proceso de Autenticación
- **Registro:** El usuario completa el formulario con sus datos y selecciona un rol
- **Login:** El usuario ingresa su email y contraseña
- **Validación:** Se verifica contra la base de datos simulada
- **Persistencia:** Los datos del usuario se guardan en localStorage

### 3. Navegación y Rutas
- **Router.js:** Maneja todas las rutas de la aplicación
- **Protección:** Verifica autenticación y roles antes de mostrar contenido
- **Redirección:** Maneja automáticamente las redirecciones según el estado del usuario

### 4. Gestión de Libros (Bibliotecarios)
- **Crear:** Formulario completo para agregar nuevos libros
- **Editar:** Modificar información de libros existentes
- **Eliminar:** Eliminar libros del catálogo
- **Visualizar:** Lista completa de todos los libros

### 5. Gestión de Reservas
- **Bibliotecarios:** Ven todas las reservas del sistema
- **Visitantes:** Ven solo sus propias reservas
- **Crear:** Los visitantes pueden reservar libros disponibles
- **Estado:** Control automático de disponibilidad

### 6. Sincronización con Base de Datos
- Todas las operaciones CRUD se sincronizan con json-server
- Actualización automática de disponibilidad al reservar
- Manejo de errores de conexión

## Características Técnicas

### Sistema de Rutas
```javascript
const routes = [
  { path: '/', component: () => router.navigate('/login') },
  { path: '/login', component: components.login, redirectIfAuth: true },
  { path: '/register', component: components.register, redirectIfAuth: true },
  { path: '/dashboard', component: components.dashboard, requiresAuth: true },
  { path: '/dashboard/books', component: components.books, requiresAuth: true },
  { path: '/dashboard/books/create', component: components.createBook, requiresAuth: true, requiresRole: 'bibliotecario' },
  { path: '/dashboard/books/edit', component: components.editBook, requiresAuth: true, requiresRole: 'bibliotecario' },
  { path: '/dashboard/reservations', component: components.reservations, requiresAuth: true },
  { path: '*', component: components.notFound }
];
```

### Servicios Implementados
- **AuthService:** Manejo de autenticación y registro
- **BookService:** Operaciones CRUD para libros
- **ReservationService:** Gestión de reservas

### Persistencia de Datos
- **localStorage:** Para información de sesión del usuario
- **json-server:** Simulación de base de datos RESTful

## API Endpoints

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `POST /users` - Crear nuevo usuario
- `GET /users?email={email}` - Buscar usuario por email

### Libros
- `GET /books` - Obtener todos los libros
- `POST /books` - Crear nuevo libro
- `PUT /books/{id}` - Actualizar libro
- `DELETE /books/{id}` - Eliminar libro

### Reservas
- `GET /reservations` - Obtener todas las reservas
- `GET /reservations?userId={id}` - Obtener reservas de un usuario
- `POST /reservations` - Crear nueva reserva

## Consideraciones de Seguridad

- Las contraseñas se almacenan en texto plano (solo para demostración)
- En producción, se debería implementar hash de contraseñas
- Validación de entrada en formularios
- Protección contra acceso no autorizado a rutas

## Mejoras Futuras

- [ ] Implementar hash de contraseñas
- [ ] Agregar validación más robusta de formularios
- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar filtros avanzados para libros
- [ ] Implementar sistema de multas por retraso
- [ ] Agregar reportes y estadísticas
- [ ] Implementar búsqueda avanzada
- [ ] Agregar sistema de categorías dinámicas

## Solución de Problemas

### Error de Conexión con json-server
- Verificar que json-server esté ejecutándose en el puerto 3000
- Comprobar que el archivo db.json existe y es válido

### Problemas de CORS
- Asegurarse de que json-server esté configurado correctamente
- Verificar que la URL de la API sea correcta en app.js

### Problemas de Rendimiento
- La aplicación está optimizada para cargas pequeñas
- Para grandes volúmenes de datos, considerar paginación

## Contacto

Para cualquier consulta sobre este proyecto, contactar a:
- **Email:** [tu.email@ejemplo.com]
- **GitHub:** [tu-usuario-github]

---

**Nota:** Este proyecto fue desarrollado como parte de un reto de desarrollo frontend para demostrar habilidades en JavaScript, HTML5, CSS y gestión de aplicaciones SPA. 