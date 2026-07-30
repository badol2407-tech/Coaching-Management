import { useState, useRef, useCallback } from "react";
import { useListStudents } from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Printer, Download, CreditCard, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Student = {
  id: string;
  name: string;
  rollNumber?: string | null;
  className?: string | null;
  section?: string | null;
  batch?: string | null;
  phone?: string | null;
  email?: string | null;
  photoUrl?: string | null;
  address?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  status?: "active" | "inactive" | null;
  enrolledAt?: string;
};

// ── QR Placeholder ─────────────────────────────────────────────────────────────
function QrPlaceholder({ value }: { value: string }) {
  // Visual QR-like grid placeholder (7×7)
  const seed = value.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const grid: boolean[][] = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      // Fixed finder patterns
      if ((r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2)) return true;
      return ((seed * (r + 1) * (c + 1) * 31) % 7) > 2;
    })
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
        className="p-1 bg-white border border-gray-200 rounded"
      >
        {grid.flat().map((filled, i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6,
              background: filled ? "#111" : "#fff",
              borderRadius: 0.5,
            }}
          />
        ))}
      </div>
      <span className="text-[8px] font-mono text-gray-400 text-center leading-tight max-w-[60px] truncate">
        {value}
      </span>
    </div>
  );
}

// ── Barcode Placeholder ─────────────────────────────────────────────────────────
function BarcodePlaceholder({ value }: { value: string }) {
  const bars = Array.from({ length: 28 }, (_, i) => {
    const seed = value.charCodeAt(i % value.length) + i;
    return { width: (seed % 3) + 1, gap: i % 5 === 0 ? 3 : 1 };
  });

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-end h-8" style={{ gap: 0 }}>
        {bars.map((bar, i) => (
          <div key={i} className="flex" style={{ gap: bar.gap }}>
            <div
              style={{
                width: bar.width,
                height: i % 7 === 0 ? 32 : 24,
                background: "#111",
                borderRadius: 0.5,
              }}
            />
          </div>
        ))}
      </div>
      <span className="text-[8px] font-mono text-gray-500 tracking-widest">{value}</span>
    </div>
  );
}

// ── ID Card ─────────────────────────────────────────────────────────────────────
function IdCard({ student, orgName }: { student: Student; orgName: string }) {
  return (
    <div
      id="student-id-card"
      className="relative bg-white rounded-xl overflow-hidden shadow-lg"
      style={{ width: 340, minHeight: 520, fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Header band */}
      <div
        className="relative px-5 pt-5 pb-3"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)" }}
      >
        {/* Logo / org name */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-lg shadow-inner">
            {orgName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{orgName}</p>
            <p className="text-blue-200 text-[10px]">Educational Institute</p>
          </div>
        </div>
        <div className="text-center">
          <span
            className="inline-block px-4 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "rgba(255,255,255,0.15)", color: "#bfdbfe", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            Student Identity Card
          </span>
        </div>
      </div>

      {/* Photo + name strip */}
      <div className="flex items-end gap-4 px-5 -mt-5 mb-4">
        <div
          className="rounded-xl overflow-hidden border-4 border-white shadow-md shrink-0"
          style={{ width: 80, height: 96, background: "#e2e8f0" }}
        >
          {student.photoUrl ? (
            <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
              <User className="h-10 w-10 text-blue-300" />
            </div>
          )}
        </div>
        <div className="pb-1 min-w-0">
          <h2 className="text-gray-900 font-bold text-base leading-tight truncate">{student.name}</h2>
          {student.rollNumber && (
            <p className="text-blue-700 font-mono text-xs font-semibold mt-0.5">#{student.rollNumber}</p>
          )}
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
            style={{
              background: student.status === "inactive" ? "#fef2f2" : "#eff6ff",
              color: student.status === "inactive" ? "#b91c1c" : "#1d4ed8",
              border: `1px solid ${student.status === "inactive" ? "#fca5a5" : "#bfdbfe"}`,
            }}
          >
            {student.status ?? "Active"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-gray-100 mb-3" />

      {/* Info grid */}
      <div className="px-5 space-y-1.5">
        {[
          { label: "Class", value: [student.className, student.section].filter(Boolean).join(" – ") || "—" },
          { label: "Batch", value: student.batch || "—" },
          { label: "Phone", value: student.phone || "—" },
          { label: "Guardian", value: student.guardianName || "—" },
          { label: "Address", value: student.address || "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-2 text-[11px]">
            <span className="text-gray-400 font-semibold w-14 shrink-0">{label}</span>
            <span className="text-gray-700 font-medium truncate">{value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-dashed border-gray-200 mt-3 mb-3" />

      {/* QR + Barcode row */}
      <div className="px-5 flex items-center justify-between">
        <QrPlaceholder value={student.rollNumber || student.id} />
        <BarcodePlaceholder value={student.rollNumber || student.id.slice(0, 10)} />
      </div>

      {/* Footer */}
      <div
        className="mt-3 px-5 py-2 text-center text-[9px] text-blue-100"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)" }}
      >
        This card is the property of {orgName} · Not transferable
      </div>
    </div>
  );
}

// ── Print styles (injected via a <style> tag so they work in the iframe) ─────
const PRINT_STYLE = `
  @media print {
    body > *:not(#print-root) { display: none !important; }
    #print-root { display: block !important; position: fixed; inset: 0; background: white; display: flex; align-items: center; justify-content: center; }
    #student-id-card { box-shadow: none !important; }
    #print-buttons { display: none !important; }
  }
`;

// ── Student ID Card Page ────────────────────────────────────────────────────────
export default function StudentIdCard() {
  const { userProfile } = useAuth();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: students, isLoading } = useListStudents({
    search: search || undefined,
  });

  const orgName = userProfile?.orgName || "EduTrack";

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank", "width=600,height=700");
    if (!printWindow || !printRef.current) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Student ID Card – ${selected?.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
            @media print { body { background: white; } }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }, [selected]);

  const handleDownloadPdf = useCallback(() => {
    // Open print dialog in a new window - user can "Save as PDF"
    handlePrint();
  }, [handlePrint]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Student ID Cards
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Select a student to preview, print, or download their ID card.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone or roll no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Student Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !students || students.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <User className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No students found</p>
          <p className="text-sm mt-1">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {students.map((student: Student) => (
            <button
              key={student.id}
              onClick={() => setSelected(student)}
              className="text-left bg-card border rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-blue-50 border flex items-center justify-center shrink-0">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt={student.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-blue-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
                    {student.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {student.className || "—"}{student.section ? ` · ${student.section}` : ""}
                  </p>
                  {student.rollNumber && (
                    <p className="text-xs font-mono text-blue-600">#{student.rollNumber}</p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    student.status === "inactive"
                      ? "border-red-200 text-red-600 bg-red-50"
                      : "border-blue-200 text-blue-600 bg-blue-50"
                  }`}
                >
                  {student.status ?? "active"}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                  <CreditCard className="h-3 w-3" /> View Card
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ID Card Preview Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-transparent border-none shadow-none">
          <style dangerouslySetInnerHTML={{ __html: PRINT_STYLE }} />

          <div className="bg-background rounded-2xl overflow-hidden shadow-2xl">
            {/* Dialog header */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-card">
              <p className="font-semibold text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                ID Card Preview
              </p>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground rounded-md p-1 hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Card preview */}
            <div className="p-6 flex justify-center bg-gradient-to-br from-slate-100 to-blue-50">
              <div ref={printRef}>
                {selected && <IdCard student={selected} orgName={orgName} />}
              </div>
            </div>

            {/* Action buttons */}
            <div id="print-buttons" className="flex gap-3 justify-center px-6 py-4 border-t bg-card">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleDownloadPdf}
                className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
