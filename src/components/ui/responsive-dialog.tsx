import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  Dialog,
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

type ResponsiveDialogContextValue = {
  isDesktop: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ResponsiveDialogContext =
  React.createContext<ResponsiveDialogContextValue | null>(null);

function useResponsiveDialogContext() {
  const ctx = React.useContext(ResponsiveDialogContext);
  if (!ctx) {
    throw new Error("ResponsiveDialog components must be used within ResponsiveDialog");
  }
  return ctx;
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
    <ResponsiveDialogContext.Provider value={{ isDesktop, open, onOpenChange }}>
      {isDesktop ? (
        children
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
  const { isDesktop, open, onOpenChange } = useResponsiveDialogContext();
  return isDesktop ? (
    <Dialog
      isOpen={open}
      onOpenChange={onOpenChange}
      className={className}
      showCloseButton={false}
    >
      {children}
    </Dialog>
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
  const { isDesktop } = useResponsiveDialogContext();
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
  const { isDesktop } = useResponsiveDialogContext();
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
  const { isDesktop } = useResponsiveDialogContext();
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
  const { isDesktop } = useResponsiveDialogContext();
  return isDesktop ? (
    <DialogFooter className={className}>{children}</DialogFooter>
  ) : (
    <DrawerFooter className={className}>{children}</DrawerFooter>
  );
}

export function ResponsiveDialogClose({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { isDesktop } = useResponsiveDialogContext();
  return isDesktop ? (
    <DialogClose className={className}>{children}</DialogClose>
  ) : (
    <DrawerClose className={className}>{children}</DrawerClose>
  );
}
