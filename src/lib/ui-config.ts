import { configureUI } from "@glraj/ui/config";

import { cn } from "@/lib/utils";

// App-wide tweaks on top of @glraj/ui defaults. Imported from the root layout (server) and ClientWrapper (client).

// `default` fully replaces the library's: its `[a]:hover:bg-primary/80` would beat a custom
// `hover:bg-*` on link buttons (e.g. "Start Your Journey") since class merging can't drop it.
const replacedVariants = new Set(["default"])

const buttonVariantCls: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "shadow-xs",
  secondary: "hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
}

const buttonSizeCls: Record<string, string> = {
  default: "in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  xs: "rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md",
  sm: "h-8 rounded-[min(var(--radius-md),10px)] text-sm in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-4",
  lg: "gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  "icon-xs": "rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md",
  "icon-sm": "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
}

const fieldCls = "px-2.5 text-base md:text-sm transition-[color,box-shadow] disabled:bg-transparent dark:disabled:bg-input/30"

configureUI({
  button: (props, base) => cn(
    base(replacedVariants.has(props?.variant ?? "default") ? { ...props, variant: null } : props),
    "active:translate-y-0 active:not-aria-[haspopup]:translate-y-px",
    buttonVariantCls[props?.variant ?? "default"],
    buttonSizeCls[props?.size ?? "default"],
  ),
  input: base => cn(base, fieldCls),
  textarea: base => cn(base, fieldCls),
})
