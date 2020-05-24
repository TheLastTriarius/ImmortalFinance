import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'clsx'

import { Position } from '@typings/position'
import { StatusIcon } from './status-icon'
import { ProgressBar } from './progress-bar'

import s from './styles.pcss'

export const PositionItem: React.FC<Position> = ({
  id,
  provider,
  collateral,
  debt,
  disabled,
}) => (
  <li className={s.root}>
    <Link
      className={s.rootLink}
      onClick={(e) => disabled && e.preventDefault()}
      to={`/manage/${id}`}
    >
      <div className={s.infoContainer}>
        <div className={cx([s.propertyWrapper, s.providerWidth])}>
          <span className={s.propertyTitle}>cdp provider</span>
          <span className={s.propertyText}>{provider}</span>
        </div>
        {!disabled && (
          <>
            <div className={cx([s.propertyWrapper, s.collateralWidth])}>
              <span className={s.propertyTitle}>collateral</span>
              <div className={s.currencyWrapper}>
                <span className={s.propertyText}>{collateral}</span>
                <span className={s.currency}>eth</span>
              </div>
            </div>
            <div className={cx([s.propertyWrapper])}>
              <span className={s.propertyTitle}>debt</span>
              <div className={s.currencyWrapper}>
                <span className={s.propertyText}>{debt}</span>
                <span className={s.currency}>eth</span>
              </div>
            </div>
            <div className={s.manageWrapper}>
              <div className={cx([s.propertyWrapper, s.manageRoot])}>
                <span className={s.propertyTitle}>manage</span>
                <StatusIcon status="manage" />
              </div>
            </div>
          </>
        )}
        {disabled && (
          <div className={s.disabledWrapper}>
            <span className={s.comingSoonTitile}>COMING SOON</span>
          </div>
        )}
      </div>
      <ProgressBar disabled={disabled} percentage={83} />
    </Link>
  </li>
)
