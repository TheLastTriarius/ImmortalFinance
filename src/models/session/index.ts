import {
  createStore,
  createEvent,
  createEffect,
  attach,
  combine,
} from 'effector'

import { connectWallet, updateUserBalances } from '@lib/web3'

export const $isProviderAvailable = createStore<boolean>(false)
export const $userAdress = createStore<null | string>(null)
export const $displayUserAddress = $userAdress.map((id) => {
  if (!id) return null

  const idLength = id.length

  const start = id.slice(0, 5)
  const end = id.slice(idLength - 5, idLength)

  return `${start}...${end}`
})
export const $userCollateral = createStore<string>('')
export const $userBorrow = createStore<string>('0')
export const $originationFee = createStore<string>('0')
export const $daiAllowance = createStore<string>('0')

export const $daiIsGreater = combine(
  $originationFee,
  $daiAllowance,
  (originationFee, daiAllowance) => {
    if (!originationFee || !daiAllowance) return false

    return daiAllowance >= originationFee
  }
)

export const $aEthMaxAvailable = createStore<boolean>(false)

export const appStarted = createEvent()
export const connectStarted = createEvent()

export const checkProviderAvailabilityFx = createEffect({
  handler: Boolean,
})
export const connectWalletFx = createEffect({
  handler: connectWallet,
})

export const updateBalancesFx = createEffect({
  handler: async (userAddress: string) => updateUserBalances(userAddress),
})

export const getUpdatedBalancesFx = attach({
  source: $userAdress,
  effect: updateBalancesFx,
  mapParams: (_, userAddress: string): string => userAddress,
})
