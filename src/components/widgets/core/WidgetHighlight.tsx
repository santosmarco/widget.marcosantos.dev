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
      className={`text-${size === 'xl' ? '3xl' : size} font-bold`}
    >
      {children}
    </Text>
  )
}
