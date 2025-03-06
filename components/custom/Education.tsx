import React from 'react'
import { AnimatedSpan, Terminal, TypingAnimation } from '../magicui/terminal'

export const Education = () => {
  return (
    <Terminal className="w-full">
      <TypingAnimation>&gt; boraal list education</TypingAnimation>

      <AnimatedSpan delay={1500} className="text-green-500">
        <span>✔ Degree in Computer Engineering (UPV).</span>
      </AnimatedSpan>

      <AnimatedSpan delay={2000} className="text-green-500">
        <span>✔ Degree in Information & Communication Technology (LAB).</span>
      </AnimatedSpan>

      <AnimatedSpan delay={2500} className="text-green-500">
        <span>
          ✔ Master&apos;s Degree in Software Systems Engineering and Technology
          (UPV).
        </span>
      </AnimatedSpan>
    </Terminal>
  )
}
