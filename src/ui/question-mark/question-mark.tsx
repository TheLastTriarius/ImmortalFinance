import React, { useState } from 'react'
import { ToggleLayer } from 'react-laag'

import closeIcon from '@ui/theme/icons/close-cross.svg'

import s from './styles.pcss'

type Props = {
  top?: number
  left?: number
  right?: number
  bottom?: number
}

export const QuestionMark: React.FC<Props> = ({
  top,
  left,
  right,
  bottom,
  children,
}): JSX.Element => {
  const [isOpen, setOpen] = useState(false)

  const toggleTooltip = () => children && setOpen((isOpen) => !isOpen)

  return (
    <ToggleLayer
      isOpen={isOpen}
      placement={{
        anchor: 'RIGHT_TOP',
      }}
      fixed
      renderLayer={({ isOpen, layerProps, layerSide }) =>
        isOpen &&
        children && (
          <div
            ref={layerProps.ref}
            style={{
              ...layerProps.style,
              backgroundColor: '#232323',
              border: '1px solid #494949',
              boxShadow: '0 0 20 40 rgba(0, 0, 0, 0.75)',
              padding: 10,
              marginLeft: 3,
            }}
          >
            {children}
          </div>
        )
      }
    >
      {({ triggerRef }) => (
        <div
          ref={triggerRef}
          onClick={toggleTooltip}
          className={s.root}
          style={{ top, left, right, bottom }}
        >
          {isOpen ? (
            <img className={s.closeIcon} src={closeIcon} />
          ) : (
            <span className={s.question}>?</span>
          )}
        </div>
      )}
    </ToggleLayer>
  )
}
