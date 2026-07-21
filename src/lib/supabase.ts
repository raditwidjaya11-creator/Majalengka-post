import { createClient } from "@supabase/supabase-js";
import { Article, AdBanner, MediaItem, Poll, ValasRate } from "../types";
import { CompanyProfilePage } from "../components/CompanyProfile";

const isValidUrl = (str: string) => {
  if (!str) return false;
  if (str === "null" || str === "undefined") return false;
  try {
    const parsed = new URL(str);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
};

const getSupabaseEnv = () => {
  return {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseEnv();

const dummyUrl = "https://placeholder-project-id.supabase.co";
const dummyKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.placeholder";

const hasValidSupabaseUrl = supabaseUrl && isValidUrl(supabaseUrl);
export let isSupabaseConfigured = !!(hasValidSupabaseUrl && supabaseAnonKey);

export function getIsSupabaseConfigured(): boolean {
  return isSupabaseConfigured;
}

export let supabase: any;
try {
  supabase = createClient(
    hasValidSupabaseUrl ? supabaseUrl : dummyUrl,
    (hasValidSupabaseUrl && supabaseAnonKey) ? supabaseAnonKey : dummyKey
  );
} catch (e) {
  supabase = createClient(dummyUrl, dummyKey);
}

export function initializeSupabase(url: string, key: string): boolean {
  if (url && isValidUrl(url) && key) {
    try {
      supabase = createClient(url, key);
      isSupabaseConfigured = true;
      return true;
    } catch (err) {
      console.error("Failed to initialize Supabase client dynamically:", err);
      return false;
    }
  }
  return false;
}

export function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const message = error.message?.toLowerCase() || "";
  const code = error.code || "";
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("could not find the table")
  );
}

/**
 * ==========================================
 * 1. ARTICLES SERVICES (PROXIED)
 * ==========================================
 */

export async function fetchArticlesFromSupabase(): Promise<Article[]> {
  const res = await fetch("/api/articles");
  if (!res.ok) throw new Error("Gagal mengambil data artikel");
  const data = await res.json();
  return data.articles || [];
}

export async function upsertArticlesToSupabase(articles: Article[]): Promise<void> {
  const res = await fetch("/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ articles })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menyimpan data artikel");
  }
}

export async function deleteArticleFromSupabase(id: string): Promise<void> {
  const res = await fetch("/api/articles/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menghapus artikel");
  }
}

/**
 * ==========================================
 * 2. BANNERS SERVICES (PROXIED)
 * ==========================================
 */

export async function fetchBannersFromSupabase(): Promise<AdBanner[]> {
  const res = await fetch("/api/banners");
  if (!res.ok) throw new Error("Gagal mengambil data banner");
  const data = await res.json();
  return data.banners || [];
}

export async function upsertBannersToSupabase(banners: AdBanner[]): Promise<void> {
  const res = await fetch("/api/banners", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ banners })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menyimpan data banner");
  }
}

export async function deleteBannerFromSupabase(id: string): Promise<void> {
  const res = await fetch("/api/banners/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menghapus banner");
  }
}

/**
 * ==========================================
 * 3. MEDIA ITEMS SERVICES (PROXIED)
 * ==========================================
 */

export async function fetchMediaFromSupabase(): Promise<MediaItem[]> {
  const res = await fetch("/api/media");
  if (!res.ok) throw new Error("Gagal mengambil data media");
  const data = await res.json();
  return data.media || [];
}

export async function upsertMediaToSupabase(media: MediaItem[]): Promise<void> {
  const res = await fetch("/api/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ media })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menyimpan data media");
  }
}

export async function deleteMediaFromSupabase(id: string): Promise<void> {
  const res = await fetch("/api/media/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menghapus media");
  }
}

/**
 * ==========================================
 * 4. POLLS SERVICES (PROXIED)
 * ==========================================
 */

export async function fetchPollFromSupabase(): Promise<Poll | null> {
  const res = await fetch("/api/polls");
  if (!res.ok) throw new Error("Gagal mengambil data jajak pendapat");
  const data = await res.json();
  return data.poll || null;
}

export async function upsertPollToSupabase(poll: Poll): Promise<void> {
  const res = await fetch("/api/polls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poll })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menyimpan data jajak pendapat");
  }
}

/**
 * ==========================================
 * 5. VALAS RATES SERVICES (PROXIED)
 * ==========================================
 */

export async function fetchValasRatesFromSupabase(): Promise<ValasRate[]> {
  const res = await fetch("/api/valas/latest");
  if (!res.ok) throw new Error("Gagal mengambil data kurs valas");
  const data = await res.json();
  return data.rates || [];
}

export async function upsertValasRatesToSupabase(rates: ValasRate[]): Promise<void> {
  const res = await fetch("/api/valas/rates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rates })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menyimpan kurs valas");
  }
}

/**
 * ==========================================
 * 6. COMPANY PROFILE SERVICES (PROXIED)
 * ==========================================
 */

export async function fetchCompanyInfoFromSupabase(): Promise<CompanyProfilePage[]> {
  const res = await fetch("/api/company-info");
  if (!res.ok) throw new Error("Gagal mengambil profil perusahaan");
  const data = await res.json();
  return data.profiles || [];
}

export async function upsertCompanyInfoItemToSupabase(profile: CompanyProfilePage): Promise<void> {
  const res = await fetch("/api/company-info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal menyimpan profil perusahaan");
  }
}

/**
 * ==========================================
 * 7. FILE STORAGE (LOCAL BASE64 FALLBACK PREFERRED FOR RELIABILITY)
 * ==========================================
 */

export async function uploadFileToSupabaseStorage(file: File, bucketName: string = "media"): Promise<string> {
  if (!isSupabaseConfigured) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to convert image to Base64"));
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      if (error.message?.includes("does not exist") || error.message?.includes("not found")) {
        try {
          const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
          });
          if (!bucketError) {
            const { data: retryData, error: retryError } = await supabase.storage
              .from(bucketName)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
              });
            if (!retryError && retryData) {
              const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
              return publicUrlData.publicUrl;
            }
          }
        } catch (bucketCreateErr) {
          console.warn("Could not create storage bucket, falling back to Base64:", bucketCreateErr);
        }
      }
      throw error;
    }

    if (data) {
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return publicUrlData.publicUrl;
    }
    throw new Error("No data returned from storage upload");
  } catch (err) {
    console.warn("Supabase storage upload failed, falling back to Base64:", err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to convert image to Base64"));
      reader.readAsDataURL(file);
    });
  }
}

export const SUPABASE_SQL_SCHEMA = `
-- MAJALENGKA POST - DATABASE SCHEMA MIGRATION SQL FOR SUPABASE POSTGRESQL
-- Copy and run this script inside your Supabase SQL Editor to initialize all tables and policies.

-- 1. Table: articles
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "subTitle" TEXT,
  summary TEXT,
  content TEXT,
  "bodyJson" JSONB,
  "coverImage" TEXT,
  "galleryImages" JSONB,
  "videoUrl" TEXT,
  "audioUrl" TEXT,
  author TEXT,
  editor TEXT,
  photographer TEXT,
  videographer TEXT,
  date TEXT,
  time TEXT,
  location TEXT,
  "gpsCoords" JSONB,
  category TEXT,
  "subCategory" TEXT,
  tags JSONB,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  "isBreaking" BOOLEAN DEFAULT false,
  "isHeadline" BOOLEAN DEFAULT false,
  "isTrending" BOOLEAN DEFAULT false,
  "isEditorialChoice" BOOLEAN DEFAULT false,
  "isFeatured" BOOLEAN DEFAULT false,
  "isSticky" BOOLEAN DEFAULT false,
  status TEXT,
  "scheduledPublish" TEXT,
  seo JSONB
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON articles;
DROP POLICY IF EXISTS "Allow public write" ON articles;
CREATE POLICY "Allow public read" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON articles FOR ALL USING (true);

-- 2. Table: banners
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  position TEXT,
  type TEXT,
  "adUrl" TEXT,
  "imageUrl" TEXT,
  "htmlContent" TEXT,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON banners;
DROP POLICY IF EXISTS "Allow public write" ON banners;
CREATE POLICY "Allow public read" ON banners FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON banners FOR ALL USING (true);

-- 3. Table: media_items
CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  url TEXT,
  size TEXT,
  folder TEXT,
  tags JSONB,
  created_at TEXT
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON media_items;
DROP POLICY IF EXISTS "Allow public write" ON media_items;
CREATE POLICY "Allow public read" ON media_items FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON media_items FOR ALL USING (true);

-- 4. Table: polls
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB,
  "totalVotes" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON polls;
DROP POLICY IF EXISTS "Allow public write" ON polls;
CREATE POLICY "Allow public read" ON polls FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON polls FOR ALL USING (true);

-- 5. Table: valas_rates
CREATE TABLE IF NOT EXISTS valas_rates (
  code TEXT PRIMARY KEY,
  rate TEXT NOT NULL,
  change TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE valas_rates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON valas_rates;
DROP POLICY IF EXISTS "Allow public write" ON valas_rates;
CREATE POLICY "Allow public read" ON valas_rates FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON valas_rates FOR ALL USING (true);

-- 6. Table: company_info
CREATE TABLE IF NOT EXISTS company_info (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  last_updated TEXT
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON company_info;
DROP POLICY IF EXISTS "Allow public write" ON company_info;
CREATE POLICY "Allow public read" ON company_info FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON company_info FOR ALL USING (true);
`;
