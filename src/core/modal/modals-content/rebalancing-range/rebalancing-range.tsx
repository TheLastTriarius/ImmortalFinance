import React from 'react'
import { useStore } from 'effector-react'

import { Label } from '@ui/label'
import { FixedButton } from '@ui/fixed-button'
import { LabeledInput } from '@ui/labeled-input'
import { web3 } from '@lib/web3'
import {
  $healFrom,
  $healTo,
  $healFromField,
  $healToField,
  healFromChanged,
  healToChanged,
  changeHealRangeConfirmed,
  changeHealRangeFetching,
} from '@models/protection'

import s from './styles.pcss'

export const RebalancingRange: React.FC = (): JSX.Element => {
  const healFromField = useStore($healFromField)
  const healToField = useStore($healToField)
  const savedHealFrom = useStore($healFrom)
  const savedHealTo = useStore($healTo)
  const changeIsLoading = useStore(changeHealRangeFetching.isLoading)

  const displaySavedHealFrom = savedHealFrom
  const displaySavedHealTo = savedHealTo
  const displayHealFrom = healFromField
  const displayHealTo = healToField

  return (
    <div className={s.root}>
      <div className={s.labelWrapper}>
        <Label htmlFor="collaterals" size="small">
          set collaterals for rebalancing
        </Label>
      </div>
      <section className={s.contentWrapper}>
        <div className={s.content}>
          <div className={s.contentLabelWrapper}>
            <Label htmlFor="collaterals" size="small">
              {`healing option: ${displaySavedHealFrom}% > ${displaySavedHealTo}%`}
            </Label>
          </div>
          <div className={s.inputs}>
            <div className={s.inputWrapper}>
              <div className={s.labelWrapper}>
                <Label htmlFor="collaterals" size="small">
                  healing option %
                </Label>
              </div>
              <LabeledInput
                label="from"
                value={displayHealFrom}
                onChange={healFromChanged}
              />
            </div>
            <div className={s.inputWrapper}>
              <div className={s.labelWrapper}>
                <Label htmlFor="collaterals" size="small">
                  healing option %
                </Label>
              </div>
              <LabeledInput
                label="to"
                value={displayHealTo}
                onChange={healToChanged}
              />
            </div>
          </div>
        </div>
      </section>
      <div className={s.btnWrapper}>
        <FixedButton
          onClick={changeHealRangeConfirmed}
          variant="fill"
          loading={changeIsLoading}
          disabled={changeIsLoading}
        >
          {changeIsLoading ? 'pending' : 'confirmed'}
        </FixedButton>
      </div>
    </div>
  )
}
