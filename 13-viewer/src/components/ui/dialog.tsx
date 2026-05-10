import * as React from "react";
import * as RD from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = RD.Root;
export const DialogTrigger = RD.Trigger;
export const DialogClose = RD.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof RD.Overlay>,
  React.ComponentPropsWithoutRef<typeof RD.Overlay>
>(({ className, ...props }, ref) => (
  <RD.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-fade-in",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = RD.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof RD.Content>,
  React.ComponentPropsWithoutRef<typeof RD.Content>
>(({ className, children, ...props }, ref) => (
  <RD.Portal>
    <DialogOverlay />
    <RD.Content
      ref={ref}
      className={cn(
        "fixed right-0 top-0 z-50 h-full w-full max-w-2xl border-l bg-card p-6 shadow-lg flex flex-col gap-3 outline-none",
        "data-[state=open]:animate-fade-in",
        className,
      )}
      {...props}
    >
      {children}
      <RD.Close className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </RD.Close>
    </RD.Content>
  </RD.Portal>
));
DialogContent.displayName = RD.Content.displayName;

export const DialogTitle = RD.Title;
export const DialogDescription = RD.Description;
