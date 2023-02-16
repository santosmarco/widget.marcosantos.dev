import { CustomFonts, styles } from '@/styles'
import '@/styles/globals.css'
import { trpc } from '@/utils/trpc'
import { MantineProvider, type MantineThemeOverride } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { AppType } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'

dayjs.extend(relativeTime)

const queryClient = new QueryClient()

const App: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles={true}
        withNormalizeCSS={true}
        theme={theme}
      >
        <CustomFonts />
        <Component {...pageProps} />
      </MantineProvider>
    </QueryClientProvider>
  )
}

const theme = {
  colorScheme: styles.colors.scheme,
  fontFamily: styles.fonts.body,
} as const satisfies MantineThemeOverride

export default trpc.withTRPC(App)
