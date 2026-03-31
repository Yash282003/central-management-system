"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, BookOpen, Shield } from "lucide-react";

type Role = "student" | "teacher" | "admin";

const roleConfig = {
  student: {
    icon: <GraduationCap className="size-6" />,
    label: "Student",
    description: "Access your grades, attendance & courses",
    placeholder: { id: "e.g. CS2021001", password: "student123" },
    redirect: "/dept/student/dashboard",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    activeBg: "bg-blue-600",
  },
  teacher: {
    icon: <BookOpen className="size-6" />,
    label: "Teacher",
    description: "Manage students, notices & courses",
    placeholder: { id: "e.g. TCH001", password: "teacher123" },
    redirect: "/dept/teacher/dashboard",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    activeBg: "bg-green-600",
  },
  admin: {
    icon: <Shield className="size-6" />,
    label: "Admin",
    description: "Full department management access",
    placeholder: { id: "e.g. ADM001", password: "admin123" },
    redirect: "/dept/admin/dashboard",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    activeBg: "bg-purple-600",
  },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const config = roleConfig[role];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !password.trim()) {
      setError("Please enter your ID and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(config.redirect);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-lg">DMS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Department Management</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-gray-100 overflow-hidden">
          {/* Role Selector */}
          <div className="p-6 pb-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Role</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(roleConfig) as Role[]).map(r => {
                const cfg = roleConfig[r];
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setError(""); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      isActive
                        ? `${cfg.border} ${cfg.bg} ${cfg.color}`
                        : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={isActive ? cfg.color : "text-gray-400"}>{cfg.icon}</div>
                    <span className="text-xs font-semibold">{cfg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Role description */}
            <div className={`mt-3 p-3 rounded-xl ${config.bg} ${config.border} border`}>
              <p className={`text-xs ${config.color} font-medium`}>{config.description}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 pt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {config.label} ID
              </label>
              <input
                id="login-id"
                type="text"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder={config.placeholder.id}
                className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 pr-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <button type="button" className="text-blue-600 hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className={`w-full h-11 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"
              } ${config.activeBg}`}
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign in as ${config.label}`
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 University Department Management System
        </p>
      </div>
    </div>
  );
}
