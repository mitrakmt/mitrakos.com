'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { useEffect } from 'react'
import clsx from 'clsx'

/**
 * AuroraGlow — an ambient, low-opacity field of blurred color orbs that slowly
 * drift on their own and parallax toward the pointer. Designed to sit behind
 * hero content (pointer-events-none, decorative only).
 */
export function AuroraGlow({ className }) {
  const shouldReduceMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 50, damping: 20, mass: 0.6 })
  const springY = useSpring(pointerY, { stiffness: 50, damping: 20, mass: 0.6 })

  const orbs = [
    {
      depthX: 30,
      depthY: 26,
      duration: '17s',
      delay: '0s',
      position: '-left-16 -top-28 h-72 w-72',
      color: 'bg-teal-400/25 dark:bg-teal-500/20',
    },
    {
      depthX: -38,
      depthY: -20,
      duration: '21s',
      delay: '-6s',
      position: 'right-0 -top-12 h-80 w-80',
      color: 'bg-cyan-300/25 dark:bg-cyan-500/15',
    },
    {
      depthX: 18,
      depthY: -30,
      duration: '24s',
      delay: '-12s',
      position: 'left-1/3 top-8 h-64 w-64',
      color: 'bg-sky-300/20 dark:bg-indigo-500/15',
    },
  ]

  useEffect(() => {
    if (shouldReduceMotion) return
    const handleMove = (event) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5)
      pointerY.set(event.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [pointerX, pointerY, shouldReduceMotion])

  // Fade the whole field to fully transparent before it reaches any edge of the
  // box. `closest-side` sizes the ellipse to the nearest edge on each axis, so
  // the glow dies out symmetrically instead of getting hard-clipped by
  // `overflow-hidden`. Centered horizontally and biased slightly up to sit
  // behind the headline.
  const edgeFade =
    'radial-gradient(closest-side at 50% 42%, #000 28%, transparent 80%)'

  return (
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
      style={{ WebkitMaskImage: edgeFade, maskImage: edgeFade }}
    >
      {orbs.map((orb, index) => (
        <Orb
          key={index}
          springX={springX}
          springY={springY}
          {...orb}
          reduceMotion={shouldReduceMotion}
        />
      ))}
    </div>
  )
}

function Orb({
  springX,
  springY,
  depthX,
  depthY,
  duration,
  delay,
  position,
  color,
  reduceMotion,
})
{
  // Parallax lives on the outer element; the slow CSS drift lives on the inner
  // one so the two transforms compose instead of fighting.
  const x = useTransform(springX, (value) => value * depthX)
  const y = useTransform(springY, (value) => value * depthY)

  return (
    <motion.div
      className={clsx('absolute', position)}
      style={reduceMotion ? undefined : { x, y }}
    >
      <div
        className={clsx(
          'h-full w-full rounded-full blur-3xl',
          !reduceMotion && 'animate-aurora',
          color,
        )}
        style={
          reduceMotion
            ? undefined
            : { animationDuration: duration, animationDelay: delay }
        }
      />
    </motion.div>
  )
}
