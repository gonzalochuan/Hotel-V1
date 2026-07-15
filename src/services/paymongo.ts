const PAYMONGO_API_URL = 'https://api.paymongo.com/v1'

function authHeader(): string {
  return `Basic ${btoa(`${import.meta.env.VITE_PAYMONGO_PUBLIC_KEY}:`)}`
}

async function paymongoFetch<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${PAYMONGO_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.detail ?? `PayMongo request failed with status ${response.status}`)
  }
  return json as T
}

export type CardDetailsInput = {
  cardNumber: string
  expMonth: number
  expYear: number
  cvc: string
}

export type PaymentMethodType = 'card' | 'gcash' | 'paymaya'

export async function createPaymentMethod(
  type: PaymentMethodType,
  billing: { name: string; email: string },
  card?: CardDetailsInput,
): Promise<string> {
  const attributes: Record<string, unknown> = { type, billing }

  if (type === 'card' && card) {
    attributes.details = {
      card_number: card.cardNumber.replace(/\s/g, ''),
      exp_month: card.expMonth,
      exp_year: card.expYear,
      cvc: card.cvc,
    }
  }

  const response = await paymongoFetch<{ data: { id: string } }>('/payment_methods', {
    method: 'POST',
    body: JSON.stringify({ data: { attributes } }),
  })

  return response.data.id
}

export type AttachResult = {
  status: string
  redirectUrl: string | null
}

export async function attachPaymentMethod(
  intentId: string,
  clientKey: string,
  paymentMethodId: string,
  returnUrl: string,
): Promise<AttachResult> {
  const response = await paymongoFetch<{
    data: {
      attributes: {
        status: string
        next_action: { redirect?: { url: string } } | null
      }
    }
  }>(`/payment_intents/${intentId}/attach`, {
    method: 'POST',
    body: JSON.stringify({
      data: { attributes: { payment_method: paymentMethodId, client_key: clientKey, return_url: returnUrl } },
    }),
  })

  return {
    status: response.data.attributes.status,
    redirectUrl: response.data.attributes.next_action?.redirect?.url ?? null,
  }
}

export async function getPaymentIntentStatus(intentId: string, clientKey: string): Promise<string> {
  const response = await paymongoFetch<{ data: { attributes: { status: string } } }>(
    `/payment_intents/${intentId}?client_key=${clientKey}`,
    { method: 'GET' },
  )
  return response.data.attributes.status
}
