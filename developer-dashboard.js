// Developer Dashboard Script
const developerSessionKey = "helpdesk-developer-session";

// Check session
function checkSession() {
  const session = localStorage.getItem(developerSessionKey);
  if (!session) {
    window.location.href = "developer-login.html";
    return null;
  }
  return JSON.parse(session);
}

checkSession();

// Get employees
function getEmployees() {
  try {
    return JSON.parse(localStorage.getItem("helpdesk-employees")) || [];
  } catch {
    return [];
  }
}

// Get tickets
function getTickets() {
  try {
    return JSON.parse(localStorage.getItem("helpdesk-all-tickets")) || [];
  } catch {
    return [];
  }
}

// Render employees
function renderEmployees() {
  const employees = getEmployees();
  const tbody = document.querySelector("#employeeBody");

  if (employees.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #999;">No employees registered</td></tr>';
    document.querySelector("#totalEmployees").textContent = 0;
    return;
  }

  tbody.innerHTML = employees
    .map(
      (emp) => `
    <tr>
      <td>${emp.employeeNumber}</td>
      <td>${emp.fullName}</td>
      <td>${emp.department}</td>
      <td>${emp.email}</td>
      <td>${emp.createdAt}</td>
    </tr>
  `
    )
    .join("");

  document.querySelector("#totalEmployees").textContent = employees.length;
}

// Render tickets
function renderTickets() {
  const tickets = getTickets();
  const tbody = document.querySelector("#ticketBody");

  if (tickets.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #999;">No tickets submitted</td></tr>';
    document.querySelector("#totalTickets").textContent = 0;
    document.querySelector("#activeTickets").textContent = 0;
    return;
  }

  tbody.innerHTML = tickets
    .map(
      (ticket) => `
    <tr>
      <td><strong>${ticket.id}</strong></td>
      <td>${ticket.employeeName}</td>
      <td><span class="priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
      <td><span class="status-${ticket.status.toLowerCase()}">${ticket.status}</span></td>
      <td>${ticket.createdAt}</td>
    </tr>
  `
    )
    .join("");

  document.querySelector("#totalTickets").textContent = tickets.length;
  const active = tickets.filter(
    (t) => t.status === "New" || t.status === "In Progress"
  ).length;
  document.querySelector("#activeTickets").textContent = active;
}

// Export data to CSV
function exportData() {
  const employees = getEmployees();
  const tickets = getTickets();

  let csv = "EMPLOYEES\n";
  csv += "Employee#,Name,Department,Email,Registered\n";
  employees.forEach((emp) => {
    csv += `${emp.employeeNumber},"${emp.fullName}","${emp.department}","${emp.email}","${emp.createdAt}"\n`;
  });

  csv += "\n\nTICKETS\n";
  csv += "TicketID,Employee,Department,Subject,Type,Priority,Status,Date\n";
  tickets.forEach((ticket) => {
    csv += `${ticket.id},"${ticket.employeeName}","${ticket.department}","${ticket.subject}","${ticket.issueType}","${ticket.priority}","${ticket.status}","${ticket.createdAt}"\n`;
  });

  // Download CSV
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `helpdesk-export-${new Date().getTime()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Logout
document.querySelector("#logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(developerSessionKey);
  window.location.href = "index.html";
});

// Initial render
renderEmployees();
renderTickets();
