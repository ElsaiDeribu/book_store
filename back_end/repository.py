from models import Book
from database import get_db, close_db

class BookRepository:
    def get_all_books(self):
        conn, cursor = get_db()
        cursor.execute("SELECT * FROM books")
        books = [Book(*row) for row in cursor.fetchall()]
        close_db()  # No need to pass 'conn' as an argument
        return books

    def get_book(self, book_id):
        conn, cursor = get_db()
        cursor.execute("SELECT * FROM books WHERE id=?", (book_id,))
        book = Book(*cursor.fetchone())
        close_db()  # No need to pass 'conn' as an argument
        return book

    def create_book(self, book):
        conn, cursor = get_db()
        cursor.execute("INSERT INTO books (title, author, status) VALUES (?, ?, ?)", (book.title, book.author, book.status))
        conn.commit()
        book_id = cursor.lastrowid
        close_db()  # No need to pass 'conn' as an argument
        return self.get_book(book_id)

    def update_book(self, book_id, book):
        conn, cursor = get_db()
        cursor.execute("UPDATE books SET title=?, author=?, status=? WHERE id=?", (book.title, book.author, book.status, book_id))
        conn.commit()
        updated_book = self.get_book(book_id)
        close_db()  # No need to pass 'conn' as an argument
        return updated_book

    def delete_book(self, book_id):
        conn, cursor = get_db()
        cursor.execute("DELETE FROM books WHERE id=?", (book_id,))
        conn.commit()
        close_db()  # No need to pass 'conn' as an argument
