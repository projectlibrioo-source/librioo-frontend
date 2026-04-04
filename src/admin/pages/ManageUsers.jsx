import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';

const ManageUsers = () => {
    const [activeTab, setActiveTab] = useState('ADD');
    const [userRole, setUserRole] = useState('MEMBER');

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

    const handleAddChange = (field, value) => {
        setAddForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdateChange = (field, value) => {
        setUpdateForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!addForm.id || !addForm.fullname || !addForm.age) {
            alert('Please fill in the required fields');
            return;
        }

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
                        status: addForm.userType,

                        
            
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

            // Reset form
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


            setExtraDetails({
                studentId: '',
                course: '',
                department: '',
                designation: ''
            });


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

        // Try Member first
        try {
            const memberRes = await axios.get('https://librioo-backend-production.up.railway.app/api/getallmembers', {
                params: { memberid: parsedId }
            });

            if (memberRes.data) {
                const data = memberRes.data;
                setUpdateForm({
                    id: parsedId,
                    role: 'Member',
                    fullname: data.fullName || '',
                    address: data.address || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || ''
                });
                setShowUpdateConfirm(true);
                return;
            }
        } catch (memberErr) {
            // If not found as member, try guest
        }

        // Try Guest
        try {
            const guestRes = await axios.get('https://librioo-backend-production.up.railway.app/api/getallguests', {
                params: { guestid: parsedId }
            });

            if (guestRes.data) {
                const data = guestRes.data;
                setUpdateForm({
                    id: parsedId,
                    role: 'Guest',
                    fullname: data.fullName || '',
                    address: data.address || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || ''
                });
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
                    ? {
                        libraryID: updateForm.id,
                        fullName: updateForm.fullname,
                        address: updateForm.address,
                        email: updateForm.email,
                        phoneNumber: updateForm.phoneNumber
                    }
                    : {
                        guestID: updateForm.id,
                        fullName: updateForm.fullname,
                        address: updateForm.address,
                        email: updateForm.email,
                        phoneNumber: updateForm.phoneNumber
                    };

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

        // Try Member first
        try {
            const memberRes = await axios.get('https://librioo-backend-production.up.railway.app/api/getallmembers', {
                params: { memberid: parsedId }
            });

            if (memberRes.data) {
                setDeleteUser({
                    ...memberRes.data,
                    id: parsedId,
                    role: 'Member'
                });
                return;
            }
        } catch (memberErr) {
            // Try guest next
        }

        // Try Guest
        try {
            const guestRes = await axios.get('https://librioo-backend-production.up.railway.app/api/getallguests', {
                params: { guestid: parsedId }
            });

            if (guestRes.data) {
                setDeleteUser({
                    ...guestRes.data,
                    id: parsedId,
                    role: 'Guest'
                });
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

        if (!window.confirm(`Are you sure you want to delete ${deleteUser.fullName}?`)) {
            return;
        }

        try {
            const isGuest = deleteUser.role === 'Guest';

            const endpoint = isGuest
                ? 'https://librioo-backend-production.up.railway.app/api/deleteguest'
                : 'https://librioo-backend-production.up.railway.app/api/deletemember';

            const params = isGuest
                ? { guestid: deleteUser.id }
                : { memberid: deleteUser.id };

            const response = await axios.delete(endpoint, { params });
            console.log('Delete response:', response.data);
            alert(response.data || 'User deleted successfully');

            // Reset state
            setDeleteUser(null);
            setDeleteSearchId('');
        } catch (err) {
            console.error('Delete user error:', err);
            alert(err.response?.data || 'Failed to delete user');
        }
    };


    const handleExtraChange = (field, value) => {
    setExtraDetails(prev => ({
        ...prev,
        [field]: value
    }));
};

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-12 font-sans bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900">Manage Users</h2>

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

                    {/* Add User Section */}
                    {activeTab === 'ADD' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Add User</h3>
                                <div className="flex bg-gray-200 rounded-md p-1">
                                    <button
                                        type="button"
                                        onClick={() => setUserRole('MEMBER')}
                                        className={`px-4 py-1 text-sm font-medium rounded-md ${userRole === 'MEMBER' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Member
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUserRole('GUEST')}
                                        className={`px-4 py-1 text-sm font-medium rounded-md ${userRole === 'GUEST' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Guest
                                    </button>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={handleAddUser}>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">{userRole === 'MEMBER' ? 'Library ID' : 'Guest ID'}</label>
                                    <input
                                        type="text"
                                        value={addForm.id}
                                        onChange={(e) => handleAddChange('id', e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Full Name</label>
                                    <input
                                        type="text"
                                        value={addForm.fullname}
                                        onChange={(e) => handleAddChange('fullname', e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Address</label>
                                    <input
                                        type="text"
                                        value={addForm.address}
                                        onChange={(e) => handleAddChange('address', e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                {userRole === 'MEMBER' && (
                                    <>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Occupation</label>
                                            <input
                                                type="text"
                                                value={addForm.occupation}
                                                onChange={(e) => handleAddChange('occupation', e.target.value)}
                                                className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Work/School Address</label>
                                            <input
                                                type="text"
                                                value={addForm.workSchoolAddress}
                                                onChange={(e) => handleAddChange('workSchoolAddress', e.target.value)}
                                                className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Email</label>
                                    <input
                                        type="email"
                                        value={addForm.email}
                                        onChange={(e) => handleAddChange('email', e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Phone Number</label>
                                    <input
                                        type="text"
                                        value={addForm.phoneNumber}
                                        onChange={(e) => handleAddChange('phoneNumber', e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Age</label>
                                    <input
                                        type="number"
                                        value={addForm.age}
                                        onChange={(e) => handleAddChange('age', e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">NIC Number</label>
                                    <input
                                        type="text"
                                        value={addForm.nicNumber}
                                        onChange={(e) => handleAddChange('nicNumber', e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                {userRole === 'MEMBER' && (
                                    <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
    <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">User Type</label>

    <div className="flex flex-col space-y-4 sm:col-span-2">

        {/*  RADIO BUTTONS */}
        <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    name="userType"
                    checked={addForm.userType === 'Other'}
                    onChange={() => setAddForm(prev => ({ ...prev, userType: 'Other' }))} // 🔴 CHANGED
                />
                <span>Student</span>
            </label>

            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    name="userType"
                    checked={addForm.userType === 'Lecturer'}
                    onChange={() => setAddForm(prev => ({ ...prev, userType: 'Lecturer' }))} // 🔴 CHANGED
                />
                <span>Lecturer</span>
            </label>

            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    name="userType"
                    checked={addForm.userType === 'Staff'}
                    onChange={() => setAddForm(prev => ({ ...prev, userType: 'Staff' }))} // 🔴 CHANGED
                />
                <span>Staff</span>
            </label>
        </div>


        {addForm.userType === 'Lecturer' && (
            <input
                type="text"
                placeholder="Department"
                value={extraDetails.department}
                onChange={(e) => handleExtraChange('department', e.target.value)}
                className="px-3 py-2 bg-gray-100 rounded-md"
            />
        )}

        {addForm.userType === 'Staff' && (
            <input
                type="text"
                placeholder="Designation"
                value={extraDetails.designation}
                onChange={(e) => handleExtraChange('designation', e.target.value)}
                className="px-3 py-2 bg-gray-100 rounded-md"
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

                    {/* Update User Section */}
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

                                {/* Confirmation Popup */}
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
                                                <p className="text-xs text-green-700 mt-1">
                                                    You can now update the user details below
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-4 mt-6">
                                    <h4 className="text-sm font-bold text-gray-700 mb-4">User Details</h4>
                                    <div className="space-y-4">
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Role</label>
                                            <div className="flex flex-1 bg-gray-100 border-none rounded-md sm:col-span-2">
                                                <input
                                                    type="text"
                                                    value={updateForm.role}
                                                    disabled
                                                    className="block w-full px-3 py-2 bg-gray-100 text-gray-500 border-none rounded-md"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Full Name</label>
                                            <input
                                                type="text"
                                                value={updateForm.fullname}
                                                onChange={(e) => handleUpdateChange('fullname', e.target.value)}
                                                className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                                disabled={!showUpdateConfirm}
                                            />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Address</label>
                                            <input
                                                type="text"
                                                value={updateForm.address}
                                                onChange={(e) => handleUpdateChange('address', e.target.value)}
                                                className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                                disabled={!showUpdateConfirm}
                                            />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Email</label>
                                            <input
                                                type="email"
                                                value={updateForm.email}
                                                onChange={(e) => handleUpdateChange('email', e.target.value)}
                                                className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                                disabled={!showUpdateConfirm}
                                            />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Phone Number</label>
                                            <input
                                                type="text"
                                                value={updateForm.phoneNumber}
                                                onChange={(e) => handleUpdateChange('phoneNumber', e.target.value)}
                                                className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md sm:col-span-2 focus:ring-1 focus:ring-blue-500"
                                                disabled={!showUpdateConfirm}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t">
                                    <button 
                                        type="submit"
                                        className={`px-6 py-2 text-white rounded font-medium transition ${
                                            showUpdateConfirm 
                                                ? 'bg-blue-600 hover:bg-blue-700' 
                                                : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!showUpdateConfirm}
                                    >
                                        Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Delete User Section */}
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
                                    <h4 className="text-sm font-bold text-gray-700 mb-4 bg-red-50 p-3 rounded border border-red-200 text-red-800">
                                        Review Data Below Before Deletion
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Role</label>
                                            <input
                                                type="text"
                                                className="block w-full px-3 py-2 bg-gray-100 text-gray-500 border-none rounded-md sm:col-span-2"
                                                disabled
                                                value={deleteUser?.role || ''}
                                            />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Full Name</label>
                                            <input
                                                type="text"
                                                className="block w-full px-3 py-2 bg-gray-100 text-gray-500 border-none rounded-md sm:col-span-2"
                                                disabled
                                                value={deleteUser?.fullName || ''}
                                            />
                                        </div>
                                        <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-3">
                                            <label className="pr-4 text-sm font-medium text-gray-900 sm:text-right">Email</label>
                                            <input
                                                type="email"
                                                className="block w-full px-3 py-2 bg-gray-100 text-gray-500 border-none rounded-md sm:col-span-2"
                                                disabled
                                                value={deleteUser?.email || ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t">
                                    <button 
                                        type="submit"
                                        className={`px-6 py-2 text-white rounded font-medium transition ${
                                            deleteUser 
                                                ? 'bg-red-600 hover:bg-red-700' 
                                                : 'bg-gray-400 cursor-not-allowed'
                                        }`}
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