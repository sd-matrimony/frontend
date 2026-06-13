import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

function Layout({ children, role = "admin" }: { children: React.ReactNode; role?: rolesT }) {
  return (
    <section className="container mx-auto py-6 max-w-6xl @container">
      <Button variant="outline" className="mb-6 mt-2" render={<Link href={`/${role}`} />}>
        <ChevronLeft className="size-4" /> Go Back
      </Button>

      <div className="grid @2xl:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  )
}

export default Layout
