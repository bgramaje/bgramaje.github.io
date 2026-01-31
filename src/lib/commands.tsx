import { jobs } from "@/data/portfolio";
import { JobDetail } from "@/components/JobDetail";
import { HelpOutput } from "./commands-output/HelpOutput";
import { JobsOutput } from "./commands-output/JobsOutput";
import { PublicationsOutput } from "./commands-output/PublicationsOutput";
import { SkillsOutput } from "./commands-output/SkillsOutput";
import { StudiesOutput } from "./commands-output/StudiesOutput";
import { ContactOutput } from "./commands-output/ContactOutput";
import { ErrorOutput } from "./commands-output/ErrorOutput";

interface ProcessCommandOptions {
  onCommandClick?: (command: string) => void;
  onOpenModal?: (content: React.ReactNode, title: string, placeholder?: string) => void;
  onOpenJobModal?: (jobId: string, title: string) => void;
  onNavigate?: (path: string) => void;
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
    case "work":
    case "experience":
      if (args[0] && !isNaN(Number(args[0]))) {
        const jobId = Number(args[0]);
        const job = jobs.find((j) => j.id === jobId);
        if (job) {
          if (options?.onOpenJobModal) {
            options.onOpenJobModal(job.mdxSlug, `Job: ${job.company}`);
            return null;
          }
          return <JobDetail job={job} />;
        }
        return <ErrorOutput command={`Job with id "${args[0]}" not found`} />;
      }
      return <JobsOutput onJobClick={(jobId) => {
        const job = jobs.find((j) => j.id === jobId);
        if (job && options?.onOpenJobModal) {
          options.onOpenJobModal(job.mdxSlug, `Job: ${job.company}`);
        } else if (job) {
          options?.onCommandClick?.(`jobs ${jobId}`);
        }
      }} />;
    case "publications":
    case "papers":
    case "research":
      return <PublicationsOutput />;
    case "skills":
      return <SkillsOutput />;
    case "studies":
    case "education":
      return <StudiesOutput />;
    case "contact":
    case "social":
      return <ContactOutput />;
    case "home":
      if (options?.onNavigate) {
        options.onNavigate("/");
        return null;
      }
      return <div className="text-terminal-muted text-sm">Already on home page</div>;
    case "clear":
      return null;
    case "":
      return null;
    default:
      return <ErrorOutput command={input} />;
  }
}


