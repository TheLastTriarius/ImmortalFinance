import { forward } from 'effector'

import { Routes } from '@lib/constants'
import { history } from '@lib/routing'

import {
  $isProviderAvailable,
  $userAdress,
  $userCollateral,
  $userBorrow,
  $originationFee,
  $daiAllowance,
  appStarted,
  connectStarted,
  checkProviderAvailabilityFx,
  connectWalletFx,
  getUpdatedBalancesFx,
} from './index'

import {
  makeDepositFx,
  makeBorrowFx,
  makeRepayFx,
  makeRedeemFx,
  updateAaveUserDataFx,
} from '@models/aave'

$isProviderAvailable.on(
  checkProviderAvailabilityFx.doneData,
  (_, isAvailable) => isAvailable
)
$userAdress.on(connectWalletFx.doneData, (_, id) => id)
$userCollateral.on(
  getUpdatedBalancesFx.doneData,
  (_, { collateral }: { collateral: string }): string => collateral
)
$userBorrow.on(
  getUpdatedBalancesFx.doneData,
  (_, { borrow }: { borrow: string }) => borrow
)

$originationFee.on(
  getUpdatedBalancesFx.doneData,
  (_, { originationFee }): string => originationFee
)

$daiAllowance.on(
  getUpdatedBalancesFx.doneData,
  (_, { daiAllowance }) => daiAllowance
)

connectWalletFx.done.watch(() => history.replace(Routes.HOME))
connectWalletFx.fail.watch(({ error }) => console.error(error))
forward({
  from: appStarted,
  to: checkProviderAvailabilityFx,
})

forward({
  from: connectStarted,
  to: connectWalletFx,
})

forward({
  from: [
    updateAaveUserDataFx.done,
    makeDepositFx.done,
    makeBorrowFx.done,
    makeRepayFx.done,
    makeRedeemFx.done,
  ],
  to: getUpdatedBalancesFx,
})
