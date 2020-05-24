import React from 'react'
import {useStore} from 'effector-react'

import { getColor } from '@models/aave'
import {$userCollateral} from '@models/session'
import {getHumanizedNumber} from '@lib/web3'

import s from './styles.pcss'

type Props = {
  percent: number
}

export const CdpProgressBar: React.FC<Props> = ({ percent }): JSX.Element => {
  const color = getColor(percent || 0)
  return (
    <div className={s.root}>
      <div
        className={s.progress}
        style={{ width: `100%`, backgroundColor: color }}
      />
    </div>
  )
}
