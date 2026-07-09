// Employee Dashboard Script
const employeeSessionKey = "helpdesk-employee-session";
const employeeTicketsKey = "helpdesk-employee-tickets";

// Check session
function checkSession() {
  const session = localStorage.getItem(employeeSessionKey);
  if (!session) {
    window.location.href = "employee-login.html";
    return null;
  }
  return JSON.parse(session);
}

// Get current employee
const currentEmployee = checkSession();

if (currentEmployee) {
  document.querySelector("#userName").textContent = currentEmployee.fullName;
}

// Get employee tickets
function getEmployeeTickets() {
  try {
    const allTickets = JSON.parse(localStorage.getItem("helpdesk-all-tickets")) || [];
    return allTickets.filter(ticket => ticket.employeeId === currentEmployee.id);
  } catch {
    return [];
  }
}

// Render tickets
function renderTickets() {
  const tickets = getEmployeeTickets();
  const tbody = document.querySelector("#ticketsBody");

  if (tickets.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: #999;">No tickets submitted yet</td></tr>';
    return;
  }

  tbody.innerHTML = tickets
    .map(
      (ticket) => `
    <tr>
      <td><strong>${ticket.id}</strong></td>
      <td>${ticket.subject}</td>
      <td>${ticket.issueType}</td>
      <td><span class="priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
      <td><span class="status-${ticket.status.toLowerCase()}">${ticket.status}</span></td>
      <td>${ticket.createdAt}</td>
    </tr>
  `
    )
    .join("");
}

// Handle ticket submission
document.querySelector("#ticketForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const ticket = {
    id: `TKT-${Date.now()}`,
    employeeId: currentEmployee.id,
    employeeName: currentEmployee.fullName,
    employeeNumber: currentEmployee.employeeNumber,
    department: currentEmployee.department,
    email: currentEmployee.email,
    issueType: document.querySelector("#issueType").value,
    priority: document.querySelector("#priority").value,
    subject: document.querySelector("#subject").value,
    description: document.querySelector("#description").value,
    status: "New",
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  };

  // Save to localStorage
  let allTickets = JSON.parse(localStorage.getItem("helpdesk-all-tickets")) || [];
  allTickets.push(ticket);
  localStorage.setItem("helpdesk-all-tickets", JSON.stringify(allTickets));

  // Show message
  const msg = document.querySelector("#submitMessage");
  msg.textContent = `✓ Ticket ${ticket.id} submitted successfully!`;
  msg.style.display = "block";
  msg.className = "submit-message success";

  // Reset form
  document.querySelector("#ticketForm").reset();

  // Refresh table
  setTimeout(() => {
    renderTickets();
    msg.style.display = "none";
  }, 2000);
});

// Logout
document.querySelector("#logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(employeeSessionKey);
  window.location.href = "index.html";
});

// Initial render
renderTickets();
