import { gcal } from '@/lib/gcal'
import { google } from 'googleapis'
import { middleware } from '../trpc'

export const googleAuthMiddleware = middleware(async ({ next }) => {
  const auth = await gcal.authorize()
  const calendar = google.calendar({ version: 'v3', auth })

  return next({
    ctx: {
      google: {
        auth,
        calendar,
      },
    },
  })
})
