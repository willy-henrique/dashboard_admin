const ENABLE_DEV_MOCKS_ENV = process.env.NEXT_PUBLIC_USE_DEV_MOCKS ?? process.env.USE_DEV_MOCKS

export function shouldUseFirebaseDevMocks(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false
  }

  return ENABLE_DEV_MOCKS_ENV !== "false"
}

export function createMockId(prefix: string): string {
  const normalizedPrefix = prefix.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
  return `mock-${normalizedPrefix}-${Date.now()}`
}
