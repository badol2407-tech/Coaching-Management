import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { completeUser, getFirebaseError, readUser, saveMembership, saveOwner, signInDemo, updatePlan, type Plan, type Role, type UserRecord } from '@/lib/firebase';
import { ArrowRight, BadgeCheck, BookOpen, Building2, Check, ChevronLeft, CircleUserRound, GraduationCap, KeyRound, LoaderCircle, LockKeyhole, Menu, RotateCcw, School, ShieldCheck, Sparkles, UsersRound, WalletCards, X } from 'lucide-react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const roles: Array<{ id: Role; title: string; detail: string; icon: typeof School }> = [
  { id: 'owner', title: 'School / Coaching Owner', detail: 'Set up your organization and invite your community.', icon: Building2 },
  { id: 'teacher', title: 'Teacher', detail: 'Plan lessons, share resources, and stay close to progress.', icon: BookOpen },
  { id: 'student', title: 'Student', detail: 'Find your learning space and pick up where you left off.', icon: GraduationCap },
  { id: 'guardian', title: 'Guardian', detail: 'See the bigger picture of a learner’s journey.', icon: CircleUserRound },
  { id: 'staff', title: 'Administrative Staff', detail: 'Keep the day-to-day rhythm of your organization moving.', icon: ShieldCheck },
];

const plans: Array<{ id: Plan; name: string; price: string; cadence: string; description: string; featured?: boolean; perks: string[] }> = [
  { id: 'free', name: 'Free Forever', price: '$0', cadence: 'for your first 100 students', description: 'A generous home base for getting started.', perks: ['Core workspace', 'Class & roster basics'] },
  { id: 'monthly', name: 'Premium Monthly', price: '$19', cadence: 'per month, pause anytime', description: 'More room for a growing learning community.', featured: true, perks: ['Advanced insights', 'Automations & priority care'] },
  { id: 'yearly', name: 'Premium Yearly', price: '$190', cadence: 'per year, two months on us', description: 'The considered choice for teams building momentum.', perks: ['Everything in Premium', 'Year-round savings'] },
];

const roleLabels: Record<Role, string> = {
  owner: 'Owner',
  teacher: 'Teacher',
  student: 'Student',
  guardian: 'Guardian',
  staff: 'Staff',
};

function AppLoader({ label = 'Opening your private workspace' }: { label?: string }) {
  return (
    <div className="texture-overlay flex min-h-[100dvh] items-center justify-center bg-[#eee9dc] px-6">
      <div className="w-full max-w-sm animate-rise text-center">
        <div className="mx-auto mb-7 flex size-14 items-center justify-center rounded-[20px] bg-[#232b48] text-[#f5cf51] shadow-lg">
          <Sparkles className="size-6" />
        </div>
        <div className="mx-auto mb-4 h-1.5 w-28 overflow-hidden rounded-full bg-[#d9d1c0]">
          <div className="progress-sheen h-full w-2/3 rounded-full bg-[#ed6849]" />
        </div>
        <p className="eyebrow text-[#6f6b66]" data-testid="status-loading">{label}</p>
      </div>
    </div>
  );
}

function FirebaseErrorState({ onRetry, compact = false }: { onRetry: () => void; compact?: boolean }) {
  return (
    <div className={`texture-overlay flex min-h-[100dvh] items-center justify-center bg-[#eee9dc] px-6 ${compact ? 'min-h-0 py-20' : ''}`}>
      <div className="glass-card w-full max-w-lg rounded-[28px] p-7 text-center sm:p-10 animate-rise">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-[#f7d8cb] text-[#bc4c36]">
          <WifiOffIcon />
        </div>
        <p className="eyebrow mb-3 text-[#bc4c36]">Connection needed</p>
        <h1 className="font-serif text-3xl font-semibold tracking-[-.03em] text-[#232b48]">Flowora needs a secure connection.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6f6b66]" data-testid="status-firebase-error">
          We couldn’t complete the secure Firebase connection, so your onboarding cannot be safely saved. Check the Firebase setup, then try again.
        </p>
        <button type="button" onClick={onRetry} data-testid="button-retry-firebase" className="focus-ring mt-7 inline-flex items-center gap-2 rounded-full bg-[#232b48] px-5 py-3 text-sm font-semibold text-[#f8f3e7] transition hover:-translate-y-0.5 hover:bg-[#303a60]">
          <RotateCcw className="size-4" /> Try the connection again
        </button>
      </div>
    </div>
  );
}

function WifiOffIcon() {
  return <div className="relative"><LockKeyhole className="size-6" /><X className="absolute -bottom-1 -right-2 size-3.5 stroke-[3]" /></div>;
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex size-9 items-center justify-center rounded-[13px] ${inverse ? 'bg-[#f5cf51] text-[#232b48]' : 'bg-[#232b48] text-[#f5cf51]'}`}>
        <Sparkles className="size-[18px]" />
      </div>
      <span className={`font-serif text-[25px] font-semibold tracking-[-.06em] ${inverse ? 'text-[#f8f3e7]' : 'text-[#232b48]'}`}>flowora</span>
    </div>
  );
}

function ProgressRail({ step }: { step: number }) {
  const items = ['Your role', 'Your organization', 'Your plan', 'Your workspace'];
  return (
    <aside className="hidden min-h-[100dvh] w-[330px] shrink-0 flex-col justify-between bg-[#232b48] p-8 text-[#f8f3e7] lg:flex xl:w-[370px]">
      <div>
        <BrandMark inverse />
        <div className="mt-28">
          <p className="eyebrow mb-4 text-[#aab0c4]">A gentler way to organize learning</p>
          <h2 className="max-w-[230px] font-serif text-[38px] leading-[1.02] tracking-[-.05em]">Make space for what matters.</h2>
          <p className="mt-5 max-w-[240px] text-sm leading-6 text-[#bfc4d4]">A small beginning for a workspace that will grow around your people.</p>
        </div>
      </div>
      <div>
        <div className="mb-5 flex items-center gap-2">
          {[0, 1, 2, 3].map((point) => <span key={point} className={`h-1.5 rounded-full transition-all duration-500 ${point <= step ? 'w-9 bg-[#f5cf51]' : 'w-4 bg-[#59617a]'}`} />)}
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item} className={`flex items-center gap-3 text-sm transition-colors ${index === step ? 'text-[#f5cf51]' : index < step ? 'text-[#bfc4d4]' : 'text-[#737b95]'}`}>
              <span className={`flex size-6 items-center justify-center rounded-full border text-[11px] ${index < step ? 'border-[#f5cf51] bg-[#f5cf51] text-[#232b48]' : index === step ? 'border-[#f5cf51]' : 'border-[#59617a]'}`}>
                {index < step ? <Check className="size-3.5" /> : index + 1}
              </span>
              {item}
            </div>
          ))}
        </div>
        <p className="mt-9 text-xs text-[#8991aa]">Private by design · 2026</p>
      </div>
    </aside>
  );
}

function RoleStep({ role, setRole, onNext }: { role: Role | null; setRole: (role: Role) => void; onNext: () => void }) {
  return (
    <div className="animate-rise">
      <p className="eyebrow mb-5 text-[#ed6849]">Welcome to Flowora</p>
      <h1 className="max-w-[620px] font-serif text-4xl font-semibold leading-[1.05] tracking-[-.045em] text-[#232b48] sm:text-[54px]">First, tell us how you’ll use your space.</h1>
      <p className="mt-5 max-w-[520px] text-base leading-7 text-[#6f6b66]">We’ll shape the first view around your work. You can always invite the rest of your community later.</p>
      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {roles.map(({ id, title, detail, icon: Icon }, index) => {
          const selected = role === id;
          return (
            <button type="button" key={id} onClick={() => setRole(id)} data-testid={`button-role-${id}`} aria-pressed={selected} className={`focus-ring group flex min-h-[116px] items-start gap-4 rounded-[22px] border p-5 text-left transition duration-300 hover:-translate-y-1 ${selected ? 'border-[#ed6849] bg-[#f7d8cb]/65 shadow-[0_16px_28px_-20px_#bc4c36]' : 'border-[#d9d1c0] bg-[#f8f3e7]/60 hover:border-[#b8ad98] hover:bg-[#f8f3e7]'}`}>
              <span className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[14px] transition-colors ${selected ? 'bg-[#ed6849] text-[#f8f3e7]' : 'bg-[#e2dacb] text-[#59617a] group-hover:bg-[#f5cf51] group-hover:text-[#232b48]'}`}><Icon className="size-[19px]" /></span>
              <span><span className="block text-[15px] font-semibold text-[#232b48]">{title}</span><span className="mt-1 block text-xs leading-5 text-[#77736d]">{detail}</span></span>
              {selected && <Check className="ml-auto mt-1 size-4 shrink-0 text-[#bc4c36]" />}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={onNext} disabled={!role} data-testid="button-continue-role" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-[#232b48] px-6 py-3.5 text-sm font-semibold text-[#f8f3e7] transition hover:-translate-y-0.5 hover:bg-[#303a60] disabled:cursor-not-allowed disabled:opacity-40">
        Continue <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

function OrganizationStep({ role, count, setCount, code, setCode, onBack, onNext, saving, error }: { role: Role; count: string; setCount: (value: string) => void; code: string; setCode: (value: string) => void; onBack: () => void; onNext: () => void; saving: boolean; error: string }) {
  const isOwner = role === 'owner';
  const normalized = code.trim().toUpperCase();
  const recognized = normalized === 'FLOW-2026' || normalized === 'COACH-101';
  const hasCode = normalized.length > 0;
  return (
    <div className="animate-rise">
      <button type="button" onClick={onBack} data-testid="button-back-organization" className="focus-ring mb-8 inline-flex items-center gap-2 text-sm text-[#77736d] transition hover:text-[#232b48]"><ChevronLeft className="size-4" /> Back</button>
      <p className="eyebrow mb-5 text-[#ed6849]">{isOwner ? 'Your organization' : 'Find your organization'}</p>
      <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-[-.045em] text-[#232b48] sm:text-[50px]">{isOwner ? 'How many learners are you making room for?' : 'Where does your work happen?'}</h1>
      <p className="mt-5 max-w-[490px] text-base leading-7 text-[#6f6b66]">{isOwner ? 'A starting count helps us tune your workspace. It can change as your community grows.' : 'Enter the code shared by your school or coaching organization.'}</p>
      <div className="mt-9 max-w-[520px]">
        {isOwner ? (
          <label className="block"><span className="eyebrow mb-3 block text-[#77736d]">Current student count</span><div className="relative"><UsersRound className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#ed6849]" /><input type="number" min="1" value={count} onChange={(event) => setCount(event.target.value)} data-testid="input-student-count" placeholder="e.g. 240" className="focus-ring h-14 w-full rounded-[17px] border border-[#d9d1c0] bg-[#f8f3e7] pl-12 pr-4 text-lg text-[#232b48] outline-none transition placeholder:text-[#a8a196] focus:border-[#ed6849]" /></div></label>
        ) : (
          <label className="block"><span className="eyebrow mb-3 block text-[#77736d]">Organization code</span><div className="relative"><KeyRound className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#ed6849]" /><input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} data-testid="input-organization-code" placeholder="FLOW-2026" autoCapitalize="characters" className="focus-ring h-14 w-full rounded-[17px] border border-[#d9d1c0] bg-[#f8f3e7] pl-12 pr-4 font-mono text-lg tracking-[.08em] text-[#232b48] outline-none transition placeholder:text-[#a8a196] focus:border-[#ed6849]" /></div>
            {hasCode && <div className={`mt-3 flex items-start gap-2 rounded-[14px] px-4 py-3 text-xs leading-5 ${recognized ? 'bg-[#d8e3d9] text-[#42614f]' : 'bg-[#f5e4bb] text-[#735d2a]'}`} data-testid="status-organization-code">{recognized ? <BadgeCheck className="mt-0.5 size-4 shrink-0" /> : <KeyRound className="mt-0.5 size-4 shrink-0" />}<span>{recognized ? 'Organization found. You’ll join automatically after we set up your plan.' : 'We’ll send a join request to this organization’s admin. You can continue while they review it.'}</span></div>}
          </label>
        )}
        {error && <p className="mt-3 text-sm text-[#bc4c36]" data-testid="status-organization-error">{error}</p>}
      </div>
      <button type="button" onClick={onNext} disabled={saving || (isOwner ? !count || Number(count) < 1 : !hasCode)} data-testid="button-continue-organization" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-[#232b48] px-6 py-3.5 text-sm font-semibold text-[#f8f3e7] transition hover:-translate-y-0.5 hover:bg-[#303a60] disabled:cursor-not-allowed disabled:opacity-40">
        {saving ? <><LoaderCircle className="size-4 animate-spin" /> Saving securely</> : <>Continue <ArrowRight className="size-4" /></>}
      </button>
    </div>
  );
}

function PlanStep({ selected, onSelect, onBack, onNext, saving }: { selected: Plan; onSelect: (plan: Plan) => void; onBack: () => void; onNext: () => void; saving: boolean }) {
  return (
    <div className="animate-rise">
      <button type="button" onClick={onBack} data-testid="button-back-plan" className="focus-ring mb-8 inline-flex items-center gap-2 text-sm text-[#77736d] transition hover:text-[#232b48]"><ChevronLeft className="size-4" /> Back</button>
      <p className="eyebrow mb-5 text-[#ed6849]">A good place to begin</p>
      <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-[-.045em] text-[#232b48] sm:text-[50px]">Choose the pace that feels right.</h1>
      <p className="mt-5 max-w-[510px] text-base leading-7 text-[#6f6b66]">You can change your plan as your organization evolves. No decisions are permanent here.</p>
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const active = selected === plan.id;
          return (
            <button type="button" key={plan.id} onClick={() => onSelect(plan.id)} data-testid={`button-plan-${plan.id}`} aria-pressed={active} className={`focus-ring relative flex min-h-[260px] flex-col rounded-[23px] border p-5 text-left transition duration-300 hover:-translate-y-1.5 ${active ? 'border-[#ed6849] bg-[#f7d8cb]/70 shadow-[0_22px_35px_-24px_#bc4c36]' : 'border-[#d9d1c0] bg-[#f8f3e7]/60 hover:border-[#b8ad98] hover:bg-[#f8f3e7]'}`}>
              {plan.featured && <span className="absolute right-4 top-4 rounded-full bg-[#f5cf51] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.1em] text-[#232b48]">Most chosen</span>}
              <span className={`mb-7 flex size-10 items-center justify-center rounded-[14px] ${active ? 'bg-[#ed6849] text-[#f8f3e7]' : 'bg-[#e2dacb] text-[#59617a]'}`}><WalletCards className="size-[18px]" /></span>
              <span className="text-[15px] font-semibold text-[#232b48]">{plan.name}</span>
              <span className="mt-3 font-serif text-3xl font-semibold tracking-[-.04em] text-[#232b48]">{plan.price}</span>
              <span className="mt-1 text-[11px] text-[#77736d]">{plan.cadence}</span>
              <span className="mt-4 text-xs leading-5 text-[#6f6b66]">{plan.description}</span>
              <span className="mt-auto border-t border-[#d9d1c0] pt-4 text-[11px] leading-5 text-[#59617a]">{plan.perks.join(' · ')}</span>
              {active && <span className="absolute bottom-5 right-5 flex size-5 items-center justify-center rounded-full bg-[#ed6849] text-[#f8f3e7]"><Check className="size-3.5" /></span>}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={onNext} disabled={saving} data-testid="button-continue-plan" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-[#232b48] px-6 py-3.5 text-sm font-semibold text-[#f8f3e7] transition hover:-translate-y-0.5 hover:bg-[#303a60] disabled:cursor-not-allowed disabled:opacity-40">
        {saving ? <><LoaderCircle className="size-4 animate-spin" /> Saving your choice</> : <>Continue <ArrowRight className="size-4" /></>}
      </button>
    </div>
  );
}

function PreparingStep() {
  return (
    <div className="flex min-h-[540px] animate-rise flex-col items-center justify-center text-center">
      <div className="relative mb-9 flex size-28 items-center justify-center rounded-[35px] bg-[#232b48] text-[#f5cf51] shadow-[0_24px_55px_-24px_#232b48]">
        <Sparkles className="size-9 animate-pulse" />
        <span className="absolute -right-2 -top-2 size-4 animate-pulse rounded-full bg-[#ed6849]" />
        <span className="absolute -bottom-1 -left-3 size-3 rounded-full bg-[#5e9183]" />
      </div>
      <p className="eyebrow mb-4 text-[#ed6849]">One last thoughtful pause</p>
      <h1 className="font-serif text-5xl font-semibold tracking-[-.05em] text-[#232b48] sm:text-6xl">Preparing your workspace...</h1>
      <p className="mt-5 max-w-md text-sm leading-6 text-[#6f6b66]">Placing the right essentials in the right places. This will only take a moment.</p>
      <div className="progress-sheen mt-9 h-2 w-full max-w-[330px] rounded-full bg-[#d9d1c0]"><div className="h-full w-full rounded-full bg-[#ed6849] opacity-75" /></div>
      <div className="mt-4 flex items-center gap-2 text-xs text-[#77736d]"><span className="size-1.5 animate-[pulse-dot_1.2s_ease-in-out_infinite] rounded-full bg-[#ed6849]" /><span className="size-1.5 animate-[pulse-dot_1.2s_ease-in-out_.2s_infinite] rounded-full bg-[#ed6849]" /><span className="size-1.5 animate-[pulse-dot_1.2s_ease-in-out_.4s_infinite] rounded-full bg-[#ed6849]" /> Tuning your view</div>
    </div>
  );
}

function Onboarding() {
  const [, setLocation] = useLocation();
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState('');
  const [uid, setUid] = useState('');
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [count, setCount] = useState('');
  const [code, setCode] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan>('free');
  const [saving, setSaving] = useState(false);

  const bootstrap = async () => {
    setBooting(true);
    setError('');
    try {
      if (getFirebaseError()) throw getFirebaseError();
      const user = await signInDemo();
      setUid(user.uid);
      const record = await readUser(user.uid);
      if (record?.completedOnboarding && record.role) setLocation(`/dashboard/${record.role}`);
      else if (record?.role) {
        setRole(record.role);
        setSelectedPlan(record.selectedPlan ?? 'free');
        if (record.studentCount) setCount(String(record.studentCount));
        if (record.organizationCode) setCode(record.organizationCode);
        setBooting(false);
      } else setBooting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to Firebase.');
      setBooting(false);
    }
  };

  useEffect(() => { void bootstrap(); }, []);

  const finish = async () => {
    if (!uid || !role) return;
    setSaving(true);
    setError('');
    try {
      await completeUser(uid);
      setTimeout(() => setLocation(`/dashboard/${role}`), 1700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your workspace could not be completed.');
      setSaving(false);
    }
  };

  const submitOrganization = async () => {
    if (!uid || !role) return;
    setSaving(true);
    setError('');
    try {
      if (role === 'owner') await saveOwner(uid, Number(count), selectedPlan);
      else await saveMembership(uid, role, code, selectedPlan);
      setSaving(false);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not save your organization details.');
      setSaving(false);
    }
  };

  const submitPlan = async () => {
    if (!uid) return;
    setSaving(true);
    setError('');
    try {
      await updatePlan(uid, selectedPlan);
      setStep(3);
      await finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not save your plan.');
      setSaving(false);
    }
  };

  const selectPlan = async (plan: Plan) => {
    setSelectedPlan(plan);
    if (!uid) return;
    try { await updatePlan(uid, plan); }
    catch (err) { setError(err instanceof Error ? err.message : 'We could not save your plan.'); }
  };

  if (booting) return <AppLoader />;
  if (error && !uid) return <FirebaseErrorState onRetry={() => void bootstrap()} />;

  return (
    <div className="texture-overlay flex min-h-[100dvh] bg-[#eee9dc]">
      <ProgressRail step={step} />
      <main className="relative flex min-h-[100dvh] flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 animate-drift rounded-[40%] bg-[#f5cf51]/25 blur-[1px]" />
        <div className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
          <div className="lg:hidden"><BrandMark /></div>
          <div className="ml-auto flex items-center gap-2 text-xs text-[#77736d]"><span className="hidden sm:inline">Already have a space?</span><span className="font-semibold text-[#232b48]">Demo onboarding</span><span className="flex size-7 items-center justify-center rounded-full border border-[#d9d1c0]"><Menu className="size-3.5" /></span></div>
        </div>
        <div className="mx-auto flex w-full max-w-[920px] flex-1 items-start px-6 pb-12 pt-9 sm:px-10 sm:pt-16 lg:px-16 lg:pt-20">
          <div className="w-full">
            {error && <div className="mb-6 flex items-center justify-between gap-3 rounded-[15px] border border-[#ebc5b9] bg-[#f7d8cb]/55 px-4 py-3 text-sm text-[#9b4433]" data-testid="status-save-error"><span>{error}</span><button type="button" onClick={() => setError('')} data-testid="button-dismiss-error" aria-label="Dismiss error"><X className="size-4" /></button></div>}
            {step === 0 && <RoleStep role={role} setRole={setRole} onNext={() => setStep(1)} />}
            {step === 1 && role && <OrganizationStep role={role} count={count} setCount={setCount} code={code} setCode={setCode} onBack={() => setStep(0)} onNext={() => void submitOrganization()} saving={saving} error="" />}
            {step === 2 && <PlanStep selected={selectedPlan} onSelect={(plan) => void selectPlan(plan)} onBack={() => setStep(1)} onNext={() => void submitPlan()} saving={saving} />}
            {step === 3 && <PreparingStep />}
          </div>
        </div>
        <footer className="px-6 pb-6 text-xs text-[#918b80] sm:px-10 lg:px-16"><span className="font-mono">FLOWORA / ONBOARDING</span><span className="mx-2">·</span> Your information stays with your organization.</footer>
      </main>
    </div>
  );
}

function Dashboard({ role: routeRole }: { role: Role }) {
  const [, setLocation] = useLocation();
  const [record, setRecord] = useState<UserRecord | null>(null);
  const [uid, setUid] = useState('');
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState('');
  const roleInfo = useMemo(() => roles.find((item) => item.id === routeRole) ?? roles[0], [routeRole]);

  const bootstrap = async () => {
    setBooting(true);
    setError('');
    try {
      if (getFirebaseError()) throw getFirebaseError();
      const user = await signInDemo();
      const data = await readUser(user.uid);
      if (!data?.completedOnboarding) {
        setLocation('/');
        return;
      }
      if (data.role !== routeRole) {
        setLocation(`/dashboard/${data.role}`);
        return;
      }
      setUid(user.uid);
      setRecord(data);
      setBooting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load this workspace.');
      setBooting(false);
    }
  };
  useEffect(() => { void bootstrap(); }, []);

  if (booting) return <AppLoader label="Loading your Flowora dashboard" />;
  if (error) return <FirebaseErrorState onRetry={() => void bootstrap()} />;
  if (!record) return null;

  const isPending = record.organizationStatus === 'pending';
  return (
    <div className="texture-overlay min-h-[100dvh] bg-[#eee9dc]">
      <header className="flex items-center justify-between border-b border-[#d9d1c0] bg-[#f8f3e7]/70 px-6 py-5 backdrop-blur sm:px-10 lg:px-16">
        <BrandMark />
        <div className="flex items-center gap-4"><span className="eyebrow hidden text-[#77736d] sm:block">{roleLabels[routeRole]} view</span><span className="flex size-9 items-center justify-center rounded-full bg-[#f5cf51] text-sm font-semibold text-[#232b48]" data-testid="avatar-demo-user">D</span></div>
      </header>
      <main className="mx-auto max-w-[1180px] px-6 pb-20 pt-12 sm:px-10 sm:pt-20 lg:px-16">
        <div className="animate-rise grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5 text-[#ed6849]" data-testid="text-dashboard-kicker">Your {roleLabels[routeRole].toLowerCase()} workspace</p>
            <h1 className="max-w-2xl font-serif text-5xl font-semibold leading-[.98] tracking-[-.055em] text-[#232b48] sm:text-7xl">Good to have you here.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#6f6b66]">The first view is ready for you. Flowora keeps the busywork light so your attention can stay with the people who make this place feel alive.</p>
          </div>
          <div className="animate-rise-delay-2 rounded-[28px] bg-[#232b48] p-6 text-[#f8f3e7] shadow-[0_24px_48px_-28px_#232b48] sm:p-8">
            <div className="flex items-start justify-between"><span className="eyebrow text-[#aab0c4]">Workspace status</span><span className="flex size-10 items-center justify-center rounded-[14px] bg-[#f5cf51] text-[#232b48]"><BadgeCheck className="size-5" /></span></div>
            <h2 className="mt-10 font-serif text-3xl tracking-[-.04em]">You’re all set.</h2>
            <p className="mt-2 text-sm leading-6 text-[#bfc4d4]">{isPending ? 'Your join request is with the organization admin.' : 'Your organization and role have been saved securely.'}</p>
            <div className="mt-7 flex flex-wrap gap-2"><span className="rounded-full bg-[#59617a] px-3 py-1.5 text-xs text-[#f8f3e7]" data-testid="status-organization">{isPending ? 'Join request pending' : 'Organization connected'}</span><span className="rounded-full bg-[#59617a] px-3 py-1.5 text-xs text-[#f8f3e7]" data-testid="status-plan">{record.selectedPlan === 'free' ? 'Free Forever' : record.selectedPlan === 'monthly' ? 'Premium Monthly' : 'Premium Yearly'}</span></div>
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="glass-card rounded-[23px] p-6"><div className="mb-12 flex size-10 items-center justify-center rounded-[14px] bg-[#f7d8cb] text-[#bc4c36]"><roleInfo.icon className="size-[18px]" /></div><p className="eyebrow text-[#77736d]">Your role</p><p className="mt-2 font-serif text-2xl tracking-[-.03em] text-[#232b48]" data-testid="text-dashboard-role">{roleInfo.title}</p></div>
          <div className="glass-card rounded-[23px] p-6"><div className="mb-12 flex size-10 items-center justify-center rounded-[14px] bg-[#d8e3d9] text-[#42614f]"><Building2 className="size-[18px]" /></div><p className="eyebrow text-[#77736d]">Organization</p><p className="mt-2 font-serif text-2xl tracking-[-.03em] text-[#232b48]" data-testid="text-dashboard-organization">{record.organizationCode ?? 'New organization'}</p></div>
          <div className="glass-card rounded-[23px] p-6"><div className="mb-12 flex size-10 items-center justify-center rounded-[14px] bg-[#f5e4bb] text-[#735d2a]"><UsersRound className="size-[18px]" /></div><p className="eyebrow text-[#77736d]">Learner community</p><p className="mt-2 font-serif text-2xl tracking-[-.03em] text-[#232b48]" data-testid="text-dashboard-students">{record.studentCount ? `${record.studentCount} students` : isPending ? 'Pending access' : 'Ready to grow'}</p></div>
        </div>
        <div className="mt-10 border-t border-[#d9d1c0] pt-7"><p className="text-xs text-[#918b80]">Onboarding is complete. A Super Admin can reset access from the organization controls.</p></div>
      </main>
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Onboarding} />
        <Route path="/dashboard/owner"><Dashboard role="owner" /></Route>
        <Route path="/dashboard/teacher"><Dashboard role="teacher" /></Route>
        <Route path="/dashboard/student"><Dashboard role="student" /></Route>
        <Route path="/dashboard/guardian"><Dashboard role="guardian" /></Route>
        <Route path="/dashboard/staff"><Dashboard role="staff" /></Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;