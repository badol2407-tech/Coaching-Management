import { useState, type CSSProperties } from "react";

type SetupCompleteProps = {
  /**
   * The production wrapper supplies the Firestore mutation here. The promise
   * must resolve only after setupWizard.completed and completedAt have saved.
   */
  onComplete?: () => Promise<void>;
  /**
   * Closing the wizard is deliberately separate so it can never run before
   * the completion save resolves.
   */
  onClose?: () => void;
  dashboardPath?: string;
};

const defaultSaveCompletion = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 650);
  });
};

const checklist = [
  "প্রতিষ্ঠান প্রস্তুত",
  "প্রথম Class তৈরি হয়েছে",
  "Teacher Setup সম্পন্ন অথবা Skip হয়েছে",
];

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    color: "#f8fbff",
    background:
      "radial-gradient(circle at 12% 0%, rgba(103, 232, 249, .26), transparent 32%), radial-gradient(circle at 92% 15%, rgba(167, 139, 250, .24), transparent 30%), linear-gradient(145deg, #09132c 0%, #101941 52%, #152151 100%)",
    fontFamily:
      "'Inter', 'Noto Sans Bengali', system-ui, -apple-system, sans-serif",
  },
  ambientGlow: {
    position: "absolute",
    inset: "auto -96px -140px auto",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "rgba(45, 212, 191, .13)",
    filter: "blur(18px)",
    pointerEvents: "none",
  },
  shell: {
    width: "100%",
    maxWidth: "398px",
    position: "relative",
    zIndex: 1,
    padding: "28px 20px 20px",
    border: "1px solid rgba(255, 255, 255, .17)",
    borderRadius: "28px",
    background: "linear-gradient(145deg, rgba(255, 255, 255, .14), rgba(255, 255, 255, .055))",
    boxShadow:
      "0 28px 80px rgba(1, 7, 26, .46), inset 0 1px 0 rgba(255, 255, 255, .12)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  },
  mark: {
    width: "72px",
    height: "72px",
    margin: "0 auto 20px",
    display: "grid",
    placeItems: "center",
    borderRadius: "24px",
    color: "#09213c",
    background: "linear-gradient(145deg, #b7fff0, #6ee7d5)",
    boxShadow: "0 12px 32px rgba(45, 212, 191, .2)",
  },
  markInner: {
    width: "44px",
    height: "44px",
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, .36)",
  },
  heading: {
    margin: 0,
    textAlign: "center",
    fontSize: "clamp(1.55rem, 7vw, 2.05rem)",
    lineHeight: 1.28,
    letterSpacing: "-.035em",
    fontWeight: 760,
  },
  subheading: {
    maxWidth: "300px",
    margin: "12px auto 26px",
    textAlign: "center",
    color: "rgba(226, 236, 255, .7)",
    fontSize: ".92rem",
    lineHeight: 1.55,
  },
  checklist: {
    margin: 0,
    padding: "5px 0",
    listStyle: "none",
    borderTop: "1px solid rgba(255, 255, 255, .12)",
    borderBottom: "1px solid rgba(255, 255, 255, .12)",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 2px",
    color: "#f4f8ff",
    fontSize: ".94rem",
    lineHeight: 1.45,
  },
  check: {
    flex: "0 0 auto",
    width: "26px",
    height: "26px",
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    color: "#baffed",
    background: "rgba(45, 212, 191, .15)",
    border: "1px solid rgba(110, 231, 213, .35)",
    fontSize: "1rem",
    fontWeight: 800,
  },
  button: {
    width: "100%",
    minHeight: "52px",
    marginTop: "24px",
    border: 0,
    borderRadius: "16px",
    color: "#07213c",
    background: "linear-gradient(100deg, #a7f3d0, #67e8f9)",
    boxShadow: "0 10px 26px rgba(45, 212, 191, .18)",
    fontFamily: "inherit",
    fontSize: ".98rem",
    fontWeight: 750,
    cursor: "pointer",
    transition: "transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease",
  },
  error: {
    margin: "14px 0 0",
    padding: "11px 12px",
    border: "1px solid rgba(252, 165, 165, .34)",
    borderRadius: "12px",
    color: "#fecaca",
    background: "rgba(127, 29, 29, .2)",
    fontSize: ".82rem",
    lineHeight: 1.45,
  },
  footer: {
    margin: "18px 0 0",
    textAlign: "center",
    color: "rgba(226, 236, 255, .46)",
    fontSize: ".72rem",
  },
};

export function SetupComplete({
  onComplete = defaultSaveCompletion,
  onClose,
  dashboardPath = "/organization-admin/dashboard",
}: SetupCompleteProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue(): Promise<void> {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      await onComplete();
      onClose?.();
      window.location.assign(dashboardPath);
    } catch {
      setIsSaving(false);
      setError(
        "Workspace সম্পন্ন করা যায়নি। আবার চেষ্টা করুন—আপনার সেটআপ নিরাপদে সংরক্ষিত হয়নি।",
      );
    }
  }

  return (
    <main style={styles.page}>
      <div aria-hidden="true" style={styles.ambientGlow} />
      <section
        aria-labelledby="setup-complete-title"
        aria-describedby="setup-complete-description"
        style={styles.shell}
      >
        <div aria-hidden="true" style={styles.mark}>
          <div style={styles.markInner}>
            <svg
              aria-hidden="true"
              fill="none"
              height="28"
              viewBox="0 0 28 28"
              width="28"
            >
              <path
                d="m7 14.5 4.4 4.4L21.5 8.8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.7"
              />
            </svg>
          </div>
        </div>

        <h1 id="setup-complete-title" style={styles.heading}>
          🎉 আপনার EduTrack Workspace প্রস্তুত!
        </h1>
        <p id="setup-complete-description" style={styles.subheading}>
          আপনার প্রতিষ্ঠান এখন Organization Admin Dashboard থেকে পরিচালনা করার
          জন্য প্রস্তুত।
        </p>

        <ul aria-label="Setup completion checklist" style={styles.checklist}>
          {checklist.map((item) => (
            <li key={item} style={styles.item}>
              <span aria-hidden="true" style={styles.check}>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          aria-busy={isSaving}
          disabled={isSaving}
          onClick={() => void handleContinue()}
          style={{
            ...styles.button,
            opacity: isSaving ? 0.7 : 1,
            cursor: isSaving ? "wait" : "pointer",
          }}
          type="button"
        >
          {isSaving ? "Workspace সংরক্ষণ হচ্ছে…" : "Continue to Dashboard"}
        </button>

        {error ? (
          <p aria-live="assertive" role="alert" style={styles.error}>
            {error}
          </p>
        ) : null}

        <p style={styles.footer}>EduTrack · Flowora Workspace Setup</p>
      </section>
    </main>
  );
}