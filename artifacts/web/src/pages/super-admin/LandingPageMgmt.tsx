import { useState, useEffect } from "react";
import { usePlatformSettings, useUpdatePlatformSettings } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Globe, Save, RefreshCw } from "lucide-react";

export default function LandingPageMgmt() {
  const { data: settings, isLoading } = usePlatformSettings();
  const update = useUpdatePlatformSettings();
  const { toast } = useToast();

  const [form, setForm] = useState({
    heroHeadline: "",
    heroSubtext: "",
    heroCta: "",
    featureHighlight1: "",
    featureHighlight2: "",
    featureHighlight3: "",
    announcementBar: "",
    announcementBarActive: false,
  });

  useEffect(() => {
    if (settings?.landing) {
      setForm((prev) => ({ ...prev, ...settings.landing }));
    }
  }, [settings]);

  const handleSave = async () => {
    await update.mutateAsync({ landing: form });
    toast({ title: "Landing page settings saved" });
  };

  const field = (key: keyof typeof form, label: string, multiline = false) => (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {multiline ? (
        <Textarea
          rows={2}
          className="text-sm resize-none"
          value={String(form[key])}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}…`}
        />
      ) : (
        <Input
          className="text-sm"
          value={String(form[key])}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}…`}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Landing Page Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Override landing page content stored in Firestore. Changes apply immediately.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-violet-400" /> Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {field("heroHeadline", "Headline")}
              {field("heroSubtext", "Subtext / Description", true)}
              {field("heroCta", "CTA Button Text")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Feature Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {field("featureHighlight1", "Feature 1")}
              {field("featureHighlight2", "Feature 2")}
              {field("featureHighlight3", "Feature 3")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Announcement Bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {field("announcementBar", "Announcement Text")}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="announcementActive"
                  checked={!!form.announcementBarActive}
                  onChange={(e) => setForm((p) => ({ ...p, announcementBarActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="announcementActive" className="text-sm cursor-pointer">Show announcement bar on landing page</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={update.isPending} className="gap-2">
              {update.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setForm({ heroHeadline: "", heroSubtext: "", heroCta: "", featureHighlight1: "", featureHighlight2: "", featureHighlight3: "", announcementBar: "", announcementBarActive: false })}>
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
