'use client'

import { motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

export function AnimatedCard({
  children,
  className,
  hoverScale = 1.01,
  hoverY = -4,
  glowOnHover = false,
  delay = 0,
  ...props
})
{
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay,
      }}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      className={clsx(
        className,
        glowOnHover &&
          'relative before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
        glowOnHover &&
          'before:bg-gradient-to-r before:from-teal-500/10 before:via-teal-500/5 before:to-transparent before:blur-xl',
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
