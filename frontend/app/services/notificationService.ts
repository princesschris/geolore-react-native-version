import { supabase } from '../config/supabase';

export async function registerPushToken(userId: string, token: string): Promise<void> {
  await supabase
    .from('users')
    .update({ push_token: token })
    .eq('id', userId);
}

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

export async function getPushToken(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('users')
    .select('push_token')
    .eq('id', userId)
    .single();
  return data?.push_token ?? null;
}