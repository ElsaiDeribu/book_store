"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
}

export default function BookStore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<{
    title: string;
    author: string;
    status: string;
  }>({
    title: "",
    author: "",
    status: "To Read",
  });

  useEffect(() => {
    const getBooks = async () => {
      try {
        const booksFromServer = await axios.get<Book[]>(
          "http://127.0.0.1:8000/books"
        );
        setBooks(booksFromServer.data);
      } catch (err) {
        console.log(err);
      }
    };

    getBooks();
  }, []);

  const handleAddBook = async () => {
    try {
      const response = await axios.post<Book>(
        "http://127.0.0.1:8000/books",
        newBook
      );
      setBooks([...books, response.data]);
      setNewBook({ title: "", author: "", status: "To Read" });
    } catch (err) {
      console.log(err);
    }
  };

  const handleMoveBook = (bookId: number) => {
    handleUpdateBookStatus(bookId, getNextStatus(books, bookId));
  };

  const handleTakeBackBook = (bookId: number) => {
    handleUpdateBookStatus(bookId, getPreviousStatus(books, bookId));
  };

  const handleUpdateBookStatus = async (bookId: number, newStatus: string) => {
    try {
      console.log(bookId, newStatus);
      await axios.put(`http://127.0.0.1:8000/books/${bookId}`, {
        title: "",
        author: "",
        status: newStatus,
      });
      const updatedBooks = books.map((book) =>
        book.id === bookId ? { ...book, status: newStatus } : book
      );
      setBooks(updatedBooks);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/books/${bookId}`);
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
    } catch (err) {
      console.log(err);
    }
  };

  const getNextStatus = (books: Book[], bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      switch (book.status) {
        case "To Read":
          return "In Progress";
        case "In Progress":
          return "Completed";
        default:
          return book.status;
      }
    }
    return "To Read";
  };

  const getPreviousStatus = (books: Book[], bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      switch (book.status) {
        case "In Progress":
          return "To Read";
        case "Completed":
          return "In Progress";
        default:
          return book.status;
      }
    }
    return "To Read";
  };

  return (
    <div>
      <main className="flex  flex-col md:h-screen bg-white justify-center items-center text-very-light-gray w-screen">
        <div className="container  h-screen">
          <div className="bg-black  h-[5vh] flex items-center justify-center backdrop-blur bg-opacity-50">
            <div className="flex items-center text-black space-x-2">
              <input
                type="text"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
              />
              <button
                className="rounded-3xl px-2 py- text-[15px] text-very-dark-cyan font-lexend-deca hover:bg-very-dark-cyan hover:text-very-light-gray border-2"
                onClick={handleAddBook}
              >
                Add Book
              </button>
            </div>
            <h1>The Book Store</h1>
          </div>
          <div className="grid grid-cols md:grid-cols-3 md:h-[95vh]">
            <BookSection
              title="To Read"
              books={books.filter((book) => book.status === "To Read")}
              onMoveBook={handleMoveBook}
              onTakeBackBook={handleTakeBackBook}
              onDeleteBook={handleDeleteBook}
            />
            <BookSection
              title="In Progress"
              books={books.filter((book) => book.status === "In Progress")}
              onMoveBook={handleMoveBook}
              onTakeBackBook={handleTakeBackBook}
              onDeleteBook={handleDeleteBook}
            />
            <BookSection
              title="Completed"
              books={books.filter((book) => book.status === "Completed")}
              onMoveBook={handleMoveBook}
              onTakeBackBook={handleTakeBackBook}
              onDeleteBook={handleDeleteBook}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface BookSectionProps {
  title: string;
  books: Book[];
  onMoveBook: (bookId: number) => void;
  onTakeBackBook: (bookId: number) => void;
  onDeleteBook: (bookId: number) => void;
}

function BookSection({
  title,
  books,
  onMoveBook,
  onTakeBackBook,
  onDeleteBook,
}: BookSectionProps) {
  return (
    <section className="p-12 bg-red-300 text-black space-y-8 flex flex-col justify-between flex-1">
      <div className="text-stone-950 text-xl font-bold">
        <h1>{title}</h1>
      </div>
      {books.map((book) => (
        <div key={book.id} className="bg-white p-2 rounded-lg shadow-md">
          <div>
            <strong>Title:</strong> {book.title}
          </div>
          <div>
            <strong>Author:</strong> {book.author}
          </div>
          <div>
            <strong>Status:</strong> {book.status}
          </div>
          <button
            onClick={() => onMoveBook(book.id)}
            disabled={book.status === "Completed"}
          >
            Move
          </button>
          <button
            onClick={() => onTakeBackBook(book.id)}
            disabled={book.status === "To Read"}
          >
            Take Back
          </button>
          <button onClick={() => onDeleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </section>
  );
}
