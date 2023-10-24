import sqlite3

def get_db():
    conn = sqlite3.connect('books.db')
    cursor = conn.cursor()
    return conn, cursor

def create_books_table():
    conn, cursor = get_db()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY,
            title TEXT,
            author TEXT,
            status TEXT
        )
    ''')
    conn.commit()

def close_db():
    conn, cursor = get_db()
    conn.close()