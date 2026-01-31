import type React from "react";
import { useId } from "react";

interface LightRaysProps {
  count?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  speed?: number;
  length?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Animated light rays shining down from above. Inspired by Magic UI Light Rays.
 * @see https://magicui.design/docs/components/light-rays
 */
export function LightRays({
  count = 7,
  color = "rgba(160, 210, 255, 0.2)",
  blur = 36,
  opacity = 0.65,
  speed = 14,
  length = "70vh",
  className,
  style,
}: LightRaysProps) {
  const id = useId();
  const lengthVal = typeof length === "number" ? `${length}px` : length;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      style={style}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const rotation = (360 / count) * i;
        const delay = (speed * 0.3 * (i / count)) % speed;
        return (
          <div
            key={`${id}-${i}`}
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 origin-bottom"
            style={{
              width: "150vmax",
              height: lengthVal,
              transform: `translateX(-50%) translateY(-50%) rotate(${rotation}deg)`,
              background: `conic-gradient(from 0deg at 50% 0%, transparent 0deg, ${color} 15deg, transparent 30deg)`,
              filter: `blur(${blur}px)`,
              opacity,
              animation: `light-ray-pulse ${speed}s ease-in-out ${-delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
