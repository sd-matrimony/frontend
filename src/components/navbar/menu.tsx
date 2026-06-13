"use client";

import { Loader } from 'lucide-react';
import Link from 'next/link';

import { useLogout, useUserDetailsMini } from '@/hooks/use-account';

import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@/components/ui/menu";

// const adminLinks = [
//   {
//     lable: "Married users",
//     href: "married",
//   },
//   {
//     lable: "Make Match",
//     href: "make-match",
//   },
// ]

const superAdminLinks = [
  {
    lable: "Create user",
    href: "create-user",
  },
  {
    lable: "Image Extractor",
    href: "image-extractor",
  },
  {
    lable: "Payment",
    href: "payment",
  },
  {
    lable: "Bulk Update",
    href: "bulk-edit"
  }
]

function NavMenu() {
  const { data: user, isLoading } = useUserDetailsMini()
  const userName = user?.fullName
  const role = user?.role

  const { mutate } = useLogout()

  return (
    <Menu>
      <MenuTrigger
        className="dc size-8 p-0 shrink-0 rounded-full uppercase bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading && <Loader className="size-4 animate-spin" />}
        {!isLoading && userName?.[0]}
      </MenuTrigger>

      <MenuContent className='w-40' align="end">
        <MenuLabel render={<div />}>
          <p className="mb-1 text-sm font-medium leading-none line-clamp-1">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground line-clamp-1">{user?.email}</p>
        </MenuLabel>

        <MenuSeparator />

        {
          role === "user" &&
          <>
            <MenuItem render={<Link href={`/user/profile/${user?._id}`} />}>
              Profile
            </MenuItem>

            <MenuItem render={<Link href="/user/account" />}>
              Account
            </MenuItem>
          </>
        }

        {/* {
          !isLoading && role === "admin" &&
          adminLinks.map(link => (
            <MenuItem key={link.href} render={<Link href={`/admin/${link.href}`} />}>
              {link.lable}
            </MenuItem>
          ))
        } */}

        {
          !isLoading && role === "super-admin" &&
          superAdminLinks.map(link => (
            <MenuItem key={link.href} render={<Link href={`/super-admin/${link.href}`} />}>
              {link.lable}
            </MenuItem>
          ))
        }

        <MenuItem onClick={() => mutate()}>
          Log out
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

export default NavMenu
