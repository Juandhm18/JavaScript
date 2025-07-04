const API_URL = 'http://localhost:3000/peliculas';

async function obtenerPeliculas() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch movies from server.');
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching movies:", err.message);
    throw err;
  }
}

async function agregarPelicula(movieData) {
  try {
    if (!validateMovie(movieData)) return false;
    
    // Check for duplicates
    const peliculas = await obtenerPeliculas();
    const existe = peliculas.some(p =>
      p.nombre.toLowerCase() === movieData.nombre.toLowerCase() &&
      p.genero.toLowerCase() === movieData.genero.toLowerCase()
    );
    if (existe) {
      showError("Movie already exists. Not added.");
      return false;
    }
    
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData)
    });
    if (!res.ok) throw new Error('Failed to add movie.');
    return await res.json();
  } catch (err) {
    console.error("❌ Error adding movie:", err.message);
    showError('Error adding movie: ' + err.message);
    return false;
  }
}

async function actualizarPelicula(id, movieData) {
  try {
    if (!validateMovie(movieData)) return false;
    
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData)
    });
    if (!res.ok) throw new Error('Failed to update movie.');
    return await res.json();
  } catch (err) {
    console.error("❌ Error updating movie:", err.message);
    showError('Error updating movie: ' + err.message);
    return false;
  }
}

async function eliminarPelicula(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Movie not found or couldn't be deleted.");
    return true;
  } catch (err) {
    console.error("❌ Error deleting movie:", err.message);
    showError('Error deleting movie: ' + err.message);
    return false;
  }
}

// Render stars and score
function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} <span class="score">(${stars}/5)</span>`;
}

// Create movie card, with inline editing if applicable
function createMovieCard(movie) {
  // If the card is in edit mode, show inputs for editing
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
  // Normal card
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

// Show error messages
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

// Show all movies
async function showMovies() {
  try {
    const movies = await obtenerPeliculas();
    const container = document.getElementById('movies-list');
    if (!Array.isArray(movies) || movies.length === 0) {
      container.innerHTML = '<p>No movies found.</p>';
      return;
    }
    container.innerHTML = movies.map(createMovieCard).join('');
    addCardEventListeners();
  } catch (err) {
    showError('Error loading movies: ' + err.message);
    console.error(err);
  }
}

// Validate movie data
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

// Global state to know which card is being edited
window.editingCardId = null;

// Add listeners to card buttons (edit, delete, save, cancel)
function addCardEventListeners() {
  // Edit
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => {
      window.editingCardId = btn.getAttribute('data-id');
      showMovies();
    };
    btn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); };
  });
  
  // Delete
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      if (!confirm('Are you sure you want to delete this movie?')) return;
      
      const success = await eliminarPelicula(id);
      if (success) showMovies();
    };
    btn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); };
  });
  
  // Save edit
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.onclick = async () => {
      const card = btn.closest('.movie-card');
      const id = btn.getAttribute('data-id');
      const movieData = {
        nombre: card.querySelector('.edit-name').value.trim(),
        foto: card.querySelector('.edit-photo').value.trim(),
        estrellas: Number(card.querySelector('.edit-stars').value),
        genero: card.querySelector('.edit-genre').value.trim()
      };
      
      const success = await actualizarPelicula(id, movieData);
      if (success) {
        window.editingCardId = null;
        showMovies();
      }
    };
    btn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); };
  });
  
  // Cancel edit
  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.onclick = () => {
      window.editingCardId = null;
      showMovies();
    };
    btn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); };
  });
}

// Show/hide add form
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
  // Hide form at startup
  toggleAddForm(false);
  showMovies();

  // Button to show add form
  const addBtn = document.getElementById('show-add-btn');
  addBtn.onclick = () => toggleAddForm(true);
  addBtn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') addBtn.click(); };

  // Cancel button in add form
  const cancelBtn = document.getElementById('cancel-add-btn');
  cancelBtn.onclick = () => toggleAddForm(false);
  cancelBtn.onkeyup = e => { if (e.key === 'Enter' || e.key === ' ') cancelBtn.click(); };

  // Handle add form
  const form = document.getElementById('form-movie');
  form.onsubmit = async function(e) {
    e.preventDefault();
    const movieData = {
      nombre: document.getElementById('name').value.trim(),
      foto: document.getElementById('photo').value.trim(),
      estrellas: Number(document.getElementById('stars').value),
      genero: document.getElementById('genre').value.trim()
    };
    
    const success = await agregarPelicula(movieData);
    if (success) {
      showMovies();
      form.reset();
      toggleAddForm(false);
    }
  };
}); 