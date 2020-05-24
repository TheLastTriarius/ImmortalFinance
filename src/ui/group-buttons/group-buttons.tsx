import React from 'react'

import s from './styles.pcss'

type ButtonConfig = {
  label: string
  value: string
}

type Props = {
  buttons: Array<ButtonConfig>
  onClick: (value: string) => void
  selected: string | null
}

const Button: React.FC<{ onClick: () => void; active: boolean }> = ({
  children,
  onClick,
  active,
}) => (
  <button
    type="button"
    className={s.button}
    data-active={String(active)}
    onClick={onClick}
  >
    {children}
  </button>
)

export const GroupButtons: React.FC<Props> = ({
  buttons,
  onClick,
  selected,
}) => (
  <div className={s.root}>
    {buttons.map(({ value, label }, idx) => (
      <Button
        key={value}
        active={selected === value}
        onClick={() => onClick(value)}
      >
        <span>{label}</span>
      </Button>
    ))}
  </div>
)
