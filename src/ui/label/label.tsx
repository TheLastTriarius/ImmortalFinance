import React from 'react'

import s from './styles.pcss'

export const Label: React.FC<{
  htmlFor?: string
  size: 'medium' | 'small'
}> = ({ children, htmlFor, size }): JSX.Element => (
  <label className={s.label} htmlFor={htmlFor} data-size={size}>
    {children}
  </label>
)
