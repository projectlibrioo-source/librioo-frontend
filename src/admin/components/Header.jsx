// src/admin/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logActivity from '../utils/logActivity';
import axios from 'axios';

const Header = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('https://librioo-backend-production.up.railway.app/api/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Failed to fetch notifications in Header:', error);
        }
    };

    const handleLogout = async () => {
        try {
            //Log admin logout before signing out
            await logActivity("admin", "settings", `Admin logged out: ${currentUser?.email}`);
            await logout();
            navigate('/admin/login');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Helper to format timestamps if needed, or we just rely on what the API sends
    const formatTime = (ts) => {
        if (!ts) return '';
        const date = new Date(ts);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    return (
        <header className="relative z-40 flex items-center justify-between h-16 px-8 bg-white border-b border-gray-100 shadow-sm">
            <div className="flex items-center w-1/2 space-x-3">
                <div className="relative flex-1 max-w-md">
                    <input type="text" placeholder="Search..."
                        className="w-full py-2 pl-6 pr-10 text-sm text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    <Search className="absolute right-4 top-2.5 w-4 h-4 text-gray-400" />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-1 mt-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-[0.4rem] py-[0.1rem] text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 py-2 mt-3 bg-white border border-gray-100 rounded-lg shadow-xl w-80">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                                <span className="font-bold text-gray-800">Latest Notifications</span>
                                <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">{unreadCount} New</span>
                            </div>
                            <div className="overflow-y-auto max-h-64">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                        No recent notifications
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 border-gray-50 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}>
                                            <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                                                {notif.message || notif.title}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">{formatTime(notif.createdAt)}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="px-4 py-2 text-center border-t border-gray-50">
                                <a href="/admin/notifications" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                    View full list
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-8 h-8 overflow-hidden rounded-full bg-slate-200">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Admin" className="object-cover w-full h-full" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                        {currentUser?.email?.split('@')[0] || 'Admin'}
                    </span>
                </div>

                <button onClick={handleLogout}
                    className="flex items-center ml-4 font-medium text-gray-700 transition-colors hover:text-red-500">
                    Logout
                    <LogOut className="w-4 h-4 ml-1" />
                </button>
            </div>
        </header>
    );
};

export default Header;