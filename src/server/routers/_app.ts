import { router } from '../trpc'
import { gcalRouter } from './gcal'
import { quotesRouter } from './quotes'
import { todosRouter } from './todos'
import { weatherRouter } from './weather'

export const appRouter = router({
  gcal: gcalRouter,
  quotes: quotesRouter,
  todos: todosRouter,
  weather: weatherRouter,
})

export type AppRouter = typeof appRouter
