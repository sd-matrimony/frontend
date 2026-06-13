import { useState } from "react";
import { Check, Copy, CreditCard } from "lucide-react";

import { type niuT } from "@/hooks/use-super-admin";
import useClipboardCopy from "@/hooks/use-clipboard-copy";
import { createPass } from "@/utils/password";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import MakePaymentForUser from "../payment/make-payment-for-user";

type props = {
  user: niuT
}

function InviteAction({ user }: props) {
  const { copied, onCopyClk } = useClipboardCopy()
  const [open, setOpen] = useState(false)

  function onCopy() {
    const pass = createPass(user?.fullName, user?.dob)
    onCopyClk(`
Hello ${user?.fullName || "User"},

You've been added to SD Matrimony!
We're excited to have you on board and help you connect with meaningful matches.

Here are your login details:

Id: ${user?.contactDetails?.mobile || ""} (your mobile number)

Password: ${pass}

You can log in using the link below:
👉 Login to SD Matrimony - https://sdmatrimony.com/auth/user/signin

If you did not intend to join SD Matrimony or believe this was a mistake, you can delete your account anytime or contact our support team for assistance.
    `)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onCopy}
      >
        {copied ? <Check /> : <Copy />}
        {copied ? "Copied" : "Copy"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <CreditCard />
            Payment
          </Button>
        </DialogTrigger>

        <DialogContent className="@container max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment for {user?.fullName}</DialogTitle>
          </DialogHeader>

          <MakePaymentForUser userId={user?._id} compact onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InviteAction
