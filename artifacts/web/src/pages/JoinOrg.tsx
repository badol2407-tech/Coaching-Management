import { useState, useEffect } from "react";
import { doc, getDoc, getDocs, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GraduationCap, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Status = "loading" | "form" | "submitting" | "success" | "invalid";
type OrgClass = { name: string; batches: string[] };

export default function JoinOrg() {
  const pathParts = window.location.pathname.split("/");
  const joinIndex = pathParts.indexOf("join");
  const orgId = joinIndex !== -1 ? pathParts[joinIndex + 1] : undefined;

  const [status, setStatus] = useState<Status>("loading");
  const [orgName, setOrgName] = useState("");
  const [orgClasses, setOrgClasses] = useState<OrgClass[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [className, setClassName] = useState("");
  const [batch, setBatch] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  // Touch tracking for showing inline errors on untouched fields
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));
  const err = (field: string, val: string) => touched[field] && val.trim() === "";

  useEffect(() => {
    async function loadOrgData() {
      if (!orgId || orgId.trim() === "") { setStatus("invalid"); return; }
      try {
        const snap = await getDoc(doc(db, "organizations", orgId));
        if (!snap.exists()) { setStatus("invalid"); return; }
        setOrgName((snap.data() as any).name || "Coaching Center");

        // Try to fetch classes (may fail on strict rules — fallback to text inputs)
        try {
          const classSnap = await getDocs(collection(db, "organizations", orgId, "classes"));
          const loaded: OrgClass[] = classSnap.docs.map((d) => {
            const data = d.data() as any;
            return {
              name: data.name ?? "",
              batches: Array.isArray(data.batches) ? data.batches : [],
            };
          }).filter((c) => c.name).sort((a, b) => a.name.localeCompare(b.name));
          setOrgClasses(loaded);
        } catch {
          // Permission denied or network — fall back to free-text inputs
          setOrgClasses([]);
        }

        setStatus("form");
      } catch (err: any) {
        if (err?.code === "permission-denied") {
          setOrgName("Coaching Center");
          setStatus("form");
        } else {
          setStatus("invalid");
        }
      }
    }
    loadOrgData();
  }, [orgId]);

  // When class changes, reset batch
  function handleClassChange(val: string) {
    setClassName(val);
    setBatch("");
    touch("className");
  }

  const selectedClassData = orgClasses.find((c) => c.name === className);
  const availableBatches = selectedClassData?.batches ?? [];
  const hasClasses = orgClasses.length > 0;

  const isValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    className.trim() !== "" &&
    batch.trim() !== "" &&
    guardianName.trim() !== "" &&
    guardianPhone.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mark all fields as touched so errors show
    setTouched({ name: true, email: true, phone: true, className: true, batch: true, guardianName: true, guardianPhone: true });
    if (!isValid) return;
    setStatus("submitting");
    try {
      await addDoc(collection(db, "organizations", orgId!, "admission_requests"), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        className: className.trim(),
        batch: batch.trim(),
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
        status: "pending",
        source: "admission_link",
        createdAt: serverTimestamp(),
      });
      setStatus("success");
    } catch (err: any) {
      setStatus("form");
      if (err?.code === "permission-denied") {
        alert("Firebase Rules-এ admission_requests-এ write allow নেই। Admin-কে rules আপডেট করতে বলুন।");
      } else {
        alert("Submit করা যায়নি। আবার চেষ্টা করুন।");
      }
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
            </div>
            <h2 className="text-xl font-bold">Link টি সঠিক নয়</h2>
            <p className="text-muted-foreground text-sm">এই admission link টি expire হয়েছে বা ভুল। Admin-এর কাছ থেকে নতুন link নিন।</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">আবেদন জমা হয়েছে!</h2>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{orgName}</span>-এ আপনার ভর্তির আবেদন পাঠানো হয়েছে।
            </p>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Admin approve করার পর এই একই link দিয়ে ফিরে এসে "Student হিসেবে Join করুন" option দিয়ে login করুন।
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{orgName}-এ ভর্তির আবেদন</h1>
          <p className="text-slate-400 text-sm">সব তথ্য পূরণ করুন — admin approve করলে আপনি student হবেন</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">আপনার তথ্য দিন</CardTitle>
            <CardDescription>তারকা চিহ্নিত (<span className="text-destructive font-medium">*</span>) সব fields অবশ্যই পূরণ করতে হবে</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* নাম */}
                <div className="space-y-1.5">
                  <Label>পূর্ণ নাম <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="আপনার নাম"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => touch("name")}
                  />
                  {err("name", name) && <p className="text-xs text-destructive">নাম লিখুন</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label>Email <span className="text-destructive">*</span></Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => touch("email")}
                  />
                  {err("email", email) && <p className="text-xs text-destructive">Email লিখুন</p>}
                </div>

                {/* ফোন */}
                <div className="space-y-1.5">
                  <Label>ফোন নম্বর <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => touch("phone")}
                  />
                  {err("phone", phone) && <p className="text-xs text-destructive">ফোন নম্বর লিখুন</p>}
                </div>

                {/* Class */}
                <div className="space-y-1.5">
                  <Label>Class <span className="text-destructive">*</span></Label>
                  {hasClasses ? (
                    <Select value={className} onValueChange={handleClassChange}>
                      <SelectTrigger onBlur={() => touch("className")}>
                        <SelectValue placeholder="Class বেছে নিন" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgClasses.map((c) => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="যেমন: Class 10, HSC"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      onBlur={() => touch("className")}
                    />
                  )}
                  {err("className", className) && <p className="text-xs text-destructive">Class বেছে নিন বা লিখুন</p>}
                </div>

                {/* Batch */}
                <div className="space-y-1.5">
                  <Label>Batch <span className="text-destructive">*</span></Label>
                  {hasClasses && availableBatches.length > 0 ? (
                    <Select value={batch} onValueChange={(v) => { setBatch(v); touch("batch"); }}>
                      <SelectTrigger onBlur={() => touch("batch")}>
                        <SelectValue placeholder="Batch বেছে নিন" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBatches.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder={hasClasses && className ? "এই class-এ কোনো batch নেই, নিজে লিখুন" : "যেমন: Batch A, Morning Batch"}
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      onBlur={() => touch("batch")}
                    />
                  )}
                  {err("batch", batch) && <p className="text-xs text-destructive">Batch বেছে নিন বা লিখুন</p>}
                </div>

                {/* অভিভাবকের নাম */}
                <div className="space-y-1.5">
                  <Label>অভিভাবকের নাম <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="অভিভাবকের নাম"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    onBlur={() => touch("guardianName")}
                  />
                  {err("guardianName", guardianName) && <p className="text-xs text-destructive">অভিভাবকের নাম লিখুন</p>}
                </div>

                {/* অভিভাবকের ফোন */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>অভিভাবকের ফোন <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="01XXXXXXXXX"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    onBlur={() => touch("guardianPhone")}
                  />
                  {err("guardianPhone", guardianPhone) && <p className="text-xs text-destructive">অভিভাবকের ফোন নম্বর লিখুন</p>}
                </div>

              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={status === "submitting"}
              >
                {status === "submitting" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                ভর্তির আবেদন জমা দিন
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
