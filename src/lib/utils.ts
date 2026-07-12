import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pageShellClass =
  "mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4";

