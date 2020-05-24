import React from 'react'
import ReactModal from 'react-modal'
import { useStore } from 'effector-react'

import { $isModalShow, $currentModal, hideModal } from '@models/modal'
import { Logo } from '@ui/logo'
import crossIcon from '@ui/theme/icons/cross.svg'

import { MODALS_NAMES, modals } from './modals-content'
import { modalStyles } from './modal-styles'
import s from './styles.pcss'

const CloseButton: React.FC = (): JSX.Element => (
  <div onClick={() => hideModal()} className={s.closeHeader}>
    <div className={s.closeIconWrapper}>
      <div
        className={s.closeIcon}
        style={{ backgroundImage: `url(${crossIcon})` }}
      />
    </div>
  </div>
)

export const Modal: React.FC = (): JSX.Element => {
  const isVisible = useStore($isModalShow)
  const currentModal = useStore($currentModal)

  const Content = currentModal
    ? modals[currentModal as keyof typeof MODALS_NAMES]
    : currentModal

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isVisible}
      style={modalStyles}
      onRequestClose={(): void => hideModal()}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      <div className={s.header}>
        <Logo />
        <CloseButton />
      </div>
      {currentModal && <Content />}
    </ReactModal>
  )
}
