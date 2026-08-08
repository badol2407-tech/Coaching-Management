import { useAuth } from "@/contexts/AuthContext";
import { OrgAccessStatus, formatExpiryDate, getRemainingDays } from "@/lib/subscription";
import { getTierLabel, PlanTier } from "@/lib/plan-config";
import { AlertTriangle, Clock, PauseCircle, CreditCard, PhoneCall, LogOut, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  status: OrgAccessStatus;
  tier?: PlanTier;
  subscriptionExpiryDate?: string | null;
}

export function SubscriptionExpiredScreen({ status, tier, subscriptionExpiryDate }: Props) {
  const { logout, userProfile } = useAuth();

  const tierLabel = tier ? getTierLabel(tier) : "Free Trial";
  const remaining = getRemainingDays(subscriptionExpiryDate);
  const expiryFormatted = formatExpiryDate(subscriptionExpiryDate);

  // ── Config per status ──────────────────────────────────────────────────────

  const config = {
    expired: {
      icon: Clock,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-400/10 border-amber-400/20",
      glowColor: "rgba(245,158,11,0.15)",
      title: "Subscription Expired",
      subtitle: `Your ${tierLabel} plan expired on ${expiryFormatted}.`,
      description:
        "Your organization's subscription period has ended. To restore full access, please contact your administrator to renew or upgrade your plan.",
      badge: "EXPIRED",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    paused: {
      icon: PauseCircle,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-400/10 border-blue-400/20",
      glowColor: "rgba(59,130,246,0.15)",
      title: "Organization Paused",
      subtitle: "Your organization account has been temporarily paused.",
      description:
        "Access to the portal has been suspended by an administrator. This may be due to a billing hold, compliance review, or manual pause. Please contact your administrator to resume access.",
      badge: "PAUSED",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    unpaid_blocked: {
      icon: CreditCard,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-400/10 border-rose-400/20",
      glowColor: "rgba(244,63,94,0.15)",
      title: "Payment Required",
      subtitle: `Your ${tierLabel} subscription has not been paid.`,
      description:
        "Access to the portal has been restricted pending payment confirmation. Please ask your administrator to complete the payment to restore full access.",
      badge: "UNPAID",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    },
  } as const;

  const { icon: Icon, iconColor, iconBg, glowColor, title, subtitle, description, badge, badgeColor } =
    config[status as keyof typeof config] ?? config.expired;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #080c14 0%, #0d1528 50%, #0a0f1e 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse 700px 500px at 50% 40%, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-lg rounded-2xl p-8 sm:p-10"
        style={{
          background: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(10,15,30,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/40">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">EduTrack</span>
          {userProfile?.orgName && (
            <span className="text-slate-500 text-xs ml-1">· {userProfile.orgName}</span>
          )}
        </div>

        {/* Icon */}
        <div className={`h-16 w-16 rounded-2xl border flex items-center justify-center mb-6 ${iconBg}`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border mb-4 ${badgeColor}`}
        >
          <AlertTriangle className="h-3 w-3" />
          {badge}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-sm font-medium text-slate-300 mb-4">{subtitle}</p>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">{description}</p>

        {/* Info row */}
        {(tier || subscriptionExpiryDate) && (
          <div
            className="rounded-xl p-4 mb-8 space-y-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {tier && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Plan</span>
                <span className="text-slate-300 font-medium">{tierLabel}</span>
              </div>
            )}
            {subscriptionExpiryDate && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  {status === "expired" ? "Expired on" : "Expiry date"}
                </span>
                <span className="text-slate-300 font-medium">{expiryFormatted}</span>
              </div>
            )}
            {remaining !== null && remaining > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Days remaining</span>
                <span className="text-amber-400 font-bold">{remaining} day{remaining !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <div
            className="flex items-start gap-3 rounded-xl p-4 text-sm"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <PhoneCall className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-indigo-300 font-semibold text-xs">Contact your administrator</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Ask your organization administrator to renew or update your subscription to restore access.
              </p>
            </div>
          </div>

          <Button
            onClick={logout}
            variant="ghost"
            className="w-full gap-2 text-slate-500 hover:text-slate-300 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
