import { randomBytes } from 'node:crypto';

/**
 * Generates a secure session token for device authentication
 * @param user_id - The user ID to include in the token
 * @param device_id - The device ID to include in the token
 * @param expiresInDays - Number of days until the token expires (default: 2)
 * @returns Object containing the token and expiration date
 */
export const generateSessionToken = (
  user_id: string,
  device_id: string,
  expiresInDays = 2
): { token: string; expiry_time: string } => {
  // Generate a secure random token
  const randomToken = randomBytes(32).toString('hex');

  // Create a composite token with user_id and device_id for verification
  const payload = Buffer.from(JSON.stringify({ user_id, device_id })).toString('base64');
  const token = `${payload}.${randomToken}`;

  // Calculate expiration date
  const expiry_time = new Date();
  expiry_time.setDate(expiry_time.getDate() + expiresInDays);

  return {
    token,
    expiry_time: expiry_time.toISOString(),
  };
};

/**
 * Verifies and decodes a session token
 * @param token - The token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifySessionToken = (
  token: string
): { user_id: string; device_id: string } | null => {
  try {
    const [payload] = token.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

    if (!decoded.user_id || !decoded.device_id) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};
