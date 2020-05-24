import React from 'react'
import { useStore } from 'effector-react'

import { LockInput } from '@ui/lock-input'
import {
  $collateralMode,
  $collateralValues,
  collateralFieldChanged,
  toggleCollateralMode,
  depositSubmitted,
} from '@models/token-manage'
import {
  withdrawConfirmed,
  depositLoading,
  redeemConfirmed,
  redeemLoading,
} from '@models/aave'
import { $userCollateral } from '@models/session'
import { getHumanizedNumber } from '@lib/web3'

import s from './styles.pcss'

const modes = {
  WITHDRAW: 'WITHDRAW',
  DEPOSIT: 'DEPOSIT',
}

export const CollateralSection: React.FC = (): JSX.Element => {
  const mode = useStore($collateralMode)
  const { withdraw, deposit } = useStore($collateralValues)
  const depositPending = useStore(depositLoading.isLoading)
  const redeemPending = useStore(redeemLoading.isLoading)
  const collateral = useStore($userCollateral)

  const collateralBalance = getHumanizedNumber(collateral)

  const isWithdraw = mode === modes.WITHDRAW
  const isDeposit = mode === modes.DEPOSIT

  const balance = `${collateralBalance} eth`

  const targetValue = isWithdraw ? withdraw : deposit

  return (
    <div className={s.rebalanceRoot}>
      <div className={s.sectionHeader}>
        <span className={s.sectionName}>collateral</span>
        <span className={s.sectionValue}>{balance}</span>
      </div>
      <div className={s.collateralTabsRoot}>
        <button
          onClick={() => toggleCollateralMode(modes.DEPOSIT)}
          type="button"
          className={s.tabButton}
          data-active={isDeposit}
        >
          deposit
        </button>
        <button
          onClick={() => toggleCollateralMode(modes.WITHDRAW)}
          type="button"
          className={s.tabButton}
          data-active={isWithdraw}
        >
          withdraw
        </button>
      </div>
      <div className={s.inputWrapper}>
        <LockInput
          value={targetValue}
          onUnlock={isWithdraw ? withdrawConfirmed : depositSubmitted}
          onChange={collateralFieldChanged}
          btnText={depositPending || redeemPending ? 'pending' : 'confirm'}
          loading={depositPending || redeemPending}
          disabled={depositPending || redeemPending}
          placeholder={`Enter ${isWithdraw ? 'withdraw' : 'deposit'} amount`}
          fill
        />
      </div>
    </div>
  )
}
