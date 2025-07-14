export default function EnrollmentsView(enrollments = []) {
  let rows = "";

  for (const enr of enrollments) {
    rows += `
      <tr>
        <td>${enr.username}</td>
        <td>${enr.eventName}</td>
      </tr>
    `;
  }

  return `
    <div class="main-content">
      <h1>Event Enrollments</h1>
      <table class="events-table">
        <thead>
          <tr>
            <th>Visitor</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="2">No enrollments found.</td></tr>`}
        </tbody>
      </table>
      <button id="eventsBtn" class="btn">Back</button>
    </div>
  `;
}
