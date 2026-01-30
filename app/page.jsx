"use client";

import { useState } from "react";
import Link from "next/link";
import './login.css'
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://ceo-dashboard-z65r.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      alert("Login successful!");
       

      // ✅ REDIRECT TO DASHBOARD
      router.push("/dashboard");
      console.log("User:", data.user);

    } catch (err) {
      console.error(err);
      setError("Server not reachable");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo">⚡ Acme</div>

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

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign in</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p className="footer">
          Don&apos;t have an account? <Link href="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
