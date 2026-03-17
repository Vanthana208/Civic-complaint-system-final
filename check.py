import os
import socket
from dotenv import load_dotenv

load_dotenv()

host = os.getenv('MYSQL_HOST', 'localhost')
port = int(os.getenv('MYSQL_PORT', 3306))
user = os.getenv('MYSQL_USER')

print(f"--- DIAGNOSING CONNECTION TO {host}:{port} ---")

# 1. Test TCP Port Reachability
print(f"Step 1: Testing TCP connection to {host}:{port}...")
try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(10)
    sock.connect((host, port))
    print("SUCCESS: TCP Port is open and reachable!")
    sock.close()
except Exception as e:
    print(f"FAILED: Could not reach port {port}. This is likely a firewall block. Error: {e}")

# 2. Test MySQL Handshake
print("\nStep 2: Testing MySQL protocol handshake...")
try:
    import MySQLdb
    db = MySQLdb.connect(
        host=host,
        port=port,
        user=user,
        passwd=os.getenv('MYSQL_PASSWORD'),
        db=os.getenv('MYSQL_DB'),
        connect_timeout=15
    )
    print("SUCCESS: MySQL Handshake and Login successful!")
    db.close()
except Exception as e:
    print(f"FAILED: MySQL Handshake failed. Error: {e}")
    if "110" in str(e):
        print("Note: Error 110 usually means a Firewall / Network Timeout.")
    elif "104" in str(e):
        print("Note: Error 104 usually means a Peer Reset (IP possibly not whitelisted in CSF).")

print("\n--- DIAGNOSIS COMPLETE ---")
