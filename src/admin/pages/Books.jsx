import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Default endpoint for books over REST
                const response = await axios.get('http://localhost:8080/api/books');
                
                const formattedBooks = response.data.map(book => ({
                    id: book.bookId,
                    title: book.title || 'Unknown',
                    author: book.author || 'Unknown',
                    category: book.category || 'Unknown',
                    isbn: book.ISBN || book.isbn || 'Unknown',
                    status: book.availability ? 'Available' : 'Unavailable',
                    location: book.shelfNumber ? `Shelf ${book.shelfNumber}` : 'Unknown'
                }));
                setBooks(formattedBooks);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h2 className="text-3xl font-bold text-gray-900">Books</h2>

                    {/* Search Bar */}
                    <div className="relative flex w-full overflow-hidden bg-white border border-gray-300 rounded-lg shadow-sm sm:w-96 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <select className="py-2 pl-3 pr-8 text-sm text-gray-700 border-r border-gray-300 border-none outline-none cursor-pointer bg-gray-50 focus:ring-0">
                            <option>Title</option>
                            <option>Author</option>
                            <option>ISBN</option>
                        </select>
                        <input
                            type="text"
                            className="block w-full py-2 pl-3 pr-10 leading-5 placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none sm:text-sm"
                            placeholder="Search..."
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Books Table */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50/50">
                                <tr>
                                    {['ID', 'Title', 'Author', 'Category', 'ISBN', 'Status', 'Location'].map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase border-r border-gray-200 last:border-r-0"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-sm font-medium text-center text-gray-500">Loading books...</td>
                                    </tr>
                                ) : books.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-sm font-medium text-center text-gray-500">No books found.</td>
                                    </tr>
                                ) : (
                                    books.map((book, idx) => (
                                    <tr key={idx} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {book.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {book.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {book.author}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {book.category}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {book.isbn}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {book.status}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                                            {book.location}
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Books;
