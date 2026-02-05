"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://ceo-dashboard-z65r.onrender.com/api";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard/overview`);
      const data = res.data.data;

      setOverview(data);
      setProjects(data.projects_list || []); // if you expose project list
    } catch (err) {
      console.error("Dashboard API error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <input
          className="border px-3 py-2 rounded-lg text-sm"
          placeholder="Search projects..."
        />
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={overview.projects.total}
          subtitle="+ this month"
        />

        <StatCard
          title="Active Projects"
          value={overview.projects.in_progress}
          subtitle="Currently in progress"
        />

        <StatCard
          title="Projects at Risk"
          value={overview.projects.total - overview.projects.completed}
          subtitle="Need attention"
        />

        <StatCard
          title="Total Revenue"
          value={`₹${overview.financial.total_revenue}`}
          subtitle="From paid milestones"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ALL PROJECTS */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6">
          <h2 className="font-semibold mb-4">All Projects</h2>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-2">Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Progress</th>
              </tr>
            </thead>

            <tbody>
              {projects.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    No projects found
                  </td>
                </tr>
              )}

              {projects.map((p) => (
                <tr key={p.project_id} className="border-b last:border-none">
                  <td className="py-3">{p.project_name}</td>
                  <td>{p.client_name || "-"}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        p.project_status === "In Progress"
                          ? "bg-green-100 text-green-700"
                          : p.project_status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.project_status}
                    </span>
                  </td>
                  <td>₹{p.total_budget}</td>
                  <td>
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-blue-600 rounded"
                        style={{
                          width: `${p.progress_percentage || 0}%`
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* UPCOMING MILESTONES (FROM OVERVIEW / FUTURE API) */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-semibold mb-4">Upcoming Milestones</h2>

          {overview.invoices.pending === 0 ? (
            <p className="text-sm text-gray-400">No upcoming milestones</p>
          ) : (
            <div className="border rounded-lg p-4">
              <p className="font-medium">Pending Invoices</p>
              <p className="text-sm text-gray-500">
                Count: {overview.invoices.pending}
              </p>
              <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                Pending
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ---------- COMPONENT ---------- */

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
