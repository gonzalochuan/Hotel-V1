import { ApiError } from './api'

const API_URL = import.meta.env.VITE_API_URL

export async function createPaymentIntent(
  amount: number,
  accessToken: string,
): Promise<{ id: string; clientKey: string }> {
  const response = await fetch(`${API_URL}/payments/intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ amount }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body?.error ?? `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<{ id: string; clientKey: string }>
}
