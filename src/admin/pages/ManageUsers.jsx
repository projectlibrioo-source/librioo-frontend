import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';

const ManageUsers = () => {
    const [activeTab, setActiveTab] = useState('ADD');
    const [userRole, setUserRole] = useState('MEMBER');
    const [formErrors, setFormErrors] = useState({});

    const [addForm, setAddForm] = useState({
        id: '',
        fullname: '',
        address: '',
        occupation: '',
        workSchoolAddress: '',
        email: '',
        phoneNumber: '',
        age: '',
        nicNumber: '',
        userType: 'Student'
    });

    const [extraDetails, setExtraDetails] = useState({
        studentId: '',
        course: '',
        department: '',
        designation: ''
    });

    const [searchId, setSearchId] = useState('');
    const [updateForm, setUpdateForm] = useState({
        id: '',
        role: 'Member',
        fullname: '',
        address: '',
        email: '',
        phoneNumber: ''
    });
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

    const [deleteSearchId, setDeleteSearchId] = useState('');
    const [deleteUser, setDeleteUser] = useState(null);

    // ── Validation ──────────────────────────────────────────────
    const validate = (form, role) => {
        const errors = {};

        // Library ID / Guest ID: integers only, max 4 digits
        if (!form.id) {
            errors.id = 'ID is required.';
        } else if (!/^\d+$/.test(form.id)) {
            errors.id = 'ID must contain digits only.';
        } else if (form.id.length > 4) {
            errors.id = 'ID must be at most 4 digits.';
        }

        // Full Name: letters and spaces only
        if (!form.fullname) {
            errors.fullname = 'Full name is required.';
        } else if (!/^[A-Za-z\s]+$/.test(form.fullname)) {
            errors.fullname = 'Full name must contain letters only.';
        }

        // Email: must contain @
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'Please enter a valid email address.';
        }

        // Phone Number: exactly 10 digits
        if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) {
            errors.phoneNumber = 'Phone number must be exactly 10 digits.';
        }

        // Age: integer, 0–99
        if (!form.age && form.age !== 0) {
            errors.age = 'Age is required.';
        } else if (!/^\d+$/.test(String(form.age))) {
            errors.age = 'Age must be a whole number.';
        } else if (parseInt(form.age, 10) < 0 || parseInt(form.age, 10) > 99) {
            errors.age = 'Age must be between 0 and 99.';
        }

        // NIC Number: exactly 12 digits
        if (form.nicNumber && !/^\d{12}$/.test(form.nicNumber)) {
            errors.nicNumber = 'NIC number must be exactly 12 digits.';
        }

        return errors;
    };

    // ── Handlers ─────────────────────────────────────────────────
    const handleAddChange = (field, value) => {
        setAddForm(prev => ({ ...prev, [field]: value }));
        // Clear error for this field as user types
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleUpdateChange = (field, value) => {
        setUpdateForm(prev => ({ ...prev, [field]: value }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        const errors = validate(addForm, userRole);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        try {
            const endpoint =
                userRole === 'MEMBER'
                    ? 'https://librioo-backend-production.up.railway.app/api/addmember'
                    : 'https://librioo-backend-production.up.railway.app/api/addguest';

            const payload =
                userRole === 'MEMBER'
                    ? {
                        libraryID: parseInt(addForm.id, 10),
                        fullName: addForm.fullname,
                        address: addForm.address,
                        occupation: addForm.occupation,
                        workOrSchoolAddress: addForm.workSchoolAddress,
                        email: addForm.email,
                        phoneNumber: addForm.phoneNumber,
                        age: parseInt(addForm.age, 10),
                        NICNumber: addForm.nicNumber,
                        status: 'ACTIVE',
                        userType: addForm.userType,
                        department: extraDetails.department,
                        designation: extraDetails.designation
                    }
                    : {
                        guestID: parseInt(addForm.id, 10),
                        fullName: addForm.fullname,
                        address: addForm.address,
                        email: addForm.email,
                        phoneNumber: addForm.phoneNumber,
                        age: parseInt(addForm.age, 10),
                        NICNumber: addForm.nicNumber
                    };

            const response = await axios.post(endpoint, payload);
            console.log('Response:', response.data);
            alert(`${userRole === 'MEMBER' ? 'Member' : 'Guest'} added successfully`);

            setAddForm({
                id: '',
                fullname: '',
                address: '',
                occupation: '',
                workSchoolAddress: '',
                email: '',
                phoneNumber: '',
                age: '',
                nicNumber: '',
                userType: 'Student'
            });
            setExtraDetails({ studentId: '', course: '', department: '', designation: '' });
            setFormErrors({});

        } catch (err) {
            console.error('Add user error:', err);
            alert(err.response?.data || 'Failed to add user');
        }
    };

    const handleFindUser = async () => {
        if (!searchId || searchId.trim() === '') {
            alert('Please enter a User ID');
            return;
        }
        const parsedId = parseInt(searchId, 10);
        if (Number.isNaN(parsedId)) {
            alert('User ID must be a number');
            return;
        }
        setShowUpdateConfirm(false);

        try {
            const memberRes = await axios.get('https://librioo-backend-production.up.railway.app/api/getallmembers', {
                params: { memberid: parsedId }
            });
            if (memberRes.data) {
                const data = memberRes.data;
                setUpdateForm({ id: parsedId, role: 'Member', fullname: data.fullName || '', address: data.address || '', email: data.email || '', phoneNumber: data.phoneNumber || '' });
                setShowUpdateConfirm(true);
                return;
            }
        } catch (memberErr) {}

        try {
            const guestRes = await axios.get('https://librioo-backend-production.up.railway.app/api/getallguests', {
                params: { guestid: parsedId }
            });
            if (guestRes.data) {
                const data = guestRes.data;
                setUpdateForm({ id: parsedId, role: 'Guest', fullname: data.fullName || '', address: data.address || '', email: data.email || '', phoneNumber: data.phoneNumber || '' });
                setShowUpdateConfirm(true);
                return;
            }
        } catch (guestErr) {
            console.error('Find user error:', guestErr);
        }

        alert('User not found');
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!updateForm.id) {
            alert('Please find a user first');
            return;
        }
        try {
            const endpoint =
                updateForm.role === 'Member'
                    ? 'https://librioo-backend-production.up.railway.app/api/updatemember'
                    : 'https://librioo-backend-production.up.railway.app/api/updateguest';

            const payload =
                updateForm.role === 'Member'
                    ? { libraryID: updateForm.id, fullName: updateForm.fullname, address: updateForm.address, email: updateForm.email, phoneNumber: updateForm.phoneNumber }
                    : { guestID: updateForm.id, fullName: updateForm.fullname, address: updateForm.address, email: updateForm.email, phoneNumber: updateForm.phoneNumber };

            const response = await axios.put(endpoint, payload);
            console.log('Update response:', response.data);
            alert('User updated successfully');
        } catch (err) {
            console.error('Update user error:', err);
            alert(err.response?.data || 'Failed to update user');
        }
    };

    const handleFindDeleteUser = async () => {
        if (!deleteSearchId || deleteSearchId.trim() === '') {
            alert('Please enter a User ID');
            return;
        }
        const parsedId = parseInt(deleteSearchId, 10);
        if (Number.isNaN(parsedId)) {
            alert('User ID must be a number');
            return;
        }

        try {
            const memberRes = await axios.get('https://librioo-backend-production.up.railway.app/api/getallmembers', {
                params: { memberid: parsedId }
            });
            if (memberRes.data) {
                setDeleteUser({ ...memberRes.data, id: parsedId, role: 'Member' });
                return;
            }
        } catch (memberErr) {}

        try {
            const guestRes = await axios.get('https://librioo-backend-production.up.railway.app/api/getallguests', {
                params: { guestid: parsedId }
            });
            if (guestRes.data) {
                setDeleteUser({ ...guestRes.data, id: parsedId, role: 'Guest' });
                return;
            }
        } catch (guestErr) {
            console.error('Find delete user error:', guestErr);
        }

        setDeleteUser(null);
        alert('User not found');
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        if (!deleteUser) {
            alert('Please find a user first');
            return;
        }
        if (!window.confirm(`Are you sure you want to delete ${deleteUser.fullName}?`)) return;

        try {
            const isGuest = deleteUser.role === 'Guest';
            const endpoint = isGuest
                ? 'https://librioo-backend-production.up.railway.app/api/deleteguest'
                : 'https://librioo-backend-production.up.railway.app/api/deletemember';
            const params = isGuest ? { guestid: deleteUser.id } : { memberid: deleteUser.id };

            const response = await axios.delete(endpoint, { params });
            console.log('Delete response:', response.data);
            alert(response.data || 'User deleted successfully');
            setDeleteUser(null);
            setDeleteSearchId('');
        } catch (err) {
            console.error('Delete user error:', err);
            alert(err.response?.data || 'Failed to delete user');
        }
    };

    const handleExtraChange = (field, value) => {
        setExtraDetails(prev => ({ ...prev, [field]: value }));
    };

    // ── Reusable error message component ─────────────────────────
    const ErrorMsg = ({ field }) =>
        formErrors[field] ? (
            <p className="text-xs text-red-500 mt-1 sm:col-start-2 sm:col-span-2">{formErrors[field]}</p>
        ) : null;

    // ── Reusable input class helper ───────────────────────────────
    const inputClass = (field) =>
        `block w-full px-3 py-2 bg-gray-100 border rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500 ${
            formErrors[field] ? 'border-red-400 bg-red-50' : 'border-transparent'
        }`;

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-12 font-sans bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900">Manage Users</h2>

                <div className="max-w-4xl p-8 mx-auto space-y-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                    {/* Tabs */}
                    <div className="flex space-x-4 mb-6 border-b border-gray-200">
                        {['ADD', 'UPDATE', 'DELETE'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 px-1 ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── ADD ── */}
                    {activeTab === 'ADD' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Add User</h3>
                                <div className="flex bg-gray-200 rounded-md p-1">
                                    {['MEMBER', 'GUEST'].map(role => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => { setUserRole(role); setFormErrors({}); }}
                                            className={`px-4 py-1 text-sm font-medium rounded-md ${userRole === role ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {role.charAt(0) + role.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={handleAddUser}>

                                {/* ID */}
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">
                                        {userRole === 'MEMBER' ? 'Library ID' : 'Guest ID'}
                                    </label>
                                    <input
                                        type="text"
                                        value={addForm.id}
                                        onChange={(e) => {
                                            // Allow only digits, max 4
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                            handleAddChange('id', val);
                                        }}
                                        maxLength={4}
                                        className={inputClass('id')}
                                        required
                                    />
                                </div>
                                <ErrorMsg field="id" />

                                {/* Full Name */}
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Full Name</label>
                                    <input
                                        type="text"
                                        value={addForm.fullname}
                                        onChange={(e) => {
                                            // Allow only letters and spaces
                                            const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
                                            handleAddChange('fullname', val);
                                        }}
                                        className={inputClass('fullname')}
                                        required
                                    />
                                </div>
                                <ErrorMsg field="fullname" />

                                {/* Address */}
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Address</label>
                                    <input
                                        type="text"
                                        value={addForm.address}
                                        onChange={(e) => handleAddChange('address', e.target.value)}
                                        className={inputClass('address')}
                                    />
                                </div>

                                {/* Member-only fields */}
                                {userRole === 'MEMBER' && (
                                    <>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Occupation</label>
                                            <input
                                                type="text"
                                                value={addForm.occupation}
                                                onChange={(e) => handleAddChange('occupation', e.target.value)}
                                                className={inputClass('occupation')}
                                            />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Work/School Address</label>
                                            <input
                                                type="text"
                                                value={addForm.workSchoolAddress}
                                                onChange={(e) => handleAddChange('workSchoolAddress', e.target.value)}
                                                className={inputClass('workSchoolAddress')}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Email */}
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Email</label>
                                    <input
                                        type="text"
                                        value={addForm.email}
                                        onChange={(e) => handleAddChange('email', e.target.value)}
                                        placeholder="example@email.com"
                                        className={inputClass('email')}
                                    />
                                </div>
                                <ErrorMsg field="email" />

                                {/* Phone Number */}
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Phone Number</label>
                                    <input
                                        type="text"
                                        value={addForm.phoneNumber}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            handleAddChange('phoneNumber', val);
                                        }}
                                        maxLength={10}
                                        className={inputClass('phoneNumber')}
                                    />
                                </div>
                                <ErrorMsg field="phoneNumber" />

                                {/* Age */}
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Age</label>
                                    <input
                                        type="text"
                                        value={addForm.age}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                            handleAddChange('age', val);
                                        }}
                                        maxLength={2}
                                        className={inputClass('age')}
                                        required
                                    />
                                </div>
                                <ErrorMsg field="age" />

                                {/* NIC Number */}
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">NIC Number</label>
                                    <input
                                        type="text"
                                        value={addForm.nicNumber}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                                            handleAddChange('nicNumber', val);
                                        }}
                                        maxLength={12}
                                        className={inputClass('nicNumber')}
                                    />
                                </div>
                                <ErrorMsg field="nicNumber" />

                                {/* User Type */}
                                {userRole === 'MEMBER' && (
                                    <div className="grid items-start grid-cols-1 gap-4 sm:grid-cols-3">
                                        <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right pt-2">User Type</label>
                                        <div className="flex flex-col space-y-3 sm:col-span-2">
                                            <div className="flex space-x-3">
                                                {['Student', 'Lecturer', 'Staff', 'Other'].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => {
                                                            setAddForm(prev => ({ ...prev, userType: type }));
                                                            setExtraDetails({ studentId: '', course: '', department: '', designation: '' });
                                                        }}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                                                            addForm.userType === type
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500'
                                                        }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                            {(addForm.userType === 'Lecturer' || addForm.userType === 'Staff') && (
                                                <input
                                                    type="text"
                                                    placeholder={addForm.userType === 'Lecturer' ? 'Department' : 'Designation'}
                                                    value={addForm.userType === 'Lecturer' ? extraDetails.department : extraDetails.designation}
                                                    onChange={(e) =>
                                                        handleExtraChange(
                                                            addForm.userType === 'Lecturer' ? 'department' : 'designation',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 bg-gray-100 rounded-md focus:ring-1 focus:ring-blue-500 border border-transparent"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4 border-t">
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">
                                        Save User
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── UPDATE ── */}
                    {activeTab === 'UPDATE' && (
                        <div>
                            <h3 className="mb-6 text-xl font-bold text-gray-900">Update User</h3>
                            <form className="space-y-4" onSubmit={handleUpdateUser}>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Find User By</label>
                                    <div className="flex gap-2 sm:col-span-2">
                                        <div className="flex flex-1 bg-gray-100 border-none rounded-md focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden px-3 py-2 items-center">
                                            <span className="text-gray-500 text-sm font-medium mr-2">User ID:</span>
                                            <input
                                                type="text"
                                                placeholder="Enter User ID..."
                                                value={searchId}
                                                onChange={(e) => {
                                                    setSearchId(e.target.value);
                                                    setShowUpdateConfirm(false);
                                                }}
                                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleFindUser}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm font-medium whitespace-nowrap"
                                        >
                                            Find User
                                        </button>
                                    </div>
                                </div>

                                {showUpdateConfirm && (
                                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-green-800">
                                                    User found: <span className="font-bold">{updateForm.fullname}</span>
                                                </p>
                                                <p className="text-xs text-green-700 mt-1">You can now update the user details below</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-4 mt-6">
                                    <h4 className="text-sm font-bold text-gray-700 mb-4">User Details</h4>
                                    <div className="space-y-4">
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Role</label>
                                            <input type="text" value={updateForm.role} disabled className="block w-full px-3 py-2 bg-gray-100 text-gray-500 border-none rounded-md sm:col-span-2" />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Full Name</label>
                                            <input type="text" value={updateForm.fullname} onChange={(e) => handleUpdateChange('fullname', e.target.value)} className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled={!showUpdateConfirm} />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Address</label>
                                            <input type="text" value={updateForm.address} onChange={(e) => handleUpdateChange('address', e.target.value)} className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled={!showUpdateConfirm} />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Email</label>
                                            <input type="email" value={updateForm.email} onChange={(e) => handleUpdateChange('email', e.target.value)} className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled={!showUpdateConfirm} />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Phone Number</label>
                                            <input type="text" value={updateForm.phoneNumber} onChange={(e) => handleUpdateChange('phoneNumber', e.target.value)} className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500" disabled={!showUpdateConfirm} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t">
                                    <button
                                        type="submit"
                                        className={`px-6 py-2 text-white rounded font-medium transition ${showUpdateConfirm ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                        disabled={!showUpdateConfirm}
                                    >
                                        Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── DELETE ── */}
                    {activeTab === 'DELETE' && (
                        <div>
                            <h3 className="mb-6 text-xl font-bold text-gray-900">Delete User</h3>
                            <form className="space-y-4" onSubmit={handleDeleteUser}>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Find User By</label>
                                    <div className="flex gap-2 sm:col-span-2">
                                        <div className="flex flex-1 bg-gray-100 border-none rounded-md focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden px-3 py-2 items-center">
                                            <span className="text-gray-500 text-sm font-medium mr-2">User ID:</span>
                                            <input
                                                type="text"
                                                placeholder="Enter User ID..."
                                                value={deleteSearchId}
                                                onChange={(e) => setDeleteSearchId(e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleFindDeleteUser}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm font-medium whitespace-nowrap"
                                        >
                                            Find User
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mt-6">
                                    <h4 className="text-sm font-bold bg-red-50 p-3 rounded border border-red-200 text-red-800 mb-4">
                                        Review Data Below Before Deletion
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Role</label>
                                            <input type="text" className="block w-full px-3 py-2 bg-gray-100 text-gray-500 border-none rounded-md sm:col-span-2" disabled value={deleteUser?.role || ''} />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Full Name</label>
                                            <input type="text" className="block w-full px-3 py-2 bg-gray-100 text-gray-500 border-none rounded-md sm:col-span-2" disabled value={deleteUser?.fullName || ''} />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Email</label>
                                            <input type="email" className="block w-full px-3 py-2 bg-gray-100 text-gray-500 border-none rounded-md sm:col-span-2" disabled value={deleteUser?.email || ''} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t">
                                    <button
                                        type="submit"
                                        className={`px-6 py-2 text-white rounded font-medium transition ${deleteUser ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                        disabled={!deleteUser}
                                    >
                                        Delete User
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </AdminLayout>
    );
};

export default ManageUsers;