"use client";

import { useState, useMemo } from "react";
import { Clock, CheckCircle, Ban, XCircle } from "lucide-react";
import {
  ProjectProvider,
  useProject,
} from "../../../../context/ProjectContext";

const API_BASE = "https://ceo-dashboard-8052.onrender.com/api/expenses";

/* ---------------- STATUS CONFIG ---------------- */
const statusConfig = {
  Pending: {
    icon: <Clock size={16} />,
    percent: 30,
    color: "bg-yellow-400",
    text: "Waiting for payment",
    textColor: "text-yellow-600",
  },
  Paid: {
    icon: <CheckCircle size={16} />,
    percent: 100,
    color: "bg-green-500",
    text: "Payment completed",
    textColor: "text-green-600",
  },
  Cancelled: {
    icon: <Ban size={16} />,
    percent: 0,
    color: "bg-gray-400",
    text: "Payment cancelled",
    textColor: "text-gray-500",
  },
  Rejected: {
    icon: <XCircle size={16} />,
    percent: 0,
    color: "bg-red-500",
    text: "Payment rejected",
    textColor: "text-red-600",
  },
};

/* ---------------- FORM ---------------- */
function CreateExpenseForm() {
  const { projectId } = useProject();

  const [form, setForm] = useState({
    category: "",
    date: "",
    amount: "",
    currency: "INR",
    vendor: "",
    status: "Pending",
    description: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const progress = useMemo(() => statusConfig[form.status], [form.status]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const selectStatus = (status) => setForm({ ...form, status });

  const handleSubmit = async () => {
    if (!projectId) {
      setError("Please select a project first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        project_id: projectId,
        expense_category: form.category,
        expense_date: form.date,
        amount: Number(form.amount),
        currency: form.currency,
        vendor_name: form.vendor,
        payment_status: form.status,
        expense_description: form.description,
        notes: form.notes,
      };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Expense created successfully ✅");
      setForm({
        category: "",
        date: "",
        amount: "",
        currency: "INR",
        vendor: "",
        status: "Pending",
        description: "",
        notes: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">New Expense</h2>
        <p className="text-sm text-gray-500">
          Submit expense for Project ID: {projectId || "—"}
        </p>
      </div>

      {/* CATEGORY & DATE */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3 text-sm"
          >
            <option value="">Select category</option>
            <option>Travel</option>
            <option>Office Supplies</option>
            <option>Software Licenses</option>
            <option>Hardware</option>
            <option>Contractor Fees</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3 text-sm"
          />
        </div>
      </div>

      {/* AMOUNT & CURRENCY */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="rounded-xl border px-4 py-3 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3 text-sm"
          >
            <option>INR</option>
            <option>USD</option>
          </select>
        </div>
      </div>

      {/* VENDOR */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Vendor Name</label>
        <input
          name="vendor"
          value={form.vendor}
          onChange={handleChange}
          placeholder="Vendor name"
          className="rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {/* STATUS */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Payment Status</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusConfig).map(([key, value]) => (
            <StatusCard
              key={key}
              label={key}
              icon={value.icon}
              active={form.status}
              onClick={selectStatus}
            />
          ))}
        </div>
      </div>

      {/* PROGRESS */}
      <div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress.color}`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${progress.textColor}`}>{progress.text}</p>
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Description"
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {/* NOTES */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Notes"
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Expense →"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- STATUS CARD ---------------- */
function StatusCard({ label, icon, active, onClick }) {
  const isActive = active === label;

  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className={`border rounded-xl px-4 py-3 text-sm flex flex-col gap-1
        ${
          isActive
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-gray-200 hover:bg-gray-50"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

/* ---------------- PAGE EXPORT ---------------- */
export default function CreateExpensePage() {
  return (
    <ProjectProvider>
      <CreateExpenseForm />
    </ProjectProvider>
  );
}
