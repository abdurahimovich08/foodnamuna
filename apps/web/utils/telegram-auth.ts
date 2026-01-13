import * as crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  auth_date: number;
  hash: string;
}

export function verifyInitData(initData: string): TelegramInitData | null {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    throw new Error('BOT_TOKEN is not set');
  }

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) {
      return null;
    }

    urlParams.delete('hash');

    // Sort parameters
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return null;
    }

    // Check auth_date (should be within 24 hours)
    const authDate = parseInt(urlParams.get('auth_date') || '0', 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - authDate > 86400) {
      return null; // Expired
    }

    // Parse user data
    const userStr = urlParams.get('user');
    let user: TelegramUser | undefined;
    if (userStr) {
      user = JSON.parse(userStr);
    }

    return {
      query_id: urlParams.get('query_id') || undefined,
      user,
      auth_date: authDate,
      hash,
    };
  } catch (error) {
    console.error('InitData verification error:', error);
    return null;
  }
}

export function getTelegramUserId(initData: string): number | null {
  const data = verifyInitData(initData);
  return data?.user?.id || null;
}
