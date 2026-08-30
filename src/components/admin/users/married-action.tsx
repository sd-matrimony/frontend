"use client";

import { useState } from "react";

import FindUser from "@/components/admin/make-match/find-user";
import Confirm from "@/components/admin/make-match/confirm";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: Partial<userT>
}

function MarriedAction({ open, onOpenChange, user }: props) {
  const [partner, setPartner] = useState<Partial<userT> | null>(null)
  const [key, setKey] = useState(0)

  const isMale = user.gender === "Male"
  const male = isMale ? user : partner
  const female = isMale ? partner : user

  function onConfirm() {
    setPartner(null)
    setKey(k => k + 1)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Mark {user.fullName} as Married</DialogTitle>
        </DialogHeader>

        <div className="df items-center gap-3 border rounded-md p-3">
          <img
            className="size-14 shrink-0 rounded object-cover"
            src={user.profileImg || "/imgs/user.jpg"}
            alt={user.fullName || "Profile Image"}
          />

          <div>
            <p className="text-xs text-muted-foreground">Marrying</p>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-xs text-muted-foreground">{user.gender}</p>
          </div>
        </div>

        <div className="max-h-[55vh] p-1 overflow-y-auto">
          <FindUser
            key={key}
            selected={partner?._id || ""}
            setSelected={setPartner}
            gender={isMale ? "Female" : "Male"}
          />
        </div>

        <Confirm male={male} female={female} onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  )
}

export default MarriedAction
