import React from 'react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { MagneticSocialLink } from './MagneticSocialLink'
import { WorkExperienceT } from '@/app/data'

import { Source_Code_Pro } from 'next/font/google'
import { cn } from '@/lib/utils'

const SourceCodePro = Source_Code_Pro({ subsets: ['latin'] })

type WorkExpHeaderProps = {
  job: WorkExperienceT
}

const WorkExpHeader = ({ job }: WorkExpHeaderProps) => {
  return (
    <div className="relative flex w-full grow flex-row justify-between hover:cursor-pointer">
      <div>
        <h4
          className={cn(
            SourceCodePro.className,
            'text-[16px] font-normal dark:text-zinc-100',
          )}
        >
          {job.title}
        </h4>
        <div className="flex items-center gap-1.5">
          <p className="font-normal text-zinc-500 dark:text-zinc-400">
            {job.company}
          </p>
          <MagneticSocialLink link={job.link} />
        </div>
      </div>
      <p
        className={cn(
          SourceCodePro.className,
          'text-sm text-zinc-600 dark:text-zinc-400',
        )}
      >
        {job.start} - {job.end}
      </p>
    </div>
  )
}

type WorkExperienceItemProps = {
  job: WorkExperienceT
}

export const WorkExperienceItem = ({ job }: WorkExperienceItemProps) => {
  return (
    <div
      className="flex-1 overflow-hidden rounded-2xl border-[1px] border-zinc-300/30"
      key={job.id}
    >
      <AccordionItem value={`item-${job.id}`} className="px-4">
        <AccordionTrigger>
          <WorkExpHeader job={job} />
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-justify">{job.description}</div>
        </AccordionContent>
      </AccordionItem>
    </div>
  )
}
