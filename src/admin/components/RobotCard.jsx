import React from 'react';

const RobotCard = ({ name, status, battery, user, task, location, tasksToday, image }) => {
    const isOnline = status === 'Online';

    // Battery color logic
    let batteryColor = 'bg-green-500';
    if (battery < 30) batteryColor = 'bg-red-500';
    else if (battery < 60) batteryColor = 'bg-yellow-500';

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        {/* Placeholder for robot image if not provided */}
                        <img src={image || "https://robohash.org/" + name} alt={name} className="w-12 h-12" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
                    <span>Battery:</span>
                    <span>{battery}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${batteryColor} transition-all duration-500`}
                        style={{ width: `${battery}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">User:</span>
                    <span>{user}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Task:</span>
                    <span>{task}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Location:</span>
                    <span>{location}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Tasks Today:</span>
                    <span>{tasksToday}</span>
                </div>
            </div>

            <button
                className="mt-auto w-full py-2 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => {
                    // BACKEND: Navigate to robot details or fetch specific robot data
                    // e.g. navigate(`/robots/${name}`)
                }}
            >
                Details
            </button>
        </div>
    );
};

export default RobotCard;