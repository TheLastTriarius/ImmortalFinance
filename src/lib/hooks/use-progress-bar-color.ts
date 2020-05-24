import { useEffect, useState } from 'react'

type Colors = {
  green: string
  yellow: string
  orange: string
  red: string
}

const colors: Colors = {
  green: '#42a135',
  yellow: '#f4ed35',
  orange: '#f47d35',
  red: '#f45735',
}

const getActualColor = (percent: number): string => {
  if (percent > 75) return colors.green
  if (percent > 50) return colors.yellow
  if (percent > 25) return colors.orange

  return colors.red
}

export const useProgressBarColor = (percent: number): string => {
  const [color, setColor] = useState(colors.green)

  useEffect(() => {
    const targetColor = getActualColor(percent)

    if (targetColor === color) return

    setColor(targetColor)
  }, [percent, color])

  return color
}
