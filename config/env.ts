export const getRequiredEnv = (
  env: Record<string, string>,
  key: string,
): string => {
  const value = env[key]?.trim()

  if (!value) {
    throw new Error(
      `[env] Missing required variable: ${key}. Create .env from .env.example and set it.`,
    )
  }

  return value
}

export const getRequiredUrlEnv = (
  env: Record<string, string>,
  key: string,
): string => {
  const value = getRequiredEnv(env, key)

  try {
    new URL(value)
    return value
  } catch {
    throw new Error(`[env] ${key} must be a valid URL, got: "${value}"`)
  }
}
