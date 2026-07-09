const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");
const loginBtn = document.querySelector(".login-btn");

const apiBase = `${window.location.origin}/api`;
const employeeSessionKey = "helpdesk-employee-session";
const employeesKey = "helpdesk-employees";

// Demo employee
const demoEmployee = {
  id: "EMP-001",
  username: "john",
  password: "user123",
  fullName: "John Doe",
  employeeNumber: "EMP-001",
  department: "IT",
  email: "john@company.com",
  createdAt: new Date().toLocaleString(),
};

// Initialize demo employee
function initializeDemoEmployee() {
  const existing = localStorage.getItem(employeesKey);
  if (!existing) {
    localStorage.setItem(employeesKey, JSON.stringify([demoEmployee]));
  }
}

// Load employees from localStorage
function getEmployees() {
  try {
    return JSON.parse(localStorage.getItem(employeesKey)) || [];
  } catch {
    return [];
  }
}

// Show error
function showError(message) {
  loginError.textContent = message;
  loginError.style.display = "block";
}

// Create session
function createSession(employee) {
  const session = {
    id: employee.id,
    username: employee.username,
    fullName: employee.fullName,
    employeeNumber: employee.employeeNumber,
    department: employee.department,
    email: employee.email,
    role: "employee",
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem(employeeSessionKey, JSON.stringify(session));
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  loginError.style.display = "none";
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showError("Please enter both username and password");
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
    return;
  }

  try {
    // Try backend first
    const response = await fetch(`${apiBase}/employee/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const employee = await response.json();
      createSession(employee);
      window.location.href = "employee-dashboard.html";
      return;
    }
  } catch (error) {
    console.log("Backend offline, checking localStorage");
  }

  // Fallback to localStorage
  const employees = getEmployees();
  const employee = employees.find(
    emp => emp.username === username && emp.password === password
  );

  if (employee) {
    createSession(employee);
    window.location.href = "employee-dashboard.html";
  } else {
    showError("Invalid username or password");
  }

  loginBtn.disabled = false;
  loginBtn.textContent = "Login";
}

// Check existing session
function checkExistingSession() {
  const session = localStorage.getItem(employeeSessionKey);
  if (session) {
    window.location.href = "employee-dashboard.html";
  }
}

initializeDemoEmployee();
loginForm.addEventListener("submit", handleLogin);
checkExistingSession();

passwordInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    loginForm.dispatchEvent(new Event("submit"));
  }
});
