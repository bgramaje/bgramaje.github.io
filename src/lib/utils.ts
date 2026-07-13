import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pageWidthClass =
  "mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-2";

export const pageShellClass = `${pageWidthClass} px-4`;

