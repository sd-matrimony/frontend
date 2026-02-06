"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

type DialogFooterWrapperProps = {
  cancel?: React.ReactNode
  action?: React.ReactNode
  footerCls?: string
  actionCls?: string
  cancelCls?: string
  onAction?: () => void
  onCancel?: () => void
}

function DialogFooterWrapper({
  cancel,
  action,
  footerCls,
  actionCls,
  cancelCls,
  onAction = () => { },
  onCancel = () => { },
}: DialogFooterWrapperProps) {
  return (
    <DialogFooter className={footerCls}>
      {
        cancel &&
        <DialogClose asChild>
          <Button
            variant="secondary"
            onClick={onCancel}
            className={cn("border", cancelCls)}
            asChild={typeof cancel !== "string"}
          >
            {cancel}
          </Button>
        </DialogClose>
      }

      {
        action &&
        <Button
          onClick={onAction}
          className={actionCls}
          asChild={typeof action !== "string"}
        >
          {action}
        </Button>
      }
    </DialogFooter>
  )
}

type DialogWrapperProps = {
  title?: React.ReactNode
  trigger?: React.ReactNode
  children?: React.ReactNode
  description?: React.ReactNode
  descriptionCls?: string
  contentCls?: string
  headerCls?: string
  titleCls?: string
} & DialogFooterWrapperProps

function DialogWrapper({
  trigger,
  title,
  description,
  children,
  contentCls,
  headerCls,
  titleCls,
  descriptionCls,

  cancel = "Cancel",
  action,
  footerCls,
  actionCls,
  cancelCls,
  onAction,
  onCancel,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & DialogWrapperProps) {
  return (
    <Dialog {...props}>
      {trigger &&
        <DialogTrigger asChild={typeof trigger !== "string"}>{trigger}</DialogTrigger>
      }

      <DialogContent className={contentCls}>
        <DialogHeader className={headerCls}>
          <DialogTitle className={titleCls}>{title}</DialogTitle>
          {description && (
            <DialogDescription className={descriptionCls}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}

        {
          (!!cancel || !!action) &&
          <DialogFooterWrapper
            cancel={cancel}
            action={action}
            footerCls={footerCls}
            actionCls={actionCls}
            cancelCls={cancelCls}
            onAction={onAction}
            onCancel={onCancel}
          />
        }
      </DialogContent>
    </Dialog>
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogWrapper,
  DialogFooterWrapper,
}