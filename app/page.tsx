"use client";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Shield, ArrowUpRight } from "lucide-react";

const roles = [
  {
    key: "student",
    label: "Student",
    sub: "Grades · Attendance · Notices · Tests",
    icon: GraduationCap,
    accent: "#2563eb",
    accentBg: "#eff6ff",
    accentBorder: "#bfdbfe",
    accentText: "#1d4ed8",
  },
  {
    key: "teacher",
    label: "Teacher",
    sub: "Students · Notices · Tests · Notes",
    icon: BookOpen,
    accent: "#059669",
    accentBg: "#f0fdf4",
    accentBorder: "#bbf7d0",
    accentText: "#047857",
  },
  {
    key: "admin",
    label: "Admin",
    sub: "Courses · Faculty · Publications · Reports",
    icon: Shield,
    accent: "#7c3aed",
    accentBg: "#f5f3ff",
    accentBorder: "#ddd6fe",
    accentText: "#6d28d9",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .lp-root {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Soft dot grid background */
        .lp-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.5;
          pointer-events: none;
        }

        /* Light color blobs */
        .lp-blob-blue {
          position: absolute;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, #dbeafe 0%, transparent 70%);
          top: -140px; right: -100px;
          pointer-events: none;
        }
        .lp-blob-violet {
          position: absolute;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, #ede9fe 0%, transparent 70%);
          bottom: -100px; left: -80px;
          pointer-events: none;
        }

        /* Badge */
        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 5px 14px 5px 10px;
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          letter-spacing: 0.04em;
          margin-bottom: 28px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          animation: fadeIn 0.5s ease both;
        }
        .lp-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 2px #d1fae5;
        }

        /* Heading */
        .lp-heading {
          font-family: 'Sora', sans-serif;
          font-size: clamp(34px, 5.5vw, 60px);
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin: 0 0 16px;
          animation: fadeUp 0.5s ease 0.08s both;
        }
        .lp-heading span {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-sub {
          font-size: 16px;
          color: #64748b;
          text-align: center;
          max-width: 400px;
          line-height: 1.65;
          margin: 0 0 52px;
          animation: fadeUp 0.5s ease 0.15s both;
        }

        /* Cards */
        .lp-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 800px;
          animation: fadeUp 0.5s ease 0.22s both;
        }
        @media (max-width: 640px) {
          .lp-cards { grid-template-columns: 1fr; }
        }

        .lp-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .lp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
          border-color: var(--card-border);
        }
        .lp-card:hover .lp-card-icon-wrap {
          background: var(--card-bg);
        }
        .lp-card:hover .lp-card-arrow {
          opacity: 1;
          transform: translate(0, 0);
        }

        .lp-card-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: #f1f5f9;
          margin-bottom: 18px;
          transition: background 0.2s ease;
        }

        .lp-card-label {
          font-family: 'Sora', sans-serif;
          font-size: 17px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .lp-card-sub {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.65;
          flex: 1;
        }

        .lp-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .lp-card-cta {
          font-size: 13px;
          font-weight: 600;
          color: var(--card-accent);
        }

        .lp-card-arrow {
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: all 0.2s ease;
          color: var(--card-accent);
        }

        /* Footer */
        .lp-footer {
          margin-top: 44px;
          font-size: 13px;
          color: #94a3b8;
          animation: fadeIn 0.5s ease 0.35s both;
        }
        .lp-footer a {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 1px;
          transition: color 0.15s, border-color 0.15s;
        }
        .lp-footer a:hover {
          color: #2563eb;
          border-color: #bfdbfe;
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-dots" />
        <div className="lp-blob-blue" />
        <div className="lp-blob-violet" />

        <div className="lp-badge">
          <span className="lp-badge-dot" />
          Department Management System
        </div>

        <h1 className="lp-heading">
          One portal,<br />
          <span>every role</span>
        </h1>

        <p className="lp-sub">
          Academic management made simple — for students, teachers, and administrators.
        </p>

        <div className="lp-cards">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.key}
                className="lp-card"
                style={{
                  "--card-accent": r.accent,
                  "--card-bg": r.accentBg,
                  "--card-border": r.accentBorder,
                } as React.CSSProperties}
                onClick={() => router.push(`/login?role=${r.key}`)}
              >
                <div className="lp-card-icon-wrap">
                  <Icon size={20} style={{ color: r.accent }} />
                </div>
                <div className="lp-card-label">{r.label}</div>
                <div className="lp-card-sub">{r.sub}</div>
                <div className="lp-card-footer">
                  <span className="lp-card-cta">Sign in</span>
                  <ArrowUpRight size={16} className="lp-card-arrow" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="lp-footer">
          New here?&nbsp;
          <a href="/signup">Create a student account</a>
          &nbsp;·&nbsp;
          <a href="/login">Sign in directly</a>
        </div>
      </div>
    </>
  );
}
