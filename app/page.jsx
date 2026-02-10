"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f7fb] to-[#eef2f7]">
      <div className="w-[380px] bg-white px-[22px] py-[18px] rounded-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.08)]">

        {/* LOGO */}
        <div className="flex justify-center mb-7">
          <img
            src="/logo1-dashbord.png"
            alt="CEO Dashboard Logo"
            className="h-[90px] w-auto"
          />
        </div>

        <h1 className="text-center text-[22px] font-semibold mb-1">
          Welcome back
        </h1>

        <p className="text-center text-[13px] text-gray-500 mb-6">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleLogin}>
          {/* EMAIL */}
          <label className="block text-[13px] font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-[42px] px-3 mb-[14px] rounded-lg border border-gray-300 bg-gray-50 text-[14px]
              focus:outline-none focus:border-blue-500 focus:bg-white"
          />

          {/* PASSWORD */}
          <label className="block text-[13px] font-medium mb-1">
            Password
          </label>

          <div className="flex items-center h-[42px] px-3 mb-[14px] rounded-lg border border-gray-300 bg-gray-50
            focus-within:border-blue-500 focus-within:bg-white">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 h-full bg-transparent text-[14px] outline-none border-none"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="w-5 h-5 flex items-center justify-center cursor-pointer text-gray-500"
            >
              <Eye size={18} />
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full mt-4 bg-emerald-500 text-white py-[11px] rounded-lg font-semibold text-[14px]
              hover:bg-emerald-600 transition"
          >
            Sign in
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <p className="text-center text-[13px] text-gray-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-emerald-500 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
