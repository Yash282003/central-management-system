"use client";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Shield, ArrowUpRight } from "lucide-react";

const roles = [
  {
    key: "student",
    label: "Student",
    sub: "Grades · Attendance · Notices · Tests",
    icon: GraduationCap,
    accent: "#3b82f6",
    accentLight: "rgba(59,130,246,0.12)",
    delay: "0ms",
  },
  {
    key: "teacher",
    label: "Teacher",
    sub: "Students · Notices · Tests · Notes",
    icon: BookOpen,
    accent: "#10b981",
    accentLight: "rgba(16,185,129,0.12)",
    delay: "80ms",
  },
  {
    key: "admin",
    label: "Admin",
    sub: "Courses · Faculty · Publications · Reports",
    icon: Shield,
    accent: "#8b5cf6",
    accentLight: "rgba(139,92,246,0.12)",
    delay: "160ms",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Sans:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes gridScroll {
          from { transform: translateY(0); }
          to   { transform: translateY(60px); }
        }

        .dms-root {
          min-height: 100vh;
          background: #0a0e1a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Subtle animated grid */
        .dms-grid {
          position: absolute;
          inset: -60px;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridScroll 8s linear infinite;
          pointer-events: none;
        }

        /* Glow orbs */
        .dms-orb-blue {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
          top: -120px; right: -80px;
          pointer-events: none;
        }
        .dms-orb-violet {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
          bottom: -100px; left: -60px;
          pointer-events: none;
        }

        /* Top badge */
        .dms-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 28px;
          animation: fadeIn 0.6s ease both;
        }
        .dms-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        /* Heading */
        .dms-heading {
          font-family: 'Sora', sans-serif;
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 700;
          color: #fff;
          text-align: center;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
          animation: fadeUp 0.6s ease 0.1s both;
        }
        .dms-heading span {
          background: linear-gradient(135deg, #60a5fa 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dms-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.45);
          text-align: center;
          max-width: 420px;
          line-height: 1.6;
          margin: 0 0 56px;
          animation: fadeUp 0.6s ease 0.18s both;
        }

        /* Role cards */
        .dms-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 820px;
          animation: fadeUp 0.6s ease 0.26s both;
        }
        @media (max-width: 640px) {
          .dms-cards { grid-template-columns: 1fr; }
        }

        .dms-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.22s ease;
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          overflow: hidden;
        }
        .dms-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0;
          transition: opacity 0.22s ease;
        }
        .dms-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .dms-card:hover::before { opacity: 1; }
        .dms-card:hover .dms-card-arrow { opacity: 1; transform: translate(0, 0); }
        .dms-card:hover .dms-card-icon-wrap { background: var(--accent-light); }

        .dms-card-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          margin-bottom: 18px;
          transition: background 0.22s ease;
        }

        .dms-card-label {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }

        .dms-card-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
          letter-spacing: 0.01em;
          flex: 1;
        }

        .dms-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .dms-card-cta {
          font-size: 13px;
          font-weight: 500;
          color: var(--accent);
        }

        .dms-card-arrow {
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: all 0.22s ease;
          color: var(--accent);
        }

        /* Footer */
        .dms-footer {
          margin-top: 48px;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          animation: fadeIn 0.6s ease 0.4s both;
        }
        .dms-footer a {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 1px;
          transition: color 0.15s;
        }
        .dms-footer a:hover { color: #fff; }
      `}</style>

      <div className="dms-root">
        <div className="dms-grid" />
        <div className="dms-orb-blue" />
        <div className="dms-orb-violet" />

        <div className="dms-badge">
          <span className="dms-badge-dot" />
          Department Management System
        </div>

        <h1 className="dms-heading">
          One portal for<br />
          <span>every role</span>
        </h1>

        <p className="dms-sub">
          Academic management made simple — for students, teachers, and administrators.
        </p>

        <div className="dms-cards">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.key}
                className="dms-card"
                style={{ "--accent": r.accent, "--accent-light": r.accentLight } as React.CSSProperties}
                onClick={() => router.push(`/login?role=${r.key}`)}
              >
                <div className="dms-card-icon-wrap">
                  <Icon size={20} style={{ color: r.accent }} />
                </div>
                <div className="dms-card-label">{r.label}</div>
                <div className="dms-card-sub">{r.sub}</div>
                <div className="dms-card-footer">
                  <span className="dms-card-cta">Sign in</span>
                  <ArrowUpRight size={16} className="dms-card-arrow" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="dms-footer">
          New here?&nbsp;
          <a href="/signup">Create a student account</a>
          &nbsp;·&nbsp;
          <a href="/login">Sign in directly</a>
        </div>
      </div>
    </>
  );
}
