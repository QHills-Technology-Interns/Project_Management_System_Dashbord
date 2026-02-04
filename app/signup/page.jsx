"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

import Image from "next/image";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [responseData, setResponseData] = useState(null); 
  const [error, setError] = useState(null);
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
const res = await fetch(
        "https://ceo-dashboard-z65r.onrender.com/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName,
    lastName,
    email,
    password,
  }),
});

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    alert('Signup successful');
    console.log(data);

  } catch (err) {
    console.error('Signup error:', err.message);
    alert('Signup failed');
  }
};


  return (
    <div className="signup-container">
      <div className="signup-card">
        
          <div className="logo-wrapper">
  <img src="/logo1-dashbord.png" alt="CEO Dashboard Logo" />
</div>
        <h2>Create your account</h2>
        <p className="subtitle">Get started with your free account today</p>

        <form onSubmit={handleSubmit} className="signup-form">
    <div className="name-fields">
  <div className="field">
    <label>First name</label>
    <input
      type="text"
      placeholder="John"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      required
    />
  </div>

  <div className="field">
    <label>Last name</label>
    <input
      type="text"
      placeholder="Doe"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      required
    />
  </div>
</div>

          <label>Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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

          <button type="submit">Create account</button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link href="/">Sign in</Link>
        </p>
      </div>

      {responseData && (
        <div className="response">
          <h2>Signup Successful!</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}

      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}
