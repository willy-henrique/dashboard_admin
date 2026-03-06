type UnknownRecord = Record<string, unknown>

const COMPLETED_STATUSES = new Set(["completed", "concluido"])

const toNumberOrNull = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const normalized = value.replace(",", ".").trim()
    if (!normalized) {
      return null
    }
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export const readString = (value: unknown): string => {
  if (typeof value !== "string") {
    return ""
  }
  return value.trim()
}

const readLower = (value: unknown): string => readString(value).toLowerCase()

export const amountToCents = (amount: number): number => {
  if (!Number.isFinite(amount)) {
    return 0
  }
  return Math.round((amount + Number.EPSILON) * 100)
}

export const centsToAmount = (cents: number): number => {
  if (!Number.isFinite(cents)) {
    return 0
  }
  return Number((cents / 100).toFixed(2))
}

const toTimestampMillis = (value: unknown): number => {
  if (!value) {
    return 0
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  if (typeof value === "object") {
    const maybeTimestamp = value as {
      toMillis?: () => number
      toDate?: () => Date
      seconds?: number
      _seconds?: number
    }

    if (typeof maybeTimestamp.toMillis === "function") {
      const ms = maybeTimestamp.toMillis()
      if (Number.isFinite(ms)) {
        return ms
      }
    }

    if (typeof maybeTimestamp.toDate === "function") {
      const date = maybeTimestamp.toDate()
      if (date instanceof Date) {
        return date.getTime()
      }
    }

    if (typeof maybeTimestamp.seconds === "number" && Number.isFinite(maybeTimestamp.seconds)) {
      return maybeTimestamp.seconds * 1000
    }

    if (typeof maybeTimestamp._seconds === "number" && Number.isFinite(maybeTimestamp._seconds)) {
      return maybeTimestamp._seconds * 1000
    }
  }

  return 0
}

export const toIsoDate = (value: unknown, fallback = new Date().toISOString()): string => {
  const ms = toTimestampMillis(value)
  if (ms <= 0) {
    return fallback
  }
  return new Date(ms).toISOString()
}

const getOrderSortTimestamp = (order: UnknownRecord): number => {
  const candidates = [
    toTimestampMillis(order.completedAt),
    toTimestampMillis(order.reviewedAt),
    toTimestampMillis(order.updatedAt),
    toTimestampMillis(order.createdAt),
  ]

  for (const candidate of candidates) {
    if (candidate > 0) {
      return candidate
    }
  }

  return 0
}

const getOrderCommissionCents = (order: UnknownRecord): number => {
  const providerCommission = toNumberOrNull(order.providerCommission) ?? 0
  if (providerCommission <= 0) {
    return 0
  }

  return amountToCents(providerCommission)
}

const getOrderPaidCents = (order: UnknownRecord, totalCommissionCents: number): number => {
  const rawPaidCents = toNumberOrNull(order.providerPayoutPaidCents)
  const rawPaidAmount = toNumberOrNull(order.providerPayoutPaidAmount)

  const paidCents =
    rawPaidCents !== null
      ? Math.round(rawPaidCents)
      : amountToCents(rawPaidAmount ?? 0)

  if (paidCents <= 0) {
    return 0
  }

  return Math.min(paidCents, totalCommissionCents)
}

export interface OrderPayoutSnapshot {
  orderId: string
  providerId: string
  totalCommissionCents: number
  alreadyPaidCents: number
  remainingCents: number
  eligible: boolean
  sortTimestampMs: number
}

export const buildOrderPayoutSnapshot = (
  orderId: string,
  orderData: UnknownRecord
): OrderPayoutSnapshot => {
  const providerId = readString(orderData.providerId)
  const paymentStatus = readLower(orderData.paymentStatus)
  const status = readLower(orderData.status)
  const providerCompletionConfirmed = orderData.providerCompletionConfirmed === true

  const totalCommissionCents = getOrderCommissionCents(orderData)
  const alreadyPaidCents = getOrderPaidCents(orderData, totalCommissionCents)
  const remainingCents = Math.max(totalCommissionCents - alreadyPaidCents, 0)

  const isCompleted = providerCompletionConfirmed || COMPLETED_STATUSES.has(status)
  const eligible =
    providerId.length > 0 &&
    paymentStatus === "paid" &&
    isCompleted &&
    totalCommissionCents > 0

  return {
    orderId,
    providerId,
    totalCommissionCents,
    alreadyPaidCents,
    remainingCents,
    eligible,
    sortTimestampMs: getOrderSortTimestamp(orderData),
  }
}
