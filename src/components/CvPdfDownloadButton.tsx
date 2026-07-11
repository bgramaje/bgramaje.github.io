"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";

export function CvPdfDownloadButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const runDownload = async () => {
    setLoading(true);
    try {
      const { downloadResumePdfFromYaml } = await import(
        "@/lib/cv/downloadResumePdf"
      );
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
        className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 animate-rainbow rounded-lg p-0 transition-[width] duration-300 ease-out"
      >
        <button
          type="button"
          disabled={loading}
          onClick={runDownload}
          className="group flex h-8 w-8 min-w-[2rem] items-center justify-center overflow-hidden transition-[width] duration-300 ease-out hover:w-[46px] disabled:opacity-60 sm:h-9 sm:w-9 sm:min-w-[2.25rem] sm:hover:w-[52px]"
          aria-busy={loading}
          aria-label="Download CV PDF"
          title="Download CV"
        >
          <span className="flex w-full items-center justify-center px-0.5">
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
            <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-[11px] font-medium transition-[max-width,margin] duration-300 ease-out group-hover:ml-1.5 group-hover:max-w-[20px] sm:group-hover:ml-2 sm:group-hover:max-w-[20px]">
              CV
            </span>
          </span>
        </button>
      </RainbowButton>
    </span>
  );
}
