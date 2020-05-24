import React from 'react'
import { useStore } from 'effector-react'
import cx from 'clsx'

import { Label } from '@ui/label'
import { LockInput } from '@ui/lock-input'
import { SearchSelect } from '@ui/search-select'
import { DefaultInput } from '@ui/default-input'
import { FixedButton } from '@ui/fixed-button'
import { $layers } from '@models/protection'
import {
  $displayTokens,
  $searchedValue,
  $selectedToken,
  $amount,
  $selectTokenBalance,
  $protectionEnablingAvailable,
  $selectedTokenUnlocked,
  searchedValueChanged,
  selectedTokenReseted,
  tokenSelected,
  amountChanged,
  selectedTokenBalanceFetching,
  tokenUnlockClicked,
  tokenUnlockLoading,
  createLayerConfrimed,
  hideModal,
} from '@models/modal'
import {
  enableProtectionButtonClicked,
  createLayerFetching,
} from '@models/protection'

import s from './styles.pcss'

export const TokenProtection: React.FC = () => {
  const tokens = useStore($displayTokens)
  const layers = useStore($layers)
  const searchValue = useStore($searchedValue)
  const token = useStore($selectedToken)
  const amount = useStore($amount)
  const tokenUnlockIsLoading = useStore(tokenUnlockLoading.isLoading)
  const tokenBalanceIsLoading = useStore(selectedTokenBalanceFetching.isLoading)
  const enablingIsAvailable = useStore($protectionEnablingAvailable)
  const balance = useStore($selectTokenBalance)
  const tokenUnlocked = useStore($selectedTokenUnlocked)
  const createLayerIsLoading = useStore(createLayerFetching.isLoading)

  const options = tokens.filter((token) => {
    const isExist = Boolean(
      layers.find(
        (el) =>
          String(el.address).toLowerCase() ===
          String(token.address).toLowerCase()
      )
    )

    return !isExist
  })

  const onClickConfirm = () => {
    createLayerConfrimed(token)
  }

  return (
    <>
      <div className={s.inputsRoot}>
        <div className={s.labelWrapper}>
          <Label htmlFor="select" size="small">
            select token for protection
          </Label>
        </div>
        <SearchSelect
          onChange={searchedValueChanged}
          onReset={selectedTokenReseted}
          onSelect={tokenSelected}
          options={options}
          searchValue={searchValue}
          selectedToken={token}
        />
        <div className={cx([s.labelWrapper, s.marginTop])}>
          <Label htmlFor="lock-input" size="small">
            enter the amount
          </Label>
          {balance && (
            <div className={s.balanceRoot}>
              <span className={s.balanceLabel}>your balance:</span>
              <span className={s.balanceValue}>{balance}</span>
            </div>
          )}
        </div>
        <LockInput
          onUnlock={tokenUnlockClicked}
          placeholder="0.00"
          onChange={amountChanged}
          value={amount}
          loading={tokenUnlockIsLoading}
          disabled={!token || tokenBalanceIsLoading || tokenUnlockIsLoading}
          hideButton={tokenUnlocked}
        />
      </div>
      <div className={s.buttonsRoot}>
        <FixedButton
          onClick={onClickConfirm}
          disabled={
            tokenBalanceIsLoading ||
            !enablingIsAvailable ||
            createLayerIsLoading
          }
          loading={createLayerIsLoading}
          variant="fill"
        >
          {createLayerIsLoading ? 'pending' : 'confirm'}
        </FixedButton>
      </div>
    </>
  )
}
