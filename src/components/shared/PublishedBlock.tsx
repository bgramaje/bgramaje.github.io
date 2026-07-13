import { cn } from "@/lib/utils";

export interface PublishedBlockProps {
  /** Fecha en `YYYY-MM-DD` u otra cadena que entienda `Date.parse`. */
  date: string;
  /** Text before the date (defaults to English). */
  label?: string;
  /** Locale for formatting the date (defaults to `en-GB`). */
  locale?: string;
  className?: string;
}

function formatPublishedDate(value: string, locale: string): string {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(t))
    .replace(/\./g, "");
}

export function PublishedBlock({
  date,
  label = "Published on",
  locale = "en-GB",
  className,
}: PublishedBlockProps) {
  const formatted = formatPublishedDate(date, locale);
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="whitespace-nowrap text-muted-foreground text-sm font-sans leading-normal">
        {label}{" "}
        <strong className="text-foreground font-semibold tabular-nums">{formatted}</strong>
      </span>
    </div>
  );
}
