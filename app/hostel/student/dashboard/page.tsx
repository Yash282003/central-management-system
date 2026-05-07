"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Bell,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle2,
  BedDouble,
  Users,
  Utensils,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface RoomInfo {
  roomNo: string;
  block: string;
  type: string;
  capacity: number;
  occupants: string[];
}
interface Notification {
  title: string;
  message: string;
  priority: string;
  sentBy: string;
  createdAt: string;
}
interface Complaint {
  _id: string;
  category: string;
  status: string;
  createdAt: string;
}
interface Application {
  _id: string;
  roomType: string;
  status: string;
  createdAt: string;
}
interface StudentMe {
  name?: string;
  regd?: string;
  hostel?: string;
  room?: string;
}

function useCounter(target: number, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) {
      setVal(0);
      return;
    }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

type TimeOfDay = "morning" | "afternoon" | "evening";
function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
function greetingFor(t: TimeOfDay) {
  return t === "morning"
    ? "Good morning"
    : t === "afternoon"
    ? "Good afternoon"
    : "Good evening";
}

const timeGradient: Record<TimeOfDay, string> = {
  morning:
    "radial-gradient(1200px 600px at 10% -10%, #fde68a 0%, transparent 60%), radial-gradient(900px 500px at 90% 0%, #fecdd3 0%, transparent 55%), linear-gradient(180deg, #fff7ed 0%, #ecfccb 100%)",
  afternoon:
    "radial-gradient(1200px 600px at 0% -10%, #bae6fd 0%, transparent 60%), radial-gradient(900px 600px at 100% 10%, #a7f3d0 0%, transparent 55%), linear-gradient(180deg, #ecfeff 0%, #f0fdf4 100%)",
  evening:
    "radial-gradient(1200px 700px at 100% -10%, #c4b5fd 0%, transparent 60%), radial-gradient(900px 600px at 0% 0%, #fbcfe8 0%, transparent 55%), linear-gradient(180deg, #f5f3ff 0%, #ecfdf5 100%)",
};

interface GlassStatProps {
  label: string;
  numeric: number;
  icon: React.ReactNode;
  caption?: string;
  delay: number;
}
function GlassStat({ label, numeric, icon, caption, delay }: GlassStatProps) {
  const counted = useCounter(numeric);
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.62)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 30px -12px rgba(20,83,45,0.18)",
        animation: "fadeSlideUp 0.6s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-900/60 font-semibold">
            {label}
          </p>
          <p
            className="mt-3 text-4xl font-semibold tracking-tight text-emerald-950"
            style={{
              fontFamily: "'Bricolage Grotesque', 'DM Serif Display', serif",
            }}
          >
            {counted}
          </p>
          {caption && <p className="mt-1 text-xs text-emerald-900/60">{caption}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700/10 text-emerald-800">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Skel({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-white/40 ${className}`}
      style={{ backdropFilter: "blur(8px)" }}
    />
  );
}

export default function HostelStudentDashboard() {
  const router = useRouter();
  const [me, setMe] = useState<StudentMe | null>(null);
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const tod = useMemo<TimeOfDay>(() => getTimeOfDay(), []);

  useEffect(() => {
    const run = async () => {
      try {
        const [meRes, roomRes, notifRes, compRes, appRes] =
          await Promise.allSettled([
            fetch("/api/student/hostel").then((r) => r.json()),
            fetch("/api/hostel/student/room").then((r) => r.json()),
            fetch("/api/hostel/student/notifications").then((r) => r.json()),
            fetch("/api/hostel/student/complaints").then((r) => r.json()),
            fetch("/api/hostel/student/applications").then((r) => r.json()),
          ]);
        if (meRes.status === "fulfilled") setMe(meRes.value ?? null);
        if (roomRes.status === "fulfilled")
          setRoom(roomRes.value.data ?? roomRes.value ?? null);
        if (notifRes.status === "fulfilled")
          setNotifications(
            Array.isArray(notifRes.value.data) ? notifRes.value.data : []
          );
        if (compRes.status === "fulfilled")
          setComplaints(
            Array.isArray(compRes.value.data) ? compRes.value.data : []
          );
        if (appRes.status === "fulfilled")
          setApplications(
            Array.isArray(appRes.value.data) ? appRes.value.data : []
          );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const activeComplaints = complaints.filter((c) => c.status !== "resolved").length;
  const pendingApplications = applications.filter((a) => a.status === "pending").length;
  const recentNotifications = notifications.slice(0, 3);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const priorityChip = (p: string) =>
    p === "urgent"
      ? "bg-rose-100/80 text-rose-700 border-rose-200/60"
      : p === "important"
      ? "bg-amber-100/80 text-amber-800 border-amber-200/60"
      : "bg-emerald-100/80 text-emerald-800 border-emerald-200/60";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@500;600;700&family=DM+Serif+Display&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ambientShift {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(0,-12px,0) scale(1.02); }
        }
        .hostel-root { font-family: 'Nunito', sans-serif; }
        .hostel-display { font-family: 'Bricolage Grotesque', 'DM Serif Display', serif; letter-spacing: -0.02em; }
      `}</style>

      <div className="hostel-root relative min-h-screen overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -my-4">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: timeGradient[tod],
            animation: "ambientShift 16s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto p-8 space-y-6">
          {/* Header */}
          <div style={{ animation: "fadeSlideUp 0.5s ease both" }}>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800/70">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span className="uppercase tracking-[0.14em]">
                {today} · {tod}
              </span>
            </div>
            <h1 className="hostel-display mt-3 text-[2.6rem] leading-[1.05] font-semibold text-emerald-950">
              {greetingFor(tod)},{" "}
              <span className="bg-gradient-to-br from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent">
                {me?.name || "friend"}
              </span>
              <span className="text-emerald-900/40">.</span>
            </h1>
            <p className="mt-2 text-emerald-900/70">
              Welcome home. Here is what is happening at the hostel today.
            </p>
          </div>

          {/* Room glass card */}
          {loading ? (
            <Skel className="h-44" />
          ) : room ? (
            <div
              className="relative overflow-hidden rounded-3xl p-7"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6,95,70,0.92), rgba(20,83,45,0.92))",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 20px 60px -20px rgba(6,78,59,0.5)",
                animation: "fadeSlideUp 0.6s ease both",
                animationDelay: "100ms",
              }}
            >
              <div
                aria-hidden
                className="absolute -right-20 -top-20 h-72 w-72 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(190,242,100,0.3), transparent)",
                }}
              />
              <div className="flex items-center gap-2 text-emerald-100/80 text-xs uppercase tracking-[0.16em] mb-2">
                <Home className="size-4" />
                Your room
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-emerald-200/70 text-xs mb-1">Room No.</p>
                  <p className="hostel-display text-4xl font-semibold">
                    {room.roomNo}
                  </p>
                </div>
                <div>
                  <p className="text-emerald-200/70 text-xs mb-1">Block</p>
                  <p className="font-semibold text-xl">{room.block}</p>
                </div>
                <div>
                  <p className="text-emerald-200/70 text-xs mb-1">Type</p>
                  <p className="font-semibold text-xl capitalize">{room.type}</p>
                </div>
                <div>
                  <p className="text-emerald-200/70 text-xs mb-1">Occupants</p>
                  <p className="font-semibold text-xl inline-flex items-center gap-1.5">
                    <Users className="size-4 text-emerald-200" />
                    {room.occupants.length}/{room.capacity}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-3xl p-10 text-center"
              style={{
                background: "rgba(255,255,255,0.62)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.6)",
                animation: "fadeSlideUp 0.6s ease both",
                animationDelay: "100ms",
              }}
            >
              <BedDouble className="size-10 text-emerald-700/40 mx-auto mb-3" />
              <p className="font-semibold text-emerald-900">No room assigned yet</p>
              <p className="text-sm text-emerald-900/60 mt-1">
                Contact the hostel office to get a room allotted.
              </p>
            </div>
          )}

          {/* Glass stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skel key={i} className="h-32" />
              ))
            ) : (
              <>
                <GlassStat
                  label="Active complaints"
                  numeric={activeComplaints}
                  icon={<AlertTriangle className="size-4" />}
                  caption={
                    activeComplaints === 0 ? "All clear" : "Awaiting resolution"
                  }
                  delay={180}
                />
                <GlassStat
                  label="Pending applications"
                  numeric={pendingApplications}
                  icon={<FileText className="size-4" />}
                  caption={
                    pendingApplications === 0 ? "Nothing pending" : "Under review"
                  }
                  delay={260}
                />
                <GlassStat
                  label="Notifications"
                  numeric={notifications.length}
                  icon={<Bell className="size-4" />}
                  caption="From the hostel office"
                  delay={340}
                />
              </>
            )}
          </div>

          {/* Quick links */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.62)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.6)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "420ms",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-emerald-700" />
              <h3 className="hostel-display text-lg font-semibold text-emerald-950">
                Quick links
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "File complaint",
                  icon: MessageSquare,
                  path: "/hostel/student/complaints",
                },
                {
                  label: "View mess menu",
                  icon: Utensils,
                  path: "/hostel/student/mess",
                },
                {
                  label: "Apply for room",
                  icon: FileText,
                  path: "/hostel/student/applications",
                },
                {
                  label: "Notifications",
                  icon: Bell,
                  path: "/hostel/student/notifications",
                },
              ].map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    onClick={() => router.push(q.path)}
                    className="group rounded-2xl bg-white/70 hover:bg-white border border-white/60 hover:border-emerald-200 p-4 text-left transition-all hover:-translate-y-0.5"
                  >
                    <Icon className="size-5 text-emerald-700" />
                    <p className="text-sm font-semibold text-emerald-950 mt-3">
                      {q.label}
                    </p>
                    <ArrowUpRight className="size-4 text-emerald-400 mt-1 group-hover:text-emerald-700 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent notifications */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.62)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.6)",
              animation: "fadeSlideUp 0.6s ease both",
              animationDelay: "500ms",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="hostel-display text-lg font-semibold text-emerald-950 inline-flex items-center gap-2">
                <Bell className="size-5 text-emerald-700" />
                Recent updates
              </h3>
              <button
                onClick={() => router.push("/hostel/student/notifications")}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="size-3" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skel key={i} className="h-16" />
                ))}
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="size-10 text-emerald-300 mx-auto mb-3" />
                <p className="text-emerald-900/60 font-medium">No notifications yet</p>
                <p className="text-xs text-emerald-900/40 mt-1">
                  Calm and quiet on the hostel front.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotifications.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl bg-white/70 border border-white/60 p-4"
                    style={{
                      animation: "fadeSlideUp 0.5s ease both",
                      animationDelay: `${560 + i * 60}ms`,
                    }}
                  >
                    <div className="size-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Bell className="size-4 text-emerald-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-emerald-950">
                          {n.title}
                        </p>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityChip(
                            n.priority
                          )}`}
                        >
                          {n.priority}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-900/70 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[11px] text-emerald-900/40 mt-1">
                        {new Date(n.createdAt).toLocaleDateString()} · {n.sentBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
