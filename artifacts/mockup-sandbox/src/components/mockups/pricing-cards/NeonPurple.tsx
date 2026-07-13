import './_group.css';

const features = {
  free: ["Access to all Premium features", "কোনো Credit Card লাগবে না", "যেকোনো সময় Cancel করুন", "Full access, no limitations"],
  founder: ["সব Premium features", "Unlimited Students & Teachers", "Priority Support", "Advanced Analytics", "Custom Branding", "Data Export"],
  annual: ["সব Founder features included", "২ মাস বিনামূল্যে", "Dedicated Account Manager", "Early access to new features", "Annual performance report", "Invoice & billing support"],
};

function Check({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7.5" cy="7.5" r="7.5" fill={color} fillOpacity="0.18" />
      <path d="M4.5 7.5L6.5 9.5L11 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NeonPurple() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #04040a 0%, #080614 40%, #060510 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Neon ambient glows */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 400, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.025) 1px,transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 52, position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 999, marginBottom: 16, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 8px #a855f7', animation: 'badge-glow 2s ease-in-out infinite' }} />
          সীমিত সময়ের Offer — এখনই সুযোগ নিন
        </div>
        <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#fff' }}>
          সহজ, স্বচ্ছ{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Pricing</span>
            <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'blur(8px)', opacity: 0.5, pointerEvents: 'none' }}>Pricing</span>
          </span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 10 }}>কোনো hidden charge নেই। যেকোনো সময় cancel করুন।</p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.12fr 1fr', gap: 18, width: '100%', maxWidth: 970, alignItems: 'stretch' }}>

        {/* ── Free Trial ── */}
        <div style={{
          position: 'relative', display: 'flex', flexDirection: 'column', borderRadius: 20,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
          padding: '26px 22px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)' }} />

          {/* Glass orb accent */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14 }}>🟢</div>
          <h3 style={{ fontSize: 19, fontWeight: 800, color: '#f1f5f9', marginBottom: 3 }}>Free Trial</h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 18 }}>ঝুঁকি ছাড়াই শুরু করুন</p>

          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 50, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>৳0</span>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 5 }}>৭ দিনের জন্য সম্পূর্ণ বিনামূল্যে</p>
          </div>

          <ul style={{ listStyle: 'none', flex: 1, marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {features.free.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>
                <Check color="#22c55e" /> {f}
              </li>
            ))}
          </ul>

          <button style={{ width: '100%', height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            ফ্রি ট্রায়াল শুরু করুন
          </button>
        </div>

        {/* ── Founder Launch — Gold + Purple focal ── */}
        <div style={{
          position: 'relative', borderRadius: 22, padding: '2px',
          background: 'linear-gradient(150deg, #fbbf24 0%, #f59e0b 40%, #7c3aed 80%, #4f46e5 100%)',
          boxShadow: '0 0 0 1px rgba(245,158,11,0.2), 0 0 80px -10px rgba(245,158,11,0.5), 0 0 80px -10px rgba(139,92,246,0.3), 0 40px 80px rgba(0,0,0,0.7)',
          animation: 'pulse-glow-gold 3s ease-in-out infinite',
          zIndex: 2, display: 'flex', flexDirection: 'column',
        }}>
          {/* Badge */}
          <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', color: '#1a0e00', fontSize: 11, fontWeight: 900, padding: '6px 18px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(245,158,11,0.6), 0 4px 12px rgba(0,0,0,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ⭐ Most Popular
            </div>
          </div>

          <div style={{
            flex: 1, borderRadius: 20, padding: '32px 24px',
            background: 'linear-gradient(155deg, #120f08 0%, #160f07 30%, #0f0818 60%, #0c0616 100%)',
            position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            {/* Dual glow — gold top + purple bottom */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'radial-gradient(ellipse at 50% -10%, rgba(245,158,11,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'radial-gradient(ellipse at 50% 110%, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            {/* Shimmer */}
            <div style={{ position: 'absolute', top: 0, left: '-50%', width: '30%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)', animation: 'shimmer 5s ease-in-out infinite', pointerEvents: 'none', transform: 'skewX(-15deg)' }} />
            {/* Scan line */}
            <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.25),rgba(139,92,246,0.25),transparent)', animation: 'scan-line 5s linear infinite', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14, animation: 'float 4s ease-in-out infinite' }}>⭐</div>
              <h3 style={{ fontSize: 21, fontWeight: 900, color: '#fef3c7', letterSpacing: '-0.02em', marginBottom: 4 }}>Founder Launch</h3>
              <p style={{ color: 'rgba(245,158,11,0.55)', fontSize: 13 }}>প্রথম ১০০ Coaching Center-এর জন্য</p>
            </div>

            <div style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ color: 'rgba(245,158,11,0.4)', fontSize: 15, textDecoration: 'line-through', fontWeight: 600 }}>৳999</span>
                <span style={{ background: 'linear-gradient(90deg,rgba(245,158,11,0.12),rgba(139,92,246,0.12))', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', fontSize: 11, fontWeight: 800, padding: '3px 12px', borderRadius: 999 }}>২৫% ছাড়</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 64, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1, textShadow: '0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(139,92,246,0.2)' }}>৳749</span>
                <span style={{ color: 'rgba(245,158,11,0.55)', fontSize: 14, fontWeight: 600, paddingBottom: 6 }}>/month</span>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(245,158,11,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '68%', borderRadius: 99, background: 'linear-gradient(90deg, #d97706, #fbbf24, #a855f7)' }} />
                </div>
                <span style={{ color: 'rgba(245,158,11,0.65)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>৬৮/১০০ নেওয়া হয়েছে</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', flex: 1, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {features.founder.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(254,243,199,0.8)' }}>
                  <Check color="#fbbf24" /> {f}
                </li>
              ))}
            </ul>

            <button style={{
              width: '100%', height: 48, borderRadius: 12, border: 'none',
              background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 40%, #a855f7 100%)',
              color: '#fff', fontSize: 15, fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(245,158,11,0.3), 0 6px 24px rgba(168,85,247,0.2)',
              letterSpacing: '0.01em', textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}>
              Founder Price নিন →
            </button>
          </div>
        </div>

        {/* ── Annual Premium — Purple glass ── */}
        <div style={{
          position: 'relative', display: 'flex', flexDirection: 'column', borderRadius: 20,
          background: 'linear-gradient(160deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.05) 60%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(139,92,246,0.22)', backdropFilter: 'blur(20px)',
          padding: '26px 22px', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(139,92,246,0.12)',
          animation: 'purple-pulse 4s ease-in-out infinite', overflow: 'hidden',
        }}>
          {/* Best Value badge */}
          <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(90deg,#8b5cf6,#a855f7,#6366f1)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(139,92,246,0.6), 0 4px 12px rgba(0,0,0,0.4)', letterSpacing: '0.05em' }}>
              👑 Best Value
            </div>
          </div>
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.4),transparent)' }} />
          <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14, marginTop: 12 }}>👑</div>
          <h3 style={{ fontSize: 19, fontWeight: 800, color: '#f1f5f9', marginBottom: 3 }}>Annual Premium</h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 18 }}>বছরে ২ মাস একদম বিনামূল্যে</p>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, textDecoration: 'line-through', fontWeight: 600 }}>৳11,988</span>
              <span style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.28)', color: '#c4b5fd', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999 }}>৳1,989 সাশ্রয়</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 50, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, textShadow: '0 0 30px rgba(139,92,246,0.3)' }}>৳9,999</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>/year</span>
            </div>
            <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 600, marginTop: 6 }}>মাসে মাত্র ৳833 — ২ মাস ফ্রি!</p>
          </div>

          <ul style={{ listStyle: 'none', flex: 1, marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {features.annual.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>
                <Check color="#a78bfa" /> {f}
              </li>
            ))}
          </ul>

          <button style={{ width: '100%', height: 42, borderRadius: 10, border: 'none', background: 'linear-gradient(90deg,#7c3aed,#6366f1)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 18px rgba(139,92,246,0.4)' }}>
            Annual Plan নিন
          </button>
        </div>

      </div>

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 13 13"><circle cx="6.5" cy="6.5" r="6.5" fill="rgba(34,197,94,0.2)" /><path d="M3.5 6.5l2 2L10 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        কোনো hidden fee নেই · যেকোনো সময় cancel করুন · SSL secured payment
      </p>
    </div>
  );
}
