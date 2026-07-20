import { useState } from "react";
import {
  HelpCircle,
  Briefcase,
  FileText,
  Wrench,
  Mail,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { Dock, DockItem } from "@/components/motion/dock";
import { cn } from "@/lib/utils";

const COMMAND_ITEMS: { id: string; icon: LucideIcon; tooltip: string }[] = [
  { id: "help", icon: HelpCircle, tooltip: "Help" },
  { id: "jobs", icon: Briefcase, tooltip: "Jobs" },
  { id: "publications", icon: FileText, tooltip: "Publications" },
  { id: "skills", icon: Wrench, tooltip: "Skills" },
  { id: "contact", icon: Mail, tooltip: "Contact" },
  { id: "studies", icon: GraduationCap, tooltip: "Studies" },
];

interface CommandToolbarProps {
  onCommandClick: (command: string) => void;
  className?: string;
}

export function CommandToolbar({ onCommandClick, className }: CommandToolbarProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("flex w-full justify-center", className)}>
      <Dock size={40} className="pointer-events-auto" aria-label="Terminal commands">
        {COMMAND_ITEMS.map(({ id, icon: Icon, tooltip }) => (
          <DockItem
            key={id}
            aria-label={tooltip}
            tooltip={tooltip}
            active={active === id}
            onClick={() => {
              setActive(id);
              onCommandClick(id);
            }}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
