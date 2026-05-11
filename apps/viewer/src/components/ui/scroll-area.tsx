import * as React from "react";
import * as RSA from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof RSA.Root>,
  React.ComponentPropsWithoutRef<typeof RSA.Root>
>(({ className, children, ...props }, ref) => (
  <RSA.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <RSA.Viewport className="h-full w-full rounded-[inherit]">{children}</RSA.Viewport>
    <ScrollBar />
    <RSA.Corner />
  </RSA.Root>
));
ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof RSA.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof RSA.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <RSA.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2 border-l border-l-transparent p-px",
      orientation === "horizontal" && "h-2 flex-col border-t border-t-transparent p-px",
      className,
    )}
    {...props}
  >
    <RSA.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </RSA.ScrollAreaScrollbar>
));
ScrollBar.displayName = "ScrollBar";
