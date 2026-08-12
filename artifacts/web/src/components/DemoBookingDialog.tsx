import { useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ArrowRight, CheckCircle, Loader2, MessageCircle, Phone, School, Users } from "lucide-react";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { trackFeatureUsed } from "@/lib/analytics";

const WHATSAPP_NUMBER = "8801632905056";

type DemoBookingDialogProps = {
  open: boolean;
  source: string;
  onOpenChange: (open: boolean) => void;
};

type FormState = {
  fullName: string;
  phone: string;
  institute: string;
  studentCount: string;
};

const INITIAL_FORM: FormState = {
  fullName: "",
  phone: "",
  institute: "",
  studentCount: "",
};

export function DemoBookingDialog({ open, source, onOpenChange }: DemoBookingDialogProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function closeDialog(nextOpen: boolean) {
    if (!nextOpen) {
      setForm(INITIAL_FORM);
      setSubmitted(false);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "demo_leads"), {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        institute: form.institute.trim(),
        studentCount: form.studentCount,
        source,
        status: "new",
        createdAt: serverTimestamp(),
      });
      trackFeatureUsed("demo_request_submitted", {
        source,
        student_count: form.studentCount,
      });
      setSubmitted(true);
      toast({
        title: "Demo request received",
        description: "আমরা শিগগিরই আপনার সঙ্গে যোগাযোগ করব।",
      });
    } catch {
      trackFeatureUsed("demo_request_failed", { source });
      toast({
        title: "Request পাঠানো যায়নি",
        description: "একটু পরে আবার চেষ্টা করুন, অথবা WhatsApp-এ সরাসরি লিখুন।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const whatsappMessage = encodeURIComponent(
    `আমি EduTrack-এর demo নিতে চাই। নাম: ${form.fullName || "—"} | প্রতিষ্ঠান: ${form.institute || "—"} | শিক্ষার্থী: ${form.studentCount || "—"}`,
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg" data-testid="dialog-demo-booking">
        {submitted ? (
          <div className="py-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle className="h-7 w-7" aria-hidden="true" />
            </div>
            <DialogHeader className="mt-5">
              <DialogTitle>আপনার demo request পেয়েছি</DialogTitle>
              <DialogDescription className="mt-2 leading-relaxed">
                আমাদের team আপনার দেওয়া phone নম্বরে যোগাযোগ করবে। দ্রুত কথা বলতে চাইলে এখনই WhatsApp-এ message পাঠাতে পারেন।
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild className="gap-2">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackFeatureUsed("demo_request_whatsapp_handoff", { source })}>
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp-এ কথা বলুন
                </a>
              </Button>
              <Button variant="outline" onClick={() => closeDialog(false)}>
                পরে কথা হবে
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="pr-8">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <DialogTitle>EduTrack-এর demo নিন</DialogTitle>
                  <DialogDescription className="mt-2 leading-relaxed">
                    আপনার institute সম্পর্কে একটু জানালে আমরা আপনার workflow অনুযায়ী demo দেখাতে পারব।
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="demo-full-name">আপনার নাম</Label>
                  <div className="relative">
                    <Input
                      id="demo-full-name"
                      data-testid="input-demo-full-name"
                      value={form.fullName}
                      onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                      placeholder="আপনার নাম"
                      className="pl-9"
                      required
                    />
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo-phone">Phone / WhatsApp</Label>
                  <div className="relative">
                    <Input
                      id="demo-phone"
                      data-testid="input-demo-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                      placeholder="01XXXXXXXXX"
                      className="pl-9"
                      required
                    />
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-institute">School / coaching center</Label>
                <div className="relative">
                  <Input
                    id="demo-institute"
                    data-testid="input-demo-institute"
                    value={form.institute}
                    onChange={(event) => setForm((current) => ({ ...current, institute: event.target.value }))}
                    placeholder="আপনার প্রতিষ্ঠানের নাম"
                    className="pl-9"
                    required
                  />
                  <School className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-student-count">প্রায় কতজন শিক্ষার্থী?</Label>
                <select
                  id="demo-student-count"
                  data-testid="select-demo-student-count"
                  value={form.studentCount}
                  onChange={(event) => setForm((current) => ({ ...current, studentCount: event.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="" disabled>একটি option বেছে নিন</option>
                  <option value="1-100">১–১০০ জন</option>
                  <option value="101-300">১০১–৩০০ জন</option>
                  <option value="301-1000">৩০১–১,০০০ জন</option>
                  <option value="1000+">১,০০০+ জন</option>
                </select>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                আপনার তথ্য শুধু demo ও onboarding follow-up-এর জন্য ব্যবহার করা হবে।
              </p>

              <DialogFooter className="gap-2 sm:gap-3">
                <Button type="button" variant="outline" onClick={() => closeDialog(false)}>
                  বাতিল
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  Demo request পাঠান
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}