# AI IT Help Desk Assistant

A responsive AI IT help desk project for IT support triage and user request collection. It includes a browser frontend and an optional Java backend for saving and exporting help desk requests.

## Features

- Chat-style IT support assistant
- Ticket context fields for requester, asset, device, and urgency
- Quick issue shortcuts for common support requests
- Searchable local knowledge base
- Automatic category, priority, and next-action detection
- SLA target guidance based on detected priority
- Copyable troubleshooting responses
- Copyable and downloadable plain-text support ticket
- Browser-saved ticket context and chat transcript
- Responsive user request form
- Local saved request table
- CSV export for submitted help desk data
- Java backend API for request storage and CSV export

## Built-in Support Areas

Windows, Wi-Fi, VPN, BitLocker, printers, DHCP/IP, slow networks, Microsoft Office, email, backups, SQL, Windows Update, password resets, and cybersecurity incidents.

## Run

### Frontend only

Open `index.html` in a web browser.

### With Java backend

Compile and run:

```powershell
javac HelpDeskServer.java
java HelpDeskServer
```

Then open:

```text
http://localhost:8080
```

The backend stores submitted requests in `helpdesk-requests.json`.

## Backend API

- `GET /api/health`
- `GET /api/requests`
- `POST /api/requests`
- `DELETE /api/requests`
- `GET /api/requests/export`

No external Java libraries are required.
