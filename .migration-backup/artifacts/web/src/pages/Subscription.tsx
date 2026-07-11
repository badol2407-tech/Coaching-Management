import { useState } from "react";
import { CreditCard, Check, Zap, Building2, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: "৳0",
    amount: 0,
    period: "/মাস",
    description: "ছোট coaching center শুরু করতে",
    Icon: CreditCard,
    features: [
      "৫০ জন পর্যন্ত student",
      "২ জন teacher",
      "Attendance tracking",
      "Basic reports",
      "Notice board",
    ],
    cta: "Current Plan",
    highlighted: false,
    current: true,
  },
  {
    name: "Pro",
    price: "৳999",
    amount: 999,
    period: "/মাস",
    description: "Growing coaching center-এর জন্য",
    Icon: Zap,
    features: [
      "Unlimited students",
      "Unlimited teachers",
      "Advanced reports & analytics",
      "Fee management",
      "Exam & results tracking",
      "Class routine management",
      "Priority support",
    ],
    cta: "Upgrade করুন",
    highlighted: true,
    current: false,
  },
  {
    name: "Enterprise",
    price: "৳2,499",
    amount: 2499,
    period: "/মাস",
    description: "Multi-branch institution-এর জন্য",
    Icon: Building2,
    features: [
      "সব Pro features",
      "Multi-branch management",
      "Custom domain",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Subscribe করুন",
    highlighted: false,
    current: false,
  },
];

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function Subscription() {
  const { userProfile, user } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleUpgrade(plan: typeof plans[number]) {
    if (plan.current || plan.amount === 0) return;
    if (!user?.email) {
      toast({ title: "Login required", variant: "destructive" });
      return;
    }

    setLoadingPlan(plan.name);
    try {
      const basePath = import.meta.env.BASE_URL ?? "";

      const res = await fetch(`${API_BASE}/api/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: plan.name,
          amount: plan.amount,
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

      const { gatewayUrl } = await res.json() as { gatewayUrl: string; tranId: string };
      window.location.href = gatewayUrl;
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err?.message ?? "Payment gateway-এ সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
        <Shield className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-medium">
            আপনি এখন <span className="text-primary font-semibold">Free Plan</span>-এ আছেন
          </p>
          <p className="text-xs text-muted-foreground">
            Upgrade করলে unlimited students, advanced reports সহ আরও অনেক features পাবেন
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map(plan => (
          <Card
            key={plan.name}
            className={plan.highlighted ? "border-primary shadow-lg relative" : "relative"}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-primary text-primary-foreground px-3">⭐ সবচেয়ে জনপ্রিয়</Badge>
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <plan.Icon className={`h-5 w-5 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.current && (
                  <Badge variant="outline" className="text-xs ml-auto">চলছে</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <CardDescription className="text-xs">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
              <ul className="space-y-2">
                {plan.features.map(f => (
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
                variant={plan.highlighted ? "default" : "outline"}
                disabled={plan.current || loadingPlan === plan.name}
                onClick={() => handleUpgrade(plan)}
              >
                {loadingPlan === plan.name ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
                ) : plan.current ? "✓ Current Plan" : plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          সকল paid plans-এ <strong>30 দিনের money-back guarantee</strong>।
        </p>
        <p className="text-xs text-muted-foreground">
          Payment গ্রহণ করা হয় bKash, Nagad, Rocket ও Card-এর মাধ্যমে (SSLCommerz)।
        </p>
      </div>
    </div>
  );
}
