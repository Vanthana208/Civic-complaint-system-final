from flask import Flask
from flask_mysqldb import MySQL
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'e_complaint')

mysql = MySQL(app)

def migrate():
    with app.app_context():
        cursor = mysql.connection.cursor()
        try:
            cursor.execute("ALTER TABLE complaints ADD COLUMN latitude DECIMAL(10, 8), ADD COLUMN longitude DECIMAL(11, 8);")
            mysql.connection.commit()
            print("Migration successful: added latitude and longitude columns.")
        except Exception as e:
            print(f"Migration failed or already applied: {e}")
        finally:
            cursor.close()

if __name__ == '__main__':
    migrate()
