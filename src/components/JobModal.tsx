import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalTitleBar } from "./TerminalTitleBar";
import { JobPost } from "./JobPost";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  title: string;
}

export function JobModal({ isOpen, onClose, jobId, title }: JobModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl h-fit max-h-[95dvh] bg-transparent border border-terminal-border/60 flex flex-col relative rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <TerminalTitleBar title={title} onClose={onClose} />

          <div className="flex-1 overflow-y-auto pt-2 pb-4 px-2 md:pt-3 md:pb-6 md:px-4 scroll-smooth text-sm">
            <JobPost id={jobId} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
