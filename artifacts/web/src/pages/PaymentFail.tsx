import { useEffect } from "react";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trackPaymentFailed } from "@/lib/analytics";

export default function PaymentFail() {
  const [, navigate] = useLocation();

  const params = new URLSearchParams(window.location.search);
  const tranId = params.get("tran_id") ?? "";
  const reason = params.get("reason") ?? "";

  const isCancelled = reason === "cancelled";

  useEffect(() => {
    trackPaymentFailed(reason || "unknown");
  }, [reason]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex justify-center mb-4">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isCancelled ? "bg-amber-100" : "bg-red-100"}`}>
              <XCircle className={`h-10 w-10 ${isCancelled ? "text-amber-600" : "text-red-600"}`} />
            </div>
          </div>
          <CardTitle className={`text-2xl ${isCancelled ? "text-amber-700" : "text-red-700"}`}>
            {isCancelled ? "Payment বাতিল করা হয়েছে" : "Payment ব্যর্থ হয়েছে"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isCancelled
              ? "আপনি payment cancel করেছেন। আবার চেষ্টা করতে পারেন।"
              : "Payment সম্পন্ন হয়নি। আবার চেষ্টা করুন অথবা অন্য payment method ব্যবহার করুন।"}
          </p>
          {tranId && (
            <div className="bg-muted rounded-lg p-3 text-left">
              <p className="text-xs text-muted-foreground">Transaction Reference</p>
              <p className="text-sm font-mono font-medium break-all">{tranId}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/subscription")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              আবার চেষ্টা করুন
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard-এ যান
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
