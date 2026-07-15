import type React from "react";
import { cn } from "@/lib/utils";
import { TerminalTitleBar } from "@/components/terminal/TerminalTitleBar";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

type TerminalDialogSize = "job" | "terminal";

const sizeClasses: Record<TerminalDialogSize, string> = {
  job: "w-full md:max-w-2xl lg:max-w-[42rem]",
  terminal: "w-full md:max-w-4xl",
};

interface TerminalDialogShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: TerminalDialogSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  scrollRef?: React.Ref<HTMLDivElement>;
}

export function TerminalDialogShell({
  isOpen,
  onClose,
  title,
  size = "job",
  children,
  footer,
  className,
  scrollRef,
}: TerminalDialogShellProps) {
  const description = `Terminal dialog: ${title}`;

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ResponsiveDialogContent
        showHandle={false}
        className={cn(
          sizeClasses[size],
          "flex h-[88dvh] flex-col p-0 md:h-fit md:max-h-[92dvh]",
          "bg-card border-border/50 shadow-2xl shadow-black/40",
          "rounded-t-xl md:rounded-xl",
          className
        )}
      >
        <ResponsiveDialogTitle className="sr-only">{title}</ResponsiveDialogTitle>
        <ResponsiveDialogDescription className="sr-only">
          {description}
        </ResponsiveDialogDescription>
        <TerminalTitleBar title={title} onClose={onClose} />

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-none md:rounded-b-xl">
          <div
            ref={scrollRef}
            className="dialog-scroll flex-1 overflow-y-auto overscroll-contain scroll-smooth px-3 pb-5 md:px-5 md:pb-7 text-sm"
          >
            {children}
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent"
            aria-hidden
          />
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-border/60 bg-card">
            {footer}
          </div>
        ) : null}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
