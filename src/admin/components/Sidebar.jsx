// src/admin/components/Sidebar.jsx
import React from 'react';
import logo from "../../assets/logoLib3-1.png";
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Users, ArrowLeftRight,
    Cpu, FileText, Settings, Phone, Bell
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        {
            section: 'Main', items: [
                { name: 'Dashboard',     icon: LayoutDashboard, path: '/admin/dashboard' },
                { name: 'Books',         icon: BookOpen,        path: '/admin/books' },
                { name: 'Users',         icon: Users,           path: '/admin/users' },
                { name: 'Transactions',  icon: ArrowLeftRight,  path: '/admin/transactions' },
                { name: 'Robot Status',  icon: Cpu,             path: '/admin/robot-status' },
                { name: 'Activity Logs', icon: FileText,        path: '/admin/activity-logs' },
            ]
        },
        {
            section: 'Management', items: [
                { name: 'Manage Users',        icon: Users,          path: '/admin/manage-users' },
                { name: 'Manage Books',        icon: BookOpen,       path: '/admin/manage-books' },
                { name: 'Manage Robot',        icon: Cpu,            path: '/admin/manage-robot' },
                { name: 'Manage Transactions', icon: ArrowLeftRight, path: '/admin/manage-transactions' },
            ]
        },
        {
            section: 'System', items: [
                { name: 'Settings',      icon: Settings, path: '/admin/settings' },
                { name: 'Reports',       icon: FileText, path: '/admin/reports' },
                { name: 'Contact',       icon: Phone,    path: '/admin/contacts' },
                { name: 'Notifications', icon: Bell,     path: '/admin/notifications' },
            ]
        }
    ];

    return (
        <div className="w-64 bg-[#EDF5FE] h-screen flex flex-col border-r border-blue-100 font-sans">
            <div className="flex items-center justify-center p-6 border-b border-blue-200/50">
                <img src={logo} alt="Librioo Logo" className="h-15 w-auto" />
            </div>

            <div className="flex-1 py-4 overflow-y-auto">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="mb-6">
                        <h3 className="px-6 mb-2 text-xs italic font-semibold tracking-wider text-gray-500 uppercase">
                            {section.section}
                        </h3>
                        <ul>
                            {section.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center px-6 py-2.5 text-sm font-medium transition-colors duration-200
                                            ${isActive
                                                ? 'text-gray-900 bg-white border-l-4 border-blue-500 shadow-sm'
                                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-4 h-4 mr-3" />
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;