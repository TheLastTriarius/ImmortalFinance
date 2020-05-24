import React from 'react'

import s from './styles.pcss'

type Props = {
  value: string
  onChange: (value: string | number) => void
  id?: string
  error?: string
  placeholder?: string
}

const numberRegexp = new RegExp(/^\d+$/)

export const NumberInput: React.FC<Props> = ({
  value,
  onChange,
  id,
  error,
  placeholder,
}): JSX.Element => {
  const onEdit = (e: React.SyntheticEvent): void => {
    const { value } = e.target as HTMLInputElement

    if (value === '') onChange(0)
    if (numberRegexp.test(value)) {
      onChange(value)
    }
  }

  return (
    <div className={s.root}>
      <div className={s.innerLabel}>
        <span className={s.innerLabelText}>{placeholder}</span>
      </div>
      <input className={s.input} onChange={onEdit} value={value} type="text" />
    </div>
  )
}
