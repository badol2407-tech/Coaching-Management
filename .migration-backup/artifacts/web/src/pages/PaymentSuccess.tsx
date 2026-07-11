import { useEffect } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { trackPaymentCompleted } from "@/lib/analytics";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const { userProfile } = useAuth();

  const params = new URLSearchParams(window.location.search);
  const tranId = params.get("tran_id") ?? "";
  const valId = params.get("val_id") ?? "";

  useEffect(() => {
    async function markSubscribed() {
      if (!userProfile?.orgId) return;
      try {
        await updateDoc(doc(db, "organizations", userProfile.orgId), {
          subscription: "pro",
          subscribedAt: new Date().toISOString(),
          tranId,
          valId,
        });
        trackPaymentCompleted("pro", tranId);
      } catch {}
    }
    markSubscribed();
  }, [userProfile?.orgId, tranId, valId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-700">Payment সফল হয়েছে!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            আপনার subscription সক্রিয় করা হয়েছে। ধন্যবাদ EduTrack ব্যবহারের জন্য।
          </p>
          {tranId && (
            <div className="bg-muted rounded-lg p-3 text-left">
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="text-sm font-mono font-medium break-all">{tranId}</p>
            </div>
          )}
          <Button className="w-full" onClick={() => navigate("/")}>
            Dashboard-এ যান <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
