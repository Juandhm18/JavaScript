export default function Visitor(events = []) {
  // Recuperar usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {
    username: 'Anonymous',
    image: 'https://via.placeholder.com/50',
    role: 'visitor'
  };

  let rows = "";

  for (const ev of events) {
    const soldOut = ev.capacity <= 0;
    rows += `
      <tr>
        <td><img src="${ev.image || ''}" class="event-thumb" /></td>
        <td>${ev.name}</td>
        <td>${ev.description}</td>
        <td>${ev.capacity}</td>
        <td>${ev.date}</td>
        <td>
          ${
            soldOut
              ? `<span class="sold-out-btn">Sold out</span>`
              : `<button class="btn enroll-btn" data-id="${ev.id}">Enroll</button>`
          }
        </td>
      </tr>
    `;
  }

  return `
    <div class="container visitor-container">
      <div class="sidebar">
        <h2>Events</h2>
        <div class="user-box">
          <img src="${user.image || ''}" class="profile-img" width="80" height="80" />
          <p class="username">${user.username}</p>
          <span class="role">${user.role}</span>
        </div>
        <nav>
  <button class="btn" id="eventsBtn">Events</button>
  <button class="btn" id="myEventsBtn">My Events</button>
  <button class="btn" id="logoutBtn">Logout</button>
</nav>
      </div>
      <div class="content">
        <h1>Events</h1>
        <table class="events-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Capacity</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="6">No events found.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
