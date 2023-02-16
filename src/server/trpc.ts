import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { TRPCContext } from './context'

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,

  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure
