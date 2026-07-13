import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Bitcoin } from "lucide-react";
import { BitcoinTicker } from "@/components/shared/BitcoinTicker";
import { CvPdfDownloadButton } from "@/components/cv/CvPdfDownloadButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { requestTerminalInputFocus } from "@/lib/terminal-focus";
import { cn, pageShellClass } from "@/lib/utils";

const navItems: { path: string; name: string }[] = [
  { path: "/", name: "me" },
  { path: "/blog", name: "blog" },
];

function shellNavLinkClass(isActive: boolean) {
  return cn(
    "inline-flex min-h-10 items-center px-0.5 font-mono text-sm transition-[color,transform] active:scale-[0.96]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm",
    isActive
      ? "text-foreground underline decoration-chart-3 decoration-2 underline-offset-[6px]"
      : "text-muted-foreground hover:text-foreground"
  );
}

export function Navbar() {
  return (
    <div className={`${pageShellClass} py-1 flex items-center`}>
      <div className="flex flex-1 min-w-0 items-center gap-2">
        <span className="shrink-0 text-sm font-medium text-foreground">bgramaje</span>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] hover:bg-accent hover:text-foreground active:scale-[0.96]"
              aria-label="Bitcoin price"
            >
              <Bitcoin size={20} aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={8}
            className="w-auto rounded-lg border border-border/60 bg-popover/95 backdrop-blur-xl shadow-lg p-0 flex items-center justify-center"
          >
            <div className="flex items-center justify-center px-4 py-3">
              <BitcoinTicker inline />
            </div>
          </PopoverContent>
        </Popover>
        <div className="hidden md:block min-w-0">
          <BitcoinTicker />
        </div>
      </div>

      <nav className="flex shrink-0 items-center justify-center gap-1.5 px-2" aria-label="Main">
        {navItems.map(({ path, name }, index) => (
          <Fragment key={path}>
            {index > 0 ? (
              <span className="font-mono text-sm text-muted-foreground/35 select-none" aria-hidden>
                /
              </span>
            ) : null}
            <NavLink
              to={path}
              end={path === "/"}
              onClick={() => {
                if (path === "/") {
                  requestTerminalInputFocus();
                }
              }}
              className={({ isActive }) => shellNavLinkClass(isActive)}
            >
              {name}
            </NavLink>
          </Fragment>
        ))}
      </nav>

      <div className="flex flex-1 min-w-0 items-center justify-end gap-1 sm:gap-1.5">
        <CvPdfDownloadButton />
        <ThemeToggle />
      </div>
    </div>
  );
}
