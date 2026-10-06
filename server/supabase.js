import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

async function createSignedDownloadUrl(filePath, bucket = 'digital-products', expiresInSeconds = 3600) {
  const supabase = getSupabaseClient();
  if (!supabase || !filePath) return null;

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, expiresInSeconds);
  if (error) return null;
  return data?.signedUrl || null;
}

export { getSupabaseClient, createSignedDownloadUrl };
