'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { WorkExperienceT } from '@/data/work-experience'
import { WorkItemDetail, WorkSummary } from './WorkItem'

export function WorkItems({
  workExperience,
}: {
  workExperience: WorkExperienceT[]
}) {
  const [active, setActive] = useState<WorkExperienceT | boolean | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false)
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <WorkItemDetail
            active={active}
            id={id}
            setActive={setActive}
            ref={ref}
          />
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto w-full max-w-2xl gap-4">
        {workExperience.map((card) => (
          <WorkSummary
            key={`card-${card.src}-${id}`}
            card={card}
            id={id}
            setActive={setActive}
          />
        ))}
      </ul>
    </>
  )
}
