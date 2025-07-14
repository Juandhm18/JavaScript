export default function Dashboard(user) {
  return `
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="profile">
          <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Profile" class="profile-pic"/>
          <h3>${user.username}</h3>
          <span class="role">${user.role}</span>
        </div>
        <nav>
          <button class="btn-nav" id="eventsBtn">📚 Events</button>
          <button class="btn-nav logout" id="logoutBtn">Logout 🔄</button>
        </nav>
      </aside>

      <main class="main-content">
        <div class="header">
          <h1>Events</h1>
          <button id="createEventBtn" class="btn create-btn">Add New Event</button>
        </div>
        <table class="events-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Capacity</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="eventsTableBody">
            <!-- Aquí se llenan dinámicamente los eventos -->
          </tbody>
        </table>
      </main>
    </div>
  `;
}
