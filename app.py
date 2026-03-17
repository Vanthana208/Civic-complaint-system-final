from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import os, uuid
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', '74e5fb36f32726e37f08a3a529d403ec')

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file):
    if file and allowed_file(file.filename):
        ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return filename
    return None

# MySQL configuration
app.config['MYSQL_HOST']            = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_PORT']            = int(os.getenv('MYSQL_PORT', 3306))
app.config['MYSQL_USER']            = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD']        = os.getenv('MYSQL_PASSWORD', '')
app.config['MYSQL_DB']              = os.getenv('MYSQL_DB', 'e_complaint')
app.config['MYSQL_CONNECT_TIMEOUT']  = 10  # Seconds (low enough to beat Gunicorn 30s kill)
# app.config['MYSQL_CUSTOM_OPTIONS'] = {'ssl': {'ca': '/path/to/ca.pem'}} 

mysql = MySQL(app)

def get_db_cursor():
    try:
        return mysql.connection.cursor()
    except Exception as e:
        print(f"CRITICAL DB CONNECTION ERROR: {e}")
        raise e


# ================== INJECT LANG INTO ALL TEMPLATES ==================
@app.context_processor
def inject_lang():
    return dict(current_lang=session.get('lang', 'en'))

# ================== LANGUAGE HELPER ==================
def get_lang():
    """Priority: query param ?lang=ta > session > default 'en'"""
    lang = request.args.get('lang') or session.get('lang', 'en')
    if lang not in ('en', 'ta', 'hi'):
        lang = 'en'
    session['lang'] = lang
    return lang

@app.route('/set-lang/<lang>')
def set_language(lang):
    if lang in ('en', 'ta', 'hi'):
        session['lang'] = lang
    # Redirect back to previous page
    return redirect(request.referrer or url_for('home'))


# ================== HOME ==================
@app.route('/')
def home():
    return render_template('index.html')


# ================== REGISTER ==================
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email    = request.form['email']
        mobile   = request.form['mobile']
        password = generate_password_hash(request.form['password'])

        try:
            cursor = get_db_cursor()
            cursor.execute(
                "INSERT INTO users (username, email, mobile, password) VALUES (%s, %s, %s, %s)",
                (username, email, mobile, password)
            )
            mysql.connection.commit()
            flash("Registration successful! You can now login.", "success")
            cursor.close()
            return redirect(url_for('login'))
        except Exception as e:
            mysql.connection.rollback()
            flash("Error: Could not register. Email may already exist or DB is busy.", "danger")
            return redirect(url_for('register'))
    return render_template('user_register.html')


# ================== USER / WORKER LOGIN ==================
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email    = request.form['email']
        password = request.form['password']
        role     = request.form['role']

        try:
            cursor = get_db_cursor()
            if role == 'user':
                cursor.execute(
                    "SELECT id, username, email, password FROM users WHERE email=%s", (email,)
                )
                user = cursor.fetchone()
                cursor.close()
                if user and check_password_hash(user[3], password):
                    session['user_id']  = user[0]
                    session['username'] = user[1]
                    session['role']     = 'user'
                    flash("User login successful!", "success")
                    return redirect(url_for('dashboard'))
                else:
                    flash("Invalid user credentials!", "danger")
                    return redirect(url_for('login'))

            elif role == 'worker':
                cursor.execute(
                    "SELECT id, name, email, password FROM workers WHERE email=%s", (email,)
                )
                worker = cursor.fetchone()
                cursor.close()
                if worker and check_password_hash(worker[3], password):
                    session['worker_id'] = worker[0]
                    session['username']  = worker[1]
                    session['role']      = 'worker'
                    flash("Worker login successful!", "success")
                    return redirect(url_for('worker_dash'))
                else:
                    flash("Invalid worker credentials!", "danger")
                    return redirect(url_for('login'))
            else:
                flash("Please select a role!", "warning")
                return redirect(url_for('login'))
        except Exception as e:
            flash("Login service currently busy. Please try again.", "warning")
            return redirect(url_for('login'))

    return render_template('user_login.html')


# ================== USER DASHBOARD ==================
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash("Please login first.", "warning")
        return redirect(url_for('login'))

    user_id = session['user_id']
    try:
        cursor  = get_db_cursor()

        cursor.execute("SELECT COUNT(*) FROM complaints WHERE user_id=%s", (user_id,))
        total_complaints = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM complaints WHERE status='resolved' AND user_id=%s", (user_id,))
        resolved_complaints = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM complaints WHERE verification_status='verified' AND user_id=%s", (user_id,))
        verified_complaints = cursor.fetchone()[0]

        cursor.execute("SELECT points FROM users WHERE id=%s", (user_id,))
        row = cursor.fetchone()
        points = row[0] if row else 0

        cursor.close()
    except Exception as e:
        flash("Could not load dashboard data.", "warning")
        return redirect(url_for('logout'))

    return render_template(
        'dashboard.html',
        username=session['username'],
        total_complaints=total_complaints,
        resolved_complaints=resolved_complaints,
        verified_complaints=verified_complaints,
        points=points
    )


# ================== RAISE COMPLAINT ==================
@app.route('/raise-complaint', methods=['GET', 'POST'])
def raise_complaint():
    if 'user_id' not in session:
        flash("Please login to raise a complaint.", "warning")
        return redirect(url_for('login'))

    if request.method == 'POST':
        title       = request.form['title']
        description = request.form['description']
        location    = request.form['location']
        category    = request.form['category']
        latitude    = request.form.get('latitude')
        longitude   = request.form.get('longitude')
        user_id     = session['user_id']
        filename    = save_file(request.files.get('image'))

        try:
            cursor = get_db_cursor()
            cursor.execute(
                "SELECT id FROM departments WHERE category=%s LIMIT 1", (category,)
            )
            dept = cursor.fetchone()
            department_id = dept[0] if dept else None

            cursor.execute(
                "INSERT INTO complaints "
                "(user_id, title, description, location, category, image, department_id, status, latitude, longitude) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending', %s, %s)",
                (user_id, title, description, location, category, filename, department_id, latitude, longitude)
            )
            mysql.connection.commit()
            ticket_id = cursor.lastrowid
            cursor.close()
            flash(f"✅ Ticket #{ticket_id} raised successfully! Department will pick it up shortly.", "success")
            return redirect(url_for('ticket_detail', complaint_id=ticket_id))
        except Exception as e:
            mysql.connection.rollback()
            flash("Error submitting complaint. Database busy.", "danger")
            return redirect(url_for('raise_complaint'))

    return render_template('raise_complaint.html')


# ================== MY COMPLAINTS ==================
@app.route('/my-complaints')
def my_complaints():
    if 'user_id' not in session or session.get('role') != 'user':
        flash("Please login as user first.", "warning")
        return redirect(url_for('login'))

    user_id = session['user_id']
    try:
        cursor  = get_db_cursor()
        cursor.execute("""
            SELECT c.*, COALESCE(d.name, 'Unassigned') AS dept_name
            FROM complaints c
            LEFT JOIN departments d ON c.department_id = d.id
            WHERE c.user_id = %s
            ORDER BY c.created_at DESC
        """, (user_id,))
        complaints = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Could not load complaints list.", "warning")
        return redirect(url_for('dashboard'))

    return render_template('my_complaints.html', complaints=complaints)


# ================== VERIFY COMPLAINT (user confirms resolution) ==================
@app.route('/verify-complaint/<int:complaint_id>', methods=['POST'])
def verify_complaint(complaint_id):
    if 'user_id' not in session or session.get('role') != 'user':
        flash("Please login as user first.", "warning")
        return redirect(url_for('login'))

    user_id = session['user_id']
    try:
        cursor  = get_db_cursor()
        cursor.execute(
            "SELECT assigned_worker_id FROM complaints WHERE id=%s AND user_id=%s",
            (complaint_id, user_id)
        )
        complaint = cursor.fetchone()
        if not complaint:
            cursor.close()
            flash("Complaint not found!", "danger")
            return redirect(url_for('my_complaints'))

        worker_id = complaint[0]
        cursor.execute(
            "UPDATE complaints SET verification_status='verified' WHERE id=%s", (complaint_id,)
        )
        if worker_id:
            cursor.execute("UPDATE workers SET status='free' WHERE id=%s", (worker_id,))
        mysql.connection.commit()
        cursor.close()
        flash("Complaint verified successfully!", "success")
    except Exception as e:
        mysql.connection.rollback()
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return {"success": False, "message": "Error verifying complaint!"}, 500
        flash("Error verifying complaint! DB busy.", "danger")

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return {"success": True, "message": "Complaint verified successfully!"}
    return redirect(url_for('my_complaints'))


# ================== USER LEADERBOARD ==================
@app.route('/user/leaderboard')
def user_leaderboard():
    if 'user_id' not in session or session.get('role') != 'user':
        flash("Please login as user first.", "warning")
        return redirect(url_for('login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("SELECT username, points FROM users ORDER BY points DESC")
        leaderboard = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Leaderboard temporarily unavailable.", "warning")
        return redirect(url_for('dashboard'))

    return render_template('user_leaderboard.html', leaderboard=leaderboard)


@app.route('/dept/leaderboard')
def dept_leaderboard():
    if 'dept_id' not in session or session.get('role') != 'department':
        flash("Please login as department first.", "warning")
        return redirect(url_for('dept_login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("SELECT username, points FROM users ORDER BY points DESC")
        leaderboard = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Leaderboard unavailable. Refresh later.", "warning")
        return redirect(url_for('dept_dashboard'))

    return render_template('dept_leaderboard.html', leaderboard=leaderboard)


# ================== LOGOUT ==================
@app.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out.", "info")
    return redirect(url_for('login'))


@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        role = request.form['role']
        email = request.form['email']

        try:
            cursor = get_db_cursor()
            table = ""
            if role == 'user':
                table = "users"
            elif role == 'worker':
                table = "workers"
            elif role == 'department':
                table = "departments"
            
            if table:
                cursor.execute(f"SELECT id FROM {table} WHERE email=%s", (email,))
                user = cursor.fetchone()
                cursor.close()
                
                if user:
                    return redirect(url_for('reset_password', role=role, email=email))
                else:
                    flash("Email not found in our records.", "danger")
            else:
                flash("Invalid role selected.", "warning")
        except Exception as e:
            flash("Service busy. Try again soon.", "warning")
            
    return render_template('forgot_password.html')


@app.route('/reset-password/<role>/<email>', methods=['GET', 'POST'])
def reset_password(role, email):
    if request.method == 'POST':
        password = generate_password_hash(request.form['password'])
        
        try:
            cursor = get_db_cursor()
            table = ""
            if role == 'user':
                table = "users"
            elif role == 'worker':
                table = "workers"
            elif role == 'department':
                table = "departments"
                
            cursor.execute(f"UPDATE {table} SET password=%s WHERE email=%s", (password, email))
            mysql.connection.commit()
            cursor.close()
            flash("Password reset successful! You can now login.", "success")
            
            if role == 'department':
                return redirect(url_for('dept_login'))
            return redirect(url_for('login'))
        except Exception as e:
            mysql.connection.rollback()
            flash("Error updating password. DB is busy.", "danger")
            
    return render_template('reset_password.html', role=role, email=email)


# ==========================================
#          DEPARTMENT PORTAL
# ==========================================

@app.route('/dept/login', methods=['GET', 'POST'])
def dept_login():
    if request.method == 'POST':
        email    = request.form['email']
        password = request.form['password']

        try:
            cursor = get_db_cursor()
            cursor.execute(
                "SELECT id, name, email, password, category FROM departments WHERE email=%s", (email,)
            )
            dept = cursor.fetchone()
            cursor.close()

            # Support both hashed passwords (added via admin form) and plain (seeded via SQL)
            password_ok = False
            if dept:
                try:
                    password_ok = check_password_hash(dept[3], password)
                except Exception:
                    password_ok = (dept[3] == password)

            if dept and password_ok:
                session['dept_id']       = dept[0]
                session['dept_name']     = dept[1]
                session['dept_category'] = dept[4]
                session['role']          = 'department'
                flash(f"Welcome, {dept[1]}!", "success")
                return redirect(url_for('dept_dashboard'))
            else:
                flash("Invalid department credentials!", "danger")
                return redirect(url_for('dept_login'))
        except Exception as e:
            flash("Database busy. Please try again soon.", "warning")
            return redirect(url_for('dept_login'))

    return render_template('dept_login.html')


@app.route('/dept/dashboard')
def dept_dashboard():
    if 'dept_id' not in session or session.get('role') != 'department':
        flash("Please login as department first.", "warning")
        return redirect(url_for('dept_login'))

    dept_id       = session['dept_id']
    dept_category = session['dept_category']
    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT c.id, c.title, c.description, c.location, c.category,
                   c.image, c.status, u.username, c.created_at
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            WHERE c.category = %s
              AND c.assigned_worker_id IS NULL
              AND c.status = 'pending'
            ORDER BY c.created_at ASC
        """, (dept_category,))
        pending_complaints = cursor.fetchall()

        cursor.execute("""
            SELECT c.id, c.title, c.status, c.verification_status,
                   u.username, COALESCE(w.name, 'Unassigned') AS worker_name, c.created_at
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN workers w ON c.assigned_worker_id = w.id
            WHERE c.department_id = %s AND c.assigned_worker_id IS NOT NULL
            ORDER BY c.created_at DESC
        """, (dept_id,))
        assigned_complaints = cursor.fetchall()

        cursor.execute("SELECT id, name, location FROM workers WHERE status='free' ORDER BY name")
        free_workers = cursor.fetchall()

        cursor.execute("""
            SELECT 
                (SELECT COUNT(*) FROM complaints WHERE department_id=%s) as taken,
                (SELECT COUNT(*) FROM complaints WHERE department_id=%s AND status='resolved') as resolved,
                (SELECT COUNT(*) FROM complaints WHERE category=%s AND assigned_worker_id IS NULL AND status='pending') as bin
        """, (dept_id, dept_id, dept_category))
        res = cursor.fetchone()
        total_taken = res[0]
        total_resolved = res[1]
        in_bin = res[2]

        cursor.close()
    except Exception as e:
        flash("Database Error. Refreshing page...", "danger")
        return redirect(url_for('index'))

    return render_template('dept_dashboard.html',
        dept_name=session['dept_name'],
        dept_category=dept_category,
        pending_complaints=pending_complaints,
        assigned_complaints=assigned_complaints,
        free_workers=free_workers,
        total_taken=total_taken,
        total_resolved=total_resolved,
        in_bin=in_bin
    )


@app.route('/dept/assign/<int:complaint_id>', methods=['POST'])
def dept_assign_worker(complaint_id):
    if 'dept_id' not in session or session.get('role') != 'department':
        flash("Please login as department first.", "warning")
        return redirect(url_for('dept_login'))

    worker_id = request.form.get('worker_id')
    if not worker_id:
        flash("Please select a worker.", "warning")
        return redirect(url_for('dept_dashboard'))

    try:
        cursor = get_db_cursor()
        cursor.execute(
            "UPDATE complaints SET assigned_worker_id=%s, department_id=%s, status='in_progress' WHERE id=%s",
            (worker_id, session['dept_id'], complaint_id)
        )
        cursor.execute("UPDATE workers SET status='busy' WHERE id=%s", (worker_id,))
        mysql.connection.commit()
        cursor.close()
        flash("Worker assigned successfully! Complaint is now in progress.", "success")
    except Exception as e:
        mysql.connection.rollback()
        flash("Error assigning worker. Database busy.", "danger")

    return redirect(url_for('dept_dashboard'))


@app.route('/dept/logout')
def dept_logout():
    for key in ('dept_id', 'dept_name', 'dept_category', 'role'):
        session.pop(key, None)
    flash("Logged out of department portal.", "info")
    return redirect(url_for('dept_login'))


# ==========================================
#          ADMIN PORTAL
# ==========================================

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == 'admin' and password == 'admin':
            session['admin_logged_in'] = True
            session['role'] = 'admin'
            flash("Admin login successful!", "success")
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Invalid admin credentials!", "danger")
            return redirect(url_for('admin_login'))
    return render_template('admin_login.html')


@app.route('/admin/dashboard')
def admin_dashboard():
    if 'admin_logged_in' not in session:
        flash("Please login as admin first.", "warning")
        return redirect(url_for('admin_login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT 
                (SELECT COUNT(*) FROM complaints) as total,
                (SELECT COUNT(*) FROM complaints WHERE status='resolved') as resolved,
                (SELECT COUNT(*) FROM complaints WHERE verification_status='verified') as verified,
                (SELECT COUNT(*) FROM complaints WHERE assigned_worker_id IS NULL AND status='pending') as in_bin,
                (SELECT COUNT(*) FROM users) as users,
                (SELECT COUNT(*) FROM workers) as workers
        """)
        res = cursor.fetchone()
        cursor.close()
    except Exception as e:
        flash("Database Error. Admin portal is busy.", "danger")
        return redirect(url_for('index'))

    return render_template(
        'admin_dashboard.html',
        total_complaints=res[0],
        resolved_complaints=res[1],
        verified_complaints=res[2],
        in_bin=res[3],
        total_users=res[4],
        total_workers=res[5]
    )


# ================== ADMIN – DEPARTMENTS ==================
@app.route('/admin/departments', methods=['GET', 'POST'])
def admin_departments():
    if 'admin_logged_in' not in session:
        flash("Please login as admin first.", "warning")
        return redirect(url_for('admin_login'))

    if request.method == 'POST':
        name     = request.form['name']
        email    = request.form['email']
        password = generate_password_hash(request.form['password'])
        category = request.form['category']

        try:
            cursor = get_db_cursor()
            cursor.execute(
                "INSERT INTO departments (name, email, password, category) VALUES (%s,%s,%s,%s)",
                (name, email, password, category)
            )
            mysql.connection.commit()
            flash("Department added successfully!", "success")
            cursor.close()
        except Exception as e:
            mysql.connection.rollback()
            flash("Error adding department. Email may already exist.", "danger")
        return redirect(url_for('admin_departments'))

    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT d.id, d.name, d.email, d.category,
                   COUNT(c.id) AS total,
                   SUM(CASE WHEN c.status='resolved' THEN 1 ELSE 0 END) AS resolved
            FROM departments d
            LEFT JOIN complaints c ON c.department_id = d.id
            GROUP BY d.id
            ORDER BY d.id DESC
        """)
        departments = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Could not load departments list.", "warning")
        return redirect(url_for('admin_dashboard'))

    return render_template('admin_departments.html', departments=departments)


@app.route('/admin/departments/delete/<int:dept_id>', methods=['POST'])
def admin_delete_department(dept_id):
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))
    try:
        cursor = get_db_cursor()
        cursor.execute("DELETE FROM departments WHERE id=%s", (dept_id,))
        mysql.connection.commit()
        cursor.close()
        flash("Department removed.", "info")
    except Exception as e:
        mysql.connection.rollback()
        flash("Cannot delete: department has active complaints or DB is busy.", "danger")
    return redirect(url_for('admin_departments'))


@app.route('/admin/complaints')
def admin_complaints():
    if 'admin_logged_in' not in session:
        flash("Please login as admin first.", "warning")
        return redirect(url_for('admin_login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT c.id, c.title, u.username, c.status, c.verification_status,
                   c.resolved_image, c.admin_verification, c.user_id,
                   c.category, COALESCE(d.name, 'Unassigned') AS dept_name
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN departments d ON c.department_id = d.id
            ORDER BY c.created_at DESC
        """)
        complaints = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Could not load complaints. Database is currently busy.", "warning")
        return redirect(url_for('admin_dashboard'))

    return render_template('admin_complaints.html', complaints=complaints)


@app.route('/admin/verify-complaint/<int:complaint_id>/<string:action>')
def admin_verify_complaint(complaint_id, action):
    if 'admin_logged_in' not in session:
        flash("Please login as admin first.", "warning")
        return redirect(url_for('admin_login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("SELECT user_id FROM complaints WHERE id=%s", (complaint_id,))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            flash("Complaint not found!", "danger")
            return redirect(url_for('admin_complaints'))
        user_id = user[0]

        if action == 'genuine':
            cursor.execute(
                "UPDATE complaints SET admin_verification='genuine' WHERE id=%s", (complaint_id,)
            )
            cursor.execute("UPDATE users SET points = points + 10 WHERE id=%s", (user_id,))
        elif action == 'fake':
            cursor.execute(
                "UPDATE complaints SET admin_verification='fake' WHERE id=%s", (complaint_id,)
            )
        else:
            cursor.close()
            flash("Invalid action!", "warning")
            return redirect(url_for('admin_complaints'))

        mysql.connection.commit()
        cursor.close()
        flash("Complaint updated successfully!", "success")
    except Exception as e:
        mysql.connection.rollback()
        flash("Error updating complaint. DB busy.", "danger")

    # Redirect back to ticket detail so admin can see the result
    ref = request.referrer
    if ref and '/admin/ticket/' in ref:
        return redirect(ref)
    return redirect(url_for('admin_complaints'))


@app.route('/admin/users')
def admin_users():
    if 'admin_logged_in' not in session:
        flash("Please login as admin first.", "warning")
        return redirect(url_for('admin_login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("SELECT id, username, email, points FROM users ORDER BY id DESC")
        users = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Could not load users list.", "warning")
        return redirect(url_for('admin_dashboard'))

    return render_template('admin_users.html', users=users)


@app.route('/admin/add-workers', methods=['GET', 'POST'])
def admin_add_workers():
    if 'admin_logged_in' not in session:
        flash("Please login as admin first.", "warning")
        return redirect(url_for('admin_login'))

    if request.method == 'POST':
        name     = request.form['name']
        password = generate_password_hash(request.form['password'])
        location = request.form['location']
        email    = request.form.get('email', '')

        try:
            cursor = get_db_cursor()
            cursor.execute(
                "INSERT INTO workers (name, password, location, email) VALUES (%s,%s,%s,%s)",
                (name, password, location, email)
            )
            mysql.connection.commit()
            flash(f"Worker '{name}' added successfully!", "success")
            cursor.close()
        except Exception as e:
            mysql.connection.rollback()
            flash("Error adding worker. Email may already exist.", "danger")
        return redirect(url_for('admin_add_workers'))

    # Fetch all workers to display
    try:
        cursor = get_db_cursor()
        cursor.execute("SELECT id, name, email, location, status FROM workers ORDER BY id DESC")
        workers = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Could not load workers list.", "warning")
        return redirect(url_for('admin_dashboard'))

    return render_template('admin_add_workers.html', workers=workers)


@app.route('/admin/delete-worker/<int:worker_id>', methods=['POST'])
def admin_delete_worker(worker_id):
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))
    try:
        cursor = get_db_cursor()
        cursor.execute("DELETE FROM workers WHERE id=%s", (worker_id,))
        mysql.connection.commit()
        cursor.close()
        flash("Worker removed.", "info")
    except Exception as e:
        mysql.connection.rollback()
        flash("Cannot remove worker: has active assignments or DB busy.", "danger")
    return redirect(url_for('admin_add_workers'))


@app.route('/admin/leaderboard')
def admin_leaderboard():
    if 'admin_logged_in' not in session:
        flash("Please login as admin first.", "warning")
        return redirect(url_for('admin_login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("SELECT username, points FROM users ORDER BY points DESC")
        leaderboard = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Could not load leaderboard.", "warning")
        return redirect(url_for('admin_dashboard'))

    return render_template('leaderboard.html', leaderboard=leaderboard)


@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    session.pop('role', None)
    flash("Admin logged out.", "info")
    return redirect(url_for('admin_login'))


# ==========================================
#          WORKER PORTAL
# ==========================================

@app.route('/worker_dash')
def worker_dash():
    if 'worker_id' not in session or session.get('role') != 'worker':
        flash("Please login as worker first.", "warning")
        return redirect(url_for('login'))
    return render_template("worker_dash.html", worker_name=session.get('username'))


@app.route('/worker/dashboard')
def worker_dashboard():
    if 'worker_id' not in session or session.get('role') != 'worker':
        flash("Please login as worker first.", "warning")
        return redirect(url_for('login'))

    try:
        cursor = get_db_cursor()
        cursor.execute(
            "SELECT * FROM complaints WHERE assigned_worker_id=%s AND status IN ('in_progress','pending')",
            (session['worker_id'],)
        )
        assigned_complaints = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Database connection problem. Refreshing...", "warning")
        return redirect(url_for('worker_dash'))
    return render_template('worker_dashboard.html', username=session['username'], complaints=assigned_complaints)


@app.route('/update-task/<int:complaint_id>', methods=['GET', 'POST'])
def update_task(complaint_id):
    if 'worker_id' not in session or session.get('role') != 'worker':
        flash("Please login as worker first.", "warning")
        return redirect(url_for('login'))

    if request.method == 'POST':
        filename = save_file(request.files.get('resolved_image'))
        if not filename:
            flash("Please upload a valid image.", "warning")
            return redirect(url_for('update_task', complaint_id=complaint_id))

        try:
            cursor = get_db_cursor()
            cursor.execute(
                "UPDATE complaints SET resolved_image=%s, status='resolved' "
                "WHERE id=%s AND assigned_worker_id=%s",
                (filename, complaint_id, session['worker_id'])
            )
            mysql.connection.commit()
            flash("Complaint marked as resolved!", "success")
            cursor.close()
        except Exception as e:
            mysql.connection.rollback()
            flash("Error updating task. DB is busy.", "danger")
        return redirect(url_for('worker_dash'))

    return render_template('update_task.html', complaint_id=complaint_id)


@app.route('/worker/assigned-tasks')
def worker_assigned_tasks():
    if 'worker_id' not in session or session.get('role') != 'worker':
        flash("Please login as worker first.", "warning")
        return redirect(url_for('login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT c.id, c.title, u.username, c.status, c.verification_status
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            WHERE c.assigned_worker_id = %s
            ORDER BY c.created_at DESC
        """, (session['worker_id'],))
        tasks = cursor.fetchall()
        cursor.close()
    except Exception as e:
        flash("Could not load tasks.", "warning")
        return redirect(url_for('worker_dash'))

    return render_template('worker_assigned_tasks.html', tasks=tasks)



# ================== TICKET DETAIL ==================
@app.route('/ticket/<int:complaint_id>')
def ticket_detail(complaint_id):
    if 'user_id' not in session or session.get('role') != 'user':
        flash("Please login as user first.", "warning")
        return redirect(url_for('login'))

    user_id = session['user_id']
    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT c.*,
                   COALESCE(d.name, 'Unassigned') AS dept_name,
                   COALESCE(w.name, 'Not assigned yet') AS worker_name
            FROM complaints c
            LEFT JOIN departments d ON c.department_id = d.id
            LEFT JOIN workers w ON c.assigned_worker_id = w.id
            WHERE c.id = %s AND c.user_id = %s
        """, (complaint_id, user_id))

        complaint = cursor.fetchone()
        cursor.close()
    except Exception as e:
        flash("Could not load ticket details.", "warning")
        return redirect(url_for('my_complaints'))

    if not complaint:
        flash("Ticket not found!", "danger")
        return redirect(url_for('my_complaints'))

    dept_name   = complaint[14]
    worker_name = complaint[15]

    return render_template('ticket.html',
        complaint=complaint,
        dept_name=dept_name,
        worker_name=worker_name
    )


# ================== ADMIN TICKET VIEW ==================
@app.route('/admin/ticket/<int:complaint_id>')
def admin_ticket_view(complaint_id):
    if 'admin_logged_in' not in session:
        flash("Please login as admin first.", "warning")
        return redirect(url_for('admin_login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT c.*,
                   COALESCE(d.name, 'Unassigned') AS dept_name,
                   COALESCE(w.name, 'Not assigned yet') AS worker_name,
                   u.username AS reporter
            FROM complaints c
            LEFT JOIN departments d ON c.department_id = d.id
            LEFT JOIN workers w ON c.assigned_worker_id = w.id
            JOIN users u ON c.user_id = u.id
            WHERE c.id = %s
        """, (complaint_id,))
        complaint = cursor.fetchone()
        cursor.close()
    except Exception as e:
        flash("Could not load ticket.", "warning")
        return redirect(url_for('admin_complaints'))

    if not complaint:
        flash("Ticket not found!", "danger")
        return redirect(url_for('admin_complaints'))

    return render_template('admin_ticket_view.html',
        complaint=complaint,
        dept_name=complaint[14],
        worker_name=complaint[15],
        reporter=complaint[16]
    )

@app.route('/admin/live-map')
def admin_live_map():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))
    return render_template('admin_map.html')

@app.route('/api/admin/complaints-locations')
def api_admin_complaints_locations():
    if 'admin_logged_in' not in session:
        return {"error": "Unauthorized"}, 403
    
    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT id, title, category, status, latitude, longitude 
            FROM complaints 
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        """)
        complaints = cursor.fetchall()
        cursor.close()
    except Exception as e:
        return {"complaints": []}
    
    data = []
    for c in complaints:
        data.append({
            "id": c[0],
            "title": c[1],
            "category": c[2],
            "status": c[3],
            "lat": float(c[4]),
            "lng": float(c[5])
        })
    return {"complaints": data}


# ================== DEPT TICKET VIEW ==================
@app.route('/dept/ticket/<int:complaint_id>')
def dept_ticket_view(complaint_id):
    if 'dept_id' not in session or session.get('role') != 'department':
        flash("Please login as department first.", "warning")
        return redirect(url_for('dept_login'))

    try:
        cursor = get_db_cursor()
        cursor.execute("""
            SELECT c.*,
                   COALESCE(d.name, 'Unassigned') AS dept_name,
                   COALESCE(w.name, 'Not assigned yet') AS worker_name,
                   u.username AS reporter
            FROM complaints c
            LEFT JOIN departments d ON c.department_id = d.id
            LEFT JOIN workers w ON c.assigned_worker_id = w.id
            JOIN users u ON c.user_id = u.id
            WHERE c.id = %s
        """, (complaint_id,))
        complaint = cursor.fetchone()
        cursor.close()
    except Exception as e:
        flash("Could not load ticket details.", "warning")
        return redirect(url_for('dept_dashboard'))

    if not complaint:
        flash("Ticket not found!", "danger")
        return redirect(url_for('dept_dashboard'))

    # Free workers for assign
    try:
        cursor = get_db_cursor()
        cursor.execute("SELECT id, name, location FROM workers WHERE status='free' ORDER BY name")
        free_workers = cursor.fetchall()
        cursor.close()
    except Exception as e:
        free_workers = []

    return render_template('dept_ticket_view.html',
        complaint=complaint,
        dept_name=complaint[14],
        worker_name=complaint[15],
        reporter=complaint[16],
        free_workers=free_workers,
        dept_id=session['dept_id']
    )

# ================== ANALYTICS API ==================
@app.route('/api/analytics/complaints')
def api_analytics_complaints():
    if 'role' not in session:
        return {"error": "Unauthorized"}, 403
    
    # Base filters
    dept_id = session.get('dept_id')
    user_id = session.get('user_id')
    role = session.get('role')

    trend_filter = ""
    trend_params = []
    
    cat_status_filter = ""
    cat_status_params = []

    if role == 'department':
        trend_filter = " AND department_id = %s"
        trend_params = [dept_id]
        cat_status_filter = " AND department_id = %s"
        cat_status_params = [dept_id]
    elif role == 'user':
        trend_filter = " AND user_id = %s"
        trend_params = [user_id]
        # Users see global categories/status or just their own? 
        # Usually users see global stats in public dashboards, 
        # but if we want per-user stats:
        cat_status_filter = " AND user_id = %s"
        cat_status_params = [user_id]
    
    try:
        cursor = get_db_cursor()
        
        # 1. Trend: Complaints per day (last 30 days)
        cursor.execute(f"""
            SELECT DATE(created_at) as date, COUNT(*) as count 
            FROM complaints 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) {trend_filter}
            GROUP BY DATE(created_at)
            ORDER BY date
        """, trend_params)
        trend_data = [{"date": str(row[0]), "count": row[1]} for row in cursor.fetchall()]
        
        # 2. Categories breakdown
        cursor.execute(f"SELECT category, COUNT(*) FROM complaints WHERE 1=1 {cat_status_filter} GROUP BY category", cat_status_params)
        category_data = {row[0]: row[1] for row in cursor.fetchall()}
        
        # 3. Status breakdown
        cursor.execute(f"SELECT status, COUNT(*) FROM complaints WHERE 1=1 {cat_status_filter} GROUP BY status", cat_status_params)
        status_data = {row[0]: row[1] for row in cursor.fetchall()}
        
        cursor.close()
        
        return {
            "trend": trend_data,
            "categories": category_data,
            "status": status_data
        }
    except Exception as e:
        return {"error": str(e)}, 500

# ================== RUN APP ==================
if __name__ == '__main__':
    app.run(debug=True)
