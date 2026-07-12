import { useRef } from "react";
import type React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
}

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("#") && color.length === 7) {
    const a = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${a}`;
  }
  return color;
}

function decorationClass(action: AnnotationAction): string {
  switch (action) {
    case "highlight":
      return "box-decoration-clone rounded-[3px] px-0.5 py-px";
    case "underline":
      return "underline underline-offset-[5px] decoration-2";
    case "box":
      return "rounded-[3px] px-0.5 py-px";
    case "circle":
      return "rounded-full px-1 py-px";
    case "strike-through":
      return "line-through decoration-2";
    case "crossed-off":
      return "line-through opacity-70 decoration-2";
    case "bracket":
      return "border-x-2 px-1 mx-0.5";
    default:
      return "";
  }
}

function decorationStyle(action: AnnotationAction, color: string, strokeWidth: number): React.CSSProperties {
  const thickness = `${strokeWidth}px`;

  switch (action) {
    case "highlight":
      return {
        backgroundColor: withAlpha(color, 0.35),
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      };
    case "underline":
    case "strike-through":
    case "crossed-off":
      return {
        textDecorationColor: color,
        textDecorationThickness: thickness,
      };
    case "box":
    case "circle":
      return {
        outline: `${thickness} solid ${color}`,
        outlineOffset: "3px",
      };
    case "bracket":
      return { borderColor: color };
    default:
      return {};
  }
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  isView = false,
}: HighlighterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const visible = !isView || isInView;

  const className = cn(
    "relative inline w-fit max-w-full [text-decoration-skip-ink:none]",
    decorationClass(action),
    isView && !visible && "opacity-0"
  );

  const style = decorationStyle(action, color, strokeWidth);

  if (isView) {
    return (
      <motion.span
        ref={ref}
        className={className}
        style={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span ref={ref} className={className} style={style}>
      {children}
    </span>
  );
}
