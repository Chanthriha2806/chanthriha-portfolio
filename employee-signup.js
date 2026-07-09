const signupForm = document.querySelector("#signupForm");
const fullName = document.querySelector("#fullName");
const employeeNumber = document.querySelector("#employeeNumber");
const department = document.querySelector("#department");
const email = document.querySelector("#email");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const signupError = document.querySelector("#signupError");
const signupSuccess = document.querySelector("#signupSuccess");
const signupBtn = document.querySelector(".login-btn");

const apiBase = `${window.location.origin}/api`;
const employeesKey = "helpdesk-employees";

// Load existing employees
function getEmployees() {
  try {
    return JSON.parse(localStorage.getItem(employeesKey)) || [];
  } catch {
    return [];
  }
}

// Save employees
function saveEmployees(employees) {
  localStorage.setItem(employeesKey, JSON.stringify(employees));
}

// Show error
function showError(message) {
  signupError.textContent = message;
  signupError.style.display = "block";
  signupSuccess.style.display = "none";
}

// Show success
function showSuccess(message) {
  signupSuccess.textContent = message;
  signupSuccess.style.display = "block";
  signupError.style.display = "none";
}

// Validate signup
function validateSignup() {
  if (!fullName.value.trim()) {
    showError("Please enter your full name");
    return false;
  }

  if (!employeeNumber.value.trim()) {
    showError("Please enter your employee number");
    return false;
  }

  if (!department.value.trim()) {
    showError("Please enter your department");
    return false;
  }

  if (!email.value.trim() || !email.value.includes("@")) {
    showError("Please enter a valid email");
    return false;
  }

  if (!username.value.trim()) {
    showError("Please choose a username");
    return false;
  }

  if (password.value.length < 6) {
    showError("Password must be at least 6 characters");
    return false;
  }

  if (password.value !== confirmPassword.value) {
    showError("Passwords do not match");
    return false;
  }

  // Check if username already exists
  const employees = getEmployees();
  if (employees.some(emp => emp.username === username.value.trim())) {
    showError("Username already exists. Please choose another.");
    return false;
  }

  // Check if employee number already exists
  if (employees.some(emp => emp.employeeNumber === employeeNumber.value.trim())) {
    showError("Employee number already registered");
    return false;
  }

  return true;
}

// Handle signup
async function handleSignup(event) {
  event.preventDefault();
  signupError.style.display = "none";
  signupSuccess.style.display = "none";

  if (!validateSignup()) {
    return;
  }

  signupBtn.disabled = true;
  signupBtn.textContent = "Creating account...";

  const newEmployee = {
    id: `EMP-${Date.now()}`,
    fullName: fullName.value.trim(),
    employeeNumber: employeeNumber.value.trim(),
    department: department.value.trim(),
    email: email.value.trim(),
    username: username.value.trim(),
    password: password.value, // In production, this should be hashed!
    createdAt: new Date().toLocaleString(),
    role: "employee"
  };

  try {
    // Try to save to backend
    const response = await fetch(`${apiBase}/employee/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    });

    if (response.ok) {
      const data = await response.json();
      showSuccess("✓ Account created successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "employee-login.html";
      }, 2000);
      return;
    }
  } catch (error) {
    // Fallback to localStorage
    console.log("Backend offline, saving to localStorage");
  }

  // Save to localStorage as fallback
  const employees = getEmployees();
  employees.push(newEmployee);
  saveEmployees(employees);

  showSuccess("✓ Account created successfully! Redirecting to login...");
  setTimeout(() => {
    window.location.href = "employee-login.html";
  }, 2000);

  signupBtn.disabled = false;
  signupBtn.textContent = "Create Account";
}

signupForm.addEventListener("submit", handleSignup);
