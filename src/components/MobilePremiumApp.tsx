import React, { useState, useEffect, useRef } from "react";
import { 
  Home, Newspaper, Video, Bell, User, Search, Bookmark, Share2, Heart, 
  ChevronRight, ArrowLeft, Send, Sparkles, AlertTriangle, Play, Pause, 
  Volume2, Plus, CheckCircle2, RefreshCw, Layers, Calendar, Clock, Eye, 
  ThumbsUp, BookOpen, MessageSquare, ZoomIn, ZoomOut, Phone, MapPin, 
  Info, Camera, FileText, Globe, Radio, Settings, ShieldAlert, Database,
  ArrowUpRight, Moon, Sun, Lock, Reply, CornerDownRight, ChevronDown, ChevronUp, X,
  VolumeX, Copy, Check, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Article, AdBanner, OpeningBanner, Poll, ValasRate, Comment, MediaItem, InternalNotification } from "../types";
import { CATEGORIES, SHOLAT_SCHEDULE, CURRENCY_RATES, STOCK_MARKET, INITIAL_COMMENTS } from "../mockData";
import { slugify } from "../utils/slugify";
import logoImg from "../assets/images/majalengka_post_logo_1783851016975.jpg";
import { getYouTubeEmbedUrl } from "../lib/youtube";
import Footer from "./Footer";
import OpeningBannerModal from "./OpeningBannerModal";

interface MobilePremiumAppProps {
  articles: Article[];
  banners: AdBanner[];
  openingBanners?: OpeningBanner[];
  valasRates: ValasRate[];
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedArticle: Article | null;
  onSelectArticle: (article: Article | null) => void;
  activePoll: Poll;
  onVotePoll: (optionId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isRedaksiUnlocked: boolean;
  isAdminView: boolean;
  onToggleAdmin: () => void;
  onOpenUnlockModal: () => void;
  onLockRedaksi: () => void;
  redaksiPin: string;
  mediaItems: MediaItem[];
  onAddMedia: (media: MediaItem) => void;
  notifications: InternalNotification[];
  onAddArticle: (article: Article) => void;
  currentTheme: any;
  fontFamily: string;
  isSubscribed: boolean;
  notificationPermission: "default" | "granted" | "denied" | "unsupported";
  onToggleNotifications: () => void;
  liveStreamActive?: boolean;
  liveStreamTitle?: string;
  liveStreamViewerCount?: number;
  liveStreamType?: "youtube" | "camera" | "custom";
  liveStreamUrl?: string;
  activeCameraFrame?: string;
}

export default function MobilePremiumApp({
  articles,
  banners,
  openingBanners = [],
  valasRates,
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedArticle,
  onSelectArticle,
  activePoll,
  onVotePoll,
  darkMode,
  onToggleDarkMode,
  isRedaksiUnlocked,
  isAdminView,
  onToggleAdmin,
  onOpenUnlockModal,
  onLockRedaksi,
  redaksiPin,
  mediaItems,
  onAddMedia,
  notifications,
  onAddArticle,
  currentTheme,
  fontFamily,
  isSubscribed,
  notificationPermission,
  onToggleNotifications,
  liveStreamActive,
  liveStreamTitle,
  liveStreamViewerCount,
  liveStreamType = "youtube",
  liveStreamUrl = "",
  activeCameraFrame = "",
}: MobilePremiumAppProps) {

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

  // State Management
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash once per session
    try {
      const shown = sessionStorage.getItem("mp_splash_shown");
      return shown !== "true";
    } catch {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState<string>("beranda");
  const [isHeaderShadow, setIsHeaderShadow] = useState<boolean>(false);
  const [showFabMenu, setShowFabMenu] = useState<boolean>(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [showProfileSheet, setShowProfileSheet] = useState<boolean>(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState<boolean>(false);
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullProgress, setPullProgress] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  
  // Comments state per article
  const [articleComments, setArticleComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem("majalengka_comments_v1");
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // Sort option state for comments
  const [commentSort, setCommentSort] = useState<"Newest" | "Oldest" | "Most Liked">("Newest");

  // New comment input fields
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Nested Reply states
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null); // target comment/reply ID
  const [activeReplyParentId, setActiveReplyParentId] = useState<string | null>(null); // parent top-level comment ID
  const [activeReplyTargetUser, setActiveReplyTargetUser] = useState<string>("");
  const [replyUserName, setReplyUserName] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const [collapsedThreads, setCollapsedThreads] = useState<Record<string, boolean>>({});

  const toggleThreadCollapse = (commentId: string) => {
    setCollapsedThreads(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleLikeComment = (commentId: string) => {
    setArticleComments(prev => {
      let updatedPrev = [...prev];
      const exists = prev.some(c => c.id === commentId || (c.replies && c.replies.some(r => r.id === commentId)));
      
      // If the comment is a fallback comment and does not yet exist in our state, initialize it
      if (!exists && commentId.startsWith("fallback-")) {
        const match = commentId.match(/^fallback-(\d+)-(.*)$/);
        if (match) {
          const index = match[1];
          const articleId = match[2];
          const fallbackComment: Comment = {
            id: commentId,
            articleId: articleId,
            user: index === "1" ? "Agus Salim" : "Indah Wahyuni",
            avatar: index === "1" ? "https://api.dicebear.com/7.x/adventurer/svg?seed=Agus" : "https://api.dicebear.com/7.x/adventurer/svg?seed=Indah",
            content: index === "1" 
              ? "Berita yang sangat mencerdaskan. Semoga bisa segera direalisasikan demi kelancaran Majalengka." 
              : "Sangat bangga karya anak bangsa diakui dunia luar!",
            timestamp: new Date(Date.now() - (index === "1" ? 2 : 3) * 60 * 60 * 1000).toISOString(),
            likes: index === "1" ? 12 : 24,
            reported: false,
            isModerated: true,
            replies: []
          };
          updatedPrev.push(fallbackComment);
        }
      }

      const updated = updatedPrev.map(c => {
        if (c.id === commentId) {
          return { ...c, likes: c.likes + 1 };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map(r => r.id === commentId ? { ...r, likes: r.likes + 1 } : r)
          };
        }
        return c;
      });
      try {
        localStorage.setItem("majalengka_comments_v1", JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to persist comments state", err);
      }
      return updated;
    });
  };

  const handleAddComment = (articleId: string) => {
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment: Comment = {
      id: `comm-sim-${Date.now()}`,
      articleId: articleId,
      user: newCommentName.trim(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newCommentName)}`,
      content: newCommentText.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      reported: false,
      isModerated: true,
      replies: []
    };

    setArticleComments(prev => {
      const updated = [newComment, ...prev];
      try {
        localStorage.setItem("majalengka_comments_v1", JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to persist comments state", err);
      }
      return updated;
    });

    setNewCommentName("");
    setNewCommentText("");
  };

  const handleAddReply = (parentCommentId: string, targetUser: string) => {
    const nameToUse = replyUserName.trim() || newCommentName.trim() || "Pembaca";
    if (!replyText.trim() || !selectedArticle) return;

    const newReplyItem: Comment = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      articleId: selectedArticle.id,
      user: nameToUse,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(nameToUse)}`,
      content: targetUser && targetUser !== nameToUse ? `@${targetUser} ${replyText.trim()}` : replyText.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      reported: false,
      isModerated: true,
      replies: []
    };

    setArticleComments(prev => {
      let updatedPrev = [...prev];
      const parentExists = updatedPrev.some(c => c.id === parentCommentId);

      if (!parentExists && parentCommentId.startsWith("fallback-")) {
        const match = parentCommentId.match(/^fallback-(\d+)-(.*)$/);
        if (match) {
          const index = match[1];
          const articleId = match[2];
          const fallbackComment: Comment = {
            id: parentCommentId,
            articleId: articleId,
            user: index === "1" ? "Agus Salim" : "Indah Wahyuni",
            avatar: index === "1" ? "https://api.dicebear.com/7.x/adventurer/svg?seed=Agus" : "https://api.dicebear.com/7.x/adventurer/svg?seed=Indah",
            content: index === "1" 
              ? "Berita yang sangat mencerdaskan. Semoga bisa segera direalisasikan demi kelancaran Majalengka." 
              : "Sangat bangga karya anak bangsa diakui dunia luar!",
            timestamp: new Date(Date.now() - (index === "1" ? 2 : 3) * 60 * 60 * 1000).toISOString(),
            likes: index === "1" ? 12 : 24,
            reported: false,
            isModerated: true,
            replies: []
          };
          updatedPrev.push(fallbackComment);
        }
      }

      const updated = updatedPrev.map(c => {
        if (c.id === parentCommentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReplyItem]
          };
        }
        return c;
      });

      try {
        localStorage.setItem("majalengka_comments_v1", JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to persist comments state", err);
      }
      return updated;
    });

    if (replyUserName.trim()) {
      setNewCommentName(replyUserName.trim());
    }

    setActiveReplyId(null);
    setActiveReplyParentId(null);
    setActiveReplyTargetUser("");
    setReplyText("");

    setCollapsedThreads(prev => ({ ...prev, [parentCommentId]: false }));
  };

  const formatCommentTime = (timestampStr: string) => {
    if (!timestampStr) return "Baru saja";
    if (timestampStr.includes("jam lalu") || timestampStr.includes("menit lalu") || timestampStr.includes("hari lalu") || timestampStr === "Baru saja") {
      return timestampStr;
    }
    try {
      const d = new Date(timestampStr.replace(" ", "T"));
      if (isNaN(d.getTime())) {
        return timestampStr;
      }
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays < 7) return `${diffDays} hari lalu`;
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return timestampStr;
    }
  };
  
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
  
  // Social share count simulation states
  const [shareCounts, setShareCounts] = useState<Record<string, { total: number; facebook: number; twitter: number; whatsapp: number }>>({});
  const [isFetchingShares, setIsFetchingShares] = useState<Record<string, boolean>>({});
  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const [shareSheetArticle, setShareSheetArticle] = useState<Article | null>(null);
  const [isSharingPlatform, setIsSharingPlatform] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isPulsingTotal, setIsPulsingTotal] = useState<boolean>(false);
  const [isPulsingPlatform, setIsPulsingPlatform] = useState<"facebook" | "twitter" | "whatsapp" | null>(null);

  const fetchShareCountsForArticle = async (articleId: string) => {
    if (isFetchingShares[articleId]) return;

    setIsFetchingShares(prev => ({ ...prev, [articleId]: true }));

    try {
      const res = await fetch("/api/shares");
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      const data = await res.json();
      if (data.success && data.shares && data.shares[articleId]) {
        setShareCounts(prev => ({
          ...prev,
          [articleId]: data.shares[articleId]
        }));
        setIsFetchingShares(prev => ({ ...prev, [articleId]: false }));
        return;
      }
    } catch (err) {
      console.warn("Failed to fetch backend share counts:", err);
    }

    // Generate stable seed counts as fallback
    const article = articles.find(a => String(a.id) === String(articleId));
    const baseShares = article?.shares || 0;
    const seed = parseInt(String(articleId).replace(/\D/g, "").slice(-4) || "123", 10);
    const fb = baseShares > 0 ? Math.floor(baseShares * 0.4) : (seed % 15) + 5;
    const tw = baseShares > 0 ? Math.floor(baseShares * 0.3) : ((seed * 2) % 10) + 3;
    const wa = baseShares > 0 ? Math.floor(baseShares * 0.3) : ((seed * 3) % 12) + 4;
    
    setShareCounts(prev => ({
      ...prev,
      [articleId]: {
        total: fb + tw + wa,
        facebook: fb,
        twitter: tw,
        whatsapp: wa
      }
    }));
    setIsFetchingShares(prev => ({ ...prev, [articleId]: false }));
  };

  const simulatePostShare = async (articleId: string, platform: "facebook" | "twitter" | "whatsapp") => {
    if (isSharingPlatform) return;
    
    setIsSharingPlatform(platform);
    setShareMessage(`Menghubungkan ke API ${platform === "whatsapp" ? "WhatsApp" : platform === "facebook" ? "Facebook" : "Twitter/X"}...`);

    // Dynamic sharing action execution
    try {
      const article = articles.find(a => String(a.id) === String(articleId));
      const title = article ? article.title : "Berita Utama";
      const summary = article ? (article.summary || "") : "";
      const slug = article ? slugify(article.title) : "";
      const siteUrl = `${getSiteOrigin()}/artikel/${slug}`;
      let shareUrl = "";
      
      if (platform === "whatsapp") {
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`*${title}*\n\n${summary}\n\nBaca selengkapnya di Majalengka Post:\n${siteUrl}`)}`;
      } else if (platform === "facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
      } else if (platform === "twitter") {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(siteUrl)}`;
      }
      
      if (shareUrl) {
        window.open(shareUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.warn("Failed to open share window:", err);
    }

    // Real API call to track/update share
    try {
      const res = await fetch("/api/shares/increment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, platform })
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      const data = await res.json();
      if (data.success && data.shares) {
        setShareCounts(prev => ({
          ...prev,
          [articleId]: data.shares
        }));
      } else {
        setShareCounts(prev => {
          const current = prev[articleId] || { total: 0, facebook: 0, twitter: 0, whatsapp: 0 };
          const updated = {
            ...current,
            [platform]: current[platform] + 1,
            total: current.total + 1
          };
          return { ...prev, [articleId]: updated };
        });
      }
    } catch (err) {
      console.warn("Failed to increment share count on backend, falling back:", err);
      setShareCounts(prev => {
        const current = prev[articleId] || { total: 0, facebook: 0, twitter: 0, whatsapp: 0 };
        const updated = {
          ...current,
          [platform]: current[platform] + 1,
          total: current.total + 1
        };
        return { ...prev, [articleId]: updated };
      });
    }

    setIsSharingPlatform(null);
    setShareMessage(`Sukses! Berita berhasil dibagikan ke ${platform === "whatsapp" ? "WhatsApp" : platform === "facebook" ? "Facebook" : "Twitter/X"}.`);
    
    // Trigger share count pulse animation
    setIsPulsingPlatform(platform);
    setIsPulsingTotal(true);
    setTimeout(() => {
      setIsPulsingPlatform(null);
      setIsPulsingTotal(false);
    }, 1500);

    // Clear toast after 3 seconds
    setTimeout(() => {
      setShareMessage(null);
    }, 3000);
  };

  const handleCopyLink = (articleId: string) => {
    setShareMessage("Menyalin tautan berita...");
    setTimeout(() => {
      try {
        navigator.clipboard.writeText(`${window.location.origin}/#artikel-${articleId}`);
        setShareMessage("Tautan berita berhasil disalin ke clipboard!");
      } catch (err) {
        setShareMessage("Gagal menyalin tautan, silakan coba lagi.");
      }
      setTimeout(() => {
        setShareMessage(null);
      }, 3000);
    }, 400);
  };

  useEffect(() => {
    if (selectedArticle) {
      fetchShareCountsForArticle(selectedArticle.id);
    }
  }, [selectedArticle]);

  // Listen to footer hash navigation for categories in mobile view
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      let matchedCategory = "";
      if (hash === "#politik") {
        matchedCategory = "Politik";
      } else if (hash === "#ekonomi") {
        matchedCategory = "Ekonomi";
      } else if (hash === "#teknologi") {
        matchedCategory = "Teknologi";
      } else if (hash === "#travel") {
        matchedCategory = "Lifestyle";
      }

      if (matchedCategory) {
        onSelectCategory(matchedCategory);
        onSelectArticle(null); // Close any open article details
        setActiveTab("berita"); // Switch to Berita tab
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Clear hash to allow re-clicking the same category
        window.history.replaceState(null, "", " ");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run once in case of initial hash
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [onSelectCategory, onSelectArticle]);
  
  // Font zoom controls for reader
  const [readerFontSize, setReaderFontSize] = useState<number>(16);

  // Audio Text-to-Speech reader state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeechInstance, setAudioSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);

  // Active Banners for Mobile
  const activeHeaderBanners = (banners || []).filter(b => b.position === "header" && b.active);
  const centerBanners = (banners || []).filter(b => b.active && (b.position === "center" || b.position === "sidebar" || b.position === "footer"));
  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);

  // Auto-rotate header banners on mobile
  useEffect(() => {
    if (activeHeaderBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeaderIndex(prev => (prev + 1) % activeHeaderBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeHeaderBanners.length]);

  // Tanya AI Chat state
  const [showAIChat, setShowAIChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; timestamp: string }>>([
    { 
      sender: "ai", 
      text: "Sampurasun! 🙏 Saya Tanya AI, asisten virtual pintar Majalengka Post. Tanyakan apa saja seputar berita terkini di Majalengka, wisata lokal (seperti Terasering Panyaweuyan atau Situ Cipanten), kuliner khas, draf tulisan, atau info menarik lainnya di Kabupaten Majalengka!", 
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) 
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isTypingChat, setIsTypingChat] = useState<boolean>(false);

  const handleSendChatMessage = async (textToSend?: string) => {
    const rawText = textToSend || chatInput;
    if (!rawText.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: rawText,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsTypingChat(true);

    try {
      // Keep last 10 messages as conversation history context
      const chatHistory = [...chatMessages, userMsg].slice(-10).map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      const data = await response.json();
      
      setChatMessages(prev => [...prev, {
        sender: "ai" as const,
        text: data.result || "Maaf, saya tidak dapat merespons saat ini. Silakan coba beberapa saat lagi.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      }]);
    } catch (err) {
      console.error("Error sending chat message:", err);
      setChatMessages(prev => [...prev, {
        sender: "ai" as const,
        text: "Maaf, terjadi gangguan koneksi. Pastikan koneksi internet Anda stabil.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setIsTypingChat(false);
    }
  };

  // FAB Form submissions
  const [showKirimBeritaSheet, setShowKirimBeritaSheet] = useState<boolean>(false);
  const [showUploadFotoSheet, setShowUploadFotoSheet] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    category: "Nasional",
    location: "Majalengka",
    content: ""
  });
  const [uploadPhotoData, setUploadPhotoData] = useState({
    name: "",
    category: "Nasional",
    imageUrl: ""
  });
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Ref for scroll tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showAIChat) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTypingChat, showAIChat]);

  // Live TV Chat simulated states
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{ id: number; name: string; text: string }>>([
    { id: 1, name: "Budi_S", text: "Mantap beritanya!" },
    { id: 2, name: "Siti_Kurnia", text: "Semoga Majalengka makin jaya." },
    { id: 3, name: "Agus_Hermawan", text: "Inovasi yang luar biasa." }
  ]);
  const [newLiveMessage, setNewLiveMessage] = useState<string>("");
  const [liveViewerCount, setLiveViewerCount] = useState<number>(1340);

  // Mobile Live Stream Audio & Sharing states
  const [isLiveMuted, setIsLiveMuted] = useState<boolean>(false);
  const [liveVolumeLevel, setLiveVolumeLevel] = useState<number>(80);
  const [mobileLiveShareCopied, setMobileLiveShareCopied] = useState<boolean>(false);
  const mobileLiveVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (mobileLiveVideoRef.current) {
      mobileLiveVideoRef.current.muted = isLiveMuted;
      mobileLiveVideoRef.current.volume = isLiveMuted ? 0 : liveVolumeLevel / 100;
    }
  }, [isLiveMuted, liveVolumeLevel]);

  // Handle splash delay
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        try {
          sessionStorage.setItem("mp_splash_shown", "true");
        } catch {}
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Track header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsHeaderShadow(true);
      } else {
        setIsHeaderShadow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync auto-dark mode on mount if no choice is saved
  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // follow system theme if user hasn't explicitly set it
      onToggleDarkMode();
    };
    matchMedia.addEventListener("change", handleSystemThemeChange);
    return () => matchMedia.removeEventListener("change", handleSystemThemeChange);
  }, [darkMode, onToggleDarkMode]);

  // Pull to refresh gesture simulated
  const startY = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      const progress = Math.min(diff / 150, 1);
      setPullProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (isPulling) {
      if (pullProgress >= 0.8) {
        setIsRefreshing(true);
        setTimeout(() => {
          setIsRefreshing(false);
          setPullProgress(0);
          setIsPulling(false);
        }, 1500);
      } else {
        setPullProgress(0);
        setIsPulling(false);
      }
    }
  };

  // Bookmark toggling
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  // Likes toggling
  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds(prev => 
      prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id]
    );
  };

  // Text to speech implementation
  const startSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const sentence = text.replace(/<[^>]*>/g, ""); // strip HTML
      const u = new SpeechSynthesisUtterance(sentence.substring(0, 300));
      u.lang = "id-ID";
      u.onend = () => {
        setIsPlayingAudio(false);
      };
      u.onerror = () => {
        setIsPlayingAudio(false);
      };
      window.speechSynthesis.speak(u);
      setAudioSpeechInstance(u);
      setIsPlayingAudio(true);
    } else {
      alert("Browser Anda tidak mendukung Text-to-Speech.");
    }
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Generate simulated chats in live tab
  useEffect(() => {
    if (activeTab === "live") {
      const names = ["Rian", "Dewi_Post", "Gisela_M", "Bambang_S", "Taufik_H", "WargaLokal", "KabarMjk"];
      const messages = [
        "Nonton liputan langsung dari TKP",
        "Keren banget Majalengka Post!",
        "Infrastrukturnya cepet banget jadinya",
        "Semoga berkah pembangunan tol baru",
        "Wajib dibagikan nih linknya!",
        "Adem dengerin kabarnya",
        "Yuk mari kita dukung program digitalisasi AI"
      ];

      const interval = setInterval(() => {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setLiveChatMessages(prev => [
          ...prev.slice(-15), // keep last 15
          { id: Date.now(), name: randomName, text: randomMsg }
        ]);
        // randomly drift viewers
        setLiveViewerCount(prev => prev + Math.floor(Math.random() * 21) - 10);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Form Handlers
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    // Construct new simulated article
    const newArticle: Article = {
      id: `sim-${Date.now()}`,
      title: formData.title,
      summary: formData.summary || "Laporan berita warga tentang kondisi di lapangan.",
      content: `<p>${formData.content}</p>`,
      coverImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800",
      galleryImages: [],
      author: "Citizen Reporter (" + (formData.location || "Majalengka") + ")",
      editor: "Belum Direview",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      location: formData.location,
      category: formData.category,
      tags: ["Citizen Report", "Majalengka", formData.category],
      views: 1,
      shares: 0,
      likes: 0,
      bookmarks: 0,
      isBreaking: false,
      isHeadline: false,
      isTrending: false,
      isEditorialChoice: false,
      isFeatured: false,
      isSticky: false,
      status: 0 as any, // DRAFT state
      seo: {
        title: formData.title + " - Majalengka Post",
        description: formData.summary,
        keywords: "citizen report, majalengka",
        canonicalUrl: ""
      }
    };

    onAddArticle(newArticle);
    setFormSuccess("Berita Anda berhasil dikirim untuk direview oleh tim Redaksi Majalengka Post!");
    setFormData({ title: "", summary: "", category: "Nasional", location: "Majalengka", content: "" });
    setTimeout(() => {
      setFormSuccess(null);
      setShowKirimBeritaSheet(false);
      setShowFabMenu(false);
    }, 3000);
  };

  const handleUploadPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPhotoData.name || !uploadPhotoData.imageUrl) return;

    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      name: uploadPhotoData.name,
      type: "photo",
      url: uploadPhotoData.imageUrl,
      size: "340 KB",
      folder: "Citizen Upload",
      tags: ["warga", "upload", uploadPhotoData.category],
      created_at: new Date().toISOString()
    };

    onAddMedia(newItem);
    setFormSuccess("Foto lapangan berhasil diunggah ke Galeri Media Redaksi!");
    setUploadPhotoData({ name: "", category: "Nasional", imageUrl: "" });
    setTimeout(() => {
      setFormSuccess(null);
      setShowUploadFotoSheet(false);
      setShowFabMenu(false);
    }, 3000);
  };

  // Filtering articles based on tab & category
  const filteredArticles = articles.filter(art => {
    // Basic search filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return art.title.toLowerCase().includes(q) || art.summary.toLowerCase().includes(q);
    }
    
    // Tab specific
    if (activeTab === "video") {
      return art.category === "Video" || art.tags?.includes("Video") || art.videoUrl;
    }

    if (currentCategory) {
      return art.category === currentCategory;
    }

    return true;
  });

  // Headline Breaking list
  const breakingArticles = articles.filter(a => a.isBreaking);

  // Time of Day greeting generator
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 11) return "Selamat Pagi";
    if (hours < 15) return "Selamat Siang";
    if (hours < 19) return "Selamat Sore";
    return "Selamat Malam";
  };

  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short"
  });

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] font-sans select-none overflow-x-hidden ${fontFamily}`}
    >
      
      {/* ================= 1. SPLASH SCREEN ================= */}
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-red-700 dark:bg-slate-950 z-[100] flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl mb-4 border-4 border-red-500">
                <span className="text-red-700 font-black text-3xl tracking-tighter">MP</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
                MAJALENGKA<span className="opacity-85"> POST</span>
              </h1>
              <p className="text-xs text-red-200 dark:text-slate-400 font-bold tracking-[0.2em] uppercase mt-2">
                Mobile App Experience
              </p>
            </motion.div>

            {/* Premium Loading Shimmer Line */}
            <div className="w-40 h-1 bg-red-900 dark:bg-slate-800 rounded-full mt-12 overflow-hidden relative">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 2. PREMIUM GLOSSY MOBILE HEADER ================= */}
      <header 
        style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
        }}
        className={`sticky top-0 z-40 backdrop-blur-md border-b border-slate-200 shadow-md shadow-slate-200/40 transition-all duration-300 ${
          isHeaderShadow ? "py-2" : "py-3"
        }`}
      >
        {/* Gloss highlight overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        
        {/* Highlight line at very top */}
        <div className="absolute top-0 inset-x-0 h-px bg-white pointer-events-none" />

        <div className="max-w-md mx-auto px-4 flex items-center justify-between gap-2.5 relative z-10">
          
          {/* Logo & Name */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0" 
            onClick={() => { onSelectCategory(""); onSelectArticle(null); setActiveTab("beranda"); }}
          >
            <img
              src={logoImg}
              className="w-9 h-9 object-contain rounded-full border border-slate-200 bg-white shadow-sm transition-transform active:scale-95 duration-200"
              alt="Majalengka Post Logo"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <h1 className="text-xs font-black text-slate-800 tracking-tight leading-none uppercase flex items-center">
                MAJALENGKA<span className="text-red-600 font-extrabold ml-0.5">POST</span>
              </h1>
              <span className="text-[7px] font-extrabold text-slate-500 tracking-[0.05em] uppercase leading-none mt-1">
                Suara Rakyat Majalengka
              </span>
            </div>
          </div>

          {/* Quick actions row */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Search Button */}
            <button 
              onClick={() => setShowSearchOverlay(true)}
              className="w-8.5 h-8.5 rounded-xl border border-slate-200 flex items-center justify-center focus:outline-none focus:scale-95 transition-all relative overflow-hidden shadow-xs"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <Search className="w-3.5 h-3.5 text-slate-700" />
            </button>

            {/* Notification Button */}
            <button 
              onClick={() => setShowNotificationCenter(true)}
              className="w-8.5 h-8.5 rounded-xl border border-slate-200 flex items-center justify-center focus:outline-none focus:scale-95 transition-all relative overflow-hidden shadow-xs"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <Bell className="w-3.5 h-3.5 text-slate-700" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-600 border border-white animate-pulse" />
              )}
            </button>

            {/* Profile/Menu Button */}
            <button 
              onClick={() => setShowProfileSheet(true)}
              className="w-8.5 h-8.5 rounded-xl border border-slate-200 flex items-center justify-center focus:outline-none focus:scale-95 transition-all relative overflow-hidden shadow-xs"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <User className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2.5. COMPACT REAL-TIME VALAS & MARKET TICKER (HORIZONTAL ANIMATING MARQUEE) ================= */}
      <div className="bg-slate-950 text-white py-2 border-b border-slate-900 relative z-30 overflow-hidden shadow-sm">
        <div className="max-w-md mx-auto px-4 flex items-center gap-2.5">
          {/* Ticker label */}
          <span className="bg-emerald-600 text-white text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 shadow-sm border-t border-white/10 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
            KURS VALAS
          </span>
          {/* Horizontal scrollable marquee using Framer Motion */}
          <div className="flex-1 overflow-hidden relative">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 20,
                repeat: Infinity
              }}
              className="flex items-center gap-3 whitespace-nowrap py-0.5 text-[10px] font-extrabold font-mono w-max"
            >
              {[...Array(2)].flatMap((_, idx) => 
                (valasRates && valasRates.length > 0 ? valasRates : CURRENCY_RATES).map((curr, cIdx) => {
                  const isDown = curr.change.startsWith("-");
                  return (
                    <div key={`${curr.code}-${idx}-${cIdx}`} className="flex items-center gap-1.5 shrink-0 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800/50">
                      <span className="text-slate-400">{curr.code}</span>
                      <span className="text-slate-100 font-bold">{curr.rate}</span>
                      <span className={`flex items-center gap-0.5 ${isDown ? "text-red-400" : "text-emerald-400"}`}>
                        {isDown ? "▼" : "▲"} {curr.change.replace(/[+-]/g, "")}
                      </span>
                    </div>
                  );
                })
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= 7. SMOOTH BREAKING NEWS TICKER ================= */}
      {breakingArticles.length > 0 && (
        <div className="bg-red-700 dark:bg-red-900 text-white py-2 overflow-hidden border-b border-red-800 relative z-30">
          <div className="max-w-md mx-auto px-4 flex items-center gap-3">
            <span className="bg-white text-red-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-xs shrink-0 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 animate-pulse text-red-600" />
              BREAKING
            </span>
            <div className="flex-1 overflow-hidden relative">
              <div className="whitespace-nowrap animate-marquee text-xs font-bold uppercase tracking-wide">
                {breakingArticles.map((art, idx) => (
                  <span key={art.id} className="mr-12 inline-block cursor-pointer" onClick={() => onSelectArticle(art)}>
                    🔥 {art.title} •
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pull To Refresh Loader Visualizer */}
      {pullProgress > 0 && (
        <div className="flex justify-center py-2 bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs transition-all duration-200">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 animate-spin" style={{ transform: `rotate(${pullProgress * 360}deg)` }} />
            <span>{isRefreshing ? "Menyegarkan Berita..." : "Tarik untuk menyegarkan"}</span>
          </div>
        </div>
      )}

      {/* Main viewport area */}
      <main className="max-w-md mx-auto px-4 mt-4">

        {/* ================= SELECTED ARTICLE DETAIL VIEW (Slide In Simulation) ================= */}
        {selectedArticle ? (
          <motion.article
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="pb-20"
          >
            {/* Back to feed button */}
            <button 
              onClick={() => { onSelectArticle(null); stopSpeech(); }}
              className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-red-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            {/* Parallax cover image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg mb-4">
              <img 
                src={selectedArticle.coverImage} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              
              {/* Category Badge on top of Image */}
              <span className="absolute bottom-4 left-4 bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md border-t border-white/15">
                {selectedArticle.category}
              </span>
            </div>

            {/* Read / Listen Text-to-Speech bar */}
            <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-3 flex items-center justify-between gap-3 mb-5 border border-slate-200/50 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-red-600" />
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Audio Reader</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isPlayingAudio ? (
                  <button 
                    onClick={stopSpeech}
                    className="bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md border-t border-white/10"
                  >
                    <Pause className="w-3 h-3" />
                    <span>Hentikan</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => startSpeech(`${selectedArticle.title}. ${selectedArticle.summary}`)}
                    className="bg-slate-200 dark:bg-slate-800 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Dengarkan</span>
                  </button>
                )}
                
                {/* Font control buttons */}
                <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
                <button 
                  onClick={() => setReaderFontSize(p => Math.max(12, p - 2))}
                  className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg"
                  title="Perkecil Tulisan"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setReaderFontSize(p => Math.min(24, p + 2))}
                  className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg"
                  title="Perbesar Tulisan"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Article Metadata */}
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight mb-3">
              {selectedArticle.title}
            </h1>

            {selectedArticle.subTitle && (
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-4 italic">
                {selectedArticle.subTitle}
              </p>
            )}

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-4 mb-4 text-xs text-slate-400">
              <span className="font-extrabold text-slate-600 dark:text-slate-300">Oleh: {selectedArticle.author}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{selectedArticle.date}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{selectedArticle.time} WIB</span>
            </div>

            {/* Article Content with adjustable font size */}
            <div 
              className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 mb-6 leading-relaxed"
              style={{ fontSize: `${readerFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />

            {/* ================= MOBILE READER REACTIONS SECTION ================= */}
            <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-900/60 relative">
              <h4 className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3 flex items-center gap-1 select-none">
                <span>🎭</span> REAKSI ANDA UNTUK ARTIKEL INI
              </h4>
              
              <div className="flex items-center justify-between gap-1.5 bg-slate-50 dark:bg-slate-950/40 p-2 rounded-2xl border border-slate-100 dark:border-slate-850/60 relative z-10">
                
                {/* Horizontal Scrollable Reaction Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 pr-2">
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
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-full text-[10px] font-bold hover:bg-red-50 dark:hover:bg-red-950/10 hover:border-red-500/40 dark:hover:border-red-500/40 transition-all active:scale-90 flex-shrink-0 shadow-xs cursor-pointer text-slate-700 dark:text-slate-300"
                        title={label}
                      >
                        <span className="text-sm">{emoji}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold">{count > 0 ? count : ""}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Drop-up/Popup Emoji Picker Toggle */}
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowArticleEmojiPicker(!showArticleEmojiPicker)}
                    className={`p-1.5 border rounded-full text-xs font-black transition-all active:scale-95 shadow-xs flex items-center justify-center cursor-pointer ${
                      showArticleEmojiPicker
                        ? "bg-red-100 dark:bg-red-950/40 border-red-500/40 text-red-600 dark:text-red-400"
                        : "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:border-red-500/30"
                    }`}
                    title="Pilih Emoji Lain"
                  >
                    <span>➕</span>
                  </button>

                  {/* Drop-up Emoji Picker Panel */}
                  {showArticleEmojiPicker && (
                    <div className="absolute bottom-full mb-3 right-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl z-50 animate-fade-in text-left w-52">
                      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-100 dark:border-slate-850">
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Pilih Emoji</span>
                        <button 
                          type="button" 
                          onClick={() => setShowArticleEmojiPicker(false)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[9px] font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-5 gap-1 max-h-[120px] overflow-y-auto no-scrollbar">
                        {[
                          // Row 1
                          '😊', '🥰', '😍', '😘', '😜',
                          // Row 2
                          '🤔', '🤨', '🙄', '😬', '🤫',
                          // Row 3
                          '😎', '😈', '👻', '💀', '👽',
                          // Row 4
                          '👏', '🙌', '🙏', '💪', '💥',
                          // Row 5
                          '🎉', '💡', '💯', '🚀', '⭐',
                          // Row 6
                          '🤯', '😭', '😡', '😱', '🤡'
                        ].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              handleArticleReaction(selectedArticle.id, emoji);
                              setShowArticleEmojiPicker(false);
                            }}
                            className="text-base p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-all flex items-center justify-center active:scale-90 hover:scale-110 cursor-pointer"
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
                    className="absolute text-2xl article-reaction-item-mobile"
                    style={{
                      left: `${reaction.left}%`,
                      bottom: "30px",
                      "--rot-mobile": `${reaction.rotate}deg`,
                      transform: `scale(${reaction.scale * 0.85})`,
                    } as React.CSSProperties}
                  >
                    {reaction.emoji}
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes articleReactionFloatMobile {
                0% {
                  transform: translateY(0) scale(0.3) rotate(0deg);
                  opacity: 0;
                }
                10% {
                  transform: translateY(-15px) scale(1.2) rotate(var(--rot-mobile));
                  opacity: 1;
                }
                100% {
                  transform: translateY(-220px) scale(0.7) rotate(calc(var(--rot-mobile) * 1.5));
                  opacity: 0;
                }
              }
              .article-reaction-item-mobile {
                animation: articleReactionFloatMobile 2.3s cubic-bezier(0.08, 0.82, 0.17, 1) forwards;
              }
            `}</style>

            {/* Like, share and bookmark bar */}
            <div className="flex items-center justify-between border-y border-slate-100 dark:border-slate-900 py-3 mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleLike(selectedArticle.id)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600"
                >
                  <Heart className={`w-5 h-5 ${likedIds.includes(selectedArticle.id) ? "fill-red-600 text-red-600" : ""}`} />
                  <span>{likedIds.includes(selectedArticle.id) ? (selectedArticle.likes || 0) + 1 : (selectedArticle.likes || 0)}</span>
                </button>
                <button className="flex items-center gap-1 text-xs font-bold text-slate-500">
                  <Eye className="w-5 h-5" />
                  <span>{selectedArticle.views || 1} x dibaca</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleBookmark(selectedArticle.id)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-500 hover:text-red-600"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(selectedArticle.id) ? "fill-red-600 text-red-600" : ""}`} />
                </button>
                <button 
                  onClick={() => {
                    setShareSheetArticle(selectedArticle);
                    setShowShareSheet(true);
                    fetchShareCountsForArticle(selectedArticle.id);
                  }}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-500 hover:text-red-600 flex items-center gap-1 focus:outline-none"
                >
                  <Share2 className="w-4 h-4" />
                  {isFetchingShares[selectedArticle.id] ? (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  ) : (
                    <motion.span
                      key={shareCounts[selectedArticle.id]?.total || 0}
                      animate={isPulsingTotal ? {
                        scale: [1, 1.5, 0.9, 1.2, 1],
                        color: ["#64748b", "#ef4444", "#ef4444", "#64748b"]
                      } : { scale: [1, 1.35, 1] }}
                      transition={{ duration: isPulsingTotal ? 1.0 : 0.35, ease: "easeInOut" }}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all duration-300 inline-block ${
                        isPulsingTotal ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-4 ring-red-500/20 font-extrabold scale-110" : ""
                      }`}
                    >
                      {shareCounts[selectedArticle.id]?.total || 0}
                    </motion.span>
                  )}
                </button>
              </div>
            </div>

            {/* Related articles slider */}
            <div className="mb-8">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Berita Terkait</h3>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {articles.filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category).slice(0, 4).map(art => (
                  <div 
                    key={art.id}
                    onClick={() => { onSelectArticle(art); stopSpeech(); }}
                    className="w-48 shrink-0 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer snap-start"
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-2">
                      <img src={art.coverImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-white line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Slide-Up simulated feedback form for comments */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">Komentar Pembaca</h3>
                {/* Custom-styled Sort Dropdown */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2 py-1 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Urutan:</span>
                  <select
                    value={commentSort}
                    onChange={(e) => setCommentSort(e.target.value as any)}
                    className="bg-transparent font-bold focus:outline-none cursor-pointer pr-1 text-xs"
                  >
                    <option value="Newest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Terbaru</option>
                    <option value="Oldest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Terlama</option>
                    <option value="Most Liked" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Terpopuler</option>
                  </select>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-4">
                <div className="space-y-4 max-h-[420px] overflow-y-auto mb-4 pr-1 scrollbar-thin">
                  {(() => {
                    const currentArticleComments = articleComments.filter(
                      c => String(c.articleId) === String(selectedArticle.id)
                    );

                    const displayComments = currentArticleComments.length > 0 ? currentArticleComments : [
                      {
                        id: `fallback-1-${selectedArticle.id}`,
                        articleId: selectedArticle.id,
                        user: "Agus Salim",
                        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Agus",
                        content: "Berita yang sangat mencerdaskan. Semoga bisa segera direalisasikan demi kelancaran Majalengka.",
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        likes: 12,
                        reported: false,
                        isModerated: true,
                        replies: [
                          {
                            id: `fallback-1-r1-${selectedArticle.id}`,
                            articleId: selectedArticle.id,
                            user: "Redaksi Majalengka Post",
                            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Redaksi",
                            content: "Terima kasih Pak Agus. Kami akan terus mengawal perkembangan program ini secara transparan.",
                            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                            likes: 8,
                            reported: false,
                            isModerated: true,
                            replies: []
                          }
                        ]
                      },
                      {
                        id: `fallback-2-${selectedArticle.id}`,
                        articleId: selectedArticle.id,
                        user: "Indah Wahyuni",
                        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Indah",
                        content: "Sangat bangga karya anak bangsa diakui dunia luar!",
                        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                        likes: 24,
                        reported: false,
                        isModerated: true,
                        replies: []
                      }
                    ];

                    const sorted = [...displayComments].sort((a, b) => {
                      if (commentSort === "Newest") {
                        const dateA = new Date(a.timestamp.replace(" ", "T")).getTime();
                        const dateB = new Date(b.timestamp.replace(" ", "T")).getTime();
                        return dateB - dateA;
                      } else if (commentSort === "Oldest") {
                        const dateA = new Date(a.timestamp.replace(" ", "T")).getTime();
                        const dateB = new Date(b.timestamp.replace(" ", "T")).getTime();
                        return dateA - dateB;
                      } else if (commentSort === "Most Liked") {
                        return b.likes - a.likes;
                      }
                      return 0;
                    });

                    return (
                      <AnimatePresence initial={false}>
                        {sorted.map((comment) => {
                          const hasReplies = comment.replies && comment.replies.length > 0;
                          const isCollapsed = collapsedThreads[comment.id] || false;
                          const isReplyingToThisComment = activeReplyId === comment.id;

                          return (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: -12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              layout
                              className="text-xs pb-3.5 border-b border-slate-100 dark:border-slate-850/60 last:border-0 last:pb-0"
                            >
                              {/* Parent Comment Header */}
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <img src={comment.avatar} alt={comment.user} className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 dark:border-slate-800" />
                                  <div>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{comment.user}</span>
                                    <span className="text-[10px] text-slate-400 mx-1.5">• {formatCommentTime(comment.timestamp)}</span>
                                  </div>
                                </div>
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.85 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                  onClick={() => handleLikeComment(comment.id)}
                                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800"
                                >
                                  <ThumbsUp className="w-2.5 h-2.5" />
                                  <span>{comment.likes}</span>
                                </motion.button>
                              </div>

                              {/* Comment Content */}
                              <p className="text-slate-700 dark:text-slate-300 mt-1.5 ml-8 leading-relaxed font-normal">{comment.content}</p>

                              {/* Action Bar: Reply button & Reply thread toggle */}
                              <div className="flex items-center gap-3 ml-8 mt-2 text-[10px]">
                                <button
                                  onClick={() => {
                                    if (activeReplyId === comment.id) {
                                      setActiveReplyId(null);
                                      setActiveReplyParentId(null);
                                      setActiveReplyTargetUser("");
                                    } else {
                                      setActiveReplyId(comment.id);
                                      setActiveReplyParentId(comment.id);
                                      setActiveReplyTargetUser(comment.user);
                                      setReplyUserName(newCommentName || "");
                                    }
                                  }}
                                  className="font-bold text-[#E60023] dark:text-red-400 hover:underline flex items-center gap-1 uppercase tracking-wider"
                                >
                                  <Reply className="w-3 h-3" />
                                  {isReplyingToThisComment ? "Batal Balas" : "Balas"}
                                </button>

                                {hasReplies && (
                                  <button
                                    onClick={() => toggleThreadCollapse(comment.id)}
                                    className="font-extrabold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full text-[9.5px] transition-colors border border-slate-200/50 dark:border-slate-700/50"
                                  >
                                    <CornerDownRight className="w-2.5 h-2.5 text-[#E60023]" />
                                    <span>{comment.replies.length} Balasan</span>
                                    {isCollapsed ? <ChevronDown className="w-2.5 h-2.5 ml-0.5" /> : <ChevronUp className="w-2.5 h-2.5 ml-0.5" />}
                                  </button>
                                )}
                              </div>

                              {/* Inline Reply Form for Parent Comment */}
                              {isReplyingToThisComment && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="ml-8 mt-2.5 p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-red-200 dark:border-red-900/40 space-y-2"
                                >
                                  <div className="flex items-center justify-between text-[10px] text-red-600 dark:text-red-400 font-bold border-b border-red-100 dark:border-red-900/30 pb-1">
                                    <span className="flex items-center gap-1">
                                      <Reply className="w-3 h-3" /> Membalas <strong className="text-slate-800 dark:text-white">@{activeReplyTargetUser}</strong>
                                    </span>
                                    <button 
                                      onClick={() => {
                                        setActiveReplyId(null);
                                        setActiveReplyParentId(null);
                                        setActiveReplyTargetUser("");
                                      }}
                                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <input
                                    type="text"
                                    placeholder="Nama Anda..."
                                    value={replyUserName}
                                    onChange={(e) => setReplyUserName(e.target.value)}
                                    className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none text-slate-800 dark:text-slate-100"
                                  />

                                  <textarea
                                    placeholder={`Tulis balasan untuk @${activeReplyTargetUser}...`}
                                    rows={2}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none text-slate-800 dark:text-slate-100"
                                  />

                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setActiveReplyId(null);
                                        setActiveReplyParentId(null);
                                        setActiveReplyTargetUser("");
                                      }}
                                      className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg"
                                    >
                                      Batal
                                    </button>
                                    <button
                                      onClick={() => handleAddReply(comment.id, activeReplyTargetUser)}
                                      className="px-3 py-1 bg-gradient-to-r from-[#FF3B30] to-[#E60023] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm"
                                    >
                                      Kirim Balasan
                                    </button>
                                  </div>
                                </motion.div>
                              )}

                              {/* Render Nested Replies Thread */}
                              {hasReplies && !isCollapsed && (
                                <div className="ml-5 sm:ml-7 pl-3 border-l-2 border-[#E60023]/40 dark:border-red-500/40 space-y-2.5 mt-2.5">
                                  {comment.replies.map((reply) => {
                                    const isReplyingToChild = activeReplyId === reply.id;
                                    return (
                                      <div key={reply.id} className="text-xs bg-slate-50/80 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850/80">
                                        {/* Reply Header */}
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-center gap-1.5">
                                            <img src={reply.avatar} alt={reply.user} className="w-5 h-5 rounded-full bg-slate-200 border border-slate-300 dark:border-slate-800" />
                                            <div className="flex items-center flex-wrap gap-1">
                                              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{reply.user}</span>
                                              {(reply.user.includes("Editor") || reply.user.includes("Redaksi")) && (
                                                <span className="text-[8px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">REDAKSI</span>
                                              )}
                                              <span className="text-[9px] text-slate-400">• {formatCommentTime(reply.timestamp)}</span>
                                            </div>
                                          </div>

                                          <button
                                            onClick={() => handleLikeComment(reply.id)}
                                            className="flex items-center gap-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800"
                                          >
                                            <ThumbsUp className="w-2 h-2" />
                                            <span>{reply.likes}</span>
                                          </button>
                                        </div>

                                        {/* Reply Content */}
                                        <p className="text-slate-600 dark:text-slate-300 mt-1 ml-6 leading-relaxed text-[11px]">
                                          {reply.content}
                                        </p>

                                        {/* Reply Action button */}
                                        <div className="ml-6 mt-1 flex items-center gap-2">
                                          <button
                                            onClick={() => {
                                              if (activeReplyId === reply.id) {
                                                setActiveReplyId(null);
                                                setActiveReplyParentId(null);
                                                setActiveReplyTargetUser("");
                                              } else {
                                                setActiveReplyId(reply.id);
                                                setActiveReplyParentId(comment.id);
                                                setActiveReplyTargetUser(reply.user);
                                                setReplyUserName(newCommentName || "");
                                              }
                                            }}
                                            className="text-[9.5px] font-bold text-[#E60023] dark:text-red-400 hover:underline flex items-center gap-0.5 uppercase tracking-wider"
                                          >
                                            <Reply className="w-2.5 h-2.5" />
                                            {isReplyingToChild ? "Batal" : "Balas"}
                                          </button>
                                        </div>

                                        {/* Inline Reply Form when replying directly to this nested reply */}
                                        {isReplyingToChild && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-red-300 dark:border-red-900/50 space-y-1.5"
                                          >
                                            <div className="flex items-center justify-between text-[9px] text-red-600 dark:text-red-400 font-bold">
                                              <span>Membalas @{activeReplyTargetUser}</span>
                                              <button 
                                                onClick={() => {
                                                  setActiveReplyId(null);
                                                  setActiveReplyParentId(null);
                                                  setActiveReplyTargetUser("");
                                                }}
                                                className="text-slate-400 hover:text-slate-600"
                                              >
                                                <X className="w-2.5 h-2.5" />
                                              </button>
                                            </div>

                                            <input
                                              type="text"
                                              placeholder="Nama Anda..."
                                              value={replyUserName}
                                              onChange={(e) => setReplyUserName(e.target.value)}
                                              className="w-full text-[11px] px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded focus:outline-none text-slate-800 dark:text-slate-100"
                                            />

                                            <textarea
                                              placeholder={`Tulis balasan untuk @${activeReplyTargetUser}...`}
                                              rows={2}
                                              value={replyText}
                                              onChange={(e) => setReplyText(e.target.value)}
                                              className="w-full text-[11px] px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded focus:outline-none text-slate-800 dark:text-slate-100"
                                            />

                                            <div className="flex justify-end gap-1.5">
                                              <button
                                                onClick={() => {
                                                  setActiveReplyId(null);
                                                  setActiveReplyParentId(null);
                                                  setActiveReplyTargetUser("");
                                                }}
                                                className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-bold rounded"
                                              >
                                                Batal
                                              </button>
                                              <button
                                                onClick={() => handleAddReply(comment.id, activeReplyTargetUser)}
                                                className="px-2.5 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase rounded"
                                              >
                                                Kirim
                                              </button>
                                            </div>
                                          </motion.div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    );
                  })()}
                </div>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-3">
                  <input 
                    type="text" 
                    placeholder="Nama Anda..." 
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                  <textarea 
                    placeholder="Tulis opini konstruktif Anda..." 
                    rows={2}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                  <button 
                    onClick={() => handleAddComment(selectedArticle.id)}
                    className="w-full py-2.5 bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] border-t border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                  >
                    Kirim Komentar
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ) : (
          
          /* ================= PORTAL FEED DIRECTORY (Beranda/Berita/Video/Live) ================= */
          <div>
            
            {/* SEARCH MODERN COMPONENT (Only shown if search query active) */}
            {searchQuery && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2.5">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Hasil Pencarian untuk: <span className="text-slate-800 dark:text-white">"{searchQuery}"</span>
                  </h3>
                  <button 
                    onClick={() => onSearchChange("")}
                    className="text-xs text-red-600 dark:text-red-400 font-extrabold"
                  >
                    Bersihkan
                  </button>
                </div>
              </div>
            )}

            {/* Render dynamically based on Tab */}
            {activeTab === "beranda" && (
              <div>
                
                {/* ADVERTISEMENT ROTATING HEADER BANNER */}
                {activeHeaderBanners.length > 0 && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative">
                    <div className="w-full relative flex items-center h-[90px]">
                      <a
                        href={activeHeaderBanners[currentHeaderIndex].adUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-full block"
                      >
                        <img
                          src={activeHeaderBanners[currentHeaderIndex].imageUrl}
                          alt={activeHeaderBanners[currentHeaderIndex].title}
                          className="w-full h-full object-cover"
                        />
                      </a>
                      
                      {/* Advertisement Badge overlay */}
                      <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-[8px] font-bold text-white px-1.5 py-0.5 rounded font-mono pointer-events-none uppercase tracking-wider">
                        IKLAN SPONSOR
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. GESTURE: SWIPEABLE CATEGORY SELECTOR CAROUSEL */}
                <div className="relative mb-5 z-20">
                  <div className="flex gap-2.5 overflow-x-auto pb-2.5 scrollbar-hide snap-x">
                    <button
                      onClick={() => onSelectCategory("")}
                      className={`px-4 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all shrink-0 snap-start ${
                        currentCategory === ""
                          ? "bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] text-white shadow-lg shadow-red-600/30 border-t border-white/20"
                          : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-850"
                      }`}
                    >
                      Terbaru
                    </button>
                    {CATEGORIES.slice(0, 15).map(cat => (
                      <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`px-4 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all shrink-0 snap-start ${
                          currentCategory === cat
                            ? "bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] text-white shadow-lg shadow-red-600/30 border-t border-white/20"
                            : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-850"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. HERO NEWS PREMIUM CARD */}
                {filteredArticles.length > 0 && !currentCategory && !searchQuery && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => onSelectArticle(filteredArticles[0])}
                    className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl mb-6 cursor-pointer group"
                  >
                    <img 
                      src={filteredArticles[0].coverImage} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                    
                    {/* Hero labels */}
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {filteredArticles[0].category}
                      </span>
                      {filteredArticles[0].isBreaking && (
                        <span className="bg-amber-500 text-gray-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                          BREAKING
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-white line-clamp-2 leading-snug uppercase mb-2">
                        {filteredArticles[0].title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-[10px] text-slate-300 font-bold">
                        <span>{filteredArticles[0].date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        <span>{filteredArticles[0].views || 102} dibaca</span>
                        <span className="ml-auto flex gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareSheetArticle(filteredArticles[0]);
                              setShowShareSheet(true);
                              fetchShareCountsForArticle(filteredArticles[0].id);
                            }}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors focus:outline-none"
                            title="Bagikan"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => toggleBookmark(filteredArticles[0].id, e)}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(filteredArticles[0].id) ? "fill-white" : ""}`} />
                          </button>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 6. MODERN MOBILE APPS FEED LIST */}
                <div className="space-y-4">
                  {filteredArticles.length === 0 ? (
                    /* 11. SKELETON SHIMMER SHADOW LOADING PRESETS */
                    <div className="space-y-4 pb-8">
                      {[1, 2, 3].map(n => (
                        <div key={n} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-[20px] p-4 flex gap-4">
                          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="w-16 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                            <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                            <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Render standard articles start index (1 if hero shown, else 0) */
                    filteredArticles.slice((!currentCategory && !searchQuery) ? 1 : 0).map((art, idx) => {
                      const showCenterAd = idx === 1 && centerBanners.length > 0;
                      return (
                        <div key={art.id} className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: idx * 0.05 }}
                            onClick={() => onSelectArticle(art)}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-[20px] overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer flex gap-3 p-3 relative"
                          >
                            {/* Big left side photo */}
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative bg-slate-100">
                              <img src={art.coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                              {art.videoUrl && (
                                <span className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                  <Play className="w-6 h-6 text-white fill-white animate-pulse" />
                                </span>
                              )}
                            </div>

                            {/* Text and badges */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
                                    {art.category}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-bold">{art.time}</span>
                                </div>
                                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                  {art.title}
                                </h4>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                <span>{art.location}</span>
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShareSheetArticle(art);
                                      setShowShareSheet(true);
                                      fetchShareCountsForArticle(art.id);
                                    }}
                                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-600 transition-colors focus:outline-none"
                                    title="Bagikan"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={(e) => toggleBookmark(art.id, e)}
                                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-600 transition-colors"
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(art.id) ? "fill-red-600 text-red-600" : ""}`} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {/* Center Sponsor Ad banner within list */}
                          {showCenterAd && (
                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-sm relative">
                              <div className="w-full relative flex items-center h-[90px]">
                                <a
                                  href={centerBanners[0].adUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full h-full block"
                                >
                                  <img
                                    src={centerBanners[0].imageUrl}
                                    alt={centerBanners[0].title}
                                    className="w-full h-full object-cover"
                                  />
                                </a>
                                <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-[8px] font-bold text-white px-1.5 py-0.5 rounded font-mono pointer-events-none uppercase tracking-wider">
                                  IKLAN SPONSOR
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Sholat Schedule Widget and Stock Rates in grid */}
                <div className="grid grid-cols-2 gap-3.5 mt-6 mb-8">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 rounded-3xl text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">🕌 Jadwal Sholat</span>
                    <h5 className="text-sm font-black text-red-600 dark:text-red-400">{SHOLAT_SCHEDULE.city}</h5>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] mt-2.5 font-bold">
                      <div className="bg-slate-50 dark:bg-slate-950 p-1 rounded-md">Subuh {SHOLAT_SCHEDULE.Subuh}</div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-1 rounded-md">Dzuhur {SHOLAT_SCHEDULE.Dzuhur}</div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-1 rounded-md">Ashar {SHOLAT_SCHEDULE.Ashar}</div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-1 rounded-md">Maghrib {SHOLAT_SCHEDULE.Maghrib}</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 rounded-3xl">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 text-center mb-2">📈 Pasar Saham</span>
                    <div className="space-y-1.5 text-[11px] font-bold">
                      {STOCK_MARKET.slice(0, 3).map(st => (
                        <div key={st.code} className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400">{st.code}</span>
                          <span className="font-mono">{st.value}</span>
                          <span className={st.trend === "up" ? "text-emerald-500" : "text-red-500"}>{st.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Polling Card */}
                {activePoll && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-3xl mb-8">
                    <span className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 inline-block">
                      POLLING PUBLIK
                    </span>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-normal mb-4">
                      {activePoll.question}
                    </h4>
                    <div className="space-y-2.5">
                      {activePoll.options.map(opt => (
                        <button 
                          key={opt.id}
                          onClick={() => onVotePoll(opt.id)}
                          className="w-full text-left text-xs bg-slate-50 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-100 dark:border-slate-850 rounded-2xl p-3 flex justify-between items-center font-bold transition-all"
                        >
                          <span className="text-slate-700 dark:text-slate-300 pr-4">{opt.text}</span>
                          <span className="font-mono bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-md shrink-0">
                            {opt.votes}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "berita" && (
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Kategori: <span className="text-red-600 dark:text-red-400">{currentCategory || "Semua Berita"}</span>
                </h3>
                <div className="space-y-4">
                  {filteredArticles.map((art, idx) => (
                    <div 
                      key={art.id}
                      onClick={() => onSelectArticle(art)}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 rounded-[20px] flex gap-3 cursor-pointer"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <img src={art.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">{art.date} • {art.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "video" && (
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  🎥 Galeri Liputan Video
                </h3>
                {filteredArticles.length === 0 ? (
                  <p className="text-xs text-slate-400">Belum ada liputan video tersedia.</p>
                ) : (
                  filteredArticles.map(art => (
                    <div 
                      key={art.id}
                      onClick={() => onSelectArticle(art)}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl overflow-hidden shadow-md cursor-pointer"
                    >
                      {/* Video Embed Simulation */}
                      <div className="aspect-video w-full bg-slate-950 relative flex items-center justify-center">
                        <img src={art.coverImage} alt="" className="w-full h-full object-cover opacity-70" />
                        <span className="absolute w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <Play className="w-6 h-6 fill-white ml-1 shrink-0" />
                        </span>
                      </div>
                      <div className="p-4">
                        <span className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 inline-block">
                          {art.category}
                        </span>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white mb-2 leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{art.summary}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "live" && (
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
                  {/* Dynamic Streaming TV Player */}
                  <div className="aspect-video w-full bg-slate-900 flex flex-col items-center justify-center relative">
                    {liveStreamActive ? (
                      liveStreamType === "youtube" ? (
                        <iframe
                          src={getYouTubeEmbedUrl(liveStreamUrl, isLiveMuted)}
                          title={liveStreamTitle || "Majalengka Post TV Live"}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : liveStreamType === "camera" ? (
                        activeCameraFrame ? (
                          <img
                            src={activeCameraFrame}
                            alt="Live Stream Feed"
                            className="w-full h-full object-cover transform -scale-x-100 absolute inset-0"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-slate-950">
                            <Radio className="w-8 h-8 text-red-600 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transmisi Belum Dimulai...</p>
                          </div>
                        )
                      ) : (
                        // Custom direct video source (MP4 / HLS / WebM)
                        <video
                          ref={mobileLiveVideoRef}
                          src={liveStreamUrl}
                          controls
                          autoPlay
                          muted={isLiveMuted}
                          loop
                          playsInline
                          className="w-full h-full object-contain absolute inset-0 bg-slate-950"
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-slate-950">
                        <Radio className="w-10 h-10 text-slate-600" />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Siaran Offline</p>
                      </div>
                    )}
                    
                    {/* Pulsing live badge */}
                    {liveStreamActive && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm flex items-center gap-1.5 shadow-md z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>LIVE</span>
                      </div>
                    )}

                    <div className="absolute top-4 right-4 bg-black/60 text-white text-[9px] font-black px-2 py-1 rounded-sm backdrop-blur-xs z-10">
                      👁️ {liveViewerCount} Pemirsa
                    </div>

                    {/* Quick Mute/Unmute Overlay Button on Video */}
                    {liveStreamActive && (
                      <button
                        type="button"
                        onClick={() => setIsLiveMuted(!isLiveMuted)}
                        className="absolute bottom-3 right-3 bg-black/80 hover:bg-black/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 border border-white/20 shadow-xl z-10 transition-all active:scale-95"
                      >
                        {isLiveMuted ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-red-300 font-extrabold uppercase text-[9px]">Mute</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                            <span className="text-green-300 font-extrabold uppercase text-[9px]">{liveVolumeLevel}%</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Title & Info Banner */}
                  <div className="p-4 bg-slate-900 text-white border-t border-slate-800">
                    <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Siaran Langsung Hari Ini</h4>
                    <p className="text-xs font-extrabold text-slate-200">{liveStreamTitle || "Sidang Paripurna DPR & Peninjauan Lokasi Bencana Tol Majalengka"}</p>

                    {/* Volume Suara Interactive Controls */}
                    <div className="mt-3.5 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          {isLiveMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-green-400" />}
                          Pengaturan Volume Suara
                        </span>
                        <span className="text-[10px] font-bold font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                          {isLiveMuted ? "Muted (0%)" : `${liveVolumeLevel}%`}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsLiveMuted(!isLiveMuted)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all ${
                            isLiveMuted 
                              ? "bg-red-950/80 text-red-400 border border-red-800/60" 
                              : "bg-slate-800 text-slate-200 border border-slate-700"
                          }`}
                        >
                          {isLiveMuted ? "Unmute" : "Mute"}
                        </button>

                        {/* Slider */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={isLiveMuted ? 0 : liveVolumeLevel}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setLiveVolumeLevel(val);
                            if (val > 0 && isLiveMuted) {
                              setIsLiveMuted(false);
                            } else if (val === 0) {
                              setIsLiveMuted(true);
                            }
                          }}
                          className="flex-1 accent-red-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />

                        {/* Quick Presets */}
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => { setLiveVolumeLevel(50); setIsLiveMuted(false); }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-extrabold px-2 py-1 rounded"
                          >
                            50%
                          </button>
                          <button
                            type="button"
                            onClick={() => { setLiveVolumeLevel(100); setIsLiveMuted(false); }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-extrabold px-2 py-1 rounded"
                          >
                            100%
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Pembagian Link (Sharing Links Portal) */}
                    <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Share2 className="w-3.5 h-3.5 text-red-400" /> Bagikan Siaran Langsung
                        </span>
                        {mobileLiveShareCopied && (
                          <span className="text-[9px] text-green-400 font-bold bg-green-950/80 border border-green-800 px-2 py-0.5 rounded animate-fade-in flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-400" /> Tautan Tersalin!
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`*🔴 LIVE STREAMING*: *${liveStreamTitle || "Majalengka Post TV"}*\n\nTonton siaran langsung sekarang:\n${window.location.origin}/?livetv=true`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider transition-all"
                        >
                          WhatsApp
                        </a>

                        {/* Facebook */}
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + "/?livetv=true")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 hover:bg-blue-500 text-white text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider transition-all"
                        >
                          Facebook
                        </a>

                        {/* Twitter / X */}
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔴 LIVE STREAMING: ${liveStreamTitle || "Majalengka Post TV"}`)}&url=${encodeURIComponent(window.location.origin + "/?livetv=true")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-sky-600 hover:bg-sky-500 text-white text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider transition-all"
                        >
                          Twitter/X
                        </a>

                        {/* Telegram */}
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + "/?livetv=true")}&text=${encodeURIComponent(`🔴 LIVE STREAMING: ${liveStreamTitle || "Majalengka Post TV"}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-cyan-600 hover:bg-cyan-500 text-white text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider transition-all"
                        >
                          Telegram
                        </a>

                        {/* Email */}
                        <a
                          href={`mailto:?subject=${encodeURIComponent(`Live Streaming Majalengka Post: ${liveStreamTitle || "Siaran Langsung"}`)}&body=${encodeURIComponent(`Saksikan siaran langsung Majalengka Post TV:\n${liveStreamTitle || "Siaran Langsung"}\n\nTonton di:\n${window.location.origin}/?livetv=true`)}`}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider transition-all"
                        >
                          <Mail className="w-3 h-3" />
                          Email
                        </a>

                        {/* Salin Link */}
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(window.location.origin + "/?livetv=true");
                              setMobileLiveShareCopied(true);
                              setTimeout(() => setMobileLiveShareCopied(false), 2500);
                            } catch {
                              alert("Tautan live streaming berhasil disalin!");
                            }
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider transition-all border border-slate-700"
                        >
                          <Copy className="w-3 h-3 text-red-400" />
                          Salin
                        </button>

                        {/* Web Share / Lainnya */}
                        <button
                          type="button"
                          onClick={async () => {
                            const shareData = {
                              title: `LIVE STREAMING: ${liveStreamTitle || "Majalengka Post TV"}`,
                              text: `Saksikan siaran langsung Majalengka Post TV`,
                              url: `${window.location.origin}/?livetv=true`
                            };
                            if (navigator.share) {
                              try {
                                await navigator.share(shareData);
                              } catch {}
                            } else {
                              await navigator.clipboard.writeText(shareData.url);
                              setMobileLiveShareCopied(true);
                              setTimeout(() => setMobileLiveShareCopied(false), 2500);
                            }
                          }}
                          className="col-span-1 sm:col-span-2 bg-red-600 hover:bg-red-500 text-white text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider transition-all"
                        >
                          <Share2 className="w-3 h-3" />
                          Lainnya...
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Chat Comments Simulation */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-4 flex flex-col h-60">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Obrolan Langsung (Live Chat)</span>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin text-xs">
                    {liveChatMessages.map(msg => (
                      <div key={msg.id} className="leading-snug">
                        <span className="font-extrabold text-red-600 dark:text-red-400 mr-1.5">@{msg.name}:</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{msg.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Send live comment input */}
                  <div className="flex gap-2 border-t border-slate-100 dark:border-slate-850 pt-3 mt-2">
                    <input 
                      type="text" 
                      placeholder="Ikut mengobrol..." 
                      value={newLiveMessage}
                      onChange={(e) => setNewLiveMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newLiveMessage) {
                          setLiveChatMessages(p => [...p, { id: Date.now(), name: "Anda", text: newLiveMessage }]);
                          setNewLiveMessage("");
                        }
                      }}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-800 dark:text-slate-100"
                    />
                    <button 
                      onClick={() => {
                        if (newLiveMessage) {
                          setLiveChatMessages(p => [...p, { id: Date.now(), name: "Anda", text: newLiveMessage }]);
                          setNewLiveMessage("");
                        }
                      }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] flex items-center justify-center text-white font-bold hover:brightness-110 active:scale-95 transition-transform shrink-0 border-t border-white/20 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Footer in Mobile View */}
      <Footer />

      {/* ================= 4. FLOATING ACTION BUTTON (FAB) & CHAT AI ================= */}
      <div className="fixed bottom-24 right-5 z-40">
        <div className="relative">
          <button 
            onClick={() => setShowAIChat(true)}
            className="w-14 h-14 bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] text-white rounded-full flex items-center justify-center shadow-[0_12px_24px_rgba(230,0,35,0.4)] hover:scale-105 active:scale-95 hover:shadow-[0_16px_32px_rgba(230,0,35,0.5)] transition-all focus:outline-none relative border border-white/30 dark:border-slate-850 group"
          >
            {/* Glowing backdrop ripple */}
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25 group-hover:opacity-40 transition-opacity" />
            <MessageSquare className="w-5.5 h-5.5 fill-white/10 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Tiny ambient Sparkles icon on top right corner */}
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-1 border border-white dark:border-slate-900 shadow-sm animate-bounce" style={{ animationDuration: "3s" }}>
              <Sparkles className="w-2.5 h-2.5 fill-amber-400 text-slate-900" />
            </span>
          </button>
        </div>
      </div>

      {/* Tanya AI Bottom Sheet */}
      <AnimatePresence>
        {showAIChat && (
          <>
            {/* Backdrop for focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAIChat(false)}
              className="fixed inset-0 bg-slate-950/60 z-50 backdrop-blur-xs"
            />

            {/* Floating Chat Sheet */}
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-[80vh] bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl flex flex-col z-50 overflow-hidden border-t border-slate-200/50 dark:border-slate-800/80"
            >
              {/* Pull bar */}
              <div className="w-full flex justify-center py-3 shrink-0">
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 pb-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white shadow-md relative">
                    <Sparkles className="w-5 h-5 fill-white/10 animate-pulse" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-none">Tanya AI</h3>
                      <span className="text-[9px] bg-red-105 dark:bg-red-950 text-red-600 dark:text-red-400 font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">BETA</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">Asisten Pintar Majalengka Post</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIChat(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none"
                >
                  <ArrowLeft className="w-4 h-4 rotate-270" />
                </button>
              </div>

              {/* Message area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-semibold shadow-xs ${
                        msg.sender === "user"
                          ? "bg-gradient-to-br from-[#FF3B30] to-[#E60023] text-white rounded-br-none"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-150 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold mt-1.5 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTypingChat && (
                  <div className="flex flex-col items-start">
                    <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl rounded-bl-none px-4 py-3 text-xs shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions chips horizontally scrollable */}
              <div className="px-5 py-2.5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/30 shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
                  {[
                    "Apa berita utama hari ini?",
                    "Rekomendasi wisata hits Majalengka",
                    "Apa makanan khas Majalengka?",
                    "Ringkas berita terpopuler"
                  ].map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendChatMessage(sug)}
                      className="snap-center shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:border-red-300 dark:hover:border-red-900 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-all focus:outline-none shadow-xs"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60 flex gap-2.5 items-center shrink-0 pb-7">
                <input
                  type="text"
                  placeholder="Tanyakan berita atau info Majalengka..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChatMessage();
                  }}
                  disabled={isTypingChat}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-red-500 dark:focus:border-red-500 text-slate-800 dark:text-slate-100 disabled:opacity-60 transition-colors"
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  disabled={!chatInput.trim() || isTypingChat}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] flex items-center justify-center text-white hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all shrink-0 border-t border-white/20 shadow-md focus:outline-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= 3. BOTTOM NAVIGATION (MOBILE PORTAL) ================= */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 border-t border-slate-100 dark:border-slate-900 z-40 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-lg">
        <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
          
          {/* Tab Beranda */}
          <button 
            onClick={() => { setActiveTab("beranda"); onSelectArticle(null); onSelectCategory(""); }}
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[56px] focus:outline-none ${
              activeTab === "beranda" ? "text-red-600 dark:text-red-400 scale-105" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-widest font-black">Beranda</span>
            {activeTab === "beranda" && (
              <motion.span layoutId="activeDot" className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400" />
            )}
          </button>

          {/* Tab Berita */}
          <button 
            onClick={() => { setActiveTab("berita"); onSelectArticle(null); }}
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[56px] focus:outline-none ${
              activeTab === "berita" ? "text-red-600 dark:text-red-400 scale-105" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <Newspaper className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-widest font-black">Berita</span>
            {activeTab === "berita" && (
              <motion.span layoutId="activeDot" className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400" />
            )}
          </button>

          {/* Tab Video */}
          <button 
            onClick={() => { setActiveTab("video"); onSelectArticle(null); }}
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[56px] focus:outline-none ${
              activeTab === "video" ? "text-red-600 dark:text-red-400 scale-105" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-widest font-black">Video</span>
            {activeTab === "video" && (
              <motion.span layoutId="activeDot" className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400" />
            )}
          </button>

          {/* Tab Live Streaming */}
          <button 
            onClick={() => { setActiveTab("live"); onSelectArticle(null); }}
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[56px] focus:outline-none relative ${
              activeTab === "live" ? "text-red-600 dark:text-red-400 scale-105" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-widest font-black">Live</span>
            {activeTab === "live" && (
              <motion.span layoutId="activeDot" className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-400" />
            )}
            <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          </button>

          {/* Tab Notifikasi */}
          <button 
            onClick={() => { setShowNotificationCenter(true); }}
            className="flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[56px] focus:outline-none text-slate-400 dark:text-slate-500"
          >
            <Bell className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-widest font-black">Notifikasi</span>
          </button>
        </div>
      </nav>

      {/* ================= 8. MODERN SEARCH OVERLAY (Mobile Banking Style) ================= */}
      <AnimatePresence>
        {showSearchOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 p-6 flex flex-col justify-start"
          >
            <div className="flex items-center gap-3.5 mb-8">
              <button 
                onClick={() => { setShowSearchOverlay(false); setLocalSearchQuery(""); onSearchChange(""); }}
                className="p-2.5 bg-slate-900 rounded-full text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 bg-slate-900 rounded-full px-4 py-3 flex items-center gap-3 border border-slate-800">
                <Search className="w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Cari berita penting di Majalengka..." 
                  value={localSearchQuery}
                  onChange={(e) => {
                    setLocalSearchQuery(e.target.value);
                    onSearchChange(e.target.value);
                  }}
                  className="bg-transparent border-none outline-none text-xs text-white w-full focus:ring-0"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick search helpers */}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Topik Populer Hari Ini</span>
            <div className="flex flex-wrap gap-2">
              {["AI Birokrasi", "Tol Trans-Sumatera", "Motor Hybrid", "Kariwisata Wae Rebo", "Pajak Karbon"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => {
                    setLocalSearchQuery(tag);
                    onSearchChange(tag);
                  }}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3.5 py-2 rounded-full font-bold focus:outline-none hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {localSearchQuery && (
              <button 
                onClick={() => setShowSearchOverlay(false)}
                className="mt-8 w-full py-3 bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] border-t border-white/25 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-[0.98] transition-transform"
              >
                Tampilkan {filteredArticles.length} Hasil
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 13. GLASSMORPHISM SLIDE-UP NOTIFICATION CENTER ================= */}
      <AnimatePresence>
        {showNotificationCenter && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-x-0 bottom-0 top-12 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-50 rounded-t-[30px] shadow-2xl p-5 border-t border-slate-100 dark:border-slate-900 flex flex-col overflow-hidden"
          >
            {/* Grab Notch Bar */}
            <div className="mx-auto w-12 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-full mb-4 cursor-pointer" onClick={() => setShowNotificationCenter(false)} />
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-900 mb-4 shrink-0">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-red-600" />
                <span>Pusat Notifikasi</span>
              </h3>
              <button onClick={() => setShowNotificationCenter(false)} className="text-xs font-bold text-red-600 dark:text-red-400">
                Tutup
              </button>
            </div>

            {/* List of active notifications */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 pb-10">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">Belum ada notifikasi baru.</div>
              ) : (
                notifications.map(not => (
                  <div key={not.id} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{not.title}</span>
                      <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {not.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{not.message}</p>
                    <span className="text-[9px] text-slate-400 mt-2 block font-medium">{not.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= USER PROFILE BOTTOM DRAWER SHEET ================= */}
      <AnimatePresence>
        {showProfileSheet && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-x-0 bottom-0 bg-white dark:bg-slate-950 z-50 rounded-t-[30px] shadow-2xl p-6 border-t border-slate-150 dark:border-slate-900 max-h-[90vh] overflow-y-auto"
          >
            {/* Grab Notch Bar */}
            <div className="mx-auto w-12 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-full mb-5 cursor-pointer" onClick={() => setShowProfileSheet(false)} />

            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-900 mb-5">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-white">Profil & Pengaturan</h3>
              <button onClick={() => setShowProfileSheet(false)} className="text-xs font-bold text-red-600 dark:text-red-400">
                Selesai
              </button>
            </div>

            <div className="space-y-6">
              {/* App Meta Version Info */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 font-bold text-base shrink-0">
                  MP
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Majalengka Post Portal</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Mobile App Version 2.4.0</p>
                </div>
              </div>

              {/* Utility Row: Dark Mode Toggle */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="w-4 h-4 text-amber-500 animate-bounce" /> : <Sun className="w-4 h-4 text-yellow-500 animate-spin" />}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Mode Gelap (Dark Mode)</span>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                    darkMode ? "bg-red-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${darkMode ? "right-1" : "left-1"}`} />
                </button>
              </div>

              {/* Utility Row: Push Notifications Toggle */}
              {notificationPermission !== "unsupported" && (
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  <div className="flex items-center gap-2">
                    <Bell className={`w-4 h-4 ${isSubscribed && notificationPermission === "granted" ? "text-red-600 animate-pulse" : "text-gray-400"}`} />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Notifikasi Artikel Baru</span>
                      <span className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">Dapatkan info berita baru instan</span>
                    </div>
                  </div>
                  <button
                    onClick={onToggleNotifications}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                      isSubscribed && notificationPermission === "granted" ? "bg-red-600" : "bg-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      isSubscribed && notificationPermission === "granted" ? "right-1" : "left-1"
                    }`} />
                  </button>
                </div>
              )}

              {/* Access Redaksi Gate Pin Portal */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Akses Redaksi Jurnalis (CMS)</span>
                {isRedaksiUnlocked ? (
                  <div className="space-y-3 text-xs font-bold">
                    <p className="text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Terverifikasi (Akses Redaktur Unlocked)</span>
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          onToggleAdmin();
                          setShowProfileSheet(false);
                        }}
                        className="flex-1 py-3 bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] border-t border-white/20 text-white rounded-xl font-black text-[11px] uppercase tracking-wider shadow-md active:scale-95 transition-transform"
                      >
                        {isAdminView ? "Lihat Portal Publik" : "Ke Dashboard Editor CMS"}
                      </button>
                      <button 
                        onClick={onLockRedaksi}
                        className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-black text-[11px] uppercase tracking-wider"
                      >
                        Lock
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-slate-400 leading-normal mb-3">Untuk mengirim draf berita, menyunting editorial, dan mengelola boks iklan, silakan verifikasi PIN Anda.</p>
                    <button 
                      onClick={() => {
                        setShowProfileSheet(false);
                        onOpenUnlockModal();
                      }}
                      className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white font-black text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 focus:outline-none border border-slate-750"
                    >
                      <Lock className="w-3.5 h-3.5 text-red-500" />
                      <span>Masuk Otorisasi Redaksi</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FAB BOTTOM DRAWERS ================= */}
      {/* Drawer: Kirim Berita */}
      <AnimatePresence>
        {showKirimBeritaSheet && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-x-0 bottom-0 top-12 bg-white dark:bg-slate-950 z-50 rounded-t-[30px] p-6 shadow-2xl border-t border-slate-100 dark:border-slate-900 flex flex-col"
          >
            {/* Grab Notch Bar */}
            <div className="mx-auto w-12 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-full mb-4 cursor-pointer" onClick={() => setShowKirimBeritaSheet(false)} />

            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-900 mb-5">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-white">Laporan Berita Warga</h3>
              <button onClick={() => setShowKirimBeritaSheet(false)} className="text-xs font-bold text-red-600 dark:text-red-400">Tutup</button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto space-y-4 pb-12">
              {formSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-100/30">
                  {formSuccess}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Judul Berita</label>
                <input 
                  type="text" 
                  placeholder="Ketik judul kejadian..."
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Kategori</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800 dark:text-slate-100"
                  >
                    {CATEGORIES.slice(0, 10).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Lokasi Kejadian</label>
                  <input 
                    type="text" 
                    placeholder="Nama desa/kecamatan..."
                    value={formData.location}
                    onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Ringkasan / Sub-Judul</label>
                <input 
                  type="text" 
                  placeholder="Ringkasan singkat kejadian..."
                  value={formData.summary}
                  onChange={(e) => setFormData(p => ({ ...p, summary: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Isi Laporan Detail</label>
                <textarea 
                  rows={4}
                  placeholder="Ceritakan detail kronologi kejadian secara lengkap..."
                  value={formData.content}
                  onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] border-t border-white/25 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-[0.98] transition-transform"
              >
                Kirim Draf Berita Warga
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer: Upload Foto */}
      <AnimatePresence>
        {showUploadFotoSheet && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-x-0 bottom-0 top-12 bg-white dark:bg-slate-950 z-50 rounded-t-[30px] p-6 shadow-2xl border-t border-slate-100 dark:border-slate-900 flex flex-col"
          >
            {/* Grab Notch Bar */}
            <div className="mx-auto w-12 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-full mb-4 cursor-pointer" onClick={() => setShowUploadFotoSheet(false)} />

            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-900 mb-5">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-white">Upload Foto Lapangan</h3>
              <button onClick={() => setShowUploadFotoSheet(false)} className="text-xs font-bold text-red-600 dark:text-red-400">Tutup</button>
            </div>

            <form onSubmit={handleUploadPhotoSubmit} className="flex-1 overflow-y-auto space-y-4 pb-12">
              {formSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-100/30">
                  {formSuccess}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Nama File / Deskripsi Foto</label>
                <input 
                  type="text" 
                  placeholder="Ketik nama foto kejadian, misal: peresmian_jalan.jpg"
                  value={uploadPhotoData.name}
                  onChange={(e) => setUploadPhotoData(p => ({ ...p, name: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">URL Sumber Foto (Mock Upload)</label>
                <input 
                  type="text" 
                  placeholder="Masukkan tautan gambar, misal: https://images.unsplash.com/..."
                  value={uploadPhotoData.imageUrl}
                  onChange={(e) => setUploadPhotoData(p => ({ ...p, imageUrl: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Kategori / Folder Media</label>
                <select 
                  value={uploadPhotoData.category}
                  onChange={(e) => setUploadPhotoData(p => ({ ...p, category: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800 dark:text-slate-100"
                >
                  {CATEGORIES.slice(0, 10).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <Camera className="w-8 h-8 text-slate-400 mb-2 shrink-0" />
                <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400">Seret dan Lepas Gambar Disini</span>
                <span className="text-[9px] text-slate-400 mt-1 font-medium">Atau klik untuk memilih file manual dari galeri ponsel Anda</span>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] border-t border-white/25 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-[0.98] transition-transform"
              >
                Upload Foto Lapangan
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SOCIAL SHARE BOTTOM DRAWER SHEET ================= */}
      <AnimatePresence>
        {showShareSheet && shareSheetArticle && (
          <>
            {/* Backdrop for focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isSharingPlatform) setShowShareSheet(false); }}
              className="fixed inset-0 bg-slate-950/60 z-50 backdrop-blur-xs"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 bg-white dark:bg-slate-950 z-50 rounded-t-[30px] p-6 border-t border-slate-150 dark:border-slate-900 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Grab Notch Bar */}
              <div 
                className="mx-auto w-12 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-full mb-5 cursor-pointer" 
                onClick={() => { if (!isSharingPlatform) setShowShareSheet(false); }} 
              />

              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-900 mb-5">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-red-600 animate-pulse" />
                  <span>Bagikan Artikel</span>
                </h3>
                <button 
                  onClick={() => setShowShareSheet(false)} 
                  disabled={!!isSharingPlatform}
                  className="text-xs font-bold text-slate-400 hover:text-red-600 disabled:opacity-50"
                >
                  Tutup
                </button>
              </div>

              {/* Share Toast Notification Alert */}
              {shareMessage && (
                <div className={`p-3 text-xs font-bold rounded-xl border mb-4 text-center ${
                  shareMessage.includes("Sukses") || shareMessage.includes("berhasil")
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100/30"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/50"
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    {isSharingPlatform && <RefreshCw className="w-3 h-3 animate-spin text-red-600" />}
                    <span>{shareMessage}</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Article Info */}
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl flex gap-3 border border-slate-100 dark:border-slate-850">
                  <img src={shareSheetArticle.coverImage} className="w-16 h-12 rounded-xl object-cover shrink-0 bg-slate-100" alt="" />
                  <div className="flex flex-col justify-center">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs line-clamp-2 leading-snug">
                      {shareSheetArticle.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">{shareSheetArticle.category}</span>
                  </div>
                </div>

                {/* API Share Counter Breakdown Card */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statistik Share Terkini (API Live)</span>
                    {isFetchingShares[shareSheetArticle.id] ? (
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin text-red-600" />
                        Sinkronisasi...
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Terhubung
                      </span>
                    )}
                  </div>

                  {isFetchingShares[shareSheetArticle.id] ? (
                    <div className="space-y-3.5 py-2">
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Total Counter banner */}
                      <div className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                        isPulsingTotal
                          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 ring-4 ring-red-500/10"
                          : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-850"
                      }`}>
                        <div className="flex items-center gap-2">
                          <Share2 className={`w-4 h-4 transition-colors ${isPulsingTotal ? "text-red-600 dark:text-red-400 animate-bounce" : "text-slate-500"}`} />
                          <span className={`text-xs font-bold transition-colors ${isPulsingTotal ? "text-red-700 dark:text-red-300" : "text-slate-700 dark:text-slate-300"}`}>Total Dibagikan</span>
                        </div>
                        <motion.span
                          key={shareCounts[shareSheetArticle.id]?.total || 0}
                          animate={isPulsingTotal ? {
                            scale: [1, 1.5, 0.9, 1.2, 1],
                            color: ["#0f172a", "#ef4444", "#ef4444", "currentColor"]
                          } : { scale: [1, 1.25, 1] }}
                          transition={{ duration: isPulsingTotal ? 1.0 : 0.35, ease: "easeInOut" }}
                          className={`font-mono text-sm font-black inline-block transition-colors ${
                            isPulsingTotal ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {shareCounts[shareSheetArticle.id]?.total || 0} x
                        </motion.span>
                      </div>

                      {/* Breakdown Channels Bar Segment */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {/* Facebook breakdown */}
                        <div className={`p-2.5 rounded-xl border text-center flex flex-col items-center transition-all duration-300 ${
                          isPulsingPlatform === "facebook"
                            ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 ring-4 ring-blue-500/10"
                            : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-850"
                        }`}>
                          <span className="text-[9px] font-black uppercase text-[#1877F2]">Facebook</span>
                          <motion.span
                            key={shareCounts[shareSheetArticle.id]?.facebook || 0}
                            animate={isPulsingPlatform === "facebook" ? {
                              scale: [1, 1.5, 0.9, 1.15, 1],
                              color: ["currentColor", "#1877F2", "#1877F2", "currentColor"]
                            } : { scale: [1, 1.3, 1] }}
                            transition={{ duration: isPulsingPlatform === "facebook" ? 1.0 : 0.35, ease: "easeInOut" }}
                            className={`font-mono text-xs font-extrabold mt-1 inline-block transition-colors ${
                              isPulsingPlatform === "facebook" ? "text-[#1877F2] font-black" : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {shareCounts[shareSheetArticle.id]?.facebook || 0}
                          </motion.span>
                        </div>

                        {/* Twitter breakdown */}
                        <div className={`p-2.5 rounded-xl border text-center flex flex-col items-center transition-all duration-300 ${
                          isPulsingPlatform === "twitter"
                            ? "bg-slate-100 dark:bg-slate-800 border-slate-350 dark:border-slate-700 ring-4 ring-slate-500/10"
                            : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-850"
                        }`}>
                          <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400">Twitter/X</span>
                          <motion.span
                            key={shareCounts[shareSheetArticle.id]?.twitter || 0}
                            animate={isPulsingPlatform === "twitter" ? {
                              scale: [1, 1.5, 0.9, 1.15, 1],
                              color: ["currentColor", "#0f172a", "#0f172a", "currentColor"]
                            } : { scale: [1, 1.3, 1] }}
                            transition={{ duration: isPulsingPlatform === "twitter" ? 1.0 : 0.35, ease: "easeInOut" }}
                            className={`font-mono text-xs font-extrabold mt-1 inline-block transition-colors ${
                              isPulsingPlatform === "twitter" ? "text-slate-900 dark:text-white font-black" : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {shareCounts[shareSheetArticle.id]?.twitter || 0}
                          </motion.span>
                        </div>

                        {/* WhatsApp breakdown */}
                        <div className={`p-2.5 rounded-xl border text-center flex flex-col items-center transition-all duration-300 ${
                          isPulsingPlatform === "whatsapp"
                            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40 ring-4 ring-green-500/10"
                            : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-850"
                        }`}>
                          <span className="text-[9px] font-black uppercase text-[#25D366]">WhatsApp</span>
                          <motion.span
                            key={shareCounts[shareSheetArticle.id]?.whatsapp || 0}
                            animate={isPulsingPlatform === "whatsapp" ? {
                              scale: [1, 1.5, 0.9, 1.15, 1],
                              color: ["currentColor", "#25D366", "#25D366", "currentColor"]
                            } : { scale: [1, 1.3, 1] }}
                            transition={{ duration: isPulsingPlatform === "whatsapp" ? 1.0 : 0.35, ease: "easeInOut" }}
                            className={`font-mono text-xs font-extrabold mt-1 inline-block transition-colors ${
                              isPulsingPlatform === "whatsapp" ? "text-[#25D366] font-black" : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {shareCounts[shareSheetArticle.id]?.whatsapp || 0}
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Share Actions Grid */}
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Pilih Saluran Pembagian</span>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Share on WhatsApp */}
                    <button
                      onClick={() => simulatePostShare(shareSheetArticle.id, "whatsapp")}
                      disabled={!!isSharingPlatform || isFetchingShares[shareSheetArticle.id]}
                      className="py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 focus:outline-none cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-[#25D366]/10" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Share on Facebook */}
                    <button
                      onClick={() => simulatePostShare(shareSheetArticle.id, "facebook")}
                      disabled={!!isSharingPlatform || isFetchingShares[shareSheetArticle.id]}
                      className="py-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 text-[#1877F2] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 focus:outline-none cursor-pointer"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Facebook</span>
                    </button>

                    {/* Share on Twitter */}
                    <button
                      onClick={() => simulatePostShare(shareSheetArticle.id, "twitter")}
                      disabled={!!isSharingPlatform || isFetchingShares[shareSheetArticle.id]}
                      className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 focus:outline-none cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Twitter / X</span>
                    </button>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(shareSheetArticle.id)}
                      disabled={!!isSharingPlatform || isFetchingShares[shareSheetArticle.id]}
                      className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 focus:outline-none cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Salin Tautan</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Opening Banner Modal for Mobile View */}
      <OpeningBannerModal
        banners={openingBanners}
        currentPage={selectedArticle ? "article" : activeTab}
      />
    </div>
  );
}
