import React from 'react'
import { Event } from 'effector'

import s from './styles.pcss'

type Props = {
  disabled: boolean
  onClick?: () => void | Event<void>
}

export const SubmitButton: React.FC<Props> = ({
  disabled,
  children,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={s.submitButton}
    type="button"
    disabled={disabled}
  >
    <span>{children}</span>
  </button>
)
