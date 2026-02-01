import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin } from "lucide-react";
import { BlogPost } from "@/components/BlogPost";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { socialLinks } from "@/data/portfolio";

const LOAD_DELAY_MS = 250;

export function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!id) return;
    setReady(false);
    const t = setTimeout(() => setReady(true), LOAD_DELAY_MS);
    return () => clearTimeout(t);
  }, [id]);

  if (!id) {
    return (
      <div className="mx-auto max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 py-8 bg-neutral-950 min-h-full">
        <p className="text-neutral-400">Post no encontrado.</p>
        <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Volver al blog
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 py-6 pb-12 bg-neutral-950 min-h-full">
        <ScrollProgress className="top-0 z-50" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2 text-sm text-neutral-500"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-neutral-500 animate-pulse" />
          Cargando…
        </motion.div>
      </div>
    );
  }

  const linkedinLink = socialLinks.find((l) => l.icon === "linkedin");
  const githubLink = socialLinks.find((l) => l.icon === "github");

  return (
    <div className="relative mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 py-6 pb-4 md:pb-12 bg-neutral-950 min-h-full">
      <ScrollProgress className="top-0 z-50" />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-3 md:mb-6"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al blog
        </Link>
      </motion.div>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="pb-6 md:pb-20"
      >
        <BlogPost id={id} />
      </motion.article>

      {/* Botones LinkedIn y GitHub — sticky al fondo, cuadrados hasta hover */}
      <div className="sticky bottom-3 md:bottom-6 z-10 mt-3 md:mt-6 flex justify-center gap-3">
        {linkedinLink && (
          <RainbowButton
            asChild
            size="icon"
            variant="default"
            className="h-9 w-9 shrink-0 animate-rainbow rounded-lg p-0 transition-[width] duration-300 ease-out"
          >
            <a
              href={linkedinLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-9 w-9 min-w-9 items-center justify-center overflow-hidden transition-[width] duration-300 ease-out hover:w-[112px]"
            >
              <span className="flex w-full items-center justify-center">
                <Linkedin size={18} className="shrink-0" />
                <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300 ease-out group-hover:ml-2 group-hover:max-w-[72px]">
                  bgramaje
                </span>
              </span>
            </a>
          </RainbowButton>
        )}
        {githubLink && (
          <RainbowButton
            asChild
            size="icon"
            variant="default"
            className="h-9 w-9 shrink-0 animate-rainbow rounded-lg p-0 transition-[width] duration-300 ease-out"
          >
            <a
              href={githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-9 w-9 min-w-9 items-center justify-center overflow-hidden transition-[width] duration-300 ease-out hover:w-[112px]"
            >
              <span className="flex w-full items-center justify-center">
                <Github size={18} className="shrink-0" />
                <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300 ease-out group-hover:ml-2 group-hover:max-w-[72px]">
                  bgramaje
                </span>
              </span>
            </a>
          </RainbowButton>
        )}
      </div>
    </div>
  );
}
