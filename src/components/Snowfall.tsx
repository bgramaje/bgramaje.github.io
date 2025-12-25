import { Snowfall as ReactSnowfall } from "react-snowfall";

export function Snowfall() {
  const today = new Date();
  const month = today.getMonth() + 1; // 1-12
  const day = today.getDate();

  // Check if we're between December 1st and January 7th
  const isSnowSeason = 
    (month === 12 && day >= 1) || // December 1-31
    (month === 1 && day <= 7);    // January 1-7

  if (!isSnowSeason) {
    return null;
  }

  return (
    <ReactSnowfall
      style={{
        position: "fixed",
        width: "100vw",
        height: "100dvh",
        pointerEvents: "none",
        zIndex: 0,
      }}
      snowflakeCount={100}
      speed={[0.5, 2]}
      wind={[-0.5, 0.5]}
      radius={[0.5, 3]}
    />
  );
}

