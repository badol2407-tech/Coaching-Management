import { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";

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
  const delay = 0.55 + (i / ICONS.length) * 0.15;
  const duration = 0.55 + ((i * 13) % 30) / 100;
  return { ...icon, tx, ty, delay, duration, angle };
});

// How long the final "morph into navbar logo" transform takes.
// Splash is capped at ~1.5-2s total (once per browser session — see
// sessionStorage gate in App.tsx), so every stage here is intentionally short.
const DOCK_MS = 450;
// Chrome (background/particles/text) fades out slightly faster than the
// logo finishes traveling, so the real page is already gently visible
// behind the logo as it completes its glide — feels like a reveal, not a cut.
const CHROME_FADE_MS = 280;
// Selector used to find the real navbar/sidebar logo box to dock into.
const LOGO_TARGET_SELECTOR = "[data-app-logo]";
// Give the target time to mount (e.g. auth is still resolving) before
// giving up and falling back to a plain fade-out.
const MAX_TARGET_WAIT_MS = 500;

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
  overflow: hidden;
}
.splash-root.fading {
  animation: splashFadeOut 0.55s cubic-bezier(.4,0,.2,1) forwards;
}
.splash-backdrop {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  transition: opacity ${CHROME_FADE_MS}ms cubic-bezier(.4,0,.2,1);
}
.splash-chrome {
  transition: opacity ${CHROME_FADE_MS}ms cubic-bezier(.4,0,.2,1);
}
.splash-root.docking .splash-backdrop,
.splash-root.docking .splash-chrome {
  opacity: 0;
  pointer-events: none;
}
/* Override the label/sub's own mount-in transition (which has its own
   delay) so they fade out immediately and in sync once docking starts. */
.splash-root.docking .logo-label,
.splash-root.docking .logo-sub {
  transition: opacity ${CHROME_FADE_MS}ms ease !important;
  transition-delay: 0s !important;
  opacity: 0 !important;
}
.logo-wrap {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  animation: logoFlyIn 0.55s cubic-bezier(.22,.68,0,1.2) forwards;
}
.logo-wrap.landed {
  animation: logoPulse 0.55s cubic-bezier(.34,1.56,.64,1) forwards;
}
.splash-logo-icon {
  position: relative;
  width: 96px; height: 96px;
  border-radius: 22px;
  background: hsl(var(--primary, 224 76% 58%));
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.3);
  will-change: transform;
}
.splash-logo-icon.docking {
  transition: transform ${DOCK_MS}ms cubic-bezier(.65,0,.35,1),
              box-shadow ${DOCK_MS}ms cubic-bezier(.65,0,.35,1);
  box-shadow: none;
}
.splash-logo-gradient {
  position: absolute; inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4338ca 100%);
  transition: opacity ${DOCK_MS}ms ease;
}
.splash-logo-icon.docking .splash-logo-gradient {
  opacity: 0;
}
.splash-logo-icon svg {
  position: relative;
  width: 60px; height: 60px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.logo-label {
  color: #fff;
  font-family: 'Hind Siliguri', 'Inter', sans-serif;
  font-size: 24px; font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0;
  transition: opacity 0.25s ease 0.5s;
}
.logo-label.show { opacity: 1; }
.logo-sub {
  color: rgba(165,180,252,0.8);
  font-family: 'Hind Siliguri', 'Inter', sans-serif;
  font-size: 12px; font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.25s ease 0.6s;
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
  const [phase, setPhase] = useState<"flying" | "landed" | "docking" | "fading">("flying");
  const logoIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById("splash-css")) {
      const s = document.createElement("style");
      s.id = "splash-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;

    // Try to morph the splash logo into the real navbar/sidebar logo. Falls
    // back to a plain fade-out if the target never shows up (e.g. auth is
    // still resolving, or the destination page has no matching logo).
    function dockIntoNavbar() {
      const iconEl = logoIconRef.current;
      if (!iconEl) return fadeOut();

      const startedAt = performance.now();

      const tryFindTarget = () => {
        if (cancelled) return;
        const target = document.querySelector<HTMLElement>(LOGO_TARGET_SELECTOR);
        const targetVisible = target && target.offsetParent !== null;

        if (targetVisible && target) {
          const source = iconEl.getBoundingClientRect();
          const dest = target.getBoundingClientRect();
          if (source.width === 0 || dest.width === 0) {
            raf = requestAnimationFrame(tryFindTarget);
            return;
          }

          const scale = dest.width / source.width;
          const deltaX = dest.left - source.left;
          const deltaY = dest.top - source.top;

          setPhase("docking");

          // Let the "docking" class attach (backdrop/chrome start fading)
          // before kicking off the transform, so the transition is picked up.
          requestAnimationFrame(() => {
            if (cancelled || !logoIconRef.current) return;
            const el = logoIconRef.current;
            el.classList.add("docking");
            el.style.transformOrigin = "top left";
            // Force layout so the transition animates from identity.
            void el.offsetWidth;
            el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
          });

          timers.push(setTimeout(() => { if (!cancelled) onDone(); }, DOCK_MS));
          return;
        }

        if (performance.now() - startedAt > MAX_TARGET_WAIT_MS) {
          fadeOut();
          return;
        }
        raf = requestAnimationFrame(tryFindTarget);
      };

      tryFindTarget();
    }

    function fadeOut() {
      if (cancelled) return;
      setPhase("fading");
      timers.push(setTimeout(() => { if (!cancelled) onDone(); }, 400));
    }

    timers.push(setTimeout(() => setPhase("landed"), 550));
    timers.push(setTimeout(() => dockIntoNavbar(), 900));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onDone]);

  const isDocking = phase === "docking";

  return (
    <div
      className={`splash-root${phase === "fading" ? " fading" : ""}${isDocking ? " docking" : ""}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="splash-backdrop" />

      <div className="splash-chrome">
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
      </div>

      <div className={`logo-wrap${phase === "landed" || phase === "docking" || phase === "fading" ? " landed" : ""}`}>
        {/* This logo box is the shared element: it morphs directly into the
            real navbar/sidebar logo box rather than fading out. */}
        <div ref={logoIconRef} className="splash-logo-icon">
          <div className="splash-logo-gradient" />
          <GraduationCap strokeWidth={1.8} />
        </div>

        <p className={`splash-chrome logo-label${phase !== "flying" ? " show" : ""}`}>
          EduTrack
        </p>
        <p className={`splash-chrome logo-sub${phase !== "flying" ? " show" : ""}`}>
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
