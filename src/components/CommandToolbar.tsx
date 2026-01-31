"use client";

import {
  HelpCircle,
  Briefcase,
  FileText,
  Wrench,
  Mail,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { commands } from "@/data/portfolio";

const COMMAND_ITEMS: { id: string; icon: LucideIcon; title: string }[] = [
  { id: "help", icon: HelpCircle, title: commands.help },
  { id: "jobs", icon: Briefcase, title: commands.jobs },
  { id: "publications", icon: FileText, title: commands.publications },
  { id: "skills", icon: Wrench, title: commands.skills },
  { id: "contact", icon: Mail, title: commands.contact },
  { id: "studies", icon: GraduationCap, title: commands.studies },
];

interface CommandToolbarProps {
  onCommandClick: (command: string) => void;
  className?: string;
}

export function CommandToolbar({ onCommandClick, className }: CommandToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5 p-1",
        className
      )}
    >
      {COMMAND_ITEMS.map((item) => (
        <motion.button
          key={item.id}
          type="button"
          title={item.title}
          onClick={() => onCommandClick(item.id)}
          className={cn(
            "group relative flex items-center justify-center shrink-0 w-9 h-9 rounded-md",
            "bg-terminal-surface/80 text-terminal-muted hover:text-terminal-text hover:bg-terminal-border/50",
            "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-success focus-visible:ring-offset-2 focus-visible:ring-offset-terminal-surface"
          )}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <item.icon className="h-4 w-4" aria-hidden />
          <span className="sr-only">{item.title}</span>
          <span className="absolute right-full top-1/2 -translate-y-1/2 mr-1.5 px-2 py-1 rounded bg-terminal-border text-terminal-text text-xs whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 z-10">
            {item.title}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
