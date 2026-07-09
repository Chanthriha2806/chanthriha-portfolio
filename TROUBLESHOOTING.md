# AI IT Help Desk Server - Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "Java not found" or "java is not recognized"

**Symptoms:**
- Error message when running RUN.bat or RUN.sh
- "java" command not found

**Solutions:**
1. **Download Java:**
   - Visit: https://www.java.com/download
   - Download Java 11 or higher
   - Run the installer

2. **Add Java to PATH (Windows):**
   - Open System Properties → Environment Variables
   - Add Java bin folder to PATH
   - Example: `C:\Program Files\Java\jdk-11\bin`
   - Restart your computer

3. **Verify Installation:**
   ```bash
   java -version
   javac -version
   ```

---

### Issue 2: "Port 8080 already in use"

**Symptoms:**
- Error: "Address already in use"
- Cannot connect to localhost:8080

**Solutions:**

**Option 1: Find and stop the conflicting process (Windows)**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Option 2: Find and stop the conflicting process (Mac/Linux)**
```bash
lsof -i :8080
kill -9 <PID>
```

**Option 3: Change the port**
1. Edit `HelpDeskServer.java` line 25:
   ```java
   private static final int PORT = 9000;  // Change from 8080
   ```
2. Recompile:
   ```bash
   javac HelpDeskServer.java
   jar cfe HelpDeskServer.jar HelpDeskServer HelpDeskServer.class
   ```
3. Run with new port: `http://localhost:9000`

---

### Issue 3: Login not working

**Symptoms:**
- "Invalid username or password" error
- Cannot login with correct credentials

**Solutions:**

1. **Check credentials exactly:**
   - Admin: `admin` (lowercase)
   - Password: `helpdesk123`

2. **Clear browser cache:**
   - Press: `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
   - Clear cookies and cache
   - Reload page

3. **Try different browser:**
   - Chrome, Firefox, Safari, Edge
   - Sometimes cookies get corrupted

4. **Check if backend is running:**
   - Look for "backend running at http://localhost:8080" in console

5. **Fallback to demo user:**
   - Use any username + `user123` as password

---

### Issue 4: Cannot access http://localhost:8080

**Symptoms:**
- "Cannot reach" error
- Connection refused

**Solutions:**

1. **Verify server is running:**
   - Check the console window
   - Should show: "AI IT Help Desk backend running at..."

2. **Try different addresses:**
   - `http://127.0.0.1:8080` (IP address)
   - `http://192.168.x.x:8080` (if accessing from another computer)

3. **Check firewall:**
   - Windows Firewall might block port 8080
   - Add Java to firewall exceptions

4. **Restart server:**
   - Stop: Ctrl+C in console
   - Start again: double-click RUN.bat

---

### Issue 5: Data not saving / Requests disappear

**Symptoms:**
- Submitted requests don't appear in table
- Chat history lost after refresh

**Solutions:**

1. **For requests (admin data):**
   - Check `data/helpdesk-requests.json` exists
   - Verify write permissions on the folder
   - Create `data` folder if missing: `mkdir data`

2. **For chat history (user data):**
   - Uses browser localStorage
   - Don't clear browser data
   - Try a different browser profile
   - Check browser privacy settings

3. **Backend login issue:**
   - May need to login as admin first
   - Use: `admin` / `helpdesk123`
   - Then requests will save to backend

---

### Issue 6: Slow performance

**Symptoms:**
- Pages load slowly
- Lag when typing
- Buttons unresponsive

**Solutions:**

1. **Check system resources:**
   - Close unnecessary programs
   - Free up RAM/Disk space
   - Check CPU usage

2. **Reduce browser extensions:**
   - Try in incognito/private mode
   - Disable browser extensions

3. **Optimize knowledge base search:**
   - Clear browser cache
   - Restart server

4. **Check network:**
   - If accessing from network, verify connection
   - Local access (127.0.0.1) should be fast

---

### Issue 7: "Request Export Failed"

**Symptoms:**
- Cannot export CSV
- CSV download doesn't start

**Solutions:**

1. **Must login as admin first:**
   - Username: `admin`
   - Password: `helpdesk123`

2. **Check permissions:**
   - Folder write permissions
   - Antivirus not blocking downloads

3. **Try local export instead:**
   - Uses browser localStorage
   - Works without admin login
   - Includes locally saved data

4. **Browser settings:**
   - Allow popups and downloads
   - Check download folder

---

### Issue 8: File permissions error

**Symptoms:**
- "Permission denied"
- Cannot write to data folder
- Error saving requests

**Solutions:**

**Windows:**
1. Right-click folder → Properties
2. Go to Security tab
3. Click Edit, select your user
4. Check "Full Control"
5. Click Apply

**Mac/Linux:**
```bash
chmod -R 755 data/
chmod -R 755 logs/
```

---

### Issue 9: Application crashes

**Symptoms:**
- Sudden close without error
- Application stops responding
- Black console window

**Solutions:**

1. **Check Java heap memory:**
   - Edit `RUN.bat`:
   ```bash
   java -Xmx512m -jar HelpDeskServer.jar
   ```

2. **Look for error messages:**
   - Scroll up in console
   - Save console output to file

3. **Try manual compilation:**
   ```bash
   javac HelpDeskServer.java
   java HelpDeskServer
   ```

4. **Update Java:**
   - Download latest Java version
   - Uninstall old version
   - Reinstall latest

---

### Issue 10: Setup script not running

**Symptoms:**
- INSTALL.bat doesn't work
- Permission denied on INSTALL.sh

**Solutions:**

**Windows:**
1. Right-click INSTALL.bat
2. Select "Run as administrator"
3. If still fails, edit and run manually

**Mac/Linux:**
```bash
chmod +x INSTALL.sh
bash INSTALL.sh
```

Or run commands manually:
```bash
mkdir -p data logs
touch config.properties
```

---

## Getting More Help

1. **Check console output:**
   - Keep the console window open
   - Look for error messages
   - Take screenshots

2. **Review logs:**
   - Check `logs/` directory
   - Some errors are logged there

3. **Verify setup:**
   - All HTML/CSS/JS files present
   - Java version compatible
   - Port not blocked

4. **Test basic connectivity:**
   ```bash
   curl http://localhost:8080/api/health
   ```

---

## Quick Diagnostic Commands

```bash
# Check Java installation
java -version
javac -version

# Check port availability
netstat -ano | findstr :8080  (Windows)
lsof -i :8080  (Mac/Linux)

# Test server health
curl http://localhost:8080/api/health

# Check firewall
netsh advfirewall show allprofiles  (Windows)

# List running processes
tasklist | findstr java  (Windows)
ps aux | grep java  (Mac/Linux)
```

---

**Need More Help?**

1. Check the SETUP-GUIDE.md for full documentation
2. Review source code comments in JavaScript files
3. Check browser console for errors (F12)
4. Verify all files are present in the directory
5. Try with a fresh copy of the application

---

**Last Updated:** 2026-07-08  
**Version:** 1.0
