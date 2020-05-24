import React from 'react'
import { useStore } from 'effector-react'

import { Loader } from '@ui/loader'
import { PositionItem } from '@core/position-item'
import { AuthGuard } from '@ui/auth-guard'

import {
  $aaveHumanizedDebt,
  $aaveHealthFactor,
  $manageListSectionLoading,
  $aaveHumanizedCollateral,
  manageListSectionMounted,
  getUserProtectionAddress,
} from '@models/aave'
import { $userAdress } from '@models/session'

import s from './styles.pcss'

export const Manage: React.FC = (): JSX.Element => {
  const userAddress = useStore($userAdress)
  const isLoading = useStore($manageListSectionLoading)
  const aaveCollateral = useStore($aaveHumanizedCollateral)
  const aaveDebt = useStore($aaveHumanizedDebt)
  const healthFactor = useStore($aaveHealthFactor)

  React.useEffect(() => {
    manageListSectionMounted()
  }, [])
  return (
    <AuthGuard>
      {isLoading && (
        <div className={s.loaderRoot}>
          <Loader size="large" />
        </div>
      )}
      {!isLoading && (
        <ul className={s.root}>
          <PositionItem
            id="AAVE"
            provider="AAVE"
            collateral={aaveCollateral}
            debt={aaveDebt}
          />
          <PositionItem
            id="COMPOUND"
            provider="COMPOUND"
            collateral={0}
            debt={0}
            disabled
          />
          <PositionItem
            id="MAKER"
            provider="MAKER"
            collateral={0}
            debt={0}
            disabled
          />
          <PositionItem
            id="DYDX"
            provider="DYDX"
            collateral={0}
            debt={0}
            disabled
          />
        </ul>
      )}
    </AuthGuard>
  )
}
