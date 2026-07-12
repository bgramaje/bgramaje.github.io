import { JobPost } from "./JobPost";
import { TerminalDialogShell } from "@/components/terminal/TerminalDialogShell";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  title: string;
}

export function JobModal({ isOpen, onClose, jobId, title }: JobModalProps) {
  return (
    <TerminalDialogShell
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="job"
    >
      <JobPost id={jobId} />
    </TerminalDialogShell>
  );
}
