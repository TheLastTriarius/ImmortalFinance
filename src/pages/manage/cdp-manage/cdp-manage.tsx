import React from 'react'
import { useStore } from 'effector-react'

import { CdpProgressBar } from '@core/cdp-progres-bar'
import { InsideButton } from '@ui/inside-button'
import { $healthFactor, $collaterizationLevel } from '@models/aave'
import { $userCollateral } from '@models/session'
import { getHumanizedNumber } from '@lib/web3'
import {
  $isHealty,
  startHealing,
  healingFetching,
  getProtectionAdress,
} from '@models/protection'

import { ProtectionOptions } from './protection-options'
import { TokenManage } from './token-manage'
import { ProviderSelect } from './provider-select'

import s from './styles.pcss'

export const CdpManage: React.FC = (): JSX.Element => {
  const healthFactor = useStore($healthFactor)
  const isHealty = useStore($isHealty)
  const collateral = useStore($userCollateral)
  const healignIsLoading = useStore(healingFetching.isLoading)
  const collateralBalance = useStore($collaterizationLevel)

  const displayCollaterizationLevel =
    collateralBalance === '-' ? collateralBalance : `${collateralBalance}%`

  React.useEffect(() => {
    getProtectionAdress()
  }, [])

  return (
    <div className={s.root}>
      <div className={s.progressWrapper}>
        <CdpProgressBar percent={''} />
        <div className={s.progressDetails}>
          <div style={{ visibility: 'hidden' }}>
            <InsideButton
              loading={false}
              onClick={() => {}}
              disabled={isHealty}
            >
              heal
            </InsideButton>
          </div>
          <span className={s.progressPercents}>
            {displayCollaterizationLevel}%
          </span>
          <InsideButton
            loading={healignIsLoading}
            onClick={startHealing}
            disabled={isHealty || healignIsLoading}
          >
            {healignIsLoading ? 'pending' : 'heal'}
          </InsideButton>
        </div>
      </div>
      <TokenManage />
      <ProtectionOptions />
      <ProviderSelect />
    </div>
  )
}
