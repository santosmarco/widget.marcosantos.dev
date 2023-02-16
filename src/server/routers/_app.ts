import { router } from '../trpc'
import { gcalRouter } from './gcal'
import { quotesRouter } from './quotes'
import { weatherRouter } from './weather'

export const appRouter = router({
  gcal: gcalRouter,
  quotes: quotesRouter,
  weather: weatherRouter,
})

export type AppRouter = typeof appRouter
