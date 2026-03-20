import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';

const ManageBooks = () => {
    const [activeTab, setActiveTab] = useState('ADD');

    // States
    const [addForm, setAddForm] = useState({ bookID: '', title: '', isbn: '', author: '', category: '', shelfNumber: '', available: true, image: null });
    
    const [updateSearchId, setUpdateSearchId] = useState('');
    const [updateForm, setUpdateForm] = useState({ bookID: '', title: '', isbn: '', author: '', category: '', shelfNumber: '', available: true, image: null });
    
    const [deleteSearchId, setDeleteSearchId] = useState('');
    const [deleteBookInfo, setDeleteBookInfo] = useState(null);

    // Handlers
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (addForm.image) formData.append("bookImage", addForm.image);
            else formData.append("bookImage", new Blob([], { type: 'application/json' }), "empty.json"); // fallback if backend requires multipart file

            const bookJson = JSON.stringify({
                bookId: parseInt(addForm.bookID), title: addForm.title, ISBN: parseInt(addForm.isbn), author: addForm.author, category: addForm.category, shelfNumber: parseInt(addForm.shelfNumber), availability: addForm.available
            });
            formData.append("book", bookJson);
            
            await axios.post('https://librioo-backend-production.up.railway.app/api/addbook', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Book added successfully');
            setAddForm({ bookID: '', title: '', isbn: '', author: '', category: '', shelfNumber: '', available: true, image: null });
        } catch (err) {
            console.error(err); alert('Failed to add book');
        }
    };

    const handleUpdateSearch = async () => {
        try {
            const res = await axios.get(`https://librioo-backend-production.up.railway.app/api/getallbooks?bookid=${updateSearchId}`);
            const data = res.data;
            setUpdateForm({ bookID: data.bookId, title: data.title, isbn: data.ISBN, author: data.author, category: data.category, shelfNumber: data.shelfNumber, available: data.availability, image: null });
        } catch (err) {
            console.error(err); alert('Book not found');
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                bookId: parseInt(updateForm.bookID), title: updateForm.title, ISBN: parseInt(updateForm.isbn), author: updateForm.author, category: updateForm.category, shelfNumber: parseInt(updateForm.shelfNumber), availability: updateForm.available
            };
            await axios.put('https://librioo-backend-production.up.railway.app/api/updatebook', payload);
            alert('Book updated successfully');
        } catch (err) {
            console.error(err); alert('Failed to update book');
        }
    };

    const handleDeleteSearch = async () => {
        try {
            const res = await axios.get(`https://librioo-backend-production.up.railway.app/api/getallbooks?bookid=${deleteSearchId}`);
            setDeleteBookInfo(res.data);
        } catch (err) {
            console.error(err); alert('Book not found');
        }
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        if (!deleteBookInfo) return;
        try {
            await axios.delete(`https://librioo-backend-production.up.railway.app/api/deletebook?bookid=${deleteSearchId}`);
            alert('Book deleted successfully');
            setDeleteBookInfo(null); setDeleteSearchId('');
        } catch (err) {
            console.error(err); alert('Failed to delete book');
        }
    };

        return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900">Manage Books</h2>

                <div className="max-w-4xl p-8 mx-auto space-y-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex space-x-4 mb-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('ADD')}
                            className={`pb-2 px-1 ${activeTab === 'ADD' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            ADD
                        </button>
                        <button
                            onClick={() => setActiveTab('UPDATE')}
                            className={`pb-2 px-1 ${activeTab === 'UPDATE' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            UPDATE
                        </button>

                         <button
                            onClick={() => setActiveTab('DELETE')}
                            className={`pb-2 px-1 ${activeTab === 'DELETE' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            DELETE
                        </button>
                        
                    </div>

                    <div>
                        {/* Add Book Section */}
                        {activeTab === 'ADD' && (
                            <form className="max-w-2xl mx-auto space-y-6" onSubmit={handleAddSubmit}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Book ID</label>
                                        <input type="number" value={addForm.bookID} onChange={(e) => setAddForm({...addForm, bookID: e.target.value})} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 101" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Book Title</label>
                                        <input type="text" value={addForm.title} onChange={(e) => setAddForm({...addForm, title: e.target.value})} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. The Great Gatsby" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">ISBN</label>
                                        <input type="text" value={addForm.isbn} onChange={(e) => setAddForm({...addForm, isbn: e.target.value})} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 978-3-16-148410-0" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Author</label>
                                        <input type="text" value={addForm.author} onChange={(e) => setAddForm({...addForm, author: e.target.value})} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. F. Scott Fitzgerald" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <input type="text" value={addForm.category} onChange={(e) => setAddForm({...addForm, category: e.target.value})} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Fiction" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                                        <input type="file" onChange={(e) => setAddForm({...addForm, image: e.target.files[0]})} accept="image/*" className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white" />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Shelf Number</label>
                                        <input type="number" value={addForm.shelfNumber} onChange={(e) => setAddForm({...addForm, shelfNumber: e.target.value})} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 5" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2 flex items-center mt-2">
                                        <input type="checkbox" id="availability" checked={addForm.available} onChange={(e) => setAddForm({...addForm, available: e.target.checked})} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <label htmlFor="availability" className="ml-2 block text-sm font-medium text-gray-700">Available for Borrowing</label>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full px-4 py-2 text-white transition bg-black rounded-md hover:bg-gray-800">
                                        Add Book
                                    </button>
                                </div>
                            </form>
                        )}

                        
                        {/* Update Book Section */}
                        {activeTab === 'UPDATE' && (
                            <form className="max-w-2xl mx-auto space-y-6" onSubmit={handleUpdateSubmit}>
                                <div className="col-span-1 sm:col-span-2 mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Find Book By</label>
                                    <div className="flex rounded-md shadow-sm border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 bg-gray-50 px-3 py-2 items-center">
                                        <span className="text-gray-500 text-sm font-medium mr-2">Book ID:</span>
                                        <input type="text" value={updateSearchId} onChange={(e) => setUpdateSearchId(e.target.value)} className="flex-1 block w-full bg-transparent border-none focus:ring-0 p-0 text-sm" placeholder="Enter Book ID to edit..." />
                                        <button type="button" onClick={handleUpdateSearch} className="ml-2 inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100">
                                            Search
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4 border-t border-gray-200">
                                    <div className="col-span-1 sm:col-span-2">
                                        <h4 className="text-sm font-bold text-gray-900 mb-2">Update Details</h4>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Book Title</label>
                                        <input type="text" value={updateForm.title} onChange={(e) => setUpdateForm({...updateForm, title: e.target.value})} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">ISBN</label>
                                        <input type="text" value={updateForm.isbn} onChange={(e) => setUpdateForm({...updateForm, isbn: e.target.value})} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Author</label>
                                        <input type="text" value={updateForm.author} onChange={(e) => setUpdateForm({...updateForm, author: e.target.value})} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <input type="text" value={updateForm.category} onChange={(e) => setUpdateForm({...updateForm, category: e.target.value})} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Shelf Number</label>
                                        <input type="number" value={updateForm.shelfNumber} onChange={(e) => setUpdateForm({...updateForm, shelfNumber: e.target.value})} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2 flex items-center mt-2">
                                        <input type="checkbox" id="availabilityUpdate" checked={updateForm.available} onChange={(e) => setUpdateForm({...updateForm, available: e.target.checked})} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <label htmlFor="availabilityUpdate" className="ml-2 block text-sm font-medium text-gray-700">Available for Borrowing</label>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700">
                                        Update Book
                                    </button>
                                </div>
                            </form>
                        )}

                        
                        {/* Delete Book Section */}
                        {activeTab === 'DELETE' && (
                            <form className="max-w-2xl mx-auto space-y-6" onSubmit={handleDeleteSubmit}>
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Find Book By</label>
                                    <div className="flex rounded-md shadow-sm border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 bg-gray-50 px-3 py-2 items-center">
                                        <span className="text-gray-500 text-sm font-medium mr-2">Book ID:</span>
                                        <input type="text" value={deleteSearchId} onChange={(e) => setDeleteSearchId(e.target.value)} className="flex-1 block w-full bg-transparent border-none focus:ring-0 p-0 text-sm" placeholder="Enter Book ID to delete..." />
                                        <button type="button" onClick={handleDeleteSearch} className="ml-2 inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100">
                                            Search
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 mt-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>Deleting a book is irreversible. Please review the details below before proceeding.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4 space-y-4">
                                    <div className="col-span-1 sm:col-span-2">
                                        <input type="text" className="block w-full px-3 py-2 mt-1 bg-gray-100 text-gray-500 border-none rounded-md" disabled value={deleteBookInfo?.title || ''} />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">ISBN</label>
                                        <input type="text" className="block w-full px-3 py-2 mt-1 bg-gray-100 text-gray-500 border-none rounded-md" disabled value={deleteBookInfo?.ISBN || ''} />
                                    </div>
                                </div>
                                <div className="pt-4 mt-6">
                                    <button type="submit" className="w-full px-4 py-2 text-white transition bg-red-600 rounded-md hover:bg-red-700">
                                        Delete Book
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ManageBooks;
