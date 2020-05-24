import React from 'react'

import s from './styles.pcss'

type Props = {
  label: string
  info: string
}

export const AdditionalInfo: React.FC<Props> = ({
  label,
  info,
}): JSX.Element => (
  <div className={s.root}>
    <span className={s.label}>{label}:</span>
    <span className={s.info}>{info}</span>
  </div>
)
