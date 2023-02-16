import { Text } from '@mantine/core'

export function DimmedText({ children }: React.PropsWithChildren) {
  return <Text color="dimmed">{children}</Text>
}
