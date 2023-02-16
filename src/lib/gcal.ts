import { authenticate } from '@google-cloud/local-auth'
import fs from 'fs/promises'
import { google } from 'googleapis'
import path from 'path'
import process from 'process'

type OAuth2Client = Awaited<ReturnType<typeof authenticate>>

// If modifying these scopes, delete token.json.
const SCOPES = process.env.GOOGLE_CALENDAR_SCOPES?.split(' ') ?? []
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'google/token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'google/credentials.json')

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content.toString())
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

type JSONClient = NonNullable<
  Awaited<ReturnType<typeof loadSavedCredentialsIfExist>>
>

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 */
async function saveCredentials(client: OAuth2Client) {
  const credentials = JSON.stringify({
    type: 'authorized_user',
    client_id: process.env.GOOGLE_CALENDAR_CLIENT_ID,
    client_secret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, credentials)
}

/**
 * Load or request or authorization to call APIs.
 */
async function authorize() {
  let client: JSONClient | OAuth2Client | null =
    await loadSavedCredentialsIfExist()

  if (client) {
    return client
  }

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })

  if (client.credentials) {
    await saveCredentials(client)
  }

  return client
}

export type GoogleAuth = Awaited<ReturnType<typeof authorize>>

export const gcal = {
  authorize,
  calendarIds: [
    'marco@marcosantos.dev',
    'marco.s@turing.com',
    'marco.santos@g2i.co',
  ],
} as const
