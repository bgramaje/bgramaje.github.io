import { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import { Bitcoin, Menu } from "lucide-react";
import { Button as AriaButton, Dialog as AriaDialog } from "react-aria-components";
import { BitcoinTicker } from "@/components/shared/BitcoinTicker";
import { CvPdfDownloadButton } from "@/components/cv/CvPdfDownloadButton";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { requestTerminalInputFocus } from "@/lib/terminal-focus";
import { cn, pageShellClass } from "@/lib/utils";

const navItems: { path: string; name: string }[] = [
  { path: "/", name: "me" },
  { path: "/blog", name: "blog" },
  { path: "/changelog", name: "changelog" },
];

function shellNavLinkClass(isActive: boolean) {
  return cn(
    "inline-flex min-h-10 items-center px-0.5 font-mono text-sm transition-[color,transform] active:scale-[0.96]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm",
    isActive
      ? "text-foreground underline decoration-chart-3 decoration-2 underline-offset-[6px]"
      : "text-muted-foreground hover:text-foreground",
  );
}

function sheetNavLinkClass(isActive: boolean) {
  return cn(
    "flex min-h-11 w-full items-center rounded-lg px-3 font-mono text-base transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    isActive
      ? "bg-accent text-foreground"
      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );
}

export function Navbar() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleNav = (path: string) => {
    setSheetOpen(false);
    if (path === "/") requestTerminalInputFocus();
  };

  return (
    <div className={`${pageShellClass} py-1 flex items-center`}>
      <div className="flex flex-1 min-w-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onPress={() => setSheetOpen(true)}
        >
          <Menu aria-hidden />
        </Button>
        <span className="shrink-0 text-sm font-medium text-foreground">bgramaje</span>
        <PopoverTrigger>
          <AriaButton
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] hover:bg-accent hover:text-foreground active:scale-[0.96] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Bitcoin price"
          >
            <Bitcoin size={20} aria-hidden />
          </AriaButton>
          <Popover
            placement="bottom"
            offset={8}
            className="w-auto rounded-lg border border-border/60 bg-popover/95 backdrop-blur-xl shadow-lg p-0 flex items-center justify-center"
          >
            <AriaDialog className="outline-none" aria-label="Bitcoin price details">
              <div className="flex items-center justify-center px-4 py-3">
                <BitcoinTicker inline />
              </div>
            </AriaDialog>
          </Popover>
        </PopoverTrigger>
        <div className="hidden md:block min-w-0">
          <BitcoinTicker />
        </div>
      </div>

      <nav
        className="hidden md:flex shrink-0 items-center justify-center gap-1.5 px-2"
        aria-label="Main"
      >
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
                if (path === "/") requestTerminalInputFocus();
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

      <Sheet isOpen={sheetOpen} onOpenChange={setSheetOpen} side="left">
        <SheetHeader>
          <SheetTitle className="font-mono">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4 pb-6">
          <nav className="flex flex-col gap-1" aria-label="Main">
            {navItems.map(({ path, name }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={() => handleNav(path)}
                className={({ isActive }) => sheetNavLinkClass(isActive)}
              >
                {name}
              </NavLink>
            ))}
          </nav>
        </div>
      </Sheet>
    </div>
  );
}
