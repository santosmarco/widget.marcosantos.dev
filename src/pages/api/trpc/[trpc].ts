import { appRouter } from '@/server/routers/_app'
import * as trpcNext from '@trpc/server/adapters/next'

export default trpcNext.createNextApiHandler({
  router: appRouter,

  createContext() {
    return {}
  },

  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('[ERROR]', error)
    }
  },

  batching: {
    enabled: true,
  },
})
