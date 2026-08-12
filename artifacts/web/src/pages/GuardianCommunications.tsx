import { useEffect, useState } from "react";
import { Check, FileCheck2, Loader2, MessageCircle, Send, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGuardianConversationMessages,
  useReplyToGuardianConversation,
  useReviewGuardianLeaveRequest,
  useStaffGuardianConversations,
  useStaffLeaveRequests,
} from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" }) : "Just now";
}

export default function GuardianCommunications() {
  const { userProfile } = useAuth();
  const [section, setSection] = useState<"messages" | "leave">("messages");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [reviewText, setReviewText] = useState<Record<string, string>>({});
  const { data: conversations = [], isLoading: conversationsLoading } = useStaffGuardianConversations();
  const { data: messages = [] } = useGuardianConversationMessages(selectedConversationId);
  const { data: leaveRequests = [], isLoading: leaveLoading } = useStaffLeaveRequests();
  const sendReply = useReplyToGuardianConversation();
  const reviewLeave = useReviewGuardianLeaveRequest();
  const selectedConversation = (conversations as any[]).find((item) => item.id === selectedConversationId) ?? (conversations as any[])[0];

  useEffect(() => {
    if (!selectedConversationId && (conversations as any[])[0]?.id) {
      setSelectedConversationId((conversations as any[])[0].id);
    }
  }, [conversations, selectedConversationId]);

  async function handleReply() {
    if (!selectedConversation?.id || !reply.trim()) return;
    await sendReply.mutateAsync({ conversationId: selectedConversation.id, body: reply });
    setReply("");
  }

  async function handleReview(request: any, status: "approved" | "rejected") {
    await reviewLeave.mutateAsync({
      requestId: request.id,
      status,
      response: reviewText[request.id] ?? "",
      guardianUid: request.guardianUid,
      studentId: request.studentId,
    });
    setReviewText((current) => ({ ...current, [request.id]: "" }));
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Guardian care desk</p>
        <h1 className="text-2xl font-bold tracking-tight">Guardian communications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Respond to family messages and keep leave decisions current in real time.</p>
      </div>
      <div className="flex gap-2">
        <Button variant={section === "messages" ? "default" : "outline"} onClick={() => setSection("messages")}><MessageCircle /> Messages</Button>
        <Button variant={section === "leave" ? "default" : "outline"} onClick={() => setSection("leave")}><FileCheck2 /> Leave requests</Button>
      </div>

      {section === "messages" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
          <Card><CardContent className="p-0">
            <div className="border-b p-4 font-semibold">Conversations</div>
            {conversationsLoading ? <div className="p-5"><Loader2 className="animate-spin" /></div> : (conversations as any[]).length ? (conversations as any[]).map((conversation: any) => (
              <button key={conversation.id} type="button" onClick={() => setSelectedConversationId(conversation.id)} className={`w-full border-b p-4 text-left transition-colors hover:bg-muted/50 ${selectedConversation?.id === conversation.id ? "bg-muted" : ""}`}>
                <div className="flex items-start justify-between gap-2"><b className="truncate">{conversation.guardianName || "Guardian"}</b><span className="text-[10px] text-muted-foreground">{formatDate(conversation.lastMessageAt)}</span></div>
                <p className="mt-1 text-xs text-muted-foreground">{conversation.childName || "Linked student"}</p>
                <p className="mt-2 line-clamp-2 text-sm">{conversation.lastMessage || "New conversation"}</p>
              </button>
            )) : <p className="p-5 text-sm text-muted-foreground">No guardian conversations yet.</p>}
          </CardContent></Card>
          <Card><CardContent className="p-5">
            {selectedConversation ? <><div className="mb-4 border-b pb-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">{selectedConversation.subject || "Guardian message"}</p><h2 className="text-lg font-semibold">{selectedConversation.guardianName || "Guardian"} · {selectedConversation.childName || "Student"}</h2></div><div className="guardian-staff-thread">{(messages as any[]).length ? (messages as any[]).map((message: any) => <div key={message.id} className={`guardian-staff-message ${message.senderRole === "guardian" ? "" : "guardian-staff-message-own"}`}><b>{message.senderName || (message.senderRole === "guardian" ? "Guardian" : userProfile?.name || "School")}</b><p>{message.body}</p><small>{formatDate(message.createdAt)}</small></div>) : <p className="text-sm text-muted-foreground">Loading conversation updates…</p>}</div><div className="mt-5 flex gap-2"><Textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply to this guardian…" rows={3} /><Button onClick={() => void handleReply()} disabled={sendReply.isPending || !reply.trim()} aria-label="Send reply"><Send /></Button></div></> : <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Select a conversation to reply.</div>}
          </CardContent></Card>
        </div>
      ) : (
        <Card><CardContent className="p-0">
          {leaveLoading ? <div className="p-5"><Loader2 className="animate-spin" /></div> : (leaveRequests as any[]).length ? (leaveRequests as any[]).map((request: any) => <div key={request.id} className="border-b p-5 last:border-0"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{request.childName || "Student"}</h2><Badge variant={request.status === "approved" ? "secondary" : request.status === "rejected" ? "destructive" : "outline"}>{request.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{request.guardianName || "Guardian"} · {request.startDate} → {request.endDate}</p><p className="mt-3 text-sm">{request.reason}</p><p className="mt-2 text-xs text-muted-foreground">Submitted {formatDate(request.createdAt)}</p></div>{request.status === "pending" && <div className="flex shrink-0 gap-2"><Button size="sm" variant="outline" onClick={() => void handleReview(request, "rejected")} disabled={reviewLeave.isPending}><X /> Reject</Button><Button size="sm" onClick={() => void handleReview(request, "approved")} disabled={reviewLeave.isPending}><Check /> Approve</Button></div>}</div>{request.status === "pending" && <Textarea className="mt-4" value={reviewText[request.id] ?? ""} onChange={(event) => setReviewText((current) => ({ ...current, [request.id]: event.target.value }))} placeholder="Optional reply to the guardian…" rows={2} />}{request.response && <p className="mt-3 rounded-lg bg-muted p-3 text-sm"><b>Reply:</b> {request.response}</p>}</div>) : <p className="p-6 text-sm text-muted-foreground">No leave requests yet.</p>}
        </CardContent></Card>
      )}
    </div>
  );
}