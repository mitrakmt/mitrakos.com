'use client'

import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'

function subscribe(onChange) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/**
 * Whether the visitor has asked for reduced motion — safe to branch markup on.
 *
 * Framer's `useReducedMotion` reads the media query on the very first client
 * render, which the server never can. The components here render different
 * markup when motion is reduced, so for anyone with that setting on, hydration
 * failed on every page. This answers `false` while hydrating, exactly as the
 * server did, then re-renders with the real value straight after.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
