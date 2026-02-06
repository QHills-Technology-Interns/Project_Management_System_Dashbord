"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  Ban,
  XCircle,
} from "lucide-react";

const API_BASE = "https://ceo-dashboard-z65r.onrender.com/api";

export default function CreateExpense() {
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

  const statusConfig = {
    Pending: {
      percent: 25,
      color: "bg-yellow-500",
      text: "Waiting for payment approval",
      textColor: "text-yellow-600",
    },
    Paid: {
      percent: 100,
      color: "bg-green-500",
      text: "Payment completed successfully",
      textColor: "text-green-600",
    },
    Cancelled: {
      percent: 0,
      color: "bg-gray-400",
      text: "Expense was cancelled",
      textColor: "text-gray-500",
    },
    Rejected: {
      percent: 0,
      color: "bg-red-500",
      text: "Payment request rejected",
      textColor: "text-red-600",
    },
  };

  const progress = statusConfig[form.status];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const selectStatus = (status) => {
    setForm({ ...form, status });
  };

  const clearForm = () => {
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
    setError("");
    setSuccess("");
  };

  /* 🔥 SUBMIT EXPENSE */
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create expense");
      }

      setSuccess("Expense created successfully ✅");
      clearForm();
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
          Fill in the details to submit your expense request
        </p>
      </div>

      {/* CATEGORY & DATE */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Expense Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full mt-1 rounded-xl border px-4 py-3 text-sm"
          >
            <option value="">Select category</option>
            <option>Travel</option>
            <option>Food</option>
            <option>Office Supplies</option>
            <option>Software</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Expense Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full mt-1 rounded-xl border px-4 py-3 text-sm"
          />
        </div>
      </div>

      {/* AMOUNT & CURRENCY */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Amount *</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full mt-1 rounded-xl border px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full mt-1 rounded-xl border px-4 py-3 text-sm"
          >
            <option>INR</option>
            <option>USD</option>
          </select>
        </div>
      </div>

      {/* VENDOR */}
      <div>
        <label className="text-sm font-medium">Vendor Name</label>
        <input
          name="vendor"
          value={form.vendor}
          onChange={handleChange}
          placeholder="Enter vendor or company name"
          className="w-full mt-1 rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {/* PAYMENT STATUS */}
      <div>
        <label className="text-sm font-medium block mb-3">
          Payment Status
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatusCard label="Pending" icon={<Clock size={16} />} active={form.status} onClick={selectStatus} />
          <StatusCard label="Paid" icon={<CheckCircle size={16} />} active={form.status} onClick={selectStatus} />
          <StatusCard label="Cancelled" icon={<Ban size={16} />} active={form.status} onClick={selectStatus} />
          <StatusCard label="Rejected" icon={<XCircle size={16} />} active={form.status} onClick={selectStatus} />
        </div>
      </div>

      {/* PROGRESS */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Payment Progress</span>
          <span>{progress.percent}%</span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${progress.color}`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        <p className={`text-xs mt-1 ${progress.textColor}`}>
          {progress.text}
        </p>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm font-medium">Expense Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full mt-1 rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {/* NOTES */}
      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          className="w-full mt-1 rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {/* FEEDBACK */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      {/* ACTIONS */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          type="button"
          onClick={clearForm}
          className="text-sm text-gray-500 hover:underline"
        >
          Clear form
        </button>

        <button
          onClick={handleSubmit}
          disabled={form.status !== "Paid" || loading}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition
            ${
              form.status === "Paid" && !loading
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {loading ? "Submitting..." : "Submit Expense →"}
        </button>
      </div>
    </div>
  );
}

/* STATUS CARD */
function StatusCard({ label, icon, active, onClick }) {
  const isActive = active === label;

  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className={`border rounded-xl px-4 py-3 text-sm flex flex-col gap-1 transition
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
