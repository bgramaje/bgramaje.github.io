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
      className="mb-0 border-2 border-terminal-border bg-terminal-surface p-2.5 py-1.5 md:py-2 rounded-lg"
    >
      <div className="flex flex-row items-center gap-0.5 md:gap-5">
        {/* Avatar - Stacked Cards */}
        <div className="flex items-center shrink-0 relative" style={{ width: "56px", height: "56px" }}>
          <div 
            className="relative w-12 h-12 md:w-14 md:h-14 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: "1000px" }}
          >
            {/* Bottom card - rotated */}
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-xl"
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
                className="w-full h-full object-cover rounded-xl blur-[2px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </motion.div>

            {/* Top card - smaller */}
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-xl"
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
                className="w-full h-full object-cover rounded-xl"
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
            <div className="flex flex-col">
              <h1 className="text-sm md:text-base font-semibold text-terminal-text leading-tight">
                {personalInfo.name}
              </h1>
              <p className="text-terminal-muted text-xs leading-tight">{personalInfo.title}</p>
            </div>

            {/* Social Links - Inline with name on desktop */}
            <div className="flex items-center gap-2">
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
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Name - Mobile only */}
          <div className="md:hidden">
            <h1 className="text-sm font-semibold text-terminal-text leading-tight">
              {personalInfo.name}
            </h1>
            <p className="text-terminal-muted text-xs leading-tight">{personalInfo.title}</p>
          </div>

          {/* Social Links - Mobile only */}
          <div className="flex md:hidden items-center gap-2 mt-0.5">
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
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

