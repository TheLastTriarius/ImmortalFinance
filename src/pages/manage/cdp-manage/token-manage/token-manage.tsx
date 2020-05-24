import React from 'react'

import { RebalanceSection } from './rebalance-section'
import { CollateralSection } from './collateral-section'
import { DebtSection } from './debt-section'

import s from './styles.pcss'

export const TokenManage: React.FC = (): JSX.Element => {
  return (
    <div className={s.root}>
      <RebalanceSection />
      <CollateralSection />
      <DebtSection />
    </div>
  )
}
