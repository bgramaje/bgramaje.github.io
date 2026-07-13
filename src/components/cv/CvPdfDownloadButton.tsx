import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";

const iconTransition = { type: "spring" as const, duration: 0.3, bounce: 0 };

export function CvPdfDownloadButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const { downloadResumePdfFromYaml } = await import("@/components/cv/downloadResumePdf");
      await downloadResumePdfFromYaml("en");
    } catch (err) {
      console.error(err);
      setError("Could not generate the CV PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className={cn("relative inline-flex shrink-0 rounded-lg", className)}>
      {error ? (
        <span role="alert" className="sr-only">
          {error}
        </span>
      ) : null}
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
          <span className="relative flex size-[17px] items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {loading ? (
                <motion.span
                  key="loading"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                  transition={iconTransition}
                >
                  <Loader2
                    size={17}
                    className="shrink-0 animate-spin sm:h-[18px] sm:w-[18px]"
                  />
                </motion.span>
              ) : (
                <motion.span
                  key="download"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                  transition={iconTransition}
                >
                  <FileDown
                    size={17}
                    className="shrink-0 sm:h-[18px] sm:w-[18px]"
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>
      </RainbowButton>
    </span>
  );
}
