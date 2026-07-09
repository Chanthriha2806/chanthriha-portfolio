const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");
const loginBtn = document.querySelector(".login-btn");

const apiBase = `${window.location.origin}/api`;
const developerSessionKey = "helpdesk-developer-session";

// Show error
function showError(message) {
  loginError.textContent = message;
  loginError.style.display = "block";
}

// Create session
function createSession(devId) {
  const session = {
    id: devId,
    role: "developer",
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem(developerSessionKey, JSON.stringify(session));
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  loginError.style.display = "none";
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  const devId = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!devId || !password) {
    showError("Please enter both developer ID and password");
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
    return;
  }

  // Demo credentials
  if (devId === "developer" && password === "dev@123") {
    createSession(devId);
    window.location.href = "developer-dashboard.html";
  } else {
    showError("Invalid developer ID or password");
  }

  loginBtn.disabled = false;
  loginBtn.textContent = "Login";
}

// Check existing session
function checkExistingSession() {
  const session = localStorage.getItem(developerSessionKey);
  if (session) {
    window.location.href = "developer-dashboard.html";
  }
}

loginForm.addEventListener("submit", handleLogin);
checkExistingSession();

passwordInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    loginForm.dispatchEvent(new Event("submit"));
  }
});
