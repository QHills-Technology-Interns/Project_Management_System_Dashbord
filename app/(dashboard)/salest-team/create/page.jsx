"use client";

import { useState } from "react";
import axios from "axios";

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
     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  
  // UUID validation regex
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

    // Validation
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
        { headers: { 
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" } }
      );
      alert("Sales team member created successfully!");
      console.log(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create member");
    }
  };


  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";
  const labelStyle = "text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Sales Team Member
          </h1>
          <p className="text-gray-500 mt-2">
            Add a new member to your sales organization
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Employee Name */}
          <div>
            <label className={labelStyle}>
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              name="employee_name"
              value={form.employee_name}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelStyle}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Role */}
          <div>
            <label className={labelStyle}>Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Team Name */}
          <div>
            <label className={labelStyle}>Team Name</label>
            <input
              name="team_name"
              value={form.team_name}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Team Lead ID */}
          {/* <div>
            <label className={labelStyle}>Team Lead ID</label>
            <input
              name="team_lead_id"
              value={form.team_lead_id}
              onChange={handleChange}
              className={inputStyle}
            />
          </div> */}

          {/* Region */}
          <div>
            <label className={labelStyle}>Region</label>
            <input
              name="region"
              value={form.region}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* City */}
          <div>
            <label className={labelStyle}>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Category Specialization */}
          <div>
            <label className={labelStyle}>Category Specialization</label>
            <input
              name="category_specialization"
              value={form.category_specialization}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Hire Date */}
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

          {/* Monthly Target */}
          <div>
            <label className={labelStyle}>Monthly Target</label>
            <input
              type="number"
              name="sales_target_monthly"
              value={form.sales_target_monthly}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Quarterly Target */}
          <div>
            <label className={labelStyle}>Quarterly Target</label>
            <input
              type="number"
              name="sales_target_quarterly"
              value={form.sales_target_quarterly}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Yearly Target */}
          <div>
            <label className={labelStyle}>Yearly Target</label>
            <input
              type="number"
              name="sales_target_yearly"
              value={form.sales_target_yearly}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Commission % */}
          <div>
            <label className={labelStyle}>Commission %</label>
            <input
              type="number"
              name="commission_percentage"
              value={form.commission_percentage}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-green-600"
            />
            <span className="text-sm text-gray-700">Active employee</span>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Save Sales Team Member
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
