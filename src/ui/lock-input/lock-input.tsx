import React from 'react'

import { InsideButton } from '@ui/inside-button'

import s from './styles.pcss'

type Props = {
  value: number | string
  onChange: (value: number) => void
  onUnlock: () => void
  loading: boolean
  disabled: boolean
  fill?: boolean
  placeholder?: string
  btnText?: string
  hideButton?: boolean
  buttonDisabled?: boolean
}

export const LockInput: React.FC<Props> = ({
  value,
  onChange,
  onUnlock,
  loading,
  disabled,
  fill,
  placeholder,
  btnText,
  hideButton,
  buttonDisabled,
}): JSX.Element => {
  const onValueChange = (e) => {
    const { value: eventValue } = e.target

    onChange(eventValue)
  }

  const valueIsValid = value.length > 0 && Number(value) > 0

  return (
    <div className={s.root} data-fill={Boolean(fill)}>
      <input
        type="number"
        value={value}
        onChange={onValueChange}
        placeholder={placeholder || '0.00'}
        className={s.input}
        id="lock-input"
        data-fill={Boolean(fill)}
        disabled={disabled}
      />
      {!hideButton && (
        <InsideButton
          onClick={onUnlock}
          disabled={disabled || buttonDisabled || !valueIsValid}
          loading={loading}
        >
          {btnText || 'unlock'}
        </InsideButton>
      )}
    </div>
  )
}
