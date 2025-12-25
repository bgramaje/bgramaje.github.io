import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Mail, Linkedin } from "lucide-react";
import { personalInfo } from "@/data/portfolio";

export function Header() {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const images = [
    {
      src: "/images/pic3.png",
      alt: "Profile picture",
    },
    {
      src: "https://avatars.githubusercontent.com/u/56760866?s=400&u=85f1f7114a7c9f4afc1c63e3d06d35a7e204ce1a&v=4",
      alt: "GitHub avatar",
    },
  ];

  const topImage = isFlipped ? images[1] : images[0];
  const bottomImage = isFlipped ? images[0] : images[1];
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/bgramaje",
      icon: Github,
    },
    {
      name: "Email",
      url: `mailto:${personalInfo.email}`,
      icon: Mail,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/bgramaje",
      icon: Linkedin,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-0 border-2 border-terminal-border bg-terminal-surface p-3 py-1 md:py-3"
    >
      <div className="flex flex-row items-center gap-0.5 md:gap-5">
        {/* Avatar - Stacked Cards */}
        <div className="flex items-center shrink-0 relative" style={{ width: "80px", height: "80px" }}>
          <div 
            className="relative w-16 h-16 md:w-20 md:h-20 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: "1000px" }}
          >
            {/* Bottom card - rotated */}
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-lg"
              style={{
                rotate: isFlipped ? "-8deg" : "8deg",
                zIndex: 0,
              }}
              animate={{
                rotate: isFlipped ? "-8deg" : "8deg",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <img
                src={bottomImage.src}
                alt={bottomImage.alt}
                className="w-full h-full object-cover rounded-lg blur-[2px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </motion.div>

            {/* Top card - smaller */}
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-lg"
              style={{
                zIndex: 1,
                scale: 0.9,
              }}
              animate={{
                rotate: isFlipped ? "8deg" : "-8deg",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              whileHover={{ scale: 0.95 }}
            >
              <img
                src={topImage.src}
                alt={topImage.alt}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col items-start text-center md:text-left">
          {/* Name and Social Links - Same div on desktop with justify-between */}
          <div className="w-full hidden md:flex justify-between items-center">
            <h1 className="text-base md:text-lg font-semibold text-terminal-text">
              {personalInfo.name}
            </h1>

            {/* Social Links - Inline with name on desktop */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="text-terminal-muted hover:text-terminal-accent transition-colors"
                    aria-label={link.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Name - Mobile only */}
          <h1 className="text-base md:text-lg font-semibold text-terminal-text md:hidden">
            {personalInfo.name}
          </h1>

          {/* Title - Visible on all screens */}
          <p className="text-terminal-muted text-sm">{personalInfo.title}</p>

          {/* Social Links - Mobile only */}
          <div className="flex md:hidden items-center gap-3 mt-1">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="text-terminal-muted hover:text-terminal-accent transition-colors"
                  aria-label={link.name}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          {/* Bio - Hidden on mobile */}
          <p className="hidden md:block text-terminal-muted text-xs leading-relaxed mt-1">
            &gt; {personalInfo.bio}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

