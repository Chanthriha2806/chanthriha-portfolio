# 🎯 Multi-Portal Help Desk System - Complete Guide

## **System Overview**

Your Help Desk now has **3 separate portals** for different users:

```
┌─────────────────────────────────────────────────┐
│         Main Portal (index.html)                 │
│        Select Your Role                         │
└────────────┬──────────┬──────────┬──────────────┘
             │          │          │
      ┌──────▼─┐  ┌─────▼────┐  ┌─▼────────┐
      │Employee │  │IT Support│  │Developer │
      │Portal   │  │Portal    │  │Portal    │
      └────────┘  └──────────┘  └──────────┘
```

---

## **Portal 1: Employee Portal**

### For: Regular employees submitting IT support tickets

### **Features:**
✅ **Signup** - Create account with name, employee number, department
✅ **Login** - Secure employee login
✅ **Submit Tickets** - Report IT issues
✅ **View My Tickets** - Track submitted requests
✅ **Ticket Status** - See resolution status

### **How to Use:**

**Step 1: Access**
```
http://localhost:8080 → Click "Employee" → Create Account
```

**Step 2: Signup Form (First Time)**
- Full Name
- Employee Number (e.g., EMP-001)
- Department (e.g., Sales, HR)
- Email
- Username (choose your own)
- Password (create custom password)

**Step 3: Login**
- Username + Password you created

**Step 4: Submit Ticket**
- Select Issue Type
- Choose Priority
- Add Subject
- Write Description
- Click Submit

**Step 5: View Tickets**
- See all your submitted tickets
- Check status
- See creation date

### **Data Stored:**
```
helpdesk-employees (localStorage)
helpdesk-all-tickets (localStorage)
```

---

## **Portal 2: IT Support Portal**

### For: IT support staff managing all tickets

### **Features:**
✅ **View All Tickets** - See every submitted ticket
✅ **Filter by Status** - New, In Progress, Resolved
✅ **Update Status** - Change ticket status
✅ **Add Notes** - Add resolution notes
✅ **Statistics** - View dashboard metrics
✅ **Employee Info** - See requester details

### **How to Use:**

**Step 1: Access**
```
http://localhost:8080 → Click "IT Support" → Login
```

**Step 2: Login (Demo Credentials)**
```
ID: itstaff1
Password: itsupport123

OR

ID: itstaff2
Password: itsupport123
```

**Step 3: Dashboard**
- See statistics (New, In Progress, Resolved tickets)
- View all employee tickets
- Filter by status

**Step 4: Update Status**
- Click "Update Status" on any ticket
- Change status: New → In Progress → Resolved
- Add notes/comments
- Click Update

### **Dashboard Metrics:**
- **Total Tickets** - All submissions
- **New Tickets** - Not yet started
- **In Progress** - Being worked on
- **Resolved** - Completed

---

## **Portal 3: Developer Portal**

### For: System administrators and analytics

### **Features:**
✅ **View All Employees** - See registered users
✅ **View All Tickets** - System-wide analytics
✅ **Export Data** - Download CSV reports
✅ **System Stats** - Overview of activity
✅ **Employee Management** - Monitor registrations
✅ **Data Export** - CSV format

### **How to Use:**

**Step 1: Access**
```
http://localhost:8080 → Click "Developer" → Login
```

**Step 2: Login (Demo Credentials)**
```
ID: developer
Password: dev@123
```

**Step 3: Dashboard Features**

**View Statistics:**
- Registered Employees
- IT Support Staff
- Total Tickets
- Active Tickets

**View All Employees:**
- Employee Number
- Full Name
- Department
- Email
- Registration Date

**View All Tickets:**
- Ticket ID
- Assigned Employee
- Priority Level
- Current Status
- Submission Date

**Step 4: Export Data**
- Click "📥 Export CSV"
- Downloads all employee and ticket data
- Can be opened in Excel/Google Sheets

---

## **Complete Login Credentials**

### **Employee Portal**
```
Signup: Create your own account
  OR
Demo Employee:
  Username: john
  Password: user123
```

### **IT Support Portal**
```
ID: itstaff1
Password: itsupport123

OR

ID: itstaff2
Password: itsupport123
```

### **Developer Portal**
```
ID: developer
Password: dev@123
```

---

## **Data Flow**

```
1. EMPLOYEE Portal
   └─ Creates Account → Stores in helpdesk-employees
   └─ Submits Ticket → Stores in helpdesk-all-tickets

2. IT SUPPORT Portal
   └─ Reads helpdesk-all-tickets
   └─ Updates Status
   └─ Adds Notes
   └─ Saves back to helpdesk-all-tickets

3. DEVELOPER Portal
   └─ Reads all data
   └─ Shows Analytics
   └─ Exports to CSV
   └─ Generates Reports
```

---

## **File Structure**

```
New Files Created:
├── index.html                    (Role Selection Portal)
├── portal-styles.css             (Portal Styling)
│
├── employee-signup.html          (Employee Registration)
├── employee-signup.js
├── employee-login.html           (Employee Login)
├── employee-login.js
├── employee-dashboard.html       (Employee Dashboard)
├── employee-dashboard.js
│
├── itsupport-login.html          (IT Staff Login)
├── itsupport-login.js
├── itsupport-dashboard.html      (IT Dashboard)
├── itsupport-dashboard.js
│
├── developer-login.html          (Developer Login)
├── developer-login.js
├── developer-dashboard.html      (Developer Dashboard)
├── developer-dashboard.js
│
└── dashboard-styles.css          (Dashboard Styling)
```

---

## **Quick Start**

### **First Time?**

1. **Start Server**
   ```bash
   # Windows
   double-click RUN.bat
   
   # Mac/Linux
   bash RUN.sh
   ```

2. **Open Browser**
   ```
   http://localhost:8080
   ```

3. **Choose Your Role:**
   - 👤 Employee → Create Account → Submit Tickets
   - 🔧 IT Support → Login → Manage Tickets
   - 👨‍💻 Developer → Login → View Analytics

---

## **Workflow Example**

### **Scenario: Employee has WiFi problem**

**EMPLOYEE:**
1. Goes to Employee Portal
2. Creates Account (if new)
3. Logs in
4. Submits Ticket:
   - Issue Type: Network
   - Priority: High
   - Subject: No WiFi Connection
   - Description: WiFi keeps disconnecting
5. Ticket created with ID: TKT-123456

**IT SUPPORT:**
1. Goes to IT Support Portal
2. Logs in with itstaff1
3. Sees new ticket from John
4. Clicks "Update Status"
5. Changes to "In Progress"
6. Adds note: "Resetting WiFi router"
7. Later updates to "Resolved"

**DEVELOPER:**
1. Goes to Developer Portal
2. Logs in as developer
3. Views all tickets
4. Exports CSV
5. Sees: 1 employee, 1 ticket resolved

---

## **Key Features**

| Feature | Employee | IT Support | Developer |
|---------|----------|-----------|-----------|
| Signup | ✅ | ❌ | ❌ |
| Submit Tickets | ✅ | ❌ | ❌ |
| View My Tickets | ✅ | ❌ | ❌ |
| View All Tickets | ❌ | ✅ | ✅ |
| Update Status | ❌ | ✅ | ❌ |
| Add Notes | ❌ | ✅ | ❌ |
| Export Data | ❌ | ❌ | ✅ |
| See Analytics | ❌ | ✅ (Dashboard) | ✅ |
| Manage IT Staff | ❌ | ❌ | ✅ |

---

## **Data Storage (All Local)**

```
LocalStorage Keys:
├── helpdesk-employees              (All registered employees)
├── helpdesk-employee-session       (Current employee logged in)
├── helpdesk-all-tickets            (All submitted tickets)
├── helpdesk-itsupport-session      (Current IT staff logged in)
├── helpdesk-itstaff                (IT staff users)
└── helpdesk-developer-session      (Current developer logged in)
```

---

## **Customization**

### **Add IT Staff User**
Edit `itsupport-login.js` and add to `defaultITStaff`:
```javascript
{
  id: "ITS-003",
  staffId: "itstaff3",
  name: "Your Name",
  password: "itsupport123",
  role: "itsupport",
  department: "IT Support",
}
```

### **Change Developer Password**
Edit `developer-login.js` line with "dev@123" to your password

### **Add Signup Fields**
Edit `employee-signup.html` and `employee-signup.js`

---

## **Testing Checklist**

- [x] Employee can signup
- [x] Employee can login
- [x] Employee can submit ticket
- [x] Employee can view their tickets
- [x] IT staff can see all tickets
- [x] IT staff can update ticket status
- [x] Developer can see all data
- [x] Developer can export CSV
- [x] Multiple employees work
- [x] Data persists after refresh

---

## **Troubleshooting**

**"Cannot access localhost:8080"**
→ Start the server first (RUN.bat or bash RUN.sh)

**"Login fails"**
→ Use exact credentials (check spelling/case)
→ Clear browser cache

**"Data not showing"**
→ Refresh page (F5)
→ Try logging out and back in
→ Check browser console (F12) for errors

**"Want to add more IT staff"**
→ Edit `itsupport-login.js` → `defaultITStaff` array
→ Add new staff member
→ Refresh page

---

## **Security Notes**

⚠️ **Demo System Only** - For testing purposes
⚠️ **No encryption** - Passwords stored in plaintext
⚠️ **LocalStorage** - Data lost if browser cache cleared
⚠️ **Single User** - Not for production yet

**For Production:**
- Add backend database
- Implement password hashing
- Add SSL/HTTPS
- Implement proper authentication
- Add audit logs

---

## **Next Steps**

1. ✅ Start the server
2. ✅ Create employee account
3. ✅ Submit a test ticket
4. ✅ Login as IT staff
5. ✅ Update ticket status
6. ✅ Login as developer
7. ✅ Export CSV

---

**Version:** 2.0 (Multi-Portal)  
**Status:** Ready to Test  
**All Features:** Complete ✅
