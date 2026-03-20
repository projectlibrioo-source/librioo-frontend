import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

const RobotStatus = () => {
    const [robots, setRobots] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('Name');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRobots();
    }, []);

    const fetchRobots = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/robots/all');
            
            // Map the database robot entity to the UI expectation
            // Since physical telemetry (battery, shelf) doesn't exist in MySQL, 
            // we generate plausible mock data to maintain the UI's demonstration value.
            const mappedRobots = (res.data || []).map(r => {
                // Generate deterministic fake battery based on ID so it doesn't flicker wildly
                const pseudoBattery = 40 + ((r.robotID * 17) % 60); 
                const pseudoRemainingH = Math.floor(pseudoBattery / 15);
                
                return {
                    id: r.robotID,
                    name: r.robotName || `Robot ${r.robotID}`,
                    status: r.status || 'Offline',
                    
                    // Hardware Mock Telemetry
                    currentUser: r.status === 'ACTIVE' ? 'Auto-Patrol' : 'None',
                    userId: '-',
                    lastActive: r.startDate ? r.startDate.split('T')[0] : 'Unknown',
                    currentShelf: `Shelf ${String.fromCharCode(65 + (r.robotID % 5))}${pseudoRemainingH + 1}`,
                    battery: pseudoBattery,
                    remaining: `${pseudoRemainingH}h ${(pseudoBattery % 15) * 4}min`,
                    image: `https://api.dicebear.com/7.x/bottts/svg?seed=${r.robotName || r.robotID}&backgroundColor=b6e3f4`
                };
            });
            
            setRobots(mappedRobots);
        } catch (error) {
            console.error('Failed to fetch robots', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRobots = robots.filter(robot => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        if (searchType === 'ID') return robot.id.toString().includes(term);
        if (searchType === 'Name') return robot.name.toLowerCase().includes(term);
        if (searchType === 'Current User') return robot.currentUser.toLowerCase().includes(term);
        return true;
    });

    return (
        <AdminLayout>
             <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h2 className="text-3xl font-bold text-gray-900">Robot Status</h2>
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-96 flex bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                        <select 
                            className="bg-gray-50 text-gray-700 text-sm py-2 pl-3 pr-8 border-none border-r border-gray-300 focus:ring-0 cursor-pointer outline-none"
                            value={searchType} onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option>Name</option>
                            <option>ID</option>
                            <option>Current User</option>
                        </select>
                        <input
                            type="text"
                            className="block w-full py-2 pl-3 pr-10 leading-5 placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none sm:text-sm"
                            placeholder={`Search by ${searchType}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                         <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredRobots.length === 0 ? (
                    <div className="flex justify-center py-20 text-gray-500">
                        No robots found matching your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredRobots.map((robot, idx) => (
                            <div key={idx} className="bg-[#E6F3FA] rounded-3xl p-6 shadow-sm border border-blue-100 flex flex-col items-center relative overflow-hidden transition-transform duration-300 hover:scale-105">
                                <div className="z-10 mb-6 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900">{robot.name}</h3>
                                    <p className="text-sm font-bold text-gray-800">ID : {robot.id}</p>
                                </div>

                                <div className="z-10 w-full space-y-3 text-sm font-bold text-gray-900">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">Current User:</span>
                                        <span>{robot.currentUser}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">User ID:</span>
                                        <span>{robot.userId}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">Status:</span>
                                        <span className={robot.status === 'ACTIVE' || robot.status === 'Online' ? 'text-green-600' : 'text-gray-600'}>
                                            {robot.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">Last Active:</span>
                                        <span>{robot.lastActive}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">Current Shelf:</span>
                                        <span>{robot.currentShelf}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">Battery:</span>
                                        <span>{robot.battery}%</span>
                                    </div>
                                </div>

                                <div className="z-10 flex items-center justify-between w-full px-4 mt-8">
                                    <div className="flex items-end space-x-2">
                                        {/* Dynamic Battery Icon */}
                                        <div className="relative w-8 h-12 bg-gray-200 rounded border border-gray-400 flex flex-col justify-end p-0.5 overflow-hidden">
                                            <div 
                                                className={`w-full rounded-sm transition-all duration-1000 ${robot.battery > 50 ? 'bg-green-500' : robot.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                style={{ height: `${robot.battery}%` }}
                                            ></div>
                                        </div>
                                        <img src={robot.image} alt={robot.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-600">Remaining</p>
                                        <p className="text-sm font-bold text-gray-900">{robot.remaining}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default RobotStatus;