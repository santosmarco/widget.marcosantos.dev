import axios from 'axios'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

const zenQuotesClient = axios.create({
  baseURL: 'https://zenquotes.io/api',
})

export const quotesRouter = router({
  getRandom: publicProcedure
    .output(
      z.tuple([
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      ])
    )
    .query(async () => {
      const { data } = await zenQuotesClient.get('/random')
      return data
    }),
})
