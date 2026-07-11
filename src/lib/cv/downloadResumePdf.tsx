import { pdf } from "@react-pdf/renderer";
import { parse } from "yaml";
import type { YamlResume } from "./types";
import {
  ResumePdfDocument,
  type ResumeLocale,
} from "./ResumePdfDocument";

const YAML_URL_BY_LOCALE: Record<ResumeLocale, string> = {
  es: "/borja-gramaje.en.yml",
  en: "/borja-gramaje.en.yml",
};

const DEFAULT_FILENAME: Record<ResumeLocale, string> = {
  es: "Borja-Gramaje-CV.pdf",
  en: "Borja-Gramaje-CV.pdf",
};

export async function downloadResumePdfFromYaml(
  locale: ResumeLocale,
  filename?: string,
): Promise<void> {
  const response = await fetch(YAML_URL_BY_LOCALE[locale]);
  if (!response.ok) {
    throw new Error(`Failed to fetch CV YAML: ${response.status}`);
  }
  const raw = await response.text();
  const root = parse(raw) as YamlResume;
  if (!root?.content?.basics?.name) {
    throw new Error("Invalid CV: missing content.basics.name in YAML.");
  }

  const blob = await pdf(
    <ResumePdfDocument content={root.content} locale={locale} />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? DEFAULT_FILENAME[locale];
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
