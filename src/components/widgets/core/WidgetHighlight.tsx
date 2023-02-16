import { styles } from '@/styles'
import { Text } from '@mantine/core'

export type WidgetHighlightProps = {
  size?: 'lg' | 'xl'
}

export function WidgetHighlight({
  size = 'xl',
  children,
}: React.PropsWithChildren<WidgetHighlightProps>) {
  return (
    <Text
      variant="gradient"
      gradient={styles.gradients.secondary}
      fz={size}
      fw="bold"
    >
      {children}
    </Text>
  )
}
