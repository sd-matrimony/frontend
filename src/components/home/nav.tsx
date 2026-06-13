import Link from "next/link";

import { Button } from "@/components/ui/button";

function Nav() {
  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="df h-16">
          <Link href="/" className="df gap-0.5 mr-auto">
            <img
              src="/logos/logo-512.webp"
              width={48}
              height={48}
              alt='SDM-logo'
            />
            <span className='hidden sm:block text-2xl font-bold text-pink-700'>SD Matrimony</span>
          </Link>

          <Link href="#contact" className="hidden md:block md:ml-auto md:mr-4 text-gray-700 hover:text-rose-500 transition-colors font-medium">
            Contact
          </Link>

          <div className="df gap-4 ml-auto md:ml-0">
            <Button variant="outline" nativeButton={false} render={<Link href="/auth/user/signup" />}>
              Sign Up
            </Button>

            <Button nativeButton={false} render={<Link href="/auth/user/signin" />} className="bg-linear-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-6">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
