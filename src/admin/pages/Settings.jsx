import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';

const Settings = () => {
    const [enableFines, setEnableFines] = useState(false);
    const [finesList, setFinesList] = useState([]);
    
    // Form state for Fines category
    const [categoryName, setCategoryName] = useState('Student');
    const [maxLoans, setMaxLoans] = useState(5);
    const [fineRate, setFineRate] = useState(0.50);

    // Form state for Admin
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminRole, setAdminRole] = useState('ADMIN');
    const [adminPassword, setAdminPassword] = useState('');

    // Assuming a role for view rendering logic. Can be replaced with context/JWT.
    const currentUserRole = 'SUPER_ADMIN'; 

    useEffect(() => {
        fetchFines();
    }, []);

    const fetchFines = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/settings/fines');
            setFinesList(res.data);
            if (res.data.length > 0) {
                setEnableFines(true);
            }
        } catch (err) {
            console.error('Failed to fetch fines rules', err);
        }
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        const payload = {
            category: categoryName,
            max_loans: parseInt(maxLoans, 10),
            rate: parseFloat(fineRate)
        };

        try {
            await axios.post('http://localhost:8080/api/settings/fines', payload);
            alert(`${categoryName} category rules updated successfully!`);
            fetchFines(); // Refresh table
        } catch (err) {
            console.error('Error saving fine category', err);
            alert('Failed to save rules!');
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        
        if (!adminEmail || !adminPassword) {
            alert('Username (Email) and Password are required!');
            return;
        }

        const payload = {
            adminUsername: adminEmail, // Mapping email to adminUsername
            password: adminPassword,
            adminRole: adminRole
        };

        try {
            await axios.post('http://localhost:8080/api/settings/admins', payload);
            alert(`Admin ${adminEmail} created successfully as ${adminRole}!`);
            setAdminName('');
            setAdminEmail('');
            setAdminPassword('');
            setAdminRole('ADMIN');
        } catch (err) {
            console.error('Error creating admin', err);
            alert(err.response?.data || 'Failed to create admin account!');
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Admin / Settings</p>
                </div>

                {currentUserRole === 'SUPER_ADMIN' ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Circulation Rules Card */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Circulation Rules</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Enable fines</span>
                                    <button
                                        onClick={() => setEnableFines(!enableFines)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enableFines ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`${enableFines ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2">Patron Type</th>
                                            <th className="px-4 py-2">Max Loans</th>
                                            <th className="px-4 py-2">Fine Rate / Day</th>
                                            <th className="px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {finesList.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">No circulation rules defined yet.</td>
                                            </tr>
                                        ) : (
                                            finesList.map((fine, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50 transition">
                                                    <td className="px-4 py-2 font-medium text-gray-900">{fine.category}</td>
                                                    <td className="px-4 py-2">{fine.max_loans} Books</td>
                                                    <td className="px-4 py-2">Rs. {fine.rate.toFixed(2)}</td>
                                                    <td className="px-4 py-2"><button className="text-blue-600 hover:text-blue-800 hover:underline">Edit</button></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Patron Categories Card */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Configure Rules</h3>
                            <form className="space-y-4" onSubmit={handleSaveCategory}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Patron Category</label>
                                    <select 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                        value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Lecturer">Lecturer</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Loans</label>
                                        <input 
                                            type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
                                            value={maxLoans} onChange={(e) => setMaxLoans(e.target.value)} required min="1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Fine Rate (LKR / Day)</label>
                                        <input 
                                            type="number" step="0.5" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
                                            value={fineRate} onChange={(e) => setFineRate(e.target.value)} required min="0"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Save Rules</button>
                            </form>
                        </div>

                        {/* Role-Based Section: Super Admin Only Settings */}
                        <div className="p-6 bg-white border border-blue-200 rounded-lg shadow-sm lg:col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-bl-lg font-bold text-xs">SUPER ADMIN ONLY</div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Assign Admins & Super Admins</h3>
                                    <p className="text-sm text-gray-500">Only Super Admins can add or promote users to administrative roles.</p>
                                </div>
                            </div>

                            <form className="space-y-4 bg-gray-50 p-4 border border-gray-200 rounded-md" onSubmit={handleCreateAdmin}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input 
                                            type="text" placeholder="John Doe" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
                                            value={adminName} onChange={(e) => setAdminName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Address (Username)</label>
                                        <input 
                                            type="email" placeholder="john@library.edu" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
                                            value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Assign Role</label>
                                        <select 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                            value={adminRole} onChange={(e) => setAdminRole(e.target.value)}
                                        >
                                            <option value="ADMIN">Admin</option>
                                            <option value="SUPER_ADMIN">Super Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Temporary Password</label>
                                    <input 
                                        type="password" placeholder="Pass123!" className="mt-1 block w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
                                        value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition shadow-sm mt-4">
                                    Create Account
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex items-center justify-center py-12">
                        <div className="text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <h3 className="text-lg font-bold text-gray-700">Access Restricted</h3>
                            <p className="text-sm text-gray-500">You must be a Super Admin to view and manage settings.</p>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Settings;
