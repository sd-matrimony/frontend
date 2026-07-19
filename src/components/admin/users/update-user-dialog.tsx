"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import { useUpdateUserCritical } from "@/hooks/use-super-admin";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  _id: string
  fullName: string
  profileImg?: string
  email?: string
  mobile?: string
  salary?: number
}

function UpdateUserDialog({ open, onOpenChange, _id, fullName, profileImg, email, mobile, salary }: props) {
  const initial = { email: email || "", mobile: mobile || "", salary: salary != null ? String(salary) : "" }
  const [form, setForm] = useState(initial)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { mutate, isPending } = useUpdateUserCritical()

  useEffect(() => {
    if (open) setForm(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const emailChanged = form.email !== initial.email
  const mobileChanged = form.mobile !== initial.mobile
  const salaryChanged = form.salary !== initial.salary
  const changed = emailChanged || mobileChanged || salaryChanged

  function handleConfirm() {
    mutate(
      {
        _id,
        ...(emailChanged && { email: form.email }),
        ...(mobileChanged && { mobile: form.mobile }),
        ...(salaryChanged && { salary: form.salary ? Number(form.salary) : undefined }),
      },
      {
        onSuccess() {
          setConfirmOpen(false)
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Critical Details</DialogTitle>
        </DialogHeader>

        <div className="df gap-3 pb-3 border-b">
          <img
            src={profileImg || "/imgs/user.jpg"}
            className="size-12 rounded object-cover shrink-0"
            alt=""
          />
          <span className="font-medium">{fullName}</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="uc-email">Email</Label>
            <Input
              id="uc-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="user@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="uc-mobile">Mobile</Label>
            <Input
              id="uc-mobile"
              value={form.mobile}
              onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              placeholder="9876543210"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="uc-salary">Salary</Label>
            <Input
              id="uc-salary"
              type="number"
              min={0}
              value={form.salary}
              onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
              placeholder="50000"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger render={<Button disabled={!changed} />}>
              Update
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                <AlertDialogDescription>
                  You&apos;re about to update {fullName}&apos;s critical details. This action affects login and contact details.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="text-sm space-y-1.5 rounded-md border p-3 bg-muted/50">
                {emailChanged && (
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {email || "---"} <span className="text-muted-foreground">→</span>{" "}
                    <span className="font-medium">{form.email || "---"}</span>
                  </p>
                )}
                {mobileChanged && (
                  <p>
                    <span className="text-muted-foreground">Mobile:</span>{" "}
                    {mobile || "---"} <span className="text-muted-foreground">→</span>{" "}
                    <span className="font-medium">{form.mobile || "---"}</span>
                  </p>
                )}
                {salaryChanged && (
                  <p>
                    <span className="text-muted-foreground">Salary:</span>{" "}
                    {salary != null ? salary.toLocaleString() : "---"} <span className="text-muted-foreground">→</span>{" "}
                    <span className="font-medium">{form.salary ? Number(form.salary).toLocaleString() : "---"}</span>
                  </p>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="default"
                  className="bg-pink-600 hover:bg-pink-500"
                  render={<Button onClick={handleConfirm} disabled={isPending} />}
                >
                  {isPending && <Loader className="animate-spin" />}
                  Confirm & Update
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateUserDialog
