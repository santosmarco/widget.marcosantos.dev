import { styles } from '@/styles'
import { Text } from '@mantine/core'

export type WidgetHighlightProps = {
  size?: 'lg' | 'xl'
}

export function WidgetHighlight({
  size,
  children,
}: React.PropsWithChildren<WidgetHighlightProps>) {
  return (
    <Text
      variant="gradient"
      gradient={styles.gradients.secondary}
      className={`text-${size === 'lg' ? 'lg' : '3xl'} font-bold`}
    >
      {children}
    </Text>
  )
}
