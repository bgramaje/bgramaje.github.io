/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Source_Code_Pro } from 'next/font/google'
import { MagneticSocialLink } from './MagneticSocialLink'
import { WorkExperienceT } from '@/data/work-experience'
import Image from 'next/image'

const SourceCodePro = Source_Code_Pro({ subsets: ['latin'] })

type Card = WorkExperienceT

export const WorkSummary = ({
  card,
  id,
  setActive,
}: {
  card: Card
  id: string
  setActive: React.Dispatch<React.SetStateAction<any>>
}) => {
  return (
    <motion.div
      layoutId={`card-${card.src}-${id}`}
      key={`card-${card.src}-${id}`}
      onClick={() => setActive(card)}
      className="flex cursor-pointer flex-col items-center justify-between rounded-xl p-4 hover:bg-neutral-50 md:flex-row dark:hover:bg-neutral-800"
    >
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <motion.div
          layoutId={`image-${card.src}-${id}`}
          className="relative h-28 w-28 md:h-14 md:w-14"
        >
          <Image
            src={card.src}
            alt={card.title}
            fill
            className="rounded-2xl border bg-slate-100 object-contain object-center p-1 px-1.5 dark:border-zinc-300 dark:bg-zinc-100"
          />
        </motion.div>
        <div className="">
          <motion.h3
            layoutId={`title-${card.src}-${id}`}
            className="text-center font-medium text-neutral-800 md:text-left dark:text-neutral-200"
          >
            {card.title}
          </motion.h3>

          <div className="flex items-center justify-center gap-1.5 md:justify-start">
            <motion.p
              layoutId={`description-${card.description}-${id}`}
              className="text-center text-sm font-medium text-neutral-600 md:text-left dark:text-neutral-400"
            >
              {card.business}
            </motion.p>
            {card.ctaLink && <MagneticSocialLink link={card.ctaLink} />}
          </div>
        </div>
      </div>
      <div className="jstify-between flex flex-col items-end gap-1">
        <motion.p
          layoutId={`duration-${card.duration}-${id}`}
          className={cn(
            SourceCodePro.className,
            'text-center text-sm text-neutral-600 md:text-left dark:text-neutral-400',
          )}
        >
          {card.duration}
        </motion.p>
      </div>
    </motion.div>
  )
}

export const WorkItemDetail = ({
  active,
  id,
  setActive,
  ref,
}: {
  active: Card
  id: string
  setActive: React.Dispatch<React.SetStateAction<any>>
  ref: React.RefObject<HTMLDivElement | null>
}) => {
  return (
    <div className="fixed inset-0 z-[100] grid h-full place-items-center">
      <motion.button
        key={`button-${active.src}-${id}`}
        layout
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.05,
          },
        }}
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 lg:hidden dark:bg-white"
        onClick={() => setActive(null)}
      >
        <CloseIcon />
      </motion.button>
      <motion.div
        layoutId={`card-${active.src}-${id}`}
        ref={ref}
        className="flex h-full w-full max-w-[700px] flex-col overflow-hidden bg-white sm:rounded-3xl md:h-fit md:max-h-[90%] dark:bg-neutral-900"
      >
        <div className="flex w-full items-start justify-between p-4 pb-1">
          <div className="flex w-full items-center gap-4">
            <motion.div
              layoutId={`image-${active.src}-${id}`}
              className="relative h-18 min-h-18 min-w-18 md:h-14 md:min-h-16 md:min-w-16"
            >
              <Image
                src={active.src}
                alt={active.title}
                fill
                className="rounded-2xl border bg-slate-100 object-contain object-center p-1 px-1.5 dark:border-zinc-300 dark:bg-zinc-100"
              />
            </motion.div>
            <div className="w-full">
              <motion.h3
                layoutId={`title-${active.src}-${id}`}
                className="font-medium text-neutral-700 dark:text-neutral-200"
              >
                {active.title}
              </motion.h3>
              <div className="flex items-center gap-1.5">
                <motion.p
                  layoutId={`description-${active.description}-${id}`}
                  className="text-left text-sm text-neutral-600 md:text-left dark:text-neutral-400"
                >
                  {active.business}
                </motion.p>
                {active.ctaLink && <MagneticSocialLink link={active.ctaLink} />}
              </div>
            </div>
            <div className="flex w-full flex-col items-end justify-between gap-1">
              <motion.p
                layoutId={`description-${active.duration}-${id}`}
                className={cn(
                  SourceCodePro.className,
                  'text-center text-sm text-neutral-600 md:text-left dark:text-neutral-400',
                )}
              >
                {active.duration}
              </motion.p>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-2 overflow-y-auto px-4 pt-2">
          <motion.div
            layoutId={`descirption-${active.src}-${id}`}
            className="flex flex-col items-start gap-1 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base dark:text-neutral-400"
          >
            <h3 className="text-base font-medium text-neutral-800 md:text-[15px] dark:text-white">
              Job Description
            </h3>
            <p className="w-full text-justify text-base md:text-[15px]">
              {active?.description}
            </p>
          </motion.div>
          {active?.achievements?.length && (
            <motion.div
              layoutId={`achievements-${active.src}-${id}`}
              className="flex flex-col items-start gap-1 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base dark:text-neutral-400"
            >
              <h3 className="text-base font-medium text-neutral-800 md:text-[15px] dark:text-white">
                Job Achievements
              </h3>
              <ul className="w-full list-inside list-disc text-justify">
                {active?.achievements?.map((achievement, idx) => (
                  <div key={idx + 1} className="flex items-center">
                    <li className="pt-0.5"></li>
                    <p className="w-full py-1 text-justify text-base md:text-[15px]">
                      {achievement}
                    </p>
                  </div>
                ))}
              </ul>
            </motion.div>
          )}
          <motion.div
            layoutId={`tags-${active.src}-${id}`}
            className="flex flex-col items-start gap-1 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base dark:text-neutral-400"
          >
            <h3 className="text-base font-medium text-neutral-800 md:text-[15px] dark:text-white">
              Job Technologies
            </h3>
            <div className="flex w-full flex-wrap items-center gap-1 pt-1">
              {active?.tags?.map((tag) => (
                <p
                  key={`${id}-${tag}`}
                  className="w-fit rounded-md border border-slate-200 bg-slate-100 px-1.75 py-0.5 text-[11px] font-medium text-neutral-800 dark:border-slate-300 dark:bg-slate-100 dark:text-black"
                >
                  {tag}
                </p>
              ))}
            </div>
          </motion.div>
          {active?.content && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-60 flex-col items-start gap-4 overflow-auto overflow-x-hidden overflow-y-auto pb-4 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base dark:text-neutral-400"
            >
              {typeof active.content === 'function'
                ? active.content({
                    id: active.id ?? 0,
                    tags: active.tags ?? [],
                    achievements: active.achievements ?? [],
                    description: active.description ?? '',
                  })
                : active.content}
            </motion.div>
          )}
          <div className="relative overflow-x-hidden overflow-y-auto px-4 pt-4"></div>
        </div>
      </motion.div>
    </div>
  )
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white dark:text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}
