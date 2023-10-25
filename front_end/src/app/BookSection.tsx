import { get } from "http";
import BookCard from "./BookCard";

interface BookSectionProps {
  title: string;
  books: Book[];
  onMoveBook: (bookId: number) => void;
  onTakeBackBook: (bookId: number) => void;
  onDeleteBook: (bookId: number) => void;
  getPreviousStatus: (books: Book[], bookId: number) => string;
  getNextStatus: (books: Book[], bookId: number) => string;
}

export default function BookSection({
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
          className="bg-gray-200 p-5 py-7 rounded-lg flex flex-col  shadow-md"
        >
          <div className="py-3 font-bold text-2xl ">Title: {book.title}</div>
          <div className="pb-4">Author: {book.author}</div>

          <div className="flex items-between p-3">
            {!(book.status == "To Read") && (
              <button
                type="button"
                className="text-white bg-blue-500 focus:outline-none focus:ring-4 text-[11px] rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                onClick={() => onTakeBackBook(book.id)}
                disabled={book.status === "To Read"}
              >
                Take Back {getPreviousStatus(books, book.id)}
              </button>
            )}

            {!(book.status == "Completed") && (
              <button
                type="button"
                className="text-white bg-blue-500 focus:outline-none focus:ring-4 text-[11px] rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 "
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
