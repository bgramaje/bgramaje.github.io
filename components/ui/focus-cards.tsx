/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { MagneticSocialLink } from '../custom/MagneticSocialLink'

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any
    index: number
    hovered: number | null
    setHovered: React.Dispatch<React.SetStateAction<number | null>>
  }) => (
    <div
      className={cn(
        'relative h-auto w-full basis-1/3 overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-out md:h-66 dark:bg-neutral-900',
        hovered !== null && hovered !== index && 'scale-[0.98] blur-sm',
      )}
    >
      <img
        src={card.src}
        alt={card.title}
        className="absolute inset-0 h-full object-cover object-center"
      />
      <div
        className={cn(
          'absolute inset-0 flex items-end bg-black/50 px-4 py-8 transition-opacity duration-300',
          hovered === index ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="flex-col">
          <div className="text-md flex gap-2 bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text font-semibold text-transparent md:text-xl">
            <div className="absolute top-4 mb-2 flex items-center gap-2">
              <div className="flex items-center justify-center rounded-xl bg-white p-2 py-1">
                <img
                  className="h-auto max-h-14 w-20 mix-blend-multiply"
                  src={card.title}
                />
              </div>
              {card.href && <MagneticSocialLink link={card.href} />}
            </div>
          </div>
          <div className="bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-justify text-xs font-medium text-transparent md:text-xs">
            {card.description}
          </div>
        </div>
      </div>
    </div>
  ),
)

Card.displayName = 'Card'

type Card = {
  title: string
  src: string
  description?: string
  href?: string
}

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex gap-4 overflow-x-auto">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  )
}
