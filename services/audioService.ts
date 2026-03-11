import { supabase } from './supabaseClient';
import { get, set } from 'idb-keyval';

export const getStoredAudio = async (cacheKey: string): Promise<string | null> => {
  try {
    // 1. Check IndexedDB first (fastest)
    const localAudio = await get(cacheKey);
    if (localAudio) return localAudio;

    // 2. Check Supabase (backend)
    const { data, error } = await supabase
      .from('generated_audio')
      .select('audio_base64')
      .eq('cache_key', cacheKey)
      .single();

    if (data && data.audio_base64) {
      // Cache locally for next time
      await set(cacheKey, data.audio_base64);
      return data.audio_base64;
    }

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Error fetching audio from Supabase:', error);
    }
  } catch (err) {
    console.error('Audio service error:', err);
  }
  return null;
};

export const storeAudio = async (cacheKey: string, base64Audio: string): Promise<void> => {
  try {
    // 1. Store in IndexedDB
    await set(cacheKey, base64Audio);

    // 2. Store in Supabase (backend)
    const { error } = await supabase
      .from('generated_audio')
      .upsert({ 
        cache_key: cacheKey, 
        audio_base64: base64Audio,
        updated_at: new Date().toISOString()
      }, { onConflict: 'cache_key' });

    if (error) {
      console.error('Error storing audio in Supabase:', error);
    }
  } catch (err) {
    console.error('Error in storeAudio:', err);
  }
};
