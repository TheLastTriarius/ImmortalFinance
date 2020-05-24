import React from 'react'

import { Logo } from '@ui/logo'
import s from './styles.pcss'

type Props = {
  children: React.ReactNode
}

export const Header: React.FC<Props> = ({ children }): JSX.Element => (
  <header className={s.header}>
    <div className={s.inner}>
      <Logo />
      {children}
    </div>
  </header>
)
