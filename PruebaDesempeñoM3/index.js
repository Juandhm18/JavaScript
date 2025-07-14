import Login from './app/views/login.js';
import Dashboard from './app/views/dashboard.js';
import CreateEvent from './app/views/create-event.js';
import Visitor from './app/views/visitor.js';
import EditEvent from './app/views/edit-event.js';
import Register from './app/views/register.js';
import MyEvents from './app/views/my-events.js'; // ✅ Importa la vista

// Función para renderizar vistas en #app
function render(view) {
  document.getElementById('app').innerHTML = view;
}

// CAMBIO: usar hash en lugar de pathname
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

  if (path === '/register') {
    render(Register());
    return;
  }

  if (!user && path !== '/login') {
    navigate('/login');
    return;
  }

  if (path === '/login') {
    render(Login());
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

window.addEventListener('hashchange', router);

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

    if (e.target && e.target.id === 'registerBtn') {
      navigate('/register');
    }

    if (e.target && e.target.id === 'myEventsBtn') {
      navigate('/dashboard/my-events');
    }

    // ENROLL VISITOR
    if (e.target && e.target.classList.contains('enroll-btn')) {
      const id = e.target.getAttribute('data-id');
      const user = JSON.parse(localStorage.getItem('user'));

      fetch(`http://localhost:3000/events/${id}`)
        .then(res => res.json())
        .then(event => {
          if (event.capacity > 0) {
            // Reduce capacity
            return fetch(`http://localhost:3000/events/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ capacity: event.capacity - 1 })
            }).then(async () => {
              // Guardar enrollment
              await fetch(`http://localhost:3000/enrollments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  eventId: event.id
                })
              });

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

    if (e.target && e.target.classList.contains('edit-btn')) {
      const id = e.target.getAttribute('data-id');
      navigate(`/dashboard/events/edit/${id}`);
    }

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

      try {
        const res = await fetch('http://localhost:3000/users');
        const users = await res.json();

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
        console.error(error);
        alert('Error al iniciar sesión.');
      }
      return;
    }

    if (e.target && e.target.id === 'registerForm') {
      e.preventDefault();

      const formData = new FormData(e.target);
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
        await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        alert('Usuario registrado con éxito.');
        navigate('/login');
      } catch (error) {
        console.error(error);
        alert('Error registrando usuario.');
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

async function loadMyEvents() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    const resEnrollments = await fetch(`http://localhost:3000/enrollments?userId=${user.id}`);
    const enrollments = await resEnrollments.json();

    if (enrollments.length === 0) {
      render(MyEvents([]));
      return;
    }

    const events = [];
    for (const enr of enrollments) {
      const resEv = await fetch(`http://localhost:3000/events/${enr.eventId}`);
      const ev = await resEv.json();
      events.push(ev);
    }

    render(MyEvents(events));
  } catch (error) {
    console.error('Error loading my events:', error);
    render('<h2>Error loading My Events.</h2>');
  }
}

attachEvents();
router();
