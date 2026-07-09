const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const rememberMe = document.querySelector("#rememberMe");
const loginError = document.querySelector("#loginError");
const loginBtn = document.querySelector(".login-btn");

const apiBase = `${window.location.origin}/api`;
const sessionKey = "helpdesk-user-session";
const rememberKey = "helpdesk-remember-user";

// Check if user is already logged in
function checkExistingSession() {
  const session = localStorage.getItem(sessionKey);
  if (session) {
    redirectToApp();
  }

  // Restore remembered username
  const remembered = localStorage.getItem(rememberKey);
  if (remembered) {
    usernameInput.value = remembered;
    rememberMe.checked = true;
  }
}

// Login function
async function performLogin(username, password) {
  loginError.style.display = "none";
  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in...";

  try {
    // Try admin login first (for backend admin access)
    const response = await fetch(`${apiBase}/login`, {
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
      // Admin login successful
      const data = await response.json();
      createUserSession(username, true);
      redirectToApp();
      return;
    }

    // If admin login fails, allow any user with password "user123"
    if (password === "user123") {
      createUserSession(username, false);
      redirectToApp();
      return;
    }

    // Login failed
    showError("Invalid username or password");
  } catch (error) {
    console.error("Login error:", error);
    // If backend is offline, allow demo user
    if (username === "admin" && password === "helpdesk123") {
      createUserSession(username, true);
      redirectToApp();
      return;
    }
    if (password === "user123") {
      createUserSession(username, false);
      redirectToApp();
      return;
    }
    showError("Connection error. Check backend or use demo credentials.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Sign In";
  }
}

// Create session
function createUserSession(username, isAdmin) {
  const session = {
    username: username,
    isAdmin: isAdmin,
    loginTime: new Date().toISOString(),
  };

  localStorage.setItem(sessionKey, JSON.stringify(session));

  // Handle remember me
  if (rememberMe.checked) {
    localStorage.setItem(rememberKey, username);
  } else {
    localStorage.removeItem(rememberKey);
  }
}

// Show error message
function showError(message) {
  loginError.textContent = message;
  loginError.style.display = "block";
  passwordInput.value = "";
  passwordInput.focus();
}

// Redirect to main app
function redirectToApp() {
  window.location.href = "index.html";
}

// Logout function (called from index.html)
function performLogout() {
  localStorage.removeItem(sessionKey);
  localStorage.removeItem(rememberKey);
  window.location.href = "login.html";
}

// Form submit handler
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showError("Please enter both username and password");
    return;
  }

  await performLogin(username, password);
});

// Check session on page load
checkExistingSession();

// Allow Enter key in password field
passwordInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    loginForm.dispatchEvent(new Event("submit"));
  }
});

// Clear error on input
usernameInput.addEventListener("input", () => {
  if (loginError.style.display !== "none") {
    loginError.style.display = "none";
  }
});
