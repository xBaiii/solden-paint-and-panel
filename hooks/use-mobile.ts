import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Viewport width is external state, so it is read through useSyncExternalStore
 * rather than mirrored into React state inside an effect. (Diverges from the
 * stock shadcn implementation, which trips the react-hooks/set-state-in-effect
 * rule that Next.js 16 enables by default.)
 */
function subscribe(onChange: () => void) {
  const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT
/** Assume desktop on the server; the client corrects on hydration. */
const getServerSnapshot = () => false

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
