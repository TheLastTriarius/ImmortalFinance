import React from 'react'

import s from './styles.pcss'

type Option = {
  value: string | number
  label: string
}

type Props = {
  options: Array<Option>
  selectedOption: Option
  onChange: (value: string | number) => void
  id?: string
  placeholder?: string
}

export const Dropdown: React.FC<Props> = ({
  onChange,
  options,
  selectedOption,
  id,
  placeholder,
}): JSX.Element => {
  const dropdownRef = React.useRef()
  const [optionsLisVisible, setVisible] = React.useState(false)

  const clickOutside = (e: Event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setVisible(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', clickOutside)

    return () => document.removeEventListener('mousedown', clickOutside)
  }, [dropdownRef.current])

  return (
    <div
      ref={dropdownRef}
      id={id}
      data-active={String(optionsLisVisible)}
      className={s.root}
      onClick={() => setVisible((state) => !state)}
    >
      <span className={s.downIcon} />
      <span className={s.dropdownValue}>
        {selectedOption.label || placeholder}
      </span>
      <div className={s.dropdownList} data-visible={String(optionsLisVisible)}>
        <ul className={s.innerWrapper}>
          {options.map(({ value, label }) => (
            <li
              className={s.dropdownOption}
              key={value}
              onClick={() => onChange(value)}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
