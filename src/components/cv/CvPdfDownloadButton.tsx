import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";

export function CvPdfDownloadButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const runDownload = async () => {
    setLoading(true);
    try {
      const { downloadResumePdfFromYaml } = await import("@/components/cv/downloadResumePdf");
      await downloadResumePdfFromYaml("en");
    } catch (err) {
      console.error(err);
      alert("Could not generate the CV PDF. Check the console or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className={cn("relative inline-flex shrink-0 rounded-lg", className)}>
      <RainbowButton
        asChild
        size="icon"
        variant="default"
        className="h-10 w-10 shrink-0 rounded-lg p-0"
      >
        <button
          type="button"
          disabled={loading}
          onClick={runDownload}
          className="flex h-10 w-10 items-center justify-center disabled:opacity-60"
          aria-busy={loading}
          aria-label="Download CV PDF"
          title="Download CV"
        >
          <span className="flex items-center justify-center">
            {loading ? (
              <Loader2
                size={17}
                className="shrink-0 animate-spin sm:h-[18px] sm:w-[18px]"
              />
            ) : (
              <FileDown
                size={17}
                className="shrink-0 sm:h-[18px] sm:w-[18px]"
              />
            )}
          </span>
        </button>
      </RainbowButton>
    </span>
  );
}
