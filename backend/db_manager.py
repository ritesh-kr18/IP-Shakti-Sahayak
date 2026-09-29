import sqlite3
import hashlib
import json
from pathlib import Path

DB_PATH = Path(__file__).parent / "ip_sakti_users.db"

def init_db():
    """Initialize the SQLite database with Users and Chat History tables."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Users Table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  name TEXT NOT NULL, 
                  email TEXT UNIQUE NOT NULL, 
                  role TEXT NOT NULL, 
                  password_hash TEXT NOT NULL)''')
    
    # Chat History Table
    c.execute('''CREATE TABLE IF NOT EXISTS chat_history
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  user_email TEXT NOT NULL, 
                  query TEXT NOT NULL, 
                  response_json TEXT NOT NULL, 
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_email) REFERENCES users (email))''')
    conn.commit()
    conn.close()

def hash_password(password: str) -> str:
    """Hash a password for storing."""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def register_user(name: str, email: str, role: str, password: str):
    """Register a new user in the database."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)", 
                  (name, email, role, hash_password(password)))
        conn.commit()
        return True, "User registered successfully."
    except sqlite3.IntegrityError:
        return False, "An account with this email already exists."
    finally:
        conn.close()

def authenticate_user(email: str, password: str):
    """Check credentials and return user info if valid."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT name, role FROM users WHERE email=? AND password_hash=?", 
              (email, hash_password(password)))
    user = c.fetchone()
    conn.close()
    
    if user:
        return {"name": user[0], "role": user[1], "email": email}
    return None

def save_chat(email: str, query: str, response: dict):
    """Save an agentic query and response to the user's history."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO chat_history (user_email, query, response_json) VALUES (?, ?, ?)", 
              (email, query, json.dumps(response)))
    conn.commit()
    conn.close()

def get_chat_history(email: str):
    """Retrieve all past chats for a specific user."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT query, response_json, timestamp FROM chat_history WHERE user_email=? ORDER BY timestamp DESC", (email,))
    rows = c.fetchall()
    conn.close()
    
    history = []
    for row in rows:
        history.append({
            "query": row[0],
            "response": json.loads(row[1]),
            "timestamp": row[2]
        })
    return history

# Initialize the database file when this module is imported
init_db()
