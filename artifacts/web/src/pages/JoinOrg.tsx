import { useState, useEffect } from "react";
import { doc, getDoc, getDocs, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createFirebaseAuthUser } from "@/lib/auth-utils";
import { GraduationCap, CheckCircle2, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Status = "loading" | "form" | "submitting" | "success" | "invalid";
type OrgClass = { name: string; batches: string[] };
type JoinRole = "student" | "teacher";

export default function JoinOrg() {
  const pathParts = window.location.pathname.split("/");
  const joinIndex = pathParts.indexOf("join");
  const orgId = joinIndex !== -1 ? pathParts[joinIndex + 1] : undefined;

  const [status, setStatus] = useState<Status>("loading");
  const [orgName, setOrgName] = useState("");
  const [orgClasses, setOrgClasses] = useState<OrgClass[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [role, setRole] = useState<JoinRole>("student");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [className, setClassName] = useState("");
  const [batch, setBatch] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [subject, setSubject] = useState("");

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

  function handleRoleChange(val: JoinRole) {
    setRole(val);
    setTouched({});
    setErrorMsg(null);
  }

  const selectedClassData = orgClasses.find((c) => c.name === className);
  const availableBatches = selectedClassData?.batches ?? [];
  const hasClasses = orgClasses.length > 0;

  const passwordsValid = password.trim() !== "" && password.length >= 6 && password === confirmPassword;

  const isValid =
    role === "student"
      ? name.trim() !== "" &&
        email.trim() !== "" &&
        passwordsValid &&
        phone.trim() !== "" &&
        className.trim() !== "" &&
        batch.trim() !== "" &&
        guardianName.trim() !== "" &&
        guardianPhone.trim() !== ""
      : name.trim() !== "" &&
        email.trim() !== "" &&
        passwordsValid &&
        phone.trim() !== "" &&
        subject.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    // Mark all fields as touched so errors show
    setTouched(
      role === "student"
        ? { name: true, email: true, password: true, confirmPassword: true, phone: true, className: true, batch: true, guardianName: true, guardianPhone: true }
        : { name: true, email: true, password: true, confirmPassword: true, phone: true, subject: true },
    );
    if (!isValid) return;
    setStatus("submitting");

    // 1. Create the Firebase Auth account with the email/password they chose,
    //    so they can log in with it themselves once an admin approves.
    let uid: string;
    try {
      uid = await createFirebaseAuthUser(email.trim(), password);
    } catch (authErr: any) {
      setStatus("form");
      const code = authErr?.code ?? "";
      if (code === "auth/email-already-in-use") {
        setErrorMsg("এই email দিয়ে আগেই একটি account আছে। ভিন্ন email ব্যবহার করুন বা login করুন।");
      } else if (code === "auth/weak-password") {
        setErrorMsg("Password টি দুর্বল। অন্তত ৬ character দিয়ে চেষ্টা করুন।");
      } else {
        setErrorMsg("Account তৈরি করা যায়নি। আবার চেষ্টা করুন।");
      }
      return;
    }

    // 2. Store the request for admin review. Login only starts working once
    //    the admin approves — that's when a `users/{uid}` profile is created.
    try {
      if (role === "student") {
        await addDoc(collection(db, "organizations", orgId!, "admission_requests"), {
          uid,
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
      } else {
        await addDoc(collection(db, "organizations", orgId!, "teacher_requests"), {
          uid,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          status: "pending",
          source: "join_link",
          createdAt: serverTimestamp(),
        });
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("form");
      if (err?.code === "permission-denied") {
        setErrorMsg("Firebase Rules-এ request write allow নেই। Admin-কে rules আপডেট করতে বলুন।");
      } else {
        setErrorMsg("Submit করা যায়নি। আবার চেষ্টা করুন।");
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
            <p className="text-muted-foreground text-sm">এই link টি expire হয়েছে বা ভুল। Admin-এর কাছ থেকে নতুন link নিন।</p>
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
              <span className="font-semibold text-foreground">{orgName}</span>-এ আপনার {role === "student" ? "ভর্তির" : "যোগদানের"} আবেদন পাঠানো হয়েছে।
            </p>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Admin approve করার পর আপনি এই একই email ও password দিয়ে সরাসরি আপনার পোর্টালে login করতে পারবেন।
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
          <h1 className="text-2xl font-bold text-white">{orgName}-এ যোগ দিন</h1>
          <p className="text-slate-400 text-sm">সব তথ্য পূরণ করুন — admin approve করলে আপনি login করতে পারবেন</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">আপনার তথ্য দিন</CardTitle>
            <CardDescription>তারকা চিহ্নিত (<span className="text-destructive font-medium">*</span>) সব fields অবশ্যই পূরণ করতে হবে</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role selector */}
              <div className="space-y-1.5">
                <Label>আপনি কে? <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("student")}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${role === "student" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                  >
                    আমি Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange("teacher")}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${role === "teacher" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                  >
                    আমি Teacher
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

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

                {/* Password */}
                <div className="space-y-1.5">
                  <Label>Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="অন্তত ৬ character"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => touch("password")}
                      className="pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {touched.password && password.trim() === "" && <p className="text-xs text-destructive">Password লিখুন</p>}
                  {touched.password && password.trim() !== "" && password.length < 6 && <p className="text-xs text-destructive">অন্তত ৬ character দিন</p>}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label>Password আবার লিখুন <span className="text-destructive">*</span></Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password আবার লিখুন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => touch("confirmPassword")}
                  />
                  {touched.confirmPassword && confirmPassword.trim() === "" && <p className="text-xs text-destructive">Password আবার লিখুন</p>}
                  {touched.confirmPassword && confirmPassword.trim() !== "" && password !== confirmPassword && <p className="text-xs text-destructive">Password মিলছে না</p>}
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

                {role === "student" ? (
                  <>
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
                  </>
                ) : (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>যে বিষয় পড়ান (Subject) <span className="text-destructive">*</span></Label>
                    <Input
                      placeholder="যেমন: Physics, Mathematics"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      onBlur={() => touch("subject")}
                    />
                    {err("subject", subject) && <p className="text-xs text-destructive">Subject লিখুন</p>}
                  </div>
                )}

              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={status === "submitting"}
              >
                {status === "submitting" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                আবেদন জমা দিন
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
