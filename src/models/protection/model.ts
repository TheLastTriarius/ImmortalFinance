import { forward, guard, sample } from 'effector'

import { createLayerConfrimed } from '@models/modal'
import { EMPTY_PROTECTION_ADRESS } from '@lib/constants'
import { web3 } from '@lib/web3'
import { $aEthMaxAvailable } from '@models/session'
import {
  $healFrom,
  $healTo,
  $userProtectionContractInstance,
  $protectionUnlockIsLoading,
  $healFromField,
  $healToField,
  $protectionLayersAmount,
  $protectionAddress,
  $ethCollateralEnabled,
  $isHealty,
  $rebalanceValue,
  getAethAllowanceStatusFx,
  startHealtyCheck,
  getProtectionAdress,
  checkHealtyFx,
  enableProtectionButtonClicked,
  checkEthCollateralAllowanceFx,
  checkProtectionAddressFx,
  ethCollateralStatusPressed,
  rebalanceConfirmed,
  changeHealRangeConfirmed,
  createProtectionContractInstanceFx,
  changeHealRangeFx,
  getProtectionaddressFx,
  enableEthCollateralFx,
  createProtectionLayerFx,
  healFromChanged,
  healToChanged,
  makeRebalanceFx,
  updateProtectionLayers,
  getLayersListFx,
  $layers,
  makeHealFx,
  startHealing,
  rebalanceValueChanged,
} from './index'

const healRangeChanged = sample({
  source: {
    from: $healFromField,
    to: $healToField,
  },
  clock: changeHealRangeFx.done,
})

$userProtectionContractInstance.on(
  createProtectionContractInstanceFx.doneData,
  (_, contract) => contract
)
$protectionUnlockIsLoading
  .on(enableProtectionButtonClicked, () => true)
  .reset(
    getProtectionaddressFx.fail,
    createProtectionContractInstanceFx.fail,
    createProtectionLayerFx.done,
    createProtectionLayerFx.fail
  )
$protectionAddress
  .on(getProtectionaddressFx.doneData, (_, address) => address)
  .on(checkProtectionAddressFx.doneData, (_, address) =>
    address === EMPTY_PROTECTION_ADRESS ? undefined : address
  )
$layers.on(getLayersListFx.doneData, (_, list) => list)

$healFromField.on(healFromChanged, (_, value) => value).reset(healRangeChanged)
$healToField.on(healToChanged, (_, value) => value).reset(healRangeChanged)
$healFrom.on(healRangeChanged, (_, { from }) => from)
$healTo.on(healRangeChanged, (_, { to }) => to)

$ethCollateralEnabled
  .on(enableEthCollateralFx.done, () => true)
  .on(checkEthCollateralAllowanceFx.doneData, (_, value) => value)

$isHealty.on(checkHealtyFx.doneData, (_, value) => value)

$rebalanceValue
  .on(rebalanceValueChanged, (_, value) => value)
  .reset(makeRebalanceFx.done)

forward({
  from: getProtectionAdress,
  to: checkProtectionAddressFx,
})

forward({
  from: enableProtectionButtonClicked,
  to: getProtectionaddressFx,
})

guard({
  source: getProtectionaddressFx.doneData,
  filter: (address) => address === EMPTY_PROTECTION_ADRESS,
  target: createProtectionContractInstanceFx,
})

forward({
  from: createProtectionContractInstanceFx.done,
  to: getProtectionaddressFx,
})

forward({
  from: createLayerConfrimed,
  to: createProtectionLayerFx,
})

forward({
  from: updateProtectionLayers,
  to: getLayersListFx,
})

forward({
  from: makeHealFx.done,
  to: updateProtectionLayers,
})

forward({
  from: createProtectionLayerFx.done,
  to: updateProtectionLayers,
})

forward({
  from: changeHealRangeConfirmed,
  to: changeHealRangeFx,
})

forward({
  from: ethCollateralStatusPressed,
  to: enableEthCollateralFx,
})

forward({
  from: startHealtyCheck,
  to: checkHealtyFx,
})

forward({
  from: startHealing,
  to: makeHealFx,
})

guard({
  source: $protectionAddress,
  filter: (address) => address !== '' && address !== EMPTY_PROTECTION_ADRESS,
  target: checkEthCollateralAllowanceFx,
})

forward({
  from: rebalanceConfirmed,
  to: makeRebalanceFx,
})
