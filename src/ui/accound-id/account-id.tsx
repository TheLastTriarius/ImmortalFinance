import React from 'react'

import s from './styles.pcss'

type Props = {
  accountId: string
}

export const AccountId: React.FC<Props> = ({ accountId }): JSX.Element => (
  <div className={s.root}>
    <span className={s.idText}>{accountId}</span>
  </div>
)
