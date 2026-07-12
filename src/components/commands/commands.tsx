import { JobPost } from "@/components/jobs/JobPost";
import { HelpOutput } from "@/components/commands/commands-output/HelpOutput";
import { JobsOutput } from "@/components/commands/commands-output/JobsOutput";
import { ProjectsOutput } from "@/components/commands/commands-output/ProjectsOutput";
import { PublicationsOutput } from "@/components/commands/commands-output/PublicationsOutput";
import { SkillsOutput } from "@/components/commands/commands-output/SkillsOutput";
import { StudiesOutput } from "@/components/commands/commands-output/StudiesOutput";
import { ContactOutput } from "@/components/commands/commands-output/ContactOutput";
import { ErrorOutput } from "@/components/commands/commands-output/ErrorOutput";
import { getAllJobIds } from "@/lib/jobLoader";

interface ProcessCommandOptions {
  onOpenModal?: (content: React.ReactNode, title: string, placeholder?: string) => void;
  onOpenJobModal?: (jobId: string, title: string) => void;
}

export function processCommand(
  input: string,
  options?: ProcessCommandOptions
): React.ReactNode {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case "help":
      return <HelpOutput />;
    case "jobs":
      if (args[0]) {
        const slug = args[0];
        const validIds = getAllJobIds();
        if (validIds.includes(slug)) {
          if (options?.onOpenJobModal) {
            options.onOpenJobModal(slug, "Job");
            return null;
          }
          return <JobPost id={slug} />;
        }
        return <ErrorOutput command={`Job "${slug}" not found`} />;
      }
      return (
        <JobsOutput
          onJobClick={(slug) => options?.onOpenJobModal?.(slug, "Job")}
        />
      );
    case "projects":
      return <ProjectsOutput />;
    case "publications":
      return <PublicationsOutput />;
    case "skills":
      return <SkillsOutput />;
    case "studies":
      return <StudiesOutput />;
    case "contact":
      return <ContactOutput />;
    case "":
      return null;
    default:
      return <ErrorOutput command={input} />;
  }
}
