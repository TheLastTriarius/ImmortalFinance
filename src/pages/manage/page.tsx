import React from 'react'
import loadable from '@loadable/component'
import { useStore } from 'effector-react'
import { useParams } from 'react-router-dom'

import { $displayUserAddress, connectStarted } from '@models/session'

import { Layout } from '@ui/layout'
import { Header } from '@ui/header'
import { Button } from '@ui/button'
import { AccountId } from '@ui/accound-id'
import { ManageCdpTitle } from '@ui/manage-cdp-title'
import { CdpManage } from './cdp-manage'

const Chart = loadable(() => import('@core/chart/chart'))

import s from './styles.pcss'

const Manage: React.FC = (): JSX.Element => {
  const { id: cdpId } = useParams()
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
          <Chart />
        </section>
        <aside className={s.aside}>
          <ManageCdpTitle id={cdpId} />
          <CdpManage />
        </aside>
      </div>
    </Layout>
  )
}

export default Manage
