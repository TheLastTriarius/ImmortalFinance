import React from 'react'

import s from './styles.pcss'

import attentionIcon from '@ui/theme/icons/attention.svg'
import checkIcon from '@ui/theme/icons/check.svg'
import crossIcon from '@ui/theme/icons/cross.svg'
import settingsIcon from '@ui/theme/icons/settings.svg'

const iconsSet: { [key: string]: string } = {
  PROTECTED: checkIcon,
  NOT_PROTECTED: attentionIcon,
  OTHER: crossIcon,
  manage: settingsIcon,
}

export const StatusIcon: React.FC<{ status: string }> = ({
  status,
}): JSX.Element => {
  const currentIcon = iconsSet[status]
  return <img src={currentIcon} className={s.statusIcon} />
}
