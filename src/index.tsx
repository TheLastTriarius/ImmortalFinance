import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './app'
import { checkProviderAvailabilityFx } from '@models/session'
import '@models'
import '@lib/web3/web3'
import '@ui/theme/normalize.pcss'
import '@ui/theme/global.pcss'

const root = document.getElementById('root')

checkProviderAvailabilityFx(window.ethereum)

const render = () => {
  ReactDOM.render(<App />, root)
}

render()
