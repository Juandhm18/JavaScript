# 📚 Documentación Completa del Código - Biblioteca Pública SPA

## Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Sistema de Rutas (Router)](#sistema-de-rutas-router)
3. [Servicios de Autenticación (AuthService)](#servicios-de-autenticación-authservice)
4. [Servicios de Libros (BookService)](#servicios-de-libros-bookservice)
5. [Servicios de Reservas (ReservationService)](#servicios-de-reservas-reservationservice)
6. [Componentes de la Aplicación](#componentes-de-la-aplicación)
7. [Funciones Auxiliares](#funciones-auxiliares)
8. [Configuración de Rutas](#configuración-de-rutas)
9. [Inicialización](#inicialización)

---

## 1. Configuración Inicial

```javascript
// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

// Estado global de la aplicación
let currentUser = null;
let currentRoute = '/';
```

### Explicación:
- **API_BASE_URL**: Define la URL base del servidor json-server
- **currentUser**: Variable global que almacena el usuario autenticado actualmente
- **currentRoute**: Variable para rastrear la ruta actual (aunque no se usa mucho)

---

## 2. Sistema de Rutas (Router)

### Clase Router
```javascript
class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    this.handleRoute();
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');
    
    if (route) {
      if (route.requiresAuth && !currentUser) {
        this.navigate('/login');
        return;
      }
      
      if (route.redirectIfAuth && currentUser) {
        this.navigate('/dashboard');
        return;
      }

      if (route.requiresRole && currentUser && currentUser.role !== route.requiresRole) {
        this.navigate('/not-found');
        return;
      }

      route.component();
    }
  }
}
```

### Explicación del Router:

#### Constructor y Inicialización:
- **constructor(routes)**: Recibe un array de rutas y las almacena
- **init()**: Configura el listener para cambios de URL y maneja la ruta inicial

#### Métodos Principales:

1. **navigate(path)**:
   - Cambia la URL del navegador sin recargar la página
   - Ejecuta el componente correspondiente

2. **handleRoute()**:
   - Obtiene la ruta actual de la URL
   - Busca la ruta correspondiente en el array de rutas
   - Aplica protecciones de seguridad:
     - `requiresAuth`: Si requiere autenticación y no hay usuario → redirige a login
     - `redirectIfAuth`: Si hay usuario autenticado → redirige a dashboard
     - `requiresRole`: Si requiere un rol específico → verifica permisos

---

## 3. Servicios de Autenticación (AuthService)

### Clase AuthService
```javascript
class AuthService {
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
      const users = await response.json();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        currentUser = userWithoutPassword;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
      } else {
        return { success: false, message: 'Credenciales inválidas' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  }

  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0]
        })
      });
      
      if (response.ok) {
        const newUser = await response.json();
        const { password, ...userWithoutPassword } = newUser;
        return { success: true, user: userWithoutPassword };
      } else {
        return { success: false, message: 'Error al registrar usuario' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  }

  static logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    router.navigate('/login');
  }

  static checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
  }
}
```

### Explicación de AuthService:

#### Métodos Principales:

1. **login(email, password)**:
   - Busca el usuario por email en la API
   - Verifica la contraseña
   - Si es válido: guarda en localStorage y actualiza currentUser
   - Retorna objeto con success y mensaje

2. **register(userData)**:
   - Crea nuevo usuario en la API
   - Genera ID único con Date.now()
   - Agrega fecha de creación
   - Retorna resultado de la operación

3. **logout()**:
   - Limpia currentUser
   - Elimina datos de localStorage
   - Redirige a login

4. **checkAuth()**:
   - Verifica si hay usuario guardado en localStorage
   - Restaura la sesión si existe

---

## 4. Servicios de Libros (BookService)

### Clase BookService
```javascript
class BookService {
  static async getAllBooks() {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  static async createBook(bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookData,
          id: Date.now(),
          available: true,
          createdAt: new Date().toISOString().split('T')[0]
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error creating book:', error);
      return false;
    }
  }

  static async updateBook(id, bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating book:', error);
      return false;
    }
  }

  static async deleteBook(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  }
}
```

### Explicación de BookService:

#### Operaciones CRUD:

1. **getAllBooks()**: Obtiene todos los libros del catálogo
2. **createBook(bookData)**: Crea un nuevo libro con ID único y fecha
3. **updateBook(id, bookData)**: Actualiza un libro existente
4. **deleteBook(id)**: Elimina un libro por ID

---

## 5. Servicios de Reservas (ReservationService)

### Clase ReservationService
```javascript
class ReservationService {
  static async getReservations(userId = null) {
    try {
      let url = `${API_BASE_URL}/reservations`;
      if (userId) {
        url += `?userId=${userId}`;
      }
      const response = await fetch(url);
      const reservations = await response.json();
      
      // Obtener información de libros para cada reserva
      const booksResponse = await fetch(`${API_BASE_URL}/books`);
      const books = await booksResponse.json();
      
      return reservations.map(reservation => {
        const book = books.find(b => b.id === reservation.bookId);
        return { ...reservation, book };
      });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  }

  static async createReservation(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now(),
          userId: currentUser.id,
          bookId: parseInt(bookId),
          reservationDate: new Date().toISOString().split('T')[0],
          returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        })
      });
      
      if (response.ok) {
        // Actualizar disponibilidad del libro
        const bookResponse = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const book = await bookResponse.json();
        await fetch(`${API_BASE_URL}/books/${bookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...book,
            availableCopies: book.availableCopies - 1,
            available: book.availableCopies - 1 > 0
          })
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating reservation:', error);
      return false;
    }
  }
}
```

### Explicación de ReservationService:

#### Métodos Principales:

1. **getReservations(userId = null)**:
   - Si userId es null: obtiene todas las reservas (para bibliotecarios)
   - Si userId existe: obtiene solo las reservas del usuario
   - Combina información de reservas con datos de libros

2. **createReservation(bookId)**:
   - Crea nueva reserva con fecha de devolución (30 días)
   - Actualiza automáticamente la disponibilidad del libro
   - Reduce en 1 las copias disponibles

---

## 6. Componentes de la Aplicación

### Estructura de Componentes
```javascript
const components = {
  login: () => { /* código del componente */ },
  register: () => { /* código del componente */ },
  dashboard: () => { /* código del componente */ },
  books: () => { /* código del componente */ },
  createBook: () => { /* código del componente */ },
  editBook: () => { /* código del componente */ },
  reservations: () => { /* código del componente */ },
  notFound: () => { /* código del componente */ }
};
```

### Patrón de Componentes
Cada componente sigue este patrón:
1. **Generar HTML** con template literals
2. **Configurar event listeners** para formularios
3. **Manejar la lógica** específica del componente

### Ejemplo: Componente Login
```javascript
login: () => {
  // 1. Generar HTML
  document.body.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h1>📚 Biblioteca Pública</h1>
        <h2>Iniciar Sesión</h2>
        <form id="loginForm">
          <input type="email" id="email" placeholder="Correo electrónico" required>
          <input type="password" id="password" placeholder="Contraseña" required>
          <button type="submit">Iniciar Sesión</button>
        </form>
        <p>¿No tienes cuenta? <a href="#" onclick="router.navigate('/register')">Regístrate aquí</a></p>
      </div>
    </div>
  `;

  // 2. Configurar event listener
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await AuthService.login(email, password);
    if (result.success) {
      router.navigate('/dashboard');
    } else {
      alert(result.message);
    }
  });
}
```

---

## 7. Funciones Auxiliares

### loadDashboardData()
```javascript
async function loadDashboardData() {
  try {
    const books = await BookService.getAllBooks();
    const availableBooks = books.filter(book => book.available).length;
    
    const reservations = await ReservationService.getReservations(currentUser.id);
    const myReservations = reservations.length;
    
    let totalReservations = myReservations;
    if (currentUser.role === 'bibliotecario') {
      const allReservations = await ReservationService.getReservations();
      totalReservations = allReservations.length;
    }

    // Actualizar estadísticas en el DOM
    document.getElementById('availableBooks').textContent = availableBooks;
    document.getElementById('myReservations').textContent = myReservations;
    if (currentUser.role === 'bibliotecario') {
      document.getElementById('totalReservations').textContent = totalReservations;
    }

    // Mostrar libros recientes
    const recentBooks = books.slice(0, 6);
    const recentBooksHTML = recentBooks.map(book => `
      <div class="book-card">
        <h4>${book.title}</h4>
        <p><strong>Autor:</strong> ${book.author}</p>
        <p><strong>Disponible:</strong> ${book.available ? 'Sí' : 'No'}</p>
      </div>
    `).join('');
    
    document.getElementById('recentBooksList').innerHTML = recentBooksHTML;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}
```

### loadBooks()
```javascript
async function loadBooks() {
  try {
    const books = await BookService.getAllBooks();
    const isBibliotecario = currentUser.role === 'bibliotecario';
    
    const booksHTML = books.map(book => `
      <div class="book-card">
        <div class="book-info">
          <h3>${book.title}</h3>
          <p><strong>Autor:</strong> ${book.author}</p>
          <p><strong>Categoría:</strong> ${book.category}</p>
          <p><strong>ISBN:</strong> ${book.isbn}</p>
          <p><strong>Copias disponibles:</strong> ${book.availableCopies}/${book.totalCopies}</p>
          <p><strong>Estado:</strong> <span class="status ${book.available ? 'available' : 'unavailable'}">${book.available ? 'Disponible' : 'No disponible'}</span></p>
        </div>
        <div class="book-actions">
          ${isBibliotecario ? `
            <button onclick="editBook(${book.id})" class="btn-edit">✏️ Editar</button>
            <button onclick="deleteBook(${book.id})" class="btn-delete">🗑️ Eliminar</button>
          ` : `
            ${book.available ? `<button onclick="reserveBook(${book.id})" class="btn-reserve">📚 Reservar</button>` : '<span class="unavailable">No disponible</span>'}
          `}
        </div>
      </div>
    `).join('');
    
    document.getElementById('booksList').innerHTML = booksHTML;
    
    // Configurar búsqueda
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const bookCards = document.querySelectorAll('.book-card');
      
      bookCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || author.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  } catch (error) {
    console.error('Error loading books:', error);
  }
}
```

---

## 8. Configuración de Rutas

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

### Explicación de las Rutas:

1. **`/`**: Redirige automáticamente a login
2. **`/login`**: Página de login (redirectIfAuth: si ya está autenticado, va a dashboard)
3. **`/register`**: Página de registro (redirectIfAuth: si ya está autenticado, va a dashboard)
4. **`/dashboard`**: Dashboard principal (requiresAuth: requiere estar autenticado)
5. **`/dashboard/books`**: Lista de libros (requiresAuth: requiere estar autenticado)
6. **`/dashboard/books/create`**: Crear libro (requiresAuth + requiresRole: solo bibliotecarios)
7. **`/dashboard/books/edit`**: Editar libro (requiresAuth + requiresRole: solo bibliotecarios)
8. **`/dashboard/reservations`**: Reservas (requiresAuth: requiere estar autenticado)
9. **`*`**: Página 404 para rutas no encontradas

---

## 9. Inicialización

```javascript
// Inicialización de la aplicación
let router;
document.addEventListener('DOMContentLoaded', () => {
  AuthService.checkAuth();
  router = new Router(routes);
});
```

### Explicación de la Inicialización:

1. **DOMContentLoaded**: Espera a que el DOM esté completamente cargado
2. **AuthService.checkAuth()**: Verifica si hay una sesión guardada
3. **new Router(routes)**: Crea la instancia del router con las rutas definidas

---

## 10. Funciones Globales

```javascript
// Funciones globales para botones
window.editBook = (bookId) => {
  router.navigate(`/dashboard/books/edit?id=${bookId}`);
};

window.deleteBook = async (bookId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
    const success = await BookService.deleteBook(bookId);
    if (success) {
      alert('Libro eliminado exitosamente');
      loadBooks();
    } else {
      alert('Error al eliminar el libro');
    }
  }
};

window.reserveBook = async (bookId) => {
  const success = await ReservationService.createReservation(bookId);
  if (success) {
    alert('Libro reservado exitosamente');
    loadBooks();
  } else {
    alert('Error al reservar el libro');
  }
};
```

### Explicación:

Estas funciones se asignan a `window` para que sean accesibles desde el HTML generado dinámicamente:

1. **editBook(bookId)**: Navega a la página de edición con el ID del libro
2. **deleteBook(bookId)**: Elimina un libro con confirmación
3. **reserveBook(bookId)**: Crea una reserva para un libro

---

## 11. Conceptos Clave para Aprender

### 1. **Programación Orientada a Objetos**
- Clases (Router, AuthService, BookService, ReservationService)
- Métodos estáticos
- Encapsulación de funcionalidad

### 2. **Async/Await**
- Manejo de promesas para operaciones asíncronas
- Fetch API para comunicación con el servidor
- Try/catch para manejo de errores

### 3. **Manipulación del DOM**
- innerHTML para cambiar contenido
- querySelector para encontrar elementos
- addEventListener para eventos

### 4. **Sistema de Rutas**
- History API para navegación sin recarga
- Protección de rutas basada en autenticación y roles
- Componentes dinámicos

### 5. **Persistencia de Datos**
- localStorage para sesión del usuario
- JSON para serialización de datos
- API REST para comunicación con backend

### 6. **Patrones de Diseño**
- Singleton para servicios
- Factory para componentes
- Observer para eventos

---

## 12. Flujo de la Aplicación

1. **Carga inicial**: Verifica sesión guardada
2. **Autenticación**: Login/registro de usuarios
3. **Navegación**: Router maneja las rutas y protecciones
4. **Componentes**: Se renderizan según la ruta
5. **Servicios**: Manejan la lógica de negocio
6. **API**: Comunicación con json-server
7. **Persistencia**: localStorage para sesión

---

## 13. Consejos para Estudiar

1. **Lee el código línea por línea** y entiende cada función
2. **Experimenta modificando** valores y viendo qué pasa
3. **Usa console.log()** para debuggear y entender el flujo
4. **Prueba cada funcionalidad** en el navegador
5. **Modifica el CSS** para entender el diseño
6. **Agrega nuevas funcionalidades** para practicar

---

**¡Buena suerte con tu aprendizaje!** 🚀 