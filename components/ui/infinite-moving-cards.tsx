/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { MagneticSocialLink } from '../custom/MagneticSocialLink'
import Image from 'next/image'

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string
    title: string
    href?: string
  }[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)


  const [start, setStart] = useState(false)

  useEffect(() => {
    addAnimation()
  }, [])

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }




  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards',
        )
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse',
        )
      }
    }
  }
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s')
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s')
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s')
      }
    }
  }
  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-4xl overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {items.map((item) => (
          <li
            className="relative w-[300px] max-w-full shrink-0 rounded-2xl border border-zinc-200 bg-white px-8 py-6 md:w-[350px] dark:border-zinc-700 dark:bg-neutral-700"
            key={item.title}
          >
            <div
              aria-hidden="true"
              className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
            ></div>
            <p className="relative z-20 text-justify text-sm leading-[1.6] font-normal text-neutral-800 dark:text-gray-100">
              {item.quote}
            </p>
            <div className="relative z-20 mt-4 flex flex-row items-center">
              <span className="flex flex-col gap-1">
                <div className="flex items-center gap-2 bg-transparent">
                  <Image
                    width={14}
                    height={20}
                    className="h-auto max-h-14 w-20 bg-transparent mix-blend-multiply"
                    src={item.title}
                    alt={item.title}
                  />
                  {item.href && <MagneticSocialLink link={item.href} />}
                </div>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
