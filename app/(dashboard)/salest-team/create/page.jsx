"use client";

import { useState } from "react";
import axios from "axios";
import { Inter } from "next/font/google";

/* ---------------- FONT CONFIG ---------------- */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CreateSalesTeam() {
  const [form, setForm] = useState({
    employee_name: "",
    phone: "",
    role: "",
    team_name: "",
    team_lead_id: "", // must be a valid UUID
    region: "",
    city: "",
    category_specialization: "",
    hire_date: "",
    monthly_target: 0,
    quarterly_target: 0,
    yearly_target: 0,
    commission_percentage: 0,
    is_active: true,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employee_name) {
      alert("Employee name is required!");
      return;
    }
    if (!form.team_lead_id || !uuidRegex.test(form.team_lead_id)) {
      alert("Team Lead ID must be a valid UUID!");
      return;
    }

    try {
      const res = await axios.post(
        "https://ceo-dashboard-8052.onrender.com/api/sales-team",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Sales team member created successfully!");
      console.log(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create member");
    }
  };

  const inputStyle =
    "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition";
  const labelStyle = "text-sm font-medium text-gray-700 mb-1";

  return (
    <div
      className={`${inter.className} min-h-screen bg-gray-100 flex items-center justify-center px-4`}
    >
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-10">
        {/* Heading */}
        <div className="text-center mb-12 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            Create Sales Team Member
          </h1>
          <p className="text-gray-500 text-sm">
            Add a new member to your sales organization
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* PERSONAL INFO */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Information
            </h3>
          </div>

          <div>
            <label className={labelStyle}>
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              name="employee_name"
              value={form.employee_name}
              onChange={handleChange}
              placeholder="e.g. Rohit Patil"
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. your@company.com"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Sales Executive"
              className={inputStyle}
            />
          </div>

          {/* TEAM & LOCATION */}
          <div className="md:col-span-2 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Team & Location
            </h3>
          </div>

          <div>
            <label className={labelStyle}>Team Name</label>
            <input
              name="team_name"
              value={form.team_name}
              onChange={handleChange}
              placeholder="e.g. West Zone Sales"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Region</label>
            <input
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Pune"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Category Specialization</label>
            <input
              name="category_specialization"
              value={form.category_specialization}
              onChange={handleChange}
              placeholder="e.g. Electronics / FMCG"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Hire Date</label>
            <input
              type="date"
              name="hire_date"
              value={form.hire_date}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* TARGETS */}
          <div className="md:col-span-2 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Targets & Compensation
            </h3>
          </div>

          <div>
            <label className={labelStyle}>Monthly Target</label>
            <input
              type="number"
              name="sales_target_monthly"
              value={form.sales_target_monthly}
              onChange={handleChange}
              placeholder="e.g. 500000"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Quarterly Target</label>
            <input
              type="number"
              name="sales_target_quarterly"
              value={form.sales_target_quarterly}
              onChange={handleChange}
              placeholder="e.g. 1500000"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Yearly Target</label>
            <input
              type="number"
              name="sales_target_yearly"
              value={form.sales_target_yearly}
              onChange={handleChange}
              placeholder="e.g. 6000000"
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Commission %</label>
            <div className="relative">
              <input
                type="number"
                name="commission_percentage"
                value={form.commission_percentage}
                onChange={handleChange}
                placeholder="e.g. 5"
                className={`${inputStyle} pr-10`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                %
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className="md:col-span-2 pt-4 flex items-center gap-4">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-5 w-5 accent-green-600"
            />
            <span className="text-sm font-medium text-gray-700">
              Active employee
            </span>
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2 flex justify-center pt-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl hover:-translate-y-0.5 transition text-white font-semibold px-14 py-3 rounded-2xl"
            >
              Save Sales Team Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
