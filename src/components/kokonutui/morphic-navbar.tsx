import { NavLink } from "react-router-dom";
import { Bitcoin } from "lucide-react";
import { BitcoinTicker } from "@/components/shared/BitcoinTicker";
import { CvPdfDownloadButton } from "@/components/cv/CvPdfDownloadButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SegmentedNavGroup, segmentedNavItemClassName } from "@/components/ui/segmented-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { requestTerminalInputFocus } from "@/lib/terminal-focus";
import { pageShellClass } from "@/lib/utils";

const navItems: Record<string, { name: string }> = {
  "/": { name: "me" },
  "/blog": { name: "blog" },
};

export function MorphicNavbar() {
  return (
    <div className={`${pageShellClass} py-1 flex items-center`}>
      {/* Nombre + Bitcoin (en mobile solo icono coin con popover al pulsar) */}
      <div className="flex flex-1 min-w-0 items-center gap-2">
        <span className="text-sm font-medium text-foreground">bgramaje</span>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Bitcoin price"
            >
              <Bitcoin size={20} aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            sideOffset={8}
            className="w-auto rounded-lg border border-border/60 bg-popover/95 backdrop-blur-xl shadow-lg p-0 flex items-center justify-center"
          >
            <div className="flex items-center justify-center px-4 py-3">
              <BitcoinTicker inline />
            </div>
          </PopoverContent>
        </Popover>
        <div className="hidden md:block">
          <BitcoinTicker />
        </div>
      </div>

      {/* Navbar (me | blog) */}
      <nav className="flex shrink-0 items-center justify-center" aria-label="Main">
        <SegmentedNavGroup>
          {Object.entries(navItems).map(([path, { name }]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => {
                if (path === "/") {
                  requestTerminalInputFocus();
                }
              }}
              className={({ isActive }) => segmentedNavItemClassName(isActive)}
            >
              {name}
            </NavLink>
          ))}
        </SegmentedNavGroup>
      </nav>

      {/* Tema + CV */}
      <div className="flex flex-1 min-w-0 items-center justify-end gap-1 sm:gap-1.5">
        <ThemeToggle />
        <CvPdfDownloadButton />
      </div>
    </div>
  );
}


