import { createStore, createEvent, combine, Store } from 'effector'

import { createInputEvent } from '@lib/stm-helpers'

export type Provider = string
export type Collateral = string | number
export type Debt = string | number
export type ProtectionMode = string
export type Rebalancing = number

export type NewPositionForm = {
  provider: Provider
  collateral: Collateral
  debt: Debt
  protectionMode: ProtectionMode
  rebalancing: Rebalancing
}

export type NewPositionFormCombine = {
  provider: Store<Provider>
  collateral: Store<Collateral>
  debt: Store<Debt>
  protectionMode: Store<ProtectionMode>
  rebalancing: Store<Rebalancing>
}

export const $provider = createStore<Provider>('')
export const $collateral = createStore<Collateral>('0')
export const $debt = createStore<Debt>('0')
export const $protectionMode = createStore<ProtectionMode>('none')
export const $rebalancing = createStore<Rebalancing>(0)

export const $newPositionForm = combine(
  $provider,
  $collateral,
  $debt,
  $protectionMode,
  $rebalancing,
  (provider, collateral, debt, protectionMode, rebalancing) => ({
    provider,
    collateral,
    debt,
    protectionMode,
    rebalancing,
  })
)

export const newPositionMounted = createEvent()
export const newPositionUnmounted = createEvent()
export const providerChanged = createEvent()
export const collateralChanged = createInputEvent()
export const debtChanged = createInputEvent()
export const protectionModeChanged = createInputEvent()
export const rebalancingChanged = createEvent<string>()
