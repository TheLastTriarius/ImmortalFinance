import React from 'react'
import { useStore } from 'effector-react'
import * as HighCharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import cx from 'clsx'

import { $options, chartMounted } from '@models/chart'

import s from './styles.pcss'

const Chart: React.FC = (): JSX.Element => {
  const options = useStore($options)

  React.useEffect(() => {
    chartMounted()
  }, [])

  return (
    <section className={s.root} id="chart-container">
      <div className={s.titleWrapper}>
        <span className={cx([s.title, s.mr])}>eth</span>
        <div className={s.divider} />
        <span className={cx([s.title, s.ml])}>usd</span>
      </div>
      <HighchartsReact highcharts={HighCharts} options={options} />
    </section>
  )
}

export default Chart
