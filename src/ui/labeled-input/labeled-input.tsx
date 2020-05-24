import React from 'react'

import s from './styles.pcss'

type Props = {
  label: string
  value: string
  onChange: (e: string) => void
}

export const LabeledInput: React.FC<Props> = ({
  label,
  value,
  onChange,
}): JSX.Element => {
  const onValueChanged = (e) => {
    const { value } = e.target

    if (value === '') return '0'

    onChange(value)
  }
  return (
    <div className={s.root}>
      <div className={s.labelContainer}>
        <span className={s.label}>{label}</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={onValueChanged}
        className={s.input}
      />
    </div>
  )
}
