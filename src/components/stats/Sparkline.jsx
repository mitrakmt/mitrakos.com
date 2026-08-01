import clsx from 'clsx'

const WIDTH = 100
const HEIGHT = 28

/**
 * Minimal trend line for a single project's monthly visitors.
 *
 * Drawn in a fixed 100×28 viewBox and stretched by CSS, so the caller controls
 * the size. `vector-effect="non-scaling-stroke"` keeps the stroke even after
 * the non-uniform scale that stretching implies.
 */
export function Sparkline({ id, data, className, dormant = false }) {
  if (!data?.length) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  // A flat series would divide by zero; render it as a centred line instead.
  const range = max - min || 1
  const step = data.length > 1 ? WIDTH / (data.length - 1) : WIDTH

  const points = data.map((value, index) => {
    const x = index * step
    const y =
      max === min ? HEIGHT / 2 : HEIGHT - 2 - ((value - min) / range) * (HEIGHT - 4)
    return [x, y]
  })

  const line = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')
  const area = `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`
  const [lastX, lastY] = points.at(-1)

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={clsx('overflow-visible', className)}
    >
      <defs>
        <linearGradient id={`sparkline-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            className={clsx(
              dormant ? 'text-zinc-400' : 'text-teal-500 dark:text-teal-400',
            )}
            stopColor="currentColor"
            stopOpacity="0.28"
          />
          <stop
            offset="100%"
            className={clsx(
              dormant ? 'text-zinc-400' : 'text-teal-500 dark:text-teal-400',
            )}
            stopColor="currentColor"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sparkline-${id})`} />
      <path
        d={line}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={clsx(
          dormant
            ? 'stroke-zinc-300 dark:stroke-zinc-600'
            : 'stroke-teal-500 dark:stroke-teal-400',
        )}
      />
      {!dormant && (
        <circle
          cx={lastX}
          cy={lastY}
          r="1.75"
          vectorEffect="non-scaling-stroke"
          className="fill-teal-500 dark:fill-teal-400"
        />
      )}
    </svg>
  )
}
