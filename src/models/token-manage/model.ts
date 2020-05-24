import { guard } from 'effector'

import {
  $collateralMode,
  $debtMode,
  $isBorrow,
  $isWithdraw,
  $withdrawField,
  $depositField,
  $borrowField,
  $repayField,
  toggleCollateralMode,
  toggleDebtMode,
  collateralModes,
  debtModes,
  collateralFieldChanged,
  debtFieldChanged,
} from './index'
import {
  makeBorrowFx,
  makeDepositFx,
  makeRedeemFx,
  makeRepayFx,
} from '@models/aave'

$collateralMode.on(toggleCollateralMode, (state, value) => value)

$debtMode.on(toggleDebtMode, (state, value) => value)

$withdrawField.reset(makeRedeemFx.done)
$depositField.reset(makeDepositFx.done)
$borrowField.reset(makeBorrowFx.done)
$repayField.reset(makeRepayFx.done)

guard({
  source: collateralFieldChanged,
  filter: $isWithdraw,
  target: $withdrawField,
})

guard({
  source: collateralFieldChanged,
  filter: $isWithdraw.map((state) => !state),
  target: $depositField,
})

guard({
  source: debtFieldChanged,
  filter: $isBorrow,
  target: $borrowField,
})

guard({
  source: debtFieldChanged,
  filter: $isBorrow.map((state) => !state),
  target: $repayField,
})
