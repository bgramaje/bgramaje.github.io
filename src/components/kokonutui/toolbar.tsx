"use client";

/**
 * @author: @dorianbaffier
 * @description: Toolbar
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
  Bell,
  CircleUserRound,
  Edit2,
  FileDown,
  Frame,
  Layers,
  Lock,
  type LucideIcon,
  MousePointer2,
  Move,
  Palette,
  Shapes,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ToolbarItem {
  id: string;
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface ToolbarProps {
  className?: string;
  activeColor?: string;
  onSearch?: (value: string) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const notificationVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: -10 },
  exit: { opacity: 0, y: -20 },
};

const lineVariants = {
  initial: { scaleX: 0, x: "-50%" },
  animate: {
    scaleX: 1,
    x: "0%",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    scaleX: 0,
    x: "50%",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const transition = { type: "spring", bounce: 0, duration: 0.4 };

export function Toolbar({
  className,
  activeColor: _activeColor = "text-zinc-900 dark:text-zinc-50",
  onSearch: _onSearch,
}: ToolbarProps) {
  const [selected, setSelected] = React.useState<string | null>("select");
  const [isToggled, setIsToggled] = React.useState(false);
  const [activeNotification, setActiveNotification] = React.useState<
    string | null
  >(null);
  const outsideClickRef = React.useRef(null);

  const toolbarItems: ToolbarItem[] = [
    { id: "select", title: "Select", icon: MousePointer2 },
    { id: "move", title: "Move", icon: Move },
    { id: "shapes", title: "Shapes", icon: Shapes },
    { id: "layers", title: "Layers", icon: Layers },
    { id: "frame", title: "Frame", icon: Frame },
    { id: "properties", title: "Properties", icon: SlidersHorizontal },
    { id: "export", title: "Export", icon: FileDown },
    { id: "share", title: "Share", icon: Share2 },
    { id: "notifications", title: "Notifications", icon: Bell },
    { id: "profile", title: "Profile", icon: CircleUserRound },
    { id: "appearance", title: "Appearance", icon: Palette },
  ];

  const handleItemClick = (itemId: string) => {
    setSelected(selected === itemId ? null : itemId);
    setActiveNotification(itemId);
    setTimeout(() => setActiveNotification(null), 1500);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative flex items-center gap-3 p-2",
          "bg-white dark:bg-zinc-950",
          "rounded-xl border",
          "transition-all duration-200",
          className
        )}
        ref={outsideClickRef}
      >
        <AnimatePresence>
          {activeNotification && (
            <motion.div
              animate="animate"
              className="-top-8 -translate-x-1/2 absolute left-1/2 z-50 transform"
              exit="exit"
              initial="initial"
              transition={{ duration: 0.3 }}
              variants={notificationVariants as any}
            >
              <div className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-50 text-xs dark:bg-zinc-50 dark:text-zinc-900">
                {
                  toolbarItems.find((item) => item.id === activeNotification)
                    ?.title
                }{""}
                clicked!
              </div>
              <motion.div
                animate="animate"
                className="-bottom-1 absolute left-1/2 h-[2px] w-full origin-left bg-zinc-900 dark:bg-zinc-50"
                exit="exit"
                initial="initial"
                variants={lineVariants as any}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {toolbarItems.map((item) => (
            <motion.button
              animate="animate"
              className={cn(
                "relative flex items-center rounded-none px-3 py-2",
                "font-medium text-sm transition-colors duration-300",
                selected === item.id
                  ? "rounded-lg bg-[#1F9CFE] text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              )}
              custom={selected === item.id}
              initial={false}
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              transition={transition as any}
              variants={buttonVariants as any}
            >
              <item.icon
                className={cn(selected === item.id && "text-white")}
                size={16}
              />
              <AnimatePresence initial={false}>
                {selected === item.id && (
                  <motion.span
                    animate="animate"
                    className="overflow-hidden"
                    exit="exit"
                    initial="initial"
                    transition={transition as any}
                    variants={spanVariants as any}
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}

          <motion.button
            className={cn(
              "flex items-center gap-2 px-4 py-2",
              "rounded-xl border border-zinc-200 shadow-sm transition-all duration-200 dark:border-zinc-800",
              "hover:shadow-md active:border-zinc-900/50 dark:active:border-zinc-50/50",
              isToggled
                ? [
                    "bg-[#1F9CFE] text-white",
                    "border-[#1F9CFE]/30",
                    "hover:bg-[#1F9CFE]/90",
                    "hover:border-[#1F9CFE]/40",
                  ]
                : [
                    "bg-white text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400",
                    "border-zinc-200/30 dark:border-zinc-800/30",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    "hover:text-zinc-950 dark:hover:text-zinc-50",
                    "hover:border-zinc-200/40 dark:hover:border-zinc-800/40",
                  ]
            )}
            onClick={() => setIsToggled(!isToggled)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isToggled ? (
              <Edit2 className="h-3.5 w-3.5" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            <span className="font-medium text-sm">
              {isToggled ? "On" : "Off"}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
