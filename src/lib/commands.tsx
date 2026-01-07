import { jobs } from "@/data/portfolio";
import { BlogPost } from "@/components/BlogPost";
import { JobDetail } from "@/components/JobDetail";
import { HelpOutput } from "./commands-output/HelpOutput";
import { JobsOutput } from "./commands-output/JobsOutput";
import { PublicationsOutput } from "./commands-output/PublicationsOutput";
import { SkillsOutput } from "./commands-output/SkillsOutput";
import { StudiesOutput } from "./commands-output/StudiesOutput";
import { ContactOutput } from "./commands-output/ContactOutput";
import { WhoamiOutput } from "./commands-output/WhoamiOutput";
import { ErrorOutput } from "./commands-output/ErrorOutput";
import { BlogOutput } from "./commands-output/BlogOutput";

interface ProcessCommandOptions {
  onCommandClick?: (command: string) => void;
  onOpenModal?: (content: React.ReactNode, title: string, placeholder?: string) => void;
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
          const content = <JobDetail job={job} />;
          if (options?.onOpenModal) {
            options.onOpenModal(content, `Job: ${job.company}`, `job detail ${job.id}`);
            return null;
          }
          return content;
        }
        return <ErrorOutput command={`Job with id "${args[0]}" not found`} />;
      }
      return <JobsOutput onJobClick={(jobId) => {
        const job = jobs.find((j) => j.id === jobId);
        if (job && options?.onOpenModal) {
          const content = <JobDetail job={job} />;
          options.onOpenModal(content, `Job: ${job.company}`, `job detail ${job.id}`);
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
    case "blog":
      if (args[0] === "read" && args[1]) {
        // Navigate to blog route instead of opening modal
        if (options?.onNavigate) {
          options.onNavigate(`/blog/${args[1]}`);
          return null;
        }
        // Fallback to modal if navigate is not available
        const content = <BlogPost id={args[1]} />;
        if (options?.onOpenModal) {
          options.onOpenModal(content, `Blog: ${args[1]}`);
          return null;
        }
        return content;
      }
      return (
        <BlogOutput
          onPostClick={(id) => {
            if (options?.onNavigate) {
              options.onNavigate(`/blog/${id}`);
            } else if (options?.onOpenModal) {
              const content = <BlogPost id={id} />;
              options.onOpenModal(content, `Blog: ${id}`);
            } else {
              options?.onCommandClick?.(`blog read ${id}`);
            }
          }}
        />
      );
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


