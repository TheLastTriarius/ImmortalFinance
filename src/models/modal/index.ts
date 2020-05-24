import {
  createStore,
  createEvent,
  createEffect,
  attach,
  combine,
} from 'effector'
import { createDebounce } from 'effector-debounce'

import { LENDING_POOL_CORE, MAX_INT, PROTECTION_CONTRACT } from '@lib/constants'
import { createTokenContract, sendTransaction, web3 } from '@lib/web3'
import { createFetching } from '@lib/fetching'
import { data } from '@lib/mocks'
import { $userAdress } from '@models/session'
import { $protectionAddress } from '@models/protection'

export type Token = {
  address: string
  decimal: string
  name: string
  symbol: string
  image?: string
  balance?: string
}

export type Tokens = Array<Token>

export const $isModalShow = createStore<boolean>(false)
export const $currentModal = createStore<string | null>(null)

export const showModal = createEvent<void>()
export const hideModal = createEvent<void>()
export const setModal = createEvent<string>()
export const tokenSelected = createEvent<Token>()
export const selectedTokenReseted = createEvent<void>()
export const searchedValueChanged = createEvent<string>()
const valueChanged = createEvent<void>()
export const debouncedSearchValueChanged = createDebounce(valueChanged, 500)

// enable protection modal

export const $tokens = createStore<Tokens>(data)
export const $selectedToken = createStore<Token | null>(null)
export const $selectTokenBalance = createStore<string>('')
export const $searchedValue = createStore<string>('')
export const $displayTokens = createStore<Tokens>(data)
export const $amount = createStore<string>('')
export const $selectedTokenUnlocked = createStore<boolean>(false)
export const $protectionEnablingAvailable = combine(
  $selectedToken,
  $amount,
  $selectedTokenUnlocked,
  (selectedToken, amount, isUnlocked) => {
    const isAmountValid = Number(amount) !== 0
    const isTokenValid = Boolean(selectedToken)

    return isAmountValid && isTokenValid && isUnlocked
  }
)

export const amountChanged = createEvent<string>()
export const tokenUnlockClicked = createEvent<void>()
export const createLayerConfrimed = createEvent<Token>()

const selectedTokenBalanceFx = createEffect({
  handler: ({ token, userAddress }) => {
    const contract = createTokenContract(token.address)

    return contract.methods.balanceOf(userAddress).call()
  },
})

export const getSelectedTokenBalanceFx = attach({
  source: $userAdress,
  effect: selectedTokenBalanceFx,
  mapParams: (token, userAddress) => ({ token, userAddress }),
})

export const selectedTokenBalanceFetching = createFetching(
  getSelectedTokenBalanceFx
)

export const tokenUnlockFx = createEffect({
  handler: async ({ token, userAddress, targetAmount, protectionAddress }) => {
    const amount = web3.utils.toWei(targetAmount)
    const tokenContract = createTokenContract(token.address)

    const tokenAllowance = await tokenContract.methods
      .allowance(userAddress, protectionAddress)
      .call({}, (err, res) => (err ? console.log(err) : res))
    if (Number(tokenAllowance) >= Number(amount)) return true

    const options = {
      from: userAddress || '',
      to: token.address,
      value: 0,
      data: tokenContract.methods
        .approve(protectionAddress, amount)
        .encodeABI(),
    }

    return sendTransaction(options, (_, res) => res)
  },
})

export const makeTokenUnlock = attach({
  source: {
    token: $selectedToken,
    userAddress: $userAdress,
    targetAmount: $amount,
    protectionAddress: $protectionAddress,
  },
  effect: tokenUnlockFx,
  mapParams: (_, source) => source,
})

export const tokenUnlockLoading = createFetching(makeTokenUnlock)

// heal range modal

export const $healFromField = createStore<string>('')
export const $healToField = createStore<string>('')

export const healFromChanged = createEvent<string>()
export const healToChanged = createEvent<string>()
export const changeHealRangeConfirmed = createEvent<void>()
