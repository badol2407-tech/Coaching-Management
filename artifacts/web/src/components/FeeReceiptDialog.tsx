import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export interface FeeReceiptData {
  id: string;
  studentName: string;
  studentId?: string;
  className: string;
  section: string;
  batch: string;
  month: string;
  amount: number;
  totalPaid: number;
  status: string;
  paidAt?: string | null;
  createdAt: string;
  installments?: {
    amount: number;
    note?: string;
    paidAt: string;
    collectedBy?: string;
  }[];
}

interface FeeReceiptDialogProps {
  fee: FeeReceiptData | null;
  open: boolean;
  onClose: () => void;
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtMonth(m: string) {
  if (!m) return "—";
  const [y, mo] = m.split("-");
  const d = new Date(Number(y), Number(mo) - 1, 1);
  return d.toLocaleDateString("en-BD", { month: "long", year: "numeric" });
}

export function FeeReceiptDialog({ fee, open, onClose }: FeeReceiptDialogProps) {
  const { userProfile } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Receipt</title>
        <meta charset="UTF-8" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 24px; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #111; padding-bottom: 12px; }
          .header h1 { font-size: 22px; font-weight: bold; }
          .header p { font-size: 12px; color: #555; margin-top: 2px; }
          .receipt-tag { font-size: 16px; font-weight: bold; text-align: center; margin: 12px 0 20px; letter-spacing: 1px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 16px; }
          .field label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .field span { font-size: 13px; font-weight: 600; display: block; margin-top: 2px; }
          .separator { border-top: 1px solid #ddd; margin: 14px 0; }
          .totals-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          .totals-table th { text-align: left; font-size: 11px; color: #666; text-transform: uppercase; padding: 4px 6px; border-bottom: 1px solid #ddd; }
          .totals-table td { padding: 5px 6px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
          .amount-row td { font-weight: bold; font-size: 14px; }
          .status-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .status-paid { background: #dcfce7; color: #166534; }
          .status-partial { background: #fef9c3; color: #854d0e; }
          .status-pending { background: #fee2e2; color: #991b1b; }
          .footer { margin-top: 32px; border-top: 1px solid #ddd; padding-top: 12px; display: flex; justify-content: space-between; font-size: 11px; color: #666; }
          .sig-line { width: 160px; border-top: 1px solid #555; padding-top: 4px; text-align: center; font-size: 11px; }
          @media print { body { padding: 16px; } }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  if (!fee) return null;

  const orgName = userProfile?.orgName ?? "Coaching Center";
  const receiptNo = `RCP-${fee.id.slice(-6).toUpperCase()}`;
  const installments = fee.installments ?? [];
  const totalPaid = fee.totalPaid ?? (fee.status === "paid" ? fee.amount : 0);
  const balance = fee.amount - totalPaid;
  const effectivePaidAt =
    fee.paidAt ??
    (installments.length > 0
      ? installments[installments.length - 1].paidAt
      : null);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Fee Receipt</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1.5" />
                Print
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Printable content */}
        <div ref={printRef} className="font-sans text-foreground">
          {/* Header */}
          <div className="header text-center border-b-2 border-foreground pb-3 mb-4">
            <h1 className="text-xl font-bold">{orgName}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Fee Payment Receipt</p>
          </div>

          <div className="receipt-tag text-center font-bold text-base tracking-widest uppercase mb-4 text-muted-foreground">
            ── OFFICIAL RECEIPT ──
          </div>

          {/* Receipt meta */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
            <div className="field">
              <label className="text-[10px] uppercase tracking-wide text-muted-foreground">Receipt No.</label>
              <span className="font-semibold">{receiptNo}</span>
            </div>
            <div className="field">
              <label className="text-[10px] uppercase tracking-wide text-muted-foreground">Issue Date</label>
              <span className="font-semibold">{fmt(effectivePaidAt ?? fee.createdAt)}</span>
            </div>
            <div className="field">
              <label className="text-[10px] uppercase tracking-wide text-muted-foreground">Student Name</label>
              <span className="font-semibold">{fee.studentName}</span>
            </div>
            <div className="field">
              <label className="text-[10px] uppercase tracking-wide text-muted-foreground">Class / Section</label>
              <span className="font-semibold">{fee.className} — {fee.section}</span>
            </div>
            <div className="field">
              <label className="text-[10px] uppercase tracking-wide text-muted-foreground">Batch</label>
              <span className="font-semibold">{fee.batch}</span>
            </div>
            <div className="field">
              <label className="text-[10px] uppercase tracking-wide text-muted-foreground">Fee Month</label>
              <span className="font-semibold">{fmtMonth(fee.month)}</span>
            </div>
          </div>

          <Separator className="separator my-3" />

          {/* Amount table */}
          <table className="totals-table w-full border-collapse text-sm mb-3">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1.5 text-muted-foreground text-xs uppercase">Description</th>
                <th className="text-right py-1.5 text-muted-foreground text-xs uppercase">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-1.5">Monthly Tuition Fee ({fmtMonth(fee.month)})</td>
                <td className="text-right py-1.5">৳{fee.amount.toLocaleString()}</td>
              </tr>
              {installments.length > 1 && installments.map((inst, i) => (
                <tr key={i} className="border-b text-xs text-muted-foreground">
                  <td className="py-1.5 pl-3">
                    Installment {i + 1}{inst.note ? ` — ${inst.note}` : ""} &nbsp;
                    <span className="text-[10px]">({fmt(inst.paidAt)})</span>
                  </td>
                  <td className="text-right py-1.5">৳{Number(inst.amount).toLocaleString()}</td>
                </tr>
              ))}
              <tr className="amount-row border-t-2 border-foreground font-bold">
                <td className="py-2">Total Paid</td>
                <td className="text-right py-2">৳{totalPaid.toLocaleString()}</td>
              </tr>
              {balance > 0 && (
                <tr className="text-destructive">
                  <td className="py-1 text-sm">Balance Due</td>
                  <td className="text-right py-1 text-sm font-semibold">৳{balance.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>

          <Separator className="separator my-3" />

          {/* Status */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide mr-2">Payment Status:</span>
              <Badge
                className={
                  fee.status === "paid"
                    ? "status-paid bg-green-100 text-green-800"
                    : fee.status === "partial"
                    ? "status-partial bg-yellow-100 text-yellow-800"
                    : "status-pending bg-red-100 text-red-800"
                }
              >
                {fee.status === "paid" ? "Fully Paid" : fee.status === "partial" ? "Partially Paid" : "Unpaid"}
              </Badge>
            </div>
            {effectivePaidAt && (
              <span className="text-xs text-muted-foreground">Paid on: {fmt(effectivePaidAt)}</span>
            )}
          </div>

          {/* Footer */}
          <div className="footer flex items-end justify-between mt-8 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              <p>Generated: {fmt(new Date().toISOString())}</p>
              <p className="mt-1">This is a computer-generated receipt.</p>
            </div>
            <div className="sig-line text-center">
              <div className="border-t border-foreground w-36 pt-1 text-xs text-muted-foreground">
                Authorized Signature
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
