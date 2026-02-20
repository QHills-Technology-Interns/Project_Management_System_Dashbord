"use client";

import { useEffect, useState } from "react";

const API_BASE = "https://ceo-dashboard-8052.onrender.com/api";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= FETCH MEMBERS ================= */
  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMembers(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* ================= ADD MEMBER ================= */
  const addMember = async () => {
    if (!name.trim()) return alert("Enter member name");

    setLoading(true);

    try {
      const [firstName, ...rest] = name.split(" ");
      const lastName = rest.join(" ") || "User";

      const payload = {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}${Date.now()}@test.com`,
        password: "Test@123",
      };

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      /* REAL TIME REFRESH */
      await fetchMembers();
      setName("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow">
        <h2 className="text-xl font-bold">Add Member</h2>

        <input
          placeholder="Member Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
        />

        <button
          onClick={addMember}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Add Member"}
        </button>

        <hr />

        <h3 className="font-semibold">Members</h3>
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.id} className="bg-slate-50 p-2 rounded">
              {m.firstName} {m.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
