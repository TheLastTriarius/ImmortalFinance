import React from 'react'

import s from './styles.pcss'

import { Loader } from '@ui/loader'

type Props = {
  variant: 'fill' | 'ghost'
  onClick: () => void
  loading: boolean
  disabled: boolean
}

export const FixedButton: React.FC<Props> = ({
  children,
  onClick,
  variant,
  loading,
  disabled,
}): JSX.Element => {
  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div className={s.loaderPosition}>
          <Loader />
        </div>
      )}
      <button
        type="button"
        className={s.button}
        data-variant={variant}
        disabled={disabled}
        onClick={onClick}
      >
        <span>{loading ? 'pending' : children}</span>
      </button>
    </div>
  )
}
