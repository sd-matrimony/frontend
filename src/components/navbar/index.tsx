import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Menu from './menu';
import { LanguageSwitcher } from '@/components/common/language-switcher';

type props = {
  role: rolesT
}

type linkT = {
  labelKey: string
  href: string
}

const superAdminLinks: linkT[] = [
  {
    labelKey: "allUsers",
    href: "users",
  },
  {
    labelKey: "marriedUsers",
    href: "married",
  },
  {
    labelKey: "createUser",
    href: "create-user",
  },
]

const adminLinks: linkT[] = [
  {
    labelKey: "createUser",
    href: "create-user",
  },
  {
    labelKey: "imageExtractor",
    href: "image-extractor",
  },
]

const userLinks: linkT[] = [
  {
    labelKey: "liked",
    href: "liked",
  },
  {
    labelKey: "unlocked",
    href: "unlocked",
  },
]

const list: Record<rolesT, linkT[]> = {
  "super-admin": superAdminLinks,
  admin: adminLinks,
  user: userLinks,
}

async function Navbar({ role = "user" }: props) {
  const t = await getTranslations("shared.navbar")

  return (
    <nav className="df sm:gap-4 py-2 px-6 z-1 shadow-md sticky top-0 bg-white">
      <Link href={`/${role}`} className="df gap-0.5 mr-auto shrink-0">
        <img
          src="/logos/logo-512.webp"
          width={32}
          height={32}
          alt='SDM-logo'
        />
        <span className='hidden sm:block text-lg font-semibold text-pink-700'>SDM</span>
      </Link>

      {
        list[role].map(link => (
          <Link
            key={link.href}
            href={`/${role}/${link.href}`}
            className='text-[11px] sm:text-xs lg:text-sm hover:text-pink-700'
          >
            {t(link.labelKey)}
          </Link>
        ))
      }

      <LanguageSwitcher triggerCls="h-8 px-2" />

      <Menu />
    </nav>
  )
}

export default Navbar