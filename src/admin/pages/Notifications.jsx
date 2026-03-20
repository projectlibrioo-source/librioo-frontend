import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';

const Notifications = () => {
    const [dailyOverdues, setDailyOverdues] = useState(true);
    const [robotAlerts, setRobotAlerts] = useState(true);
    const [filterType, setFilterType] = useState('All');
    
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://librioo-backend-production.up.railway.app/api/notifications');
            // Sort by ID descending so newest are on top
            const sorted = (res.data || []).sort((a,b) => b.id - a.id);
            setNotifications(sorted);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('https://librioo-backend-production.up.railway.app/api/notifications/read-all');
            setNotifications(notifications.map(n => ({...n, read: true})));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const sendTestAlert = async () => {
        try {
            await axios.post('https://librioo-backend-production.up.railway.app/api/notifications/test');
            fetchNotifications();
        } catch (error) {
            console.error('Failed to send test alert', error);
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'robot': return <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">🤖</span>;
            case 'error': return <span className="p-2 bg-red-100 text-red-600 rounded-lg">⚠️</span>;
            case 'book': return <span className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">📚</span>;
            case 'system': return <span className="p-2 bg-green-100 text-green-600 rounded-lg">⚙️</span>;
            default: return <span className="p-2 bg-gray-100 text-gray-600 rounded-lg">📢</span>;
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filterType === 'All') return true;
        if (filterType === 'Robots' && (notif.type === 'robot' || notif.type === 'error')) return true;
        if (filterType === 'Books' && notif.type === 'book') return true;
        if (filterType === 'System' && notif.type === 'system') return true;
        return false;
    });

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
                        <p className="text-sm text-gray-500 mt-1">Admin / Notifications</p>
                    </div>
                    <button 
                        onClick={markAllAsRead}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Mark all as read
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Detailed Notifications List */}
                    <div className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm h-fit min-h-[400px]">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold text-gray-800">All Alerts</h3>

                            {/* Filter Dropdown */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="All">All Types</option>
                                <option value="Robots">Robot Alerts</option>
                                <option value="Books">Book Overdues</option>
                                <option value="System">System Notices</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex justify-center items-center py-12 text-gray-500">
                                No notifications available.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredNotifications.map(notif => (
                                    <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-lg border ${!notif.read ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-100 hover:bg-gray-50 transition'}`}>
                                        <div className="flex-shrink-0 mt-1">
                                            {getIconForType(notif.type)}
                                        </div>
                                        <div className="flex-1 w-full flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 max-w-full">
                                            <div className="flex-1 min-w-0 pr-4 break-words">
                                                <h4 className={`text-md break-words ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                                                    {notif.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1 break-words whitespace-normal">{notif.text}</p>
                                            </div>
                                            <div className="flex items-center flex-shrink-0">
                                                <span className="text-xs text-gray-500 whitespace-nowrap">{notif.dateStr}</span>
                                                {!notif.read && (
                                                    <div className="w-2 h-2 ml-2 bg-blue-500 rounded-full hidden sm:block"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Notification Settings */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Alert Preferences</h3>
                            <div className="flex flex-col space-y-4">

                                {/* Toggles are currently visual only */}
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-700">Daily Book Overdues</span>
                                    <button
                                        onClick={() => setDailyOverdues(!dailyOverdues)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${dailyOverdues ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`${dailyOverdues ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-700">Robot Status Alerts</span>
                                    <button
                                        onClick={() => setRobotAlerts(!robotAlerts)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${robotAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`${robotAlerts ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                    </button>
                                </div>

                                <button 
                                    onClick={sendTestAlert}
                                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm font-medium mt-2"
                                >
                                    Send Test Alert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Notifications;