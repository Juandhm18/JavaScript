/**
 * 📚 SPA Events App - Archivo Principal
 * 
 * Este archivo maneja la inicialización de la aplicación SPA,
 * el sistema de routing y la gestión de eventos globales.
 * 
 * @author Juan Diego Hernandez Martinez
 * @version 1.0.0
 */

// Importaciones de vistas
import Login from './app/views/login.js';
import Dashboard from './app/views/dashboard.js';
import CreateEvent from './app/views/create-event.js';
import Visitor from './app/views/visitor.js';
import EditEvent from './app/views/edit-event.js';
import Register from './app/views/register.js';
import MyEvents from './app/views/my-events.js';

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

/**
 * Renderiza una vista en el contenedor principal de la aplicación
 * @param {string} view - HTML de la vista a renderizar
 */
function render(view) {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.innerHTML = view;
  }
}

/**
 * Navega a una ruta específica usando hash navigation
 * @param {string} path - Ruta de destino
 */
export function navigate(path) {
  window.location.hash = path;
}

/**
 * Obtiene el usuario actual desde localStorage
 * @returns {Object|null} Usuario actual o null si no hay sesión
 */
function getCurrentUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

/**
 * Router principal de la aplicación SPA
 * Maneja la navegación y protección de rutas
 */
function router() {
  const user = getCurrentUser();
  let path = window.location.hash.replace('#', '');

  // Ruta por defecto
  if (path === '' || path === '/') {
    path = '/login';
  }

  // Rutas públicas
  if (path === '/register') {
    render(Register());
    return;
  }

  // Protección de rutas para usuarios no autenticados
  if (!user && path !== '/login') {
    navigate('/login');
    return;
  }

  if (path === '/login') {
    render(Login());
    return;
  }

  // Rutas para administradores
  if (user && user.role === 'admin') {
    switch (true) {
      case path === '/dashboard':
        render(Dashboard(user));
        loadEvents();
        break;
      case path === '/dashboard/events/create':
        render(CreateEvent(user));
        break;
      case path.startsWith('/dashboard/events/edit/'):
        const id = path.split('/').pop();
        loadEventForEdit(id);
        break;
      default:
        render('<h2>404 - Página no encontrada</h2>');
    }
    return;
  }

  // Rutas para visitantes
  if (user && user.role === 'visitor') {
    switch (path) {
      case '/dashboard':
        loadVisitorEvents();
        break;
      case '/dashboard/my-events':
        loadMyEvents();
        break;
      default:
        render('<h2>404 - Página no encontrada</h2>');
    }
    return;
  }

  render('<h2>Acceso no autorizado</h2>');
}

/**
 * Carga un evento específico para edición
 * @param {string} id - ID del evento a cargar
 */
async function loadEventForEdit(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) {
      throw new Error('Error al cargar el evento');
    }
    const event = await response.json();
    const user = getCurrentUser();
    render(EditEvent(event, user));
  } catch (error) {
    console.error('Error al cargar evento:', error);
    render('<h2>Error al cargar el evento</h2>');
  }
}

/**
 * Cierra la sesión del usuario y redirige al login
 */
function logout() {
  localStorage.removeItem('user');
  navigate('/login');
}

/**
 * Maneja la inscripción de un visitante a un evento
 * @param {string} eventId - ID del evento
 */
async function handleEnrollment(eventId) {
  const user = getCurrentUser();
  if (!user) {
    alert('Debes iniciar sesión para inscribirte');
    return;
  }

  try {
    // Verificar disponibilidad del evento
    const eventResponse = await fetch(`${API_BASE_URL}/events/${eventId}`);
    const event = await eventResponse.json();

    if (event.capacity <= 0) {
      alert('¡Evento agotado!');
      return;
    }

    // Reducir capacidad del evento
    await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capacity: event.capacity - 1 })
    });

    // Crear inscripción
    await fetch(`${API_BASE_URL}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        eventId: event.id
      })
    });

    alert('¡Inscripción exitosa!');
    loadVisitorEvents();
  } catch (error) {
    console.error('Error en inscripción:', error);
    alert('Error al inscribirse en el evento');
  }
}

/**
 * Elimina un evento (solo para administradores)
 * @param {string} eventId - ID del evento a eliminar
 */
async function deleteEvent(eventId) {
  if (!confirm('¿Estás seguro de eliminar este evento?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el evento');
    }

    alert('Evento eliminado exitosamente');
    loadEvents();
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    alert('Error al eliminar el evento');
  }
}

/**
 * Maneja el inicio de sesión
 * @param {FormData} formData - Datos del formulario de login
 */
async function handleLogin(formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const users = await response.json();

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      alert('Credenciales incorrectas');
    }
  } catch (error) {
    console.error('Error en login:', error);
    alert('Error al iniciar sesión');
  }
}

/**
 * Maneja el registro de nuevos usuarios
 * @param {FormData} formData - Datos del formulario de registro
 */
async function handleRegister(formData) {
  const username = formData.get('username');
  const password = formData.get('password');
  const image = formData.get('image');

  const newUser = {
    username,
    password,
    role: 'visitor',
    image: image || 'https://via.placeholder.com/50'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) {
      throw new Error('Error al registrar usuario');
    }

    alert('Usuario registrado exitosamente');
    navigate('/login');
  } catch (error) {
    console.error('Error en registro:', error);
    alert('Error al registrar usuario');
  }
}

/**
 * Maneja la creación de nuevos eventos
 * @param {FormData} formData - Datos del formulario de evento
 */
async function handleCreateEvent(formData) {
  const newEvent = {
    name: formData.get('name'),
    description: formData.get('description'),
    date: formData.get('date'),
    capacity: parseInt(formData.get('capacity')),
    image: formData.get('image') || ''
  };

  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });

    if (!response.ok) {
      throw new Error('Error al crear evento');
    }

    alert('Evento creado exitosamente');
    navigate('/dashboard');
  } catch (error) {
    console.error('Error al crear evento:', error);
    alert('Error al crear el evento');
  }
}

/**
 * Maneja la edición de eventos existentes
 * @param {FormData} formData - Datos del formulario de evento
 */
async function handleEditEvent(formData) {
  const id = formData.get('id');
  const updatedEvent = {
    name: formData.get('name'),
    description: formData.get('description'),
    date: formData.get('date'),
    capacity: parseInt(formData.get('capacity')),
    image: formData.get('image') || ''
  };

  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent)
    });

    if (!response.ok) {
      throw new Error('Error al actualizar evento');
    }

    alert('Evento actualizado exitosamente');
    navigate('/dashboard');
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    alert('Error al actualizar el evento');
  }
}

/**
 * Carga todos los eventos para el dashboard de administrador
 */
async function loadEvents() {
  const tableBody = document.getElementById('eventsTableBody');
  if (!tableBody) return;

  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    const events = await response.json();

    tableBody.innerHTML = '';

    if (events.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No se encontraron eventos</td></tr>`;
      return;
    }

    events.forEach(event => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${event.image || 'https://via.placeholder.com/50'}" class="event-thumb" alt="${event.name}"/></td>
        <td>${event.name}</td>
        <td>${event.description}</td>
        <td>${event.capacity}</td>
        <td>${event.date}</td>
        <td>
          <button class="btn edit-btn" data-id="${event.id}">✏️ Editar</button>
          <button class="btn delete-btn" data-id="${event.id}">🗑️ Eliminar</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar eventos:', error);
    tableBody.innerHTML = `<tr><td colspan="6">Error al cargar eventos</td></tr>`;
  }
}

/**
 * Carga eventos para la vista de visitantes
 */
async function loadVisitorEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    const events = await response.json();
    render(Visitor(events));
  } catch (error) {
    console.error('Error al cargar eventos para visitantes:', error);
    render('<h2>Error al cargar eventos</h2>');
  }
}

/**
 * Carga los eventos en los que está inscrito el usuario actual
 */
async function loadMyEvents() {
  const user = getCurrentUser();
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    const enrollmentsResponse = await fetch(`${API_BASE_URL}/enrollments?userId=${user.id}`);
    const enrollments = await enrollmentsResponse.json();

    if (enrollments.length === 0) {
      render(MyEvents([]));
      return;
    }

    const events = [];
    for (const enrollment of enrollments) {
      if (enrollment.eventId) {
        const eventResponse = await fetch(`${API_BASE_URL}/events/${enrollment.eventId}`);
        const event = await eventResponse.json();
        events.push(event);
      }
    }

    render(MyEvents(events));
  } catch (error) {
    console.error('Error al cargar mis eventos:', error);
    render('<h2>Error al cargar mis eventos</h2>');
  }
}

/**
 * Configura los event listeners globales de la aplicación
 */
function attachEvents() {
  // Event listeners para clicks
  document.addEventListener('click', (e) => {
    // Navegación
    if (e.target.id === 'createEventBtn') {
      navigate('/dashboard/events/create');
    }

    if (e.target.id === 'logoutBtn') {
      logout();
    }

    if (e.target.id === 'eventsBtn') {
      navigate('/dashboard');
    }

    if (e.target.id === 'cancelBtn') {
      navigate('/dashboard');
    }

    if (e.target.id === 'registerBtn') {
      navigate('/register');
    }

    if (e.target.id === 'myEventsBtn') {
      navigate('/dashboard/my-events');
    }

    // Acciones de eventos
    if (e.target.classList.contains('enroll-btn')) {
      const id = e.target.getAttribute('data-id');
      handleEnrollment(id);
    }

    if (e.target.classList.contains('edit-btn')) {
      const id = e.target.getAttribute('data-id');
      navigate(`/dashboard/events/edit/${id}`);
    }

    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.getAttribute('data-id');
      deleteEvent(id);
    }
  });

  // Event listeners para formularios
  document.addEventListener('submit', async (e) => {
    e.preventDefault();

    switch (e.target.id) {
      case 'loginForm':
        await handleLogin(new FormData(e.target));
        break;
      case 'registerForm':
        await handleRegister(new FormData(e.target));
        break;
      case 'createEventForm':
        await handleCreateEvent(new FormData(e.target));
        break;
      case 'editEventForm':
        await handleEditEvent(new FormData(e.target));
        break;
    }
  });
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  attachEvents();
  router();
  // Oculta el loading spinner
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';
});

// Escuchar cambios en el hash para navegación
window.addEventListener('hashchange', router);
