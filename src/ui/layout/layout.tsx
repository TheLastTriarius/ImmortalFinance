import React from 'react'

import s from './styles.pcss'

type Props = {
  header: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children, header }): JSX.Element => (
  <div className={s.layoutRoot}>
    {header}
    <main className={s.main}>{children}</main>
  </div>
)
