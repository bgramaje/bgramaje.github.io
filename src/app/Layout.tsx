import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/app/navbar";
import { SiteFooter } from "@/app/footer";
import { ScrollContainerContext } from "@/components/ui/scroll-progress";

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const mainRef = useRef<HTMLElement>(null);

  return (
    <ScrollContainerContext.Provider value={mainRef}>
      <div className="h-[100dvh] flex flex-col overflow-hidden bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-foreground focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-ring"
        >
          Skip to main content
        </a>
        <header className="shrink-0 pb-0">
          <Navbar />
        </header>
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className={`flex-1 flex flex-col min-h-0 ${isHome ? "overflow-hidden" : "overflow-auto"}`}
        >
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </ScrollContainerContext.Provider>
  );
}
