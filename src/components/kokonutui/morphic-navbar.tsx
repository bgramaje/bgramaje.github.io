"use client";

import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { socialLinks } from "@/data/portfolio";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
} as const;

const navItems: Record<string, { name: string }> = {
  "/": { name: "me" },
  "/blog": { name: "blog" },
};

export function MorphicNavbar() {
  return (
    <div className="mx-auto w-full max-w-4xl px-2 py-1 flex items-center justify-between">
      {/* Nombre */}
      <span className="text-sm font-medium text-white shrink-0">bgramaje</span>

      {/* Navbar (me | blog) */}
      <nav className="flex items-center justify-center shrink-0">
        <div className="flex overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
          {Object.entries(navItems).map(([path, { name }]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-center px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/20 text-white dark:bg-white/20 dark:text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
                )
              }
            >
              {name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Redes sociales */}
      <div className="flex items-center gap-1 shrink-0">
        {socialLinks.map((link) => {
          const Icon = iconMap[link.icon as keyof typeof iconMap];
          if (!Icon) return null;
          return (
            <a
              key={link.name}
              href={link.url}
              target={link.icon === "mail" ? undefined : "_blank"}
              rel={link.icon === "mail" ? undefined : "noopener noreferrer"}
              className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label={link.name}
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default MorphicNavbar;
