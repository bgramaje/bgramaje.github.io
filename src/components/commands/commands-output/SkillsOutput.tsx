import { skills } from "@/content/data/portfolio";

export function SkillsOutput() {
  return (
    <div className="space-y-4">
      <p className="text-primary font-semibold">Technical Skills:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.category} className="space-y-2">
            <h3 className="text-foreground font-medium">{skill.category}</h3>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className="px-1.5 py-0 text-xs text-success rounded-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
