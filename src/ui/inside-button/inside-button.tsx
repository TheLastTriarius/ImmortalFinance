import React from 'react'

import { Loader } from '@ui/loader'

import s from './styles.pcss'

type Props = {
  onClick: () => void
  disabled: boolean
  loading: boolean
  active?: boolean
}

export const InsideButton: React.FC<Props> = ({
  children,
  onClick,
  disabled,
  loading,
  active,
}): JSX.Element => {
  return (
    <div style={{ position: 'relative', height: 28 }}>
      {loading && (
        <div className={s.loaderPosition}>
          <Loader />
        </div>
      )}
      <button
        data-active={Boolean(active)}
        type="button"
        className={s.button}
        onClick={onClick}
        disabled={disabled}
      >
        <span>{children}</span>
      </button>
    </div>
  )
}
