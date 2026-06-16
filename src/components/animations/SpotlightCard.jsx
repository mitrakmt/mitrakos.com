'use client'

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion'
import { useRef } from 'react'
import clsx from 'clsx'

/**
 * SpotlightCard — a surface that lights up under the cursor. A soft radial glow
 * tracks the pointer across the card and (optionally) the border picks up a
 * matching highlight, giving an interactive, high-tech "panel" feel.
 *
 * - `border`  draws a cursor-following highlight along the rounded edge (best
 *   for cards that already have a visible border).
 * - `overlay` paints the glow above the content with a blend mode instead of
 *   behind it (use for cards with an opaque hover background).
 *
 * Renders as a plain container (preserving styling) when reduced motion is set.
 */
export function SpotlightCard({
  children,
  className,
  as: Component = 'div',
  glow = 'rgba(20, 184, 166, 0.14)',
  borderColor = 'rgba(45, 212, 191, 0.55)',
  size = 360,
  border = true,
  overlay = false,
  ...props
})
{
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)
  const mouseX = useMotionValue(-size)
  const mouseY = useMotionValue(-size)

  const glowBackground = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${glow}, transparent 70%)`
  const borderBackground = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${borderColor}, transparent 65%)`

  if (shouldReduceMotion) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    )
  }

  const MotionComponent = motion[Component] ?? motion.div

  const handleMouseMove = (event) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-size)
    mouseY.set(-size)
  }

  const glowLayer = (
    <motion.span
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100',
        overlay && 'mix-blend-multiply dark:mix-blend-screen',
      )}
      style={{ background: glowBackground }}
    />
  )

  return (
    <MotionComponent
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx('group/spotlight relative', className)}
      {...props}
    >
      {border && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
          style={{
            background: borderBackground,
            WebkitMask:
              'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />
      )}
      {!overlay && glowLayer}
      <div className="relative">{children}</div>
      {overlay && glowLayer}
    </MotionComponent>
  )
}
