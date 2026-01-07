import { skills } from "@/data/portfolio";

export function SkillsOutput() {
  return (
    <div className="space-y-4">
      <p className="text-terminal-accent font-semibold">Technical Skills:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.category} className="space-y-2">
            <h3 className="text-terminal-text font-medium">{skill.category}</h3>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className="px-2 py-1 text-xs bg-terminal-border/50 text-terminal-success rounded-lg"
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

