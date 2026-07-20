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
      {error ? (
        <span role="alert" className="sr-only">
          {error}
        </span>
      ) : null}
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
        className="size-10"
      >
        {loading ? (
          <Loader2 className={cn("size-[17px]", !reduceMotion && "animate-spin")} aria-hidden />
        ) : (
          <FileDown className="size-[17px]" aria-hidden />
        )}
      </Button>
    </span>
  );
}
