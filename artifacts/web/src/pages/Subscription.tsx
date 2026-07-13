import { CreditCard, Check, Zap, Shield, Clock, CalendarCheck, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_TIERS, PLAN_CONFIG, PlanTier, getEffectiveTier } from "@/lib/plan-config";
import { getOrgAccessStatus, getRemainingDays, formatExpiryDate } from "@/lib/subscription";
import { useToast } from "@/hooks/use-toast";

const TIER_ICONS: Record<PlanTier, typeof CreditCard> = {
  free_trial: Clock,
  founder_launch: Zap,
  annual_premium: Crown,
};

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function Subscription() {
  const { userProfile, user } = useAuth();
  const { toast } = useToast();

  const sub = userProfile?.orgSubscription;
  const currentTier: PlanTier = sub ? getEffectiveTier(sub) : "free_trial";
  const accessStatus = sub ? getOrgAccessStatus(sub) : "active";
  const remaining = getRemainingDays(sub?.subscriptionExpiryDate);
  const expiryFormatted = formatExpiryDate(sub?.subscriptionExpiryDate);

  async function handleUpgrade(tier: PlanTier) {
    if (!user?.email) {
      toast({ title: "Login required", variant: "destructive" });
      return;
    }
    const cfg = PLAN_CONFIG[tier];
    try {
      const basePath = import.meta.env.BASE_URL ?? "";
      const res = await fetch(`${API_BASE}/api/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: cfg.name,
          amount: cfg.price,
          customerName: userProfile?.name ?? user.displayName ?? "EduTrack User",
          customerEmail: user.email,
          customerPhone: "01700000000",
          basePath: basePath.endsWith("/") ? basePath.slice(0, -1) : basePath,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any;
        throw new Error(err?.error ?? "Payment initiation failed");
      }
      const { gatewayUrl } = await res.json() as { gatewayUrl: string };
      window.location.href = gatewayUrl;
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err?.message ?? "Payment gateway-এ সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Current plan banner */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-4">
        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold">
              Current plan: <span className="text-primary">{PLAN_CONFIG[currentTier].name}</span>
            </p>
            {accessStatus !== "active" && (
              <Badge variant="destructive" className="text-xs capitalize">{accessStatus.replace("_", " ")}</Badge>
            )}
            {accessStatus === "active" && sub?.paymentStatus === "paid" && (
              <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30" variant="outline">Paid</Badge>
            )}
          </div>

          {sub?.subscriptionExpiryDate && (
            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarCheck className="h-3 w-3" />
                {accessStatus === "expired" ? "Expired" : "Expires"}: {expiryFormatted}
              </p>
              {remaining !== null && remaining > 0 && (
                <p className={`text-xs font-semibold ${remaining <= 3 ? "text-rose-400" : remaining <= 7 ? "text-amber-400" : "text-emerald-400"}`}>
                  {remaining} day{remaining !== 1 ? "s" : ""} remaining
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ALL_TIERS.map((tier) => {
          const cfg = PLAN_CONFIG[tier];
          const Icon = TIER_ICONS[tier];
          const isCurrent = tier === currentTier;
          const isHighlighted = tier === "founder_launch";

          const priceLabel = tier === "free_trial" ? "৳0" : tier === "founder_launch" ? "৳749" : "৳9,999";
          const periodLabel = tier === "free_trial" ? "/৭ দিন" : tier === "founder_launch" ? "/month" : "/year";

          return (
            <Card
              key={tier}
              className={`relative ${isHighlighted ? "border-primary shadow-lg" : ""} ${isCurrent ? "ring-2 ring-primary/30" : ""}`}
            >
              {isHighlighted && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-3">
                    <Star className="h-3 w-3 mr-1" /> সবচেয়ে জনপ্রিয়
                  </Badge>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-emerald-500 text-white px-3">
                    <Check className="h-3 w-3 mr-1" /> Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${isHighlighted ? "text-primary" : "text-muted-foreground"}`} />
                  <CardTitle className="text-lg">{cfg.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-3xl font-bold tracking-tight">{priceLabel}</span>
                  <span className="text-muted-foreground text-sm">{periodLabel}</span>
                </div>
                <CardDescription className="text-xs">{cfg.tagline}</CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <ul className="space-y-2">
                  {cfg.displayHighlights.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={isHighlighted ? "default" : "outline"}
                  disabled={isCurrent}
                  onClick={() => !isCurrent && handleUpgrade(tier)}
                >
                  {isCurrent ? "✓ Current Plan" : tier === "free_trial" ? "Start Free Trial" : `Upgrade to ${cfg.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          Subscription renewal ও upgrade-এর জন্য আপনার organization admin-এর সাথে যোগাযোগ করুন।
        </p>
        <p className="text-xs text-muted-foreground">
          Payment গ্রহণ করা হয় bKash, Nagad, Rocket ও Card-এর মাধ্যমে (SSLCommerz)।
        </p>
      </div>
    </div>
  );
}
