import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch from a general users endpoint
                const response = await axios.get('https://librioo-backend-production.up.railway.app/api/users');
                
                const formattedUsers = response.data.map(user => ({
                    id: user.libraryID || user.guestID || user.id || 'N/A',
                    username: user.fullName || user.username || 'Unknown',
                    email: user.email || 'N/A',
                    joined: user.joinedDate || 'N/A',
                    lastLogin: user.lastLogin || 'N/A',
                    type: user.userType || user.role || (user.libraryID ? 'Member' : 'Guest'),
                    booksBorrowed: user.booksBorrowed || 0
                }));
                
                setUsers(formattedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h2 className="text-3xl font-bold text-gray-900">Users</h2>

                    {/* Search Bar */}
                    <div className="relative flex w-full overflow-hidden bg-white border border-gray-300 rounded-lg shadow-sm sm:w-96 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <select className="py-2 pl-3 pr-8 text-sm text-gray-700 border-r border-gray-300 border-none outline-none cursor-pointer bg-gray-50 focus:ring-0">
                            <option>Username</option>
                            <option>ID</option>
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

                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50/50">
                                <tr>
                                    {['User ID', 'Username', 'Email', 'Joined Date', 'Last Login', 'Membership Type', 'No of Books Borrowed'].map((header) => (
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
                                        <td colSpan="7" className="px-6 py-4 text-sm font-medium text-center text-gray-500">Loading users...</td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-sm font-medium text-center text-gray-500">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user, idx) => (
                                    <tr key={idx} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {user.joined}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {user.lastLogin}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                            {user.type}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                                            {user.booksBorrowed}
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

export default Users;
