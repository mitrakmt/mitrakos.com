import { Fragment } from 'react'
import clsx from 'clsx'

const gradientClass =
  'headline-gradient bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-600 bg-clip-text text-transparent dark:from-teal-400 dark:via-cyan-300 dark:to-teal-400'

/**
 * AnimatedHeadline — reveals a headline word by word with a soft blur-up on
 * page load, and renders highlighted segments with a slowly flowing gradient.
 *
 * The reveal is a pure CSS animation (staggered via the inline `--word-index`),
 * so it fires reliably on first paint with no JS orchestration and respects
 * `prefers-reduced-motion` via media query.
 *
 * @param {{text: string, gradient?: boolean}[]} segments
 */
export function AnimatedHeadline({ segments, className, as: Component = 'h1', ...props }) {
  const label = segments.map((segment) => segment.text).join(' ')

  const words = segments.flatMap((segment, segmentIndex) =>
    segment.text
      .split(' ')
      .filter(Boolean)
      .map((text, wordIndex) => ({
        text,
        gradient: segment.gradient,
        key: `${segmentIndex}-${wordIndex}`,
      })),
  )

  return (
    <Component className={className} aria-label={label} {...props}>
      {words.map((word, index) => (
        <Fragment key={word.key}>
          <span
            aria-hidden="true"
            className={clsx('headline-word', word.gradient && gradientClass)}
            style={{ '--word-index': index }}
          >
            {word.text}
          </span>
          {index < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Component>
  )
}
