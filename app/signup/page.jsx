"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Trash2,
  UserPlus,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

const API_BASE = "https://ceo-dashboard-8052.onrender.com/api";
const ITEMS_PER_PAGE = 4;

export default function AddMemberPage() {
  /* ================= STATES ================= */
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= NEW MEMBER (SIGNUP) ================= */
  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    allocation_percentage: "",
    rate_per_hour: "",
  });

  /* ================= TOKEN ================= */
  const getToken = () => localStorage.getItem("token");

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    axios
      .get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setProjects(res.data.data || []))
      .catch(console.error);
  }, []);

  /* ================= FETCH MEMBERS ================= */
  useEffect(() => {
    if (!selectedProject) return;

    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const res = await axios.get(
          `${API_BASE}/projects/team-members/${selectedProject}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        setTeamMembers(res.data.data || []);
      } catch {
        setTeamMembers([]);
      } finally {
        setLoadingMembers(false);
        setCurrentPage(1);
      }
    };

    fetchMembers();
  }, [selectedProject]);

  /* ================= SEARCH ================= */
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) =>
      `${m.firstName || ""} ${m.lastName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      m.member_role?.toLowerCase().includes(search.toLowerCase())
    );
  }, [teamMembers, search]);

  /* ================= PAGINATION ================= */
  const totalPages =
    Math.ceil(filteredMembers.length / ITEMS_PER_PAGE) || 1;

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= ADD MEMBER (SIGNUP + MAP) ================= */
  const handleAddMember = async () => {
    if (!selectedProject) return alert("Select project first");

    try {
      setSaving(true);

      /* 1️⃣ SIGNUP USER */
      const signupRes = await fetch(
        `${API_BASE}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: newMember.firstName,
            lastName: newMember.lastName,
            email: newMember.email,
            role: newMember.role,
            password: newMember.password,
          }),
        }
      );

      const signupData = await signupRes.json();
      if (!signupData.success)
        throw new Error("Signup failed");

      const userId = signupData.data.id;

      /* 2️⃣ ADD AS PROJECT MEMBER */
      await axios.post(
        `${API_BASE}/projects/team-members`,
        {
          project_id: selectedProject,
          user_id: userId,
          member_role: newMember.role,
          allocation_percentage: Number(
            newMember.allocation_percentage
          ),
          rate_per_hour: Number(newMember.rate_per_hour),
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      /* 3️⃣ REFRESH MEMBERS */
      const refresh = await axios.get(
        `${API_BASE}/projects/team-members/${selectedProject}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setTeamMembers(refresh.data.data || []);
      setShowModal(false);

      setNewMember({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
        allocation_percentage: "",
        rate_per_hour: "",
      });
    } catch (err) {
      alert(err.message || "Error adding member");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    await axios.delete(
      `${API_BASE}/projects/team-members/${id}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    setTeamMembers((p) => p.filter((m) => m.id !== id));
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold flex gap-2 items-center">
          <Users /> Project Team Members
        </h1>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.project_id} value={p.project_id}>
              {p.project_name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <UserPlus size={16} /> Add Member
        </button>

        {/* TABLE */}
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-3">Name</th>
              <th>Role</th>
              <th>Allocation</th>
              <th>Rate</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">
                  {m.firstName} {m.lastName}
                </td>
                <td>{m.member_role}</td>
                <td>{m.allocation_percentage}%</td>
                <td>₹{m.rate_per_hour}</td>
                <td>
                  <Trash2
                    onClick={() => handleDelete(m.id)}
                    className="text-red-500 cursor-pointer"
                    size={16}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Add Member</h2>
              <X onClick={() => setShowModal(false)} />
            </div>

            {["firstName","lastName","email","role","password","allocation_percentage","rate_per_hour"].map((f) => (
              <input
                key={f}
                placeholder={f.replace("_"," ")}
                type={f === "password" ? "password" : "text"}
                value={newMember[f]}
                onChange={(e) =>
                  setNewMember({ ...newMember, [f]: e.target.value })
                }
                className="w-full border rounded p-2"
              />
            ))}

            <button
              onClick={handleAddMember}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              {saving ? "Saving..." : "Add Member"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
