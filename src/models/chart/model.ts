import { forward } from 'effector'
import { ChartConstants } from '@lib/constants'
import {
  $allValues,
  valueReceived,
  chartMounted,
  updateValuesFx,
  Value,
} from './index'

$allValues.on(valueReceived, (state, value: Value) =>
  state.length >= ChartConstants.MAX_VALUES_NUMBER
    ? state.slice(1, ChartConstants.MAX_VALUES_NUMBER - 1)
    : [...state, value]
)

updateValuesFx.watch(() => {
  setInterval(() => {
    const newValue = {
      x: Date.now(),
      y: Math.floor(Math.random() * Math.floor(10)),
    }

    valueReceived(newValue)
  }, 1000)
})

forward({
  from: chartMounted,
  to: updateValuesFx,
})
