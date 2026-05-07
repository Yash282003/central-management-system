"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, BookOpen, Shield } from "lucide-react";
import { Loginstudent } from "@/services/student/login";
import { Loginteacher } from "@/services/teacher/login";
import { Loginadmin } from "@/services/admin/login";
import { toast } from "sonner";

type Role = "student" | "teacher" | "admin";

const roleConfig = {
  student: {
    icon: <GraduationCap className="size-6" />,
    label: "Student",
    description: "Access your grades, attendance & courses",
    idLabel: "Registration No.",
    placeholder: { id: "e.g. CS2021001", password: "••••••••" },
    redirect: "/dept/student/dashboard",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    activeBg: "bg-blue-600",
    ring: "focus:ring-blue-500/20 focus:border-blue-500",
  },
  teacher: {
    icon: <BookOpen className="size-6" />,
    label: "Teacher",
    description: "Manage students, notices & courses",
    idLabel: "Email Address",
    placeholder: { id: "teacher@university.edu", password: "••••••••" },
    redirect: "/dept/teacher/dashboard",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBg: "bg-emerald-600",
    ring: "focus:ring-emerald-500/20 focus:border-emerald-500",
  },
  admin: {
    icon: <Shield className="size-6" />,
    label: "Admin",
    description: "Full department management access",
    idLabel: "Email Address",
    placeholder: { id: "admin@university.edu", password: "••••••••" },
    redirect: "/dept/admin/dashboard",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    activeBg: "bg-violet-600",
    ring: "focus:ring-violet-500/20 focus:border-violet-500",
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !password.trim()) {
      setError("Please enter your credentials.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let res;

      if (role === "student") {
        res = await Loginstudent({ regdNo: id, password });
      } else if (role === "teacher") {
        res = await Loginteacher({ email: id, password });
      } else {
        res = await Loginadmin({ email: id, password });
      }

      if (res?.success) {
        toast.success(`Welcome back!`);
        router.push(config.redirect);
      } else {
        setError(res?.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-lg">DMS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Department Management</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-gray-100 overflow-hidden">
          <div className="p-6 pb-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Role</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const cfg = roleConfig[r];
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setError(""); setId(""); }}
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

            <div className={`mt-3 p-3 rounded-xl ${config.bg} ${config.border} border`}>
              <p className={`text-xs ${config.color} font-medium`}>{config.description}</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-6 pt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {config.idLabel}
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder={config.placeholder.id}
                className={`w-full h-11 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-sm transition-all ${config.ring}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full h-11 px-4 pr-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-sm transition-all ${config.ring}`}
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

            <button
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

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href={role === "student" ? "/signup" : `/signup/${role}`}
                className={`font-semibold ${config.color} hover:underline`}
              >
                Sign up
              </a>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 University Department Management System
        </p>
      </div>
    </div>
  );
}
