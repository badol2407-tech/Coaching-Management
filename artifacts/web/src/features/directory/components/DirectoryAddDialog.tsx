import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateDirectoryRecord } from "@/features/directory";
import type {
  AdministrativeStaffRole,
  DirectoryRecordKind,
} from "@/features/directory";

interface DirectoryAddDialogProps {
  kind: DirectoryRecordKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const staffRoles: Array<{ value: AdministrativeStaffRole; label: string }> = [
  { value: "office_manager", label: "Office manager" },
  { value: "finance", label: "Finance" },
  { value: "admissions", label: "Admissions" },
  { value: "support", label: "Support" },
  { value: "other", label: "Other" },
];

export function DirectoryAddDialog({
  kind,
  open,
  onOpenChange,
}: DirectoryAddDialogProps) {
  const { toast } = useToast();
  const createRecord = useCreateDirectoryRecord();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<AdministrativeStaffRole>("other");
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null,
  );

  const isGuardian = kind === "guardian";
  const title = isGuardian ? "Add Guardian" : "Add Staff";
  const description = isGuardian
    ? "Create a guardian account for your organization."
    : "Create an administrative staff account for your organization.";

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPhone("");
      setRole("other");
      setTemporaryPassword(null);
      createRecord.reset();
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await createRecord.mutateAsync({
        kind,
        name,
        email,
        phone,
        ...(isGuardian ? {} : { role }),
      });
      setTemporaryPassword(result.temporaryPassword);
      toast({
        title: `${isGuardian ? "Guardian" : "Staff member"} added`,
        description: "The directory has been updated.",
      });
    } catch (error) {
      toast({
        title: "Could not add account",
        description:
          error instanceof Error
            ? error.message
            : "Please check the details and try again.",
        variant: "destructive",
      });
    }
  }

  function copyPassword() {
    if (!temporaryPassword) return;
    void navigator.clipboard.writeText(temporaryPassword);
    toast({ title: "Temporary password copied" });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {temporaryPassword ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <DialogTitle>Account created</DialogTitle>
                  <DialogDescription>
                    Share this temporary password with {name}.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Temporary password
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <code className="text-lg font-semibold tracking-wider text-primary">
                  {temporaryPassword}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyPassword}
                >
                  <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                  Copy
                </Button>
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              The new account will be asked to set a new password after the
              first login.
            </p>
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor={`${kind}-name`}>Full name</Label>
                <Input
                  id={`${kind}-name`}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={
                    isGuardian ? "Guardian name" : "Staff member name"
                  }
                  minLength={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${kind}-email`}>Email address</Label>
                <Input
                  id={`${kind}-email`}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${kind}-phone`}>Phone number</Label>
                <Input
                  id={`${kind}-phone`}
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
              {!isGuardian && (
                <div className="space-y-2">
                  <Label htmlFor={`${kind}-role`}>Staff role</Label>
                  <select
                    id={`${kind}-role`}
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as AdministrativeStaffRole)
                    }
                    className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {staffRoles.map((staffRole) => (
                      <option key={staffRole.value} value={staffRole.value}>
                        {staffRole.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createRecord.isPending}>
                {createRecord.isPending && (
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Create account
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
