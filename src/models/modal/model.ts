import { forward, sample } from 'effector'

import { getHumanizedNumber, web3 } from '@lib/web3'

import {
  $isModalShow,
  $tokens,
  $selectedToken,
  $displayTokens,
  $searchedValue,
  $currentModal,
  $amount,
  $selectTokenBalance,
  $selectedTokenUnlocked,
  $healFromField,
  $healToField,
  healFromChanged,
  healToChanged,
  makeTokenUnlock,
  amountChanged,
  showModal,
  tokenUnlockClicked,
  hideModal,
  setModal,
  tokenSelected,
  selectedTokenReseted,
  getSelectedTokenBalanceFx,
  searchedValueChanged,
  debouncedSearchValueChanged,
  Token,
  Tokens,
} from './index'
import {
  changeHealRangeFx,
  resetHealFields,
  createProtectionLayerFx,
} from '@models/protection'

const checkToken = (
  { name, address, symbol }: Token,
  searchValue: string
): boolean => {
  const normalizedName = name.toLowerCase()
  const normalizedAddress = address.toLowerCase()
  const normalizedSymbol = symbol.toLowerCase()
  const normalizedSearchValue = searchValue.toLowerCase()

  return Boolean(
    normalizedName.match(normalizedSearchValue) ||
      normalizedAddress.match(normalizedSearchValue) ||
      normalizedSymbol.match(normalizedSearchValue)
  )
}

$isModalShow.on(showModal, () => true).on(hideModal, () => false)
$currentModal.on(setModal, (_, currentModal) => currentModal).reset(hideModal)
$selectedToken
  .on(tokenSelected, (_, token) => token)
  .reset(selectedTokenReseted, createProtectionLayerFx.done)

$searchedValue.reset(selectedTokenReseted)

$displayTokens.reset(selectedTokenReseted)

$selectedTokenUnlocked
  .on(makeTokenUnlock.done, () => true)
  .reset(tokenSelected, amountChanged, hideModal)

$healFromField.on(healFromChanged.map(web3.utils.toWei), (_, value) => value)
$healToField.on(healToChanged.map(web3.utils.toWei), (_, value) => value)

forward({
  from: searchedValueChanged,
  to: $searchedValue,
})

sample({
  source: {
    tokens: $tokens,
    searchedValue: $searchedValue,
  },
  clock: debouncedSearchValueChanged,
  fn: ({ tokens, searchedValue }) => {
    if (searchedValue.length <= 3) return tokens

    const updatedTokens: Tokens = tokens.filter((token: Token) => {
      return checkToken(token, searchedValue)
    })

    return updatedTokens
  },
  target: $displayTokens,
})

// enable token protection

$amount
  .on(amountChanged, (_, value) => value)
  .reset(createProtectionLayerFx.done)
$selectTokenBalance
  .on(
    getSelectedTokenBalanceFx.doneData.map(web3.utils.fromWei),
    (_, value) => value
  )
  .reset(tokenSelected, createProtectionLayerFx.done)

forward({
  from: tokenSelected,
  to: getSelectedTokenBalanceFx,
})

forward({
  from: tokenUnlockClicked,
  to: makeTokenUnlock,
})

forward({
  from: changeHealRangeFx.done,
  to: [hideModal, resetHealFields],
})
forward({
  from: createProtectionLayerFx.done,
  to: hideModal,
})
