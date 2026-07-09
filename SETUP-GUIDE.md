# AI IT Help Desk Server - Setup Guide

## Quick Start (Choose One)

### Windows Users
1. **Double-click** `INSTALL.bat` to set up directories
2. **Double-click** `RUN.bat` to start the server
3. Open browser: `http://localhost:8080`

### Mac/Linux Users
```bash
bash INSTALL.sh
bash RUN.sh
```

### Or Manually Run
```bash
java -jar HelpDeskServer.jar
```

---

## Login Credentials

| User Type | Username | Password |
|-----------|----------|----------|
| Admin | admin | helpdesk123 |
| Regular User | (any) | user123 |

---

## Features

✅ **AI-Powered Support Assistant**
- Intelligent issue categorization
- Priority and SLA detection
- Quick issue shortcuts
- Searchable knowledge base

✅ **Help Desk Ticketing**
- Submit support requests with form
- Auto-generate ticket IDs
- CSV export for requests
- Request history & tracking

✅ **Admin Dashboard**
- View all submitted requests
- Export data to CSV
- Manage request data
- Session-based access control

✅ **Authentication System**
- Login page with credentials
- Session management
- Remember me checkbox
- Admin and user roles

---

## File Structure

```
HelpDeskServer/
├── HelpDeskServer.jar          (Compiled executable)
├── HelpDeskServer.java         (Source code)
├── index.html                  (Main app)
├── login.html                  (Login page)
├── script.js                   (App logic)
├── login.js                    (Auth logic)
├── styles.css                  (App styling)
├── login-styles.css            (Login styling)
├── INSTALL.bat / INSTALL.sh    (Setup script)
├── RUN.bat / RUN.sh            (Launch script)
├── START.bat / START.sh        (Alternative launcher)
├── README.md                   (Documentation)
├── config.properties           (Settings)
├── data/                       (Data directory)
│   └── helpdesk-requests.json  (Stored requests)
└── logs/                       (Log directory)
```

---

## System Requirements

- **Java 11 or higher** (free download from java.com)
- **Any modern web browser**
- **Windows, Mac, or Linux**
- **Port 8080** available

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Check server status |
| POST | /api/login | Authenticate user |
| POST | /api/logout | End session |
| GET | /api/session | Check auth status |
| GET | /api/requests | Get all requests (admin only) |
| POST | /api/requests | Submit new request |
| DELETE | /api/requests | Clear all requests (admin only) |
| GET | /api/requests/export | Export to CSV (admin only) |

---

## Troubleshooting

### "Java not found"
- Install Java from https://www.java.com/download
- Restart your computer after installation
- Add Java to system PATH if needed

### "Port 8080 already in use"
- Change the port in `HelpDeskServer.java` (line 25)
- Recompile: `javac HelpDeskServer.java`
- Rebuild JAR: `jar cfe HelpDeskServer.jar HelpDeskServer HelpDeskServer.class`

### "Cannot connect to localhost:8080"
- Verify server is running (check console output)
- Check firewall settings
- Try: `http://127.0.0.1:8080`

### "Login not working"
- Use exact credentials: `admin` / `helpdesk123`
- Clear browser cache and cookies
- Try a different browser

---

## Data Storage

- Requests stored in: `data/helpdesk-requests.json`
- Browser data (chat, state) in: localStorage
- No external database required
- All data persists between sessions

---

## Customization

### Change Admin Password
Edit `HelpDeskServer.java` lines 27-28:
```java
private static final String ADMIN_PASSWORD = "yourNewPassword";
```

### Change Server Port
Edit `HelpDeskServer.java` line 25:
```java
private static final int PORT = 9000;
```

### Add Knowledge Articles
Edit `script.js` knowledge base array (lines ~200+)

After changes, recompile:
```bash
javac HelpDeskServer.java
jar cfe HelpDeskServer.jar HelpDeskServer HelpDeskServer.class
```

---

## Features by User Type

### For All Users
- Chat-style support assistant
- Issue categorization
- Priority detection
- SLA guidance
- Copy/download tickets
- Knowledge base search
- Quick issue shortcuts

### For Admin (username: admin)
- View all submitted requests
- Export data to CSV
- Clear request database
- Access admin panel
- Backend data management

---

## Performance

- Supports up to 8 concurrent connections
- Lightweight (no external dependencies)
- Fast response times
- Efficient JSON storage
- Scales for small-to-medium teams

---

## Security Notes

- Demo credentials for testing only
- Change admin password before production use
- Use HTTPS in production (add SSL/TLS)
- Restrict network access if needed
- Regular backups of helpdesk-requests.json

---

## Support & Updates

For issues or updates, check:
- Project documentation
- Source code comments
- API endpoint logs

---

**Version:** 1.0  
**Last Updated:** 2026-07-08  
**License:** Free to use and modify
