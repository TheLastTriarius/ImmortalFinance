import React from 'react'
import { useStore } from 'effector-react'

import { FixedButton } from '@ui/fixed-button'
import { InsideButton } from '@ui/inside-button'
import { Loader } from '@ui/loader'
import { web3 } from '@lib/web3'
import { setModal, showModal } from '@models/modal'
import {
  $protectionSectionIsLock,
  $protectionUnlockIsLoading,
  $healFrom,
  $healTo,
  $layers,
  $ethCollateralEnabled,
  enableProtectionButtonClicked,
  getLayersFetching,
  updateProtectionLayers,
} from '@models/protection'
import { MODALS_NAMES } from '@core/modal/modals-content'

import s from './styles.pcss'

type SimpleOptionProps = {
  label: string
  value: string
  onClick: () => void
  loading: boolean
}

type ProtectionLevelOptionProps = {
  level: number
  tokenName: string
  amount: string
  symbol: string
}

const ProtectionLock: React.FC<{ onClick: () => void; loading: boolean }> = ({
  onClick,
  loading,
}): JSX.Element => (
  <div className={s.protectionLockWrapper}>
    <FixedButton
      loading={loading}
      disabled={loading}
      variant="fill"
      onClick={onClick}
    >
      enable protection
    </FixedButton>
  </div>
)

const SimpleOption: React.FC<SimpleOptionProps> = ({
  label,
  value,
  onClick,
  loading,
}): JSX.Element => (
  <div className={s.simpleOptionRoot}>
    <div className={s.infoWrapper}>
      <span className={s.label}>{label}:</span>
      <span className={s.value}>{value}</span>
    </div>
    <InsideButton onClick={onClick} disabled={false} loading={loading}>
      change
    </InsideButton>
  </div>
)

const ProtectionLevelOption: React.FC<ProtectionLevelOptionProps> = ({
  level,
  tokenName,
  amount,
  symbol,
}): JSX.Element => (
  <div className={s.protectionOptionRoot}>
    <div className={s.protectionLevelWrap}>
      <span className={s.protectionTitle}>{`protection level ${level}`}</span>
      <span className={s.protectionName}>{tokenName}</span>
    </div>
    <div className={s.amountWrap}>
      <span className={s.protectionTitle}>amount</span>
      <span className={s.protectionName}>{`${amount} ${symbol}`}</span>
    </div>
  </div>
)

export const ProtectionOptions: React.FC = (): JSX.Element => {
  const isLocked = useStore($protectionSectionIsLock)
  const unlockIsLoading = useStore($protectionUnlockIsLoading)
  const ethEnabled = useStore($ethCollateralEnabled)
  const layers = useStore($layers)
  const fetchingLayersLoading = useStore(getLayersFetching.isLoading)
  const healFrom = useStore($healFrom)
  const healTo = useStore($healTo)

  const healValues = `${healFrom}% > ${healTo}%`

  const onClickAdd = (): void => {
    setModal(MODALS_NAMES.TOKEN_PROTECTION)
    showModal()
  }

  const onClickUnlock = (): void => {
    enableProtectionButtonClicked()
  }

  const onChangeHealing = (): void => {
    setModal(MODALS_NAMES.REBALANCING_RANGE)
    showModal()
  }

  const onChangeCollaterals = (): void => {
    setModal(MODALS_NAMES.COLLATERALS_SELECT)
    showModal()
  }

  React.useEffect(() => {
    if (!isLocked) {
      updateProtectionLayers()
    }
  }, [isLocked])
  return (
    <div className={s.root}>
      <span className={s.title}>protection options</span>
      {isLocked && (
        <ProtectionLock onClick={onClickUnlock} loading={unlockIsLoading} />
      )}
      {!isLocked && (
        <>
          <div className={s.listWrap}>
            <SimpleOption
              loading={false}
              label="healing option"
              value={healValues}
              onClick={onChangeHealing}
            />
            <SimpleOption
              loading={false}
              label="auto rebalancing"
              value={ethEnabled ? 'enabled' : 'disabled'}
              onClick={onChangeCollaterals}
            />
            {fetchingLayersLoading && (
              <div className={s.loaderWrap}>
                <Loader />
              </div>
            )}
            {!fetchingLayersLoading && (
              <>
                {layers.map(({ address, name, amount, level, symbol }) => (
                  <ProtectionLevelOption
                    key={address}
                    amount={amount}
                    level={level}
                    tokenName={name}
                    symbol={symbol}
                  />
                ))}
                <div className={s.addProtectionBtnWrap}>
                  <InsideButton
                    loading={false}
                    onClick={onClickAdd}
                    disabled={false}
                  >
                    add protection
                  </InsideButton>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
