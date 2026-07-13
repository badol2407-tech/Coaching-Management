import './_group.css';

const features = {
  free: ["Access to all Premium features", "কোনো Credit Card লাগবে না", "যেকোনো সময় Cancel করুন", "Full access, no limitations"],
  founder: ["সব Premium features", "Unlimited Students & Teachers", "Priority Support", "Advanced Analytics", "Custom Branding", "Data Export"],
  annual: ["সব Founder features included", "২ মাস বিনামূল্যে", "Dedicated Account Manager", "Early access to new features", "Annual performance report", "Invoice & billing support"],
};

function Check({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7.5" cy="7.5" r="7.5" fill={color} fillOpacity="0.15" />
      <path d="M4.5 7.5L6.5 9.5L11 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GoldFocal() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050507 0%, #080810 40%, #060609 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Center spotlight for founder card */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 40%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 52, position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', color: '#f59e0b', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 999, marginBottom: 18, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b', animation: 'badge-glow 2s ease-in-out infinite' }} />
          সীমিত সময়ের Offer — এখনই সুযোগ নিন
        </div>
        <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#fff' }}>
          সহজ, স্বচ্ছ <span style={{ background: 'linear-gradient(90deg,#f59e0b 0%,#fcd34d 50%,#f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Pricing</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 10 }}>কোনো hidden charge নেই। যেকোনো সময় cancel করুন।</p>
      </div>

      {/* Cards — center card is taller via padding & scale */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 980, justifyContent: 'center' }}>

        {/* ── Free Trial ── */}
        <div style={{
          flex: '0 0 300px', display: 'flex', flexDirection: 'column',
          borderRadius: 18, padding: '24px 22px',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative', overflow: 'hidden',
          alignSelf: 'stretch',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)' }} />

          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14 }}>🟢</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 3 }}>Free Trial</h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 18 }}>ঝুঁকি ছাড়াই শুরু করুন</p>

          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>৳0</span>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 5 }}>৭ দিনের জন্য সম্পূর্ণ বিনামূল্যে</p>
          </div>

          <ul style={{ listStyle: 'none', flex: 1, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {features.free.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                <Check color="#22c55e" /> {f}
              </li>
            ))}
          </ul>

          <button style={{ width: '100%', height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            ফ্রি ট্রায়াল শুরু করুন
          </button>
        </div>

        {/* ── Founder Launch — DOMINANT FOCAL CARD ── */}
        <div style={{
          flex: '0 0 340px', position: 'relative', borderRadius: 22, padding: '2px',
          background: 'linear-gradient(150deg, #fbbf24 0%, #f59e0b 30%, #d97706 60%, #b45309 100%)',
          boxShadow: '0 0 0 1px rgba(245,158,11,0.3), 0 0 60px -8px rgba(245,158,11,0.6), 0 0 120px -20px rgba(245,158,11,0.3), 0 40px 80px rgba(0,0,0,0.6)',
          animation: 'pulse-glow-gold 3s ease-in-out infinite',
          zIndex: 3,
          transform: 'translateY(-8px)',
        }}>
          {/* Most Popular badge */}
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
              backgroundSize: '200% 100%',
              color: '#1a0e00', fontSize: 11, fontWeight: 900,
              padding: '7px 20px', borderRadius: 999,
              letterSpacing: '0.08em', whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(245,158,11,0.7), 0 4px 12px rgba(0,0,0,0.4)',
              textTransform: 'uppercase',
            }}>
              ⭐ Most Popular
            </div>
          </div>

          <div style={{
            borderRadius: 20, padding: '32px 26px',
            background: 'linear-gradient(160deg, #13100a 0%, #1c1608 30%, #17130a 70%, #0e0c07 100%)',
            position: 'relative', overflow: 'hidden', minHeight: '100%',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Inner glow layers */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'radial-gradient(ellipse at 50% -20%, rgba(245,158,11,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 80%, rgba(245,158,11,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
            {/* Moving shimmer */}
            <div style={{ position: 'absolute', top: 0, left: '-40%', width: '30%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', animation: 'shimmer 4s ease-in-out infinite', pointerEvents: 'none', transform: 'skewX(-15deg)' }} />

            <div style={{ position: 'relative', marginBottom: 22 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16, animation: 'float 4s ease-in-out infinite' }}>⭐</div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fef3c7', letterSpacing: '-0.02em', marginBottom: 4 }}>Founder Launch</h3>
              <p style={{ color: 'rgba(245,158,11,0.55)', fontSize: 13 }}>প্রথম ১০০ Coaching Center-এর জন্য</p>
            </div>

            <div style={{ position: 'relative', marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ color: 'rgba(245,158,11,0.4)', fontSize: 15, textDecoration: 'line-through', fontWeight: 600 }}>৳999</span>
                <span style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: 11, fontWeight: 800, padding: '3px 12px', borderRadius: 999, letterSpacing: '0.05em' }}>২৫% ছাড়</span>
              </div>
              {/* BIG price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, lineHeight: 1 }}>
                <span style={{ fontSize: 68, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1, textShadow: '0 0 40px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.2)' }}>৳749</span>
                <span style={{ color: 'rgba(245,158,11,0.55)', fontSize: 15, fontWeight: 600, alignSelf: 'flex-end', paddingBottom: 8 }}>/month</span>
              </div>
              {/* Scarcity */}
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'rgba(245,158,11,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '68%', borderRadius: 99, background: 'linear-gradient(90deg, #d97706, #fbbf24)' }} />
                </div>
                <span style={{ color: 'rgba(245,158,11,0.7)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>৬৮/১০০ নেওয়া হয়েছে</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', flex: 1, marginBottom: 26, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {features.founder.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(254,243,199,0.8)' }}>
                  <Check color="#fbbf24" /> {f}
                </li>
              ))}
            </ul>

            <button style={{
              width: '100%', height: 50, borderRadius: 12,
              background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
              backgroundSize: '200% 100%',
              color: '#1a0e00', fontSize: 16, fontWeight: 900, border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(245,158,11,0.4), 0 1px 0 rgba(255,255,255,0.2) inset',
              letterSpacing: '0.02em',
            }}>
              Founder Price নিন →
            </button>
          </div>
        </div>

        {/* ── Annual Premium ── */}
        <div style={{
          flex: '0 0 300px', display: 'flex', flexDirection: 'column',
          borderRadius: 18, padding: '24px 22px',
          background: 'linear-gradient(160deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 60%, rgba(255,255,255,0.015) 100%)',
          border: '1px solid rgba(99,102,241,0.18)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(99,102,241,0.1)',
          position: 'relative', overflow: 'hidden',
          alignSelf: 'stretch',
        }}>
          {/* Best Value badge */}
          <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(99,102,241,0.5)' }}>
              👑 Best Value
            </div>
          </div>
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)' }} />

          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14, marginTop: 12 }}>👑</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 3 }}>Annual Premium</h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 18 }}>বছরে ২ মাস একদম বিনামূল্যে</p>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, textDecoration: 'line-through', fontWeight: 600 }}>৳11,988</span>
              <span style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999 }}>৳1,989 সাশ্রয়</span>
            </div>
            <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>৳9,999</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginLeft: 4 }}>/year</span>
            <p style={{ color: '#818cf8', fontSize: 12, fontWeight: 600, marginTop: 6 }}>মাসে মাত্র ৳833 — ২ মাস ফ্রি!</p>
          </div>

          <ul style={{ listStyle: 'none', flex: 1, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {features.annual.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                <Check color="#818cf8" /> {f}
              </li>
            ))}
          </ul>

          <button style={{ width: '100%', height: 42, borderRadius: 10, border: 'none', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 18px rgba(99,102,241,0.35)' }}>
            Annual Plan নিন
          </button>
        </div>

      </div>

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 36, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 13 13"><circle cx="6.5" cy="6.5" r="6.5" fill="rgba(34,197,94,0.2)" /><path d="M3.5 6.5l2 2L10 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        কোনো hidden fee নেই · যেকোনো সময় cancel করুন · SSL secured payment
      </p>
    </div>
  );
}
