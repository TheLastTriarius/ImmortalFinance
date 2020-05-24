import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import cx from 'clsx'

import { Routes } from '@lib/constants'

import s from './styles.pcss'

export const NavigationBar: React.FC = (): JSX.Element | null => {
  const location = useLocation()
  const isNewPathname = location.pathname === Routes.NEW
  const isManagePathname = location.pathname === Routes.MANAGE

  return (
    <div className={s.root}>
      <Link
        className={cx([s.navigationLink, { [s.activeLink]: isNewPathname }])}
        to={Routes.NEW}
      >
        new
      </Link>
      <div
        className={s.decorationDivider}
        data-position={isNewPathname ? 'left' : 'right'}
      />
      <Link
        className={cx([s.navigationLink, { [s.activeLink]: isManagePathname }])}
        to={Routes.MANAGE}
      >
        manage
      </Link>
    </div>
  )
}
