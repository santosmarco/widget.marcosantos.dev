import { Grid } from '@mantine/core'
import { Widget, WidgetProps } from './Widget'

export type WidgetRowProps = {
  left: React.ReactNode
  right: React.ReactNode
  leftProps?: WidgetProps
  rightProps?: WidgetProps
}

export function WidgetRow({
  left,
  right,
  leftProps,
  rightProps,
}: WidgetRowProps) {
  return (
    <Grid>
      <Grid.Col span={6}>
        <Widget {...leftProps}>{left}</Widget>
      </Grid.Col>

      <Grid.Col span={6}>
        <Widget {...rightProps}>{right}</Widget>
      </Grid.Col>
    </Grid>
  )
}
