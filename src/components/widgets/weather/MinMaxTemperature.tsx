import { integerFormatter } from '@/utils'
import { Text } from '@mantine/core'
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import { useMemo } from 'react'

export type MinMaxTemperatureProps = {
  kind: 'min' | 'max'
  value: number
}

export function MinMaxTemperature({ kind, value }: MinMaxTemperatureProps) {
  const { color, icon: Icon } = useMemo(
    () =>
      ({
        min: { color: 'cyan', icon: IconArrowDown },
        max: { color: 'orange', icon: IconArrowUp },
      }[kind]),
    [kind]
  )

  return (
    <Text color={color} className="flex items-center gap-0.5 font-bold">
      <Icon size={16} stroke={3} className={`text-${color}-500`} />

      {integerFormatter.format(value)}
    </Text>
  )
}
