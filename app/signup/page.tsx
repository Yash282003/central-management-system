"use client";
import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  GraduationCap,
  User,
  Phone,
  Mail,
  Lock,
  Calendar,
  ImageIcon,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
} from "lucide-react";

import { Signupstudent } from "@/services/student/signup";

/* ─────────────────────────── types ─────────────────────────── */
interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  registrationNumber: string;
  branch: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob: string;
  profileImage: string;
  address: string;
}

type FieldError = Partial<Record<keyof FormData, string>>;

const BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Academic", icon: GraduationCap },
  { id: 3, label: "Contact", icon: Phone },
  { id: 4, label: "Security", icon: Lock },
  { id: 5, label: "Profile", icon: ImageIcon },
];

/* ─────────────────────────── helpers ───────────────────────── */
function validate(data: FormData, step: number): FieldError {
  const errors: FieldError = {};

  if (step === 1) {
    if (!data.firstName.trim()) errors.firstName = "First name is required.";
    if (!data.lastName.trim()) errors.lastName = "Last name is required.";
    if (!data.dob) errors.dob = "Date of birth is required.";
  }

  if (step === 2) {
    if (!data.registrationNumber.trim())
      errors.registrationNumber = "Registration number is required.";
    if (!data.branch) errors.branch = "Please select a branch.";
  }

  if (step === 3) {
    if (!data.mobile.trim()) errors.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(data.mobile))
      errors.mobile = "Enter a valid 10-digit mobile number.";
    if (!data.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = "Enter a valid email address.";
  }

  if (step === 4) {
    if (!data.password) errors.password = "Password is required.";
    else if (data.password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (!data.confirmPassword)
      errors.confirmPassword = "Please confirm your password.";
    else if (data.password !== data.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
  }

  if (step === 5) {
    if (!data.address.trim()) errors.address = "Address is required.";
  }

  return errors;
}

/* ─────────────────────────── sub-components ────────────────── */
function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required,
  suffix,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ElementType;
  required?: boolean;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 ${Icon ? "pl-10" : "px-4"} ${suffix ? "pr-11" : "px-4"} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 text-sm transition-all ${
            error
              ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
              : "border-gray-200"
          }`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
          <AlertCircle className="size-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────── main component ────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [form, setForm] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    registrationNumber: "",
    branch: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    profileImage: "",
    address: "",
  });
  const [submitError, setSubmitError] = useState("");

  const set = (key: keyof FormData) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    set("profileImage")(file.name);
  };

  const next = () => {
    const errs = validate(form, step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate(form, step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: {
          first: form.firstName,
          middle: form.middleName,
          last: form.lastName,
        },
        regdNo: form.registrationNumber,
        branch: form.branch,
        mobile: form.mobile,
        email: form.email,
        password: form.password,
        dob: form.dob,
        profileUrl: form.profileImage || undefined,
        address: form.address,
      };
      const result = await Signupstudent(payload);
      if (result?.success === false || result?.message) {
        setSubmitError(result.message || "Signup failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Network error. Please try again.";
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── success screen ── */
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
        <BgBlobs />
        <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-500 text-sm mb-1">
            Welcome,{" "}
            <span className="font-semibold text-gray-700">
              {form.firstName} {form.lastName}
            </span>
            .
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Your account has been created. You can now sign in.
          </p>
          <button
            id="signup-go-login"
            onClick={() => router.push("/login")}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all active:scale-[0.98]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col items-center justify-center p-4 py-10">
      <BgBlobs />

      {/* ── Header ── */}
      <div className="relative text-center mb-7">
        <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <span className="text-white font-bold text-lg">DMS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Student Registration
        </h1>
        <p className="text-gray-500 text-sm">
          Create your Department Management System account
        </p>
      </div>

      {/* ── Card ── */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-gray-100 overflow-hidden">
        {/* Step indicator */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`size-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        done
                          ? "bg-blue-600 text-white"
                          : active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Icon className="size-4" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-semibold hidden sm:block ${
                        active ? "text-blue-600" : done ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 transition-all duration-300 ${
                        step > s.id ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Step 1 – Personal */}
          {step === 1 && (
            <>
              <SectionTitle>Personal Information</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="firstName"
                  label="First Name"
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="John"
                  icon={User}
                  error={errors.firstName}
                  required
                />
                <InputField
                  id="middleName"
                  label="Middle Name"
                  value={form.middleName}
                  onChange={set("middleName")}
                  placeholder="(optional)"
                />
              </div>
              <InputField
                id="lastName"
                label="Last Name"
                value={form.lastName}
                onChange={set("lastName")}
                placeholder="Doe"
                icon={User}
                error={errors.lastName}
                required
              />
              <InputField
                id="dob"
                label="Date of Birth"
                type="date"
                value={form.dob}
                onChange={set("dob")}
                icon={Calendar}
                error={errors.dob}
                required
              />
            </>
          )}

          {/* Step 2 – Academic */}
          {step === 2 && (
            <>
              <SectionTitle>Academic Information</SectionTitle>
              <InputField
                id="registrationNumber"
                label="Registration Number"
                value={form.registrationNumber}
                onChange={set("registrationNumber")}
                placeholder="e.g. CS2021001"
                icon={GraduationCap}
                error={errors.registrationNumber}
                required
              />
              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  id="branch"
                  value={form.branch}
                  onChange={(e) => set("branch")(e.target.value)}
                  className={`w-full h-11 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 text-sm transition-all appearance-none cursor-pointer ${
                    errors.branch
                      ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Select your branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="size-3 shrink-0" />
                    {errors.branch}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your CGPA is set by your teacher once grades are published.
                You don&apos;t need to enter it here.
              </p>
            </>
          )}

          {/* Step 3 – Contact */}
          {step === 3 && (
            <>
              <SectionTitle>Contact Information</SectionTitle>
              <InputField
                id="mobile"
                label="Mobile Number"
                type="tel"
                value={form.mobile}
                onChange={set("mobile")}
                placeholder="10-digit number"
                icon={Phone}
                error={errors.mobile}
                required
              />
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="john@example.com"
                icon={Mail}
                error={errors.email}
                required
              />
            </>
          )}

          {/* Step 4 – Security */}
          {step === 4 && (
            <>
              <SectionTitle>Set Password</SectionTitle>
              <InputField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder="Min. 6 characters"
                icon={Lock}
                error={errors.password}
                required
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />
              <InputField
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                placeholder="Re-enter password"
                icon={Lock}
                error={errors.confirmPassword}
                required
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />
              {/* Password strength hint */}
              {form.password && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">
                    Password strength:{" "}
                    <span
                      className={
                        form.password.length >= 10
                          ? "text-green-600"
                          : form.password.length >= 6
                          ? "text-yellow-600"
                          : "text-red-500"
                      }
                    >
                      {form.password.length >= 10
                        ? "Strong"
                        : form.password.length >= 6
                        ? "Medium"
                        : "Weak"}
                    </span>
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          form.password.length >= i * 4
                            ? i === 1
                              ? "bg-red-400"
                              : i === 2
                              ? "bg-yellow-400"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 5 – Profile */}
          {step === 5 && (
            <>
              <SectionTitle>Profile & Address</SectionTitle>

              {/* Profile image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Profile Image{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="size-16 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <User className="size-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 h-9 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm text-gray-600 font-medium transition-all"
                    >
                      <Upload className="size-4" />
                      Upload Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      id="profileImageFile"
                    />
                    <p className="text-xs text-gray-400">
                      JPG, PNG or GIF · Max 5 MB
                    </p>
                  </div>
                </div>
                {/* OR image URL */}
                <div className="mt-3">
                  <InputField
                    id="profileImageUrl"
                    label="Or paste image URL"
                    value={form.profileImage}
                    onChange={(v) => {
                      set("profileImage")(v);
                      setPreviewUrl(v);
                    }}
                    placeholder="https://example.com/photo.jpg"
                    icon={ImageIcon}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 size-4 text-gray-400 pointer-events-none" />
                  <textarea
                    id="address"
                    value={form.address}
                    onChange={(e) => set("address")(e.target.value)}
                    placeholder="Enter your full address..."
                    rows={3}
                    className={`w-full pl-10 pr-4 pt-2.5 pb-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 text-sm transition-all resize-none ${
                      errors.address
                        ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="size-3 shrink-0" />
                    {errors.address}
                  </p>
                )}
              </div>
            </>
          )}

          {submitError && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                id="signup-back"
                className="flex items-center gap-1.5 flex-1 h-11 justify-center border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
            )}
            {step < STEPS.length ? (
              <button
                type="button"
                onClick={next}
                id="signup-next"
                className="flex items-center gap-1.5 flex-1 h-11 justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] shadow-md shadow-blue-200"
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                id="signup-submit"
                disabled={loading}
                className="flex items-center gap-2 flex-1 h-11 justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] shadow-md shadow-blue-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Footer link */}
      <p className="relative text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <button
          id="signup-go-to-login"
          onClick={() => router.push("/login")}
          className="text-blue-600 hover:underline font-semibold"
        >
          Sign in
        </button>
      </p>

      <p className="relative text-center text-xs text-gray-400 mt-4">
        © 2026 University Department Management System
      </p>
    </div>
  );
}

/* ─────────────────────────── tiny helpers ───────────────────── */
function BgBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
      {children}
    </p>
  );
}
