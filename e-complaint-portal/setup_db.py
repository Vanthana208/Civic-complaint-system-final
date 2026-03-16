import MySQLdb
import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'passwd': os.getenv('MYSQL_PASSWORD', ''),
    'port': int(os.getenv('MYSQL_PORT', 3306))
}

sql_file = r'e:\Jo IT Solutions\e-complaint-portal-main\e_complaint.sql'

try:
    # Connect without database to create it
    conn = MySQLdb.connect(**db_config)
    cursor = conn.cursor()
    
    # Create database
    cursor.execute("CREATE DATABASE IF NOT EXISTS e_complaint")
    cursor.execute("USE e_complaint")
    
    # Read and execute SQL file
    print(f"Reading {sql_file}...")
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()
        # Split by semicolon but be careful with procedures or triggers if any
        # This simple split works for most basic SQL files
        sql_commands = sql_content.split(';')
        
    for command in sql_commands:
        if command.strip():
            try:
                cursor.execute(command)
            except Exception as e:
                # If table already exists or similar minor issues, continue
                if "already exists" in str(e).lower():
                    continue
                print(f"Error executing command: {e}")
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Database setup complete.")
    
except Exception as e:
    print(f"Database setup failed: {e}")
