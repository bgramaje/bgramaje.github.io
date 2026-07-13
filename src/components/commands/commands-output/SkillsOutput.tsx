import { skills } from "@/content/data/portfolio";
import { TechChip } from "@/components/shared/TechChip";

export function SkillsOutput() {
  return (
    <div className="space-y-4">
      <p className="text-primary font-semibold">Technical Skills:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.category} className="space-y-2">
            <h3 className="text-foreground font-medium">{skill.category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {skill.items.map((item) => (
                <TechChip key={item} label={item} tier="default" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
