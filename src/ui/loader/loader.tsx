import React from 'react'

import arrowsIcon from '@ui/theme/icons/arrows.svg'
import logoIcon from '@ui/theme/icons/logo.svg'

import s from './styles.pcss'

export const Loader: React.FC = ({ size = 'small' }): JSX.Element => {
  return (
    <div className={s.root} data-size={size}>
      <div className={s.logo} style={{ backgroundImage: `url(${logoIcon})` }} />
      <div
        className={s.arrowsRoot}
        style={{ backgroundImage: `url(${arrowsIcon})` }}
      />
    </div>
  )
}
