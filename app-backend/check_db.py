import sqlite3

conn = sqlite3.connect('app.db')
tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
print("Tables:", tables)

if ('transactions',) in tables:
    txs = conn.execute("SELECT * FROM transactions").fetchall()
    print("Transactions:", txs)
else:
    print("No transactions table!")
    
if ('users',) in tables:
    users = conn.execute("SELECT * FROM users").fetchall()
    print("Users:", users)
else:
    print("No users table!")
