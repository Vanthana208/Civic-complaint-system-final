# E-Complaint Portal 🏛️

A multi-role civic complaint management system built with Flask + MySQL.

---

## 🚀 Quick Setup

### 1. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup MySQL Database
Run the SQL script in your MySQL client (port 3308 by default):
```bash
mysql -u root -P 3308 < e_complaint.sql
```

### 3. Configure database in app.py (if needed)
```python
app.config['MYSQL_HOST']     = 'localhost'
app.config['MYSQL_PORT']     = 3308       # change if different
app.config['MYSQL_USER']     = 'root'
app.config['MYSQL_PASSWORD'] = ''         # add your password
app.config['MYSQL_DB']       = 'e_complaint'
```

### 4. Run the app
```bash
python app.py
```
Visit: http://localhost:5000

---

## 👤 Login Credentials

| Role        | Email / Username        | Password    |
|-------------|-------------------------|-------------|
| Admin       | admin                   | admin       |
| Electricity | electricity@gov.in      | Dept@1234   |
| Water       | water@gov.in            | Dept@1234   |
| Roads       | roads@gov.in            | Dept@1234   |
| Sanitation  | sanitation@gov.in       | Dept@1234   |
| User        | (register a new account)| —           |
| Worker      | (added via Admin panel) | —           |

---

## 🗂️ Project Structure

```
e_complaint/
├── app.py                   # Main Flask application
├── check.py                 # DB connection test
├── requirements.txt
├── e_complaint.sql          # Full database schema + seed data
├── static/
│   ├── css/
│   │   ├── admin_panel.css
│   │   └── user.css
│   ├── js/
│   │   └── lang.js          # EN / தமிழ் / हिन्दी switcher
│   └── uploads/             # Uploaded images stored here
└── templates/
    ├── index.html
    ├── user_login.html
    ├── user_register.html
    ├── dashboard.html
    ├── raise_complaint.html
    ├── my_complaints.html
    ├── user_leaderboard.html
    ├── admin_login.html
    ├── admin_dashboard.html
    ├── admin_complaints.html
    ├── admin_users.html
    ├── admin_add_workers.html
    ├── admin_departments.html
    ├── leaderboard.html
    ├── dept_login.html
    ├── dept_dashboard.html
    ├── worker_dash.html
    ├── worker_dashboard.html
    ├── worker_assigned_tasks.html
    ├── update_task.html
    └── verify_complaint.html
```

---

## ✅ Bugs Fixed in This Version

1. **`admin_users.html`** — removed extra `user[4]` column that caused IndexError (query only returns 4 fields).
2. **`admin_add_workers.html`** — added `email` field to form + shows existing worker list with Remove button.
3. **`admin_dashboard.html`** — added `total_users` and `total_workers` stat cards.
4. **`admin_delete_worker` route** — new route to remove workers.
5. **Department login** — now supports both hashed passwords (added via admin form) and plain-text seeded passwords.
6. **`dept_logout`** — now also clears `role` from session.
7. **`dept_login.html`** — created missing template.
8. **`index.html`** — created full landing page.
9. **MySQL `SUM()` fix** — replaced `SUM(c.status='resolved')` with CASE WHEN for SQL compatibility.

---

## 🌐 Multi-language Support

The portal supports **English**, **தமிழ் (Tamil)**, and **हिन्दी (Hindi)** via `static/js/lang.js`.
- Language preference is stored in `localStorage`.
- Add `data-i18n="key"` to any HTML element.
- Place `<div id="lang-switcher"></div>` in the sidebar for the toggle button.
