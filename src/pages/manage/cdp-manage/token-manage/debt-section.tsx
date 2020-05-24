import React from 'react'
import { useStore } from 'effector-react'

import { LockInput } from '@ui/lock-input'
import {
  $debtMode,
  $debtValues,
  debtFieldChanged,
  toggleDebtMode,
} from '@models/token-manage'
import {
  $aaveRepayUnlocked,
  unlockRepay,
  borrowConfirmed,
  unlockRepayLoading,
  repayLoading,
  borrowLoading,
  startRepay,
} from '@models/aave'
import { $userBorrow } from '@models/session'
import { getHumanizedNumber } from '@lib/web3'

import s from './styles.pcss'

const modes = {
  BORROW: 'BORROW',
  REPAY: 'REPAY',
}

export const DebtSection: React.FC = (): JSX.Element => {
  const isRepayUnlocked = useStore($aaveRepayUnlocked)
  const mode = useStore($debtMode)
  const { borrow, repay } = useStore($debtValues)
  const borrowPending = useStore(borrowLoading.isLoading)
  const unlockRepayPending = useStore(unlockRepayLoading.isLoading)
  const repayPending = useStore(repayLoading.isLoading)
  const borrowAmount = useStore($userBorrow)
  const borrowBalance = getHumanizedNumber(borrowAmount)

  const isBorrow = mode === modes.BORROW
  const isRepay = mode === modes.REPAY

  const debt = `${borrowBalance} dai`

  const buttonAction = isBorrow
    ? borrowConfirmed
    : isRepayUnlocked
    ? startRepay
    : unlockRepay

  const isLoading = borrowPending || unlockRepayPending || repayPending

  const confirmButtonText = isLoading
    ? 'pending'
    : isBorrow || isRepayUnlocked
    ? 'confirm'
    : 'unlock'

  return (
    <div className={s.debtRoot}>
      <div className={s.sectionHeader}>
        <span className={s.sectionName}>debt</span>
        <span className={s.sectionValue}>{debt}</span>
      </div>
      <div className={s.collateralTabsRoot}>
        <button
          onClick={() => toggleDebtMode(modes.BORROW)}
          type="button"
          className={s.tabButton}
          data-active={isBorrow}
        >
          borrow
        </button>
        <button
          onClick={() => toggleDebtMode(modes.REPAY)}
          type="button"
          className={s.tabButton}
          data-active={isRepay}
        >
          repay
        </button>
      </div>
      <div className={s.inputWrapper}>
        <LockInput
          value={isBorrow ? borrow : repay}
          onUnlock={buttonAction}
          onChange={debtFieldChanged}
          btnText={confirmButtonText}
          loading={isLoading}
          disabled={isLoading}
          placeholder={`Enter ${isBorrow ? 'borrow' : 'repay'} amount`}
          fill
        />
      </div>
    </div>
  )
}
