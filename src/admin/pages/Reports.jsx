import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';

const Reports = () => {
    const [reportType, setReportType] = useState('Library Managing Reports');
    const [searchField, setSearchField] = useState('Date');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookCategory, setBookCategory] = useState('All Categories');
    const [robotUnit, setRobotUnit] = useState('All Robots');
    const [metricType, setMetricType] = useState('Distance Traveled');
    const [searchText, setSearchText] = useState('');

    const [dashboardStats, setDashboardStats] = useState({
        totalLoans: 0,
        systemUptime: '0%',
        revenue: 'LKR 0'
    });

    const [generatedReport, setGeneratedReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/admin/reports/dashboard')
            .then((res) => {
                const data = res.data;

                setDashboardStats({
                    totalLoans: data.totalLoans ?? 0,
                    systemUptime: data.systemUptime ?? '0%',
                    revenue: data.revenue ? `LKR ${data.revenue}` : 'LKR 0'
                });
            })
            .catch((err) => {
                console.error('Dashboard stats error:', err);
            });
    }, []);

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                reportType:
                    reportType === 'Library Managing Reports'
                        ? 'LIBRARY'
                        : 'SYSTEM',
                fromDate,
                toDate,
                bookCategory:
                    reportType === 'Library Managing Reports' ? bookCategory : null,
                robotUnit:
                    reportType === 'System Reports (Technical)' ? robotUnit : null,
                metricType:
                    reportType === 'System Reports (Technical)' ? metricType : null
            };

            const res = await axios.post(
                'http://localhost:8080/api/admin/reports/generate',
                payload
            );

            setGeneratedReport(res.data);
        } catch (err) {
            console.error('Generate report error:', err);
            alert('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const previewRows =
        generatedReport?.reportRows ||
        generatedReport?.rows ||
        generatedReport?.data ||
        [];

    const popularItems =
        generatedReport?.popularItems ||
        generatedReport?.topItems ||
        [];

    const filteredRows = previewRows.filter((row) => {
        if (!searchText.trim()) return true;

        const value =
            searchField === 'Date'
                ? row.date
                : reportType === 'Library Managing Reports'
                    ? row.loans || row.patrons || row.overdues
                    : row.robotId || row.robot || row.eventsLogged || row.avgBattery;

        return String(value ?? '')
            .toLowerCase()
            .includes(searchText.toLowerCase());
    });

    return (
        <AdminLayout>
            <div className="min-h-full p-8 space-y-8 font-sans bg-gray-50">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
                    <p className="text-sm text-gray-500 mt-1">Admin / Reports</p>
                </div>

                {/* Usage Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500 uppercase font-bold tracking-wide">Total Loans</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardStats.totalLoans}</p>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500 uppercase font-bold tracking-wide">System Uptime</p>
                        <p className="text-3xl font-bold text-green-500 mt-2">{dashboardStats.systemUptime}</p>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500 uppercase font-bold tracking-wide">Revenue</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{dashboardStats.revenue}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Report Builder */}
                    <div className="lg:col-span-1 border border-gray-200 rounded-lg shadow-sm bg-white p-6 h-fit">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Report Builder</h3>
                        <form className="space-y-4" onSubmit={handleGenerateReport}>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Report Focus</label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                >
                                    <option>Library Managing Reports</option>
                                    <option>System Reports (Technical)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">From</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">To</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {reportType === 'Library Managing Reports' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Book Category</label>
                                    <select
                                        value={bookCategory}
                                        onChange={(e) => setBookCategory(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option>All Categories</option>
                                        <option>Fiction</option>
                                        <option>Science</option>
                                    </select>
                                </div>
                            )}

                            {reportType === 'System Reports (Technical)' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Robot Unit</label>
                                        <select
                                            value={robotUnit}
                                            onChange={(e) => setRobotUnit(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option>All Robots</option>
                                            <option>Robot Alpha</option>
                                            <option>Robot Beta</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Metric Type</label>
                                        <select
                                            value={metricType}
                                            onChange={(e) => setMetricType(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option>Distance Traveled</option>
                                            <option>Error Events</option>
                                            <option>Service History</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium mt-4">
                                {loading ? 'Generating...' : 'Generate Report'}
                            </button>
                        </form>
                    </div>

                    {/* Preview Table Container */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Generated Report Preview */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                                <h3 className="text-xl font-bold text-gray-800">Preview: {reportType}</h3>
                                <div className="space-x-2">
                                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition">Export PDF</button>
                                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition">Export Excel</button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="relative w-full sm:w-2/3 flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                    <select
                                        value={searchField}
                                        onChange={(e) => setSearchField(e.target.value)}
                                        className="bg-gray-50 text-gray-600 text-sm border-none focus:ring-0 py-2 pl-3 pr-8 h-full"
                                    >
                                        <option value="Date">Date</option>
                                        {reportType === 'Library Managing Reports' ? <option value="Loans">Loans</option> : <option value="Robot">Robot</option>}
                                    </select>
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <input
                                        type="text"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        placeholder={`Search by ${searchField}...`}
                                        className="w-full pl-3 pr-4 py-2 text-sm border-none focus:ring-0"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        {reportType === 'Library Managing Reports' ? (
                                            <tr>
                                                <th className="px-4 py-2">Date</th>
                                                <th className="px-4 py-2">Patrons</th>
                                                <th className="px-4 py-2">Loans</th>
                                                <th className="px-4 py-2">Overdues</th>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <th className="px-4 py-2">Date</th>
                                                <th className="px-4 py-2">Robot ID</th>
                                                <th className="px-4 py-2">Events Logged</th>
                                                <th className="px-4 py-2">Avg Battery %</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody>
                                        {filteredRows.length > 0 ? (
                                            reportType === 'Library Managing Reports' ? (
                                                filteredRows.map((row, index) => (
                                                    <tr className="border-b" key={index}>
                                                        <td className="px-4 py-2">{row.date}</td>
                                                        <td className="px-4 py-2">{row.patrons}</td>
                                                        <td className="px-4 py-2">{row.loans}</td>
                                                        <td className="px-4 py-2">{row.overdues}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                filteredRows.map((row, index) => (
                                                    <tr className="border-b" key={index}>
                                                        <td className="px-4 py-2">{row.date}</td>
                                                        <td className="px-4 py-2">{row.robotId}</td>
                                                        <td className="px-4 py-2">{row.eventsLogged}</td>
                                                        <td className="px-4 py-2">{row.avgBattery}</td>
                                                    </tr>
                                                ))
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-6 text-center text-gray-400"
                                                >
                                                    No report data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Popular Items Card */}
                        {reportType === 'Library Managing Reports' && (
                            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Items (Top 10)</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2">Title</th>
                                                <th className="px-4 py-2">Author</th>
                                                <th className="px-4 py-2">Checkouts</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {popularItems.length > 0 ? (
                                                popularItems.map((item, index) => (
                                                    <tr className="border-b" key={index}>
                                                        <td className="px-4 py-2 font-medium text-gray-900">{item.title}</td>
                                                        <td className="px-4 py-2">{item.author}</td>
                                                        <td className="px-4 py-2">{item.checkouts}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                                                        No popular items available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Reports;