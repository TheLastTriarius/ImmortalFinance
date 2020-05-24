import { createStore, createEvent, createEffect } from 'effector'

import { config } from './chart-config'

export type Value = {
  x: number
  y: number
}

export const $allValues = createStore<Array<Value>>([])
export const $valuesToShow = $allValues.map((state) =>
  state.length >= 10 ? state.slice(state.length - 10, state.length - 1) : state
)
export const $options = $valuesToShow.map((data) => ({
  ...config,
  series: [
    {
      name: 'Kek',
      type: 'areaspline',
      clip: false,
      data,
    },
  ],
}))

export const chartMounted = createEvent()
export const valueReceived = createEvent<Value>()
export const updateValuesFx = createEffect({ handler: () => {} })
