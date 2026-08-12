import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AtSign, Check, ChevronRight, CircleX, Loader2, Sparkles, UserRound } from "lucide-react";
import { doc, getDoc, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

type SetupStage = "name" | "username";
type Availability = "idle" | "checking" | "available" | "taken" | "error";

const cleanUsername = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);

export default function ProfileSetup() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const inferredFirstName = useMemo(() => {
    const fromProfile = userProfile?.firstName?.trim() || userProfile?.name?.trim().split(/\s+/)[0];
    const fromAuth = user?.displayName?.trim().split(/\s+/)[0];
    return fromProfile || fromAuth || user?.email?.split("@")[0] || "";
  }, [user, userProfile]);
  const [stage, setStage] = useState<SetupStage>(
    userProfile?.profileSetupStep === "username" ? "username" : "name",
  );
  const firstName = inferredFirstName;
  const [lastName, setLastName] = useState(userProfile?.lastName ?? "");
  const [username, setUsername] = useState(
    cleanUsername(userProfile?.username ?? ""),
  );
  const [usernameTouched, setUsernameTouched] = useState(Boolean(userProfile?.username));
  const [availability, setAvailability] = useState<Availability>("idle");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!inferredFirstName || usernameTouched || !user?.uid) return;
    const base = cleanUsername(`${inferredFirstName}${lastName}`);
    if (base.length < 3) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        for (let suffix = 0; suffix < 100; suffix += 1) {
          const candidate = cleanUsername(`${base}${suffix === 0 ? "" : suffix}`);
          const snapshot = await getDoc(doc(db, "usernames", candidate));
          if (!snapshot.exists() || snapshot.data()?.uid === user.uid) {
            if (!cancelled) {
              setUsername(candidate);
              setAvailability("available");
            }
            return;
          }
        }
        if (!cancelled) setUsername(base);
      } catch {
        if (!cancelled) setAvailability("error");
      }
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [inferredFirstName, lastName, user?.uid, usernameTouched]);

  useEffect(() => {
    if (!lastName && userProfile?.lastName) setLastName(userProfile.lastName);
  }, [lastName, userProfile?.lastName]);

  useEffect(() => {
    const candidate = cleanUsername(username);
    if (candidate.length < 3) {
      setAvailability("idle");
      return;
    }
    setAvailability("checking");
    const timer = window.setTimeout(async () => {
      try {
        const snapshot = await getDoc(doc(db, "usernames", candidate));
        setAvailability(snapshot.exists() && snapshot.data()?.uid !== user?.uid ? "taken" : "available");
      } catch {
        setAvailability("error");
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [username, user?.uid]);

  const continueToUsername = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!lastName.trim()) {
      setError("Add your last name to continue.");
      return;
    }
    if (!user) {
      setError("Your session is still loading. Please try again.");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        profileSetupStep: "username",
        updatedAt: serverTimestamp(),
      });
    } catch {
      setError("We could not save your name. Check your connection and try again.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setStage("username");
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    const candidate = cleanUsername(username);
    if (!user) {
      setError("Your session is still loading. Please try again.");
      return;
    }
    if (candidate.length < 3 || availability !== "available") {
      setError(availability === "taken" ? "That username is already in use." : "Choose an available username.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await runTransaction(db, async (transaction) => {
        const usernameRef = doc(db, "usernames", candidate);
        const userRef = doc(db, "users", user.uid);
        const usernameSnapshot = await transaction.get(usernameRef);
        if (usernameSnapshot.exists() && usernameSnapshot.data()?.uid !== user.uid) {
          throw new Error("USERNAME_TAKEN");
        }
        transaction.set(usernameRef, { uid: user.uid, username: candidate, updatedAt: serverTimestamp() });
        transaction.set(userRef, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          username: candidate,
          profileSetupStep: "questions",
          onboardingCompleted: false,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      });
      setLocation("/onboarding-questions");
    } catch (cause) {
      setError(cause instanceof Error && cause.message === "USERNAME_TAKEN"
        ? "That username was just claimed. Try another one."
        : "We could not save your profile. Check your connection and try again.");
      setAvailability("taken");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <SetupShell><LoadingState /></SetupShell>;
  }

  return (
    <SetupShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Your first day</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">Let&apos;s make it yours.</h1>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Sparkles size={21} /></div>
      </div>
      <Progress stage={stage} />
      <AnimatePresence mode="wait">
        {stage === "name" ? (
          <motion.form key="name" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} onSubmit={continueToUsername} className="mt-9 space-y-7">
            <div>
              <p className="text-sm font-medium text-slate-500">A little context goes a long way</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">How should we introduce you?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">This is the name your team will see around EduTrack.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" value={firstName} icon={<UserRound size={17} />} readOnly id="input-first-name" />
              <Field label="Last name" value={lastName} icon={<UserRound size={17} />} onChange={setLastName} placeholder="Your family name" id="input-last-name" autoFocus />
            </div>
            {error && <ErrorMessage message={error} />}
             <button data-testid="button-continue-name" disabled={saving} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60">
               {saving ? <><Loader2 size={17} className="animate-spin" /> Saving...</> : <>Continue <ChevronRight size={17} className="transition group-hover:translate-x-0.5" /></>}
            </button>
          </motion.form>
        ) : (
          <motion.form key="username" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} onSubmit={saveProfile} className="mt-9 space-y-7">
            <div>
              <p className="text-sm font-medium text-slate-500">A name people can remember</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Choose your username.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Use it to keep your coaching space easy to find and share.</p>
            </div>
            <div>
              <label htmlFor="input-username" className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
               <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input data-testid="input-username" id="input-username" value={username} onChange={(event) => { setUsernameTouched(true); setUsername(cleanUsername(event.target.value)); }} className={`w-full rounded-2xl border bg-white/70 py-3.5 pl-11 pr-12 text-base text-slate-900 outline-none transition focus:ring-4 ${availability === "available" ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100" : availability === "taken" || availability === "error" ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"}`} autoFocus />
                {availability === "checking" && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400" size={18} />}
                {availability === "available" && <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />}
                 {(availability === "taken" || availability === "error") && <CircleX className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-600" size={18} />}
              </div>
              <p data-testid="status-username-availability" className={`mt-2 text-xs ${availability === "available" ? "text-emerald-600" : availability === "taken" || availability === "error" || (username.length > 0 && username.length < 3) ? "text-rose-600" : "text-slate-400"}`}>
                {availability === "available" ? "This username is available." : availability === "taken" ? "That username is already taken." : availability === "error" ? "Availability could not be checked." : username.length > 0 && username.length < 3 ? "Use at least 3 characters." : "Lowercase letters, numbers, and underscores."}
              </p>
            </div>
            {error && <ErrorMessage message={error} />}
            <div className="flex gap-3">
              <button type="button" data-testid="button-back-name" onClick={() => setStage("name")} className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-white">Back</button>
              <button data-testid="button-save-profile" disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? <><Loader2 size={17} className="animate-spin" /> Saving...</> : <>Save and continue <ChevronRight size={17} /></>}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </SetupShell>
  );
}

function Field({ label, value, onChange, placeholder, icon, readOnly, id, autoFocus }: { label: string; value: string; onChange?: (value: string) => void; placeholder?: string; icon: React.ReactNode; readOnly?: boolean; id: string; autoFocus?: boolean }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span><input data-testid={id} id={id} value={value} readOnly={readOnly} autoFocus={autoFocus} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className={`w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${readOnly ? "bg-slate-50 text-slate-500" : "bg-white/70 text-slate-900"}`} /></div></div>;
}

function Progress({ stage }: { stage: SetupStage }) {
  return <div className="flex items-center gap-3" aria-label="Profile setup progress"><div className="flex flex-1 gap-1.5">{["name", "username", "questions"].map((item, index) => <div key={item} className={`h-1.5 flex-1 rounded-full ${index <= (stage === "name" ? 0 : 1) ? "bg-indigo-600" : "bg-slate-200"}`} />)}</div><span className="text-xs font-medium text-slate-400">{stage === "name" ? "1" : "2"} of 3</span></div>;
}

function SetupShell({ children }: { children: React.ReactNode }) {
  return <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#f4f5fb] px-4 py-8 text-slate-900 sm:px-6"><div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" /><div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" /><section className="relative w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-[0_30px_80px_-35px_rgba(50,55,100,.35)] backdrop-blur-2xl sm:p-10">{children}<p className="mt-10 text-center text-xs text-slate-400">EduTrack · a calmer way to run your coaching center</p></section></main>;
}

function LoadingState() {
  return <div data-testid="status-profile-loading" className="space-y-4"><div className="h-4 w-28 animate-pulse rounded bg-slate-200" /><div className="h-9 w-3/4 animate-pulse rounded bg-slate-200" /><div className="h-32 animate-pulse rounded-2xl bg-slate-100" /></div>;
}

function ErrorMessage({ message }: { message: string }) {
  return <div data-testid="status-profile-error" role="alert" className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-700"><AlertCircle size={17} />{message}</div>;
}