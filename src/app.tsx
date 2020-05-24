import React from 'react'
import { Router } from 'react-router-dom'
import { useStore } from 'effector-react'

import { manageListSectionMounted } from '@models/aave'
import { $userAdress } from '@models/session'
import { $protectionAddress, startHealtyCheck } from '@models/protection'

import { history } from '@lib/routing'
import { Routes } from '@pages'

export const App: React.FC = (): JSX.Element => {
  const userAddress = useStore($userAdress)
  const protectionAddress = useStore($protectionAddress)
  const userDataInterval = React.useRef()
  const healtyInterval = React.useRef()

  React.useEffect(() => {
    if (userAddress) {
      userDataInterval.current = setInterval(manageListSectionMounted, 5000)
    }

    return () => {
      clearInterval(userDataInterval.current)
    }
  }, [userAddress])

  React.useEffect(() => {
    if (protectionAddress) {
      healtyInterval.current = setInterval(startHealtyCheck, 5000)
    }

    return () => {
      clearInterval(healtyInterval.current)
    }
  }, [protectionAddress])

  return (
    <Router history={history}>
      <Routes />
    </Router>
  )
}
