import React from 'react'
import { useStore } from 'effector-react'

import { Label } from '@ui/label'
import { InsideButton } from '@ui/inside-button'
import {
  $ethCollateralEnabled,
  enableEthFetching,
  ethCollateralStatusPressed,
} from '@models/protection'

import s from './styles.pcss'

export const CollateralsSelect: React.FC = (): JSX.Element => {
  const ethIsEnabled = useStore($ethCollateralEnabled)
  const enablingIsLoading = useStore(enableEthFetching.isLoading)
  return (
    <div className={s.root}>
      <div className={s.labelWrapper}>
        <Label size="small" htmlFor="collaterals-list">
          set collaterals for rebalancing
        </Label>
      </div>
      <ul className={s.listWrapper}>
        <li className={s.itemWrapper}>
          <span className={s.itemName} data-variant="disabled">
            dai
          </span>
          <InsideButton onClick={() => {}} disabled={true} loading={false}>
            enable
          </InsideButton>
        </li>
        <li className={s.itemWrapper}>
          <span
            className={s.itemName}
            data-variant={
              enablingIsLoading
                ? 'pending'
                : ethIsEnabled
                ? 'enabled'
                : 'pending'
            }
          >
            eth
          </span>
          <InsideButton
            active={ethIsEnabled}
            onClick={ethCollateralStatusPressed}
            disabled={enablingIsLoading}
            loading={enablingIsLoading}
          >
            {enablingIsLoading
              ? 'pending'
              : ethIsEnabled
              ? 'disable'
              : 'enable'}
          </InsideButton>
        </li>
        <li className={s.itemWrapper}>
          <span className={s.itemName} data-variant="disabled">
            bat
          </span>
          <InsideButton
            active
            onClick={() => {}}
            disabled={true}
            loading={false}
          >
            enable
          </InsideButton>
        </li>
        <li className={s.itemWrapper}>
          <span className={s.itemName} data-variant="disabled">
            snx
          </span>
          <InsideButton onClick={() => {}} disabled={true} loading={false}>
            enable
          </InsideButton>
        </li>
      </ul>
    </div>
  )
}
