import type { GoogleAuth } from '@/lib/gcal'
import type { calendar_v3 } from 'googleapis'
import type { RequireAllOrNone } from 'type-fest'

export type TRPCContextBase = unknown

export type GoogleCalendarContext = RequireAllOrNone<{
  auth: GoogleAuth
  calendar: calendar_v3.Calendar
}>

export type TRPCContext = {
  google: GoogleCalendarContext
}
