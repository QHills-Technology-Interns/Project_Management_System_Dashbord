"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateProject() {
  const router = useRouter();

  const [form, setForm] = useState({
    project_name: "",
    client_name: "",
    project_status: "Planning",
    category: "",
    project_owner: "",
    start_date_planned: "",
    end_date_planned: "",
    total_budget: "",
    currency: "INR",
    progress_percentage: 0,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      await axios.post(
        "https://ceo-dashboard-z65r.onrender.com/api/projects",
        {
          ...form,
          total_budget: Number(form.total_budget) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Project created successfully 🚀");
      router.push("/dashboard");
    } catch (err) {
      alert("Failed to create project");
    }
  };

  const input =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const label = "block mb-1 text-sm font-medium text-gray-700";

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Project
        </h1>
        <p className="text-gray-500">
          Add a new project to your portfolio
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white rounded-xl border border-gray-200 p-8 space-y-10"
      >
        {/* SECTION TITLE */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Project Details
          </h2>
          <p className="text-sm text-gray-500">
            Enter the basic project information
          </p>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Project Name *</label>
            <input
              className={input}
              name="project_name"
              placeholder="Enter project name"
              required
              value={form.project_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={label}>Client Name *</label>
            <input
              className={input}
              name="client_name"
              placeholder="Enter client name"
              required
              value={form.client_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={label}>Project Category *</label>
            <select
              className={input}
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option>IT</option>
              <option>Marketing</option>
              <option>Construction</option>
            </select>
          </div>

          <div>
            <label className={label}>Project Status *</label>
            <select
              className={input}
              name="project_status"
              value={form.project_status}
              onChange={handleChange}
            >
              <option>Planning</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className={label}>Start Date *</label>
            <input
              type="date"
              className={input}
              name="start_date_planned"
              value={form.start_date_planned}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={label}>End Date (Planned)</label>
            <input
              type="date"
              className={input}
              name="end_date_planned"
              value={form.end_date_planned}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={label}>Total Budget (₹) *</label>
            <input
              className={input}
              placeholder="0.00"
              name="total_budget"
              value={form.total_budget}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={label}>Project Manager</label>
            <input
              className={input}
              name="project_owner"
              placeholder="Select manager"
              value={form.project_owner}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-8 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
