import { generateContentWithFallback, getGeminiClient } from "../lib/gemini.js";

export async function moderateComment(commentText: string) {
  if (!commentText) {
    throw new Error("Comment text is required.");
  }

  // Guidelines for auto-moderation
  const systemInstruction = `Anda adalah sistem moderasi otomatis AI untuk Portal Berita Majalengka Post.
Tugas Anda adalah menilai apakah sebuah komentar pembaca mengandung unsur: SARA, ujaran kebencian (hate speech), kata-kata kasar/kotor, bullying, spam, atau promosi ilegal.
Keluarkan output dalam format JSON berisi:
- 'approved': boolean (true jika komentar bersih, false jika melanggar)
- 'reason': string (alasan jika ditolak, kosongkan atau isi 'Lolos Moderasi' jika disetujui)
- 'sentiment': string ('positive', 'neutral', atau 'negative')`;

  const aiClient = getGeminiClient();

  if (aiClient) {
    try {
      const response = await generateContentWithFallback(
        `Analisis komentar berikut:\n\n"${commentText}"`,
        {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
        }
      );

      const parsed = JSON.parse(response.text || "{}");
      return {
        approved: parsed.approved !== undefined ? parsed.approved : true,
        reason: parsed.reason || "Lolos Moderasi",
        sentiment: parsed.sentiment || "neutral",
        source: "gemini-moderator"
      };
    } catch (err: any) {
      console.log("Gemini Moderation API is currently busy or under high load. Switching to local comment moderation rules.");
    }
  }

  // Local fallback pattern analyzer
  const toxicKeywords = ["tolol", "goblok", "anjing", "babi", "bangsat", "kadrun", "cebong", "cina", "anjing", "kasar", "mampus", "mati aja", "hoax", "bodoh", "setan", "brengsek"];
  const containsToxic = toxicKeywords.some(word => commentText.toLowerCase().includes(word));

  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  if (commentText.toLowerCase().includes("bagus") || commentText.toLowerCase().includes("mantap") || commentText.toLowerCase().includes("keren") || commentText.toLowerCase().includes("setuju")) {
    sentiment = "positive";
  } else if (containsToxic || commentText.toLowerCase().includes("buruk") || commentText.toLowerCase().includes("kecewa") || commentText.toLowerCase().includes("payah")) {
    sentiment = "negative";
  }

  return {
    approved: !containsToxic,
    reason: containsToxic ? "Komentar dideteksi mengandung kata-kata tidak sopan atau melanggar pedoman komunitas." : "Lolos Moderasi",
    sentiment: sentiment,
    source: "mock-moderator-rules"
  };
}
