const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const userInput = document.querySelector("#userInput");
const clearChat = document.querySelector("#clearChat");
const exportTicket = document.querySelector("#exportTicket");
const downloadTicket = document.querySelector("#downloadTicket");
const requestForm = document.querySelector("#requestForm");
const fullName = document.querySelector("#fullName");
const emailAddress = document.querySelector("#emailAddress");
const department = document.querySelector("#department");
const phoneNumber = document.querySelector("#phoneNumber");
const issueType = document.querySelector("#issueType");
const formPriority = document.querySelector("#formPriority");
const problemDescription = document.querySelector("#problemDescription");
const requestsTable = document.querySelector("#requestsTable");
const requestCount = document.querySelector("#requestCount");
const exportCsv = document.querySelector("#exportCsv");
const clearRequests = document.querySelector("#clearRequests");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminUsername = document.querySelector("#adminUsername");
const adminPassword = document.querySelector("#adminPassword");
const adminLoginStatus = document.querySelector("#adminLoginStatus");
const logoutAdmin = document.querySelector("#logoutAdmin");
const kbSearch = document.querySelector("#kbSearch");
const kbResults = document.querySelector("#kbResults");
const deviceType = document.querySelector("#deviceType");
const urgency = document.querySelector("#urgency");
const requesterName = document.querySelector("#requesterName");
const assetInfo = document.querySelector("#assetInfo");
const detectedCategory = document.querySelector("#detectedCategory");
const detectedPriority = document.querySelector("#detectedPriority");
const nextAction = document.querySelector("#nextAction");
const slaTarget = document.querySelector("#slaTarget");
const template = document.querySelector("#messageTemplate");
const transcript = [];
const storageKey = "ai-it-help-desk-state";
const requestsKey = "ai-it-help-desk-requests";
const sessionKey = "helpdesk-user-session";
const apiBase = `${window.location.origin}/api`;

// Check if user is logged in
function checkUserSession() {
  const session = localStorage.getItem(sessionKey);
  if (!session) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Verify session before loading page
if (!checkUserSession()) {
  throw new Error("Not authenticated");
}

let savedRequests = loadRequests();
const ticketId = `IT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(
  1000 + Math.random() * 9000,
)}`;

const starters = [
  "Hello. I can help with IT support, Windows, networking, printers, SQL, backups, and common software issues.\n\nTell me what is happening, what device or service is affected, and any error message you see.",
];

const knowledgeBase = [
  {
    id: "wifi-no-internet",
    keywords: ["wifi", "wi-fi", "no internet", "connected", "internet", "dns"],
    title: "Wi-Fi Connected but No Internet",
    category: "Network / Wi-Fi",
    priority: "P2 - User Impact",
    nextAction: "Check IP, DNS, router, and ISP status",
    answer:
      "Most likely causes: router issue, weak signal, bad DNS, expired DHCP lease, or a problem from the internet provider.\n\n1. Confirm whether other devices have internet on the same Wi-Fi.\n2. Turn Wi-Fi off and on, then reconnect.\n3. Restart the router and wait 2 minutes.\n4. On Windows, open Command Prompt and run:\n<code>ipconfig /release\nipconfig /renew\nipconfig /flushdns</code>\n5. Check IP settings. If the address starts with 169.254, Windows did not receive an IP address from DHCP.\n6. Try changing DNS to 8.8.8.8 or 1.1.1.1.\n7. If all devices are affected, contact the ISP or network administrator.",
  },
  {
    id: "windows-install-sop",
    keywords: ["sop", "windows 11", "install windows", "installation"],
    title: "SOP for Installing Windows 11",
    category: "System Administration",
    priority: "P4 - Service Request",
    nextAction: "Prepare backup, media, license, and driver checklist",
    answer:
      "Purpose: Install Windows 11 safely and consistently.\n\n1. Back up user data to OneDrive, external drive, or approved backup storage.\n2. Confirm hardware requirements: TPM 2.0, Secure Boot, supported CPU, 4 GB RAM minimum, and 64 GB storage minimum.\n3. Download the official Windows 11 ISO or Media Creation Tool.\n4. Create a bootable USB drive of at least 8 GB.\n5. Record device name, asset tag, Windows license status, and required applications.\n6. Boot from USB and choose the correct edition.\n7. Delete or format only the intended system partition after backup confirmation.\n8. Complete setup, create or join the correct user/domain account, and run Windows Update.\n9. Install drivers, antivirus or endpoint protection, Office, VPN, and business applications.\n10. Restore user data and verify Wi-Fi, audio, camera, printer, browser, and email.\n11. Document completion date, technician name, installed software, and any exceptions.",
  },
  {
    id: "slow-network",
    keywords: ["slow network", "slow internet", "network slow", "latency", "bandwidth"],
    title: "Slow Office Network",
    category: "Network Performance",
    priority: "P2 - Multi-user Risk",
    nextAction: "Compare wired, Wi-Fi, DNS, and WAN utilization",
    answer:
      "Start with the easiest checks before changing network equipment.\n\n1. Check whether slowness affects one user, one department, or everyone.\n2. Run a speed test on wired and wireless connections.\n3. Restart the router, firewall, or access point during an approved maintenance window.\n4. Check for large downloads, cloud backups, Windows updates, or video meetings using bandwidth.\n5. Test latency with:\n<code>ping 8.8.8.8\nping google.com\ntracert google.com</code>\n6. If ping by IP works but domain names are slow, check DNS.\n7. If Wi-Fi is slow but wired is fine, check signal strength, channel interference, and access point placement.\n8. Review switch port errors, firewall CPU, WAN utilization, and VLAN configuration.\n9. For ongoing issues, collect timestamps, affected users, speed results, and device logs for escalation.",
  },
  {
    id: "sql-salary",
    keywords: ["sql", "salary", "query", "select", "database"],
    title: "SQL Query Help",
    category: "Database / SQL",
    priority: "P4 - Information Request",
    nextAction: "Confirm table and column names",
    answer:
      "Example query to find employees with salaries above 50000:\n<code>SELECT employee_id, employee_name, department, salary\nFROM employees\nWHERE salary > 50000\nORDER BY salary DESC;</code>\nIf your column or table names are different, replace employees, employee_name, department, and salary with the names from your database.",
  },
  {
    id: "password-reset",
    keywords: ["password", "reset", "forgot password", "locked"],
    title: "Windows Password Reset",
    category: "Identity and Access",
    priority: "P3 - Access Issue",
    nextAction: "Verify account type and use approved reset flow",
    answer:
      "Use the approved reset method for the account type.\n\n1. If it is a Microsoft account, reset it at account.microsoft.com/password/reset.\n2. If it is a work or school account, use the company self-service password reset portal if available.\n3. If the device is domain joined, ask IT or a domain administrator to reset the password in Active Directory or Entra ID.\n4. After reset, connect to the office network or VPN before signing in if cached credentials are outdated.\n5. If BitLocker recovery appears, contact IT with the recovery key ID shown on screen.\n\nDo not use unofficial password bypass tools on company devices.",
  },
  {
    id: "printer",
    keywords: ["printer", "print", "spooler", "queue"],
    title: "Printer Troubleshooting",
    category: "Printer Support",
    priority: "P3 - Peripheral Issue",
    nextAction: "Check queue, spooler, driver, and printer network status",
    answer:
      "1. Confirm the printer is powered on, online, and has paper and toner.\n2. Check whether other users can print to the same printer.\n3. Clear stuck print jobs from Settings > Bluetooth & devices > Printers & scanners.\n4. Restart the Windows Print Spooler:\n<code>net stop spooler\nnet start spooler</code>\n5. Confirm the correct printer is selected as default.\n6. Reinstall the printer driver if print jobs fail repeatedly.\n7. For network printers, ping the printer IP address and confirm it is on the correct VLAN.",
  },
  {
    id: "backup",
    keywords: ["backup", "restore", "recovery", "lost file"],
    title: "Backup and Recovery",
    category: "Backup / Recovery",
    priority: "P2 - Data Risk",
    nextAction: "Stop changes and verify latest available backup",
    answer:
      "1. Stop using the affected device or folder if files were deleted recently.\n2. Check Recycle Bin, OneDrive version history, SharePoint version history, or file server snapshots.\n3. Confirm the last known good backup date.\n4. Restore to a temporary location first, then verify file contents.\n5. Document what was restored, from which backup date, and who approved the recovery.\n6. For failed disks, avoid repeated reboot attempts and contact IT for recovery handling.",
  },
  {
    id: "office",
    keywords: ["outlook", "excel", "word", "office", "teams"],
    title: "Microsoft Office Support",
    category: "Productivity Apps",
    priority: "P3 - Application Issue",
    nextAction: "Check sign-in, safe mode, add-ins, and repair",
    answer:
      "1. Restart the Office app and check whether the issue happens in another file or only one file.\n2. Confirm Microsoft 365 sign-in status and license activation.\n3. Open the app in safe mode. Example for Outlook:\n<code>outlook.exe /safe</code>\n4. Disable recently added add-ins.\n5. Run Office repair from Settings > Apps > Installed apps > Microsoft 365 > Modify.\n6. If Outlook is affected, create a new profile from Control Panel > Mail.\n7. Capture exact error text before escalating.",
  },
  {
    id: "vpn",
    keywords: ["vpn", "remote access", "cannot connect vpn", "globalprotect", "forticlient", "anyconnect"],
    title: "VPN Connection Issue",
    category: "Remote Access",
    priority: "P3 - Connectivity Issue",
    nextAction: "Verify internet, credentials, MFA, client version, and VPN profile",
    answer:
      "1. Confirm normal internet works before opening VPN.\n2. Check username, password, and MFA approval.\n3. Restart the VPN client and try another network such as mobile hotspot.\n4. Confirm the system date and time are correct.\n5. Update the VPN client if it is outdated.\n6. Flush DNS and renew IP if the VPN connects but internal apps do not open:\n<code>ipconfig /flushdns\nipconfig /release\nipconfig /renew</code>\n7. Capture the exact VPN error code and send it to IT if the issue continues.",
  },
  {
    id: "bitlocker",
    keywords: ["bitlocker", "recovery key", "recovery screen", "blue screen key"],
    title: "BitLocker Recovery",
    category: "Endpoint Security",
    priority: "P2 - Device Access",
    nextAction: "Collect recovery key ID and verify authorized user",
    answer:
      "BitLocker protects the drive, so recovery must follow company identity checks.\n\n1. Do not repeatedly restart the laptop.\n2. Note the Recovery Key ID shown on screen.\n3. Contact IT or the device administrator with the asset tag and Recovery Key ID.\n4. IT can check Microsoft Entra ID, Active Directory, or the device management portal for the key.\n5. After unlock, check for recent BIOS, TPM, docking station, or hardware changes.",
  },
  {
    id: "windows-update",
    keywords: ["windows update", "update failed", "patch", "0x800", "restart pending"],
    title: "Windows Update Failure",
    category: "Windows Maintenance",
    priority: "P3 - Maintenance Issue",
    nextAction: "Check disk space, restart status, and update services",
    answer:
      "1. Restart the PC and try Windows Update again.\n2. Confirm at least 20 GB free disk space.\n3. Disconnect unnecessary USB devices.\n4. Run the Windows Update troubleshooter from Settings > System > Troubleshoot.\n5. Open Command Prompt as Administrator and run:\n<code>sfc /scannow\nDISM /Online /Cleanup-Image /RestoreHealth</code>\n6. Record the error code, such as 0x800..., before escalating.",
  },
  {
    id: "email-delivery",
    keywords: ["email", "mail", "outlook", "not receiving", "not sending", "smtp", "spam"],
    title: "Email Sending or Receiving Issue",
    category: "Email Support",
    priority: "P3 - Communication Issue",
    nextAction: "Check webmail, mailbox quota, rules, junk folder, and service health",
    answer:
      "1. Test email in webmail first to separate Outlook issues from mailbox issues.\n2. Check Junk Email, Focused Inbox, rules, and blocked senders.\n3. Confirm mailbox storage is not full.\n4. Send a test email to yourself and to an external address.\n5. If Outlook is the only problem, start it in safe mode:\n<code>outlook.exe /safe</code>\n6. If many users are affected, check Microsoft 365 service health or mail server status.",
  },
  {
    id: "dhcp-ip",
    keywords: ["dhcp", "ip address", "169.254", "default gateway", "subnet", "ip conflict"],
    title: "IP Address or DHCP Issue",
    category: "Network / DHCP",
    priority: "P2 - Connectivity Issue",
    nextAction: "Check IP lease, gateway, DHCP scope, and duplicate address risk",
    answer:
      "1. Run this command and check IPv4 Address, Default Gateway, and DNS Servers:\n<code>ipconfig /all</code>\n2. If the IP starts with 169.254, the device did not receive a DHCP address.\n3. Try:\n<code>ipconfig /release\nipconfig /renew</code>\n4. Confirm the network cable, switch port, Wi-Fi SSID, and VLAN are correct.\n5. If multiple users are affected, check DHCP scope availability and DHCP server status.\n6. If there is an IP conflict warning, disconnect the device and ask IT to identify duplicate assignments.",
  },
  {
    id: "cybersecurity",
    keywords: ["virus", "malware", "phishing", "suspicious email", "security", "ransomware"],
    title: "Cybersecurity Incident Guidance",
    category: "Security Incident",
    priority: "P1 - Security Risk",
    nextAction: "Isolate device, preserve evidence, and notify security team",
    answer:
      "Treat suspicious security activity carefully.\n\n1. Disconnect the device from Wi-Fi or unplug Ethernet if malware is suspected.\n2. Do not delete suspicious emails, files, or browser history.\n3. Do not enter passwords after clicking a suspicious link.\n4. Take screenshots of warnings, sender address, links, or file names.\n5. Report immediately to IT security or the help desk.\n6. Change passwords from a different trusted device if credentials may be exposed.",
  },
];

function addMessage(role, text, title = "") {
  const node = template.content.firstElementChild.cloneNode(true);
  const avatar = node.querySelector(".avatar");
  const strong = node.querySelector("strong");
  const body = node.querySelector(".message-body");
  const copy = node.querySelector(".copy-btn");

  node.classList.add(role);
  avatar.textContent = role === "user" ? "U" : "AI";
  strong.textContent = role === "user" ? "You" : title || "AI Support Assistant";
  body.innerHTML = text;

  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(body.innerText);
      copy.textContent = "Copied";
    } catch {
      copy.textContent = "Select text";
    }
    window.setTimeout(() => {
      copy.textContent = "Copy";
    }, 1400);
  });

  chatLog.appendChild(node);
  transcript.push({
    role: role === "user" ? "User" : strong.textContent,
    text: body.innerText,
  });
  saveState();
  chatLog.scrollTop = chatLog.scrollHeight;
}

function findBestResponse(input) {
  const text = input.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const item of knowledgeBase) {
    const score = item.keywords.reduce((total, keyword) => {
      return total + (text.includes(keyword) ? keyword.length : 0);
    }, 0);

    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }

  if (best) {
    return best;
  }

  return {
    title: "General IT Triage",
    category: "General IT",
    priority: "P3 - Normal",
    nextAction: "Collect issue details",
    answer:
      "I need a little more detail to give the best fix. Please share the device, operating system, exact error message, when it started, and whether other users are affected.\n\nGeneral first checks:\n1. Restart the affected app or device.\n2. Confirm power, cable, Wi-Fi, VPN, or account sign-in status.\n3. Note any recent updates, password changes, or network changes.\n4. Try the same task with another user account or device if available.\n5. Capture a screenshot or exact error text for the IT team.",
  };
}

function addContext(response) {
  const selectedDevice = deviceType.value;
  const selectedUrgency = urgency.value;
  const escalation =
    selectedUrgency === "Critical"
      ? "\n\nEscalation: Because this is marked Critical, contact the IT support team immediately after collecting affected user count, screenshots, and business impact."
      : selectedUrgency === "High"
        ? "\n\nEscalation: If the issue affects multiple users or a business-critical task, raise a high-priority ticket with timestamps and test results."
        : "\n\nEscalation: If these steps do not resolve the issue, create a support ticket with the troubleshooting results.";

  return `Device / Service: ${selectedDevice}\nUrgency: ${selectedUrgency}\n\n${response.answer}${escalation}`;
}

function updateTicketSnapshot(response) {
  const selectedUrgency = urgency.value;
  detectedCategory.textContent = response.category;
  detectedPriority.textContent =
    selectedUrgency === "Critical"
      ? "P1 - Critical"
      : selectedUrgency === "High"
        ? response.priority.replace("P3", "P2").replace("P4", "P3")
        : response.priority;
  nextAction.textContent = response.nextAction;
  updateSla();
  saveState();
}

function updateSla() {
  const priority = detectedPriority.textContent;
  let target = "Next business day";
  let className = "sla-normal";

  if (priority.startsWith("P1")) {
    target = "Immediate response";
    className = "sla-critical";
  } else if (priority.startsWith("P2")) {
    target = "4 business hours";
    className = "sla-high";
  } else if (priority.startsWith("P4")) {
    target = "3 business days";
  }

  slaTarget.textContent = target;
  slaTarget.className = className;
}

function submitPrompt(prompt) {
  const trimmed = prompt.trim();
  if (!trimmed) return;

  addMessage("user", escapeHtml(trimmed));
  const response = findBestResponse(trimmed);
  updateTicketSnapshot(response);
  addMessage("assistant", addContext(response), response.title);
}

function buildTicketExport() {
  const requester = requesterName.value.trim() || "Not provided";
  const asset = assetInfo.value.trim() || "Not provided";
  const latestUserMessage = [...transcript].reverse().find((item) => item.role === "User");
  const transcriptText = transcript
    .map((item) => `${item.role}:\n${item.text}`)
    .join("\n\n");

  return [
    "AI IT HELP DESK TICKET",
    `Ticket ID: ${ticketId}`,
    `Created: ${new Date().toLocaleString()}`,
    `Requester: ${requester}`,
    `Asset / Location: ${asset}`,
    `Device / Service: ${deviceType.value}`,
    `Urgency: ${urgency.value}`,
    `Detected Category: ${detectedCategory.textContent}`,
    `Recommended Priority: ${detectedPriority.textContent}`,
    `SLA Target: ${slaTarget.textContent}`,
    `Next Action: ${nextAction.textContent}`,
    `Issue Summary: ${latestUserMessage ? latestUserMessage.text : "No user issue entered yet."}`,
    "",
    "Conversation Transcript",
    transcriptText || "No conversation yet.",
  ].join("\n");
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem(requestsKey)) || [];
  } catch {
    localStorage.removeItem(requestsKey);
    return [];
  }
}

function saveRequests() {
  localStorage.setItem(requestsKey, JSON.stringify(savedRequests));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

async function loadRequestsFromBackend() {
  try {
    savedRequests = await apiRequest("/requests");
    saveRequests();
    renderRequests();
    setLoginStatus("Backend admin data loaded.", "success");
  } catch {
    renderRequests();
  }
}

function setLoginStatus(message, type = "") {
  adminLoginStatus.textContent = message;
  adminLoginStatus.className = `login-status ${type}`.trim();
}

async function checkAdminSession() {
  try {
    const session = await apiRequest("/session");
    if (session.authenticated) {
      setLoginStatus("Logged in as admin.", "success");
      await loadRequestsFromBackend();
    }
  } catch {
    setLoginStatus("Backend offline or not logged in. User submissions still work locally.", "error");
  }
}

function renderRequests() {
  requestCount.textContent = `${savedRequests.length} request${savedRequests.length === 1 ? "" : "s"} saved`;
  requestsTable.innerHTML = "";

  if (savedRequests.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="empty-row" colspan="8">No request data submitted yet.</td>`;
    requestsTable.appendChild(row);
    return;
  }

  savedRequests.forEach((request) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(request.id)}</td>
      <td>${escapeHtml(request.name)}</td>
      <td>${escapeHtml(request.email)}</td>
      <td>${escapeHtml(request.department)}</td>
      <td>${escapeHtml(request.issueType)}</td>
      <td>${escapeHtml(request.priority)}</td>
      <td><span class="status-badge">${escapeHtml(request.status)}</span></td>
      <td>${escapeHtml(request.createdAt)}</td>
    `;
    requestsTable.appendChild(row);
  });
}

function buildCsv() {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Department",
    "Phone",
    "Issue Type",
    "Priority",
    "Status",
    "Description",
    "Created At",
  ];
  const rows = savedRequests.map((request) => [
    request.id,
    request.name,
    request.email,
    request.department,
    request.phone,
    request.issueType,
    request.priority,
    request.status,
    request.description,
    request.createdAt,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

async function createRequestFromForm() {
  const request = {
    id: `REQ-${String(savedRequests.length + 1).padStart(3, "0")}`,
    name: fullName.value.trim(),
    email: emailAddress.value.trim(),
    department: department.value.trim(),
    phone: phoneNumber.value.trim() || "Not provided",
    issueType: issueType.value,
    priority: formPriority.value,
    status: "New",
    description: problemDescription.value.trim(),
    createdAt: new Date().toLocaleString(),
  };

  try {
    const savedRequest = await apiRequest("/requests", {
      method: "POST",
      body: JSON.stringify(request),
    });
    savedRequests.unshift(savedRequest);
  } catch {
    savedRequests.unshift(request);
  }

  saveRequests();
  renderRequests();

  requesterName.value = `${request.name} (${request.email})`;
  assetInfo.value = `${request.department}${request.phone !== "Not provided" ? ` - ${request.phone}` : ""}`;
  urgency.value = request.priority;
  submitPrompt(`${request.issueType}: ${request.description}`);
  saveState();
}

function saveState() {
  const state = {
    requesterName: requesterName.value,
    assetInfo: assetInfo.value,
    deviceType: deviceType.value,
    urgency: urgency.value,
    detectedCategory: detectedCategory.textContent,
    detectedPriority: detectedPriority.textContent,
    nextAction: nextAction.textContent,
    slaTarget: slaTarget.textContent,
    transcript,
  };
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function restoreState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    addMessage("assistant", starters[0]);
    return;
  }

  try {
    const state = JSON.parse(raw);
    requesterName.value = state.requesterName || "";
    assetInfo.value = state.assetInfo || "";
    deviceType.value = state.deviceType || deviceType.value;
    urgency.value = state.urgency || urgency.value;
    detectedCategory.textContent = state.detectedCategory || "General IT";
    detectedPriority.textContent = state.detectedPriority || "P3 - Normal";
    nextAction.textContent = state.nextAction || "Collect issue details";
    slaTarget.textContent = state.slaTarget || "Next business day";
    updateSla();

    if (Array.isArray(state.transcript) && state.transcript.length > 0) {
      state.transcript.forEach((item) => {
        const role = item.role === "User" ? "user" : "assistant";
        addMessage(role, escapeHtml(item.text), item.role === "User" ? "" : item.role);
      });
      return;
    }
  } catch {
    localStorage.removeItem(storageKey);
  }

  addMessage("assistant", starters[0]);
}

function renderKnowledgeBase() {
  const query = kbSearch.value.trim().toLowerCase();
  const matches = knowledgeBase
    .filter((item) => {
      const haystack = `${item.title} ${item.category} ${item.keywords.join(" ")}`.toLowerCase();
      return !query || haystack.includes(query);
    })
    .slice(0, 5);

  kbResults.innerHTML = "";

  if (matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "kb-empty";
    empty.textContent = "No matching articles";
    kbResults.appendChild(empty);
    return;
  }

  matches.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "kb-card";
    button.innerHTML = `<strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(
      item.category,
    )} - ${escapeHtml(item.nextAction)}</span>`;
    button.addEventListener("click", () => {
      submitPrompt(item.title);
    });
    kbResults.appendChild(button);
  });
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitPrompt(userInput.value);
  userInput.value = "";
  userInput.focus();
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    submitPrompt(button.dataset.prompt);
  });
});

clearChat.addEventListener("click", () => {
  chatLog.innerHTML = "";
  transcript.length = 0;
  detectedCategory.textContent = "General IT";
  detectedPriority.textContent = "P3 - Normal";
  nextAction.textContent = "Collect issue details";
  updateSla();
  localStorage.removeItem(storageKey);
  addMessage("assistant", starters[0]);
});

exportTicket.addEventListener("click", async () => {
  const ticket = buildTicketExport();
  try {
    await navigator.clipboard.writeText(ticket);
    exportTicket.textContent = "Copied";
  } catch {
    addMessage("assistant", escapeHtml(ticket), "Ticket Export");
    exportTicket.textContent = "Added to Chat";
  }
  window.setTimeout(() => {
    exportTicket.textContent = "Copy Ticket";
  }, 1600);
});

downloadTicket.addEventListener("click", () => {
  downloadTextFile(`${ticketId}.txt`, buildTicketExport());
});

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createRequestFromForm();
  requestForm.reset();
});

exportCsv.addEventListener("click", async () => {
  try {
    const csv = await apiRequest("/requests/export");
    downloadTextFile("help-desk-requests.csv", csv);
  } catch (error) {
    if (error.status === 401) {
      setLoginStatus("Login required before exporting backend data.", "error");
      return;
    }
    downloadTextFile("help-desk-requests.csv", buildCsv());
  }
});

clearRequests.addEventListener("click", async () => {
  try {
    await apiRequest("/requests", { method: "DELETE" });
  } catch (error) {
    if (error.status === 401) {
      setLoginStatus("Login required before clearing backend data.", "error");
      return;
    }
    // Local fallback is cleared below.
  }
  savedRequests = [];
  saveRequests();
  renderRequests();
});

adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({
        username: adminUsername.value.trim(),
        password: adminPassword.value,
      }),
    });
    setLoginStatus("Logged in as admin.", "success");
    await loadRequestsFromBackend();
  } catch {
    setLoginStatus("Invalid login. Use admin / helpdesk123 for this demo.", "error");
  }
});

logoutAdmin.addEventListener("click", async () => {
  try {
    await apiRequest("/logout", { method: "POST" });
  } catch {
    // The UI can still reset even if the backend is unavailable.
  }
  // Perform full logout
  localStorage.removeItem(sessionKey);
  localStorage.removeItem(storageKey);
  localStorage.removeItem(requestsKey);
  window.location.href = "login.html";
});

kbSearch.addEventListener("input", renderKnowledgeBase);
requesterName.addEventListener("input", saveState);
assetInfo.addEventListener("input", saveState);
deviceType.addEventListener("change", saveState);
urgency.addEventListener("change", () => {
  const lastUserMessage = [...transcript].reverse().find((item) => item.role === "User");
  if (lastUserMessage) {
    updateTicketSnapshot(findBestResponse(lastUserMessage.text));
  }
  saveState();
});

// Display current user and setup quick logout
function initializeUserSession() {
  const session = localStorage.getItem(sessionKey);
  if (session) {
    try {
      const parsed = JSON.parse(session);
      const currentUser = document.querySelector("#currentUser");
      const quickLogout = document.querySelector("#quickLogout");
      
      if (currentUser) {
        currentUser.textContent = parsed.username;
      }
      
      if (quickLogout) {
        quickLogout.addEventListener("click", async () => {
          try {
            await apiRequest("/logout", { method: "POST" });
          } catch {
            // Backend may be offline
          }
          localStorage.removeItem(sessionKey);
          localStorage.removeItem(storageKey);
          localStorage.removeItem(requestsKey);
          window.location.href = "login.html";
        });
      }
    } catch (error) {
      console.error("Error parsing session:", error);
    }
  }
}

renderKnowledgeBase();
initializeUserSession();
loadRequestsFromBackend();
checkAdminSession();
restoreState();
