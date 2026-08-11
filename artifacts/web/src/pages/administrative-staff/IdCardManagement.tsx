import { useMemo, useState } from "react";
import { IdCard, Loader2, Printer, RefreshCw, Search, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useIssueIdCard, useStaffIdCards } from "@/lib/administrative-staff-hooks";
import { useListStudents } from "@/lib/hooks";

type Student = { id: string; name?: string | null; className?: string | null; section?: string | null; batch?: string | null; rollNumber?: string | null; phone?: string | null; guardianName?: string | null; address?: string | null; photoUrl?: string | null };

export default function IdCardManagement() {
  const { toast } = useToast();
  const cardsQuery = useStaffIdCards();
  const studentsQuery = useListStudents();
  const issueCard = useIssueIdCard();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const cards = cardsQuery.data ?? [];
  const students = studentsQuery.data as Student[] ?? [];
  const filteredStudents = useMemo(() => students.filter((student) => !search || student.name?.toLowerCase().includes(search.toLowerCase()) || student.rollNumber?.toLowerCase().includes(search.toLowerCase())), [students, search]);
  const issuedIds = new Set(cards.filter((card) => card.status === "active").map((card) => card.studentId));

  async function issue(student: Student) {
    try {
      await issueCard.mutateAsync({ student });
      toast({ title: "ID card issued", description: `${student.name || "Student"} is ready for printing.` });
      setSelectedStudent(null);
    } catch {
      toast({ title: "Could not issue ID card", variant: "destructive" });
    }
  }

  function printCard(student: Student) {
    const orgName = "EduTrack";
    const card = `<div class="card"><div class="brand">${orgName}</div><div class="avatar">${student.photoUrl ? `<img src="${student.photoUrl}" />` : student.name?.slice(0, 1).toUpperCase() || "S"}</div><h1>${student.name || "Student"}</h1><p>${student.className || "Class not set"}${student.section ? ` · ${student.section}` : ""}</p><div class="details"><b>Roll</b><span>${student.rollNumber || "—"}</span><b>Batch</b><span>${student.batch || "—"}</span><b>Phone</b><span>${student.phone || "—"}</span><b>Guardian</b><span>${student.guardianName || "—"}</span></div><footer>Student identification card</footer></div>`;
    const popup = window.open("", "_blank", "width=500,height=700");
    if (!popup) return;
    popup.document.write(`<html><head><title>Student ID Card</title><style>*{box-sizing:border-box}body{margin:0;display:grid;place-items:center;min-height:100vh;background:#f4f5fb;font-family:Arial,sans-serif}.card{width:340px;overflow:hidden;border-radius:22px;background:white;box-shadow:0 20px 60px #25233f22;text-align:center;color:#20213a}.brand{padding:18px;background:linear-gradient(135deg,#6252ba,#9b4f75);color:white;font-weight:700;font-size:18px}.avatar{margin:22px auto 12px;width:84px;height:84px;border-radius:22px;background:#e9e5ff;color:#6252ba;display:grid;place-items:center;font-size:30px;font-weight:700;overflow:hidden}.avatar img{width:100%;height:100%;object-fit:cover}.card h1{margin:0;font-size:22px}.card p{margin:6px 0 20px;color:#70738a}.details{margin:0 24px;padding:16px;border-top:1px solid #ececf4;display:grid;grid-template-columns:1fr 1.5fr;gap:10px;text-align:left;font-size:12px}.details b{color:#888ba0}.card footer{margin-top:14px;padding:12px;background:#f6f4ff;color:#6252ba;font-size:11px}@media print{body{background:white}.card{box-shadow:none}}</style></head><body>${card}</body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  return <div className="app-command-surface mx-auto max-w-7xl space-y-6 pb-12"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Administrative workspace</p><h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">ID Card Management</h1><p className="mt-1 text-sm text-muted-foreground">Issue cards for students and print the latest identification details when needed.</p></div><Button variant="outline" className="w-fit gap-2" onClick={() => { studentsQuery.refetch(); cardsQuery.refetch(); }} disabled={cardsQuery.isFetching}><RefreshCw className={cardsQuery.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />Refresh</Button></header><div className="grid gap-4 sm:grid-cols-3"><Metric label="Students" value={students.length} /><Metric label="Cards issued" value={issuedIds.size} tone="emerald" /><Metric label="Needs card" value={Math.max(0, students.length - issuedIds.size)} tone="amber" /></div><Card className="overflow-hidden border-border/70 bg-card/70 backdrop-blur-xl"><CardHeader className="border-b border-border/60"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><CardTitle className="text-lg">Student cards</CardTitle><div className="relative sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." className="pl-9" aria-label="Search students for ID cards" /></div></div></CardHeader><CardContent className="p-0">{studentsQuery.isLoading ? <Loading /> : filteredStudents.length === 0 ? <Empty /> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="px-4 py-3 font-medium">Student</th><th className="px-4 py-3 font-medium">Class</th><th className="px-4 py-3 font-medium">Card</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr></thead><tbody>{filteredStudents.map((student) => { const card = cards.find((item) => item.studentId === student.id); return <tr key={student.id} className="border-b last:border-0"><td className="px-4 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 font-semibold text-primary">{student.name?.slice(0, 1).toUpperCase() || <UserRound className="h-4 w-4" />}</div><div><p className="font-medium">{student.name || "Unnamed student"}</p><p className="text-xs text-muted-foreground">{student.rollNumber ? `Roll ${student.rollNumber}` : "No roll number"}</p></div></div></td><td className="px-4 py-4">{student.className || "—"}<span className="block text-xs text-muted-foreground">{student.batch || student.section || "—"}</span></td><td className="px-4 py-4">{card ? <Badge variant="outline" className={card.status === "active" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600" : ""}>{card.cardNumber}</Badge> : <Badge variant="outline">Not issued</Badge>}</td><td className="px-4 py-4 text-right"><div className="flex justify-end gap-2">{card && <Button variant="ghost" size="sm" className="gap-2" onClick={() => printCard(student)}><Printer className="h-4 w-4" />Print</Button>}<Button size="sm" onClick={() => setSelectedStudent(student)}>{card ? "Reissue" : "Issue card"}</Button></div></td></tr>; })}</tbody></table></div>}</CardContent></Card><ConfirmIssue student={selectedStudent} open={Boolean(selectedStudent)} onOpenChange={(open) => !open && setSelectedStudent(null)} onConfirm={issue} processing={issueCard.isPending} /></div>;
}

function ConfirmIssue({ student, open, onOpenChange, onConfirm, processing }: { student: Student | null; open: boolean; onOpenChange: (open: boolean) => void; onConfirm: (student: Student) => void; processing: boolean }) { return <div className={open ? "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" : "hidden"} role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-xl"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><IdCard className="h-5 w-5" /></div><div><h2 className="font-semibold">Issue student ID card?</h2><p className="text-sm text-muted-foreground">{student?.name}</p></div></div><p className="mt-5 text-sm text-muted-foreground">This saves the card number to Firestore and makes it available to print from this page.</p><div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={() => student && onConfirm(student)} disabled={processing}>{processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Issue card</Button></div></div></div>; }
function Metric({ label, value, tone = "violet" }: { label: string; value: number; tone?: "violet" | "amber" | "emerald" }) { const colors = { violet: "bg-primary/10 text-primary", amber: "bg-amber-500/10 text-amber-600", emerald: "bg-emerald-500/10 text-emerald-600" }; return <Card className="border-border/70 bg-card/70"><CardContent className="p-5"><p className="text-sm text-muted-foreground">{label}</p><p className={`mt-1 text-2xl font-semibold ${colors[tone].split(" ")[1]}`}>{value}</p></CardContent></Card>; }
function Loading() { return <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading students...</div>; }
function Empty() { return <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground">No students found.</div>; }