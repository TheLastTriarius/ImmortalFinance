import React from 'react'
import { useStore } from 'effector-react'

import { $healthFactor, getColor } from '@models/aave'

import s from './styles.pcss'

type Props = {
  percentage: number
}

export const ProgressBar: React.FC<Props> = ({ disabled }): JSX.Element => {
  const healthFactor = useStore($healthFactor)
  const color = getColor(getColor)

  return (
    <div className={s.progressRoot}>
      <div
        className={s.progress}
        style={{
          width: `${!disabled ? healthFactor : 0}%`,
          backgroundColor: color,
        }}
      />
      <span className={s.percentageText}>
        {!disabled ? healthFactor : '0.00'}%
      </span>
    </div>
  )
}
