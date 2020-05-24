import React, { useEffect } from 'react'
import { Route, RouteProps, Redirect, useLocation } from 'react-router-dom'
import { useStore } from 'effector-react'

import { $userAdress } from '@models/session'
import { Routes } from '@lib/constants'

export const PrivateRoute: React.FC<RouteProps> = (props): JSX.Element => {
  const location = useLocation()
  const userIsAuthenticated = useStore($userAdress)

  return userIsAuthenticated ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: Routes.SIGN_IN,
        state: { from: location },
      }}
    />
  )
}
