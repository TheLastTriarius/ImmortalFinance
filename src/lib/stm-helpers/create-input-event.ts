import { ChangeEvent } from 'react'
import { createEvent, Event } from 'effector'

export const createInputEvent = (): Event<string> => {
  const event = createEvent<ChangeEvent<HTMLInputElement>>()

  return event.map(({ target }) => target.value)
}
