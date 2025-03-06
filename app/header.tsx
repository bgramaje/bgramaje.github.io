'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import { SOCIAL_LINKS } from './data'
import Image from 'next/image'
import { MagneticSocialLink } from '@/components/custom/MagneticSocialLink'

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-[100px] w-[100px]">
          <Image
            src="/pic3.png"
            alt="Logo"
            fill
            className="rounded-full object-cover grayscale"
          />
        </div>
        <div>
          <Link href="/" className="font-medium text-black dark:text-white">
            Borja Albert Gramaje
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            Software Engineer
          </TextEffect>
          <div className="mt-2 flex items-center justify-start gap-3">
            {SOCIAL_LINKS.map((link) => (
              <MagneticSocialLink key={link.label} link={link.link}>
                {link.label}
              </MagneticSocialLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
