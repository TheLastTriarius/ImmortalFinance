import React from 'react'
import loadable from '@loadable/component'
import { useStore } from 'effector-react'

import { $displayUserAddress, connectStarted } from '@models/session'
import { Layout } from '@ui/layout'
import { Header } from '@ui/header'
import { Button } from '@ui/button'
import { QuestionMark } from '@ui/question-mark'
import { AccountId } from '@ui/accound-id'
import { ManageTitle } from '@ui/manage-title'

import { Manage } from './sidebar'
const Chart = loadable(() => import('@core/chart/chart'))

import s from './styles.pcss'

const Home: React.FC = (): JSX.Element => {
  const displayUserAddress = useStore($displayUserAddress)
  const signIn = () => {
    connectStarted()
  }
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
          <QuestionMark top={24} right={24} />
          <Chart />
        </section>
        <aside className={s.aside}>
          <ManageTitle />
          <Manage />
        </aside>
      </div>
    </Layout>
  )
}

export default Home
