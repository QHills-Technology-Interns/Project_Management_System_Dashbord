"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SalesActivityPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  const [formData, setFormData] = useState({
    deal_id: "",
    sales_rep_id: "",
    activity_type: "",
    activity_date: "",
    duration_minutes: "",
    notes: "",
    outcome: "",
    next_follow_up: "",
  });

  // ✅ SAFE localStorage access
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      alert("Session expired. Please login again.");
      router.push("/login");
    } else {
      setToken(t);
    }
  }, [router]);

  // ⏳ Prevent render until token exists
  if (!token) return <p>Loading...</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      deal_id: "29d9887b-f379-491e-83eb-a81dd47ca6a3",
      sales_rep_id: "0a130306-9ef8-4bc4-96af-2669c110dade",
      activity_type: formData.activity_type,
      activity_date: formData.activity_date,
      duration_minutes: formData.duration_minutes || null,
      notes: formData.notes || null,
      outcome: formData.outcome || null,
      next_follow_up_date: formData.next_follow_up || null,
    };

    try {
      const res = await fetch(
      "https://ceo-dashboard-8052.onrender.com/api/sales-activities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Sales Activity created successfully ✅");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to create Sales Activity ❌");
    }
  };


  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-green-300";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-6">
  <h1 className="text-2xl font-semibold text-gray-800">
    Sales Activity
  </h1>
  <p className="text-gray-500">
    Track calls, meetings, demos, and follow-ups
  </p>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div>
            <label className={labelClass}>
              Deal ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="deal_id"
              required
              value={formData.deal_id}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Sales Rep ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sales_rep_id"
              required
              value={formData.sales_rep_id}
              onChange={handleChange}
              className={inputClass}
            />
          </div> */}

          <div>
            <label className={labelClass}>
              Activity Type <span className="text-red-500">*</span>
            </label>
            <select
              name="activity_type"
              required
              value={formData.activity_type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select activity</option>
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Email">Email</option>
              <option value="Demo">Demo</option>
              <option value="Proposal">Proposal</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Activity Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="activity_date"
              required
              value={formData.activity_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Duration (minutes)</label>
            <input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Next Follow-up Date</label>
            <input
              type="date"
              name="next_follow_up"
              value={formData.next_follow_up}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className={labelClass}>Notes</label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="mt-4">
          <label className={labelClass}>Outcome</label>
          <input
            type="text"
            name="outcome"
            value={formData.outcome}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Activity
          </button>
        </div>
      </form>
    </div>
  );
}
