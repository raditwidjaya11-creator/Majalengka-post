/**
 * Safely parses and formats YouTube URLs into embeddable YouTube URLs.
 * Eliminates X-Frame-Options "sameorigin" errors caused by passing non-embed URLs to iframes.
 */
export function getYouTubeEmbedUrl(rawUrl: string, isMuted: boolean = true): string {
  const defaultFallback = `https://www.youtube-nocookie.com/embed/live_stream?channel=UCz3A9S7AecK9BTh40S77Dug&autoplay=1&mute=${isMuted ? 1 : 0}&enablejsapi=1`;

  if (!rawUrl || typeof rawUrl !== "string") {
    return defaultFallback;
  }

  const url = rawUrl.trim();
  const muteVal = isMuted ? 1 : 0;

  // Case 1: Already an embed URL (e.g., https://www.youtube.com/embed/... or youtube-nocookie.com/embed/...)
  if (url.includes("/embed/")) {
    let embedUrl = url.replace("www.youtube.com", "www.youtube-nocookie.com");
    if (!embedUrl.startsWith("http://") && !embedUrl.startsWith("https://")) {
      embedUrl = `https://${embedUrl}`;
    }
    
    // Replace or append mute parameter
    if (/mute=[01]/.test(embedUrl)) {
      embedUrl = embedUrl.replace(/mute=[01]/, `mute=${muteVal}`);
    } else {
      const sep = embedUrl.includes("?") ? "&" : "?";
      embedUrl += `${sep}mute=${muteVal}`;
    }

    if (!embedUrl.includes("autoplay=")) {
      const sep = embedUrl.includes("?") ? "&" : "?";
      embedUrl += `${sep}autoplay=1`;
    }
    if (!embedUrl.includes("enablejsapi=")) {
      const sep = embedUrl.includes("?") ? "&" : "?";
      embedUrl += `${sep}enablejsapi=1`;
    }
    return embedUrl;
  }

  // Case 2: Extract video ID from common YouTube URL formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/live/VIDEO_ID
  // - https://www.youtube.com/v/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const videoIdPatterns = [
    /(?:youtube\.com\/(?:watch\?.*v=|live\/|v\/|shorts\/)|youtu\.be\/)([^#&?\/]{8,12})/,
    /[?&]v=([^#&?\/]{8,12})/
  ];

  for (const pattern of videoIdPatterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length >= 8) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&mute=${muteVal}&enablejsapi=1&rel=0`;
    }
  }

  // Case 3: YouTube channel live URL (e.g., https://www.youtube.com/channel/UCz3A9S7AecK9BTh40S77Dug)
  const channelMatch = url.match(/youtube\.com\/channel\/([^#&?\/]+)/);
  if (channelMatch && channelMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelMatch[1]}&autoplay=1&mute=${muteVal}&enablejsapi=1`;
  }

  // Case 4: Default fallback if user entered root URL "https://www.youtube.com" or invalid string
  return defaultFallback;
}
