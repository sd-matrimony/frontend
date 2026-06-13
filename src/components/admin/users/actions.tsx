import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";

import type { tab } from "./types";

import { useResetPassByAdmin } from "@/hooks/use-super-admin";
import { useUpdateUserMutate } from "@/hooks/use-admin";
import { createPass } from "@/utils/password";

import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";

type props = {
  _id: string
  dob: string
  role: rolesT
  fullName: string
  currentTab: tab
}

function Actions({ _id, currentTab, role, fullName, dob }: props) {
  const { mutate: resetPass, isPending: resetPassPending } = useResetPassByAdmin()
  const { mutate } = useUpdateUserMutate()

  function updateStatus(approvalStatus: "approved" | "rejected") {
    mutate({ _id, approvalStatus, isBlocked: false, isDeleted: false })
  }

  function updateActions(data: Partial<userT>) {
    mutate({ _id, ...data, approvalStatus: "pending" })
  }

  function onReset() {
    resetPass({ _id, password: createPass(fullName, dob) })
  }

  return (
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
          <MenuItem onClick={onReset} disabled={resetPassPending}>
            Reset Password
          </MenuItem>
        }

        {
          currentTab !== "approved" && (
            <MenuItem onClick={() => updateStatus("approved")}>
              Approve
            </MenuItem>
          )
        }

        {
          (currentTab === "pending" || currentTab === "approved") && (
            <MenuItem onClick={() => updateStatus("rejected")}>
              Reject
            </MenuItem>
          )
        }

        {
          currentTab !== "blocked" && currentTab !== "deleted" && (
            <MenuItem onClick={() => updateActions({ isBlocked: true })}>
              Block
            </MenuItem>
          )
        }

        {
          currentTab === "blocked" && (
            <MenuItem onClick={() => updateActions({ isBlocked: false })}>
              Unblock
            </MenuItem>
          )
        }

        {
          currentTab !== "deleted" && (
            <MenuItem onClick={() => updateActions({ isDeleted: true })}>
              Delete
            </MenuItem>
          )
        }

        {
          currentTab === "deleted" && (
            <MenuItem onClick={() => updateActions({ isDeleted: false })}>
              Restore
            </MenuItem>
          )
        }
      </MenuContent>
    </Menu>
  )
}

export default Actions
