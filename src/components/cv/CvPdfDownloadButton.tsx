import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function downloadCvPdf() {
  const { downloadResumePdfFromYaml } = await import("@/components/cv/downloadResumePdf");
  await downloadResumePdfFromYaml("en");
}

export function CvPdfDownloadButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const runDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      await downloadCvPdf();
    } catch (err) {
      console.error(err);
      setError("Could not generate the CV PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        isDisabled={loading}
        onPress={() => {
          void runDownload();
        }}
        aria-busy={loading}
        aria-label="Download CV PDF"
        aria-describedby={error ? "cv-download-error" : undefined}
        className="size-10"
      >
        {loading ? (
          <Loader2 className={cn("size-[17px]", !reduceMotion && "animate-spin")} aria-hidden />
        ) : (
          <FileDown className="size-[17px]" aria-hidden />
        )}
      </Button>
      {error ? (
        <span
          id="cv-download-error"
          role="alert"
          className="absolute top-full right-0 z-50 mt-1 max-w-48 rounded-md border border-destructive/40 bg-popover px-2 py-1 text-xs text-destructive shadow-sm"
        >
          {error}
        </span>
      ) : null}
    </span>
  );
}
