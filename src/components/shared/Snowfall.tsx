import { lazy, Suspense } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const ReactSnowfall = lazy(() =>
  import("react-snowfall").then((module) => ({ default: module.Snowfall }))
);

export function Snowfall() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const today = new Date();
  const month = today.getMonth() + 1; // 1-12
  const day = today.getDate();

  // Check if we're between December 1st and January 7th
  const isSnowSeason = 
    (month === 12 && day >= 1) || // December 1-31
    (month === 1 && day <= 7);    // January 1-7

  if (!isSnowSeason || reduceMotion) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ReactSnowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100dvh",
          pointerEvents: "none",
          zIndex: 0,
        }}
        snowflakeCount={isMobile ? 35 : 70}
        speed={[0.5, 2]}
        wind={[-0.5, 0.5]}
        radius={[0.5, 3]}
      />
    </Suspense>
  );
}
