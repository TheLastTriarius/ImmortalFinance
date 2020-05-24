import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'clsx'

import { Routes } from '@lib/constants'

import s from './styles.pcss'

type Props = {
  id: string
}

export const ManageCdpTitle: React.FC<Props> = ({ id }): JSX.Element => (
  <div className={s.root}>
    <Link className={s.link} to={Routes.HOME}>
      manage
    </Link>
    <span className={s.title}>{id}</span>
    <Link className={cx([s.link, s.fake])} to={Routes.HOME}>
      manage
    </Link>
  </div>
)
