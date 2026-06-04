'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70',
  secondary:
    'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70',
}

export function Button({ variant = 'primary', className, ...props }) {
  const shouldReduceMotion = useReducedMotion()

  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition-colors active:transition-none',
    variantStyles[variant],
    className,
  )

  if (props.target === '_blank' && !props.rel) {
    props.rel = 'noopener noreferrer'
  }

  const motionProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }

  if (typeof props.href === 'undefined') {
    return (
      <motion.button className={className} {...motionProps} {...props} />
    )
  }

  return (
    <motion.span className="inline-flex" {...motionProps}>
      <Link className={className} {...props} />
    </motion.span>
  )
}
