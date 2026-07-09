const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");
const loginBtn = document.querySelector(".login-btn");

const apiBase = `${window.location.origin}/api`;
const itSupportSessionKey = "helpdesk-itsupport-session";
const itStaffKey = "helpdesk-itstaff";

// Default IT staff users
const defaultITStaff = [
  {
    id: "ITS-001",
    staffId: "itstaff1",
    name: "John Admin",
    password: "itsupport123",
    role: "itsupport",
    department: "IT Support",
  },
  {
    id: "ITS-002",
    staffId: "itstaff2",
    name: "Sarah Support",
    password: "itsupport123",
    role: "itsupport",
    department: "IT Support",
  },
];

// Initialize IT staff
function initializeITStaff() {
  const existing = localStorage.getItem(itStaffKey);
  if (!existing) {
    localStorage.setItem(itStaffKey, JSON.stringify(defaultITStaff));
  }
}

// Get IT staff
function getITStaff() {
  try {
    return JSON.parse(localStorage.getItem(itStaffKey)) || defaultITStaff;
  } catch {
    return defaultITStaff;
  }
}

// Show error
function showError(message) {
  loginError.textContent = message;
  loginError.style.display = "block";
}

// Create session
function createSession(staff) {
  const session = {
    id: staff.id,
    staffId: staff.staffId,
    name: staff.name,
    role: "itsupport",
    department: staff.department,
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem(itSupportSessionKey, JSON.stringify(session));
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  loginError.style.display = "none";
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  const staffId = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!staffId || !password) {
    showError("Please enter both staff ID and password");
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
    return;
  }

  const staff = getITStaff();
  const itMember = staff.find(
    member => member.staffId === staffId && member.password === password
  );

  if (itMember) {
    createSession(itMember);
    window.location.href = "itsupport-dashboard.html";
  } else {
    showError("Invalid staff ID or password");
  }

  loginBtn.disabled = false;
  loginBtn.textContent = "Login";
}

// Check existing session
function checkExistingSession() {
  const session = localStorage.getItem(itSupportSessionKey);
  if (session) {
    window.location.href = "itsupport-dashboard.html";
  }
}

initializeITStaff();
loginForm.addEventListener("submit", handleLogin);
checkExistingSession();

passwordInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    loginForm.dispatchEvent(new Event("submit"));
  }
});
