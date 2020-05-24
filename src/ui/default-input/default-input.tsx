import React from 'react'

import s from './styles.pcss'

type Props = {
  value: string
  onChange: (e: string) => void
  placeholder: string
  disabled: boolean
}

export const DefaultInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  disabled,
}): JSX.Element => {
  const onChangeValue = (e) => {
    const { value: inputValue } = e.target
    onChange(inputValue)
  }
  return (
    <input
      className={s.input}
      value={value}
      onChange={onChangeValue}
      placeholder={placeholder || ''}
      disabled={disabled}
      type="number"
    />
  )
}
