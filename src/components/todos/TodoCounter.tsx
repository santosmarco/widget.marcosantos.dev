import { styles } from '@/styles'
import { Badge, MantineGradient } from '@mantine/core'

export type TodoCounterProps = {
  count: number
  label: React.ReactNode
  gradient?: MantineGradient
}

export function TodoCounter({
  count,
  label,
  gradient = styles.gradients.primary,
}: TodoCounterProps) {
  return (
    <Badge variant="gradient" gradient={gradient} size="sm">
      <strong>{count}</strong> {label}
    </Badge>
  )
}
