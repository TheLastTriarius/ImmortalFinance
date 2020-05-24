import { forward, sample } from 'effector'

import { history } from '@lib/routing'
import { Routes } from '@lib/constants'

import { $depositField, depositSubmitted } from '@models/token-manage'
import { $userAdress, getUpdatedBalancesFx } from '@models/session'
import {
  $userProtectionContractInstance,
  $aaveCollateral,
  $aaveDebt,
  $aaveHealthFactor,
  $manageListSectionLoading,
  $aaveRepayUnlocked,
  $availableDebt,
  delayedUpdateUserData,
  createProtectionContractInstanceFx,
  makeUnlockRepayStatusFx,
  getUserProtectionContract,
  borrowConfirmed,
  manageListSectionMounted,
  aaveUserDataUpdated,
  updateAaveUserDataFx,
  makeDepositFx,
  createProtectionLayerFx,
  getProtectionLayer,
  getProtectionLayerByNumber,
  getProtectionLayerByNumberFx,
  getUserDebtWithProtection,
  getUserDebtWithProtectionFx,
  makeBorrowFx,
  makeHeal,
  makeHealFx,
  unlockRepay,
  makeRedeemFx,
  redeemConfirmed,
  withdrawConfirmed,
  makeRepayFx,
  startRepay,
} from './index'

$manageListSectionLoading.on(updateAaveUserDataFx.doneData, () => false)

updateAaveUserDataFx.fail.watch(() => history.replace(Routes.HOME))

$userProtectionContractInstance.on(
  createProtectionContractInstanceFx.doneData,
  (_, contract) => contract
)

$aaveCollateral.on(
  updateAaveUserDataFx.doneData,
  (_, { totalCollateralETH }) => totalCollateralETH
)

$aaveDebt.on(
  updateAaveUserDataFx.doneData,
  (_, { totalBorrowsETH }) => totalBorrowsETH
)

$availableDebt.on(
  updateAaveUserDataFx.doneData,
  (_, { availableBorrowsETH }) => availableBorrowsETH
)

$aaveHealthFactor.on(aaveUserDataUpdated, (_, { healthFactor }) => healthFactor)

$aaveRepayUnlocked
  .on(makeUnlockRepayStatusFx.doneData, () => true)
  .on(
    getUpdatedBalancesFx.doneData,
    (_, { repayIsUnlocked }: { repayIsUnlocked: boolean }) => repayIsUnlocked
  )

forward({
  from: manageListSectionMounted,
  to: updateAaveUserDataFx,
})

forward({
  from: getUserProtectionContract,
  to: createProtectionContractInstanceFx,
})

forward({
  from: getProtectionLayer,
  to: createProtectionLayerFx,
})

sample({
  source: $userProtectionContractInstance,
  clock: getProtectionLayerByNumber,
  fn: (protectionContract, layerNumber) => ({
    protectionContract,
    layerNumber,
  }),
  target: getProtectionLayerByNumberFx,
})

sample({
  source: $userProtectionContractInstance,
  clock: getUserDebtWithProtection,
  fn: (protectionContract) => ({ protectionContract }),
  target: getUserDebtWithProtectionFx,
})

forward({
  from: makeHeal,
  to: makeHealFx,
})

sample({
  clock: depositSubmitted,
  source: $depositField,
  target: makeDepositFx,
})

forward({
  from: unlockRepay,
  to: makeUnlockRepayStatusFx,
})

forward({
  from: borrowConfirmed,
  to: makeBorrowFx,
})

forward({
  from: withdrawConfirmed,
  to: makeRedeemFx,
})

forward({
  from: startRepay,
  to: makeRepayFx,
})
