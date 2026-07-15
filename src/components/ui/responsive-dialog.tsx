import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

const ResponsiveDialogContext = React.createContext<boolean>(true);

function useResponsiveDialogContext() {
  return React.useContext(ResponsiveDialogContext);
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <ResponsiveDialogContext.Provider value={isDesktop}>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      )}
    </ResponsiveDialogContext.Provider>
  );
}

export function ResponsiveDialogContent({
  children,
  className,
  showHandle,
}: {
  children: React.ReactNode;
  className?: string;
  showHandle?: boolean;
}) {
  const isDesktop = useResponsiveDialogContext();
  return isDesktop ? (
    <DialogContent className={className}>{children}</DialogContent>
  ) : (
    // Full-bleed wins over shared desktop max-w (twMerge: last conflict wins).
    <DrawerContent className={cn(className, "w-full max-w-none")} showHandle={showHandle}>
      {children}
    </DrawerContent>
  );
}

export function ResponsiveDialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isDesktop = useResponsiveDialogContext();
  return isDesktop ? (
    <DialogHeader className={className}>{children}</DialogHeader>
  ) : (
    <DrawerHeader className={className}>{children}</DrawerHeader>
  );
}

export function ResponsiveDialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isDesktop = useResponsiveDialogContext();
  return isDesktop ? (
    <DialogTitle className={className}>{children}</DialogTitle>
  ) : (
    <DrawerTitle className={className}>{children}</DrawerTitle>
  );
}

export function ResponsiveDialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isDesktop = useResponsiveDialogContext();
  return isDesktop ? (
    <DialogDescription className={className}>{children}</DialogDescription>
  ) : (
    <DrawerDescription className={className}>{children}</DrawerDescription>
  );
}

export function ResponsiveDialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isDesktop = useResponsiveDialogContext();
  return isDesktop ? (
    <DialogFooter className={className}>{children}</DialogFooter>
  ) : (
    <DrawerFooter className={className}>{children}</DrawerFooter>
  );
}

export function ResponsiveDialogClose({
  children,
  className,
  asChild,
}: {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  const isDesktop = useResponsiveDialogContext();
  return isDesktop ? (
    <DialogClose className={className} asChild={asChild}>
      {children}
    </DialogClose>
  ) : (
    <DrawerClose className={className} asChild={asChild}>
      {children}
    </DrawerClose>
  );
}
