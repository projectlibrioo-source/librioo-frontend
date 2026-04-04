import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Wrench, Edit } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import axios from 'axios';

const ManageRobot = () => {
    const [activeTab, setActiveTab] = useState('ADD');
    const [robots, setRobots] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [maintenanceSearchId, setMaintenanceSearchId] = useState('');
    const [deleteSearchId, setDeleteSearchId] = useState('');

    const [robot, setRobot] = useState({
        robotName: '',
        model: '',
        startDate: ''
    });

    const [updateRobot, setUpdateRobot] = useState({
        robotId: '',
        robotName: '',
        model: '',
        status: 'Active'
    });

    const [maintenanceData, setMaintenanceData] = useState({
        robotId: '',
        lastServiceDate: '',
        nextServiceDate: '',
        partReplaced: '',
        technicianNotes: ''
    });

    // Fetch all robots on component mount
    useEffect(() => {
        fetchAllRobots();
    }, []);

    const fetchAllRobots = async () => {
        try {
            const res = await axios.get("https://librioo-backend-production.up.railway.app/api/robots/all");
            setRobots(res.data.robots);
        } catch (err) {
            console.error("Error fetching robots:", err);
        }
    };

    // Add Robot
    const addRobot = async (e) => {
        e.preventDefault();
        try {
            const robotData = {
                robotName: robot.robotName,
                model: robot.model,
                startDate: robot.startDate,
                status: 'ACTIVE'
            };
            const res = await axios.post(
                "https://librioo-backend-production.up.railway.app/api/robots/add",
                robotData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log("Robot added:", res.data);
            alert("Robot added successfully!");
            fetchAllRobots();
            // Reset form
            setRobot({
                robotName: '',
                model: '',
                startDate: ''
            });
        } catch (err) {
            if (err.response) {
                alert(err.response.data);
            } else {
                console.error(err);
                alert("Something went wrong");
            }
        }
    };

    // Search Robot for Update
    const searchRobotForUpdate = async () => {
        if (!searchId) {
            alert("Please enter Robot ID");
            return;
        }
        try {
            const res = await axios.get(`https://librioo-backend-production.up.railway.app/api/robots/${searchId}`);
            setUpdateRobot({
                robotId: res.data.robotID,
                robotName: res.data.robotName,
                model: res.data.model,
                status: res.data.status
            });
        } catch (err) {
            alert("Robot not found");
            console.error(err);
        }
    };

    // Update Robot Details
    const handleUpdateRobot = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `https://librioo-backend-production.up.railway.app/api/robots/${updateRobot.robotId}`,
                {
                    robotID: updateRobot.robotId,
                    robotName: updateRobot.robotName,
                    model: updateRobot.model,
                    status: updateRobot.status
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            alert("Robot updated successfully!");
            fetchAllRobots();
        } catch (err) {
            alert("Failed to update robot");
            console.error(err);
        }
    };

    // Search Robot for Maintenance — load latest log entry from new table
    const searchRobotForMaintenance = async () => {
        if (!maintenanceSearchId) {
            alert("Please enter Robot ID");
            return;
        }
        try {
            // First verify robot exists
            await axios.get(`https://librioo-backend-production.up.railway.app/api/robots/${maintenanceSearchId}`);

            // Then load maintenance history (newest first)
            const histRes = await axios.get(
                `https://librioo-backend-production.up.railway.app/api/robots/${maintenanceSearchId}/maintenance`,
                { validateStatus: () => true }
            );

            const latest = (histRes.status === 200 && histRes.data.length > 0)
                ? histRes.data[0]
                : null;

            setMaintenanceData({
                robotId: parseInt(maintenanceSearchId),
                lastServiceDate:  latest?.lastServiceDate  || '',
                nextServiceDate:  latest?.nextServiceDate  || '',
                partReplaced:     latest?.partReplaced     || '',
                technicianNotes:  latest?.technicianNotes  || ''
            });
        } catch (err) {
            alert("Robot not found");
            console.error(err);
        }
    };

    // Log Maintenance — saves a new row to robot_maintenance table
    const handleUpdateMaintenance = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `https://librioo-backend-production.up.railway.app/api/robots/${maintenanceData.robotId}/maintenance`,
                {
                    lastServiceDate: maintenanceData.lastServiceDate,
                    nextServiceDate: maintenanceData.nextServiceDate,
                    partReplaced: maintenanceData.partReplaced,
                    technicianNotes: maintenanceData.technicianNotes
                },
                { headers: { "Content-Type": "application/json" } }
            );
            alert("Maintenance log saved successfully!");
            fetchAllRobots();
        } catch (err) {
            alert("Failed to save maintenance log");
            console.error(err);
        }
    };

    // Delete Robot
    const handleDeleteRobot = async () => {
        if (!deleteSearchId) {
            alert("Please enter Robot ID");
            {/* Confirmation Popup */}
            {showMaintenanceConfirm && (
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-green-800">
                                Robot found: <span className="font-bold">{maintenanceData.robotName}</span>
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                                You can now update the maintenance details below
                            </p>
                        </div>
                    </div>
                </div>
            )}
            return;
        }
        if (!window.confirm("Are you sure you want to delete this robot?")) {
            return;
        }
        try {
            const res = await axios.delete(`https://librioo-backend-production.up.railway.app/api/robots/${deleteSearchId}`);
            alert(res.data.message);
            setDeleteSearchId('');
            fetchAllRobots();
        } catch (err) {
            if (err.response) {
                alert(err.response.data.message);
            } else {
                alert("Failed to delete robot");
            }
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-12 font-sans bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900">Manage Robot</h2>
                <div className="max-w-5xl p-8 mx-auto space-y-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex space-x-4 mb-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('ADD')}
                            className={`pb-2 px-1 flex items-center gap-2 ${activeTab === 'ADD' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Upload className="w-4 h-4" /> ADD
                        </button>
                        <button
                            onClick={() => setActiveTab('UPDATE')}
                            className={`pb-2 px-1 flex items-center gap-2 ${activeTab === 'UPDATE' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Edit className="w-4 h-4" /> UPDATE
                        </button>
                        <button
                            onClick={() => setActiveTab('MAINTENANCE')}
                            className={`pb-2 px-1 flex items-center gap-2 ${activeTab === 'MAINTENANCE' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Wrench className="w-4 h-4" /> MAINTENANCE
                        </button>
                        <button
                            onClick={() => setActiveTab('DELETE')}
                            className={`pb-2 px-1 flex items-center gap-2 ${activeTab === 'DELETE' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Trash2 className="w-4 h-4" /> DELETE
                        </button>
                    </div>

                    {/* Add Robot */}
                    {activeTab === 'ADD' && (
                        <div>
                            <div className="flex items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Add Robot</h3>
                            </div>
                            <form className="space-y-4 max-w-2xl mb-8" onSubmit={addRobot}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Robot Name</label>
                                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" 
                                            value={robot.robotName}
                                            onChange={(e) => setRobot({...robot, robotName: e.target.value})}
                                            placeholder="e.g. Robo-Helper" 
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Robot Model</label>
                                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" 
                                            value={robot.model}
                                            onChange={(e) => setRobot({...robot, model: e.target.value})}
                                            placeholder="e.g. MK-III" 
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" 
                                            value={robot.startDate}
                                            onChange={(e) => setRobot({...robot, startDate: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <input 
                                            type="text" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-100 text-gray-500" 
                                            value="Active"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">Save Robot</button>
                            </form>

                            <h4 className="font-bold text-gray-800 mb-2">Current Robots</h4>
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                                <div className="grid grid-cols-4 border-b border-gray-200 bg-blue-100/50">
                                    <div className="p-4 font-bold text-center text-gray-800 border-r border-gray-200">Robot ID</div>
                                    <div className="p-4 font-bold text-center text-gray-800 border-r border-gray-200">Robot Name</div>
                                    <div className="p-4 font-bold text-center text-gray-800 border-r border-gray-200">Model</div>
                                    <div className="p-4 font-bold text-center text-gray-800">Status</div>
                                </div>
                                {Array.isArray(robots) && robots.map((r) => (
                                    <div key={r.robotID || r.robotId} className="grid grid-cols-4 border-b">
                                        <div className="p-4 text-center">{r.robotID || r.robotId}</div>
                                        <div className="p-4 text-center">{r.robotName}</div>
                                        <div className="p-4 text-center">{r.model}</div>
                                        <div className="p-4 text-center">{r.status}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Update Robot - NEW TAB */}
                    {activeTab === 'UPDATE' && (
                        <div>
                            <div className="flex items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Update Robot</h3>
                            </div>
                            <form className="space-y-4 max-w-2xl mb-8" onSubmit={handleUpdateRobot}>
                                <div className="col-span-2 sm:col-span-1 mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Find Robot By</label>
                                    <div className="flex rounded-md shadow-sm border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 bg-gray-50 px-3 py-2 items-center">
                                        <span className="text-gray-500 text-sm font-medium mr-2">Robot ID:</span>
                                        <input 
                                            type="text" 
                                            className="flex-1 block w-full bg-transparent border-none focus:ring-0 p-0 text-sm" 
                                            placeholder="Enter Robot ID..." 
                                            value={searchId}
                                            onChange={(e) => setSearchId(e.target.value)}
                                        />
                                        <button 
                                            type="button"
                                            onClick={searchRobotForUpdate}
                                            className="ml-2 inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-6">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4">Update Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">Robot Name</label>
                                            <input 
                                                type="text" 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 bg-white" 
                                                value={updateRobot.robotName}
                                                onChange={(e) => setUpdateRobot({...updateRobot, robotName: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">Robot Model</label>
                                            <input 
                                                type="text" 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 bg-white" 
                                                value={updateRobot.model}
                                                onChange={(e) => setUpdateRobot({...updateRobot, model: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                value={updateRobot.status}
                                                onChange={(e) => setUpdateRobot({...updateRobot, status: e.target.value})}
                                            >
                                                <option>Active</option>
                                                <option>In Maintenance</option>
                                                <option>Retired</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">Update Robot</button>
                            </form>
                        </div>
                    )}

                    {/* Robot Maintenance */}
                    {activeTab === 'MAINTENANCE' && (
                        <div>
                            <div className="flex items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Robot Maintenance</h3>
                            </div>
                            <form className="space-y-4 max-w-2xl mb-8" onSubmit={handleUpdateMaintenance}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Robot ID</label>
                                        <input 
                                            type="text" 
                                            className="block w-full px-3 py-2 bg-gray-100 border-none rounded-md focus:ring-1 focus:ring-blue-500" 
                                            placeholder="Enter Robot ID to load data..." 
                                            value={maintenanceSearchId}
                                            onChange={(e) => {
                                                setMaintenanceSearchId(e.target.value);
                                            }}
                                            onBlur={searchRobotForMaintenance}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-6">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4">Update Maintenance Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">Last Service Date</label>
                                            <input 
                                                type="date" 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 bg-white" 
                                                value={maintenanceData.lastServiceDate}
                                                onChange={(e) => setMaintenanceData({...maintenanceData, lastServiceDate: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">Next Service Date</label>
                                            <input 
                                                type="date" 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 bg-white" 
                                                value={maintenanceData.nextServiceDate}
                                                onChange={(e) => setMaintenanceData({...maintenanceData, nextServiceDate: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Part(s) Replaced</label>
                                            <input 
                                                type="text" 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 bg-white" 
                                                placeholder="e.g. Sensors, Battery" 
                                                value={maintenanceData.partReplaced}
                                                onChange={(e) => setMaintenanceData({...maintenanceData, partReplaced: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Technician Notes</label>
                                            <textarea 
                                                rows="3"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 bg-white" 
                                                placeholder="Notes..." 
                                                value={maintenanceData.technicianNotes}
                                                onChange={(e) => setMaintenanceData({...maintenanceData, technicianNotes: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">Update Log</button>
                            </form>
                        </div>
                    )}

                    {/* Delete Robot */}
                    {activeTab === 'DELETE' && (
                        <div>
                            <div className="flex items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Delete Robot</h3>
                            </div>
                            <div className="space-y-4 max-w-2xl">
                                <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex flex-col items-center gap-6 md:flex-row">
                                        <div className="flex-1 w-full space-y-4">
                                            <label className="block text-sm font-medium text-gray-700">Find Robot By</label>
                                            <div className="flex bg-white rounded border border-red-300 overflow-hidden focus-within:ring-1 focus-within:ring-red-500 transition-colors px-4 py-3 items-center">
                                                <span className="text-gray-500 font-bold mr-2">Robot ID:</span>
                                                <input 
                                                    type="text" 
                                                    placeholder="Required" 
                                                    className="w-full font-bold placeholder-gray-400 border-none focus:ring-0 p-0" 
                                                    value={deleteSearchId}
                                                    onChange={(e) => setDeleteSearchId(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto pt-4 md:pt-0">
                                            <button 
                                                onClick={handleDeleteRobot}
                                                className="w-full md:w-48 h-full py-6 md:mt-5 bg-white text-red-600 font-bold rounded-lg border border-red-200 flex flex-col items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                                            >
                                                <div className="flex items-center gap-2 text-lg">
                                                    <span className="text-xl">!</span>
                                                    DELETE
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ManageRobot;