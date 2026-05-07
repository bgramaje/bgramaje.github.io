import {
  Document,
  Image,
  Link,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeContent } from "./types";
import { getProfilePhotoSrcForPdf } from "./profilePhoto";
import { bulletLines, introLines, paragraphLines, plainFromMarkdown } from "./plainText";

export type ResumeLocale = "es" | "en";

const LABELS: Record<
  ResumeLocale,
  {
    summary: string;
    experience: string;
    education: string;
    publications: string;
    skills: string;
    languages: string;
    present: string;
    link: string;
    docSubject: string;
  }
> = {
  es: {
    summary: "Resumen",
    experience: "Experiencia",
    education: "Educación",
    publications: "Publicaciones",
    skills: "Habilidades",
    languages: "Idiomas",
    present: "Presente",
    link: "enlace",
    docSubject: "Currículum vitae",
  },
  en: {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    publications: "Publications",
    skills: "Skills",
    languages: "Languages",
    present: "Present",
    link: "link",
    docSubject: "Curriculum vitae",
  },
};

function formatPeriod(
  start: string | undefined,
  end: string | null | undefined,
  presentLabel: string,
): string {
  const s = start?.trim() || "";
  const e = end?.trim();
  if (!e) return s ? `${s} — ${presentLabel}` : "";
  return s ? `${s} — ${e}` : e;
}

const AVATAR_SIZE = 56;

const styles = StyleSheet.create({
  page: {
    paddingTop: 14,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.35,
    color: "#1a1a1a",
  },
  headerStack: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginBottom: 14,
    gap: 5,
  },
  headerContactCluster: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 3,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    objectFit: "cover",
    borderRadius: AVATAR_SIZE / 2,
  },
  name: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    width: "100%",
  },
  headline: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
    width: "100%",
  },
  headerMeta: {
    fontSize: 8.5,
    textAlign: "center",
    width: "100%",
  },
  headerLinksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 5,
  },
  link: { color: "#1a365d", textDecoration: "underline", fontSize: 8.5 },
  section: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },
  summaryLine: { fontSize: 9, marginBottom: 3, paddingLeft: 2, textAlign: "justify" },
  workIntro: { fontSize: 8.8, marginBottom: 2, paddingLeft: 2, color: "#222", textAlign: "justify" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 6,
    gap: 8,
  },
  strong: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  muted: { fontSize: 8.5, color: "#444" },
  italic: { fontStyle: "italic", fontSize: 8.8, marginBottom: 3 },
  bullet: { fontSize: 8.8, marginBottom: 2, paddingLeft: 10, textAlign: "justify" },
  skillBlock: { marginBottom: 5 },
  skillTitle: { fontFamily: "Helvetica-Bold", fontSize: 8.8 },
  skillKw: { fontSize: 8.5, color: "#333", marginTop: 1, textAlign: "justify" },
});

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.section}>{children}</Text>;
}

interface Props {
  content: ResumeContent;
  locale: ResumeLocale;
}

export function ResumePdfDocument({ content, locale }: Props) {
  const { basics, location, profiles } = content;
  const L = LABELS[locale];

  const locParts = [location?.city, location?.region, location?.country].filter(
    Boolean,
  ) as string[];
  const locationStr = locParts.join(", ");

  const summaryLines = paragraphLines(basics.summary);

  return (
    <Document
      title={`${basics.name} — CV`}
      author={basics.name}
      subject={L.docSubject}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerStack} wrap={false}>
          <Image
            src={getProfilePhotoSrcForPdf()}
            style={styles.avatar}
          />
          <Text style={styles.name}>{basics.name}</Text>
          {basics.headline ? (
            <Text style={styles.headline}>{basics.headline}</Text>
          ) : null}
          {(basics.email ||
            basics.url ||
            (profiles && profiles.length > 0) ||
            locationStr) ? (
            <View style={styles.headerContactCluster}>
              {(basics.email || basics.phone) ? (
                <Text style={styles.headerMeta}>
                  {[basics.email, basics.phone].filter(Boolean).join("  ·  ")}
                </Text>
              ) : null}
              {(basics.url || (profiles && profiles.length > 0)) ? (
                <View style={styles.headerLinksRow}>
                  {basics.url ? (
                    <View>
                      <Link src={basics.url} style={styles.link}>
                        <Text style={styles.link}>
                          {basics.url.replace(/^https?:\/\//, "")}
                        </Text>
                      </Link>
                    </View>
                  ) : null}
                  {profiles?.map((p) => (
                    <View key={p.url}>
                      <Link src={p.url} style={styles.link}>
                        <Text style={styles.link}>
                          {p.network}
                        </Text>
                      </Link>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {summaryLines.length > 0 ? (
          <>
            <SectionTitle>{L.summary}</SectionTitle>
            <Text style={styles.summaryLine}>
              {summaryLines.join(" ")}
            </Text>
          </>
        ) : null}

        {content.work && content.work.length > 0 ? (
          <>
            <SectionTitle>{L.experience}</SectionTitle>
            {content.work.map((job, i) => (
              <View key={i} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.strong}>{job.name}</Text>
                  <Text style={styles.muted}>
                    {formatPeriod(job.startDate, job.endDate, L.present)}
                  </Text>
                </View>
                {job.position ? (
                  <Text style={styles.italic}>{job.position}</Text>
                ) : null}
                {introLines(job.summary).map((line, j) => (
                  <Text key={j} style={styles.workIntro}>
                    {line}
                  </Text>
                ))}
                {bulletLines(job.summary).map((line, j) => (
                  <Text key={j} style={styles.bullet}>
                    • {line}
                  </Text>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {content.education && content.education.length > 0 ? (
          <>
            <SectionTitle>{L.education}</SectionTitle>
            {content.education.map((ed, i) => (
              <View key={i} style={{ marginTop: i === 0 ? 2 : 6 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.strong}>{ed.institution}</Text>
                  <Text style={styles.muted}>
                    {formatPeriod(ed.startDate, ed.endDate, L.present)}
                  </Text>
                </View>
                <Text style={styles.italic}>
                  {[ed.degree, ed.area].filter(Boolean).join(" — ")}
                </Text>
                {paragraphLines(ed.summary).map((line, j) => (
                  <Text key={j} style={styles.bullet}>
                    • {line}
                  </Text>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {content.publications && content.publications.length > 0 ? (
          <>
            <SectionTitle>{L.publications}</SectionTitle>
            {content.publications.map((pub, i) => (
              <View key={i} style={{ marginTop: i === 0 ? 2 : 5 }}>
                <Text style={styles.strong}>
                  {pub.name}
                  {pub.releaseDate ? ` (${pub.releaseDate})` : ""}
                </Text>
                {pub.url ? (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Text style={styles.muted}>{pub.publisher}</Text>
                    <Text style={styles.muted}> — </Text>
                    <Link src={pub.url} style={styles.link}>
                      <Text style={styles.link}>{L.link}</Text>
                    </Link>
                  </View>
                ) : (
                  <Text style={[styles.muted, { marginTop: 2 }]}>
                    {pub.publisher}
                  </Text>
                )}
                {pub.summary ? (
                  <Text style={{ fontSize: 8.5, marginTop: 2, textAlign: "justify" }}>
                    {plainFromMarkdown(pub.summary.trim())}
                  </Text>
                ) : null}
              </View>
            ))}
          </>
        ) : null}

        {content.skills && content.skills.length > 0 ? (
          <>
            <SectionTitle>{L.skills}</SectionTitle>
            {content.skills.map((sk, i) => (
              <View key={i} style={styles.skillBlock}>
                <Text style={styles.skillTitle}>
                  {sk.name}
                  {sk.level ? ` — ${sk.level}` : ""}
                </Text>
                {sk.keywords?.length ? (
                  <Text style={styles.skillKw}>{sk.keywords.join(", ")}</Text>
                ) : null}
              </View>
            ))}
          </>
        ) : null}

        {content.languages && content.languages.length > 0 ? (
          <>
            <SectionTitle>{L.languages}</SectionTitle>
            {content.languages.map((lang, i) => (
              <Text key={i} style={styles.bullet}>
                • {lang.language}
                {lang.fluency ? `: ${lang.fluency}` : ""}
              </Text>
            ))}
          </>
        ) : null}
      </Page>
    </Document>
  );
}
