import { gcal } from '@/lib/gcal'
import { z } from 'zod'
import { googleAuthMiddleware } from '../middlewares/googleAuthMiddleware'
import { publicProcedure, router } from '../trpc'

const gcalProcedure = publicProcedure.use(googleAuthMiddleware)

export const gcalRouter = router({
  listEvents: gcalProcedure
    .input(
      z.object({
        calendars: z
          .array(z.enum([...gcal.calendarIds, 'primary', 'all']))
          .default(['all']),
        timeMin: z.date().default(() => new Date()),
        timeMax: z.date().optional(),
        maxResults: z.number().default(10),
      })
    )
    .query(
      async ({ input: { calendars, timeMin, timeMax, maxResults }, ctx }) => {
        if (calendars.includes('all')) {
          calendars = [...gcal.calendarIds]
        } else if (
          calendars.includes('primary') &&
          !calendars.includes(gcal.calendarIds[0])
        ) {
          calendars = [
            gcal.calendarIds[0],
            ...calendars.filter(calendarId => calendarId !== 'primary'),
          ]
        }

        const res = await Promise.all(
          calendars.map(calendarId =>
            ctx.google.calendar.events.list({
              calendarId: calendarId,
              timeMin: timeMin.toISOString(),
              timeMax: timeMax?.toISOString(),
              maxResults: maxResults,
              singleEvents: true,
              orderBy: 'startTime',
            })
          )
        )

        return res
          .flatMap(({ data: { items } }) => items)
          .filter((event): event is NonNullable<typeof event> => !!event)
      }
    ),
})
