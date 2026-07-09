// IT Support Dashboard Script
const itSupportSessionKey = "helpdesk-itsupport-session";
let currentTicketId = null;

// Check session
function checkSession() {
  const session = localStorage.getItem(itSupportSessionKey);
  if (!session) {
    window.location.href = "itsupport-login.html";
    return null;
  }
  return JSON.parse(session);
}

// Get current IT staff
const currentStaff = checkSession();

if (currentStaff) {
  document.querySelector("#staffName").textContent = currentStaff.name;
}

// Get all tickets
function getAllTickets() {
  try {
    return JSON.parse(localStorage.getItem("helpdesk-all-tickets")) || [];
  } catch {
    return [];
  }
}

// Update statistics
function updateStats() {
  const tickets = getAllTickets();
  document.querySelector("#totalTickets").textContent = tickets.length;
  document.querySelector("#newTickets").textContent = tickets.filter(
    (t) => t.status === "New"
  ).length;
  document.querySelector("#inProgressTickets").textContent = tickets.filter(
    (t) => t.status === "In Progress"
  ).length;
  document.querySelector("#resolvedTickets").textContent = tickets.filter(
    (t) => t.status === "Resolved"
  ).length;
}

// Render tickets
function renderTickets() {
  const tickets = getAllTickets();
  const statusFilter = document.querySelector("#statusFilter").value;
  const tbody = document.querySelector("#ticketsBody");

  let filtered = tickets;
  if (statusFilter) {
    filtered = tickets.filter((t) => t.status === statusFilter);
  }

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="9" style="text-align: center; color: #999;">No tickets found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (ticket) => `
    <tr>
      <td><strong>${ticket.id}</strong></td>
      <td>${ticket.employeeName}</td>
      <td>${ticket.department}</td>
      <td>${ticket.subject}</td>
      <td>${ticket.issueType}</td>
      <td><span class="priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
      <td><span class="status-${ticket.status.toLowerCase()}">${ticket.status}</span></td>
      <td>${ticket.createdAt}</td>
      <td>
        <button class="action-btn" onclick="openStatusModal('${ticket.id}')">
          Update Status
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

// Open status modal
function openStatusModal(ticketId) {
  currentTicketId = ticketId;
  const ticket = getAllTickets().find((t) => t.id === ticketId);
  document.querySelector("#modalTicketId").textContent = `Ticket: ${ticketId}`;
  document.querySelector("#newStatus").value = ticket.status;
  document.querySelector("#notes").value = "";
  document.querySelector("#statusModal").style.display = "flex";
}

// Close modal
function closeModal() {
  document.querySelector("#statusModal").style.display = "none";
  currentTicketId = null;
}

// Update status
function updateStatus() {
  const newStatus = document.querySelector("#newStatus").value;
  const notes = document.querySelector("#notes").value;

  let tickets = getAllTickets();
  const ticketIndex = tickets.findIndex((t) => t.id === currentTicketId);

  if (ticketIndex !== -1) {
    tickets[ticketIndex].status = newStatus;
    tickets[ticketIndex].updatedAt = new Date().toLocaleString();
    if (notes) {
      tickets[ticketIndex].notes = notes;
    }

    localStorage.setItem("helpdesk-all-tickets", JSON.stringify(tickets));
    closeModal();
    updateStats();
    renderTickets();
  }
}

// Filter listener
document.querySelector("#statusFilter").addEventListener("change", renderTickets);

// Logout
document.querySelector("#logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(itSupportSessionKey);
  window.location.href = "index.html";
});

// Initial render
updateStats();
renderTickets();
