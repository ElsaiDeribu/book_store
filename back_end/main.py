from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from repository import BookRepository
from models import Book
from database import get_db, close_db, create_books_table
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

class BookCreate(BaseModel):
    title: str
    author: str
    status: str

repository = BookRepository()

@app.on_event("startup")
def startup_event():
    create_books_table()

@app.on_event("shutdown")
def shutdown_event():
    repository.close()


app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/books", response_model=list[Book])
def read_books():
    return repository.get_all_books()

@app.get("/books/{book_id}", response_model=Book)
def read_book(book_id: int):
    book = repository.get_book(book_id)
    if book:
        return book
    raise HTTPException(status_code=404, detail="Book not found")

@app.post("/books", response_model=Book)
def create_book(book: BookCreate):
    return repository.create_book(book)

@app.put("/books/{book_id}", response_model=Book)
def update_book(book_id: int, book: BookCreate):
    print(book_id, book)
    existing_book = repository.get_book(book_id)
    if not existing_book:
        raise HTTPException(status_code=404, detail="Book not found")
    existing_book.status = book.status
    
    return repository.update_book(book_id, existing_book)

@app.delete("/books/{book_id}", response_model=Book)
def delete_book(book_id: int):
    existing_book = repository.get_book(book_id)
    if not existing_book:
        raise HTTPException(status_code=404, detail="Book not found")
    repository.delete_book(book_id)
    return existing_book
