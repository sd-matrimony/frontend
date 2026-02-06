import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

type CardWrapperProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  actions?: React.ReactNode
  wrapperCls?: string
  headerCls?: string
  titleCls?: string
  descriptionCls?: string
  contentCls?: string
  footerCls?: string
}

function CardWrapper({
  title,
  description,
  children,
  footer,
  actions,
  wrapperCls,
  headerCls,
  titleCls,
  descriptionCls,
  contentCls,
  footerCls,
}: CardWrapperProps) {
  return (
    <Card className={wrapperCls}>
      <CardHeader className={headerCls}>
        {title && <CardTitle className={titleCls}>{title}</CardTitle>}
        {description && <CardDescription className={descriptionCls}>{description}</CardDescription>}

        {actions}
      </CardHeader>

      {
        children &&
        <CardContent className={contentCls}>
          {children}
        </CardContent>
      }

      {footer
        ? typeof footer === "string"
          ? <CardFooter className={footerCls}>{footer}</CardFooter>
          : footer
        : null
      }
    </Card>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardWrapper,
}
