import { styles } from '@/styles'
import { Card, Loader, LoadingOverlay, Text } from '@mantine/core'
import cn from 'classnames'

export type WidgetProps = {
  title?: React.ReactNode
  loading?: boolean
}

export function Widget({
  title,
  loading,
  children,
}: React.PropsWithChildren<WidgetProps>) {
  return (
    <Card
      shadow="sm"
      radius="md"
      className={cn(loading && 'flex items-center justify-center')}
    >
      {loading ? (
        <Loader />
      ) : (
        <Card.Section className="px-3 pt-2 pb-5">
          {title && (
            <Text className={cn(styles.colors.text.primary)}>{title}</Text>
          )}

          {children}
        </Card.Section>
      )}
    </Card>
  )
}
