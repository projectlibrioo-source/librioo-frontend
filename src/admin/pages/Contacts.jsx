import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';

const Contact = () => {
    const [searchFilter, setSearchFilter] = useState('All');
    const [searchField, setSearchField] = useState('Email');
    const [searchText, setSearchText] = useState('');
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://librioo-backend-production.up.railway.app/api/settings/admins');
            
            // Map DB entity (Admin.java: adminId, adminUsername, adminRole) to UI structure
            const mappedAdmins = (res.data || []).map(admin => {
                // Since our model lacks specific Name and Phone fields, we derive Name from username/email
                const extractName = admin.adminUsername ? admin.adminUsername.split('@')[0] : 'Unknown Admin';
                
                return {
                    id: admin.adminId,
                    name: extractName,
                    role: admin.adminRole,
                    status: 'Active', // Mocking status since there's no active/blocked flag in DB yet
                    phone: 'N/A',
                    email: admin.adminUsername
                };
            });
            setAdmins(mappedAdmins);
        } catch (error) {
            console.error('Failed to fetch admins', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAdmins = admins.filter(admin => {
        // Dropdown Filter
        let roleMatch = true;
        if (searchFilter === 'Super Admin') roleMatch = admin.role === 'SUPER_ADMIN';
        if (searchFilter === 'Admin') roleMatch = admin.role === 'ADMIN';
        
        // Text Search
        let textMatch = true;
        if (searchText) {
            const term = searchText.toLowerCase();
            if (searchField === 'Name') textMatch = admin.name.toLowerCase().includes(term);
            if (searchField === 'ID') textMatch = admin.id.toString().includes(term);
            if (searchField === 'Email') textMatch = admin.email.toLowerCase().includes(term);
        }

        return roleMatch && textMatch;
    });

    const activeCount = admins.filter(a => a.status === 'Active').length;
    const blockedCount = admins.filter(a => a.status === 'Blocked').length;

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Admins (Contact)</h2>
                        <p className="text-sm text-gray-500 mt-1">Admin / Admins List</p>
                    </div>

                    <a href="/admin/settings" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        + Add New Admin
                    </a>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-white border rounded-lg shadow-sm flex items-center space-x-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Admins</p>
                            <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-white border rounded-lg shadow-sm flex items-center space-x-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Active</p>
                            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-white border rounded-lg shadow-sm flex items-center space-x-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Blocked</p>
                            <p className="text-2xl font-bold text-red-600">{blockedCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex w-full md:w-1/2 space-x-2">

                            <select
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="w-1/3 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="All">All Roles</option>
                                <option value="Super Admin">SUPER_ADMIN</option>
                                <option value="Admin">ADMIN</option>
                            </select>

                            <div className="relative w-2/3 flex items-center border rounded-md focus-within:ring-1 focus-within:ring-blue-500">
                                <select
                                    value={searchField}
                                    onChange={(e) => setSearchField(e.target.value)}
                                    className="text-sm py-2 pl-3 border-none focus:ring-0 text-gray-600 bg-gray-50"
                                >
                                    <option value="Email">Email</option>
                                    <option value="Name">Name</option>
                                    <option value="ID">ID</option>
                                </select>
                                <div className="h-6 w-px bg-gray-300"></div>
                                <input
                                    type="text"
                                    placeholder={`Search by ${searchField}...`}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full pl-3 py-2 text-sm border-none focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-2 border text-sm hover:bg-gray-50 rounded text-gray-600">Export CSV</button>
                        </div>
                    </div>


                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3"></th>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10">
                                            <div className="inline-block w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        </td>
                                    </tr>
                                ) : filteredAdmins.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-gray-500">
                                            No admin records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAdmins.map((mem, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-4 py-3"><input type="checkbox" className="rounded text-blue-600" /></td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{mem.id}</td>
                                            <td className="px-4 py-3 capitalize">{mem.name}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${mem.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {mem.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                                    {mem.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{mem.phone}</td>
                                            <td className="px-4 py-3 text-blue-600">{mem.email}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Contact;
