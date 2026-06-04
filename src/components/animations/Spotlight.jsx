'use client'

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion'
import { useRef, useCallback } from 'react'
import clsx from 'clsx'

export function Spotlight({
  children,
  className,
  size = 200,
  color = 'rgba(20, 184, 166, 0.15)',
  ...props
})
{
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current || shouldReduceMotion) return
      const rect = ref.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY, shouldReduceMotion],
  )

  const background = useMotionTemplate`
    radial-gradient(
      ${size}px circle at ${mouseX}px ${mouseY}px,
      ${color},
      transparent 80%
    )
  `

  if (shouldReduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={clsx('group relative overflow-hidden', className)}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
