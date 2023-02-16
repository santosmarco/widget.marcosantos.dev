import { router } from '../trpc'
import { quotesRouter } from './quotes'
import { weatherRouter } from './weather'

export const appRouter = router({
  quotes: quotesRouter,
  weather: weatherRouter,
})

export type AppRouter = typeof appRouter
