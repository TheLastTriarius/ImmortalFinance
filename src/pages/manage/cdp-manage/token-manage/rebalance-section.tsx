import React from 'react'
import { useStore } from 'effector-react'

import { InsideButton } from '@ui/inside-button'
import { LockInput } from '@ui/lock-input'
import { Label } from '@ui/label'
import { getHumanizedNumber, web3 } from '@lib/web3'
import { $collaterizationLevel } from '@models/aave'
import {
  $rebalanceValue,
  $protectionAddress,
  $ethCollateralEnabled,
  rebalanceConfirmed,
  rebalanceValueChanged,
  rebalanceFetching,
} from '@models/protection'
import { $userBorrow } from '@models/session'

import s from './styles.pcss'

export const RebalanceSection: React.FC = (): JSX.Element => {
  const collaterizationLevel = useStore($collaterizationLevel)
  const userDebt = useStore($userBorrow)
  const protectionAddress = useStore($protectionAddress)
  const aEthIsEnabled = useStore($ethCollateralEnabled)
  const humanizedDebt = Number(web3.utils.fromWei(userDebt))
  const value = useStore($rebalanceValue)
  const rebalanceIsLoading = useStore(rebalanceFetching.isLoading)
  const displayCollaterizationLevel =
    collaterizationLevel === '-'
      ? collaterizationLevel
      : `${collaterizationLevel}%`

  const rebalanceIsAvailable =
    humanizedDebt > 0 &&
    Boolean(protectionAddress) &&
    protectionAddress.length > 3 &&
    aEthIsEnabled
  const borrowBalance = getHumanizedNumber(userDebt)
  return (
    <div className={s.rebalanceRoot}>
      <div className={s.sectionHeader}>
        <span className={s.sectionName}>collaterization level</span>
        <span className={s.sectionValue}>{displayCollaterizationLevel}</span>
      </div>
      <span className={s.rebalanceText}>
        Improve collaterization level by repaying your debt using collateral
      </span>
      <div className={s.inputWrapper}>
        <div className={s.maxRebalanceWrapper}>
          <Label size="small">Max:</Label>
          <span className={s.value}>{borrowBalance}</span>
        </div>
        <LockInput
          placeholder="0.0"
          value={value}
          onChange={rebalanceValueChanged}
          onUnlock={rebalanceConfirmed}
          loading={rebalanceIsLoading}
          disabled={rebalanceIsLoading}
          buttonDisabled={!rebalanceIsAvailable}
          fill
          btnText="rebalance"
        />
      </div>
    </div>
  )
}
