'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

/**
 * ScrollProgress — a slim gradient bar pinned to the top of the viewport that
 * fills as the page is scrolled. A small, high-tech wayfinding cue.
 */
export function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  if (shouldReduceMotion) {
    return null
  }

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 dark:from-teal-400 dark:via-cyan-300 dark:to-teal-400"
      style={{ scaleX }}
    />
  )
}
