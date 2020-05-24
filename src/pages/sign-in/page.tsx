import React, { useEffect } from 'react'
import loadable from '@loadable/component'
import { useStore } from 'effector-react'

import { $displayUserAddress, connectStarted } from '@models/session'
import { history } from '@lib/routing'
import { Routes } from '@lib/constants'
import { Layout } from '@ui/layout'
import { Header } from '@ui/header'
import { Button } from '@ui/button'
import { ManageTitle } from '@ui/manage-title'
import { QuestionMark } from '@ui/question-mark'
import { AuthGuard } from '@ui/auth-guard'
import { AccountId } from '@ui/accound-id'

const Chart = loadable(() => import('@core/chart/chart'))

import s from './styles.pcss'

const SignIn: React.FC = (): JSX.Element => {
  const displayUserAddress = useStore($displayUserAddress)
  const signIn = () => {
    connectStarted()
  }

  useEffect(() => {
    if (displayUserAddress) {
      history.push(Routes.HOME)
    }
  }, [displayUserAddress])

  return (
    <Layout
      header={
        <Header>
          {!displayUserAddress && (
            <Button onClick={signIn}>connect wallet</Button>
          )}
          {displayUserAddress && <AccountId accountId={displayUserAddress} />}
        </Header>
      }
    >
      <div className={s.content}>
        <section className={s.chartContainer}>
          <Chart />
        </section>
        <aside className={s.aside}>
          <ManageTitle />
          <AuthGuard />
        </aside>
      </div>
    </Layout>
  )
}

export default SignIn
