import os
import MySQLdb
from dotenv import load_dotenv

load_dotenv()

def update_schema():
    try:
        db = MySQLdb.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            passwd=os.getenv('MYSQL_PASSWORD', ''),
            db=os.getenv('MYSQL_DB', 'e_complaint'),
            port=int(os.getenv('MYSQL_PORT', 3306))
        )
        cursor = db.cursor()
        
        # Check if column exists
        cursor.execute("SHOW COLUMNS FROM users LIKE 'mobile'")
        result = cursor.fetchone()
        
        if not result:
            print("Adding 'mobile' column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN mobile VARCHAR(15) AFTER email")
            db.commit()
            print("Success!")
        else:
            print("Column 'mobile' already exists.")
            
        db.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_schema()
