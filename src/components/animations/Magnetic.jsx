'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

/**
 * Magnetic wrapper — the child is gently pulled toward the cursor while it is
 * hovered, then springs back to rest on leave. Great for icons and buttons.
 */
export function Magnetic({
  children,
  className,
  strength = 0.4,
  springConfig = { stiffness: 220, damping: 16, mass: 0.4 },
  ...props
})
{
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  if (shouldReduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  const handleMouseMove = (event) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = event.clientX - (rect.left + rect.width / 2)
    const relY = event.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
