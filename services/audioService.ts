import { supabase } from './supabaseClient';
import { get, set } from 'idb-keyval';

const BUCKET_NAME = 'generated-audio';

/**
 * Retrieves audio from local cache or Supabase Storage.
 * Fallback: Returns null if not found, allowing the component to generate it via Gemini.
 */
export const getStoredAudio = async (cacheKey: string): Promise<string | null> => {
  try {
    // 1. Check IndexedDB first (fastest, works offline)
    const localAudio = await get(cacheKey);
    
    // 2. Check Supabase Storage (backend)
    const fileName = `${cacheKey}.wav`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(fileName);

    const existsInBackend = !!(data && !error);

    // Migration logic: If found locally but not in backend, upload it now
    if (localAudio && !existsInBackend) {
      console.log(`[AudioService] Found ${cacheKey} locally but not in backend. Migrating to Supabase...`);
      // We don't await this to avoid blocking the UI
      storeAudio(cacheKey, localAudio).catch(err => 
        console.error(`[AudioService] Migration failed for ${cacheKey}:`, err)
      );
    }

    if (localAudio) {
      console.log(`[AudioService] Serving ${cacheKey} from local cache.`);
      return localAudio;
    }

    if (existsInBackend && data) {
      console.log(`[AudioService] Downloaded ${cacheKey} from Supabase Storage.`);
      // Convert Blob to base64 to store in IndexedDB and return
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1] || base64;
          // Cache locally for next time
          await set(cacheKey, base64Data);
          resolve(base64Data);
        };
        reader.onerror = () => {
          console.error(`[AudioService] FileReader error for ${cacheKey}`);
          resolve(null);
        };
        reader.readAsDataURL(data);
      });
    }

    if (error) {
      // Log warning but don't crash - this triggers the Gemini fallback
      if ((error as any).status === 404 || (error as any).message?.includes('Object not found')) {
        console.info(`[AudioService] ${cacheKey} not found in storage. Will generate via AI.`);
      } else {
        console.warn(`[AudioService] Storage error for ${cacheKey}:`, error.message);
      }
    }
  } catch (err) {
    console.warn(`[AudioService] Unexpected error fetching ${cacheKey}:`, err);
  }
  
  // Final fallback: return null so the component generates it
  return null;
};

/**
 * Stores audio in both local cache and Supabase Storage.
 */
export const storeAudio = async (cacheKey: string, base64Audio: string): Promise<void> => {
  try {
    // 1. Store in IndexedDB (immediate availability)
    await set(cacheKey, base64Audio);

    // 2. Store in Supabase Storage (persistence for all users)
    const fileName = `${cacheKey}.wav`;
    
    // Convert base64 to Blob
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/wav' });

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, blob, {
        contentType: 'audio/wav',
        upsert: true
      });

    if (error) {
      console.error(`[AudioService] Upload failed for ${cacheKey}:`, error.message);
      console.info(`[AudioService] Tip: Ensure the bucket "${BUCKET_NAME}" exists and has public upload permissions.`);
    } else {
      console.log(`[AudioService] Successfully uploaded ${cacheKey} to Supabase.`);
    }
  } catch (err) {
    console.error(`[AudioService] Error in storeAudio for ${cacheKey}:`, err);
  }
};
