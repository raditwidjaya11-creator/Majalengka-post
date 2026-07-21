import { createClient } from "@supabase/supabase-js";
import { INITIAL_ARTICLES } from "../lib/mockData.js";
import { generateContentWithFallback, getGeminiClient } from "../lib/gemini.js";

// Helper function to get Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (supabaseUrl && supabaseAnonKey) {
    try {
      return createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
      console.error("[News Digest API] Error creating Supabase client:", err);
      return null;
    }
  }
  return null;
}

export default async function handler(req: any, res: any) {
  console.log("[API LOG] GET /api/news-digest called");
  
  let articles: any[] = [];
  let isFromSupabase = false;
  let lastError: any = null;

  // 1. Fetch article data from Supabase with proper async/await, error handling, verifying response status, and retry logic
  const supabaseClient = getSupabaseClient();
  if (supabaseClient) {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[API LOG] Attempting to fetch articles from Supabase (Attempt ${attempt}/${maxRetries})...`);
        
        // Fetching articles using proper async/await
        const response = await supabaseClient
          .from("articles")
          .select("*")
          .order("date", { ascending: false });

        // Verifying response status and error from Supabase
        const { data, error, status, statusText } = response;
        
        if (error) {
          throw new Error(`Supabase returned error: ${error.message} (code: ${error.code})`);
        }

        if (status < 200 || status >= 300) {
          throw new Error(`Supabase HTTP status error: ${status} - ${statusText || "Unknown status text"}`);
        }

        if (!data) {
          throw new Error("Supabase response succeeded but data was empty/null.");
        }

        console.log(`[API LOG] Successfully fetched ${data.length} articles from Supabase with status ${status}`);
        
        // Parse JSON fields safely if they are strings
        articles = data.map((item: any) => ({
          ...item,
          galleryImages: typeof item.galleryImages === "string" ? JSON.parse(item.galleryImages) : (item.galleryImages || []),
          tags: typeof item.tags === "string" ? JSON.parse(item.tags) : (item.tags || []),
          bodyJson: typeof item.bodyJson === "string" ? JSON.parse(item.bodyJson) : item.bodyJson,
          gpsCoords: typeof item.gpsCoords === "string" ? JSON.parse(item.gpsCoords) : item.gpsCoords,
          seo: typeof item.seo === "string" ? JSON.parse(item.seo) : item.seo,
        }));
        
        isFromSupabase = true;
        break; // Success! Break the retry loop.
      } catch (err: any) {
        lastError = err;
        console.error(`[API LOG] Supabase fetch attempt ${attempt} failed:`, err.message || err);
        
        if (attempt < maxRetries) {
          const delay = attempt * 1000;
          console.log(`[API LOG] Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  } else {
    console.warn("[API LOG] Supabase is not configured. Falling back to local data.");
  }

  // 2. Wrap all parsing, fallback, and AI logic in a try/catch block to guarantee a clean JSON response and prevent any 500 errors
  try {
    // If Supabase fetch completely failed or was not configured, load from local INITIAL_ARTICLES
    if (articles.length === 0) {
      console.log("[API LOG] Using INITIAL_ARTICLES as fallback.");
      articles = INITIAL_ARTICLES;
    }

    // Determine the 24 hour window to find recent articles
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let recentArticles = articles.filter((art: any) => {
      try {
        const artDateStr = `${art.date}T${art.time || "00:00"}:00`;
        const artDate = new Date(artDateStr);
        return artDate >= twentyFourHoursAgo;
      } catch (e) {
        return false;
      }
    });

    // Sort recent articles by views count descending to get the "top" headlines
    recentArticles.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));

    // If we don't have at least 3 articles in the last 24 hours, fallback to the top 3 overall latest articles
    if (recentArticles.length < 3) {
      const sortedAll = [...articles].sort((a: any, b: any) => {
        try {
          const dStrA = a.date ? `${a.date}T${a.time || "00:00"}:00` : "";
          const dStrB = b.date ? `${b.date}T${b.time || "00:00"}:00` : "";
          const dateA = dStrA ? new Date(dStrA).getTime() : 0;
          const dateB = dStrB ? new Date(dStrB).getTime() : 0;
          const validA = isNaN(dateA) ? 0 : dateA;
          const validB = isNaN(dateB) ? 0 : dateB;
          return validB - validA;
        } catch {
          return 0;
        }
      });
      recentArticles = sortedAll.slice(0, 3);
    } else {
      recentArticles = recentArticles.slice(0, 3);
    }

    if (recentArticles.length === 0) {
      throw new Error("No articles available for generating the news digest.");
    }

    const cleanArticles = recentArticles.map((art: any) => ({
      id: art.id,
      title: art.title || "",
      subTitle: art.subTitle || "",
      summary: art.summary || "",
      coverImage: art.coverImage ? (art.coverImage.startsWith("data:") ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800" : art.coverImage) : "",
      date: art.date || "",
      time: art.time || "",
      category: art.category || "Berita",
      views: art.views || 0,
      slug: art.slug || art.id
    }));

    // 3. AI News Digest Generation using Gemini with proper error handling
    const aiClient = getGeminiClient();
    if (aiClient) {
      try {
        const articlesContext = recentArticles.map((art: any, index: number) => {
          return `Berita ${index + 1}:
Judul: ${art.title || ""}
Kategori: ${art.category || ""}
Ringkasan: ${art.summary || ""}
Konten: ${(art.content || "").replace(/<[^>]*>/g, '').slice(0, 400)}`;
        }).join("\n\n");

        const systemInstruction = `Anda adalah Redaktur Senior di Portal Berita Terpercaya 'Majalengka Post'.
Tugas Anda adalah membuat bulletin harian ringkas (Daily News Digest) bergaya push-notification atau newsletter email yang sangat menarik, profesional, dan informatif berdasarkan 3 berita utama hari ini.

Gunakan format output yang rapi dengan gaya bulletin harian yang dinamis, memiliki headline pembuka yang catchy, ringkasan singkat untuk masing-masing dari 3 berita tersebut dengan poin-poin yang mudah dipahami (bullet points), dan kalimat penutup yang mengajak pembaca membaca lebih lanjut di Majalengka Post.

Tulis dalam Bahasa Indonesia yang segar dan profesional, serta tambahkan emoji yang relevan untuk mempercantik tampilan bulletin.`;

        const prompt = `Berikut adalah 3 berita utama yang perlu Anda rangkum menjadi sebuah Daily News Digest:\n\n${articlesContext}`;

        const aiResponse = await generateContentWithFallback(
          prompt,
          {
            systemInstruction,
            temperature: 0.7,
          },
          ["gemini-3.5-flash", "gemini-3.1-flash-lite"]
        );

        if (aiResponse && aiResponse.text) {
          console.log("[API LOG] Gemini AI bulletin generated successfully.");
          return res.status(200).json({
            success: true,
            bulletin: aiResponse.text,
            articles: cleanArticles,
            source: "gemini-ai",
            isFromSupabase,
            generatedAt: new Date().toISOString()
          });
        }
      } catch (aiErr: any) {
        console.error("[API LOG] Gemini generation failed, switching to local template formatting:", aiErr.message || aiErr);
      }
    }

    // 4. Clean formatting fallback if Gemini is unavailable or failed
    console.log("[API LOG] Using highly polished offline news digest generator.");
    const formattedDate = new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const fallbackBulletin = `📢 *MAJALENGKA POST DAILY BULLETIN* 📰\n` +
      `Edisi Hari Ini: ${formattedDate}\n\n` +
      `Halo pembaca setia! Berikut adalah rangkuman 3 berita terpopuler hari ini:\n\n` +
      recentArticles.map((art: any, idx: number) => {
        const icon = idx === 0 ? "🔥" : idx === 1 ? "📍" : "💼";
        return `${icon} *${idx + 1}. ${art.title}*\n${art.summary || "Rangkuman berita harian dari redaksi Majalengka Post."}\n_Kategori: ${art.category || "Berita"}_`;
      }).join("\n\n") +
      `\n\n✨ *Cepat, Akurat, Terpercaya!* Baca selengkapnya langsung di portal berita Majalengka Post.`;

    return res.status(200).json({
      success: true,
      bulletin: fallbackBulletin,
      articles: cleanArticles,
      source: "local-fallback",
      isFromSupabase,
      generatedAt: new Date().toISOString(),
      ...(lastError ? { fetchError: lastError.message } : {})
    });

  } catch (handlerErr: any) {
    console.error("[API LOG] Critical error inside news-digest handler try-catch block:", handlerErr);
    
    // Absolute safety-net fallback to prevent ANY 500 error and guarantee JSON response status 200
    return res.status(200).json({
      success: true,
      bulletin: `📢 *MAJALENGKA POST DAILY BULLETIN* 📰\n\nSelamat pagi pembaca setia! Layanan digest kami sedang dalam pemeliharaan berkala. Silakan kembali beberapa saat lagi untuk mendapatkan rangkuman berita terpopuler hari ini.\n\nTetap update bersama Majalengka Post!`,
      articles: [],
      source: "hardcoded-emergency-safety-net",
      isFromSupabase,
      generatedAt: new Date().toISOString(),
      error: handlerErr.message || "Unknown execution error"
    });
  }
}
