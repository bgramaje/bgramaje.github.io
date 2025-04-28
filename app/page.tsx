'use client'
import { motion } from 'motion/react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { FadeInComponent } from '@/components/custom/FadeInComponent'

import { Education } from '@/components/custom/Education'
import { Technologies } from '@/components/custom/Technologies'
import { HoverButton } from '@/components/ui/hover-button'
import { Publication } from '@/components/custom/Publication'
import { cn } from '@/lib/utils'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { WorkItems } from '@/components/custom/WorkItems'
import { WORK_EXPERIENCE } from '@/data/work-experience'
import { PUBLICATIONS } from '@/data/publications'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export default function Personal() {
  return (
    <motion.main
      className="space-y-6"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <FadeInComponent>
        <div className="flex flex-1 flex-col gap-1.5">
          <p className="text-justify text-zinc-600 dark:text-zinc-400">
            Currently working as a full-stack software engineer, undertaking
            innovative projects within the European framework &quot;H2020&quot;
            (Horizon Europe).
          </p>
        </div>
      </FadeInComponent>

      <FadeInComponent>
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="mb-4 text-lg font-medium">About me</h3>
          <p className="text-justify text-zinc-600 dark:text-zinc-400">
            Expertise in software developement and software designing based on
            microservices. Usage of various technologies such as React, NodeJS,
            and MeteorJS. Experience using a wide variety of protocols such as
            of MQTT or NATS. MongoDB and InfluxDB are database technologies I
            have most used.
          </p>
          <p className="text-justify text-zinc-600 dark:text-zinc-400">
            Nevertheless, I am comfortable with a wide variety of technologies
            and protocols. I have experience in cloud orchestration, IoT
            platforms,embedded systems programming and messaging protocols.
          </p>
          <p className="text-justify text-zinc-600 dark:text-zinc-400">
            I consider myself a serious, responsible, and active person. I enjoy
            facing challenges in order to improve my skills and my ability to
            execute tasks.
          </p>
        </div>
      </FadeInComponent>

      <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
      <WorkItems workExperience={WORK_EXPERIENCE} />

      <FadeInComponent>
        <h3 className="mb-5 text-lg font-medium">Education</h3>
        <Education />
      </FadeInComponent>

      <FadeInComponent>
        <h3 className="mb-0 text-lg font-medium">Technologies</h3>
        <Technologies />
      </FadeInComponent>

      <FadeInComponent>
        <h3 className="mb-3 text-lg font-medium">Publications</h3>
        <AnimatedBackground
          enableHover
          className="flex h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.2,
          }}
        >
          {PUBLICATIONS.map((post) => (
            <div data-id={post.uid} key={post.uid}>
              <Publication key={post.uid} post={post} />
            </div>
          ))}
        </AnimatedBackground>
      </FadeInComponent>

      <FadeInComponent>
        <DotPattern
          width={14}
          height={14}
          className={cn(
            '[mask-image:radial-gradient(200px_circle_at_center,white,transparent)] opacity-40',
          )}
        />
        <div className="flex w-full justify-between gap-0 rounded-xl border-1 p-4 px-4">
          <div className="flex flex-col gap-1">
            <h3 className="mb-0 text-left text-lg font-medium">
              Get in touch :)
            </h3>
            <h5 className="mb-0 text-sm font-normal">
              Have a question or want to work together? Feel free to reach out.
            </h5>
          </div>
          <div className="flex items-center justify-center">
            <a href="mailto:bgramaje@outlook.es" target="_blank">
              <HoverButton className="text-sm font-normal">
                Contact me!
              </HoverButton>
            </a>
          </div>
        </div>
      </FadeInComponent>
    </motion.main>
  )
}
