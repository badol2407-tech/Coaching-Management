import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Mail, MessageSquare, Share2, BarChart3, Clock } from "lucide-react";

const PLANNED_FEATURES = [
  { icon: Mail, label: "Email Campaigns", desc: "Send targeted emails to free trial users, paid users, or churned orgs", status: "planned" },
  { icon: MessageSquare, label: "WhatsApp Broadcasts", desc: "Send WhatsApp messages to org admins for renewals and announcements", status: "planned" },
  { icon: Share2, label: "Social Media Posts", desc: "Schedule and publish posts to Facebook, Instagram and LinkedIn", status: "planned" },
  { icon: BarChart3, label: "Campaign Analytics", desc: "Track open rates, click-through rates and conversions per campaign", status: "planned" },
  { icon: Megaphone, label: "Push Notifications", desc: "Send in-app and browser push notifications to active users", status: "planned" },
];

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
        <p className="text-muted-foreground text-sm mt-1">Centralized campaign management — coming soon</p>
      </div>

      {/* Hero coming soon card */}
      <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/8 via-transparent to-indigo-500/5 overflow-hidden">
        <CardContent className="pt-10 pb-10 text-center space-y-5 relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.1),transparent_70%)]" />
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <Megaphone className="h-8 w-8 text-violet-400" />
            </div>
            <Badge className="mb-3 bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/20">
              <Clock className="h-3 w-3 mr-1" /> Coming Soon
            </Badge>
            <h2 className="text-xl font-bold">Campaign Management</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
              A powerful campaign hub to reach your users via email, WhatsApp, and social — with analytics built in.
              This module is being built and will be available soon.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Planned features */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Planned Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLANNED_FEATURES.map((f) => (
            <Card key={f.label} className="border-border/50 opacity-75">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{f.label}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Planned</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Notify when ready */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base">Get Notified When Available</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Campaign management is actively being developed. As a super admin, you'll have early access.
          </p>
          <Button variant="outline" className="gap-2" onClick={() => alert("You'll be notified when campaigns go live!")}>
            <Mail className="h-4 w-4" /> Notify Me
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
