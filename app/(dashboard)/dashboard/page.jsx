"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FolderKanban,
  Activity,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

const API_BASE = "https://ceo-dashboard-z65r.onrender.com/api";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

const ITEMS_PER_PAGE = 4;
const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;

const paginatedProjects = projects.slice(startIndex, endIndex);

  useEffect(() => {
    fetchDashboard();
    fetchProjects();
  }, []);

  /* ---------------- DASHBOARD OVERVIEW ---------------- */
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/dashboard/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOverview(res.data.data);
    } catch (err) {
      console.error("Dashboard API error:", err.response?.data || err);
    }
  };

  /* ---------------- ALL PROJECTS ---------------- */
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(res.data.data || []);
    } catch (error) {
      console.error("Fetch projects error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  if (!overview) {
    return <p className="text-center mt-10">No dashboard data</p>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of your projects and revenue
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={overview.projects?.total || 0}
          subtitle="+ this month"
          icon={FolderKanban}
          iconColor="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Active Projects"
          value={overview.projects?.in_progress || 0}
          subtitle="Currently in progress"
          icon={Activity}
          iconColor="bg-green-100 text-green-600"
        />

        <StatCard
          title="Projects at Risk"
          value={
            (overview.projects?.total || 0) -
            (overview.projects?.completed || 0)
          }
          subtitle="Need attention"
          icon={AlertTriangle}
          iconColor="bg-yellow-100 text-yellow-600"
        />

        <StatCard
          title="Total Revenue"
          value={`₹${overview.financial?.total_revenue || 0}`}
          subtitle="From paid milestones"
          icon={DollarSign}
          iconColor="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ALL PROJECTS */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
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

              {paginatedProjects.map((p) => (
                <tr
                  key={p.project_id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-3 font-medium">{p.project_name}</td>
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
                  <td>₹{p.total_budget || 0}</td>
                  <td>
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-blue-600 rounded"
                        style={{
                          width: `${p.progress_percentage || 0}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* PAGINATION */}
{/* PAGINATION */}
{projects.length > ITEMS_PER_PAGE && (
  <div className="flex justify-end items-center gap-3 mt-4 text-sm">

    {/* PREVIOUS */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="w-8 h-8 flex items-center justify-center border rounded
        hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      &lt;
    </button>

    <span className="text-gray-500">
      {currentPage} / {totalPages}
    </span>

    {/* NEXT */}
    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="w-8 h-8 flex items-center justify-center border rounded
        hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      &gt;
    </button>

  </div>
)}



        </div>

        {/* UPCOMING MILESTONES */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Upcoming Milestones</h2>

          {overview.invoices?.pending === 0 ? (
            <p className="text-sm text-gray-400">No upcoming milestones</p>
          ) : (
            <div className="border rounded-lg p-4">
              <p className="font-medium">Pending Invoices</p>
              <p className="text-sm text-gray-500">
                Count: {overview.invoices?.pending}
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

/* ---------- STAT CARD ---------- */
function StatCard({ title, value, subtitle, icon: Icon, iconColor }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>

        <div
          className={`w-10 h-10 flex items-center justify-center rounded-lg ${iconColor}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
