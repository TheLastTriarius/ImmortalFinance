import { createStore, createEvent, combine } from 'effector'

export const collateralModes = {
  WITHDRAW: 'WITHDRAW',
  DEPOSIT: 'DEPOSIT',
}

export const debtModes = {
  BORROW: 'BORROW',
  REPAY: 'REPAY',
}

export const $collateralMode = createStore(collateralModes.DEPOSIT)
export const $debtMode = createStore(debtModes.BORROW)

export const $isWithdraw = $collateralMode.map(
  (mode) => mode === collateralModes.WITHDRAW
)
export const $isBorrow = $debtMode.map((mode) => mode === debtModes.BORROW)

export const $withdrawField = createStore('')
export const $depositField = createStore('')
export const $borrowField = createStore('')
export const $repayField = createStore('')

export const $collateralValues = combine(
  $withdrawField,
  $depositField,
  (withdraw, deposit) => ({ withdraw, deposit })
)

export const $debtValues = combine(
  $borrowField,
  $repayField,
  (borrow, repay) => ({ borrow, repay })
)

export const toggleCollateralMode = createEvent()
export const toggleDebtMode = createEvent()

export const collateralFieldChanged = createEvent<string>()
export const debtFieldChanged = createEvent<string>()

export const depositSubmitted = createEvent()
