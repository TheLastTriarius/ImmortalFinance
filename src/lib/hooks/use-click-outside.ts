import { useEffect, MutableRefObject } from 'react'

export const useClickOutside = (
  ref: MutableRefObject<unknown>,
  handler: (e: Event) => void
): void => {
  useEffect(() => {
    const listener = (event: Event): void => {
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return (): void => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
