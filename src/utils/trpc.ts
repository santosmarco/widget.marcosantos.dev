import type { AppRouter } from '@/server/routers/_app'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { NextPageContext } from 'next'
import superjson from 'superjson'

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  else if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  else if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  else return `http://127.0.0.1:${process.env.PORT ?? 3000}`
}

export type SSRContext = NextPageContext & {
  status?: number
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config({ ctx }) {
    return {
      transformer: superjson,

      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),

        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              const { headers } = ctx.req

              return {
                ...headers,
                'x-ssr': '1',
              }
            }

            return {}
          },
        }),
      ],
    }
  },

  ssr: true,

  responseMeta(opts) {
    const { ctx } = opts

    if ('status' in ctx && typeof ctx.status === 'number') {
      return {
        status: ctx.status,
      }
    }

    const error = opts.clientErrors[0]

    if (error) {
      return {
        status: error.data?.httpStatus ?? 500,
      }
    }

    return {}
  },
})

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
