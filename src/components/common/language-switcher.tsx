"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";

import { setLocale } from "@/lib/i18n/actions";
import { locales, localeLabels } from "@/utils";
import { SelectWrapper } from "@/components/ui/select";

function LanguageSwitcher({ triggerCls }: { triggerCls?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onChange(value: unknown) {
    startTransition(async () => {
      await setLocale(value as (typeof locales)[number]);
      router.refresh();
    });
  }

  return (
    <SelectWrapper
      value={locale}
      onValueChange={onChange}
      disabled={isPending}
      items={locales.map(l => ({ value: l, label: localeLabels[l] }))}
      triggerCls={triggerCls}
      renderValue={(value) => (
        <span className="flex items-center gap-1.5">
          <Languages className="size-4" />
          {localeLabels[value as (typeof locales)[number]] ?? value}
        </span>
      )}
    />
  );
}

export { LanguageSwitcher };
