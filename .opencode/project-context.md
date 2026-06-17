# Project Context - Ready Dashboard (Flask)

## Last Session: June 13, 2026

### What was done
1. Created Flask auth app with User model (id, username, email, password, is_admin)
2. Added admin panel (dashboard, manage users, make/remove admin, delete user)
3. Applied "Ready Bootstrap Dashboard" theme (ready-boots) layout

### Project Structure
```
Desktop/project/
├── app.py                    # Flask app with auth + admin routes
├── database/
│   └── users.db              # SQLite (auto-created)
├── static/
│   ├── css/
│   │   ├── bootstrap.min.css # Bootstrap 4
│   │   ├── ready.css         # Ready Dashboard theme (6674 lines)
│   │   ├── demo.css          # Demo extras
│   │   ├── admin.css         # Custom admin overrides
│   │   └── style.css         # Custom styles (not used anymore)
│   ├── fonts/                # Line Awesome icons
│   ├── img/                  # Profile images
│   └── js/
│       ├── core/             # jQuery 3.2.1, Popper, Bootstrap 4
│       ├── plugin/           # Scrollbar plugin
│       ├── ready.min.js      # Sidebar toggle, etc.
│       └── main.js           # Login/register AJAX (Bootstrap 4)
└── templates/
    ├── login.html            # Card login + register modal
    ├── dashboard.html        # User dashboard with stats
    ├── admin_dashboard.html  # Admin stats + user table
    └── admin_users.html      # User management table
```

### Theme Details
- **Template:** Ready Bootstrap Dashboard (by ThemeKita)
- **Font:** Outfit
- **Icons:** Line Awesome (la-* classes)
- **Layout:** .wrapper > .main-header + .sidebar + .main-panel
- **Sidebar:** 260px fixed left with user profile + nav
- **Main panel:** Fluid right section with content + footer
- **Colors:** Primary #1D62F0, Success #59d05d, Warning #fbad4c, Danger #ff646d

### Auth Details
- Admin login: `admin` / `admin123` (auto-created on first run)
- Register modal on login page
- Session-based auth with Flask

### Admin Routes
- `/admin` - Dashboard with stats
- `/admin/users` - User management table
- `/admin/user/make-admin/<id>` - Promote user
- `/admin/user/remove-admin/<id>` - Demote admin
- `/admin/user/delete/<id>` - Delete user

### Run
```bash
cd Desktop/project
pip install flask flask-sqlalchemy werkzeug
python app.py
```
