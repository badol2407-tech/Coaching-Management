import { useEffect, useState } from "react";

// ── Education icons (emoji — no import needed) ───────────────────────────────
const ICONS = [
  { emoji: "🎓", label: "Graduation cap" },
  { emoji: "🏫", label: "School" },
  { emoji: "🏛️", label: "Classroom" },
  { emoji: "👨‍🏫", label: "Teacher" },
  { emoji: "👨‍🎓", label: "Student" },
  { emoji: "📖", label: "Open book" },
  { emoji: "📓", label: "Notebook" },
  { emoji: "✅", label: "Attendance" },
  { emoji: "📅", label: "Calendar" },
  { emoji: "📝", label: "Exam" },
  { emoji: "📊", label: "Result chart" },
  { emoji: "🖥️", label: "Dashboard" },
  { emoji: "🪪", label: "ID card" },
  { emoji: "🏆", label: "Certificate" },
  { emoji: "✏️", label: "Pencil" },
  { emoji: "📋", label: "Clipboard" },
  { emoji: "💳", label: "Fees" },
  { emoji: "🔔", label: "Notice" },
  { emoji: "🗓️", label: "Timetable" },
  { emoji: "📈", label: "Analytics" },
];

const SPREAD_RADIUS = 220;
const iconParticles = ICONS.map((icon, i) => {
  const angle = (i / ICONS.length) * 360;
  const r = SPREAD_RADIUS + (((i * 37) % 60) - 30);
  const rad = (angle * Math.PI) / 180;
  const tx = Math.round(r * Math.cos(rad));
  const ty = Math.round(r * Math.sin(rad));
  const delay = 0.95 + (i / ICONS.length) * 0.25;
  const duration = 0.9 + ((i * 13) % 30) / 100;
  return { ...icon, tx, ty, delay, duration, angle };
});

const CSS = `
@keyframes logoFlyIn {
  0%   { transform: translate(55vw, -55vh) rotate(0deg) scale(0.3); opacity: 0; }
  15%  { opacity: 1; }
  80%  { transform: translate(0, 0) rotate(680deg) scale(1.12); }
  90%  { transform: translate(0, 0) rotate(720deg) scale(0.93); }
  100% { transform: translate(0, 0) rotate(720deg) scale(1); }
}
@keyframes logoPulse {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.18); }
  55%  { transform: scale(0.95); }
  75%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes ring {
  0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 0.7; }
  100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
}
@keyframes iconBurst {
  0%   { transform: translate(0,0) scale(0) rotate(0deg); opacity: 0; }
  15%  { opacity: 1; }
  60%  { transform: translate(var(--tx), var(--ty)) scale(1.15) rotate(var(--spin)); opacity: 1; }
  80%  { transform: translate(calc(var(--tx)*1.05), calc(var(--ty)*1.05)) scale(1) rotate(var(--spin)); opacity: 0.85; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0.85) rotate(var(--spin)); opacity: 0; }
}
@keyframes splashFadeOut {
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.04); }
}
.splash-root {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  overflow: hidden;
}
.splash-root.fading {
  animation: splashFadeOut 0.55s cubic-bezier(.4,0,.2,1) forwards;
}
.logo-wrap {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  animation: logoFlyIn 0.92s cubic-bezier(.22,.68,0,1.2) forwards;
}
.logo-wrap.landed {
  animation: logoPulse 0.55s cubic-bezier(.34,1.56,.64,1) forwards;
}
.splash-logo-icon {
  width: 96px; height: 96px;
  border-radius: 22px;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4338ca 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.3);
}
.splash-logo-icon svg {
  width: 52px; height: 52px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.logo-label {
  color: #fff;
  font-family: 'Hind Siliguri', 'Inter', sans-serif;
  font-size: 24px; font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0;
  transition: opacity 0.3s ease 0.85s;
}
.logo-label.show { opacity: 1; }
.logo-sub {
  color: rgba(165,180,252,0.8);
  font-family: 'Hind Siliguri', 'Inter', sans-serif;
  font-size: 12px; font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease 1.0s;
}
.logo-sub.show { opacity: 1; }
.ring {
  position: absolute; top: 50%; left: 50%;
  width: 110px; height: 110px;
  border-radius: 50%;
  border: 2px solid rgba(99,102,241,0.55);
  animation: ring 1.1s cubic-bezier(0,.55,.45,1) forwards;
  pointer-events: none;
}
.ring:nth-child(2) { animation-delay: 0.12s; border-color: rgba(129,140,248,0.4); }
.ring:nth-child(3) { animation-delay: 0.24s; border-color: rgba(165,180,252,0.3); }
.icon-particle {
  position: absolute;
  top: 50%; left: 50%;
  font-size: 28px;
  line-height: 1;
  transform-origin: center;
  pointer-events: none;
  animation: iconBurst var(--dur) cubic-bezier(.22,.68,0,1.1) var(--delay) both;
}
`;

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"flying" | "landed" | "fading">("flying");

  useEffect(() => {
    if (!document.getElementById("splash-css")) {
      const s = document.createElement("style");
      s.id = "splash-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    const t1 = setTimeout(() => setPhase("landed"), 920);
    const t2 = setTimeout(() => setPhase("fading"), 3400);
    const t3 = setTimeout(() => onDone(), 3950);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className={`splash-root${phase === "fading" ? " fading" : ""}`}
      aria-hidden="true"
      role="presentation"
    >
      <Stars />

      {phase !== "flying" &&
        iconParticles.map((p, i) => (
          <span
            key={i}
            className="icon-particle"
            aria-hidden="true"
            style={{
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--delay": `${p.delay}s`,
              "--dur": `${p.duration}s`,
              "--spin": `${(i % 2 === 0 ? 1 : -1) * (120 + (i * 17) % 180)}deg`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        ))}

      {phase !== "flying" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0 }}>
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
        </div>
      )}

      <div className={`logo-wrap${phase === "landed" || phase === "fading" ? " landed" : ""}`}>
        {/* EduTrack logo — matches the app's GraduationCap style */}
        <div className="splash-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>

        <p className={`logo-label${phase !== "flying" ? " show" : ""}`}>
          EduTrack
        </p>
        <p className={`logo-sub${phase !== "flying" ? " show" : ""}`}>
          Smart Coaching, Every Day
        </p>
      </div>
    </div>
  );
}

function Stars() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }}
      aria-hidden="true"
    >
      {Array.from({ length: 55 }, (_, i) => (
        <circle
          key={i}
          cx={`${(i * 1733) % 100}%`}
          cy={`${(i * 977) % 100}%`}
          r={i % 5 === 0 ? 1.5 : 0.8}
          fill="white"
          opacity={0.4 + (i % 3) * 0.2}
        />
      ))}
    </svg>
  );
}
