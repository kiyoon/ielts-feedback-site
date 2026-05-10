import * as React from "react";
import * as RT from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export const TooltipProvider = RT.Provider;
export const Tooltip = RT.Root;
export const TooltipTrigger = RT.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof RT.Content>,
  React.ComponentPropsWithoutRef<typeof RT.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <RT.Portal>
    <RT.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-sm rounded-md border bg-card px-3 py-2 text-xs text-card-foreground shadow-md animate-fade-in",
        className,
      )}
      {...props}
    />
  </RT.Portal>
));
TooltipContent.displayName = RT.Content.displayName;
