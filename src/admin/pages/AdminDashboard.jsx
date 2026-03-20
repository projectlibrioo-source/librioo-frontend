import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useAuth } from "../context/AuthContext";
import StatCard from '../components/StatCard';
import RobotCard from '../components/RobotCard';
import AdminLayout from '../layouts/AdminLayout';

// Firebase
import { ref, onValue } from "firebase/database";
import { db } from "../firebase"; // your firebase config

const AdminDashboard = () => {

  const { currentUser } = useAuth();

  // ---------------- STATE ----------------
  const [stats, setStats] = useState([]);
  const [robots, setRobots] = useState([]);

  // ---------------- LOAD DASHBOARD STATS ----------------
  useEffect(() => {

    axios.get("https://librioo-backend-production.up.railway.app/api/dashboard")
      .then(res => {

        const data = res.data;

        setStats([
          { title: 'Total Books', count: data.totalBooks },
          { title: 'Total Users', count: data.totalUsers },
          { title: 'Active Users', count: data.activeUsers },
          { title: 'Books Borrowed', count: data.booksBorrowed },
          { title: 'Overdue Books', count: data.overdueBooks },
          { title: 'Active Robots', count: data.activeRobots },
        ]);

      })
      .catch(err => console.error("Dashboard error:", err));

  }, []);

  // ---------------- LOAD ROBOTS (SPRING BOOT API) ----------------
  useEffect(() => {

    axios.get("https://librioo-backend-production.up.railway.app/api/overview")
      .then(res => {

        // Map backend data → UI format
        const formatted = res.data.map(r => ({
          id: r.robotID,
          name: r.robotName,
          status: r.status,
          battery: 80, // static for now or from Firebase later
          user: "N/A",
          task: "Idle",
          location: "Library",
          tasksToday: 0,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${r.robotName}`
        }));

        setRobots(formatted);

      })
      .catch(err => console.error("Robot API error:", err));

  }, []);

  // ---------------- REAL-TIME FIREBASE ROBOT STATUS ----------------
  useEffect(() => {

    const robotRef = ref(db, "robot");

    onValue(robotRef, (snapshot) => {

      const data = snapshot.val();

      if (!data) return;

      // Update robots dynamically
      setRobots(prev =>
        prev.map(robot => ({
          ...robot,
          status: data.status || robot.status,
          task: data.currentCommand || "Idle",
          location: "Shelf " + (data.targetShelf || "-")
        }))
      );

    });

  }, []);

  // ---------------- UI ----------------
  return (
    <AdminLayout>
      <div className="min-h-full p-8 space-y-8 bg-gray-50/50">

        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          Dashboard
        </h2>

        {/* -------- Stats -------- */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, idx) => (
            <StatCard key={idx} title={stat.title} count={stat.count} />
          ))}
        </div>

        {/* -------- Robot Section -------- */}
        <h3 className="mb-4 text-xl font-bold text-gray-800">
          Robot Status
        </h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {robots.map((robot) => (
            <RobotCard key={robot.id} {...robot} />
          ))}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;