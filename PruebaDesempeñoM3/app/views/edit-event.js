export default function EditEvent(event, user = { username: 'Admin', role: 'admin' }) {
  return `
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="profile">
          <img src="https://static.toiimg.com/thumb/msid-121340289,width-1280,height-720,resizemode-4/121340289.jpg" alt="Profile" class="profile-pic"/>
          <h3>${user.username}</h3>
          <span class="role">${user.role}</span>
        </div>
        <nav>
          <button class="btn-nav" id="eventsBtn">📚 Events</button>
          <button class="btn-nav logout" id="logoutBtn">Logout 🔄</button>
        </nav>
      </aside>
      <main class="main-content">
        <div class="create-event-container">
          <h2 class="title">Edit Event</h2>
          <form id="editEventForm" class="event-form">
            <input type="hidden" name="id" value="${event.id}" />
            <div class="form-group">
              <label>Name</label>
              <input type="text" name="name" value="${event.name}" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea name="description" required>${event.description}</textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Date</label>
                <input type="date" name="date" value="${event.date}" required />
              </div>
              <div class="form-group">
                <label>Capacity</label>
                <input type="number" name="capacity" value="${event.capacity}" required />
              </div>
            </div>
            <div class="form-group">
              <label>Image (URL)</label>
              <input type="text" name="image" value="${event.image}" />
            </div>
            <div class="form-buttons">
              <button type="button" id="cancelBtn" class="btn cancel-btn">Cancel</button>
              <button type="submit" class="btn save-btn">Save</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `;
}
