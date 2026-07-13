import './_group.css';

const features = {
  free: ["Access to all Premium features", "কোনো Credit Card লাগবে না", "যেকোনো সময় Cancel করুন", "Full access, no limitations"],
  founder: ["সব Premium features", "Unlimited Students & Teachers", "Priority Support", "Advanced Analytics", "Custom Branding", "Data Export"],
  annual: ["সব Founder features included", "২ মাস বিনামূল্যে", "Dedicated Account Manager", "Early access to new features", "Annual performance report", "Invoice & billing support"],
};

function Check({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="8" fill={color} fillOpacity="0.15" />
      <path d="M4.5 8L7 10.5L11.5 5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CinematicDark() {
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #060609 0%, #0c0c14 40%, #0a0a12 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 999, marginBottom: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', animation: 'badge-glow 2s ease-in-out infinite' }} />
          সীমিত সময়ের Offer
        </div>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          সহজ, স্বচ্ছ{' '}
          <span style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Pricing</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 10 }}>কোনো hidden charge নেই। যেকোনো সময় cancel করুন।</p>
      </div>

      {/* Cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.08fr 1fr', gap: 20, width: '100%', maxWidth: 960, alignItems: 'stretch' }}>

        {/* ── Free Trial ── */}
        <div style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          backdropFilter: 'blur(20px)', padding: '28px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}>
          {/* Glass highlight */}
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', borderRadius: 1 }} />

          <div style={{ marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>🟢</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Free Trial</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>ঝুঁকি ছাড়াই শুরু করুন</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>৳0</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 6 }}>৭ দিনের জন্য সম্পূর্ণ বিনামূল্যে</p>
          </div>

          <ul style={{ listStyle: 'none', flex: 1, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {features.free.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                <Check color="#22c55e" /> {f}
              </li>
            ))}
          </ul>

          <button style={{
            width: '100%', height: 44, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.01em',
          }}>
            ফ্রি ট্রায়াল শুরু করুন
          </button>
        </div>

        {/* ── Founder Launch (Featured) ── */}
        <div style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          borderRadius: 22, padding: '1.5px',
          background: 'linear-gradient(160deg, rgba(245,158,11,0.9) 0%, rgba(251,191,36,0.6) 40%, rgba(180,83,9,0.5) 100%)',
          animation: 'pulse-glow-gold 3s ease-in-out infinite',
          zIndex: 2,
        }}>
          {/* Badge */}
          <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', color: '#1c1400', fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 999, letterSpacing: '0.06em', whiteSpace: 'nowrap', animation: 'badge-glow 2s ease-in-out infinite' }}>
              ⭐ Most Popular
            </div>
          </div>

          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 20,
            background: 'linear-gradient(160deg, #141008 0%, #1a1508 50%, #110f06 100%)',
            padding: '32px 24px', position: 'relative', overflow: 'hidden',
          }}>
            {/* Shimmer effect */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%', background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            {/* Scan line */}
            <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)', animation: 'scan-line 4s linear infinite', pointerEvents: 'none' }} />

            <div style={{ marginBottom: 20, position: 'relative' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16, animation: 'float 4s ease-in-out infinite' }}>⭐</div>
              <h3 style={{ fontSize: 21, fontWeight: 800, color: '#fef3c7', marginBottom: 4 }}>Founder Launch</h3>
              <p style={{ color: 'rgba(245,158,11,0.6)', fontSize: 13 }}>প্রথম ১০০ Coaching Center-এর জন্য</p>
            </div>

            <div style={{ marginBottom: 20, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: 'rgba(245,158,11,0.45)', fontSize: 15, textDecoration: 'line-through', fontWeight: 600 }}>৳999</span>
                <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999 }}>২৫% ছাড়</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 60, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1, textShadow: '0 0 40px rgba(245,158,11,0.4)' }}>৳749</span>
                <span style={{ color: 'rgba(245,158,11,0.6)', fontSize: 14, fontWeight: 500 }}>/month</span>
              </div>
              {/* Scarcity bar */}
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'rgba(245,158,11,0.1)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '68%', borderRadius: 99, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                </div>
                <span style={{ color: 'rgba(245,158,11,0.75)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>৬৮/১০০ নেওয়া হয়েছে</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', flex: 1, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {features.founder.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(254,243,199,0.8)' }}>
                  <Check color="#f59e0b" /> {f}
                </li>
              ))}
            </ul>

            <button style={{
              width: '100%', height: 48, borderRadius: 12,
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              color: '#1c1400', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(245,158,11,0.35)', letterSpacing: '0.01em',
              transition: 'all 0.2s',
            }}>
              Founder Price নিন →
            </button>
          </div>
        </div>

        {/* ── Annual Premium ── */}
        <div style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          borderRadius: 20, border: '1px solid rgba(99,102,241,0.2)',
          background: 'linear-gradient(160deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 50%, rgba(255,255,255,0.01) 100%)',
          backdropFilter: 'blur(20px)', padding: '28px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(99,102,241,0.12)',
        }}>
          {/* Best Value badge */}
          <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 999, letterSpacing: '0.06em', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
              👑 Best Value
            </div>
          </div>
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)', borderRadius: 1 }} />

          <div style={{ marginBottom: 20, marginTop: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>👑</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Annual Premium</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>বছরে ২ মাস একদম বিনামূল্যে</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, textDecoration: 'line-through', fontWeight: 600 }}>৳11,988</span>
              <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999 }}>৳1,989 সাশ্রয়</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>৳9,999</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 500 }}>/year</span>
            </div>
            <p style={{ color: '#818cf8', fontSize: 12, fontWeight: 600, marginTop: 6 }}>মাসে মাত্র ৳833 — ২ মাস ফ্রি!</p>
          </div>

          <ul style={{ listStyle: 'none', flex: 1, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {features.annual.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                <Check color="#818cf8" /> {f}
              </li>
            ))}
          </ul>

          <button style={{
            width: '100%', height: 44, borderRadius: 10, border: 'none',
            background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(99,102,241,0.3)', letterSpacing: '0.01em',
          }}>
            Annual Plan নিন
          </button>
        </div>

      </div>

      {/* Trust line */}
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="rgba(34,197,94,0.2)" /><path d="M4 7l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        কোনো hidden fee নেই · যেকোনো সময় cancel করুন · SSL secured payment
      </p>
    </div>
  );
}
