import * as React from "react";
import * as RT from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = RT.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof RT.List>,
  React.ComponentPropsWithoutRef<typeof RT.List>
>(({ className, ...props }, ref) => (
  <RT.List
    ref={ref}
    className={cn("inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}
    {...props}
  />
));
TabsList.displayName = RT.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RT.Trigger>,
  React.ComponentPropsWithoutRef<typeof RT.Trigger>
>(({ className, ...props }, ref) => (
  <RT.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = RT.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof RT.Content>,
  React.ComponentPropsWithoutRef<typeof RT.Content>
>(({ className, ...props }, ref) => (
  <RT.Content ref={ref} className={cn("mt-2 ring-offset-background", className)} {...props} />
));
TabsContent.displayName = RT.Content.displayName;
