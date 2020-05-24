import React from 'react'

import s from './styles.pcss'

type Props = {
  children: React.ReactNode
  onClick: () => void
}

export const Button: React.FC<Props> = ({ children, onClick }): JSX.Element => (
  <button onClick={onClick} type="button" className={s.button}>
    <span>{children}</span>
  </button>
)
