import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

async function Layout({ children, role = "admin" }: { children: React.ReactNode; role?: rolesT }) {
  const t = await getTranslations("shared.actions")

  return (
    <section className="p-6">
      <Button variant="outline" className="mb-6 mt-2" nativeButton={false} render={<Link href={`/${role}`} />}>
        <ChevronLeft className="size-4" /> {t("goBack")}
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        {children}
      </div>
    </section>
  )
}

export default Layout
