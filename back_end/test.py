import json
from fastapi.testclient import TestClient
from main import app
from repository.book_repository import BookRepository
import sqlite3

# Create an in-memory SQLite database for testing
def get_test_db():
    connection = sqlite3.connect('books.db')
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)
    connection.commit()
    return connection

client = TestClient(app)

def test_create_book():
    # Define a sample book data
    book_data = {
        "title": "Test Book",
        "status": "Available"
    }
    
    # Use the test database connection
    test_db = get_test_db()
    
    # Inject the test database connection into the repository
    repository = BookRepository(test_db)
    
    # Send a POST request to create a new book
    response = client.post("/books/", json=book_data)
    
    # Check the response status code and data
    assert response.status_code == 200
    created_book = response.json()
    assert created_book["title"] == book_data["title"]
    assert created_book["status"] == book_data["status"]
    
    # Cleanup: No need to delete the book in an in-memory database