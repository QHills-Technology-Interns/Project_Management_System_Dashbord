"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // ✅ NEW
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://ceo-dashboard-z65r.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            role, // ✅ SEND ROLE TO BACKEND
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role); // optional
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server not reachable");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* LOGO */}
        <div className="logo-wrapper">
          <img src="/logo1-dashbord.png" alt="CEO Dashboard Logo" />
        </div>

        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* ✅ ROLE SELECT */}
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="ceo">CEO</option>
          </select>

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Eye size={18} color="#000" />
            </span>
          </div>

          <button type="submit">Sign in</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="footer">
          Don&apos;t have an account? <Link href="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
