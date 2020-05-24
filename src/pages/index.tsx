import React from 'react'
import loadable from '@loadable/component'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Routes as routes } from '@lib/constants'
import { PrivateRoute } from '@lib/routing'
import { Modal } from '@core/modal'

const Home = loadable(() => import('./home/page'))
const SignIn = loadable(() => import('./sign-in/page'))
const Manage = loadable(() => import('./manage/page'))

export const Routes: React.FC = (): JSX.Element => {
  return (
    <>
      <Switch>
        <PrivateRoute exact path={routes.HOME} component={Home} />
        <PrivateRoute exact path={routes.MANAGE} component={Manage} />
        <Route exact path={routes.SIGN_IN} component={SignIn} />
        <Redirect
          to={{
            pathname: routes.SIGN_IN,
          }}
        />
      </Switch>
      <Modal />
    </>
  )
}
