import { supabase } from '../config/supabase';

/**
 * Save a push token for a user.
 * Call this with a token obtained from your own push provider.
 */
export async function registerPushToken(userId: string, token: string): Promise<void> {
  await supabase
    .from('users')
    .update({ push_token: token })
    .eq('id', userId);
}

/**
 * Send a push notification to one or more Expo push tokens
 * via the Expo Push API directly — no expo-notifications SDK needed.
 */
export async function sendPushNotification(
  tokens:  string[],
  title:   string,
  body:    string,
  data?:   Record<string, any>,
): Promise<void> {
  const validTokens = tokens.filter(Boolean);
  if (validTokens.length === 0) return;

  const messages = validTokens.map((to) => ({
    to, title, body, data: data ?? {},
    sound: 'default',
  }));

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(messages),
    });
  } catch (err) {
    console.error('[Push] Send failed:', err);
  }
}

/**
 * Fetch the push token for a given user so we can notify them.
 */
export async function getPushToken(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('users')
    .select('push_token')
    .eq('id', userId)
    .single();
  return data?.push_token ?? null;
}