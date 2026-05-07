"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, User, Lock, ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import { httpaxious } from "@/helper/httphelper";
import { toast } from "sonner";

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
const STEPS = [
  { id: 1, label: "Details", icon: User },
  { id: 2, label: "Security", icon: Lock },
];

interface FormData {
  firstName: string; lastName: string;
  email: string; employeeId: string; department: string;
  password: string; confirmPassword: string;
}

type FieldError = Partial<Record<keyof FormData, string>>;

function validate(data: FormData, step: number): FieldError {
  const errors: FieldError = {};
  if (step === 1) {
    if (!data.firstName.trim()) errors.firstName = "First name is required.";
    if (!data.lastName.trim()) errors.lastName = "Last name is required.";
    if (!data.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Invalid email.";
    if (!data.employeeId.trim()) errors.employeeId = "Employee ID is required.";
  }
  if (step === 2) {
    if (!data.password) errors.password = "Password is required.";
    else if (data.password.length < 6) errors.password = "Minimum 6 characters.";
    if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords don't match.";
  }
  return errors;
}

export default function AdminSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", employeeId: "", department: "",
    password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const next = () => {
    const errs = validate(form, step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    const errs = validate(form, 2);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await httpaxious.post("/api/admin/signup", {
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, employeeId: form.employeeId,
        department: form.department || undefined,
        password: form.password,
      });
      if (res.data.success) {
        setSuccess(true);
        toast.success("Admin account created!");
      } else {
        toast.error(res.data.message || "Signup failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center max-w-sm w-full animate-in fade-in duration-500">
          <div className="size-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="size-8 text-violet-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Account Created!</h2>
          <p className="text-gray-500 text-sm mb-6">Your admin account is ready. Sign in to access the dashboard.</p>
          <button onClick={() => router.push("/login")} className="w-full h-11 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/40 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-violet-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-6">
          <div className="size-14 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
            <Shield className="size-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Sign Up</h1>
          <p className="text-gray-500 text-sm">Create your administrator account</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > s.id ? "bg-violet-600 text-white" : step === s.id ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {step > s.id ? <CheckCircle2 className="size-4" /> : s.id}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step === s.id ? "text-violet-600" : "text-gray-400"}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${step > s.id ? "bg-violet-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-gray-100 p-6 space-y-4">
          {step === 1 && (
            <>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="size-4 text-violet-600" /> Admin Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">First Name *</label>
                  <input value={form.firstName} onChange={set("firstName")} placeholder="John" className={`w-full h-10 px-3 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${errors.firstName ? "border-red-300" : "border-gray-200"}`} />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Last Name *</label>
                  <input value={form.lastName} onChange={set("lastName")} placeholder="Doe" className={`w-full h-10 px-3 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${errors.lastName ? "border-red-300" : "border-gray-200"}`} />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Email *</label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="admin@university.edu" className={`w-full h-10 px-3 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${errors.email ? "border-red-300" : "border-gray-200"}`} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Employee ID *</label>
                <input value={form.employeeId} onChange={set("employeeId")} placeholder="e.g. ADM001" className={`w-full h-10 px-3 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${errors.employeeId ? "border-red-300" : "border-gray-200"}`} />
                {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Department (optional)</label>
                <select value={form.department} onChange={set("department")} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                  <option value="">All departments</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Lock className="size-4 text-violet-600" /> Set Password</h3>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min 6 characters" className={`w-full h-10 px-3 pr-10 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${errors.password ? "border-red-300" : "border-gray-200"}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Confirm Password *</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" className={`w-full h-10 px-3 pr-10 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${errors.confirmPassword ? "border-red-300" : "border-gray-200"}`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button onClick={back} className="flex-1 h-11 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                <ChevronLeft className="size-4" /> Back
              </button>
            )}
            {step < STEPS.length ? (
              <button onClick={next} className="flex-1 h-11 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 flex items-center justify-center gap-2 transition-colors">
                Next <ChevronRight className="size-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={loading} className="flex-1 h-11 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                {loading ? <><Loader2 className="size-4 animate-spin" /> Creating...</> : <><CheckCircle2 className="size-4" /> Create Account</>}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-violet-600 font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
