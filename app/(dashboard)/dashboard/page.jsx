"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FolderKanban,
  IndianRupee,
  Users,
  AlertTriangle,
  FileText,
  Handshake
} from "lucide-react";

const API = "https://ceo-dashboard-z65r.onrender.com/api/dashboard";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [projectHealth, setProjectHealth] = useState(null);
  const [sales, setSales] = useState(null);
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/overview`),
      axios.get(`${API}/project-health`),
      axios.get(`${API}/sales-funnel`),
      axios.get(`${API}/payment-status`)
    ])
      .then(([o, p, s, pay]) => {
        setOverview(o.data.data);
        setProjectHealth(p.data.data);
        setSales(s.data.data);
        setPayments(pay.data.data);
      })
      .catch(console.error);
  }, []);

  if (!overview) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Projects"
          value={overview.projects.total}
          subtitle={`${overview.projects.in_progress} in progress`}
          icon={FolderKanban}
          color="bg-teal-100 text-teal-600"
        />

        <KpiCard
          title="Total Revenue"
          value={`₹${overview.financial.total_revenue.toLocaleString()}`}
          subtitle="This fiscal year"
          icon={IndianRupee}
          color="bg-green-100 text-green-600"
        />

        <KpiCard
          title="Active Deals"
          value={overview.sales.active_pipeline}
          subtitle="In pipeline"
          icon={Handshake}
          color="bg-yellow-100 text-yellow-600"
        />

        <KpiCard
          title="Active Sales Reps"
          value={overview.team.active_sales_reps}
          subtitle="Sales team"
          icon={Users}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      {/* PROJECT HEALTH */}
      <Card title="Project Status">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="On Time" value={projectHealth.timeline_status.on_time} />
          <Stat label="Delayed" value={projectHealth.timeline_status.delayed} />
          <Stat label="Near Completion" value={projectHealth.progress_metrics.near_completion} />
          <Stat label="Needs Attention" value={projectHealth.progress_metrics.needs_attention} />
        </div>
      </Card>

      {/* SALES */}
      <Card title="Sales Performance">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Deal Value" value={`₹${sales.metrics.total_deals_value.toLocaleString()}`} />
          <Stat label="Win Rate" value={`${sales.metrics.win_rate}%`} />
          <Stat label="Avg Deal Size" value={`₹${sales.metrics.average_deal_size}`} />
          <Stat label="Expected Revenue" value={`₹${sales.metrics.expected_revenue.toLocaleString()}`} />
        </div>
      </Card>

      {/* PAYMENTS */}
      <Card title="Payment Status" icon={FileText}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat label="Pending Invoices" value={`₹${payments.pending_invoices.amount.toLocaleString()}`} />
          <Stat label="Overdue Invoices" value={`₹${payments.overdue_invoices.amount.toLocaleString()}`} danger />
          <Stat label="Payment Success Rate" value={`${payments.payment_metrics.payment_success_rate}%`} />
        </div>
      </Card>

      {/* ALERTS */}
      {projectHealth.at_risk_projects.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} /> At-Risk Projects
          </h2>
          <ul className="mt-3 list-disc list-inside text-sm text-red-600">
            {projectHealth.at_risk_projects.slice(0, 5).map(p => (
              <li key={p.project_id}>
                {p.project_name} — {p.progress_percentage}% complete
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function KpiCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center hover:shadow-md transition">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={26} />
      </div>
    </div>
  );
}

function Card({ title, children, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {Icon && <Icon size={18} />} {title}
      </h2>
      {children}
    </div>
  );
}

function Stat({ label, value, danger }) {
  return (
    <div
      className={`p-4 rounded-lg ${
        danger ? "bg-red-100 text-red-700" : "bg-gray-100"
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
