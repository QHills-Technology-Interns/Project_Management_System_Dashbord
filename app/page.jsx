"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

/* ---------------- FONT CONFIG ---------------- */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://ceo-dashboard-8052.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server not reachable");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center
                  bg-gradient-to-br from-[#f4f7fb] to-[#eef2f7]">

    <div className="w-[380px] bg-white px-6 py-6 rounded-2xl
                    shadow-[0_20px_40px_rgba(0,0,0,0.08)]">

      {/* LOGO */}
      <div className="flex justify-center mb-6">
        <img
          src="/logo1-dashbord.png"
          alt="CEO Dashboard Logo"
          className="h-18 w-auto"
        />
      </div>

      <h1 className="text-center text-[22px] font-semibold text-slate-800 mb-1">
        Welcome back
      </h1>

      <p className="text-center text-[14px] text-gray-500 mb-6">
        Sign in to your account to continue
      </p>

      <form onSubmit={handleLogin}>

        {/* EMAIL */}
        <label className="block text-[13px] font-medium text-slate-700 mb-1">
          Email
        </label>

        <div className="flex items-center h-[44px] px-3 mb-4 rounded-xl
                        bg-gray-50 border border-gray-200
                        focus-within:border-emerald-500 focus-within:bg-white">

          <span className="text-gray-400 mr-2">
            {/* mail icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </span>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center justify-between mb-1">
          <label className="text-[13px] font-medium text-slate-700">
            Password
          </label>

          {/*<span className="text-[13px] text-emerald-500 cursor-pointer">
            Forgot password?
          </span>*/}
        </div>

        <div className="flex items-center h-[44px] px-3 mb-5 rounded-xl
                        bg-gray-50 border border-gray-200
                        focus-within:border-emerald-500 focus-within:bg-white">

          <span className="text-gray-400 mr-2">
            {/* lock icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </span>

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="flex-1 bg-transparent text-[14px] outline-none"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <Eye size={18} />
          </span>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-[12px] rounded-xl text-[15px] font-semibold text-white
                     bg-emerald-500 hover:bg-emerald-600
                     shadow-[0_10px_25px_rgba(16,185,129,0.35)]
                     transition"
        >
          Sign in
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <p className="text-center text-[14px] text-gray-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-emerald-500 font-medium">
          Create one
        </Link>
      </p>
    </div>
  </div>
);
}