import { integerFormatter } from '@/utils'
import { Text, type DefaultMantineColor } from '@mantine/core'
import {
  IconArrowDown,
  IconArrowUp,
  type TablerIconsProps,
} from '@tabler/icons-react'

export type MinMaxTemperatureProps = {
  kind: 'min' | 'max'
  value: number
}

export function MinMaxTemperature({ kind, value }: MinMaxTemperatureProps) {
  const Icon = kindMap[kind].icon

  return (
    <Text
      color={kindMap[kind].color}
      className="flex items-center gap-0.5 font-bold"
    >
      <Icon
        size={16}
        stroke={3}
        className={`text-${kindMap[kind].color}-500`}
      />

      {integerFormatter.format(value)}
    </Text>
  )
}

const kindMap = {
  min: { color: 'cyan', icon: IconArrowDown },
  max: { color: 'orange', icon: IconArrowUp },
} as const satisfies Record<
  MinMaxTemperatureProps['kind'],
  { color: DefaultMantineColor; icon: (props: TablerIconsProps) => JSX.Element }
>
