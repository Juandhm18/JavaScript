export default function EditEvent(event) {
  return `
    <div class="container">
      <aside class="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><button id="eventsBtn">Eventos</button></li>
          <li><button id="logoutBtn">Cerrar sesión</button></li>
        </ul>
      </aside>
      <main class="main-content">
        <h1>Editar Evento</h1>
        <form id="editEventForm">
          <input type="hidden" name="id" value="${event.id}" />

          <label for="name">Nombre:</label>
          <input type="text" name="name" id="name" value="${event.name}" required />

          <label for="description">Descripción:</label>
          <textarea name="description" id="description" required>${event.description}</textarea>

          <label for="date">Fecha:</label>
          <input type="date" name="date" id="date" value="${event.date}" required />

          <label for="capacity">Capacidad:</label>
          <input type="number" name="capacity" id="capacity" value="${event.capacity}" required />

          <label for="image">Imagen (URL):</label>
          <input type="text" name="image" id="image" value="${event.image}" />

          <button type="submit" class="btn save-btn">Guardar cambios</button>
          <button type="button" id="cancelBtn" class="btn cancel-btn">Cancelar</button>
        </form>
      </main>
    </div>
  `;
}
