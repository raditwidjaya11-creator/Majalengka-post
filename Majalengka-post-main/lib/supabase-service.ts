import { getSupabaseClient } from "./db.js";
import {
  readLiveStreamSettings,
  writeLiveStreamSettings,
  readShares,
  writeShares,
  LiveStreamSettings,
  defaultLiveStreamSettings,
  readSeoSettings,
  writeSeoSettings,
  SeoSettings
} from "./vercel-storage.js";

// Helper to sanitize platform name
function getSafePlatform(platform: string): string {
  let safePlatform = platform.toLowerCase();
  if (safePlatform === "twitter/x" || safePlatform === "twitter" || safePlatform === "x") {
    return "twitter";
  } else if (safePlatform === "whatsapp") {
    return "whatsapp";
  } else if (safePlatform === "facebook") {
    return "facebook";
  } else if (safePlatform === "telegram") {
    return "telegram";
  }
  return "other";
}

/**
 * ==========================================
 * 1. LIVESTREAM SETTINGS
 * ==========================================
 */

export async function getLiveStreamSettingsDb(): Promise<LiveStreamSettings> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.log("[Supabase Service] Client not available. Falling back to local storage.");
    return readLiveStreamSettings();
  }

  try {
    const { data, error } = await supabase
      .from("livestream_settings")
      .select("*")
      .eq("id", "current")
      .single();

    if (error) {
      // If table doesn't exist, this throws an error. We catch it and fallback.
      throw error;
    }

    if (data) {
      return {
        active: data.active,
        title: data.title,
        viewerCount: data.viewer_count ?? data.viewerCount ?? 0,
        streamType: data.stream_type ?? data.streamType ?? "youtube",
        streamUrl: data.stream_url ?? data.streamUrl ?? ""
      };
    }
  } catch (err: any) {
    if (err?.message?.includes("Could not find the table") || err?.message?.includes("relation") || err?.code === "PGRST116") {
      console.log("[Supabase Service] Livestream settings table not found in database. Using local storage fallback.");
    } else {
      console.log("[Supabase Service] Notice: Falling back to local files for livestream settings.", err.message || err);
    }
  }

  // Fallback to reading from local JSON or /tmp
  return readLiveStreamSettings();
}

export async function updateLiveStreamSettingsDb(settings: Partial<LiveStreamSettings>): Promise<LiveStreamSettings> {
  // First update local fallback storage
  const currentLocal = readLiveStreamSettings();
  const updatedLocal = { ...currentLocal, ...settings };
  writeLiveStreamSettings(updatedLocal);

  const supabase = getSupabaseClient();
  if (!supabase) {
    return updatedLocal;
  }

  try {
    const dbPayload = {
      id: "current",
      active: updatedLocal.active,
      title: updatedLocal.title,
      viewer_count: updatedLocal.viewerCount,
      stream_type: updatedLocal.streamType,
      stream_url: updatedLocal.streamUrl,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("livestream_settings")
      .upsert(dbPayload, { onConflict: "id" });

    if (error) throw error;
    console.log("[Supabase Service] Successfully saved livestream settings to database.");
  } catch (err: any) {
    if (err?.message?.includes("Could not find the table") || err?.message?.includes("relation")) {
      console.log("[Supabase Service] Livestream settings table not found. Saved settings to local fallback files only.");
    } else {
      console.log("[Supabase Service] Notice: Could not save livestream settings to database, using local:", err.message || err);
    }
  }

  return updatedLocal;
}

/**
 * ==========================================
 * 2. SHARE COUNTS
 * ==========================================
 */

export async function getShareCountsDb(): Promise<Record<string, any>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return readShares();
  }

  try {
    const { data, error } = await supabase
      .from("share_counts")
      .select("*");

    if (error) throw error;

    if (data && data.length > 0) {
      const compiled: Record<string, any> = {};
      data.forEach((row: any) => {
        compiled[row.article_id] = {
          total: row.total || 0,
          facebook: row.facebook || 0,
          twitter: row.twitter || 0,
          whatsapp: row.whatsapp || 0,
          telegram: row.telegram || 0,
          other: row.other || 0
        };
      });
      return compiled;
    }
  } catch (err: any) {
    if (err?.message?.includes("Could not find the table") || err?.message?.includes("relation")) {
      console.log("[Supabase Service] Share counts table not found in database. Using local storage fallback.");
    } else {
      console.log("[Supabase Service] Notice: Falling back to local files for share counts.", err.message || err);
    }
  }

  return readShares();
}

export async function incrementShareCountDb(articleId: string, platform: string): Promise<any> {
  const safePlatform = getSafePlatform(platform);
  
  // First, do local update as a fallback/safety measure
  const localShares = readShares();
  if (!localShares[articleId]) {
    localShares[articleId] = { total: 0, facebook: 0, twitter: 0, whatsapp: 0, telegram: 0, other: 0 };
  }
  localShares[articleId][safePlatform] = (localShares[articleId][safePlatform] || 0) + 1;
  localShares[articleId].total =
    (localShares[articleId].facebook || 0) +
    (localShares[articleId].twitter || 0) +
    (localShares[articleId].whatsapp || 0) +
    (localShares[articleId].telegram || 0) +
    (localShares[articleId].other || 0);
  writeShares(localShares);

  const supabase = getSupabaseClient();
  if (!supabase) {
    return localShares[articleId];
  }

  try {
    // Fetch current DB row
    const { data, error: selectError } = await supabase
      .from("share_counts")
      .select("*")
      .eq("article_id", articleId)
      .single();

    let current = data || {
      article_id: articleId,
      total: 0,
      facebook: 0,
      twitter: 0,
      whatsapp: 0,
      telegram: 0,
      other: 0
    };

    current[safePlatform] = (current[safePlatform] || 0) + 1;
    current.total =
      (current.facebook || 0) +
      (current.twitter || 0) +
      (current.whatsapp || 0) +
      (current.telegram || 0) +
      (current.other || 0);
    current.updated_at = new Date().toISOString();

    const { error: upsertError } = await supabase
      .from("share_counts")
      .upsert(current, { onConflict: "article_id" });

    if (upsertError) throw upsertError;
    console.log(`[Supabase Service] Successfully incremented share for ${articleId} on ${safePlatform} in DB.`);
    return {
      total: current.total,
      facebook: current.facebook,
      twitter: current.twitter,
      whatsapp: current.whatsapp,
      telegram: current.telegram,
      other: current.other
    };
  } catch (err: any) {
    if (err?.message?.includes("Could not find the table") || err?.message?.includes("relation")) {
      console.log("[Supabase Service] Share counts table not found. Incremented share in local fallback storage only.");
    } else {
      console.log("[Supabase Service] Notice: Could not increment share count in database, using local:", err.message || err);
    }
  }

  return localShares[articleId];
}

/**
 * ==========================================
 * 3. SUPABASE STORAGE (VIDEO UPLOADS)
 * ==========================================
 */

export async function uploadVideoDb(buffer: Buffer, fileName: string, contentType: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn("[Supabase Service] Client not available for storage upload.");
    return null;
  }

  try {
    // 1. Ensure the 'videos' bucket exists and is public
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const hasBucket = buckets?.some(b => b.name === "videos");
      if (!hasBucket) {
        console.log("[Supabase Service] Creating public 'videos' storage bucket...");
        await supabase.storage.createBucket("videos", { public: true });
      }
    } catch (bucketErr) {
      console.warn("[Supabase Service] List/create bucket error (might be normal if permissions are restricted):", bucketErr);
    }

    // 2. Upload video
    const cleanFileName = `video_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(cleanFileName, buffer, {
        contentType: contentType || "video/mp4",
        upsert: true
      });

    if (error) {
      throw error;
    }

    // 3. Get public URL
    const { data: urlData } = supabase.storage.from("videos").getPublicUrl(cleanFileName);
    const publicUrl = urlData?.publicUrl || null;
    console.log("[Supabase Service] Uploaded video successfully. Public URL:", publicUrl);
    return publicUrl;
  } catch (err: any) {
    console.error("[Supabase Service] Video upload to Supabase Storage failed:", err.message || err);
    throw err;
  }
}

/**
 * ==========================================
 * 4. SEO SETTINGS
 * ==========================================
 */

export async function getSeoSettingsDb(): Promise<SeoSettings> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.log("[Supabase Service] Client not available. Falling back to local storage.");
    return readSeoSettings();
  }

  try {
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("id", "current")
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return {
        googleSiteVerification: data.google_site_verification ?? ""
      };
    }
  } catch (err: any) {
    if (err?.message?.includes("Could not find the table") || err?.message?.includes("relation") || err?.code === "PGRST116") {
      console.log("[Supabase Service] SEO settings table not found in database. Using local storage fallback.");
    } else {
      console.log("[Supabase Service] Notice: Falling back to local files for SEO settings.", err.message || err);
    }
  }

  return readSeoSettings();
}

export async function updateSeoSettingsDb(settings: Partial<SeoSettings>): Promise<SeoSettings> {
  const currentLocal = readSeoSettings();
  const updatedLocal = { ...currentLocal, ...settings };
  writeSeoSettings(updatedLocal);

  const supabase = getSupabaseClient();
  if (!supabase) {
    return updatedLocal;
  }

  try {
    const dbPayload = {
      id: "current",
      google_site_verification: updatedLocal.googleSiteVerification,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("seo_settings")
      .upsert(dbPayload, { onConflict: "id" });

    if (error) throw error;
    console.log("[Supabase Service] Successfully saved SEO settings to database.");
  } catch (err: any) {
    if (err?.message?.includes("Could not find the table") || err?.message?.includes("relation")) {
      console.log("[Supabase Service] SEO settings table not found. Saved settings to local fallback files only.");
    } else {
      console.log("[Supabase Service] Notice: Could not save SEO settings to database, using local:", err.message || err);
    }
  }

  return updatedLocal;
}
