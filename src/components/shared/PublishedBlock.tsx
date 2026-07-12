import { cn } from "@/lib/utils";

export interface PublishedBlockProps {
  /** Fecha en `YYYY-MM-DD` u otra cadena que entienda `Date.parse`. */
  date: string;
  /** Texto antes de la fecha (por defecto en español). */
  label?: string;
  /** Locale para formatear la fecha (por defecto `es-ES`). */
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
  label = "Publicado el",
  locale = "es-ES",
  className,
}: PublishedBlockProps) {
  const formatted = formatPublishedDate(date, locale);
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="whitespace-nowrap text-muted-foreground text-[0.95rem] font-sans leading-none">
        {label}{" "}
        <strong className="text-foreground font-semibold">{formatted}</strong>
      </span>
    </div>
  );
}
