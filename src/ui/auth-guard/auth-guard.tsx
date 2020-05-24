import React from 'react'
import { useStore } from 'effector-react'

import {
  $isProviderAvailable,
  $userAdress,
  connectStarted,
} from '@models/session'
import { Button } from '@ui/button'

import s from './styles.pcss'

export const AuthGuard: React.FC = ({ children }): JSX.Element => {
  const isProviderAvailable = useStore($isProviderAvailable)
  const userAddress = useStore($userAdress)

  const connectWallet = () => {
    connectStarted()
  }

  return (
    <>
      {userAddress && children}
      {!userAddress && (
        <div className={s.root}>
          {isProviderAvailable && (
            <>
              <span className={s.helpMessage}>To manage your CPDs</span>
              <Button onClick={connectWallet}>connect wallet</Button>
            </>
          )}
        </div>
      )}
    </>
  )
}
