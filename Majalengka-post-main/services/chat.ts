import { generateContentWithFallback } from "../lib/gemini.js";
import { fetchArticles } from "../lib/db.js";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export async function runChatAI(messages: ChatMessage[]) {
  if (!messages || messages.length === 0) {
    throw new Error("Messages are required.");
  }

  // 1. Fetch latest articles to inject as context
  let articlesContext = "";
  try {
    const articles = await fetchArticles();
    if (articles && articles.length > 0) {
      const topArticles = articles.slice(0, 10);
      articlesContext = topArticles
        .map(
          (art: any, i: number) =>
            `${i + 1}. [${art.category}] ${art.title} (${art.location || "Majalengka"}, ${art.time || "Baru saja"})\n   Ringkasan: ${art.excerpt || art.title}`
        )
        .join("\n");
    }
  } catch (err) {
    console.warn("Failed to fetch articles for chat context:", err);
  }

  // 2. Build system instruction
  const systemInstruction = `Anda adalah "Tanya AI", asisten kecerdasan buatan super cerdas, interaktif, dan bersahabat yang terintegrasi langsung di portal berita Majalengka Post.

TUGAS ANDA:
- Berdiskusi secara interaktif dengan pembaca portal mengenai berita-berita terkini, tren lokal Majalengka, Jawa Barat, maupun topik umum.
- Berikan informasi yang akurat, obyektif, ramah, dan optimis dalam Bahasa Indonesia yang alami dan santun.
- Gunakan data berita terkini dari portal Majalengka Post di bawah ini apabila ditanyakan tentang berita terbaru, topik hangat, atau rekomendasi bacaan.
- Bantu pembaca merangkum berita, menjelaskan konteks isu lokal, atau memberikan rekomendasi berita berdasarkan minat mereka.
- Apabila pembaca bertanya di luar topik berita atau Majalengka, Anda tetap diperbolehkan menjawab secara umum namun arahkan kembali dengan cara yang ramah agar tetap relevan dengan suasana portal berita lokal.

DAFTAR BERITA TERBARU DI MAJALENGKA POST SAAT INI:
${articlesContext || "Tidak ada berita terbaru yang dapat dimuat saat ini."}

SAY hello and welcome warmly, gunakan gaya bahasa kasual profesional yang sangat bersahabat khas Jawa Barat (namun tetap ramah nasional).`;

  // 3. Map messages to Gemini API format
  // Gemini expects roles: 'user' and 'model'
  const contents = messages.map((m) => ({
    role: m.sender === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  try {
    const response = await generateContentWithFallback(contents, {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    });

    const responseText = response.text || "";
    return { result: responseText, source: "gemini-ai" };
  } catch (err: any) {
    console.error("Gemini API in runChatAI failed, using editorial chatbot fallback:", err);

    // High quality editorial chatbot fallback responses based on the last user message
    const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
    let fallbackText = "Halo! Saya adalah Tanya AI dari Majalengka Post. Ada yang bisa saya bantu hari ini mengenai info seputar Majalengka?";

    if (lastUserMessage.includes("berita") || lastUserMessage.includes("kabar") || lastUserMessage.includes("terbaru")) {
      fallbackText = "Tentu! Saat ini berita terhangat di Majalengka Post meliputi rencana pembangunan infrastruktur baru, perkembangan pariwisata Terasering Panyaweuyan, dan kegiatan sosial kemasyarakatan di pusat kota Majalengka. Anda bisa melihat daftar lengkapnya di tab Beranda!";
    } else if (lastUserMessage.includes("wisata") || lastUserMessage.includes("jalan") || lastUserMessage.includes("pelesir")) {
      fallbackText = "Majalengka memiliki banyak destinasi eksotis! Tempat yang sangat populer di antaranya adalah Terasering Panyaweuyan Argapura yang hijau memukau, Situ Cipanten yang airnya jernih kebiruan, dan Curug Muara Jaya untuk pencinta alam. Ada yang ingin Anda tanyakan lebih spesifik tentang salah satu tempat ini?";
    } else if (lastUserMessage.includes("halo") || lastUserMessage.includes("hai") || lastUserMessage.includes("pagi") || lastUserMessage.includes("siang") || lastUserMessage.includes("sore") || lastUserMessage.includes("malam")) {
      fallbackText = "Sampurasun! Halo pembaca setia Majalengka Post. Saya Tanya AI, siap menemani Anda berdiskusi seputar berita terbaru dan info menarik dari Majalengka Bumi Sindangkasih. Apa yang ingin Anda ketahui hari ini?";
    } else if (lastUserMessage.includes("ringkas") || lastUserMessage.includes("rangkum")) {
      fallbackText = "Tentu! Berikan saya potongan teks berita atau judul berita yang ingin diringkas, saya akan merangkum poin-poin pentingnya dengan padat dan jelas untuk Anda.";
    }

    return { result: fallbackText, source: "mock-chat-engine" };
  }
}
