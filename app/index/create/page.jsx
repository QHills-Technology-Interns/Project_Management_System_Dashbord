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
    progress_percentage: "",
    priority: "Medium",
    geography: "",
    description: "",
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
          total_cost_to_date: Number(form.total_cost_to_date) || 0,
          total_revenue: Number(form.total_revenue) || 0,
          progress_percentage: Number(form.progress_percentage) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Project created successfully");
      router.push("/projects");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  const input =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none";
  const label =
    "block mb-1 text-xs font-semibold text-gray-600 uppercase";

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create New Project
          </h1>
          <p className="text-gray-500 mt-1">
            Add a new project to your portfolio
          </p>
        </div>
      <form
  onSubmit={handleSubmit}
  className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/40 p-10 space-y-12"
>


          {/* PROJECT DETAILS */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              Project Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Project Name *</label>
                <input className={input} name="project_name" placeholder="Enter Project Name" required onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Client Name *</label>
                <input className={input} name="client_name" placeholder="Enter client name" required onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Project Status *</label>
                <select className={input} name="project_status"  onChange={handleChange}>
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className={label}>Project Owner</label>
                <input className={input} name="project_owner" placeholder="Enter owner name" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Category</label>
                <input className={input} name="category" placeholder="select category" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Sub Category</label>
                <input className={input} name="sub_category"  placeholder="select su category"onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* TIMELINE */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={label}>Planned Start Date</label>
                <input type="date" className={input} name="start_date_planned" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Actual Start Date</label>
                <input type="date" className={input} name="start_date_actual" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Planned End Date</label>
                <input type="date" className={input} name="end_date_planned" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Actual End Date</label>
                <input type="date" className={input} name="end_date_actual" onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* FINANCIALS */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              Financial Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={label}>Total Budget (₹)</label>
                <input className={input} name="total_budget" placeholder="0.0" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Cost to Date</label>
                <input className={input} name="total_cost_to_date" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Total Revenue</label>
                <input className={input} name="total_revenue" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Currency</label>
                <input className={input} name="currency" onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* META */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              Project Meta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={label}>Progress (%)</label>
                <input className={input} name="progress_percentage" onChange={handleChange} />
              </div>

              <div>
                <label className={label}>Priority</label>
                <select className={input} name="priority" onChange={handleChange}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <label className={label}>Geography</label>
                <input className={input} name="geography" onChange={handleChange} />
              </div>

              <div className="md:col-span-3">
                <label className={label}>Description</label>
                <textarea rows={4} className={input} name="description" onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-10 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Create Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
