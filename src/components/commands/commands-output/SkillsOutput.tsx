import { motion } from "motion/react";
import { skills } from "@/content/data/portfolio";
import { TechChip } from "@/components/shared/TechChip";

const chipMotion = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, duration: 0.3, bounce: 0 },
};

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
  let chipIndex = 0;

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
      {skills.map((skill) => {
        const label = SKILL_LABELS[skill.category] ?? skill.category;

        return (
          <div
            key={skill.category}
            className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-x-2.5"
          >
            <span className="shrink-0 font-mono text-[10px] font-medium uppercase leading-none tracking-widest text-muted-foreground">
              {label}
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {skill.items.map((item) => {
                const i = chipIndex++;
                return (
                  <motion.span
                    key={`${skill.category}-${item}`}
                    {...chipMotion}
                    transition={{ ...chipMotion.transition, delay: i * 0.08 }}
                  >
                    <TechChip label={item} tier="default" />
                  </motion.span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
