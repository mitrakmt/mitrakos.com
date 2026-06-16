'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion'
import { useRef } from 'react'
import clsx from 'clsx'

/**
 * TiltCard — gives a card a tactile, high-tech feel: it rotates in 3D toward
 * the cursor while a soft specular "glare" tracks the pointer across the
 * surface. Falls back to a static container when reduced motion is requested.
 */
export function TiltCard({
  children,
  className,
  max = 10,
  scale = 1.03,
  glare = true,
  ...props
})
{
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useMotionValue(0)

  const spring = { stiffness: 250, damping: 22, mass: 0.6 }
  const sRotateX = useSpring(rotateX, spring)
  const sRotateY = useSpring(rotateY, spring)
  const sGlareOpacity = useSpring(glareOpacity, { stiffness: 180, damping: 26 })

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45), transparent 55%)`

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
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * max * 2)
    rotateX.set(-(py - 0.5) * max * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
    glareOpacity.set(1)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale }}
      style={{
        rotateX: sRotateX,
        rotateY: sRotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={clsx('relative', className)}
      {...props}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light"
          style={{ background: glareBackground, opacity: sGlareOpacity }}
        />
      )}
    </motion.div>
  )
}
