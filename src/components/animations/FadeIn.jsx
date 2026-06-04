'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

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
  className,
  ...props
})
{
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)

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

  return (
    <Component
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}
