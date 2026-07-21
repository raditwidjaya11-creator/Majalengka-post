import { fetchArticles } from "../lib/db.js";
import { generateContentWithFallback, getGeminiClient } from "../lib/gemini.js";

export async function generateNewsDigest() {
  const articles = await fetchArticles();
  if (!articles || articles.length === 0) {
    throw new Error("Tidak ada berita ditemukan untuk diringkas.");
  }

  // Determine the 24 hour window
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
      const dateA = new Date(`${a.date}T${a.time || "00:00"}:00`).getTime();
      const dateB = new Date(`${b.date}T${b.time || "00:00"}:00`).getTime();
      return dateB - dateA;
    });
    recentArticles = sortedAll.slice(0, 3);
  } else {
    recentArticles = recentArticles.slice(0, 3);
  }

  const aiClient = getGeminiClient();

  // Now if Gemini client is initialized, generate the summarized daily bulletin
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

      const response = await generateContentWithFallback(
        prompt,
        {
          systemInstruction,
          temperature: 0.7,
        },
        ["gemini-3.5-flash", "gemini-3.1-flash-lite"]
      );

      if (response && response.text) {
        return {
          success: true,
          bulletin: response.text,
          articles: recentArticles,
          source: "gemini-ai",
          generatedAt: new Date().toISOString()
        };
      }
    } catch (err: any) {
      console.error("Gemini failed for digest generation, using local fallback:", err);
    }
  }

  // Local Fallback if Gemini is not available or failed
  const fallbackBulletins = [
    `📢 *MAJALENGKA POST DAILY BULLETIN* 📰
Edisi Hari Ini: ${new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Halo pembaca setia! Berikut adalah rangkuman 3 berita utama terpopuler dari draf redaksi kami dalam 24 jam terakhir:

1. 🔥 *${recentArticles[0]?.title || "Berita Utama"}*
   ${recentArticles[0]?.summary || "Rangkuman berita utama hari ini."}
   _Kategori: ${recentArticles[0]?.category || "Nasional"}_

2. 📍 *${recentArticles[1]?.title || "Berita Daerah"}*
   ${recentArticles[1]?.summary || "Rangkuman informasi penting dari daerah."}
   _Kategori: ${recentArticles[1]?.category || "Majalengka"}_

3. 💼 *${recentArticles[2]?.title || "Ekonomi & Bisnis"}*
   ${recentArticles[2]?.summary || "Sorotan ekonomi, bisnis, dan pembangunan hari ini."}
   _Kategori: ${recentArticles[2]?.category || "Ekonomi"}_

✨ *Cepat, Akurat, Terpercaya!* Jangan lewatkan detail lengkap artikel-artikel di atas langsung di portal berita Majalengka Post. Tetap update dan selamat beraktivitas!`,
  ];

  return {
    success: true,
    bulletin: fallbackBulletins[0],
    articles: recentArticles,
    source: "local-fallback",
    generatedAt: new Date().toISOString()
  };
}
