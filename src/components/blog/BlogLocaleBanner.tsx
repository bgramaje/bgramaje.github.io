import { Link } from "react-router-dom";
import { Languages } from "lucide-react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getBlogLocales, getBlogPostPath } from "@/lib/loaders/blogLoader";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
};

function bannerCopy(currentLocale: string, targetLocale: string) {
  if (currentLocale === "es") {
    return {
      title: "Versión en inglés disponible",
      description: "Este artículo también está disponible en inglés.",
      actionLabel: LOCALE_LABELS[targetLocale] ?? targetLocale.toUpperCase(),
    };
  }

  if (currentLocale === "en") {
    return {
      title: "Spanish version available",
      description: "This article is also available in Spanish.",
      actionLabel: LOCALE_LABELS[targetLocale] ?? targetLocale.toUpperCase(),
    };
  }

  return {
    title: `${LOCALE_LABELS[targetLocale] ?? targetLocale} version available`,
    description: `This article is also available in ${LOCALE_LABELS[targetLocale] ?? targetLocale}.`,
    actionLabel: LOCALE_LABELS[targetLocale] ?? targetLocale.toUpperCase(),
  };
}

interface BlogLocaleBannerProps {
  postId: string;
  currentLocale: string;
  className?: string;
}

export function BlogLocaleBanner({ postId, currentLocale, className }: BlogLocaleBannerProps) {
  const locales = getBlogLocales(postId);
  const alternateLocale = locales.find((loc) => loc !== currentLocale);

  if (!alternateLocale) return null;

  const copy = bannerCopy(currentLocale, alternateLocale);

  return (
    <Alert
      className={cn(
        "w-full px-3 py-2.5 pr-[5.5rem] text-sm has-[>svg]:gap-x-2.5 [&>svg]:size-4",
        className,
      )}
    >
      <Languages aria-hidden />
      <AlertTitle className="min-h-0 text-sm">{copy.title}</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed">
        {copy.description}
      </AlertDescription>
      <AlertAction className="top-2 right-2.5">
        <Button size="sm" variant="default" className="h-8 px-3 text-sm" asChild>
          <Link to={getBlogPostPath(postId, alternateLocale)}>{copy.actionLabel}</Link>
        </Button>
      </AlertAction>
    </Alert>
  );
}
