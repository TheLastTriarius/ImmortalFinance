import React, { useState, useCallback, useRef } from 'react'
import { Event } from 'effector'
import { List, ListRowRenderer } from 'react-virtualized'

import { useClickOutside } from '@lib/hooks'
import { Tokens, Token } from '@models/modal'
import searchIcon from '@ui/theme/icons/search.svg'
import bitcoinIcon from '@ui/theme/icons/bitcoin.svg'

import s from './styles.pcss'

type Props = {
  options: Tokens
  selectedToken: Token | null
  onSelect: Event<Token>
  onReset: Event<void>
  searchValue: string
  onChange: Event<string>
}

type OptionProps = {
  token: Token
  style: object
  onClick: () => void
}

const Option: React.FC<OptionProps> = ({
  token,
  style,
  onClick,
}): JSX.Element => (
  <li className={s.optionRoot} style={style} onClick={onClick}>
    {token.icon && <img className={s.tokenIcon} src={token.icon} />}
    <span data-icon={true} className={s.name}>
      {token.name}
    </span>
    {token.balance && <span className={s.balance}>{token.balance}</span>}
  </li>
)

const SelectedOption: React.FC<{ token: Token; onClick: () => void }> = ({
  token,
  onClick,
}): JSX.Element => (
  <div className={s.selectedOptionRoot} onClick={onClick}>
    {token.icon && <img className={s.tokenIcon} src={token.icon} />}
    <span data-icon={true} className={s.selectedOptionName}>
      {token.name}
    </span>
  </div>
)

export const SearchSelect: React.FC<Props> = ({
  options,
  selectedToken,
  onSelect,
  onReset,
  searchValue,
  onChange,
}): JSX.Element => {
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const [isOpen, setOpen] = useState(false)
  const open = (): void => {
    onReset()
    setOpen(true)
  }
  const hide = (): void => setOpen(false)

  const renderOption: ListRowRenderer = useCallback(
    ({ index, style }) => {
      const token: Token = options[index]
      const onClick = (): void => {
        onSelect(token)

        hide()
      }

      return (
        <Option
          onClick={onClick}
          key={token.address}
          token={token}
          style={style}
        />
      )
    },
    [options]
  )

  const onValueChanged = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const { value } = e.target as HTMLInputElement

    onChange(value)
  }

  useClickOutside(containerRef, hide)

  return (
    <div ref={containerRef} className={s.root} data-open={isOpen}>
      {selectedToken && (
        <SelectedOption
          onClick={() => {
            open()
            inputRef.current.focus()
          }}
          token={selectedToken}
        />
      )}
      <input
        ref={inputRef}
        onChange={onValueChanged}
        placeholder="search"
        value={searchValue}
        onFocus={open}
        className={s.input}
        type="text"
      />
      <img src={searchIcon} className={s.searchIcon} alt="search icon" />
      <div className={s.dropdownWrap} data-open={isOpen}>
        <div className={s.dropdownList}>
          <div className={s.innerWrapper}>
            <List
              rowCount={options.length}
              rowRenderer={renderOption}
              rowHeight={45}
              height={270}
              width={388}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
