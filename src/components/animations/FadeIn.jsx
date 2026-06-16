'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const transitions = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'fade-up': {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-right': {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  'scale-up': {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  'blur-up': {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
}

const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
}

const easeConfig = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.5,
}

export function FadeIn({
  children,
  as: Component = motion.div,
  direction = 'fade-up',
  delay = 0,
  duration = 0.5,
  spring = false,
  once = true,
  amount = 0.2,
  animateOnMount = false,
  className,
  ...props
})
{
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!animateOnMount) return
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [animateOnMount])

  const transition = spring
    ? { ...springConfig, delay }
    : { ...easeConfig, delay, duration }

  const variants = transitions[direction] || transitions['fade-up']

  if (shouldReduceMotion) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    )
  }

  // Above-the-fold content reveals via a post-mount state flip (a prop change
  // framer animates deterministically) so it never depends on a flaky mount
  // animation or an IntersectionObserver; below-the-fold content reveals on
  // scroll.
  const revealProps = animateOnMount
    ? { animate: revealed ? 'visible' : 'hidden' }
    : { whileInView: 'visible', viewport: { once, amount } }

  return (
    <Component
      ref={ref}
      initial="hidden"
      variants={variants}
      transition={transition}
      className={className}
      {...revealProps}
      {...props}
    >
      {children}
    </Component>
  )
}
