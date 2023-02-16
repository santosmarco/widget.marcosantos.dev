import axios from 'axios'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

const openWeatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: process.env.OPEN_WEATHER_API_KEY,
  },
})

export const weatherRouter = router({
  getByCityName: publicProcedure
    .input(
      z.object({
        city: z.string().min(1, 'Required'),
        unit: z.enum(['standard', 'metric', 'imperial']).default('metric'),
      })
    )
    .output(
      z.object({
        name: z.string(),
        weather: z.tuple([
          z.object({
            id: z.number(),
            main: z.string(),
            description: z.string(),
            icon: z.string(),
          }),
        ]),
        main: z.object({
          feels_like: z.number(),
          humidity: z.number(),
          pressure: z.number(),
          temp: z.number(),
          temp_max: z.number(),
          temp_min: z.number(),
        }),
      })
    )
    .query(async ({ input: { city, unit } }) => {
      const { data } = await openWeatherClient.get('/weather', {
        params: {
          q: city,
          units: unit,
        },
      })

      return data
    }),
})
