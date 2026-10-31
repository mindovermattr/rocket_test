import { isAxiosError } from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Не удалось выполнить запрос'): string {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message
    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string' && message) return message
  }

  if (error instanceof Error && error.message) return error.message

  return fallback
}
