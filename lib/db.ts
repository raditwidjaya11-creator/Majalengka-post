import { createClient } from "@supabase/supabase-js";
import {
  INITIAL_ARTICLES,
  INITIAL_BANNERS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_POLL,
  DEFAULT_COMPANY_PROFILES
} from "./mockData.js";

export function getSupabaseClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "";

  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (supabaseUrl && supabaseServiceRoleKey) {
    try {
      return createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
    } catch (err) {
      console.error("[Backend Supabase] Error creating Supabase client:", err);
      return null;
    }
  }

  console.error("[Backend Supabase] Missing Supabase credentials");
  return null;
}

function safeJsonParse(val: any, fallback: any = null) {
  if (val === undefined || val === null) return fallback;
  if (typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    console.warn("Backend safeJsonParse failed, returning fallback:", val, e);
    return fallback;
  }
}

async function withTimeout<T>(promise: Promise<T> | any, timeoutMs: number): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Database fetch timeout of ${timeoutMs}ms exceeded`));
    }, timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

export function normalizeObject(item: any, mappings: Record<string, string[]>): any {
  if (!item) return item;
  const result = { ...item };
  for (const [targetKey, sourceKeys] of Object.entries(mappings)) {
    for (const srcKey of sourceKeys) {
      if (item[srcKey] !== undefined) {
        result[targetKey] = item[srcKey];
        break;
      }
    }
  }
  return result;
}

export const ARTICLE_MAPPINGS = {
  subTitle: ["subTitle", "subtitle", "sub_title"],
  bodyJson: ["bodyJson", "bodyjson", "body_json"],
  coverImage: ["coverImage", "coverimage", "cover_image"],
  galleryImages: ["galleryImages", "galleryimages", "gallery_images"],
  videoUrl: ["videoUrl", "videourl", "video_url"],
  audioUrl: ["audioUrl", "audiourl", "audio_url"],
  gpsCoords: ["gpsCoords", "gpscoords", "gps_coords"],
  subCategory: ["subCategory", "subcategory", "sub_category"],
  isBreaking: ["isBreaking", "isbreaking", "is_breaking"],
  isHeadline: ["isHeadline", "isheadline", "is_headline"],
  isTrending: ["isTrending", "istrending", "is_trending"],
  isEditorialChoice: ["isEditorialChoice", "iseditorialchoice", "is_editorial_choice"],
  isFeatured: ["isFeatured", "isfeatured", "is_featured"],
  isSticky: ["isSticky", "issticky", "is_sticky"],
  scheduledPublish: ["scheduledPublish", "scheduledpublish", "scheduled_publish"]
};

export const BANNER_MAPPINGS = {
  adUrl: ["adUrl", "adurl", "ad_url"],
  imageUrl: ["imageUrl", "imageurl", "image_url"],
  htmlContent: ["htmlContent", "htmlcontent", "html_content"]
};

export const POLL_MAPPINGS = {
  totalVotes: ["totalVotes", "totalvotes", "total_votes"]
};

export async function robustUpsert(
  tableName: string,
  payloads: { camel: any; lower: any; snake: any },
  onConflict: string = "id"
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured on the backend.");

  try {
    const { error } = await supabase.from(tableName).upsert(payloads.camel, { onConflict });
    if (!error) return;
    throw error;
  } catch (err: any) {
    const msg = err?.message || "";
    const isColumnError = msg.includes("column") || msg.includes("does not exist") || err?.code === "42703";
    if (isColumnError) {
      try {
        const { error: error2 } = await supabase.from(tableName).upsert(payloads.lower, { onConflict });
        if (!error2) return;
        throw error2;
      } catch (err2: any) {
        const msg2 = err2?.message || "";
        const isColumnError2 = msg2.includes("column") || msg2.includes("does not exist") || err2?.code === "42703";
        if (isColumnError2) {
          try {
            const { error: error3 } = await supabase.from(tableName).upsert(payloads.snake, { onConflict });
            if (!error3) return;
            throw error3;
          } catch (err3) {
            throw err; // throw original error if everything fails
          }
        }
        throw err2;
      }
    }
    throw err;
  }
}

/**
 * ==========================================
 * 1. ARTICLES
 * ==========================================
 */

export async function fetchArticles() {
  const supabaseClient = getSupabaseClient();
  if (supabaseClient) {
    try {
      const fetchPromise = supabaseClient
        .from("articles")
        .select("*")
        .order("date", { ascending: false });

      const { data, error } = await withTimeout<any>(fetchPromise, 20000);
      
      if (!error && data && data.length > 0) {
        return data.map((b: any) => {
          const item = normalizeObject(b, ARTICLE_MAPPINGS);
          return {
            id: item.id,
            title: item.title,
            subTitle: item.subTitle !== undefined ? item.subTitle : (item.subtitle || ""),
            summary: item.summary || "",
            content: item.content || "",
            bodyJson: safeJsonParse(item.bodyJson, null),
            coverImage: item.coverImage !== undefined ? item.coverImage : (item.coverimage || ""),
            galleryImages: safeJsonParse(item.galleryImages, []),
            videoUrl: item.videoUrl !== undefined ? item.videoUrl : (item.videourl || ""),
            audioUrl: item.audioUrl !== undefined ? item.audioUrl : (item.audiourl || ""),
            author: item.author || "",
            editor: item.editor || "",
            photographer: item.photographer || "",
            videographer: item.videographer || "",
            date: item.date || "",
            time: item.time || "",
            location: item.location || "",
            gpsCoords: safeJsonParse(item.gpsCoords, null),
            category: item.category || "",
            subCategory: item.subCategory !== undefined ? item.subCategory : (item.subcategory || ""),
            tags: safeJsonParse(item.tags, []),
            views: Number(item.views || 0),
            shares: Number(item.shares || 0),
            likes: Number(item.likes || 0),
            bookmarks: Number(item.bookmarks || 0),
            isBreaking: item.isBreaking !== undefined ? !!item.isBreaking : (item.isbreaking !== undefined ? !!item.isbreaking : (item.is_breaking !== undefined ? !!item.is_breaking : false)),
            isHeadline: item.isHeadline !== undefined ? !!item.isHeadline : (item.isheadline !== undefined ? !!item.isheadline : (item.is_headline !== undefined ? !!item.is_headline : false)),
            isTrending: item.isTrending !== undefined ? !!item.isTrending : (item.istrending !== undefined ? !!item.istrending : (item.is_trending !== undefined ? !!item.is_trending : false)),
            isEditorialChoice: item.isEditorialChoice !== undefined ? !!item.isEditorialChoice : (item.iseditorialchoice !== undefined ? !!item.iseditorialchoice : (item.is_editorial_choice !== undefined ? !!item.is_editorial_choice : false)),
            isFeatured: item.isFeatured !== undefined ? !!item.isFeatured : (item.isfeatured !== undefined ? !!item.isfeatured : (item.is_featured !== undefined ? !!item.is_featured : false)),
            isSticky: item.isSticky !== undefined ? !!item.isSticky : (item.issticky !== undefined ? !!item.issticky : (item.is_sticky !== undefined ? !!item.is_sticky : false)),
            status: item.status,
            scheduledPublish: item.scheduledPublish !== undefined ? item.scheduledPublish : (item.scheduledpublish || item.scheduled_publish || null),
            seo: safeJsonParse(item.seo, { title: "", description: "", keywords: "", canonicalUrl: "" })
          };
        });
      }
    } catch (err) {
      console.error("Error fetching articles inside lib/db.ts:", err);
    }
  }
  return INITIAL_ARTICLES;
}

export async function upsertArticles(articles: any[]) {
  const camel = articles.map(art => ({
    id: art.id,
    title: art.title,
    subTitle: art.subTitle || null,
    summary: art.summary,
    content: art.content,
    bodyJson: art.bodyJson || null,
    coverImage: art.coverImage,
    galleryImages: art.galleryImages || [],
    videoUrl: art.videoUrl || null,
    audioUrl: art.audioUrl || null,
    author: art.author,
    editor: art.editor,
    photographer: art.photographer || null,
    videographer: art.videographer || null,
    date: art.date,
    time: art.time,
    location: art.location,
    gpsCoords: art.gpsCoords || null,
    category: art.category,
    subCategory: art.subCategory || null,
    tags: art.tags || [],
    views: art.views || 0,
    shares: art.shares || 0,
    likes: art.likes || 0,
    bookmarks: art.bookmarks || 0,
    isBreaking: !!art.isBreaking,
    isHeadline: !!art.isHeadline,
    isTrending: !!art.isTrending,
    isEditorialChoice: !!art.isEditorialChoice,
    isFeatured: !!art.isFeatured,
    isSticky: !!art.isSticky,
    status: art.status,
    scheduledPublish: art.scheduledPublish || null,
    seo: art.seo || { title: "", description: "", keywords: "", canonicalUrl: "" }
  }));

  const lower = articles.map(art => ({
    id: art.id,
    title: art.title,
    subtitle: art.subTitle || null,
    summary: art.summary,
    content: art.content,
    bodyjson: art.bodyJson || null,
    coverimage: art.coverImage,
    galleryimages: art.galleryImages || [],
    videourl: art.videoUrl || null,
    audiourl: art.audioUrl || null,
    author: art.author,
    editor: art.editor,
    photographer: art.photographer || null,
    videographer: art.videographer || null,
    date: art.date,
    time: art.time,
    location: art.location,
    gpscoords: art.gpsCoords || null,
    category: art.category,
    subcategory: art.subCategory || null,
    tags: art.tags || [],
    views: art.views || 0,
    shares: art.shares || 0,
    likes: art.likes || 0,
    bookmarks: art.bookmarks || 0,
    isbreaking: !!art.isBreaking,
    isheadline: !!art.isHeadline,
    istrending: !!art.isTrending,
    iseditorialchoice: !!art.isEditorialChoice,
    isfeatured: !!art.isFeatured,
    issticky: !!art.isSticky,
    status: art.status,
    scheduledpublish: art.scheduledPublish || null,
    seo: art.seo || { title: "", description: "", keywords: "", canonicalUrl: "" }
  }));

  const snake = articles.map(art => ({
    id: art.id,
    title: art.title,
    sub_title: art.subTitle || null,
    summary: art.summary,
    content: art.content,
    body_json: art.bodyJson || null,
    cover_image: art.coverImage,
    gallery_images: art.galleryImages || [],
    video_url: art.videoUrl || null,
    audio_url: art.audioUrl || null,
    author: art.author,
    editor: art.editor,
    photographer: art.photographer || null,
    videographer: art.videographer || null,
    date: art.date,
    time: art.time,
    location: art.location,
    gps_coords: art.gpsCoords || null,
    category: art.category,
    sub_category: art.subCategory || null,
    tags: art.tags || [],
    views: art.views || 0,
    shares: art.shares || 0,
    likes: art.likes || 0,
    bookmarks: art.bookmarks || 0,
    is_breaking: !!art.isBreaking,
    is_headline: !!art.isHeadline,
    is_trending: !!art.isTrending,
    is_editorial_choice: !!art.isEditorialChoice,
    is_featured: !!art.isFeatured,
    is_sticky: !!art.isSticky,
    status: art.status,
    scheduled_publish: art.scheduledPublish || null,
    seo: art.seo || { title: "", description: "", keywords: "", canonicalUrl: "" }
  }));

  await robustUpsert("articles", { camel, lower, snake });
}

export async function deleteArticle(id: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

/**
 * ==========================================
 * 2. BANNERS
 * ==========================================
 */

export async function fetchBanners() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const fetchPromise = supabase.from("banners").select("*");
      const { data, error } = await withTimeout<any>(fetchPromise, 20000);
      if (!error && data && data.length > 0) {
        return data.map((b: any) => {
          const item = normalizeObject(b, BANNER_MAPPINGS);
          return {
            id: item.id,
            title: item.title,
            position: item.position,
            type: item.type,
            adUrl: item.adUrl !== undefined ? item.adUrl : (item.adurl !== undefined ? item.adurl : (item.ad_url || "")),
            imageUrl: item.imageUrl !== undefined ? item.imageUrl : (item.imageurl !== undefined ? item.imageurl : (item.image_url || "")),
            htmlContent: item.htmlContent !== undefined ? item.htmlContent : (item.htmlcontent !== undefined ? item.htmlcontent : (item.html_content || "")),
            views: Number(item.views || 0),
            clicks: Number(item.clicks || 0),
            active: item.active !== undefined ? !!item.active : true
          };
        });
      }
    } catch (err) {
      console.error("Error fetching banners in lib/db.ts:", err);
    }
  }
  return INITIAL_BANNERS;
}

export async function upsertBanners(banners: any[]) {
  const camel = banners.map(b => ({
    id: b.id,
    title: b.title,
    position: b.position,
    type: b.type,
    adUrl: b.adUrl,
    imageUrl: b.imageUrl || null,
    htmlContent: b.htmlContent || null,
    views: b.views || 0,
    clicks: b.clicks || 0,
    active: !!b.active
  }));

  const lower = banners.map(b => ({
    id: b.id,
    title: b.title,
    position: b.position,
    type: b.type,
    adurl: b.adUrl,
    imageurl: b.imageUrl || null,
    htmlcontent: b.htmlContent || null,
    views: b.views || 0,
    clicks: b.clicks || 0,
    active: !!b.active
  }));

  const snake = banners.map(b => ({
    id: b.id,
    title: b.title,
    position: b.position,
    type: b.type,
    ad_url: b.adUrl,
    image_url: b.imageUrl || null,
    html_content: b.htmlContent || null,
    views: b.views || 0,
    clicks: b.clicks || 0,
    active: !!b.active
  }));

  await robustUpsert("banners", { camel, lower, snake });
}

export async function deleteBanner(id: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}

/**
 * ==========================================
 * 3. MEDIA ITEMS
 * ==========================================
 */

export async function fetchMediaItems() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const fetchPromise = supabase.from("media_items").select("*");
      const { data, error } = await withTimeout<any>(fetchPromise, 20000);
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          tags: safeJsonParse(item.tags, [])
        }));
      }
    } catch (err) {
      console.error("Error fetching media items in lib/db.ts:", err);
    }
  }
  return INITIAL_MEDIA_ITEMS;
}

export async function upsertMediaItems(media: any[]) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured on the backend.");
  const payload = media.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    url: m.url,
    size: m.size,
    folder: m.folder,
    tags: m.tags || [],
    created_at: m.created_at
  }));

  const { error } = await supabase.from("media_items").upsert(payload, { onConflict: "id" });
  if (error) throw error;
}

export async function deleteMediaItem(id: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("media_items").delete().eq("id", id);
  if (error) throw error;
}

/**
 * ==========================================
 * 4. POLLS
 * ==========================================
 */

export async function fetchPoll() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const fetchPromise = supabase.from("polls").select("*").eq("active", true).limit(1);
      const { data, error } = await withTimeout<any>(fetchPromise, 20000);
      if (!error && data && data.length > 0) {
        const b = data[0];
        const poll = normalizeObject(b, POLL_MAPPINGS);
        return {
          id: poll.id,
          question: poll.question,
          options: safeJsonParse(poll.options, []),
          totalVotes: Number(poll.totalVotes || 0),
          active: !!poll.active
        };
      }
    } catch (err) {
      console.error("Error fetching poll in lib/db.ts:", err);
    }
  }
  return INITIAL_POLL;
}

export async function upsertPoll(poll: any) {
  const camel = {
    id: poll.id,
    question: poll.question,
    options: poll.options,
    totalVotes: poll.totalVotes,
    active: !!poll.active
  };

  const lower = {
    id: poll.id,
    question: poll.question,
    options: poll.options,
    totalvotes: poll.totalVotes,
    active: !!poll.active
  };

  const snake = {
    id: poll.id,
    question: poll.question,
    options: poll.options,
    total_votes: poll.totalVotes,
    active: !!poll.active
  };

  await robustUpsert("polls", { camel, lower, snake });
}

/**
 * ==========================================
 * 5. COMPANY INFO (PROFILES)
 * ==========================================
 */

export async function fetchCompanyProfiles() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const fetchPromise = supabase.from("company_info").select("*");
      const { data, error } = await withTimeout<any>(fetchPromise, 20000);
      if (!error && data && data.length > 0) {
        return data.map((b: any) => ({
          id: b.id,
          title: b.title,
          content: b.content,
          lastUpdated: b.last_updated || b.lastupdated || b.lastUpdated || new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error("Error fetching company profiles in lib/db.ts:", err);
    }
  }
  return DEFAULT_COMPANY_PROFILES;
}

export async function upsertCompanyProfile(profile: any) {
  const camel = {
    id: profile.id,
    title: profile.title,
    content: profile.content,
    lastUpdated: profile.lastUpdated
  };

  const lower = {
    id: profile.id,
    title: profile.title,
    content: profile.content,
    lastupdated: profile.lastUpdated
  };

  const snake = {
    id: profile.id,
    title: profile.title,
    content: profile.content,
    last_updated: profile.lastUpdated
  };

  await robustUpsert("company_info", { camel, lower, snake });
}

/**
 * ==========================================
 * 6. VALAS (FOREX RATES)
 * ==========================================
 */

export async function fetchValasRates() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const fetchPromise = supabase.from("valas_rates").select("*");
      const { data, error } = await withTimeout<any>(fetchPromise, 20000);
      if (!error && data && data.length > 0) {
        return data.map(b => ({
    code: b.code,
    currency_name: b.currency_name,
    rate: Number(b.rate),
    changePercent: Number(b.change_percent || 0),
    updatedAt: b.updated_at
}));
      }
    } catch (err) {
      console.error("Error fetching valas rates in lib/db.ts:", err);
    }
  }
  return null;
}

export async function upsertValasRates(rates: any[]) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured on the backend.");
  
  const payload = rates.map(r => ({
    code: r.code,
    currency_name: r.currency_name ?? "",
    rate: Number(r.rate),
    change_percent: Number(
        r.change_percent ??
        r.changePercent ??
        r.change ??
        0
    ),
    updated_at: new Date().toISOString()
}));

  const { error } = await supabase.from("valas_rates").upsert(payload, { onConflict: "code" });
  if (error) throw error;
}
