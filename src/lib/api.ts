import axios, { isAxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import type { IsEqual, Simplify } from 'type-fest'
import { z } from 'zod'

export type ApiSuccessResponse<T> = {
  data: T
  errors?: never
}

export type ApiErrorResponse<T> = Simplify<{
  data?: never
  errors:
    | string[]
    | (IsEqual<T, never> extends true
        ? never
        : z.typeToFlattenedError<T, string>['fieldErrors'])
}>

export type ApiResponse<RequestQuerySchema extends z.ZodTypeAny, Response> =
  | ApiSuccessResponse<Response>
  | ApiErrorResponse<z.input<RequestQuerySchema>>

export type ApiHandler<RequestQuerySchema extends z.ZodTypeAny, Response> = (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<RequestQuerySchema, Response>>
) => void

export function api() {
  const handler_ = nc()

  return {
    get<RequestQuerySchema extends z.ZodTypeAny = z.ZodNever, Response = never>(
      handler: ApiHandler<RequestQuerySchema, Response>
    ) {
      return handler_.get(handler)
    },
    generate() {
      return handler_
    },
  }
}

function deriveErrorResponse<T>(
  parsed: z.SafeParseError<T>
): ApiErrorResponse<T>
function deriveErrorResponse(parsed: z.SafeParseError<unknown>) {
  return {
    errors: parsed.error.flatten().fieldErrors,
  }
}

api.deriveErrorResponse = deriveErrorResponse

async function tryCatch<T>(
  res: NextApiResponse<ApiResponse<z.ZodTypeAny, T>>,
  fn: () => Promise<T>
): Promise<void> {
  const response = await (async () => {
    try {
      const data = await fn()

      return {
        status: 200,
        data,
      }
    } catch (err) {
      const defaultStatusCode = 400

      if (
        isAxiosError(err) &&
        err.response?.data &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
      ) {
        return {
          status: err.response.status,
          errors: [err.response.data.message],
        }
      }

      if (err instanceof Error) {
        return {
          status: defaultStatusCode,
          errors: [err.message],
        }
      }

      if (typeof err === 'string') {
        return {
          status: defaultStatusCode,
          errors: [err],
        }
      }

      return {
        status: defaultStatusCode,
        errors: ['Unknown error'],
      }
    }
  })()

  const { status, data, errors } = response

  res.status(status).json({
    data,
    errors,
  } as ApiResponse<z.ZodTypeAny, T>)
}

api.tryCatch = tryCatch

api.client = axios.create({
  baseURL: '/api',
})
