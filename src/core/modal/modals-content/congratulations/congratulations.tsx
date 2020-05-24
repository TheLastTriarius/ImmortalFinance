import React from 'react'

import { FixedButton } from '@ui/fixed-button'

import s from './styles.pcss'

export const Congratulations: React.FC = (): JSX.Element => (
  <div className={s.root}>
    <h3 className={s.title}>Congratulations!</h3>
    <span className={s.text}>
      You succesfully setup <span>123 ETH</span> as protection
    </span>
    <div className={s.btnWrap}>
      <FixedButton
        variant="fill"
        onClick={() => {}}
        loading={false}
        disabled={false}
      >
        next
      </FixedButton>
    </div>
  </div>
)
