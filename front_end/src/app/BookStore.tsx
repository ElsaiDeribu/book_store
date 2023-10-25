"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import { Book } from "./Models";


export default function BookStore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

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
      } catch (err: any) {
        setError(err.message);
        setOpenSnackbar(true);
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
    } catch (err: any) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  const handleMoveBook = (bookId: number) => {
    handleUpdateBookStatus(bookId, getNextStatus(books, bookId));
  };

  const handleTakeBackBook = (bookId: number) => {
    handleUpdateBookStatus(bookId, getPreviousStatus(books, bookId));
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };

  const handleUpdateBookStatus = async (bookId: number, newStatus: string) => {
    try {
      await axios.put(`http://127.0.0.1:8000/books/${bookId}`, {
        title: "",
        author: "",
        status: newStatus,
      });
      const updatedBooks = books.map((book) =>
        book.id === bookId ? { ...book, status: newStatus } : book
      );
      setBooks(updatedBooks);
    } catch (err: any) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };



  const handleDeleteBook = async (bookId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/books/${bookId}`);
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
    } catch (err: any) {
      setError(err.message);
      setOpenSnackbar(true);
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <main className="flex flex-col bg-black justify-center items-center text-very-light-gray">
        <div className="container">
          <div className="bg-gray-300 p-5 flex items-center justify-between backdrop-blur bg-opacity-50">
            <div className="flex items-end text-black space-x-2">
              <div className="flex flex-col items-between">
                <input
                  className="text-gray-900 mb-2 text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  placeholder="Title"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({ ...newBook, title: e.target.value })
                  }
                />
                <input
                  className="text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  placeholder="Author"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({ ...newBook, author: e.target.value })
                  }
                />
              </div>

              <button
                className="text-white bg-blue-500 focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={handleAddBook}
              >
                Add Book
              </button>
            </div>
            <div className="text-2xl pr-56">
              <h1>The Book Store</h1>
            </div>

            <div></div>
          </div>

          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="container grid grid-cols md:grid-cols-3 md:h-[95vh]">
              <BookSection
                setBooks={setBooks}
                title="To Read"
                books={books.filter((book) => book.status === "To Read")}
                onMoveBook={handleMoveBook}
                onTakeBackBook={handleTakeBackBook}
                onDeleteBook={handleDeleteBook}
                getNextStatus={getNextStatus}
                getPreviousStatus={getPreviousStatus}
              />
              <BookSection
                setBooks={setBooks}
                title="In Progress"
                books={books.filter((book) => book.status === "In Progress")}
                onMoveBook={handleMoveBook}
                onTakeBackBook={handleTakeBackBook}
                onDeleteBook={handleDeleteBook}
                getNextStatus={getNextStatus}
                getPreviousStatus={getPreviousStatus}
              />
              <BookSection
                setBooks={setBooks}
                title="Completed"
                books={books.filter((book) => book.status === "Completed")}
                onMoveBook={handleMoveBook}
                onTakeBackBook={handleTakeBackBook}
                onDeleteBook={handleDeleteBook}
                getPreviousStatus={getPreviousStatus}
                getNextStatus={getNextStatus}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface BookSectionProps {
  setBooks: (books: Book[]) => void;
  title: string;
  books: Book[];
  onMoveBook: (bookId: number) => void;
  onTakeBackBook: (bookId: number) => void;
  onDeleteBook: (bookId: number) => void;
  getPreviousStatus: (books: Book[], bookId: number) => string;
  getNextStatus: (books: Book[], bookId: number) => string;
}

function BookSection({
  title,
  books,
  onMoveBook,
  onTakeBackBook,
  onDeleteBook,
  getPreviousStatus,
  getNextStatus,
}: BookSectionProps) {





  return (
    <section className="p-12 bg-blue-200 border border-2 border-blue-500 text-black space-y-8 flex flex-col justify-start">
      <div className="text-stone-950 text-xl font-bold">
        <h1>{title}</h1>
      </div>
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-gray-200 p-5 py-7 rounded-lg flex flex-col shadow-md"
        >
 
              <div className="py-3 font-bold text-2xl">Title: {book.title}</div>
    
          <div className="pb-4">Author: {book.author}</div>
          <div className="flex items-between p-3">
            {!(book.status === "To Read") && (
              <button
                type="button"
                className="text-white bg-blue-500 focus:outline-none focus:ring-4 text-[11px] rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={() => onTakeBackBook(book.id)}
                disabled={book.status === "To Read"}
              >
                Take Back {getPreviousStatus(books, book.id)}
              </button>
            )}
            {!(book.status === "Completed") && (
              <button
                type="button"
                className="text-white bg-blue-500 focus:outline-none focus:ring-4 text-[11px] rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={() => onMoveBook(book.id)}
                disabled={book.status === "Completed"}
              >
                Move to {getNextStatus(books, book.id)}
              </button>
            )}

            <button
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 text-[11px] rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => onDeleteBook(book.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
