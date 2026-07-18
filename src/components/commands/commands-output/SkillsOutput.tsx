import { skills } from "@/content/data/portfolio";
import { TechChip } from "@/components/shared/TechChip";
import { StaggerItem } from "@/components/commands/commands-output/StaggerItem";

/** Short mono labels for the stack-style row layout */
const SKILL_LABELS: Record<string, string> = {
  Languages: "Lang",
  Frontend: "Frontend",
  Backend: "Backend",
  Databases: "Data",
  "Message Queues & Protocols": "Messaging",
  "Platforms & Frameworks": "Platform",
  "DevOps & Infrastructure": "Infra",
  "IoT & Embedded": "Embedded",
  "Design Tools": "Design",
};

export function SkillsOutput() {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
      {skills.map((skill, i) => {
        const label = SKILL_LABELS[skill.category] ?? skill.category;

        return (
          <StaggerItem
            key={skill.category}
            index={i}
            className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-x-2.5"
          >
            <span className="shrink-0 font-mono text-[10px] font-medium uppercase leading-none tracking-widest text-muted-foreground">
              {label}
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {skill.items.map((item) => (
                <TechChip key={`${skill.category}-${item}`} label={item} tier="default" />
              ))}
            </div>
          </StaggerItem>
        );
      })}
    </div>
  );
}
