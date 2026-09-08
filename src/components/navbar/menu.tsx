"use client";

import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

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
    labelKey: "imageExtractor",
    href: "image-extractor",
  },
  {
    labelKey: "makeMatch",
    href: "make-match",
  },
  {
    labelKey: "payment",
    href: "payment",
  },
  {
    labelKey: "bulkUpdate",
    href: "bulk-edit"
  }
] as const

function NavMenu() {
  const t = useTranslations("shared.navbar")
  const { data: user, isLoading } = useUserDetailsMini()
  const userName = user?.fullName
  const role = user?.role

  const { mutate } = useLogout()

  return (
    <Menu>
      <MenuTrigger
        className="dc size-6 p-0 shrink-0 rounded-full text-xs uppercase bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading && <Loader className="size-3 animate-spin" />}
        {!isLoading && userName?.[0]}
      </MenuTrigger>

      <MenuContent className='w-40' align="end">
        <div className='px-2 py-1'>
          <p className="mb-1 text-sm font-medium leading-none line-clamp-1">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground line-clamp-1">{user?.email}</p>
        </div>

        <MenuSeparator />

        {
          role === "user" &&
          <>
            <MenuItem render={<Link href={`/user/profile/${user?._id}`} />}>
              {t("profile")}
            </MenuItem>

            <MenuItem render={<Link href="/user/account" />}>
              {t("account")}
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
              {t(link.labelKey)}
            </MenuItem>
          ))
        }

        <MenuItem onClick={() => mutate()}>
          {t("logout")}
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

export default NavMenu
