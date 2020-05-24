import React from 'react'

import s from './styles.pcss'

type ButtonProps = {
  disabled: boolean
}

const Button: React.FC<ButtonProps> = ({ disabled, children }): JSX.Element => (
  <button className={s.button} type="button" disabled={disabled}>
    <span>{children}</span>
  </button>
)

export const ProviderSelect: React.FC = (): JSX.Element => {
  return (
    <div className={s.root}>
      <span className={s.title}>cdp provider</span>
      <span className={s.selectedProvider}>aave</span>
      <div className={s.buttonsContainer}>
        <Button disabled>compound</Button>
        <Button disabled>maker</Button>
        <Button disabled={false}>aave</Button>
        <Button disabled>dydx</Button>
      </div>
    </div>
  )
}
