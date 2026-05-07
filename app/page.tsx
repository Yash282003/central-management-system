"use client"
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
      </div>
      <div className="relative text-center mb-12">
        <div className="size-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
          <span className="text-white font-bold text-xl">DMS</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Department Management System</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          A modern, clean SaaS platform for managing academic departments — built for students, teachers, and admins.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        {[
          {
            icon: <GraduationCap className="size-8 text-blue-600" />,
            label: "Student Portal",
            description: "View grades, attendance, notices, and tests",
            bg: "bg-blue-50",
            border: "border-blue-100",
            href: "/dept/student/dashboard",
            btnColor: "bg-blue-600 hover:bg-blue-700",
          },
          {
            icon: <BookOpen className="size-8 text-green-600" />,
            label: "Teacher Portal",
            description: "Manage students, post notices, and create tests",
            bg: "bg-green-50",
            border: "border-green-100",
            href: "/dept/teacher/dashboard",
            btnColor: "bg-green-600 hover:bg-green-700",
          },
          {
            icon: <Shield className="size-8 text-purple-600" />,
            label: "Admin Portal",
            description: "Full department management & oversight",
            bg: "bg-purple-50",
            border: "border-purple-100",
            href: "/dept/admin/dashboard",
            btnColor: "bg-purple-600 hover:bg-purple-700",
          },
        ].map(item => (
          <div
            key={item.label}
            className={`${item.bg} ${item.border} border rounded-2xl p-6 flex flex-col hover:shadow-lg transition-all duration-200 cursor-pointer group`}
            onClick={() => router.push(item.href)}
          >
            <div className="mb-4">{item.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.label}</h2>
            <p className="text-sm text-gray-500 mb-6 flex-1">{item.description}</p>
            <button
              className={`flex items-center justify-center gap-2 h-10 rounded-xl ${item.btnColor} text-white text-sm font-medium transition-colors`}
            >
              Enter Portal <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      <p className="relative text-center text-xs text-gray-400 mt-10">
        Or <button className="text-blue-600 hover:underline font-medium" onClick={() => router.push("/login")}>sign in with your credentials</button>
      </p>
    </div>
  );
}
