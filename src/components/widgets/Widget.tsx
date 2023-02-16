import { Card, Loader, LoadingOverlay } from '@mantine/core'
import cn from 'classnames'

export type WidgetProps = {
  loading?: boolean
}

export function Widget({
  loading,
  children,
}: React.PropsWithChildren<WidgetProps>) {
  return (
    <Card
      shadow="sm"
      radius="md"
      className={cn('pt-3 pb-6', loading && 'flex justify-center')}
    >
      <Card.Section p="sm">{loading ? <Loader /> : children}</Card.Section>
    </Card>
  )
}
