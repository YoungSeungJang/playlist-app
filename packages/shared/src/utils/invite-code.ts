/**
 * Generate a 6-character invite code using alphanumeric characters
 * Excludes confusing characters: 0, O, I, l, 1
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let result = ''
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Validate invite code format
 */
export function validateInviteCode(code: string): boolean {
  if (!code || code.length !== 6) return false
  
  const validChars = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]+$/
  return validChars.test(code.toUpperCase())
}

/**
 * Format invite code for display (add hyphen in middle)
 */
export function formatInviteCode(code: string): string {
  if (code.length === 6) {
    return `${code.slice(0, 3)}-${code.slice(3)}`
  }
  return code
}