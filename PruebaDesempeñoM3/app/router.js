import Login from './app/views/login.js';
import Dashboard from './app/views/dashboard.js';
import CreateEvent from './app/views/create-event.js';
import Visitor from './app/views/visitor.js';
import EditEvent from './app/views/edit-event.js';
import Register from './app/views/register.js';
import MyEventsView from './app/views/my-events.js';

// Función para renderizar vistas en #app
function render(view) {
  document.getElementById('app').innerHTML = view;
}

// 👉 CAMBIO: Usar hash en lugar de pathname
export function navigate(path) {
  window.location.hash = path;
}

// Router para SPA usando hash
function router() {
  const user = JSON.parse(localStorage.getItem('user'));
  let path = window.location.hash.replace('#', '');

  if (path === '' || path === '/') {
    path = '/login';
  }

  if (!user && path !== '/login' && path !== '/register') {
    navigate('/login');
    return;
  }

  if (path === '/login') {
    render(Login());
    return;
  }

  if (path === '/register') {
    render(Register());
    return;
  }

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
        fetch(`http://localhost:3000/events/${id}`)
          .then(res => res.json())
          .then(event => {
            render(EditEvent(event));
          })
          .catch(() => render('<h2>Error al cargar el evento</h2>'));
        break;
      default:
        render('<h2>404 Not Found</h2>');
    }
    return;
  }

  if (user && user.role === 'visitor') {
    switch (path) {
      case '/dashboard':
        loadVisitorEvents();
        break;
      case '/dashboard/my-events':
        loadMyEvents();
        break;
      default:
        render('<h2>404 Not Found</h2>');
    }
    return;
  }

  render('<h2>Unauthorized</h2>');
}

// Evento para que el router escuche cambios en el hash
window.addEventListener('hashchange', router);

// Escuchar clicks y submits globales
function attachEvents() {
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'createEventBtn') {
      navigate('/dashboard/events/create');
    }

    if (e.target && e.target.id === 'logoutBtn') {
      localStorage.removeItem('user');
      navigate('/login');
    }

    if (e.target && e.target.id === 'eventsBtn') {
      navigate('/dashboard');
    }

    if (e.target && e.target.id === 'cancelBtn') {
      navigate('/dashboard');
    }

    if (e.target && e.target.id === 'myEventsBtn') {
      navigate('/dashboard/my-events');
    }

    // 👉 ENROLL VISITOR
    if (e.target && e.target.classList.contains('enroll-btn')) {
      const id = e.target.getAttribute('data-id');
      const user = JSON.parse(localStorage.getItem('user'));

      fetch(`http://localhost:3000/events/${id}`)
        .then(res => res.json())
        .then(event => {
          if (event.capacity > 0) {
            return fetch(`http://localhost:3000/events/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ capacity: event.capacity - 1 })
            }).then(() => {
              // Guardar enrollment
              return fetch(`http://localhost:3000/enrollments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  eventId: event.id,
                  userId: user.id
                })
              });
            }).then(() => {
              alert('Successfully enrolled!');
              loadVisitorEvents();
            });
          } else {
            alert('Event is sold out!');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Error enrolling!');
        });
    }

    // 👉 EDIT BUTTON
    if (e.target && e.target.classList.contains('edit-btn')) {
      const id = e.target.getAttribute('data-id');
      navigate(`/dashboard/events/edit/${id}`);
    }

    // 👉 DELETE BUTTON
    if (e.target && e.target.classList.contains('delete-btn')) {
      const id = e.target.getAttribute('data-id');

      if (confirm('¿Estás seguro de eliminar este evento?')) {
        fetch(`http://localhost:3000/events/${id}`, {
          method: 'DELETE'
        })
          .then(() => {
            alert('Evento eliminado.');
            loadEvents();
          })
          .catch(err => {
            console.error(err);
            alert('Error eliminando el evento.');
          });
      }
    }
  });

  document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'loginForm') {
      e.preventDefault();

      const formData = new FormData(e.target);
      const username = formData.get('username');
      const password = formData.get('password');

      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem(
          'user',
          JSON.stringify({ id: 1, username, role: 'admin' })
        );
        navigate('/dashboard');
      } else if (username === 'Salome' && password === 'salo123') {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: 2,
            username,
            role: 'visitor',
            image: 'https://i.pravatar.cc/150?img=47'
          })
        );
        navigate('/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }

      return;
    }

    if (e.target && e.target.id === 'createEventForm') {
      e.preventDefault();

      const formData = new FormData(e.target);
      const newEvent = {
        name: formData.get('name'),
        description: formData.get('description'),
        date: formData.get('date'),
        capacity: parseInt(formData.get('capacity')),
        image: formData.get('image') || ''
      };

      try {
        await fetch('http://localhost:3000/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent)
        });

        alert('Event created!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }

    if (e.target && e.target.id === 'editEventForm') {
      e.preventDefault();

      const formData = new FormData(e.target);
      const id = formData.get('id');

      const updatedEvent = {
        name: formData.get('name'),
        description: formData.get('description'),
        date: formData.get('date'),
        capacity: parseInt(formData.get('capacity')),
        image: formData.get('image') || ''
      };

      try {
        await fetch(`http://localhost:3000/events/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedEvent)
        });

        alert('Evento actualizado');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error updating event:', error);
        alert('Error al actualizar el evento');
      }
    }
  });
}

// 🔥 Función para cargar los eventos (admin)
async function loadEvents() {
  const tableBody = document.getElementById('eventsTableBody');
  if (!tableBody) return;

  try {
    const res = await fetch('http://localhost:3000/events');
    const events = await res.json();

    tableBody.innerHTML = '';

    if (events.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No events found.</td></tr>`;
      return;
    }

    for (const event of events) {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td><img src="${event.image || 'https://via.placeholder.com/50'}" class="event-thumb"/></td>
        <td>${event.name}</td>
        <td>${event.description}</td>
        <td>${event.capacity}</td>
        <td>${event.date}</td>
        <td>
          <button class="btn edit-btn" data-id="${event.id}">✏️ Edit</button>
          <button class="btn delete-btn" data-id="${event.id}">🗑️ Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error('Error loading events:', error);
    tableBody.innerHTML = `<tr><td colspan="6">Error loading events.</td></tr>`;
  }
}

// 🔥 Función para cargar eventos (visitor)
async function loadVisitorEvents() {
  try {
    const res = await fetch('http://localhost:3000/events');
    const events = await res.json();

    render(Visitor(events));
  } catch (error) {
    console.error('Error loading visitor events:', error);
    render('<h2>Error loading events.</h2>');
  }
}

// 🔥 Función para cargar mis eventos (visitor)
async function loadMyEvents() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  try {
    const [eventsRes, enrollmentsRes] = await Promise.all([
      fetch('http://localhost:3000/events'),
      fetch('http://localhost:3000/enrollments')
    ]);

    const events = await eventsRes.json();
    const enrollments = await enrollmentsRes.json();

    const userEnrollments = enrollments.filter(enr => enr.userId === user.id);

    const enrolledEvents = userEnrollments
      .map(enr => events.find(ev => ev.id === enr.eventId))
      .filter(Boolean);

    render(MyEventsView(enrolledEvents));
  } catch (error) {
    console.error(error);
    render('<h2>Error loading your enrolled events.</h2>');
  }
}

// 🚀 Inicializar la app
attachEvents();
router();
