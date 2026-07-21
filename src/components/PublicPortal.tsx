import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Play, Pause, Volume2, Bookmark, Heart, Share2, Printer, FileText, 
  ZoomIn, ZoomOut, Send, AlertTriangle, ChevronRight, Eye, MessageSquare, 
  MapPin, Calendar, Clock, Award, Check, RefreshCw, Smartphone, Radio, 
  Sliders, Globe, Search, BookOpen, TrendingUp, TrendingDown, ArrowUpRight, 
  ArrowDownRight, Activity, DollarSign, Coins, QrCode, Bell, HelpCircle, 
  Shield, CreditCard, ChevronDown, CheckCircle2, Copy, Share,
  Facebook, Instagram, Linkedin, Mail, MessageCircle, Twitter, X,
  Sparkles, Newspaper
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Article, Comment, AdBanner, Poll, ValasRate } from "../types";
import { CATEGORIES, SHOLAT_SCHEDULE, CURRENCY_RATES, STOCK_MARKET, INITIAL_COMMENTS } from "../mockData";
import { slugify } from "../utils/slugify";

interface PublicPortalProps {
  articles: Article[];
  banners: AdBanner[];
  onUpdateBanner?: (banner: AdBanner) => void;
  valasRates?: ValasRate[];
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  selectedArticle: Article | null;
  onSelectArticle: (article: Article | null) => void;
  activePoll: Poll;
  onVotePoll: (optionId: string) => void;
}

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function PublicPortal({
  articles,
  banners,
  onUpdateBanner,
  valasRates,
  currentCategory,
  onSelectCategory,
  searchQuery,
  selectedArticle,
  onSelectArticle,
  activePoll,
  onVotePoll,
}: PublicPortalProps) {
  
  // Helper for safe window origin detection inside iframes
  const getSiteOrigin = () => {
    try {
      if (window.location.origin && window.location.origin !== "null" && window.location.origin.startsWith("http")) {
        return window.location.origin;
      }
      if (typeof document !== "undefined" && document.referrer && document.referrer.startsWith("http")) {
        try {
          const refUrl = new URL(document.referrer);
          if (refUrl.origin && refUrl.origin !== "null") {
            return refUrl.origin;
          }
        } catch (err) {
          console.warn("Failed to parse referrer URL:", err);
        }
      }
      if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
        return window.location.ancestorOrigins[0];
      }
      const host = window.location.host;
      if (host && !host.includes("null")) {
        const protocol = window.location.protocol.startsWith("http") ? window.location.protocol : "https:";
        return `${protocol}//${host}`;
      }
      if (typeof window !== "undefined" && window.location && window.location.hostname) {
        const proto = window.location.protocol.startsWith("http") ? window.location.protocol : "https:";
        return `${proto}//${window.location.hostname}`;
      }
      return "https://ais-pre-pjdokbcks56pddl66e5xvv-725746559819.asia-southeast1.run.app";
    } catch (e) {
      return "https://ais-pre-pjdokbcks56pddl66e5xvv-725746559819.asia-southeast1.run.app";
    }
  };

  // States
  const [headlineIndex, setHeadlineIndex] = useState(0);
  
  // Floating Reactions State for Article view
  const [articleFloatingReactions, setArticleFloatingReactions] = useState<Array<{ id: number; emoji: string; left: number; rotate: number; scale: number }>>([]);
  const [showArticleEmojiPicker, setShowArticleEmojiPicker] = useState<boolean>(false);
  const [articleReactions, setArticleReactions] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const saved = localStorage.getItem("majalengka_article_reactions_v1");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleArticleReaction = (articleId: string, emoji: string) => {
    // 1. Increment reaction count in state
    setArticleReactions(prev => {
      const artRec = prev[articleId] || {};
      const newCount = (artRec[emoji] || 0) + 1;
      const updated = {
        ...prev,
        [articleId]: {
          ...artRec,
          [emoji]: newCount
        }
      };
      try {
        localStorage.setItem("majalengka_article_reactions_v1", JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to persist article reactions", err);
      }
      return updated;
    });

    // 2. Add floating reaction animation
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji: emoji,
      left: Math.floor(Math.random() * 60) + 20, // Keep in center-ish area (20% to 80%)
      rotate: Math.floor(Math.random() * 40) - 20, // -20deg to 20deg
      scale: parseFloat((Math.random() * 0.4 + 1.0).toFixed(2)) // 1.0 to 1.4
    };
    setArticleFloatingReactions(prev => [...prev, newReaction].slice(-25));
    setTimeout(() => {
      setArticleFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2400);
  };

  const [fontSizeClass, setFontSizeClass] = useState<"text-sm" | "text-base" | "text-lg" | "text-xl">("text-base");
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isModerating, setIsModerating] = useState(false);
  const [moderationFeedback, setModerationFeedback] = useState<string | null>(null);
  const [marketTab, setMarketTab] = useState<"all" | "valas" | "saham">("all");

  // Daily News Digest States
  const [digest, setDigest] = useState<{ bulletin: string; articles: Article[]; source: string; generatedAt?: string } | null>(null);
  const [isDigestLoading, setIsDigestLoading] = useState<boolean>(false);
  const [digestError, setDigestError] = useState<string | null>(null);

  const fetchDailyDigest = async () => {
    setIsDigestLoading(true);
    setDigestError(null);
    try {
      // Fetch news-digest directly
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch("/api/news-digest", { signal: controller.signal }).finally(() => clearTimeout(timeoutId));
      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }
      const data = await res.json();
      if (data && data.bulletin) {
        setDigest(data);
        return;
      }
      throw new Error("Invalid digest response");
    } catch (err: any) {
      console.warn("API news digest fallback triggered:", err?.message || err);
      // Fallback local digest using articles available in props
      const top3 = articles.slice(0, 3);
      const formattedDate = new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const localBulletin = `📢 *MAJALENGKA POST DAILY BULLETIN* 📰\nEdisi Hari Ini: ${formattedDate}\n\nBerikut Rangkuman 3 Berita Utama Hari Ini:\n\n` +
        top3.map((a, i) => `${i === 0 ? "🔥" : i === 1 ? "📍" : "💼"} *${i + 1}. ${a.title}*\n${a.summary || "Berita terkini dari redaksi Majalengka Post."}`).join("\n\n") +
        `\n\n✨ Baca selengkapnya langsung di portal berita Majalengka Post!`;
      
      setDigest({
        bulletin: localBulletin,
        articles: top3,
        source: "client-local-fallback"
      });
      setDigestError(null);
    } finally {
      setIsDigestLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyDigest();
  }, []);

  // Sharing Notification Toast
  const [showShareNotification, setShowShareNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowShareNotification(msg);
    setTimeout(() => {
      setShowShareNotification(prev => prev === msg ? null : prev);
    }, 4500);
  };
  const [canShare, setCanShare] = useState(false);

  // Instagram Share Kit modal states
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Audio Reader (TTS Web Speech) States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeech, setAudioSpeech] = useState<SpeechSynthesisUtterance | null>(null);

  // Dynamic Date States for Hijri & Gregorian
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (typeof navigator !== "undefined" && !!navigator.share) {
      setCanShare(true);
    }
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getGregorianDateString = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  const getHijriDateString = (date: Date) => {
    try {
      // Using Um Al-Qura calendar for high accuracy Islamic date
      const formatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      return formatter.format(date) + " H";
    } catch (e) {
      try {
        const formatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
        return formatter.format(date) + " H";
      } catch (err) {
        // Fallback for environment constraints
        return "26 Muharram 1448 H";
      }
    }
  };

  const gregorianDate = getGregorianDateString(currentDate);
  const hijriDate = getHijriDateString(currentDate);

  // Filtered Articles based on Category / Search
  const publishedArticles = articles.filter(a => a && a.status === "PUBLISHED");
  
  const filteredArticles = publishedArticles.filter(art => {
    const title = art.title || "";
    const summary = art.summary || "";
    const content = art.content || "";
    const tags = art.tags || [];
    const query = searchQuery ? searchQuery.toLowerCase() : "";

    if (currentCategory === "Video") {
      const hasVideo = !!art.videoUrl && art.videoUrl.trim() !== "";
      const matchesSearch = query === "" || 
        title.toLowerCase().includes(query) ||
        summary.toLowerCase().includes(query) ||
        content.toLowerCase().includes(query) ||
        tags.some(t => t && t.toLowerCase().includes(query));
      return hasVideo && matchesSearch;
    }
    const matchesCategory = currentCategory === "" || art.category === currentCategory || art.subCategory === currentCategory;
    const matchesSearch = query === "" || 
      title.toLowerCase().includes(query) ||
      summary.toLowerCase().includes(query) ||
      content.toLowerCase().includes(query) ||
      tags.some(t => t && t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const headlineArticles = publishedArticles.filter(a => a && a.isHeadline);
  const trendingArticles = publishedArticles.filter(a => a && a.isTrending);
  const latestArticles = [...publishedArticles].sort((a, b) => {
    const dateB = b.date || "";
    const dateA = a.date || "";
    const timeB = b.time || "";
    const timeA = a.time || "";
    return dateB.localeCompare(dateA) || timeB.localeCompare(timeA);
  });
  const editorialChoiceArticles = publishedArticles.filter(a => a && a.isEditorialChoice);

  // Auto-slide headlines
  useEffect(() => {
    if (headlineArticles.length <= 1) return;
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlineArticles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [headlineArticles]);

  // Audio Reader Controller
  const handleToggleAudio = (textToRead: string) => {
    if (!window.speechSynthesis) {
      triggerToast("Browser Anda tidak mendukung fitur Web Speech Synthesis.");
      return;
    }

    if (isPlayingAudio) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("Failed to cancel speech synthesis:", e);
      }
      setIsPlayingAudio(false);
    } else {
      // Remove HTML tags for speaking
      const plainText = textToRead.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      try {
        window.speechSynthesis.speak(utterance);
        setAudioSpeech(utterance);
        setIsPlayingAudio(true);
      } catch (e) {
        console.error("Failed to speak utterance:", e);
        triggerToast("Gagal memulai pembaca audio.");
        setIsPlayingAudio(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [selectedArticle]);

  // Liking & Bookmarking Local Toggles
  const handleToggleLike = (id: string) => {
    if (likedArticles.includes(id)) {
      setBookmarkedArticles(prev => prev.filter(aId => aId !== id));
      setLikedArticles(prev => prev.filter(aId => aId !== id));
    } else {
      setLikedArticles(prev => [...prev, id]);
    }
  };

  const handleToggleBookmark = (id: string) => {
    if (bookmarkedArticles.includes(id)) {
      setBookmarkedArticles(prev => prev.filter(aId => aId !== id));
    } else {
      setBookmarkedArticles(prev => [...prev, id]);
    }
  };

  // Submit Comment with AI Moderation
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim() || !selectedArticle) return;

    setIsModerating(true);
    setModerationFeedback(null);

    try {
      const response = await fetch("/api/gemini/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText: newCommentText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI comment moderation fetch error (status " + response.status + "):", errorText);
        throw new Error(`AI moderation call failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.approved) {
        const newComm: Comment = {
          id: `comm-${Date.now()}`,
          articleId: selectedArticle.id,
          user: newCommentName,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?q=80&w=150`,
          content: newCommentText,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          likes: 0,
          reported: false,
          sentiment: result.sentiment,
          isModerated: true,
          replies: []
        };

        setComments(prev => [newComm, ...prev]);
        setNewCommentText("");
        setModerationFeedback("✅ Komentar lolos moderasi AI.");
      } else {
        setModerationFeedback(`❌ Komentar Ditolak AI: ${result.reason}`);
      }
    } catch (err) {
      console.error(err);
      // Fallback
    } finally {
      setIsModerating(false);
    }
  };

  // Submit Comment Reply
  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim() || !selectedArticle) return;

    setIsModerating(true);
    try {
      const response = await fetch("/api/gemini/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText: replyText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI reply moderation fetch error (status " + response.status + "):", errorText);
        throw new Error(`AI moderation reply call failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.approved) {
        const newReply = {
          id: `reply-${Date.now()}`,
          articleId: selectedArticle.id,
          user: "Staf Redaksi (Simulasi)",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
          content: replyText,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          likes: 0,
          reported: false,
          isModerated: true,
          replies: []
        };

        setComments(prev => prev.map(comm => {
          if (comm.id === commentId) {
            return { ...comm, replies: [...comm.replies, newReply] };
          }
          return comm;
        }));

        setReplyText("");
        setReplyingToId(null);
      } else {
        triggerToast(`❌ Balasan Ditolak AI: ${result.reason}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModerating(false);
    }
  };

  // Simulated PDF Downloader
  const handleDownloadPDF = (article: Article) => {
    triggerToast(`Mengekspor artikel "${article.title}" ke dalam dokumen PDF...\n\nSistem berhasil merender template PDF jurnalistik nasional untuk diunduh.`);
  };

  const handleLogShare = async (platform: string) => {
    setShowShareNotification(`Pintasan berbagi ke ${platform} berhasil dibuka! Berita Majalengka Post siap didiseminasikan.`);
    setTimeout(() => setShowShareNotification(null), 4000);

    const article = selectedArticle || (headlineArticles && headlineArticles[headlineIndex]);
    if (article) {
      try {
        await fetch("/api/shares/increment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId: article.id, platform })
        });
      } catch (err) {
        console.warn("Failed to log share to backend:", err);
      }
    }
  };

  const handleShareSystem = async () => {
    if (!selectedArticle) return;
    const shareUrl = `${getSiteOrigin()}/artikel/${slugify(selectedArticle.title)}`;
    const imageUrl = selectedArticle.coverImage
      ? (selectedArticle.coverImage.startsWith("http")
        ? selectedArticle.coverImage
        : `${getSiteOrigin()}${selectedArticle.coverImage.startsWith("/") ? "" : "/"}${selectedArticle.coverImage}`)
      : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      // Base share data with title, text, and URL
      const shareData: ShareData = {
        title: selectedArticle.title,
        text: selectedArticle.summary || selectedArticle.title,
        url: shareUrl,
      };

      // Try to fetch and attach the cover image as a file if Web Share API files sharing is supported
      if (imageUrl) {
        try {
          const response = await fetch(imageUrl, { mode: "cors" });
          if (response.ok) {
            const blob = await response.blob();
            const extension = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
            const file = new File([blob], `cover.${extension}`, { type: blob.type || "image/jpeg" });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              shareData.files = [file];
            }
          }
        } catch (fileErr) {
          console.warn("Could not load image file for Web Share API, sharing title and url instead:", fileErr);
        }
      }

      try {
        await navigator.share(shareData);
        setShowShareNotification("Berita Majalengka Post berhasil dibagikan!");
        setTimeout(() => setShowShareNotification(null), 4000);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.warn("Native share error, falling back to copy:", err);
          fallbackCopy(shareUrl);
        }
      }
    } else {
      fallbackCopy(shareUrl);
    }
  };

  const fallbackCopy = (url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setShowShareNotification("Tautan berita berhasil disalin ke papan klip! Siap dibagikan ke media sosial.");
          setTimeout(() => setShowShareNotification(null), 4000);
        })
        .catch(err => {
          console.error("Failed to copy link:", err);
        });
    } else {
      triggerToast(`Salin tautan ini untuk berbagi: ${url}`);
    }
  };

  // Horizontal rotating banners logic
  const activeHeaderBanners = banners.filter(b => b.position === "header" && b.active);
  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);

  // Auto-rotate header banners
  useEffect(() => {
    if (activeHeaderBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeaderIndex(prev => (prev + 1) % activeHeaderBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeHeaderBanners.length]);

  // Track ad impressions/views
  useEffect(() => {
    if (activeHeaderBanners.length === 0 || !onUpdateBanner) return;
    const currentBanner = activeHeaderBanners[currentHeaderIndex];
    if (currentBanner) {
      const timer = setTimeout(() => {
        onUpdateBanner({
          ...currentBanner,
          views: (currentBanner.views || 0) + 1
        });
      }, 1000); // 1s threshold to count as a view
      return () => clearTimeout(timer);
    }
  }, [currentHeaderIndex, activeHeaderBanners.length]);

  // Handle click track
  const handleAdClick = (banner: AdBanner) => {
    if (onUpdateBanner) {
      onUpdateBanner({
        ...banner,
        clicks: (banner.clicks || 0) + 1
      });
    }
  };

  const sidebarBanner = banners.find(b => b.position === "sidebar" && b.active);
  const centerBanner = banners.find(b => b.position === "center" && b.active);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/*                    RESPONSIVE JOURNALISTIC NEWS PORTAL                    */}
      {/* ========================================================================= */}
      <div className="w-full border-none">
        
        {/* 1. Header Placement Advert (Rotating Horizontal Banner Carousel) */}
        {activeHeaderBanners.length > 0 && (
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm relative group">
            <AnimatePresence mode="wait">
              {activeHeaderBanners.map((banner, index) => {
                if (index !== currentHeaderIndex) return null;
                return (
                  <motion.div
                    key={banner.id}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.35 }}
                    className="w-full relative flex items-center h-[80px] sm:h-[100px] md:h-[120px]"
                  >
                    <a
                      href={banner.adUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleAdClick(banner)}
                      className="w-full h-full block"
                    >
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </a>
                    
                    {/* Advertisement Badge overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white px-2 py-0.5 rounded font-mono pointer-events-none uppercase tracking-wider">
                      Sponsor Ad
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Slide Indicators / Navigation Dots */}
            {activeHeaderBanners.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 px-2 py-1 rounded-full backdrop-blur-xs">
                {activeHeaderBanners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentHeaderIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentHeaderIndex 
                        ? "bg-red-500 w-3.5" 
                        : "bg-white/60 hover:bg-white"
                    }`}
                    title={`Lihat slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      {/* 2. Main Layout routing (Article Detail vs Homepage Grid) */}
      {selectedArticle ? (
        
        // ================= ARTICLE DETAIL PAGE =================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Helmet>
            <title>{selectedArticle.seo?.title || selectedArticle.title} | Majalengka Post</title>
            <meta name="description" content={selectedArticle.seo?.description || selectedArticle.summary || selectedArticle.subTitle || "Berita terpercaya dari Majalengka Post."} />
            <meta name="keywords" content={selectedArticle.seo?.keywords || (Array.isArray(selectedArticle.tags) ? selectedArticle.tags.join(", ") : "") || "majalengka, berita"} />
            <link rel="canonical" href={`${getSiteOrigin()}/artikel/${slugify(selectedArticle.title)}`} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="article" />
            <meta property="og:site_name" content="Majalengka Post" />
            <meta property="og:title" content={selectedArticle.seo?.title || selectedArticle.title} />
            <meta property="og:description" content={selectedArticle.seo?.description || selectedArticle.summary || selectedArticle.subTitle || "Berita terpercaya dari Majalengka Post."} />
            <meta property="og:image" content={selectedArticle.coverImage ? (selectedArticle.coverImage.startsWith("http") ? selectedArticle.coverImage : `${getSiteOrigin()}${selectedArticle.coverImage.startsWith("/") ? "" : "/"}${selectedArticle.coverImage}`) : `${getSiteOrigin()}/default-share.jpg`} />
            <meta property="og:url" content={`${getSiteOrigin()}/artikel/${slugify(selectedArticle.title)}`} />
            <meta property="og:locale" content="id_ID" />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={selectedArticle.seo?.title || selectedArticle.title} />
            <meta name="twitter:description" content={selectedArticle.seo?.description || selectedArticle.summary || selectedArticle.subTitle || "Berita terpercaya dari Majalengka Post."} />
            <meta name="twitter:image" content={selectedArticle.coverImage ? (selectedArticle.coverImage.startsWith("http") ? selectedArticle.coverImage : `${getSiteOrigin()}${selectedArticle.coverImage.startsWith("/") ? "" : "/"}${selectedArticle.coverImage}`) : `${getSiteOrigin()}/default-share.jpg`} />
          </Helmet>
          
          
          {/* Main Article column */}
          <article className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            
            {/* Back Button */}
            <button
              onClick={() => onSelectArticle(null)}
              className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-6 uppercase tracking-wider"
            >
              ← Kembali ke Beranda
            </button>

            {/* Category / Sub */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                {selectedArticle.category}
              </span>
              {selectedArticle.subCategory && (
                <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase">
                  / {selectedArticle.subCategory}
                </span>
              )}
            </div>

            {/* Title & Sub */}
            <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
              {selectedArticle.title}
            </h2>
            {selectedArticle.subTitle && (
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium mb-5 leading-relaxed border-l-2 border-red-500 pl-3">
                {selectedArticle.subTitle}
              </p>
            )}

            {/* Bylines metadata */}
            <div className="flex flex-wrap items-center justify-between border-y border-gray-100 dark:border-gray-800 py-3.5 mb-6 text-xs text-gray-400 gap-4">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span>Penulis: <strong>{selectedArticle.author}</strong></span>
                </span>
                <span className="flex items-center gap-1">
                  <span>Editor: <strong>{selectedArticle.editor}</strong></span>
                </span>
                {selectedArticle.photographer && (
                  <span className="flex items-center gap-1">
                    <span>Foto: <strong>{selectedArticle.photographer}</strong></span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedArticle.date}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedArticle.time} WIB</span>
                </span>
              </div>
            </div>

            {/* Floating toolbar controls */}
            <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl flex items-center justify-between gap-2 mb-6 border border-gray-100 dark:border-gray-850">
              
              {/* Font scaling and audio */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSizeClass(prev => prev === "text-sm" ? "text-base" : prev === "text-base" ? "text-lg" : prev === "text-lg" ? "text-xl" : "text-sm")}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900"
                  title="Sesuaikan Ukuran Huruf"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Ukuran Font</span>
                </button>

                <button
                  onClick={() => handleToggleAudio(selectedArticle.content)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    isPlayingAudio 
                      ? "bg-red-600 text-white animate-pulse" 
                      : "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  }`}
                  title="Dengarkan Berita Aloud (TTS)"
                >
                  {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? "Mendengarkan..." : "Baca Berita (Audio)"}</span>
                </button>

                <button
                  id="btn-bagikan-berita-toolbar"
                  onClick={handleShareSystem}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm hover:scale-[1.02]"
                  title="Bagikan Berita ini via Web Share API atau salin tautan"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan Berita</span>
                </button>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleLike(selectedArticle.id)}
                  className={`p-1.5 rounded border transition-colors ${
                    likedArticles.includes(selectedArticle.id)
                      ? "border-red-500 bg-red-50 text-red-500 dark:bg-red-950/40"
                      : "border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="Sukai Artikel"
                >
                  <Heart className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleBookmark(selectedArticle.id)}
                  className={`p-1.5 rounded border transition-colors ${
                    bookmarkedArticles.includes(selectedArticle.id)
                      ? "border-amber-500 bg-amber-50 text-amber-500 dark:bg-amber-950/40"
                      : "border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="Simpan Bookmark"
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  title="Cetak Artikel"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDownloadPDF(selectedArticle)}
                  className="p-1.5 rounded border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  title="Unduh PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cover image */}
            <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                className="w-full object-cover max-h-[460px]"
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center py-2 bg-gray-50 dark:bg-gray-950">
                Lokasi Liputan: {selectedArticle.location} — {selectedArticle.gpsCoords ? `GPS Coordinates: [${selectedArticle.gpsCoords.lat}, ${selectedArticle.gpsCoords.lng}]` : ""}
              </p>
            </div>

            {/* Content Body */}
            <div 
              className={`prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-base md:text-lg leading-[1.8] markdown-body`}
              style={{ lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />

            {/* Embedded YouTube video if exists */}
            {selectedArticle.videoUrl && (
              <div className="mt-8">
                <h4 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3">Liputan Video Terkait</h4>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <iframe
                    src={selectedArticle.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Photos Gallery if exists */}
            {selectedArticle.galleryImages && selectedArticle.galleryImages.length > 0 && (
              <div className="mt-8 border-t border-gray-150 dark:border-gray-850 pt-6">
                <h4 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3">Galeri Foto Kejadian</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedArticle.galleryImages.map((img, i) => (
                    <img key={i} src={img} alt={`Galeri ${i}`} className="rounded-lg object-cover w-full h-40 border border-gray-100 dark:border-gray-800" />
                  ))}
                </div>
              </div>
            )}

            {/* Tags section */}
            <div className="flex flex-wrap gap-1.5 mt-8 border-t border-gray-100 dark:border-gray-800 pt-5">
              {selectedArticle.tags && selectedArticle.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2.5 py-1 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* ================= READER REACTIONS SECTION ================= */}
            <div className="mt-8 pt-6 border-t border-gray-150 dark:border-gray-850/60 relative">
              <h4 className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-4 flex items-center gap-1.5 select-none">
                <span>🎭</span> REAKSI ANDA UNTUK ARTIKEL INI
              </h4>
              
              <div className="flex flex-wrap items-center gap-3 bg-gray-50 dark:bg-gray-950/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-850/60 relative z-10">
                
                {/* Fixed Reaction Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { emoji: "👍", label: "Setuju" },
                    { emoji: "❤️", label: "Suka" },
                    { emoji: "😂", label: "Lucu" },
                    { emoji: "🔥", label: "Mantap" },
                    { emoji: "😮", label: "Kaget" },
                    { emoji: "👏", label: "Salut" },
                    { emoji: "🎉", label: "Hore" },
                    { emoji: "😢", label: "Sedih" },
                  ].map(({ emoji, label }) => {
                    const count = (articleReactions[selectedArticle.id]?.[emoji] || 0);
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleArticleReaction(selectedArticle.id, emoji)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-full text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/10 hover:border-red-500/40 dark:hover:border-red-500/40 transition-all active:scale-95 group shadow-xs cursor-pointer text-gray-700 dark:text-gray-300"
                        title={label}
                      >
                        <span className="text-base group-hover:scale-125 transition-transform duration-200">{emoji}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-red-500 font-bold">{count > 0 ? count : ""}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Drop-up/Popup Emoji Picker Toggle */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowArticleEmojiPicker(!showArticleEmojiPicker)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-xs cursor-pointer ${
                      showArticleEmojiPicker
                        ? "bg-red-100 dark:bg-red-950/40 border-red-500/40 text-red-600 dark:text-red-400"
                        : "bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-red-500/30"
                    }`}
                    title="Pilih Emoji Lain"
                  >
                    <span>➕ Reaksi</span>
                  </button>

                  {/* Drop-up Emoji Picker Panel */}
                  {showArticleEmojiPicker && (
                    <div className="absolute bottom-full mb-3 left-0 sm:left-auto sm:right-0 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 shadow-2xl z-50 animate-fade-in text-left w-64">
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100 dark:border-gray-850">
                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Pilih Emoji Bebas</span>
                        <button 
                          type="button" 
                          onClick={() => setShowArticleEmojiPicker(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-[10px] font-bold cursor-pointer"
                        >
                          Tutup ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
                        {[
                          // Row 1
                          '😊', '🥰', '😍', '😘', '😜', '🤪', 
                          // Row 2
                          '🤔', '🤨', '🙄', '😬', '🤫', '😴', 
                          // Row 3
                          '😎', '😈', '👻', '💀', '👽', '👾', 
                          // Row 4
                          '👏', '🙌', '🙏', '💪', '💥', '✨',
                          // Row 5
                          '🎉', '💡', '💯', '🚀', '⭐', '🎈',
                          // Row 6
                          '🤯', '😭', '😡', '😱', '💩', '🤡'
                        ].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              handleArticleReaction(selectedArticle.id, emoji);
                              setShowArticleEmojiPicker(false);
                            }}
                            className="text-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-all flex items-center justify-center active:scale-95 hover:scale-110 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Floating Reactions Overlay inside relative article container */}
              <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-30 overflow-hidden select-none">
                {articleFloatingReactions.map((reaction) => (
                  <div
                    key={reaction.id}
                    className="absolute text-3xl article-reaction-item"
                    style={{
                      left: `${reaction.left}%`,
                      bottom: "40px",
                      "--rot": `${reaction.rotate}deg`,
                      transform: `scale(${reaction.scale})`,
                    } as React.CSSProperties}
                  >
                    {reaction.emoji}
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes articleReactionFloat {
                0% {
                  transform: translateY(0) scale(0.3) rotate(0deg);
                  opacity: 0;
                }
                10% {
                  transform: translateY(-20px) scale(1.3) rotate(var(--rot));
                  opacity: 1;
                }
                100% {
                  transform: translateY(-280px) scale(0.7) rotate(calc(var(--rot) * 1.5));
                  opacity: 0;
                }
              }
              .article-reaction-item {
                animation: articleReactionFloat 2.4s cubic-bezier(0.08, 0.82, 0.17, 1) forwards;
              }
            `}</style>

            {/* ================= SOCIAL SHARING BOX ================= */}
            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <h4 className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3.5 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                BAGIKAN LAPORAN BERITA NASIONAL INI
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {/* Bagikan Berita (Native Share) */}
                <button
                  type="button"
                  id="btn-bagikan-berita-social-box"
                  onClick={handleShareSystem}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/25 transition-all text-red-600 dark:text-red-400 hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm font-bold"
                  title="Bagikan Berita ini menggunakan fitur sistem handphone atau salin tautan"
                >
                  <Share2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                  <span>Bagikan Berita</span>
                </button>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`*${selectedArticle.title}*\n\n${selectedArticle.summary || ""}\n\nBaca selengkapnya di Majalengka Post:\n${getSiteOrigin()}/artikel/${slugify(selectedArticle.title)}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleLogShare("WhatsApp")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/25 transition-all text-[#25D366] hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm"
                  title="Bagikan ke WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getSiteOrigin() + "/artikel/" + slugify(selectedArticle.title))}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleLogShare("Facebook")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/25 transition-all text-[#1877F2] hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm"
                  title="Bagikan ke Facebook"
                >
                  <Facebook className="w-3 h-3 text-[#1877F2]" />
                  <span>Facebook</span>
                </a>

                {/* Instagram */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getSiteOrigin() + "/artikel/" + slugify(selectedArticle.title));
                    setIsInstagramModalOpen(true);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 3000);
                    handleLogShare("Instagram");
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#E4405F]/10 hover:bg-[#E4405F]/20 border border-[#E4405F]/25 transition-all text-[#E4405F] hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm"
                  title="Bagikan ke Instagram Stories"
                >
                  <Instagram className="w-3 h-3 text-[#E4405F]" />
                  <span>Instagram</span>
                </button>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${encodeURIComponent(getSiteOrigin() + "/artikel/" + slugify(selectedArticle.title))}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleLogShare("Twitter/X")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/15 transition-all text-black dark:text-white hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm"
                  title="Bagikan ke Twitter / X"
                >
                  <Twitter className="w-3 h-3" />
                  <span>Twitter / X</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getSiteOrigin() + "/artikel/" + slugify(selectedArticle.title))}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleLogShare("LinkedIn")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/25 transition-all text-[#0A66C2] hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm"
                  title="Bagikan ke LinkedIn"
                >
                  <Linkedin className="w-3 h-3 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(getSiteOrigin() + "/artikel/" + slugify(selectedArticle.title))}&text=${encodeURIComponent(selectedArticle.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleLogShare("Telegram")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/25 transition-all text-[#0088cc] hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm"
                  title="Bagikan ke Telegram"
                >
                  <Send className="w-3 h-3 text-[#0088cc]" />
                  <span>Telegram</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent("Majalengka Post: " + selectedArticle.title)}&body=${encodeURIComponent("Baca berita selengkapnya di Majalengka Post:\n\n" + getSiteOrigin() + "/artikel/" + slugify(selectedArticle.title))}`}
                  onClick={() => handleLogShare("Email")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/25 transition-all text-slate-600 dark:text-slate-400 hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm"
                  title="Kirim via Email"
                >
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span>Email</span>
                </a>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getSiteOrigin() + "/artikel/" + slugify(selectedArticle.title));
                    setShowShareNotification("Tautan berita berhasil disalin ke papan klip! Siap dibagikan ke Instagram, TikTok, dll.");
                    setTimeout(() => setShowShareNotification(null), 4000);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all text-amber-600 dark:text-amber-400 hover:scale-[1.02] text-[9px] font-black uppercase tracking-wider shadow-sm"
                  title="Salin Tautan Berita"
                >
                  <Copy className="w-3 h-3 text-amber-500" />
                  <span>Salin Tautan</span>
                </button>
              </div>

              {/* Share confirmation banner inside article */}
              {showShareNotification && (
                <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200/55 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-in shadow-inner">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{showShareNotification}</span>
                </div>
              )}
            </div>

            {/* ================= RELATED ARTICLES SECTION ================= */}
            {(() => {
              const relatedList = publishedArticles
                .filter(art => art.id !== selectedArticle.id)
                .map(art => {
                  let score = 0;
                  if (art.category === selectedArticle.category) {
                    score += 5;
                  }
                  if (art.subCategory && selectedArticle.subCategory && art.subCategory === selectedArticle.subCategory) {
                    score += 3;
                  }
                  if (art.tags && selectedArticle.tags) {
                    const commonTags = art.tags.filter(t => selectedArticle.tags.includes(t));
                    score += commonTags.length * 2;
                  }
                  return { article: art, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.article);

              // If less than 3, pad with latest articles
              if (relatedList.length < 3) {
                const existingIds = new Set(relatedList.map(a => a.id));
                existingIds.add(selectedArticle.id);
                const additional = publishedArticles
                  .filter(art => !existingIds.has(art.id))
                  .slice(0, 3 - relatedList.length);
                relatedList.push(...additional);
              }

              const displayList = relatedList.slice(0, 3);

              if (displayList.length === 0) return null;

              return (
                <div className="mt-10 border-t border-gray-150 dark:border-gray-850 pt-8" id="related-articles-section">
                  <div className="border-l-4 border-red-600 pl-3.5 mb-6">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-red-600" />
                      Rekomendasi Berita Terkait
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Sajian berita relevan pilihan redaksi untuk Anda</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {displayList.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          onSelectArticle(art);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-xl overflow-hidden shadow-xs hover:border-red-500/40 dark:hover:border-red-500/40 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group h-full"
                      >
                        <div className="relative overflow-hidden aspect-video">
                          <img
                            src={art.coverImage}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="bg-slate-900/80 text-white font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded absolute bottom-2 right-2">
                            {art.category}
                          </span>
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-black text-gray-900 dark:text-white leading-snug tracking-tight group-hover:text-red-600 transition-colors line-clamp-3">
                              {art.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium font-mono mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-850">
                            <span className="text-red-600 dark:text-red-400 font-extrabold uppercase">{art.location}</span>
                            <span>•</span>
                            <span>{art.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ================= COMMENTS SECTION ================= */}
            <div className="mt-10 border-t border-gray-150 dark:border-gray-850 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                  Komentar Pembaca ({comments.length})
                </h3>
                <span className="text-xs bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-3 py-1 rounded font-bold uppercase tracking-wider">
                  AI Auto-Moderation Active
                </span>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-8">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase">Tulis Komentar Baru (Gunakan nama Anda untuk login simulasi)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    id="input-comment-name"
                    type="text"
                    required
                    placeholder="Nama lengkap Anda..."
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="text-xs p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
                  />
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                    IP Address: 114.124.xx.xx (Simulated Logged In)
                  </span>
                </div>
                <textarea
                  id="textarea-comment-text"
                  required
                  placeholder="Ketik komentar Anda disini... (Komentar kasar/toxic otomatis diblokir oleh AI)"
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none mb-3 resize-none"
                />

                <div className="flex items-center justify-between gap-4">
                  {moderationFeedback && (
                    <span className="text-xs font-medium text-amber-500 animate-pulse">{moderationFeedback}</span>
                  )}
                  <button
                    id="btn-comment-submit"
                    type="submit"
                    disabled={isModerating}
                    className="ml-auto bg-red-600 hover:bg-red-500 disabled:bg-gray-400 text-white font-bold text-xs px-5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {isModerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isModerating ? "Memeriksa AI..." : "Kirim Komentar"}</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comm) => (
                  <div key={comm.id} className="border-b border-gray-100 dark:border-gray-850 pb-5">
                    <div className="flex items-start gap-3">
                      <img src={comm.avatar} alt={comm.user} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-gray-900 dark:text-white">{comm.user}</span>
                          <span className="text-[10px] text-gray-400">{comm.timestamp}</span>
                          {comm.sentiment && (
                            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                              comm.sentiment === "positive" 
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40" 
                                : comm.sentiment === "negative"
                                ? "bg-red-100 text-red-700 dark:bg-red-950/40"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800"
                            }`}>
                              AI Sentimen: {comm.sentiment}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed">{comm.content}</p>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-2.5 text-[10px] text-gray-400 font-bold">
                          <button 
                            onClick={() => {
                              setComments(prev => prev.map(c => c.id === comm.id ? { ...c, likes: c.likes + 1 } : c));
                            }}
                            className="hover:text-red-500"
                          >
                            Like ({comm.likes})
                          </button>
                          <span>•</span>
                          <button onClick={() => setReplyingToId(comm.id)} className="hover:text-blue-500">
                            Balas
                          </button>
                          <span>•</span>
                          <button 
                            onClick={() => {
                              triggerToast("Terima kasih, laporan Anda telah dikirim ke sistem antrean moderasi moderator.");
                            }} 
                            className="hover:text-amber-500 flex items-center gap-0.5"
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            Laporkan
                          </button>
                        </div>

                        {/* Reply box if active */}
                        {replyingToId === comm.id && (
                          <div className="mt-3 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                            <input
                              id="input-reply-text"
                              type="text"
                              placeholder="Ketik balasan Anda..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 outline-none mb-2"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => setReplyingToId(null)} className="text-[10px] px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold">Batal</button>
                              <button onClick={() => handleAddReply(comm.id)} className="text-[10px] px-3 py-1 rounded bg-red-600 text-white font-bold">Balas</button>
                            </div>
                          </div>
                        )}

                        {/* Sub-replies loop */}
                        {comm.replies && comm.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-150 dark:border-gray-800 space-y-4">
                            {comm.replies.map((rep) => (
                              <div key={rep.id} className="flex items-start gap-2">
                                <img src={rep.avatar} alt={rep.user} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-gray-900 dark:text-white">{rep.user}</span>
                                    <span className="text-[10px] text-gray-400">{rep.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{rep.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Widget 1: Prayer times */}
            <div className="prayer-schedule-widget relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-700 text-white border border-white/20 rounded-3xl p-5 shadow-xl shadow-emerald-950/30">
              {/* Glossy reflection effect */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              <div className="absolute -inset-y-2/4 -inset-x-12 w-[150%] h-[150%] rotate-12 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-40" />
              <div className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
              
              <h4 className="relative z-10 text-xs font-black text-white uppercase tracking-widest border-b border-white/15 pb-2.5 mb-3 flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-1.5 font-mono tracking-wide">
                  <span className="text-sm">🕌</span> JADWAL SHOLAT
                </span>
                <span className="bg-white/15 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[9px] text-emerald-50 tracking-normal font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {SHOLAT_SCHEDULE.city}
                </span>
              </h4>

              {/* Dynamic Islamic Hijri & Gregorian date display */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-3 mb-3.5 shadow-inner animate-fade-in">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="text-[10px] font-bold text-white tracking-wide">
                    {gregorianDate}
                  </span>
                </div>
                <div className="bg-emerald-500/30 border border-white/10 px-2.5 py-1 rounded-full text-[9px] text-emerald-200 tracking-wide font-extrabold font-mono flex items-center gap-1.5 shadow-sm self-start sm:self-auto">
                  <span className="animate-pulse">🌙</span>
                  <span>{hijriDate}</span>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-5 gap-1.5 text-center">
                {Object.entries(SHOLAT_SCHEDULE).filter(([k]) => k !== "city").map(([name, time]) => (
                  <div key={name} className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 hover:bg-white/20 hover:scale-[1.05] active:scale-95 transition-all duration-300 flex flex-col justify-between shadow-inner">
                    <p className="text-[9px] text-emerald-100 font-extrabold uppercase tracking-widest">{name}</p>
                    <p className="font-black text-white text-[11px] mt-1.5 font-mono tracking-tight">{time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner sidebar ad */}
            {sidebarBanner && (
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                <a href={sidebarBanner.adUrl} target="_blank" rel="noreferrer">
                  <img src={sidebarBanner.imageUrl} alt={sidebarBanner.title} className="w-full object-cover h-[350px]" />
                </a>
              </div>
            )}

            {/* Widget 2: Latest news */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
                📰 Berita Terbaru Lainnya
              </h4>
              <div className="space-y-4">
                {latestArticles.slice(0, 5).map((art) => (
                  <div key={art.id} onClick={() => onSelectArticle(art)} className="flex gap-3 cursor-pointer group">
                    <img src={art.coverImage} alt={art.title} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-100 dark:border-gray-800" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">{art.category}</p>
                      <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                        {art.title}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

      ) : (

        // ================= HOMEPAGE VIEW =================
        <div className="space-y-8">
          
          {/* 1. Headline Slider Block */}
          {headlineArticles.length > 0 && (
            <div className="flex flex-col md:relative md:rounded-2xl rounded-xl overflow-hidden h-auto md:h-[460px] bg-slate-950 group shadow-none border border-slate-200 dark:border-slate-850">
              <div className="w-full h-52 sm:h-64 md:h-full relative shrink-0">
                <img
                  src={headlineArticles[headlineIndex].coverImage}
                  alt={headlineArticles[headlineIndex].title}
                  className="w-full h-full object-cover opacity-90 md:opacity-85 hover:scale-[1.01] transition-transform duration-700"
                />
                {/* Gradients only on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent hidden md:block"></div>
              </div>
              
              {/* Overlay textual content - stacked on mobile, absolute on desktop */}
              <div className="bg-slate-950 p-5 md:absolute md:bottom-0 md:left-0 md:w-full md:p-8 text-white flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    HEADLINE UTAMA
                  </span>
                  <span className="text-gray-300 text-xs font-mono">
                    {headlineArticles[headlineIndex].category} / {headlineArticles[headlineIndex].location}
                  </span>
                </div>
                <h3 
                  onClick={() => onSelectArticle(headlineArticles[headlineIndex])}
                  className="text-lg md:text-3xl font-black tracking-tight leading-tight cursor-pointer hover:underline line-clamp-3 md:line-clamp-2"
                >
                  {headlineArticles[headlineIndex].title}
                </h3>
                <p className="text-xs md:text-sm text-gray-300 mt-2 line-clamp-2 leading-relaxed max-w-4xl">
                  {headlineArticles[headlineIndex].summary}
                </p>

                {/* Full width CTA button on mobile, inline on desktop */}
                <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => onSelectArticle(headlineArticles[headlineIndex])}
                      className="w-full md:w-auto bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Headline social share */}
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/10" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider hidden sm:inline ml-1">Bagikan:</span>
                      
                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`*${headlineArticles[headlineIndex].title}*\n\n${headlineArticles[headlineIndex].summary || ""}\n\nBaca selengkapnya di Majalengka Post:\n${getSiteOrigin()}/artikel/${slugify(headlineArticles[headlineIndex].title)}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleLogShare("WhatsApp")}
                        className="p-1 rounded bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 transition-all text-[#25D366] hover:scale-105"
                        title="Bagikan ke WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>

                      {/* Facebook */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getSiteOrigin() + "/artikel/" + slugify(headlineArticles[headlineIndex].title))}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleLogShare("Facebook")}
                        className="p-1 rounded bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/30 transition-all text-[#1877F2] hover:scale-105"
                        title="Bagikan ke Facebook"
                      >
                        <Facebook className="w-3 h-3" />
                      </a>

                      {/* Twitter / X */}
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(headlineArticles[headlineIndex].title)}&url=${encodeURIComponent(getSiteOrigin() + "/artikel/" + slugify(headlineArticles[headlineIndex].title))}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleLogShare("Twitter/X")}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white hover:scale-105"
                        title="Bagikan ke Twitter / X"
                      >
                        <Twitter className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Dots indicator */}
                  <div className="flex items-center justify-center gap-1.5 self-center md:self-auto">
                    {headlineArticles.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeadlineIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          headlineIndex === i ? "bg-red-500 w-6" : "bg-gray-500 hover:bg-white"
                        }`}
                        style={{ minWidth: "10px", minHeight: "10px" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Center banner placement if exists */}
          {centerBanner && (
            <div className="my-2">
              <div dangerouslySetInnerHTML={{ __html: centerBanner.htmlContent || "" }} />
            </div>
          )}

          {/* 2. Main Grid: Left News Arena & Right Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side: News cards list */}
            <main className="lg:col-span-8 space-y-6">
              
              {/* Filter / Category Header Title */}
              <div className="border-b-2 border-red-600 pb-2 mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                  {currentCategory === "" ? "Berita Terbaru & Pilihan" : `Arsip Kategori: ${currentCategory}`}
                </h3>
                <span className="text-xs text-gray-400 font-bold">{filteredArticles.length} Laporan Ditemukan</span>
              </div>

              {/* Grid cards */}
              {filteredArticles.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-950 p-8 rounded-xl text-center border border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-bold">Maaf, belum ada berita yang diterbitkan di kategori ini atau tidak cocok dengan pencarian Anda.</p>
                </div>
              ) : (
                <motion.div
                  key={`${currentCategory}-${searchQuery}`}
                  variants={cardContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                >
                  {filteredArticles.map((art) => (
                    <motion.div
                      key={art.id}
                      variants={cardItemVariants}
                      onClick={() => onSelectArticle(art)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg overflow-hidden shadow-none hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer flex flex-col group"
                    >
                      <div className="relative overflow-hidden h-48 md:h-44">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                        />
                        {art.isBreaking && (
                          <span className="bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded absolute top-2.5 left-2.5 shadow animate-pulse">
                            BREAKING
                          </span>
                        )}
                        <span className="bg-slate-950/80 backdrop-blur-xs text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded absolute bottom-2.5 right-2.5">
                          {art.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                            {art.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 mb-1.5">
                            <span className="font-bold uppercase text-red-600 dark:text-red-400">{art.location}</span>
                            <span className="text-slate-300">|</span>
                            <span>{art.date}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                            {art.summary}
                          </p>
                        </div>

                        {/* Card metadata views */}
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4 text-[10px] text-slate-400 font-semibold font-mono">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-0.5">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              {art.views > 999 ? `${(art.views/1000).toFixed(1)}k` : art.views} dibaca
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Heart className="w-3.5 h-3.5 text-red-400" />
                              {art.likes} disukai
                            </span>
                          </div>

                          {/* Mini Social Share Buttons */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline mr-0.5">Bagikan:</span>
                            
                            {/* WhatsApp */}
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(`*${art.title}*\n\n${art.summary || ""}\n\nBaca selengkapnya di Majalengka Post:\n${getSiteOrigin()}/artikel/${slugify(art.title)}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleLogShare("WhatsApp")}
                              className="p-1 rounded bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-all text-[#25D366] hover:scale-105"
                              title="Bagikan ke WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>

                            {/* Facebook */}
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getSiteOrigin() + "/artikel/" + slugify(art.title))}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleLogShare("Facebook")}
                              className="p-1 rounded bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 transition-all text-[#1877F2] hover:scale-105"
                              title="Bagikan ke Facebook"
                            >
                              <Facebook className="w-3 h-3" />
                            </a>

                            {/* Twitter / X */}
                            <a
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(art.title)}&url=${encodeURIComponent(getSiteOrigin() + "/artikel/" + slugify(art.title))}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleLogShare("Twitter/X")}
                              className="p-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/15 transition-all text-black dark:text-white hover:scale-105"
                              title="Bagikan ke Twitter / X"
                            >
                              <Twitter className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Multimedia Showcase Area: Video & Photo Gallery Section */}
              <div className="bg-slate-900 text-white rounded-lg p-5 shadow-none mt-10 border border-slate-850">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-5">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-500" />
                    MULTIMEDIA GALERI & VIDEO UTAMA
                  </h3>
                  <span className="text-[9px] bg-red-600 px-2 py-0.5 rounded font-bold">1080P HD</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Featured Big video representation */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative border border-slate-800 group">
                      <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800" alt="Video cover" className="w-full h-full object-cover opacity-70" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-tight leading-tight">Dokumenter Liputan Khusus: Kesiapan Kawasan Ekonomi Khusus Menghadapi Digitalisasi Global</h4>
                  </div>

                  {/* Right side secondary multimedia list */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="flex gap-3 items-center p-2 rounded hover:bg-slate-800 cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=150" alt="tech" className="w-16 h-12 object-cover rounded" />
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">Infografis</p>
                        <h5 className="text-[11px] font-bold leading-tight text-white line-clamp-2">Panduan Pengurangan Emisi Karbon Sektor Industri Nasional</h5>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center p-2 rounded hover:bg-slate-800 cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=150" alt="toll" className="w-16 h-12 object-cover rounded" />
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">Foto Udara</p>
                        <h5 className="text-[11px] font-bold leading-tight text-white line-clamp-2">Visualisasi Drone Ruas Terakhir Tol Trans-Sumatera Selesai Sempurna</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Audio Podcast Player Widget (Requested) */}
              <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-850 mt-10 shadow-none">
                <div className="flex items-center gap-2 mb-4">
                  <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Majalengka Post Podcast Edukasi</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-950 p-4 rounded border border-slate-150 dark:border-slate-850">
                  <div className="w-14 h-14 bg-red-600 rounded flex items-center justify-center shrink-0">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 w-full">
                    <span className="text-[8px] bg-red-100 dark:bg-red-950 text-red-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">PODCAST MINGGUAN</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Eps #12: Strategi Mengembangkan Potensi UMKM Lokal di Tengah Serbuan AI Global</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Narasumber: Deputi Bidang UMKM & Digitalisasi Ekonomi Nasional</p>
                    {/* Fake playback control */}
                    <div className="flex items-center gap-3 mt-3">
                      <button className="p-1 rounded-full bg-red-600 hover:bg-red-500 text-white">
                        <Play className="w-3 h-3 fill-white" />
                      </button>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-900 h-1 rounded-full relative">
                        <div className="bg-red-600 h-1 w-1/3 rounded-full"></div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">04:15 / 15:30</span>
                    </div>
                  </div>
                </div>
              </div>

            </main>

            {/* Right side: Widgets and Polling */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Widget: Daily News Digest (AI Bulletins) */}
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                {/* Header background accents */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-50 dark:bg-red-950/40 p-1.5 rounded-lg text-red-600">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Daily News Digest
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Rangkuman Berita Harian AI</p>
                    </div>
                  </div>
                  <button 
                    onClick={fetchDailyDigest} 
                    disabled={isDigestLoading}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
                    title="Segarkan Digest"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDigestLoading ? "animate-spin text-red-600" : ""}`} />
                  </button>
                </div>

                {isDigestLoading ? (
                  <div className="space-y-3 py-4 animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest">
                        Redaksi AI Sedang Merangkum...
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal font-medium">Menganalisis 3 berita utama terpopuler dari 24 jam terakhir...</p>
                    <div className="space-y-2 mt-2">
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
                    </div>
                  </div>
                ) : digestError ? (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-950/40 text-center">
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold">{digestError}</p>
                    <button 
                      onClick={fetchDailyDigest}
                      className="mt-2 text-[10px] font-black text-red-600 dark:text-red-400 underline hover:no-underline uppercase tracking-wider"
                    >
                      Coba Lagi
                    </button>
                  </div>
                ) : digest ? (
                  <div className="space-y-4">
                    {/* Newsletter / Notification Style Bubble */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl p-4 shadow-inner relative max-h-72 overflow-y-auto custom-scrollbar">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          Ready
                        </span>
                      </div>
                      
                      <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans pr-2">
                        {digest.bulletin}
                      </div>
                    </div>

                    {/* Meta and Copy Buttons */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">MODALITAS BULLET</span>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {digest.source === "gemini-ai" ? "🤖 Gemini AI Premium" : "📝 Fallback Lokal"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(digest.bulletin);
                          triggerToast("Bulletin berhasil disalin ke papan klip! Anda dapat membagikannya ke WhatsApp atau email.");
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Buletin</span>
                      </button>
                    </div>

                    {/* Reference Articles Section */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Artikel Utama Hari Ini</p>
                      <div className="space-y-2">
                        {digest.articles?.slice(0, 3).map((art) => (
                          <div 
                            key={art.id} 
                            onClick={() => onSelectArticle(art)}
                            className="flex gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800 group"
                          >
                            <img 
                              src={art.coverImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=150"} 
                              alt={art.title} 
                              className="w-12 h-10 object-cover rounded-lg shrink-0" 
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 rounded font-bold uppercase tracking-wider">
                                {art.category}
                              </span>
                              <h5 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-red-600 transition-colors mt-0.5">
                                {art.title}
                              </h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-slate-400">
                    Tidak ada digest tersedia. Klik refresh untuk memuat.
                  </div>
                )}
              </div>

              {/* Widget: Terpopuler Live */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg p-4 shadow-none">
                <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-2 flex justify-between items-center mb-3">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    ⚡ TERPOPULER LIVE
                  </h4>
                  <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">TRENDING</span>
                </div>
                <div className="space-y-3.5">
                  {trendingArticles.slice(0, 5).map((art, idx) => (
                    <div key={art.id} onClick={() => onSelectArticle(art)} className="flex items-start cursor-pointer group">
                      <span className="text-2xl font-black text-slate-300 dark:text-slate-700 leading-none mr-3 w-8 shrink-0 text-center group-hover:text-red-600 transition-colors">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <h5 className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors line-clamp-2">
                          {art.title}
                        </h5>
                        <div className="flex gap-2 text-[10px] text-slate-400 mt-1 font-semibold">
                          <span className="uppercase">{art.category}</span>
                          <span>•</span>
                          <span>{art.views} dibaca</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 1: Sholat Times */}
              <div className="prayer-schedule-widget relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-700 text-white border border-white/20 rounded-3xl p-5 shadow-xl shadow-emerald-950/30">
                {/* Glossy reflection effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                <div className="absolute -inset-y-2/4 -inset-x-12 w-[150%] h-[150%] rotate-12 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-40" />
                <div className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
                
                <h4 className="relative z-10 text-xs font-black text-white uppercase tracking-widest border-b border-white/15 pb-2.5 mb-3 flex items-center justify-between shadow-xs">
                  <span className="flex items-center gap-1.5 font-mono tracking-wide">
                    <span className="text-sm">🕌</span> JADWAL SHOLAT
                  </span>
                  <span className="bg-white/15 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[9px] text-emerald-50 tracking-normal font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    {SHOLAT_SCHEDULE.city}
                  </span>
                </h4>

                {/* Dynamic Islamic Hijri & Gregorian date display */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-3 mb-3.5 shadow-inner animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span className="text-[10px] font-bold text-white tracking-wide">
                      {gregorianDate}
                    </span>
                  </div>
                  <div className="bg-emerald-500/30 border border-white/10 px-2.5 py-1 rounded-full text-[9px] text-emerald-200 tracking-wide font-extrabold font-mono flex items-center gap-1.5 shadow-sm self-start sm:self-auto">
                    <span className="animate-pulse">🌙</span>
                    <span>{hijriDate}</span>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-5 gap-1.5 text-center">
                  {Object.entries(SHOLAT_SCHEDULE).filter(([k]) => k !== "city").map(([name, time]) => (
                    <div key={name} className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 hover:bg-white/20 hover:scale-[1.05] active:scale-95 transition-all duration-300 flex flex-col justify-between shadow-inner">
                      <p className="text-[9px] text-emerald-100 font-extrabold uppercase tracking-widest">{name}</p>
                      <p className="font-black text-white text-[11px] mt-1.5 font-mono tracking-tight">{time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 2: Interactive Polling */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-none">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    🗳️ Polling Aspirasi Pembaca
                  </h4>
                  <span className="text-[9px] bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-mono font-bold">AKTIF</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug mb-4">
                  {activePoll.question}
                </p>
                <div className="space-y-3">
                  {activePoll.options.map((opt) => {
                    const percent = activePoll.totalVotes > 0 
                      ? Math.round((opt.votes / activePoll.totalVotes) * 100) 
                      : 0;
                    return (
                      <div key={opt.id} className="relative cursor-pointer group" onClick={() => onVotePoll(opt.id)}>
                        <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 z-10 relative px-2.5">
                          <span className="group-hover:text-red-500 transition-colors">{opt.text}</span>
                          <span className="font-mono text-slate-400">{percent}% ({opt.votes})</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-6 rounded overflow-hidden relative border border-slate-200 dark:border-slate-850">
                          <div 
                            className="bg-red-50 dark:bg-red-950/30 border-r-2 border-red-500 h-full transition-all duration-1000" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 font-mono text-right mt-3">Total Suara Terkumpul: {activePoll.totalVotes}</p>
              </div>

              {/* Widget 3: Currency Rates & Market Stock */}
              <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 rounded-3xl p-4.5 shadow-2xl">
                {/* Background radial glow and grid accent */}
                <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-36 h-36 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3.5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black tracking-widest text-emerald-400 font-mono uppercase flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      IDX REALTIME
                    </span>
                    <h4 className="text-[11px] font-extrabold text-slate-100 uppercase tracking-tight mt-0.5">
                      Kurs Valas & Bursa Saham
                    </h4>
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>

                {/* Glassmorphic Tabs */}
                <div className="relative z-10 grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-850 mb-4">
                  {(["all", "valas", "saham"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMarketTab(tab)}
                      className={`py-1 px-2 text-[10px] font-extrabold rounded-lg transition-all uppercase tracking-wider ${
                        marketTab === tab
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-950/40"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab === "all" ? "Semua" : tab === "valas" ? "Valas" : "Saham"}
                    </button>
                  ))}
                </div>

                <div className="relative z-10 space-y-3.5">
                  {/* Currency List (Valas) */}
                  {(marketTab === "all" || marketTab === "valas") && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Mata Uang</span>
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Nilai / Perubahan</span>
                      </div>
                      <div className="space-y-1.5">
                        {(valasRates || CURRENCY_RATES).map((curr) => {
                          const isDown = curr.change.startsWith("-");
                          const path = isDown 
                            ? "M0 3 L 8 6 L 16 2 L 24 10 L 32 8 L 40 12" 
                            : "M0 11 L 8 8 L 16 12 L 24 5 L 32 7 L 40 2";
                          return (
                            <div 
                              key={curr.code} 
                              className="group flex justify-between items-center bg-slate-900/40 hover:bg-slate-850/50 border border-slate-850/80 p-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-black/20"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-lg bg-slate-950/80 flex items-center justify-center border border-slate-850 text-slate-300 font-black text-[10px] font-mono shadow-inner">
                                  {curr.code.split("/")[0]}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-white text-xs font-mono">{curr.code}</span>
                                  <span className="text-[9px] text-slate-400 font-mono">IDR Spot</span>
                                </div>
                              </div>

                              {/* Mini Sparkline Chart */}
                              <div className="w-10 h-5 shrink-0 mx-2">
                                <svg className={`w-full h-full ${isDown ? "text-red-500" : "text-emerald-500"}`} viewBox="0 0 40 15" fill="none">
                                  <path d={path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>

                              <div className="flex flex-col items-end">
                                <span className="font-mono font-bold text-slate-100 text-xs">{curr.rate}</span>
                                <span className={`text-[9px] font-bold font-mono flex items-center gap-0.5 mt-0.5 px-1.5 py-0.5 rounded-full ${
                                  isDown 
                                    ? "bg-red-950/40 text-red-400 border border-red-900/30" 
                                    : "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                                }`}>
                                  {isDown ? "▼" : "▲"} {curr.change.replace(/[+-]/g, "")}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Stock List (Saham) */}
                  {(marketTab === "all" || marketTab === "saham") && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Instrumen</span>
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Harga / Trend</span>
                      </div>
                      <div className="space-y-1.5">
                        {STOCK_MARKET.map((stock) => {
                          const isUp = stock.trend === "up";
                          const isDown = stock.trend === "down";
                          const path = isDown 
                            ? "M0 2 L 10 9 L 20 5 L 30 12 L 40 14" 
                            : isUp 
                              ? "M0 12 L 10 8 L 20 10 L 30 4 L 40 2"
                              : "M0 8 L 10 8 L 20 8 L 30 8 L 40 8";
                          return (
                            <div 
                              key={stock.code} 
                              className="group flex justify-between items-center bg-slate-900/40 hover:bg-slate-850/50 border border-slate-850/80 p-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-black/20"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-black text-[10px] font-mono border shadow-inner ${
                                  isUp 
                                    ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/30" 
                                    : isDown 
                                      ? "bg-red-950/30 text-red-400 border-red-900/30" 
                                      : "bg-slate-950/80 text-slate-400 border-slate-800"
                                }`}>
                                  {stock.code === "IHSG" ? "IDX" : stock.code.substring(0, 3)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-white text-xs font-mono">{stock.code}</span>
                                  <span className="text-[9px] text-slate-400 font-mono">Bursa Efek</span>
                                </div>
                              </div>

                              {/* Mini Sparkline Chart */}
                              <div className="w-10 h-5 shrink-0 mx-2">
                                <svg className={`w-full h-full ${isUp ? "text-emerald-500" : isDown ? "text-red-500" : "text-slate-400"}`} viewBox="0 0 40 15" fill="none">
                                  <path d={path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>

                              <div className="flex flex-col items-end">
                                <span className="font-mono font-bold text-slate-100 text-xs">{stock.value}</span>
                                <span className={`text-[9px] font-bold font-mono flex items-center gap-0.5 mt-0.5 px-1.5 py-0.5 rounded-full ${
                                  isUp 
                                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" 
                                    : isDown 
                                      ? "bg-red-950/40 text-red-400 border border-red-900/30" 
                                      : "bg-slate-800 text-slate-400"
                                }`}>
                                  {isUp ? "▲" : isDown ? "▼" : "—"} {stock.change.replace(/[+-]/g, "")}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between text-[8px] text-slate-500 font-mono font-extrabold pt-3 border-t border-slate-850 mt-3">
                  <span>SUMBER: IDX / BI</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    SINKRON
                  </span>
                </div>
              </div>

            </aside>
          </div>
        </div>
      )}
      </div> {/* Close universal responsive wrapper */}

      {/* ================= INSTAGRAM SHARE KIT MODAL ================= */}
      <AnimatePresence>
        {isInstagramModalOpen && selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsInstagramModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full relative overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
                    <Instagram className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      Instagram Share Kit
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Simulasi &amp; Panduan Publikasi Story Berita
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInstagramModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-3 mb-6">
                <div className="flex gap-2 text-xs">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold flex items-center justify-center">1</span>
                  <div>
                    <p className="font-extrabold text-gray-800 dark:text-gray-200">Salin Tautan Artikel</p>
                    <div className="mt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(getSiteOrigin() + "/artikel/" + slugify(selectedArticle.title));
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 3000);
                        }}
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          isCopied 
                            ? "bg-emerald-500 text-white" 
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {isCopied ? "Berhasil Disalin!" : "Salin Tautan"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold flex items-center justify-center">2</span>
                  <div>
                    <p className="font-extrabold text-gray-800 dark:text-gray-200">Ambil Tangkapan Layar (Screenshot)</p>
                    <p className="text-gray-400">Silakan tangkap layar preview kartu berita di bawah ini untuk digunakan sebagai gambar latar belakang Instagram Story Anda.</p>
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold flex items-center justify-center">3</span>
                  <div>
                    <p className="font-extrabold text-gray-800 dark:text-gray-200">Buka Instagram &amp; Pasang Stiker Tautan</p>
                    <p className="text-gray-400">Luncurkan Instagram Story, pilih screenshot kartu, lalu tambahkan "Link Sticker" dengan menempelkan tautan berita yang telah disalin.</p>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white hover:opacity-90 shadow-md transition-all hover:scale-[1.02]"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Buka Instagram</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Story Card Preview Section */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  PREVIEW KARTU STORY INSTAGRAM (9:16)
                </p>
                <div className="relative mx-auto max-w-[250px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-gray-250 dark:border-gray-850 bg-gradient-to-b from-gray-900 via-gray-950 to-black p-4 flex flex-col justify-between text-white">
                  {/* Decorative noise/glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,42,123,0.15),transparent_60%)] pointer-events-none" />
                  
                  {/* Branding Header */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[8px] font-black tracking-[0.2em] text-red-500 uppercase">
                      MAJALENGKA POST
                    </span>
                    <span className="text-[6px] text-gray-500 font-mono tracking-widest uppercase mt-0.5">
                      JURNALISME AKURAT &amp; TERPERCAYA
                    </span>
                  </div>

                  {/* Content Card Body */}
                  <div className="relative z-10 flex flex-col items-center my-auto w-full">
                    {/* Category */}
                    <span className="bg-red-600 text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
                      {selectedArticle.category}
                    </span>

                    {/* Image */}
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/10 my-3 shadow-md bg-gray-800">
                      <img
                        src={selectedArticle.coverImage}
                        alt={selectedArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Headline */}
                    <h4 className="text-center text-[11px] font-serif font-extrabold leading-snug line-clamp-3 text-white px-1">
                      {selectedArticle.title}
                    </h4>

                    {/* Simulated Instagram Link Sticker */}
                    <div className="mt-4 bg-white/20 backdrop-blur-md border border-white/25 rounded-full px-3 py-1.5 flex items-center gap-1 text-[10px] text-cyan-300 font-extrabold shadow-lg">
                      <Globe className="w-3 h-3 text-cyan-300" />
                      <span>MAJALENGKAPOST.CO.ID</span>
                    </div>
                  </div>

                  {/* Footer instruction in story */}
                  <div className="relative z-10 text-center mt-2">
                    <span className="text-[6px] text-gray-500 font-bold tracking-widest uppercase">
                      SCREENSHOT SEBAGAI LATAR BELAKANG STORY
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
