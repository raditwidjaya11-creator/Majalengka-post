import { Article } from "../types";
import { slugify } from "./slugify";

/**
 * Request permission for browser/PWA notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("Browser ini tidak mendukung notifikasi.");
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Izin notifikasi diberikan!");
      return true;
    } else {
      console.warn("Izin notifikasi ditolak:", permission);
      return false;
    }
  } catch (err) {
    console.error("Gagal meminta izin notifikasi:", err);
    return false;
  }
}

/**
 * Check if notifications are supported and allowed
 */
export function getNotificationPermissionStatus(): "default" | "granted" | "denied" | "unsupported" {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * Trigger a native push notification for a newly published article
 */
export async function showNewArticleNotification(article: Article) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    console.log("Notification not shown: Permission not granted or unsupported");
    return;
  }

  const title = `Majalengka Post: Berita Baru!`;
  const targetUrl = `/artikel/${slugify(article.title)}`;
  const options = {
    body: `[${article.category}] ${article.location}: ${article.title}`,
    icon: "/favicon.png",
    badge: "/favicon.png",
    tag: `article-${article.id}`,
    requireInteraction: true,
    vibrate: [100, 50, 100],
    data: {
      url: targetUrl
    }
  };

  try {
    // Prefer showing via Service Worker registration (works on mobile/PWA in background)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, options);
      console.log("PWA Service Worker notification triggered for:", article.title);
    } else {
      new Notification(title, options);
      console.log("Local/Legacy notification triggered for:", article.title);
    }
  } catch (err) {
    console.warn("Failed to show via Service Worker, fallback to legacy Notification API:", err);
    try {
      new Notification(title, options);
    } catch (e) {
      console.error("Fallback legacy notification also failed:", e);
    }
  }
}
