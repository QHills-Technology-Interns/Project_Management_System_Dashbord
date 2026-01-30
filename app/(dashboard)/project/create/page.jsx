"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateProject() {
  const router = useRouter();

  const [form, setForm] = useState({
    project_name: "",
    client_name: "Unknown Client",
    project_status: "In Progress",
    category: "",
    sub_category: "",
    project_owner: "",
    start_date_planned: "",
    start_date_actual: "",
    end_date_planned: "",
    end_date_actual: "",
    total_budget: "",
    total_cost_to_date: "",
    total_revenue: "",
    currency: "INR",
    progress_percentage: 0,
    priority: "Medium",
    geography: "",
  });
const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  const payload = {
    ...form,
    total_budget: Number(form.total_budget) || 0,
    total_cost_to_date: Number(form.total_cost_to_date) || 0,
    total_revenue: Number(form.total_revenue) || 0,
    progress_percentage: Number(form.progress_percentage) || 0,
  };

  try {
    const res = await axios.post(
      "http://localhost:5000/api/projects",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("Project created successfully 🚀");
    // router.push("/projects");
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to create project");
  }
};


  const input =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none";
  const label =
    "block mb-1 text-xs font-semibold text-slate-600 uppercase";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl">

        {/* Centered Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800">
            Create New Project
          </h1>
          <p className="text-slate-500 mt-2">
            Enter complete project information below
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 space-y-12"
        >

          {/* PROJECT DETAILS */}
          <section>
            <h2 className="text-lg font-semibold text-slate-700 mb-6">
               Project Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={label}>Project Name *</label>
                <input
                  className={input}
                  name="project_name"
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
                  required
                  value={form.client_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Project Owner *</label>
                <input
                  className={input}
                  name="project_owner"
                  required
                  value={form.project_owner}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Project Status</label>
                <select
                  className={input}
                  name="project_status"
                  value={form.project_status}
                  onChange={handleChange}
                >
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className={label}>Category</label>
                <input
                  className={input}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Sub Category</label>
                <input
                  className={input}
                  name="sub_category"
                  value={form.sub_category}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* TIMELINE */}
          <section>
            <h2 className="text-lg font-semibold text-slate-700 mb-6">
               Project Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={label}>Planned Start Date</label>
                <input
                  type="date"
                  className={input}
                  name="start_date_planned"
                  value={form.start_date_planned}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Actual Start Date</label>
                <input
                  type="date"
                  className={input}
                  name="start_date_actual"
                  value={form.start_date_actual}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Planned End Date</label>
                <input
                  type="date"
                  className={input}
                  name="end_date_planned"
                  value={form.end_date_planned}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Actual End Date</label>
                <input
                  type="date"
                  className={input}
                  name="end_date_actual"
                  value={form.end_date_actual}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* FINANCIALS */}
          <section>
            <h2 className="text-lg font-semibold text-slate-700 mb-6">
               Financial Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={label}>Total Budget</label>
                <input
                  className={input}
                  name="total_budget"
                  value={form.total_budget}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Cost to Date</label>
                <input
                  className={input}
                  name="total_cost_to_date"
                  value={form.total_cost_to_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Total Revenue</label>
                <input
                  className={input}
                  name="total_revenue"
                  value={form.total_revenue}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Currency</label>
                <input
                  className={input}
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* META */}
          <section>
            <h2 className="text-lg font-semibold text-slate-700 mb-6">
              ⚙ Project Meta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={label}>Progress (%)</label>
                <input
                  className={input}
                  name="progress_percentage"
                  value={form.progress_percentage}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={label}>Priority</label>
                <select
                  className={input}
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <label className={label}>Geography</label>
                <input
                  className={input}
                  name="geography"
                  value={form.geography}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* CENTER BUTTON */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-16 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
