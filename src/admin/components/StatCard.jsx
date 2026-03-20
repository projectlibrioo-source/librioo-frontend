import React from 'react';

const StatCard = ({ title, count }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide border-b-2 border-gray-200 inline-block pb-1 mb-4">
                {title}
            </h3>
            <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{count}</span>
            </div>
        </div>
    );
};

export default StatCard;
