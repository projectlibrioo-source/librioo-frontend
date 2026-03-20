// src/admin/pages/ActivityLogs.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Bot, User, BookOpen, Settings, Search, X, Download, Loader2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase';
import AdminLayout from '../layouts/AdminLayout';

const FILTER_OPTIONS = [
    { label: 'All',             value: 'all',    color: 'bg-gray-200 text-gray-700',      activeColor: 'bg-gray-700 text-white' },
    { label: 'Robot Actions',   value: 'robot',  color: 'bg-blue-100 text-blue-700',      activeColor: 'bg-blue-600 text-white' },
    { label: 'Member Activity', value: 'member', color: 'bg-purple-100 text-purple-700',  activeColor: 'bg-purple-600 text-white' },
    { label: 'Book Search',     value: 'search', color: 'bg-green-100 text-green-700',    activeColor: 'bg-green-600 text-white' },
    { label: 'Borrow',          value: 'borrow', color: 'bg-orange-100 text-orange-700',  activeColor: 'bg-orange-500 text-white' },
    { label: 'Return',          value: 'return', color: 'bg-teal-100 text-teal-700',      activeColor: 'bg-teal-600 text-white' },
    { label: 'Admin Updates',   value: 'admin',  color: 'bg-red-100 text-red-700',        activeColor: 'bg-red-500 text-white' },
    { label: 'System Logs',     value: 'system', color: 'bg-slate-100 text-slate-600',    activeColor: 'bg-slate-600 text-white' },
];

const ICON_CONFIG = {
    bot:      { Icon: Bot,      color: 'text-blue-500',   bg: 'bg-blue-100' },
    book:     { Icon: BookOpen, color: 'text-green-600',  bg: 'bg-green-100' },
    user:     { Icon: User,     color: 'text-purple-600', bg: 'bg-purple-100' },
    settings: { Icon: Settings, color: 'text-slate-500',  bg: 'bg-slate-100' },
};

const TYPE_BADGE = {
    robot:  'bg-blue-100 text-blue-700',
    member: 'bg-purple-100 text-purple-700',
    search: 'bg-green-100 text-green-700',
    borrow: 'bg-orange-100 text-orange-700',
    return: 'bg-teal-100 text-teal-700',
    admin:  'bg-red-100 text-red-600',
    system: 'bg-slate-100 text-slate-600',
};

const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const d = timestamp.toDate();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d = timestamp.toDate();
    return d.toLocaleTimeString('en-US', { hour12: false });
};

const ActivityLogs = () => {
    const [logs, setLogs]               = useState([]);
    const [loading, setLoading]         = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ Real-time listener from Firestore
    useEffect(() => {
        const q = query(collection(firestore, 'activityLogs'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLogs(data);
            setLoading(false);
        }, (err) => {
            console.error("Failed to fetch logs:", err);
            setLoading(false);
        });

        return () => unsubscribe(); // cleanup on unmount
    }, []);

    // Group logs by date
    const groupedLogs = useMemo(() => {
        const filtered = logs.filter(log => {
            const matchesFilter = activeFilter === 'all' || log.type === activeFilter;
            const matchesSearch = log.message?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        const groups = {};
        filtered.forEach(log => {
            const date = formatDate(log.timestamp);
            if (!groups[date]) groups[date] = [];
            groups[date].push(log);
        });

        return Object.entries(groups); // [ [date, events[]], ... ]
    }, [logs, activeFilter, searchQuery]);

    const totalCount = groupedLogs.reduce((sum, [, events]) => sum + events.length, 0);

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-6 font-sans bg-gray-50">

                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Activity Log</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {loading ? 'Loading...' : <>Showing <span className="font-semibold text-gray-700">{totalCount}</span> events</>}
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Search */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text" placeholder="Search activity logs..."
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5">
                                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-gray-100 bg-gray-50">
                        {FILTER_OPTIONS.map(f => (
                            <button key={f.value} onClick={() => setActiveFilter(f.value)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${activeFilter === f.value ? f.activeColor : f.color}`}>
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Timeline */}
                    <div className="p-6 space-y-8">
                        {loading ? (
                            <div className="flex items-center justify-center py-16 text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                <span className="text-sm">Loading activity logs...</span>
                            </div>
                        ) : groupedLogs.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No activity found</p>
                                <p className="text-sm mt-1">Try adjusting your filters or search query</p>
                            </div>
                        ) : (
                            groupedLogs.map(([date, events]) => (
                                <div key={date}>
                                    {/* Date Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
                                        <div className="flex-1 h-px bg-gray-100" />
                                        <span className="text-xs text-gray-400">{events.length} events</span>
                                    </div>

                                    {/* Events */}
                                    <div className="relative pl-6 border-l-2 border-gray-200 space-y-1">
                                        {events.map((event) => {
                                            const { Icon, color, bg } = ICON_CONFIG[event.icon] || ICON_CONFIG.settings;
                                            return (
                                                <div key={event.id} className="relative flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                                    {/* Timeline dot */}
                                                    <div className="absolute -left-[25px] top-4 w-3 h-3 rounded-full bg-white border-2 border-gray-300 group-hover:border-blue-400 transition-colors" />
                                                    {/* Icon */}
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                                                        <Icon className={`w-4 h-4 ${color}`} />
                                                    </div>
                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-800">{event.message}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs font-mono text-gray-400">{formatTime(event.timestamp)}</span>
                                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[event.type] || TYPE_BADGE.system}`}>
                                                                {event.type?.charAt(0).toUpperCase() + event.type?.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ActivityLogs;