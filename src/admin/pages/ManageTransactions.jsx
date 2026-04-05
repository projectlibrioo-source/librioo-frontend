import React, { useState } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

const ManageTransactions = () => {
    const [activeTab, setActiveTab] = useState('BORROW');

    // BORROW FORM STATE
    const [borrowSearchUserId, setBorrowSearchUserId] = useState('');
    const [borrowSearchBookId, setBorrowSearchBookId] = useState('');
    const [borrowData, setBorrowData] = useState({
        userId: '',
        patronType: '',
        userName: '',
        bookId: '',
        bookTitle: '',
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0] // Default 14 days
    });

    // RETURN FORM STATE
    const [returnSearchBookId, setReturnSearchBookId] = useState('');
    const [returnData, setReturnData] = useState({
        bookId: '',
        bookTitle: '',
        userId: '',
        patronType: '',
        userName: '',
        borrowDate: '',
        expectedReturnDate: '',
        actualReturnDate: new Date().toISOString().split('T')[0],
        overdueDays: 0,
        fineTotal: 0
    });

    const calculateOverdueDays = (expectedDate, actualDate) => {
        const expected = new Date(expectedDate);
        const actual = new Date(actualDate);
        const devDiff = actual.getTime() - expected.getTime();
        const days = Math.ceil(devDiff / (1000 * 3600 * 24));
        return days > 0 ? days : 0;
    };

    // --- BORROW OPERATIONS ---

    const handleVerifyUser = async (e) => {
        e.preventDefault();
        if (!borrowSearchUserId) { alert("Please enter User ID"); return; }
        const parsedId = parseInt(borrowSearchUserId, 10);
        
        try {
            // Try Member
            const res = await axios.get(`https://librioo-backend-production.up.railway.app/api/getallmembers?memberid=${parsedId}`);
            if (res.data) {
                setBorrowData(prev => ({ ...prev, userId: parsedId, patronType: res.data.status || 'Member', userName: res.data.fullName }));
                return;
            }
        } catch (err) {
            // Ignore 404, try Guest below
        }

        try {
            // Try Guest
            const res = await axios.get(`https://librioo-backend-production.up.railway.app/api/getallguests?guestid=${parsedId}`);
            if (res.data) {
                setBorrowData(prev => ({ ...prev, userId: parsedId, patronType: 'Guest', userName: res.data.fullName }));
                return;
            }
        } catch (err) {
            alert('User not found!');
            setBorrowData(prev => ({ ...prev, userId: '', patronType: '', userName: '' }));
        }
    };

    const handleVerifyBookBorrow = async (e) => {
        e.preventDefault();
        if (!borrowSearchBookId) { alert("Please enter Book ID"); return; }
        const parsedId = parseInt(borrowSearchBookId, 10);

        try {
            const res = await axios.get(`https://librioo-backend-production.up.railway.app/api/getallbooks?bookid=${parsedId}`);
            if (res.data) {
                if (!res.data.availability) {
                    alert('Book is currently unavailable!');
                    return;
                }
                setBorrowData(prev => ({ ...prev, bookId: parsedId, bookTitle: res.data.title }));
            }
        } catch (err) {
            alert('Book not found!');
            setBorrowData(prev => ({ ...prev, bookId: '', bookTitle: '' }));
        }
    };

    const handleBorrowSubmit = async (e) => {
        e.preventDefault();
        if (!borrowData.userId || !borrowData.bookId) {
            alert('Please verify both User and Book first!');
            return;
        }

        const payload = {
            libraryId: borrowData.userId,
            bookId: borrowData.bookId,
            borrowDate: borrowData.borrowDate,
            returnDate: borrowData.returnDate,
            category: borrowData.patronType,
            status: "Borrowed",        // Must match DB convention
            borrowedThrough: "Counter" // Tag as counter borrow for reporting
        };

        try {
            const res = await axios.post('https://librioo-backend-production.up.railway.app/api/borrowbook', payload);
            if (res.status === 200 || res.status === 201) {
                alert('Book borrowed successfully!');
                clearBorrowForm();
            }
        } catch (err) {
            if (err.response && err.response.status === 403) {
                alert('Borrow denied! User has reached their limit or has overdue books.');
            } else {
                console.error(err);
                alert('Failed to borrow book! Check server logic.');
            }
        }
    };

    const clearBorrowForm = () => {
        setBorrowSearchUserId('');
        setBorrowSearchBookId('');
        setBorrowData({
            userId: '', patronType: '', userName: '', bookId: '', bookTitle: '',
            borrowDate: new Date().toISOString().split('T')[0],
            returnDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]
        });
    };

    // --- RETURN OPERATIONS ---

    const handleLookupReturnBook = async (e) => {
        e.preventDefault();
        if (!returnSearchBookId) { alert("Please enter Book ID"); return; }
        const parsedBookId = parseInt(returnSearchBookId, 10);

        try {
            // 1. Fetch Book Details
            let bookTitle = '';
            try {
                const bookRes = await axios.get(`https://librioo-backend-production.up.railway.app/api/getallbooks?bookid=${parsedBookId}`);
                if (bookRes.data && bookRes.data.title) bookTitle = bookRes.data.title;
            } catch(e) { console.error("Could not fetch book title"); }

            // 2. Fetch Transaction
            const transRes = await axios.get(`https://librioo-backend-production.up.railway.app/api/getusers?bookid=${parsedBookId}`);
            if (!transRes.data) throw new Error("No transaction found");

            const txn = transRes.data;
            if (txn.status === 'Returned' || txn.status === 'Completed') {
                alert("This book is already returned!");
                return;
            }

            const expectedReturn = txn.returnDate; // yyyy-MM-dd
            const actualReturn = returnData.actualReturnDate;
            const overdueDays = calculateOverdueDays(expectedReturn, actualReturn);

            // 3. Fetch User Details for Name display
            let userName = 'Unknown';
            try {
                 const mRes = await axios.get(`https://librioo-backend-production.up.railway.app/api/getallmembers?memberid=${txn.libraryId}`);
                 if (mRes.data) userName = mRes.data.fullName;
            } catch(e){
                 try {
                     const gRes = await axios.get(`https://librioo-backend-production.up.railway.app/api/getallguests?guestid=${txn.libraryId}`);
                     if (gRes.data) userName = gRes.data.fullName;
                 } catch(err){}
            }

            // 4. Fetch Fines
            let fineTotal = 0;
            try {
                const dto = { libraryId: txn.libraryId, bookId: txn.bookId, category: txn.category };
                const fineRes = await axios.post('https://librioo-backend-production.up.railway.app/api/getfines', dto);
                if (fineRes.data) fineTotal = fineRes.data;
            } catch (err) {
                console.error("Fines calculation failed", err);
            }

            setReturnData({
                bookId: parsedBookId,
                bookTitle: bookTitle,
                userId: txn.libraryId,
                patronType: txn.category,
                userName: userName,
                borrowDate: txn.borrowDate,
                expectedReturnDate: expectedReturn,
                actualReturnDate: actualReturn,
                overdueDays: overdueDays,
                fineTotal: fineTotal
            });

        } catch (err) {
            console.error(err);
            alert('No active transaction found for this book ID!');
            clearReturnForm();
        }
    };

    const handleReturnSubmit = async (e) => {
        e.preventDefault();
        if (!returnData.bookId || !returnData.userId) {
            alert('Please lookup a book first!');
            return;
        }

        const dto = {
            libraryId: returnData.userId,
            bookId: returnData.bookId,
            category: returnData.patronType
        };

        try {
            const res = await axios.put('https://librioo-backend-production.up.railway.app/api/confirmreturn', dto);
            if (res.status === 200 || res.status === 201) {
                alert(`Return processed successfully! Fines collected: Rs. ${returnData.fineTotal}`);
                clearReturnForm();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to process return!');
        }
    };

    const clearReturnForm = () => {
        setReturnSearchBookId('');
        setReturnData({
            bookId: '', bookTitle: '', userId: '', patronType: '', userName: '',
            borrowDate: '', expectedReturnDate: '',
            actualReturnDate: new Date().toISOString().split('T')[0],
            overdueDays: 0, fineTotal: 0
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900">Manage Transactions</h2>

                <div className="max-w-4xl p-8 mx-auto bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex space-x-4 mb-6 border-b border-gray-200">
                        <button
                            onClick={() => {setActiveTab('BORROW'); clearBorrowForm();}}
                            className={`pb-2 px-1 ${activeTab === 'BORROW' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            BORROW
                        </button>
                        <button
                            onClick={() => {setActiveTab('RETURN'); clearReturnForm();}}
                            className={`pb-2 px-1 ${activeTab === 'RETURN' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            RETURN
                        </button>
                    </div>

                    {activeTab === 'BORROW' && (
                        <form onSubmit={handleBorrowSubmit}>
                            {/* MEMBER VERIFICATION */}
                            <div className="mb-8">
                                <h3 className="pb-2 mb-6 text-xl font-bold text-gray-900 border-b">Member Details</h3>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Find User By</label>
                                    <div className="flex gap-2 sm:col-span-2">
                                        <div className="flex flex-1 bg-gray-50 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden px-3 py-2 items-center">
                                            <span className="text-gray-500 text-sm font-medium mr-2">User ID:</span>
                                            <input 
                                                type="text" placeholder="Enter User ID..." className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm" 
                                                value={borrowSearchUserId} onChange={e => setBorrowSearchUserId(e.target.value)}
                                            />
                                        </div>
                                        <button type="button" onClick={handleVerifyUser} className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 whitespace-nowrap">Verify</button>
                                    </div>
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Patron Type</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled placeholder='Auto filled after verify' value={borrowData.patronType} />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Name</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled placeholder='Auto filled after verify' value={borrowData.userName} />
                                </div>
                            </div>

                            {/* BOOK VERIFICATION */}
                            <div className="mb-8">
                                <h3 className="pb-2 mb-6 text-xl font-bold text-gray-900 border-b">Book Details</h3>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Find Book By</label>
                                    <div className="flex gap-2 sm:col-span-2">
                                        <div className="flex flex-1 bg-gray-50 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden px-3 py-2 items-center">
                                            <span className="text-gray-500 text-sm font-medium mr-2">Book ID / Barcode:</span>
                                            <input 
                                                type="text" placeholder="Scan or enter Book ID..." className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm" 
                                                value={borrowSearchBookId} onChange={e => setBorrowSearchBookId(e.target.value)}
                                            />
                                        </div>
                                        <button type="button" onClick={handleVerifyBookBorrow} className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 whitespace-nowrap">Verify</button>
                                    </div>
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Title</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled placeholder='Auto filled after verify' value={borrowData.bookTitle} />
                                </div>
                            </div>

                            {/* TRANSACTION DETAILS */}
                            <div className="mb-8">
                                <h3 className="pb-2 mb-6 text-xl font-bold text-gray-900 border-b">Transaction Summary</h3>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Borrow Date</label>
                                    <input type="date" value={borrowData.borrowDate} onChange={e => setBorrowData({...borrowData, borrowDate: e.target.value})} className="block w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Expected Return Date</label>
                                    <input type="date" value={borrowData.returnDate} onChange={e => setBorrowData({...borrowData, returnDate: e.target.value})} className="block w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Transaction Status</label>
                                    <div className="relative sm:col-span-2">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        </span>
                                        <input type="text" className="block w-full py-2 pl-10 pr-3 font-mono text-gray-500 bg-gray-200 border border-gray-300 rounded-md" value="Pending" readOnly disabled />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <button type="button" onClick={clearBorrowForm} className="px-6 py-2 border rounded font-medium hover:bg-gray-50 transition mr-2">Clear Form</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">Confirm Borrow</button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'RETURN' && (
                        <form onSubmit={handleReturnSubmit}>
                            {/* BOOK LOOKUP */}
                            <div className="mb-8">
                                <h3 className="pb-2 mb-6 text-xl font-bold text-gray-900 border-b">Book Details</h3>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Find Book By</label>
                                    <div className="flex gap-2 sm:col-span-2">
                                        <div className="flex flex-1 bg-gray-50 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden px-3 py-2 items-center">
                                            <span className="text-gray-500 text-sm font-medium mr-2">Book ID / Barcode:</span>
                                            <input 
                                                type="text" placeholder="Scan or enter Book ID..." className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm" 
                                                value={returnSearchBookId} onChange={e => setReturnSearchBookId(e.target.value)}
                                            />
                                        </div>
                                        <button type="button" onClick={handleLookupReturnBook} className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 whitespace-nowrap">Look Up</button>
                                    </div>
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Title</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled placeholder='Auto-filled after look up' value={returnData.bookTitle} />
                                </div>
                            </div>

                            {/* PATRON DETAILS */}
                            <div className="mb-8">
                                <h3 className="pb-2 mb-6 text-xl font-bold text-gray-900 border-b">Patron Details</h3>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Patron Type</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled value={returnData.patronType} />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Borrowed By</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled value={`${returnData.userName} (ID: ${returnData.userId})`} />
                                </div>
                            </div>

                            {/* RETURN SUMMARY */}
                            <div className="mb-8">
                                <h3 className="pb-2 mb-6 text-xl font-bold text-gray-900 border-b">Return Summary</h3>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Borrow Date</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled placeholder='yyyy-mm-dd' value={returnData.borrowDate} />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Due Date</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled placeholder='yyyy-mm-dd' value={returnData.expectedReturnDate} />
                                </div><br />
                                
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Actual Return Date</label>
                                    <input type="date" value={returnData.actualReturnDate} onChange={e => {
                                        const newActual = e.target.value;
                                        setReturnData(prev => ({
                                            ...prev, 
                                            actualReturnDate: newActual,
                                            overdueDays: calculateOverdueDays(prev.expectedReturnDate, newActual)
                                        }));
                                    }} className="block w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Overdue Days</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled value={returnData.overdueDays} />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-bold text-gray-900 sm:text-right">Fines Total</label>
                                    <input type="text" className="block w-full px-3 py-2 bg-green-100 text-green-800 font-bold border border-green-300 rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled value={`Rs. ${returnData.fineTotal.toFixed(2)}`} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t">
                                 <button type="button" onClick={clearReturnForm} className="px-6 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition">Clear Form</button>
                                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition" disabled={!returnData.bookId}>Complete Return</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ManageTransactions;
