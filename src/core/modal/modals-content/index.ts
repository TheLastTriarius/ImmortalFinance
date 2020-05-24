import { ComponentType } from 'react'

import { CollateralsSelect } from './collaterals-select'
import { Congratulations } from './congratulations'
import { RebalancingRange } from './rebalancing-range'
import { TokenProtection } from './token-protection'

export enum MODALS_NAMES {
  COLLATERALS_SELECT = 'COLLATERALS_SELECT',
  CONGRATULATIONS = 'CONGRATULATIONS',
  REBALANCING_RANGE = 'REBALANCING_RANGE',
  TOKEN_PROTECTION = 'TOKEN_PROTECTION',
}

export const modals: { [K in MODALS_NAMES]: ComponentType } = {
  [MODALS_NAMES.COLLATERALS_SELECT]: CollateralsSelect,
  [MODALS_NAMES.CONGRATULATIONS]: Congratulations,
  [MODALS_NAMES.REBALANCING_RANGE]: RebalancingRange,
  [MODALS_NAMES.TOKEN_PROTECTION]: TokenProtection,
}
