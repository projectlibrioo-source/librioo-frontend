import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import AdminLayout from '../layouts/AdminLayout';

ChartJS.register(ArcElement, Tooltip, Legend);

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Use enriched endpoint — returns member name + book title resolved server-side
                const response = await axios.get('https://librioo-backend-production.up.railway.app/api/transactions/enriched');
                const data = response.data;
                const formatted = data.map(tx => ({
                    id: tx.transactionId || 'N/A',
                    username: tx.memberName || `User ${tx.libraryId}`,
                    userId: tx.libraryId || 'N/A',
                    bookId: tx.bookId || 'N/A',
                    bookTitle: tx.bookTitle || `Book ${tx.bookId}`,
                    type: tx.returnDate ? 'Return' : 'Borrow',
                    date: tx.borrowDate || 'N/A',
                    returnDate: tx.returnDate || 'N/A',
                    status: tx.status || 'N/A',
                    borrowedThrough: tx.borrowedThrough || 'Counter'
                }));
                setTransactions(formatted);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const chartCounts = useMemo(() => {
        let borrowed = 0, returned = 0, overdue = 0, pending = 0;
        const today = new Date();
        transactions.forEach(tx => {
            const status = (tx.status || '').toLowerCase();
            const returnDate = tx.returnDate ? new Date(tx.returnDate) : null;
            if (status === 'returned' || status === 'completed') returned++;
            else if (returnDate && returnDate < today && status === 'borrowed') overdue++;
            else if (status === 'borrowed') borrowed++;
            else pending++;
        });
        return [borrowed, returned, overdue, pending];
    }, [transactions]);

    const chartData = {
        labels: ['Borrowed', 'Returned', 'Overdue', 'Other'],
        datasets: [
            {
                data: chartCounts.some(v => v > 0) ? chartCounts : [1, 1, 1, 1], // fallback if empty
                backgroundColor: [
                    '#3B82F6', // Blue
                    '#F97316', // Orange
                    '#9CA3AF', // Gray
                    '#FACC15', // Yellow
                ],
                borderColor: [
                    '#ffffff',
                    '#ffffff',
                    '#ffffff',
                    '#ffffff',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                }
            }
        },
        maintainAspectRatio: false,
    };


    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900">Transactions</h2>

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Transactions Table */}
                    <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                    <tr>
                                        {['Transaction ID', 'Username', 'User ID', 'Book ID', 'Book Title', 'Transaction Type', 'Borrowed Through', 'Transaction Date', 'Return Date', 'Status'].map((header) => (
                                            <th
                                                key={header}
                                                scope="col"
                                                className="px-4 py-3 text-xs font-bold text-center text-gray-900 border border-gray-300 bg-blue-50/20"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10" className="px-4 py-4 text-sm font-medium text-center text-gray-500">Loading transactions...</td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="px-4 py-4 text-sm font-medium text-center text-gray-500">No transactions found.</td>
                                        </tr>
                                    ) : (
                                        transactions.map((transaction, idx) => (
                                        <tr key={idx} className="transition-colors hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.id}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.username}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.userId}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.bookId}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.bookTitle}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.type}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.borrowedThrough}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.date}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.returnDate}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-center text-gray-900 border border-gray-300 whitespace-nowrap">{transaction.status}</td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="flex flex-col items-center w-full p-6 bg-white border border-gray-200 rounded-lg shadow lg:w-96">
                        <h3 className="mb-4 text-lg font-bold text-gray-700">Today Transactions</h3>
                        <div className="w-64 h-64">
                            <Pie data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Transactions;
