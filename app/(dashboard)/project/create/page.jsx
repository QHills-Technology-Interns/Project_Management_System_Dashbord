"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function CreateProject() {
  /* ---------------- PROJECT ---------------- */
  const [project, setProject] = useState({
    project_name: "",
    client_name: "",
    category: "",
    project_owner: "",
    total_budget: "",
    start_date: "",
    end_date: "",
    description: "",
  });
 const { project_id } = useParams();

  /* ---------------- USERS ---------------- */
  const [users, setUsers] = useState([]);

  /* ---------------- TEAM ---------------- */
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://ceo-dashboard-8052.onrender.com/api/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  fetchUsers();
}, []);


  /* ---------------- FETCH USERS ---------------- */
 useEffect(() => {
  if (!project_id) return;

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://ceo-dashboard-8052.onrender.com/api/projects/team-members/${project_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

     const mappedMembers = res.data.data.map((tm) => ({
  user_id: tm.user_id, // ✅ keep UUID string
  role: tm.user?.role || "Developer",
  rate: 0,
  allocation: tm.allocation ?? 100,
}));


      setTeamMembers(mappedMembers);
    } catch (err) {
      console.error("Failed to fetch team members");
    }
  };

  fetchTeamMembers();
}, [project_id]);

  /* ---------------- HANDLERS ---------------- */
  const handleProjectChange = (e) =>
    setProject({ ...project, [e.target.name]: e.target.value });

  const addMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        user_id: "",
        role: "Developer",
        rate: 0,
        allocation: 100,
      },
    ]);
  };

  const updateMember = (i, field, value) => {
    const updated = [...teamMembers];
    updated[i][field] = value;
    setTeamMembers(updated);
  };

  const removeMember = (i) =>
    setTeamMembers(teamMembers.filter((_, index) => index !== i));

const handleUserSelect = (index, userId) => {
  const updated = [...teamMembers];
  updated[index].user_id = userId; // ✅ keep string
  setTeamMembers(updated);
};

  const selectedUserIds = teamMembers
    .map((m) => m.user_id)
    .filter(Boolean);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://ceo-dashboard-8052.onrender.com/api/projects",
        {
          project_name: project.project_name,
          client_name: project.client_name,
          project_owner: project.project_owner,
          category: project.category,
          start_date: project.start_date,
          end_date: project.end_date,
          description: project.description,
          total_budget: Number(project.total_budget),
          team_members: teamMembers.map((m) => ({
            user_id: m.user_id,
            allocation: m.allocation,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Project created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create project");
    }
  };
  console.log("Users:", users);
console.log("Members:", teamMembers);
console.log("project_id:", project_id);

  /* ---------------- UI STYLES ---------------- */
  const input =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm h-10";
  const label =
    "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-2xl font-bold">New Project</h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ================= BASIC INFO ================= */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-semibold mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Project Name *</label>
                <input
                  className={input}
                  name="project_name"
                  required
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Project Owner *</label>
                <input
                  className={input}
                  name="project_owner"
                  required
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Client Name *</label>
                <input
                  className={input}
                  name="client_name"
                  required
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Category</label>
                <input
                  className={input}
                  name="category"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Total Budget</label>
                <input
                  type="number"
                  className={input}
                  name="total_budget"
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>Start Date</label>
                <input
                  type="date"
                  className={input}
                  name="start_date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className={label}>End Date</label>
                <input
                  type="date"
                  className={input}
                  name="end_date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleProjectChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className={label}>Description</label>
                <textarea
                  rows={3}
                  className={input}
                  name="description"
                  onChange={handleProjectChange}
                />
              </div>
            </div>
          </div>

          {/* ================= TEAM MEMBERS ================= */}
         <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-semibold">
                Team Members
              </h2>

              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
              >
                <Plus size={16} /> Add Member
              </button>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl px-5 py-4"
                >
                  <div className="flex items-end gap-5 flex-nowrap">
                    <div className="flex flex-col w-48">
                      <label className="text-xs text-gray-600 mb-1">
                        Member
                      </label>
                      <select
                        className="h-10 rounded-lg border px-3 text-sm"
                        value={member.user_id || ""}
                        onChange={(e) =>
                          handleUserSelect(
                            index,
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Member</option>
                        {users
                          .filter(
                            (user) =>
                              !selectedUserIds.includes(
                                user.id
                              ) ||
                              user.id === member.user_id
                          )
                          .map((user) => (
                            <option
                              key={user.id}
                              value={user.id}
                            >
                              {user.firstName}{" "}
                              {user.lastName}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-40">
                      <label className="text-xs text-gray-600 mb-1">
                        Role
                      </label>
                      <input
                        className="h-10 rounded-lg border px-3 text-sm"
                        value={member.role}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "role",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-col w-32">
                      <label className="text-xs text-gray-600 mb-1">
                        Rate ($)
                      </label>
                      <input
                        type="number"
                        className="h-10 rounded-lg border px-3 text-sm"
                        value={member.rate}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "rate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-col w-36">
                      <label className="text-xs text-gray-600 mb-1">
                        Allocation %
                      </label>
                      <input
                        type="number"
                        className="h-10 rounded-lg border px-3 text-sm"
                        value={member.allocation}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "allocation",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center h-10 mt-5">
                      <button
                        type="button"
                        onClick={() =>
                          removeMember(index)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= ACTION ================= */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-10 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Create Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
