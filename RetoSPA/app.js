// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

// Estado global de la aplicación
let currentUser = null;
let currentRoute = '/';

// Clase Router para manejo de rutas
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

// Clase AuthService para manejo de autenticación
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

// Clase BookService para manejo de libros
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

// Clase ReservationService para manejo de reservas
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

// Componentes de la aplicación
const components = {
  // Página de login
  login: () => {
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
  },

  // Página de registro
  register: () => {
    document.body.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <h1>📚 Biblioteca Pública</h1>
          <h2>Registro de Usuario</h2>
          <form id="registerForm">
            <input type="text" id="name" placeholder="Nombre completo" required>
            <input type="email" id="email" placeholder="Correo electrónico" required>
            <input type="password" id="password" placeholder="Contraseña" required>
            <input type="tel" id="phone" placeholder="Teléfono" required>
            <select id="role" required>
              <option value="">Seleccionar rol</option>
              <option value="visitante">Visitante</option>
              <option value="bibliotecario">Bibliotecario</option>
            </select>
            <button type="submit">Registrarse</button>
          </form>
          <p>¿Ya tienes cuenta? <a href="#" onclick="router.navigate('/login')">Inicia sesión aquí</a></p>
        </div>
      </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        role: document.getElementById('role').value
      };
      
      const result = await AuthService.register(userData);
      if (result.success) {
        alert('Usuario registrado exitosamente');
        router.navigate('/login');
      } else {
        alert(result.message);
      }
    });
  },

  // Dashboard principal
  dashboard: () => {
    const isBibliotecario = currentUser.role === 'bibliotecario';
    
    document.body.innerHTML = `
      <div class="app-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            <h1>📚 Biblioteca</h1>
            <p>Bienvenido, ${currentUser.name}</p>
            <span class="role-badge">${currentUser.role}</span>
          </div>
          <nav class="sidebar-nav">
            <ul>
              <li><a href="#" onclick="router.navigate('/dashboard')" class="nav-link active">🏠 Dashboard</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/books')" class="nav-link">📖 Libros</a></li>
              ${isBibliotecario ? '<li><a href="#" onclick="router.navigate(\'/dashboard/books/create\')" class="nav-link">➕ Agregar Libro</a></li>' : ''}
              <li><a href="#" onclick="router.navigate('/dashboard/reservations')" class="nav-link">📋 Reservas</a></li>
              <li><a href="#" onclick="AuthService.logout()" class="nav-link">🚪 Cerrar Sesión</a></li>
            </ul>
          </nav>
        </aside>
        <main class="main-content">
          <div class="dashboard-content">
            <h2>Dashboard</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>Libros Disponibles</h3>
                <p id="availableBooks">Cargando...</p>
              </div>
              <div class="stat-card">
                <h3>Mis Reservas</h3>
                <p id="myReservations">Cargando...</p>
              </div>
              ${isBibliotecario ? `
                <div class="stat-card">
                  <h3>Total Reservas</h3>
                  <p id="totalReservations">Cargando...</p>
                </div>
              ` : ''}
            </div>
            <div class="recent-books">
              <h3>Libros Recientes</h3>
              <div id="recentBooksList" class="books-grid"></div>
            </div>
          </div>
        </main>
      </div>
    `;

    loadDashboardData();
  },

  // Lista de libros
  books: () => {
    const isBibliotecario = currentUser.role === 'bibliotecario';
    
    document.body.innerHTML = `
      <div class="app-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            <h1>📚 Biblioteca</h1>
            <p>Bienvenido, ${currentUser.name}</p>
            <span class="role-badge">${currentUser.role}</span>
          </div>
          <nav class="sidebar-nav">
            <ul>
              <li><a href="#" onclick="router.navigate('/dashboard')" class="nav-link">🏠 Dashboard</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/books')" class="nav-link active">📖 Libros</a></li>
              ${isBibliotecario ? '<li><a href="#" onclick="router.navigate(\'/dashboard/books/create\')" class="nav-link">➕ Agregar Libro</a></li>' : ''}
              <li><a href="#" onclick="router.navigate('/dashboard/reservations')" class="nav-link">📋 Reservas</a></li>
              <li><a href="#" onclick="AuthService.logout()" class="nav-link">🚪 Cerrar Sesión</a></li>
            </ul>
          </nav>
        </aside>
        <main class="main-content">
          <div class="books-content">
            <div class="content-header">
              <h2>Catálogo de Libros</h2>
              <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Buscar libros...">
              </div>
            </div>
            <div id="booksList" class="books-grid"></div>
          </div>
        </main>
      </div>
    `;

    loadBooks();
  },

  // Crear libro (solo bibliotecarios)
  createBook: () => {
    document.body.innerHTML = `
      <div class="app-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            <h1>📚 Biblioteca</h1>
            <p>Bienvenido, ${currentUser.name}</p>
            <span class="role-badge">${currentUser.role}</span>
          </div>
          <nav class="sidebar-nav">
            <ul>
              <li><a href="#" onclick="router.navigate('/dashboard')" class="nav-link">🏠 Dashboard</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/books')" class="nav-link">📖 Libros</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/books/create')" class="nav-link active">➕ Agregar Libro</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/reservations')" class="nav-link">📋 Reservas</a></li>
              <li><a href="#" onclick="AuthService.logout()" class="nav-link">🚪 Cerrar Sesión</a></li>
            </ul>
          </nav>
        </aside>
        <main class="main-content">
          <div class="form-content">
            <h2>Agregar Nuevo Libro</h2>
            <form id="createBookForm" class="book-form">
              <div class="form-group">
                <label for="title">Título</label>
                <input type="text" id="title" required>
              </div>
              <div class="form-group">
                <label for="author">Autor</label>
                <input type="text" id="author" required>
              </div>
              <div class="form-group">
                <label for="isbn">ISBN</label>
                <input type="text" id="isbn" required>
              </div>
              <div class="form-group">
                <label for="category">Categoría</label>
                <input type="text" id="category" required>
              </div>
              <div class="form-group">
                <label for="totalCopies">Número de Copias</label>
                <input type="number" id="totalCopies" min="1" required>
              </div>
              <div class="form-group">
                <label for="publishedYear">Año de Publicación</label>
                <input type="number" id="publishedYear" min="1800" max="2024" required>
              </div>
              <div class="form-group">
                <label for="description">Descripción</label>
                <textarea id="description" rows="4" required></textarea>
              </div>
              <div class="form-actions">
                <button type="submit">Crear Libro</button>
                <button type="button" onclick="router.navigate('/dashboard/books')">Cancelar</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    `;

    document.getElementById('createBookForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        category: document.getElementById('category').value,
        totalCopies: parseInt(document.getElementById('totalCopies').value),
        availableCopies: parseInt(document.getElementById('totalCopies').value),
        publishedYear: parseInt(document.getElementById('publishedYear').value),
        description: document.getElementById('description').value
      };

      const success = await BookService.createBook(bookData);
      if (success) {
        alert('Libro creado exitosamente');
        router.navigate('/dashboard/books');
      } else {
        alert('Error al crear el libro');
      }
    });
  },

  // Editar libro (solo bibliotecarios)
  editBook: () => {
    const bookId = new URLSearchParams(window.location.search).get('id');
    if (!bookId) {
      router.navigate('/dashboard/books');
      return;
    }

    loadBookForEdit(bookId);
  },

  // Reservas
  reservations: () => {
    const isBibliotecario = currentUser.role === 'bibliotecario';
    
    document.body.innerHTML = `
      <div class="app-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            <h1>📚 Biblioteca</h1>
            <p>Bienvenido, ${currentUser.name}</p>
            <span class="role-badge">${currentUser.role}</span>
          </div>
          <nav class="sidebar-nav">
            <ul>
              <li><a href="#" onclick="router.navigate('/dashboard')" class="nav-link">🏠 Dashboard</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/books')" class="nav-link">📖 Libros</a></li>
              ${isBibliotecario ? '<li><a href="#" onclick="router.navigate(\'/dashboard/books/create\')" class="nav-link">➕ Agregar Libro</a></li>' : ''}
              <li><a href="#" onclick="router.navigate('/dashboard/reservations')" class="nav-link active">📋 Reservas</a></li>
              <li><a href="#" onclick="AuthService.logout()" class="nav-link">🚪 Cerrar Sesión</a></li>
            </ul>
          </nav>
        </aside>
        <main class="main-content">
          <div class="reservations-content">
            <h2>${isBibliotecario ? 'Todas las Reservas' : 'Mis Reservas'}</h2>
            <div id="reservationsList" class="reservations-grid"></div>
          </div>
        </main>
      </div>
    `;

    loadReservations();
  },

  // Página 404
  notFound: () => {
    document.body.innerHTML = `
      <div class="not-found-container">
        <div class="not-found-content">
          <h1>404</h1>
          <h2>Página no encontrada</h2>
          <p>Lo sentimos, la página que buscas no existe o no tienes permisos para acceder.</p>
          <button onclick="router.navigate('/dashboard')">Volver al Dashboard</button>
        </div>
      </div>
    `;
  }
};

// Funciones auxiliares
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

async function loadReservations() {
  try {
    const isBibliotecario = currentUser.role === 'bibliotecario';
    const reservations = await ReservationService.getReservations(isBibliotecario ? null : currentUser.id);
    
    const reservationsHTML = reservations.map(reservation => `
      <div class="reservation-card">
        <div class="reservation-info">
          <h3>${reservation.book.title}</h3>
          <p><strong>Autor:</strong> ${reservation.book.author}</p>
          <p><strong>Fecha de reserva:</strong> ${reservation.reservationDate}</p>
          <p><strong>Fecha de devolución:</strong> ${reservation.returnDate}</p>
          <p><strong>Estado:</strong> <span class="status ${reservation.status}">${reservation.status}</span></p>
        </div>
      </div>
    `).join('');
    
    document.getElementById('reservationsList').innerHTML = reservationsHTML || '<p>No hay reservas para mostrar.</p>';
  } catch (error) {
    console.error('Error loading reservations:', error);
  }
}

async function loadBookForEdit(bookId) {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    const book = await response.json();
    
    document.body.innerHTML = `
      <div class="app-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            <h1>📚 Biblioteca</h1>
            <p>Bienvenido, ${currentUser.name}</p>
            <span class="role-badge">${currentUser.role}</span>
          </div>
          <nav class="sidebar-nav">
            <ul>
              <li><a href="#" onclick="router.navigate('/dashboard')" class="nav-link">🏠 Dashboard</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/books')" class="nav-link">📖 Libros</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/books/create')" class="nav-link">➕ Agregar Libro</a></li>
              <li><a href="#" onclick="router.navigate('/dashboard/reservations')" class="nav-link">📋 Reservas</a></li>
              <li><a href="#" onclick="AuthService.logout()" class="nav-link">🚪 Cerrar Sesión</a></li>
            </ul>
          </nav>
        </aside>
        <main class="main-content">
          <div class="form-content">
            <h2>Editar Libro</h2>
            <form id="editBookForm" class="book-form">
              <div class="form-group">
                <label for="title">Título</label>
                <input type="text" id="title" value="${book.title}" required>
              </div>
              <div class="form-group">
                <label for="author">Autor</label>
                <input type="text" id="author" value="${book.author}" required>
              </div>
              <div class="form-group">
                <label for="isbn">ISBN</label>
                <input type="text" id="isbn" value="${book.isbn}" required>
              </div>
              <div class="form-group">
                <label for="category">Categoría</label>
                <input type="text" id="category" value="${book.category}" required>
              </div>
              <div class="form-group">
                <label for="totalCopies">Número de Copias</label>
                <input type="number" id="totalCopies" value="${book.totalCopies}" min="1" required>
              </div>
              <div class="form-group">
                <label for="availableCopies">Copias Disponibles</label>
                <input type="number" id="availableCopies" value="${book.availableCopies}" min="0" max="${book.totalCopies}" required>
              </div>
              <div class="form-group">
                <label for="publishedYear">Año de Publicación</label>
                <input type="number" id="publishedYear" value="${book.publishedYear}" min="1800" max="2024" required>
              </div>
              <div class="form-group">
                <label for="description">Descripción</label>
                <textarea id="description" rows="4" required>${book.description}</textarea>
              </div>
              <div class="form-actions">
                <button type="submit">Actualizar Libro</button>
                <button type="button" onclick="router.navigate('/dashboard/books')">Cancelar</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    `;

    document.getElementById('editBookForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        category: document.getElementById('category').value,
        totalCopies: parseInt(document.getElementById('totalCopies').value),
        availableCopies: parseInt(document.getElementById('availableCopies').value),
        publishedYear: parseInt(document.getElementById('publishedYear').value),
        description: document.getElementById('description').value,
        available: parseInt(document.getElementById('availableCopies').value) > 0
      };

      const success = await BookService.updateBook(bookId, bookData);
      if (success) {
        alert('Libro actualizado exitosamente');
        router.navigate('/dashboard/books');
      } else {
        alert('Error al actualizar el libro');
      }
    });
  } catch (error) {
    console.error('Error loading book for edit:', error);
    router.navigate('/dashboard/books');
  }
}

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

// Configuración de rutas
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

// Inicialización de la aplicación
let router;
document.addEventListener('DOMContentLoaded', () => {
  AuthService.checkAuth();
  router = new Router(routes);
});
