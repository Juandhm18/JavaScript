const API_URL = 'http://localhost:3000/peliculas';

// Renderiza estrellas y puntaje
function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} <span class="score">(${stars}/5)</span>`;
}

// Crea la tarjeta de película, con edición inline si corresponde
function createMovieCard(movie) {
  // Si la tarjeta está en modo edición, muestra inputs para editar
  if (window.editingCardId === movie.id) {
    return `
      <div class="movie-card editing" data-id="${movie.id}">
        <input type="text" class="edit-name" value="${movie.nombre}" placeholder="Name" aria-label="Edit name" />
        <input type="url" class="edit-photo" value="${movie.foto}" placeholder="Photo URL" aria-label="Edit photo" />
        <input type="number" class="edit-stars" value="${movie.estrellas}" min="0" max="5" step="1" placeholder="Stars (0-5)" aria-label="Edit stars" />
        <input type="text" class="edit-genre" value="${movie.genero}" placeholder="Genre" aria-label="Edit genre" />
        <div class="edit-actions">
          <button class="save-btn" data-id="${movie.id}">Save</button>
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    `;
  }
  // Tarjeta normal
  return `
    <div class="movie-card" data-id="${movie.id}">
      <img src="${movie.foto}" alt="${movie.nombre}" />
      <h3>${movie.nombre}</h3>
      <p><strong>Genre:</strong> ${movie.genero}</p>
      <p><strong>Stars:</strong> <span class="stars">${renderStars(movie.estrellas)}</span></p>
      <button class="edit-btn" data-id="${movie.id}">Edit</button>
      <button class="delete-btn" data-id="${movie.id}">Delete</button>
    </div>
  `;
}

function showFieldError(field, message) {
  const errorSpan = document.getElementById('error-' + field);
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.opacity = '1';
  }
}

function clearFieldErrors() {
  document.querySelectorAll('.field-error').forEach(span => {
    span.textContent = '';
    span.style.opacity = '0';
  });
}

// Muestra mensajes de error
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }, 4000);
  }
}

// Muestra todas las películas
function showMovies() {
  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch movies from server.');
      return res.json();
    })
    .then(movies => {
      const container = document.getElementById('movies-list');
      if (!Array.isArray(movies) || movies.length === 0) {
        container.innerHTML = '<p>No movies found.</p>';
        return;
      }
      container.innerHTML = movies.map(createMovieCard).join('');
      addCardEventListeners(); // Importante: agrega listeners a los botones de cada tarjeta
    })
    .catch(err => {
      showError('Error loading movies: ' + err.message);
      console.error(err);
    });
}

// Valida los datos de la película
function validateMovie(movie) {
  let valid = true;
  clearFieldErrors();
  if (!movie.nombre) {
    showFieldError('name', 'Name is required.');
    valid = false;
  }
  if (!movie.foto) {
    showFieldError('photo', 'Photo URL is required.');
    valid = false;
  }
  if (!movie.genero) {
    showFieldError('genre', 'Genre is required.');
    valid = false;
  }
  if (
    typeof movie.estrellas !== 'number' ||
    isNaN(movie.estrellas) ||
    movie.estrellas < 0 ||
    movie.estrellas > 5
  ) {
    showFieldError('stars', 'Stars must be a number between 0 and 5.');
    valid = false;
  }
  return valid;
}

// Estado global para saber qué tarjeta está en edición
window.editingCardId = null;

// Agrega listeners a los botones de las tarjetas (edit, delete, save, cancel)
function addCardEventListeners() {
  // Editar
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => {
      window.editingCardId = btn.getAttribute('data-id');
      showMovies();
    };
    btn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); };
  });
  // Eliminar
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      if (!confirm('Are you sure you want to delete this movie?')) return;
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Failed to delete movie.');
          showMovies();
        })
        .catch(err => {
          showError('Error deleting movie: ' + err.message);
          console.error(err);
        });
    };
    btn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); };
  });
  // Guardar edición
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest('.movie-card');
      const id = btn.getAttribute('data-id');
      const nombre = card.querySelector('.edit-name').value.trim();
      const foto = card.querySelector('.edit-photo').value.trim();
      const estrellas = Number(card.querySelector('.edit-stars').value);
      const genero = card.querySelector('.edit-genre').value.trim();
      const movieData = { nombre, foto, estrellas, genero };
      if (!validateMovie(movieData)) return;
      fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update movie.');
          window.editingCardId = null;
          showMovies();
        })
        .catch(err => {
          showError('Error updating movie: ' + err.message);
          console.error(err);
        });
    };
    btn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); };
  });
  // Cancelar edición
  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.onclick = () => {
      window.editingCardId = null;
      showMovies();
    };
    btn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); };
  });
}

// Mostrar/ocultar el formulario de agregar
function toggleAddForm(show) {
  const formSection = document.getElementById('form-section');
  if (typeof show === 'boolean') {
    if (show) {
      formSection.classList.add('visible');
      formSection.style.display = 'block';
    } else {
      formSection.classList.remove('visible');
      setTimeout(() => { formSection.style.display = 'none'; }, 400);
    }
    clearFieldErrors();
  } else {
    if (formSection.classList.contains('visible')) {
      formSection.classList.remove('visible');
      setTimeout(() => { formSection.style.display = 'none'; }, 400);
    } else {
      formSection.classList.add('visible');
      formSection.style.display = 'block';
    }
    clearFieldErrors();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Oculta el formulario al inicio
  toggleAddForm(false);
  showMovies();

  // Botón para mostrar el formulario de agregar
  const addBtn = document.getElementById('show-add-btn');
  addBtn.onclick = () => toggleAddForm(true);
  addBtn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') addBtn.click(); };

  // Botón cancelar en el formulario de agregar
  const cancelBtn = document.getElementById('cancel-add-btn');
  cancelBtn.onclick = () => toggleAddForm(false);
  cancelBtn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') cancelBtn.click(); };

  // Manejo del formulario de agregar
  const form = document.getElementById('form-movie');
  form.onsubmit = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('name').value.trim();
    const foto = document.getElementById('photo').value.trim();
    const estrellas = Number(document.getElementById('stars').value);
    const genero = document.getElementById('genre').value.trim();
    const movieData = { nombre, foto, estrellas, genero };
    if (!validateMovie(movieData)) return;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add movie.');
        return res.json();
      })
      .then(() => {
        showMovies();
        form.reset();
        toggleAddForm(false);
      })
      .catch(err => {
        showError('Error adding movie: ' + err.message);
        console.error(err);
      });
  };
}); 