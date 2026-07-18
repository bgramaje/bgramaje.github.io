import { publications } from "@/content/data/portfolio";
import { StaggerItem } from "@/components/commands/commands-output/StaggerItem";

const rowClass =
  "group flex min-h-10 items-start gap-3 rounded-lg px-2 py-1.5 -mx-2 -my-1.5 transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function PublicationRow({
  pub,
}: {
  pub: (typeof publications)[number];
}) {
  const content = (
    <>
      <span className="text-success shrink-0 mt-0.5" aria-hidden>
        ▸
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-foreground text-sm font-medium min-w-0 truncate group-hover:text-success transition-colors">{pub.title}</p>
        <p className="text-muted-foreground text-xs mt-0.5">
          {pub.publisher} · {pub.role} · {pub.tags.join(", ")}
        </p>
        <p className="text-foreground/70 text-xs mt-0.5 min-w-0 truncate" title={pub.description}>
          {pub.description}
        </p>
      </div>
    </>
  );

  if (pub.link) {
    return (
      <a
        href={pub.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${rowClass} hover:bg-border/25`}
      >
        {content}
      </a>
    );
  }

  return <div className={rowClass}>{content}</div>;
}

export function PublicationsOutput() {
  return (
    <div className="space-y-3 mx-2">
      {publications.map((pub, i) => (
        <StaggerItem key={pub.uid} index={i}>
          <PublicationRow pub={pub} />
        </StaggerItem>
      ))}
    </div>
  );
}
