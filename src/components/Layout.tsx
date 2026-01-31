import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MorphicNavbar } from "@/components/kokonutui/morphic-navbar";
import { ScrollContainerContext } from "@/components/ui/scroll-progress";

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const mainRef = useRef<HTMLElement>(null);

  return (
    <ScrollContainerContext.Provider value={mainRef}>
      <div className="h-[100dvh] flex flex-col overflow-hidden bg-neutral-950">
        <header className="shrink-0 pt-0.5 pb-0">
          <MorphicNavbar />
        </header>
        <main
          ref={mainRef}
          className={`flex-1 flex flex-col min-h-0 ${isHome ? "overflow-hidden" : "overflow-auto"}`}
        >
          <Outlet />
        </main>
      </div>
    </ScrollContainerContext.Provider>
  );
}
