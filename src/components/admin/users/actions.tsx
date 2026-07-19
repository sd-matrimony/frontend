import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";

import type { tab } from "./types";

import { useResetPassByAdmin } from "@/hooks/use-super-admin";
import { useUpdateUserMutate } from "@/hooks/use-admin";
import { createPass } from "@/utils/password";

import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { AlertDialogWrapper } from "@/components/ui/alert-dialog";

import UpdateUserDialog from "./update-user-dialog";

type props = {
  _id: string
  dob: string
  role: rolesT
  fullName: string
  currentTab: tab
  profileImg?: string
  email?: string
  mobile?: string
  salary?: number
}

type confirmT = {
  title: string
  description: string
  variant: "destructive" | "default"
  run: () => void
} | null

function Actions({ _id, currentTab, role, fullName, dob, profileImg, email, mobile, salary }: props) {
  const [confirm, setConfirm] = useState<confirmT>(null)
  const [updateOpen, setUpdateOpen] = useState(false)

  const { mutate: resetPass, isPending: resetPassPending } = useResetPassByAdmin()
  const { mutate, isPending: mutatePending } = useUpdateUserMutate()

  const isPending = resetPassPending || mutatePending

  function updateStatus(approvalStatus: "approved" | "rejected") {
    mutate({ _id, approvalStatus, isBlocked: false, isDeleted: false }, { onSuccess: () => setConfirm(null) })
  }

  function updateActions(data: Partial<userT>) {
    mutate({ _id, ...data, approvalStatus: "pending" }, { onSuccess: () => setConfirm(null) })
  }

  function onReset() {
    resetPass({ _id, password: createPass(fullName, dob) }, { onSuccess: () => setConfirm(null) })
  }

  function ask(confirmArgs: NonNullable<confirmT>) {
    setConfirm(confirmArgs)
  }

  function runConfirm() {
    confirm?.run()
  }

  return (
    <>
      <Menu>
        <MenuTrigger className="px-2">
          <BsThreeDots />
        </MenuTrigger>

        <MenuContent align="end">
          <MenuItem render={<Link href={`/${role}/user/${_id}`} />}>
            View
          </MenuItem>

          {
            role === "super-admin" && currentTab === "approved" &&
            <MenuItem onClick={() => ask({
              title: "Reset password?",
              description: `${fullName}'s password will be reset to a system-generated default.`,
              variant: "destructive",
              run: onReset,
            })}>
              Reset Password
            </MenuItem>
          }

          {
            role === "super-admin" && currentTab === "approved" &&
            <MenuItem onClick={() => setUpdateOpen(true)}>
              Update Details
            </MenuItem>
          }

          {
            currentTab !== "approved" && (
              <MenuItem onClick={() => ask({
                title: "Approve this user?",
                description: `${fullName} will be approved and gain access to the platform.`,
                variant: "default",
                run: () => updateStatus("approved"),
              })}>
                Approve
              </MenuItem>
            )
          }

          {
            (currentTab === "pending" || currentTab === "approved") && (
              <MenuItem onClick={() => ask({
                title: "Reject this user?",
                description: `${fullName} will be rejected and lose access to the platform.`,
                variant: "destructive",
                run: () => updateStatus("rejected"),
              })}>
                Reject
              </MenuItem>
            )
          }

          {
            currentTab !== "blocked" && currentTab !== "deleted" && (
              <MenuItem onClick={() => ask({
                title: "Block this user?",
                description: `${fullName} will not be able to log in until unblocked.`,
                variant: "destructive",
                run: () => updateActions({ isBlocked: true }),
              })}>
                Block
              </MenuItem>
            )
          }

          {
            currentTab === "blocked" && (
              <MenuItem onClick={() => ask({
                title: "Unblock this user?",
                description: `${fullName} will regain access to the platform.`,
                variant: "default",
                run: () => updateActions({ isBlocked: false }),
              })}>
                Unblock
              </MenuItem>
            )
          }

          {
            currentTab !== "deleted" && (
              <MenuItem onClick={() => ask({
                title: "Delete this user?",
                description: `${fullName} will be moved to deleted users.`,
                variant: "destructive",
                run: () => updateActions({ isDeleted: true }),
              })}>
                Delete
              </MenuItem>
            )
          }

          {
            currentTab === "deleted" && (
              <MenuItem onClick={() => ask({
                title: "Restore this user?",
                description: `${fullName} will be restored and marked pending approval.`,
                variant: "default",
                run: () => updateActions({ isDeleted: false }),
              })}>
                Restore
              </MenuItem>
            )
          }
        </MenuContent>
      </Menu>

      <AlertDialogWrapper
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={confirm?.title}
        description={confirm?.description}
        loading={isPending}
        cancel="Cancel"
        action="Confirm"
        actionCls={confirm?.variant === "default" ? "bg-pink-600 hover:bg-pink-500" : undefined}
        onAction={runConfirm}
        onCancel={() => setConfirm(null)}
      />

      {
        role === "super-admin" && currentTab === "approved" &&
        <UpdateUserDialog
          open={updateOpen}
          onOpenChange={setUpdateOpen}
          _id={_id}
          fullName={fullName}
          profileImg={profileImg}
          email={email}
          mobile={mobile}
          salary={salary}
        />
      }
    </>
  )
}

export default Actions
