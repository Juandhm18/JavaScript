export default function MyEvents(events = []) {
  let rows = "";

  for (const ev of events) {
    rows += `
      <tr>
        <td><img src="${ev.image || 'https://via.placeholder.com/50'}" class="event-thumb" /></td>
        <td>${ev.name}</td>
        <td>${ev.description}</td>
        <td>${ev.date}</td>
      </tr>
    `;
  }

  return `
    <div class="container visitor-container">
      <div class="sidebar">
        <h2>My Events</h2>
        <nav>
          <button class="btn" id="eventsBtn">Events</button>
          <button class="btn" id="logoutBtn">Logout</button>
        </nav>
      </div>
      <div class="content">
        <h1>My Enrolled Events</h1>
        <table class="events-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="4">You have no enrolled events.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
