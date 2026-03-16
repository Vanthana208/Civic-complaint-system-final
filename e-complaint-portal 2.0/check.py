from app import app, mysql

with app.app_context():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT DATABASE()")
        print("Connected to:", cursor.fetchone())
        cursor.close()
    except Exception as e:
        print("Connection failed:", e)
