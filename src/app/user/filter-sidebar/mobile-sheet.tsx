import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Filters from "./filters";

interface props {
  hasFilters: boolean
  onSave: (filterData: any) => void
}

function MobileSheet({ hasFilters, onSave }: props) {
  const [open, setOpen] = useState(false)
  const t = useTranslations("user.filters")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" className="md:hidden fixed top-20 left-4 z-1" />}>
        <Menu /> {t("title")}
      </SheetTrigger>

      <SheetContent side="left" className="p-4">
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("sheetDescription")}</SheetDescription>
        </SheetHeader>

        <Filters
          contentHt="h-[calc(100svh-6rem)]"
          hasFilters={hasFilters}
          onSave={onSave}
          onClose={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSheet