import Link from 'next/link';
import Menu from './menu';

type props = {
  role: rolesT
}

type linkT = {
  lable: string
  href: string
}

const superAdminLinks: linkT[] = [
  {
    lable: "All users",
    href: "users",
  },
  {
    lable: "Married users",
    href: "married",
  },
  {
    lable: "Create user",
    href: "create-user",
  },
]

const adminLinks: linkT[] = [
  {
    lable: "Create user",
    href: "create-user",
  },
  {
    lable: "Image Extractor",
    href: "image-extractor",
  },
]

const userLinks: linkT[] = [
  {
    lable: "Liked",
    href: "liked",
  },
  {
    lable: "Unlocked",
    href: "unlocked",
  },
]

const list: Record<rolesT, linkT[]> = {
  "super-admin": superAdminLinks,
  admin: adminLinks,
  user: userLinks,
}

function Navbar({ role = "user" }: props) {
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
            {link.lable}
          </Link>
        ))
      }

      <Menu />
    </nav>
  )
}

export default Navbar