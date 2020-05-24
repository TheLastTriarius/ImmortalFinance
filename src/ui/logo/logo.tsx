import React from 'react'

import logoSvg from '@ui/theme/icons/logo-cross.svg'

import s from './styles.pcss'

export const Logo: React.FC = (): JSX.Element => (
  <img src={logoSvg} alt="logo" className={s.logo} />
)
