"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";

export default function SalesTeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("/sales-team")
      .then(res => {
        if (res.success) {
          setMembers(res.data);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Sales Team</h1>
        <Link
          href="/sales-team/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Member
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.employee_name}</td>
              <td>{m.email}</td>
              <td>{m.role}</td>
              <td>{m.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
