import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";
import PublicPortal from "./components/PublicPortal";
import CMSDashboard from "./components/CMSDashboard";
import MobilePremiumApp from "./components/MobilePremiumApp";
import ThemeConfigurator, { PresetTheme, THEME_PRESETS } from "./components/ThemeConfigurator";
import OpeningBannerModal from "./components/OpeningBannerModal";
import { Article, ArticleStatus, UserRole, AdBanner, MediaItem, InternalNotification, Poll, ValasRate, OpeningBanner } from "./types";
import { 
  INITIAL_ARTICLES, 
  INITIAL_BANNERS, 
  INITIAL_OPENING_BANNERS,
  INITIAL_MEDIA_ITEMS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_POLL,
  DEFAULT_COMPANY_PROFILES
} from "./mockData";
import CompanyProfile, { CompanyProfilePage } from "./components/CompanyProfile";
import TermsPage from "./components/TermsPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import { Palette, Sliders, Newspaper, Eye, ShieldAlert, BookOpen, Lock, Unlock, KeyRound, Home, Video, Layers, User, Moon, Sun, Sparkles, Database, CloudLightning, CheckCircle2, AlertTriangle, RefreshCw, Copy, ExternalLink, HelpCircle, BellRing, Tv, Radio, MessageSquare, Play, Pause, Volume2, Maximize, Send } from "lucide-react";
import { slugify } from "./utils/slugify";
import { safeLocalStorage } from "./lib/safeStorage";
import { requestNotificationPermission, getNotificationPermissionStatus, showNewArticleNotification } from "./utils/notification";
import logoImg from "./assets/images/majalengka_post_logo_1783851016975.jpg";
import { 
  isSupabaseConfigured,
  getIsSupabaseConfigured,
  initializeSupabase,
  fetchArticlesFromSupabase,
  upsertArticlesToSupabase,
  deleteArticleFromSupabase,
  fetchBannersFromSupabase,
  upsertBannersToSupabase,
  deleteBannerFromSupabase,
  fetchOpeningBannersFromSupabase,
  upsertOpeningBannersToSupabase,
  deleteOpeningBannerFromSupabase,
  fetchMediaFromSupabase,
  upsertMediaToSupabase,
  fetchPollFromSupabase,
  upsertPollToSupabase,
  upsertValasRatesToSupabase,
  fetchCompanyInfoFromSupabase,
  upsertCompanyInfoItemToSupabase,
  isTableMissingError,
  SUPABASE_SQL_SCHEMA
} from "./lib/supabase";


export default function App() {
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
  
  // 1. Core Databases & Mock State Store
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = safeLocalStorage.getItem("kabarnegara_articles");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && typeof item === "object");
        }
      }
    } catch (e) {
      console.warn("Failed to parse local articles:", e);
    }
    return INITIAL_ARTICLES;
  });

  const [banners, setBanners] = useState<AdBanner[]>(() => {
    try {
      const saved = safeLocalStorage.getItem("kabarnegara_banners");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && typeof item === "object");
        }
      }
    } catch (e) {
      console.warn("Failed to parse local banners:", e);
    }
    return INITIAL_BANNERS;
  });

  const [openingBanners, setOpeningBanners] = useState<OpeningBanner[]>(() => {
    try {
      const saved = safeLocalStorage.getItem("majalengkapost_opening_banners");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(item => item && typeof item === "object");
        }
      }
    } catch (e) {
      console.warn("Failed to parse local opening banners:", e);
    }
    return INITIAL_OPENING_BANNERS;
  });

  useEffect(() => {
    safeLocalStorage.setItem("majalengkapost_opening_banners", JSON.stringify(openingBanners));
  }, [openingBanners]);

  const [valasRates, setValasRates] = useState<ValasRate[]>(() => {
    try {
      const saved = safeLocalStorage.getItem("majalengkapost_valas");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && typeof item === "object");
        }
      }
    } catch (e) {
      console.warn("Failed to parse local valas:", e);
    }
    return [
      { code: "USD/IDR", rate: "16.385,00", change: "-0,18%" },
      { code: "EUR/IDR", rate: "17.654,20", change: "+0,24%" },
      { code: "SGD/IDR", rate: "12.115,80", change: "-0,08%" },
      { code: "JPY/IDR", rate: "101,42", change: "+0,32%" },
      { code: "CNY/IDR", rate: "2.248,50", change: "-0,15%" }
    ];
  });

  useEffect(() => {
    safeLocalStorage.setItem("majalengkapost_valas", JSON.stringify(valasRates));
  }, [valasRates]);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = safeLocalStorage.getItem("kabarnegara_media");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && typeof item === "object");
        }
      }
    } catch (e) {
      console.warn("Failed to parse local media:", e);
    }
    return INITIAL_MEDIA_ITEMS;
  });
  const [notifications, setNotifications] = useState<InternalNotification[]>(INITIAL_NOTIFICATIONS);
  const [activePoll, setActivePoll] = useState<Poll>(() => {
    try {
      const saved = safeLocalStorage.getItem("kabarnegara_poll");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && parsed.question && Array.isArray(parsed.options)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to parse local poll:", e);
    }
    return INITIAL_POLL;
  });

  // 2. Global UI Configurations
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.PEMIMPIN_REDAKSI);
  const [showThemePanel, setShowThemePanel] = useState<boolean>(false);
  const [activeBottomTab, setActiveBottomTab] = useState<string>("beranda");
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileViewport(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync state with location change & intercept global clicks for path-based SPA navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("/") && !href.startsWith("/api/")) {
          e.preventDefault();
          window.history.pushState({}, "", href);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      }
    };
    document.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // Supabase Integration States
  const [supabaseStatus, setSupabaseStatus] = useState<"idle" | "syncing" | "success" | "error" | "missing_tables" | "unconfigured">("idle");
  const [supabaseErrorMsg, setSupabaseErrorMsg] = useState<string>("");
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);


  // 3. Editorial Portal Access Gate for "Pembaca" (Reader-only by default)
  const [isRedaksiUnlocked, setIsRedaksiUnlocked] = useState<boolean>(() => {
    try {
      return safeLocalStorage.getItem("kabarnegara_redaksi_unlocked") === "true";
    } catch {
      return false;
    }
  });
  const [redaksiPin, setRedaksiPin] = useState<string>(() => {
    try {
      return safeLocalStorage.getItem("kabarnegara_redaksi_pin") || "1234";
    } catch {
      return "1234";
    }
  });
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [showLiveStreamModal, setShowLiveStreamModal] = useState<boolean>(false);
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);
  const [liveStreamTitle, setLiveStreamTitle] = useState<string>("Sidang Paripurna DPR & Peninjauan Lokasi Bencana Tol Majalengka");
  const [liveStreamViewerCount, setLiveStreamViewerCount] = useState<number>(1340);
  const [liveStreamType, setLiveStreamType] = useState<"youtube" | "camera" | "custom">("youtube");
  const [liveStreamUrl, setLiveStreamUrl] = useState<string>("https://www.youtube.com/embed/live_stream?channel=UCz3A9S7AecK9BTh40S77Dug");

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const handleToggleFullscreen = () => {
    if (playerContainerRef.current) {
      if (!document.fullscreenElement) {
        playerContainerRef.current.requestFullscreen().then(() => {
          setLiveStreamFullscreen(true);
          savePlayerSetting("mp_live_fullscreen", "true");
        }).catch((err) => {
          console.error("Gagal mengaktifkan mode layar penuh:", err);
        });
      } else {
        document.exitFullscreen().then(() => {
          setLiveStreamFullscreen(false);
          savePlayerSetting("mp_live_fullscreen", "false");
        });
      }
    }
  };

  // Robust player configurations with safe storage defaults
  const [liveStreamFullscreen, setLiveStreamFullscreen] = useState<boolean>(() => {
    try {
      const stored = safeLocalStorage.getItem("mp_live_fullscreen");
      return stored !== null ? stored === "true" : true;
    } catch {
      return true;
    }
  });
  const [liveStreamFloatingComments, setLiveStreamFloatingComments] = useState<boolean>(() => {
    try {
      const stored = safeLocalStorage.getItem("mp_live_floating_comments");
      return stored !== null ? stored === "true" : true;
    } catch {
      return true;
    }
  });
  const [liveStreamQuality, setLiveStreamQuality] = useState<string>(() => {
    try {
      return safeLocalStorage.getItem("mp_live_quality") || "1080p";
    } catch {
      return "1080p";
    }
  });
  const [liveStreamTheme, setLiveStreamTheme] = useState<string>(() => {
    try {
      return safeLocalStorage.getItem("mp_live_theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const [liveStreamLoading, setLiveStreamLoading] = useState<boolean>(false);
  const [liveStreamError, setLiveStreamError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Helper to store settings automatically in client-side safe storage
  const savePlayerSetting = (key: string, value: string) => {
    try {
      safeLocalStorage.setItem(key, value);
    } catch (err) {
      console.warn("Storage is full or read-only:", err);
    }
  };

  // Safe fetch function that checks content-type, verifies status, and handles automatic retries
  const safeFetchJson = async (url: string, options?: RequestInit, retries = 2, delay = 800): Promise<any> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(`Koneksi gagal dengan status HTTP ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Tanggapan dari server bukan format JSON yang valid (Kemungkinan 404 HTML).");
        }
        const data = await res.json();
        return data;
      } catch (err: any) {
        if (attempt === retries) {
          throw err;
        }
        console.warn(`[Safe Fetch Retry] Gagal mengakses ${url} (percobaan ke-${attempt + 1}/${retries + 1}). Mencoba kembali dalam ${delay}ms...`, err);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // Sync Live Streaming settings from server periodically with robust safety features
  useEffect(() => {
    let isMounted = true;
    const fetchLiveStreamSettings = async () => {
      if (isMounted) setLiveStreamLoading(true);
      try {
        const data = await safeFetchJson("/api/livestream/settings", undefined, 1, 500);
        if (isMounted && data && data.success && data.settings) {
          setLiveStreamActive(data.settings.active);
          setLiveStreamTitle(data.settings.title);
          setLiveStreamViewerCount(data.settings.viewerCount);
          setLiveStreamType(data.settings.streamType || "youtube");
          setLiveStreamUrl(data.settings.streamUrl || "");
          setLiveStreamError(null);
          setIsOfflineMode(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("Server offline atau rute livestream tidak ditemukan. Beralih ke Mode Offline & Default lokal.", err);
          setIsOfflineMode(true);
          setLiveStreamError("Sistem siaran utama sedang luring. Anda terhubung dalam mode cadangan lokal.");
          
          // Apply fallback defaults as explicitly required by the user
          setLiveStreamFullscreen(true);
          setLiveStreamFloatingComments(true);
          setLiveStreamQuality("1080p");
          setLiveStreamTheme("dark");
        }
      } finally {
        if (isMounted) setLiveStreamLoading(false);
      }
    };

    fetchLiveStreamSettings();
    const interval = setInterval(fetchLiveStreamSettings, 6000); // Poll every 6 seconds to optimize network overhead
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleUpdateLiveStreamSettings = async (
    active: boolean, 
    title: string, 
    viewers: number, 
    type: "youtube" | "camera" | "custom" = "youtube", 
    url: string = ""
  ) => {
    setLiveStreamActive(active);
    setLiveStreamTitle(title);
    setLiveStreamViewerCount(viewers);
    setLiveStreamType(type);
    setLiveStreamUrl(url);
    try {
      savePlayerSetting("mp_live_stream_active", active ? "true" : "false");
      savePlayerSetting("mp_live_stream_title", title);
      savePlayerSetting("mp_live_stream_viewers", String(viewers));
      savePlayerSetting("mp_live_stream_type", type);
      savePlayerSetting("mp_live_stream_url", url);

      // Send update to server safely
      await safeFetchJson("/api/livestream/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active, title, viewerCount: viewers, streamType: type, streamUrl: url })
      }, 0); // No retries for updating actions to avoid double-post
    } catch (err) {
      console.warn("Failed to post updated live stream settings (Running locally):", err);
    }
  };

  const [activeCameraFrame, setActiveCameraFrame] = useState<string>("");

  // Sync webcam frame from server if type is camera and modal is open
  useEffect(() => {
    let intervalId: any = null;

    if (showLiveStreamModal && liveStreamActive && liveStreamType === "camera" && !isOfflineMode) {
      const fetchFrame = async () => {
        try {
          const data = await safeFetchJson("/api/livestream/frame", undefined, 0); // No retry for rapid polling
          if (data && data.success) {
            setActiveCameraFrame(data.frame || "");
          }
        } catch (err) {
          console.warn("Failed to fetch camera frame:", err);
        }
      };

      fetchFrame();
      intervalId = setInterval(fetchFrame, 450); // Fetch frame twice a second
    } else {
      setActiveCameraFrame("");
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showLiveStreamModal, liveStreamActive, liveStreamType, isOfflineMode]);

  // Real-Time live stream chat states
  const [liveStreamChats, setLiveStreamChats] = useState<Array<{ id: number; name: string; text: string; time: string }>>([]);
  const [newLiveStreamChat, setNewLiveStreamChat] = useState<string>("");
  const [liveStreamViewersLocal, setLiveStreamViewersLocal] = useState<number>(liveStreamViewerCount);
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: number; emoji: string; left: number; rotate: number; scale: number }>>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  // Chat custom username
  const [chatUsername, setChatUsername] = useState<string>(() => {
    try {
      return safeLocalStorage.getItem("mp_chat_username") || `Pembaca_${Math.floor(1000 + Math.random() * 9000)}`;
    } catch {
      return `Pembaca_${Math.floor(1000 + Math.random() * 9000)}`;
    }
  });
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>("");

  const socketRef = useRef<WebSocket | null>(null);

  // Establish real-time WebSocket connection to the server on modal open
  useEffect(() => {
    if (!showLiveStreamModal || !liveStreamActive) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    
    console.log("Connecting to live stream chat WebSocket:", wsUrl);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected to live stream chat!");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "init") {
          setLiveStreamChats(data.history || []);
          if (data.viewers) {
            setLiveStreamViewersLocal(data.viewers);
          }
        } else if (data.type === "viewers") {
          if (data.viewers) {
            setLiveStreamViewersLocal(data.viewers);
          }
        } else if (data.type === "message" && data.chat) {
          setLiveStreamChats(prev => {
            // Guard against duplicate message IDs for idempotency
            if (prev.some(item => item.id === data.chat.id)) {
              return prev;
            }
            return [...prev, data.chat].slice(-100);
          });
        } else if (data.type === "reaction" && data.emoji) {
          const newReaction = {
            id: data.id || Date.now() + Math.random(),
            emoji: data.emoji,
            left: Math.floor(Math.random() * 75) + 12, // 12% to 87% left to avoid overlapping edges
            rotate: Math.floor(Math.random() * 50) - 25, // -25deg to 25deg
            scale: parseFloat((Math.random() * 0.5 + 0.9).toFixed(2)) // 0.9 to 1.4
          };
          setFloatingReactions(prev => [...prev, newReaction].slice(-30));
          setTimeout(() => {
            setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
          }, 2400);
        }
      } catch (err) {
        console.error("Error reading WebSocket chat data:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed, retrying in 3s...");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [showLiveStreamModal, liveStreamActive]);

  const sendReaction = (emoji: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "reaction",
        emoji: emoji
      }));
    } else {
      // Offline local preview fallback
      const newReaction = {
        id: Date.now() + Math.random(),
        emoji: emoji,
        left: Math.floor(Math.random() * 75) + 12,
        rotate: Math.floor(Math.random() * 50) - 25,
        scale: parseFloat((Math.random() * 0.5 + 0.9).toFixed(2))
      };
      setFloatingReactions(prev => [...prev, newReaction].slice(-30));
      setTimeout(() => {
        setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
      }, 2400);
    }
  };

  const [unlockPassword, setUnlockPassword] = useState<string>("");
  const [unlockError, setUnlockError] = useState<string>("");

  // 4. Theme Branding Customization States
  const [currentTheme, setCurrentTheme] = useState<PresetTheme>(THEME_PRESETS[0]);
  const [fontFamily, setFontFamily] = useState<string>("font-sans");
  const [density, setDensity] = useState<"compact" | "normal" | "spacious">("normal");

  // 5. Company Profiles
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfilePage[]>(() => {
    try {
      const saved = safeLocalStorage.getItem("majalengkapost_company_profiles");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = [...parsed];
          DEFAULT_COMPANY_PROFILES.forEach(df => {
            if (!merged.some(m => m.id === df.id)) {
              merged.push(df);
            }
          });
          return merged;
        }
      }
    } catch (e) {
      console.warn("Failed to parse local company profiles:", e);
    }
    return DEFAULT_COMPANY_PROFILES;
  });

  const [activeCompanyPage, setActiveCompanyPage] = useState<"about" | "redaksi" | "karir" | "kontak" | "iklan" | "pedoman" | "kode-etik" | "hak-jawab" | "koreksi" | null>(null);

  const handleUpdateCompanyProfile = async (updatedProfile: CompanyProfilePage) => {
    const profileWithTime = { ...updatedProfile, lastUpdated: new Date().toISOString() };
    setCompanyProfiles(prev => 
      prev.map(p => p.id === updatedProfile.id ? profileWithTime : p)
    );
    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      try {
        await upsertCompanyInfoItemToSupabase(profileWithTime);
      } catch (err) {
        console.error("Error updating company profile in Supabase:", err);
      }
    }
  };

  useEffect(() => {
    try {
      safeLocalStorage.setItem("majalengkapost_company_profiles", JSON.stringify(companyProfiles));
    } catch (e) {
      console.warn(e);
    }
  }, [companyProfiles]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#about" || hash === "#tentang-kami") {
        setActiveCompanyPage("about");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#redaksi") {
        setActiveCompanyPage("redaksi");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#karir") {
        setActiveCompanyPage("karir");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#kontak") {
        setActiveCompanyPage("kontak");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#iklan") {
        setActiveCompanyPage("iklan");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#pedoman") {
        setActiveCompanyPage("pedoman");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#kode-etik") {
        setActiveCompanyPage("kode-etik");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#hak-jawab") {
        setActiveCompanyPage("hak-jawab");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#koreksi") {
        setActiveCompanyPage("koreksi");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "" || hash === "#") {
        setActiveCompanyPage(null);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Save changes to localStorage for persistence
  useEffect(() => {
    try {
      safeLocalStorage.setItem("kabarnegara_articles", JSON.stringify(articles));
    } catch (e) {
      console.warn(e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      safeLocalStorage.setItem("kabarnegara_banners", JSON.stringify(banners));
    } catch (e) {
      console.warn(e);
    }
  }, [banners]);

  useEffect(() => {
    try {
      safeLocalStorage.setItem("kabarnegara_poll", JSON.stringify(activePoll));
    } catch (e) {
      console.warn(e);
    }
  }, [activePoll]);

  useEffect(() => {
    try {
      safeLocalStorage.setItem("kabarnegara_media", JSON.stringify(mediaItems));
    } catch (e) {
      console.warn(e);
    }
  }, [mediaItems]);

  useEffect(() => {
    try {
      safeLocalStorage.setItem("kabarnegara_redaksi_unlocked", isRedaksiUnlocked ? "true" : "false");
    } catch (e) {
      console.warn(e);
    }
  }, [isRedaksiUnlocked]);

  // Push Notifications State & Operations
  const [notificationPermission, setNotificationPermission] = useState<"default" | "granted" | "denied" | "unsupported">(() => {
    return getNotificationPermissionStatus();
  });

  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    try {
      const saved = safeLocalStorage.getItem("majalengkapost_subscribed");
      return saved === "true";
    } catch {
      return true; // Default to true if permitted
    }
  });

  useEffect(() => {
    try {
      safeLocalStorage.setItem("majalengkapost_subscribed", isSubscribed ? "true" : "false");
    } catch (e) {
      console.warn(e);
    }
  }, [isSubscribed]);

  const [showNotificationPrompt, setShowNotificationPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (notificationPermission === "default") {
      try {
        const dismissed = sessionStorage.getItem("majalengkapost_notif_prompt_dismissed");
        if (dismissed !== "true") {
          const timer = setTimeout(() => {
            setShowNotificationPrompt(true);
          }, 3500); // Show after 3.5 seconds
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }, [notificationPermission]);

  const handleToggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Browser ini tidak mendukung notifikasi push.");
      return;
    }

    if (Notification.permission === "granted") {
      setIsSubscribed(prev => !prev);
    } else if (Notification.permission === "denied") {
      alert("Izin notifikasi diblokir. Silakan aktifkan izin notifikasi di pengaturan browser Anda.");
    } else {
      const granted = await requestNotificationPermission();
      setNotificationPermission(getNotificationPermissionStatus());
      if (granted) {
        setIsSubscribed(true);
        // Show test welcome notification
        try {
          if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.ready;
            reg.showNotification("Notifikasi Aktif!", {
              body: "Terima kasih! Anda akan menerima pemberitahuan setiap ada berita baru dari Majalengka Post.",
              icon: "/favicon.png",
              badge: "/favicon.png"
            });
          } else {
            new Notification("Notifikasi Aktif!", {
              body: "Terima kasih! Anda akan menerima pemberitahuan setiap ada berita baru dari Majalengka Post.",
              icon: "/favicon.png"
            });
          }
        } catch (e) {
          console.warn("Welcome notification failed:", e);
        }
      }
    }
  };

  // Watch articles and trigger notification for newly published articles
  const publishedIdsRef = React.useRef<Set<string>>(new Set());
  const isInitialLoadRef = React.useRef<boolean>(true);

  useEffect(() => {
    const currentPublishedIds = new Set(
      articles
        .filter(a => a.status === ArticleStatus.PUBLISHED)
        .map(a => a.id)
    );

    if (isInitialLoadRef.current) {
      publishedIdsRef.current = currentPublishedIds;
      isInitialLoadRef.current = false;
      return;
    }

    // Identify newly published articles (now published, but not in our seen list)
    const newlyPublishedArticles = articles.filter(
      a => a.status === ArticleStatus.PUBLISHED && !publishedIdsRef.current.has(a.id)
    );

    if (newlyPublishedArticles.length > 0) {
      if (isSubscribed && notificationPermission === "granted") {
        newlyPublishedArticles.forEach(article => {
          showNewArticleNotification(article);
        });
      }
      publishedIdsRef.current = new Set([...publishedIdsRef.current, ...newlyPublishedArticles.map(a => a.id)]);
    } else {
      // Sync in case of deletion or unpublishing
      publishedIdsRef.current = currentPublishedIds;
    }
  }, [articles, isSubscribed, notificationPermission]);

  // Apply Dark Mode Class name & Dynamic Branding Colors
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    // Inject dynamic root variables for CSS
    if (currentTheme && currentTheme.primary && currentTheme.secondary) {
      document.documentElement.style.setProperty("--primary-color", currentTheme.primary);
      document.documentElement.style.setProperty("--secondary-color", currentTheme.secondary);
    }
  }, [currentTheme]);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadSupabaseData() {
      setSupabaseStatus("syncing");
      try {
        // Try to fetch credentials from the server at runtime
        try {
          const configRes = await fetch("/api/supabase/config");
          if (configRes.ok) {
            const configData = await configRes.json();
            if (configData.supabaseUrl && configData.supabaseAnonKey) {
              initializeSupabase(configData.supabaseUrl, configData.supabaseAnonKey);
            }
          }
        } catch (configErr) {
          console.warn("Failed to fetch runtime Supabase config, falling back to static/env", configErr);
        }

        if (!getIsSupabaseConfigured()) {
          setSupabaseStatus("unconfigured");
          return;
        }

        // 1. Fetch articles
        let fetchedArticles: Article[] = [];
        try {
          fetchedArticles = await fetchArticlesFromSupabase();
          if (fetchedArticles.length === 0) {
            // Seed database
            await upsertArticlesToSupabase(INITIAL_ARTICLES).catch(() => {});
            fetchedArticles = INITIAL_ARTICLES;
          }
          setArticles(fetchedArticles);
        } catch (err: any) {
          if (isTableMissingError(err)) {
            setSupabaseStatus("missing_tables");
            setSupabaseErrorMsg(err.message || "Tabel 'articles' belum terbuat.");
            return;
          }
          console.warn("Using offline articles fallback:", err?.message || err);
          setArticles(INITIAL_ARTICLES);
        }

        // 2. Fetch banners
        let fetchedBanners: AdBanner[] = [];
        try {
          fetchedBanners = await fetchBannersFromSupabase();
          if (fetchedBanners.length === 0) {
            await upsertBannersToSupabase(INITIAL_BANNERS).catch(() => {});
            fetchedBanners = INITIAL_BANNERS;
          }
          setBanners(fetchedBanners);
        } catch (err: any) {
          if (isTableMissingError(err)) {
            setSupabaseStatus("missing_tables");
            setSupabaseErrorMsg(err.message || "Tabel 'banners' belum terbuat.");
            return;
          }
          console.warn("Using offline banners fallback:", err?.message || err);
          setBanners(INITIAL_BANNERS);
        }

        // 2b. Fetch opening banners (splash promo)
        try {
          const fetchedOpening = await fetchOpeningBannersFromSupabase();
          if (fetchedOpening.length === 0) {
            await upsertOpeningBannersToSupabase(INITIAL_OPENING_BANNERS).catch(() => {});
            setOpeningBanners(INITIAL_OPENING_BANNERS);
          } else {
            setOpeningBanners(fetchedOpening);
          }
        } catch (err: any) {
          console.warn("Using offline opening banners fallback:", err?.message || err);
          setOpeningBanners(INITIAL_OPENING_BANNERS);
        }

        // 3. Fetch media items
        let fetchedMedia: MediaItem[] = [];
        try {
          fetchedMedia = await fetchMediaFromSupabase();
          if (fetchedMedia.length === 0) {
            await upsertMediaToSupabase(INITIAL_MEDIA_ITEMS).catch(() => {});
            fetchedMedia = INITIAL_MEDIA_ITEMS;
          }
          setMediaItems(fetchedMedia);
        } catch (err: any) {
          if (isTableMissingError(err)) {
            setSupabaseStatus("missing_tables");
            setSupabaseErrorMsg(err.message || "Tabel 'media_items' belum terbuat.");
            return;
          }
          console.warn("Using offline media fallback:", err?.message || err);
          setMediaItems(INITIAL_MEDIA_ITEMS);
        }

        // 4. Fetch poll
        try {
          const fetchedPoll = await fetchPollFromSupabase();
          if (!fetchedPoll) {
            await upsertPollToSupabase(INITIAL_POLL).catch(() => {});
            setActivePoll(INITIAL_POLL);
          } else {
            setActivePoll(fetchedPoll);
          }
        } catch (err: any) {
          if (isTableMissingError(err)) {
            setSupabaseStatus("missing_tables");
            setSupabaseErrorMsg(err.message || "Tabel 'polls' belum terbuat.");
            return;
          }
          console.warn("Using offline poll fallback:", err?.message || err);
          setActivePoll(INITIAL_POLL);
        }

        // 5. Fetch company profiles
        try {
          let fetchedProfiles = await fetchCompanyInfoFromSupabase();
          if (fetchedProfiles.length === 0) {
            // Seed database
            for (const profile of DEFAULT_COMPANY_PROFILES) {
              await upsertCompanyInfoItemToSupabase(profile).catch(() => {});
            }
            fetchedProfiles = DEFAULT_COMPANY_PROFILES;
          }
          setCompanyProfiles(fetchedProfiles);
        } catch (err: any) {
          if (isTableMissingError(err)) {
            setSupabaseStatus("missing_tables");
            setSupabaseErrorMsg(err.message || "Tabel 'company_info' belum terbuat.");
            return;
          }
          console.warn("Using offline company info fallback:", err?.message || err);
          setCompanyProfiles(DEFAULT_COMPANY_PROFILES);
        }

        setSupabaseStatus("success");
      } catch (err: any) {
        console.warn("Handled loadSupabaseData error, set success with fallbacks:", err);
        setSupabaseStatus("success");
      }
    }

    loadSupabaseData();
  }, []);

  useEffect(() => {
    async function loadValasRates() {
      try {
        const res = await fetch("/api/valas/latest");
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Forex rate auto-fetch error (status " + res.status + "):", errorText);
          return;
        }
        const data = await res.json();
        if (data && data.rates) {
          setValasRates(data.rates);
        }
      } catch (err) {
        console.error("Failed to automatically fetch latest forex rates:", err);
      }
    }
    loadValasRates();
  }, []);

  const handleForceSync = async () => {
    if (!getIsSupabaseConfigured()) return;
    setSupabaseStatus("syncing");
    try {
      await upsertArticlesToSupabase(articles);
      await upsertBannersToSupabase(banners);
      await upsertMediaToSupabase(mediaItems);
      await upsertPollToSupabase(activePoll);
      await upsertValasRatesToSupabase(valasRates);
      for (const profile of companyProfiles) {
        await upsertCompanyInfoItemToSupabase(profile);
      }
      setSupabaseStatus("success");
    } catch (err: any) {
      console.error("Manual sync failed:", err);
      if (isTableMissingError(err)) {
        setSupabaseStatus("missing_tables");
      } else {
        setSupabaseStatus("error");
        setSupabaseErrorMsg(err.message || "Gagal sinkronisasi data.");
      }
    }
  };


  // 5. URL Router & Slug-based URL updates when article selection or category selection changes
  useEffect(() => {
    try {
      if (selectedArticle) {
        const slug = slugify(selectedArticle.title);
        const targetPath = `/artikel/${slug}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ articleId: selectedArticle.id }, "", targetPath);
          setCurrentPath(targetPath);
        }
      } else if (currentCategory) {
        const targetPath = `/kategori/${currentCategory.toLowerCase()}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState({}, "", targetPath);
          setCurrentPath(targetPath);
        }
      } else {
        if (window.location.pathname !== "/" && !window.location.pathname.startsWith("/api/")) {
          if (
            window.location.pathname !== "/terms" && 
            window.location.pathname !== "/privacy-policy" &&
            !window.location.pathname.startsWith("/kategori/")
          ) {
            window.history.pushState({}, "", "/");
            setCurrentPath("/");
          }
        }
      }
    } catch (e) {
      console.warn("Failed to update history state (could be running in a sandboxed iframe):", e);
    }
  }, [selectedArticle, currentCategory]);

  // Initial load or Back/Forward navigation sync
  useEffect(() => {
    const parseUrlAndRoute = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      // 1. Article matching
      const match = path.match(/^\/(artikel|berita)\/([^/]+)$/);
      if (match) {
        const slug = match[2];
        const found = articles.find(a => slugify(a.title) === slug);
        if (found) {
          setSelectedArticle(found);
          if (found.category) {
            setCurrentCategory(found.category);
          }
          return;
        }
      }

      // 2. Category matching: /kategori/:name
      const categoryMatch = path.match(/^\/kategori\/([^/]+)$/);
      if (categoryMatch) {
        const categorySlug = decodeURIComponent(categoryMatch[1]).toLowerCase();
        const availableCategories = ["Nasional", "Politik", "Daerah", "Ekonomi", "Teknologi", "Kesehatan", "Olahraga", "Hiburan", "Lifestyle", "Religi", "Budaya", "Opini", "Video"];
        const foundCategory = availableCategories.find(c => c.toLowerCase() === categorySlug);
        if (foundCategory) {
          setCurrentCategory(foundCategory);
          setSelectedArticle(null);
          if (foundCategory === "Video") {
            setActiveBottomTab("video");
          } else {
            setActiveBottomTab("berita");
          }
          return;
        }
      }
      
      // 3. Fallback query parameters: ?artikel=slug or ?category=name or ?livetv=true
      const params = new URLSearchParams(window.location.search);
      const paramSlug = params.get("artikel") || params.get("berita");
      if (paramSlug) {
        const found = articles.find(a => slugify(a.title) === paramSlug);
        if (found) {
          setSelectedArticle(found);
          if (found.category) {
            setCurrentCategory(found.category);
          }
          return;
        }
      }

      const paramCategory = params.get("category") || params.get("kategori");
      if (paramCategory) {
        const availableCategories = ["Nasional", "Politik", "Daerah", "Ekonomi", "Teknologi", "Kesehatan", "Olahraga", "Hiburan", "Lifestyle", "Religi", "Budaya", "Opini", "Video"];
        const foundCategory = availableCategories.find(c => c.toLowerCase() === paramCategory.toLowerCase());
        if (foundCategory) {
          setCurrentCategory(foundCategory);
          setSelectedArticle(null);
          if (foundCategory === "Video") {
            setActiveBottomTab("video");
          } else {
            setActiveBottomTab("berita");
          }
          return;
        }
      }

      const isLiveTvParam = params.get("livetv") === "true";
      if (isLiveTvParam) {
        setShowLiveStreamModal(true);
      }

      setSelectedArticle(null);
      if (path === "/") {
        setCurrentCategory("");
        setActiveBottomTab("beranda");
      }
    };

    parseUrlAndRoute();
    window.addEventListener("popstate", parseUrlAndRoute);
    return () => window.removeEventListener("popstate", parseUrlAndRoute);
  }, [articles]);

  // Helper lists
  const breakingNewsList = articles
    .filter(a => a.status === ArticleStatus.PUBLISHED && a.isBreaking)
    .map(a => `${a.location}: ${a.title}`);

  const defaultBreakingFallback = [
    "Pemerintah Resmi Luncurkan Blueprint AI Nasional Untuk Pelayanan Publik Cerdas",
    "Jalan Tol Trans-Sumatera Koridor Utama Lampung Hingga Aceh Tersambung Penuh Bulan Ini",
    "Motor Listrik Pintar Karya Anak Bangsa Bandung Sabet Penghargaan Desain Terbaik di Swiss"
  ];

  const activeBreakingNews = breakingNewsList.length > 0 ? breakingNewsList : defaultBreakingFallback;

  // Handler functions
  const handleAddArticle = (newArt: Article) => {
    setArticles(prev => [newArt, ...prev]);
    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      upsertArticlesToSupabase([newArt]).catch(err => {
        console.warn("Failed to sync new article to Supabase:", err);
        if (isTableMissingError(err)) {
          setSupabaseStatus("missing_tables");
          setSupabaseErrorMsg(err.message || "Tabel 'articles' belum terbuat di database.");
        }
      });
    }
  };

  const handleUpdateArticle = (updatedArt: Article) => {
    setArticles(prev => prev.map(a => a.id === updatedArt.id ? updatedArt : a));
    // Sync active view if detail is open
    if (selectedArticle && selectedArticle.id === updatedArt.id) {
      setSelectedArticle(updatedArt);
    }
    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      upsertArticlesToSupabase([updatedArt]).catch(err => {
        console.warn("Failed to sync updated article to Supabase:", err);
        if (isTableMissingError(err)) {
          setSupabaseStatus("missing_tables");
          setSupabaseErrorMsg(err.message || "Tabel 'articles' belum terbuat di database.");
        }
      });
    }
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(null);
    }
    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      deleteArticleFromSupabase(id).catch(err => {
        console.warn("Failed to delete article from Supabase:", err);
        if (isTableMissingError(err)) {
          setSupabaseStatus("missing_tables");
          setSupabaseErrorMsg(err.message || "Tabel 'articles' belum terbuat di database.");
        }
      });
    }
  };

  const handleAddBanner = (newBan: AdBanner) => {
    setBanners(prev => [newBan, ...prev]);
    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      upsertBannersToSupabase([newBan]).catch(err => {
        console.warn("Failed to sync new banner to Supabase:", err);
        if (isTableMissingError(err)) {
          setSupabaseStatus("missing_tables");
          setSupabaseErrorMsg(err.message || "Tabel 'banners' belum terbuat di database.");
        }
      });
    }
  };

  const handleUpdateBanner = (updatedBan: AdBanner) => {
    setBanners(prev => prev.map(b => b.id === updatedBan.id ? updatedBan : b));
    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      upsertBannersToSupabase([updatedBan]).catch(err => {
        console.warn("Failed to sync banner to Supabase:", err);
        if (isTableMissingError(err)) {
          setSupabaseStatus("missing_tables");
          setSupabaseErrorMsg(err.message || "Tabel 'banners' belum terbuat di database.");
        }
      });
    }
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      deleteBannerFromSupabase(id).catch(err => {
        console.warn("Failed to delete banner from Supabase:", err);
        if (isTableMissingError(err)) {
          setSupabaseStatus("missing_tables");
          setSupabaseErrorMsg(err.message || "Tabel 'banners' belum terbuat di database.");
        }
      });
    }
  };

  const handleSaveOpeningBanner = async (banner: OpeningBanner) => {
    setOpeningBanners(prev => {
      const exists = prev.some(b => b.id === banner.id);
      if (exists) {
        return prev.map(b => b.id === banner.id ? banner : b);
      }
      return [banner, ...prev];
    });

    try {
      await upsertOpeningBannersToSupabase([banner]);
    } catch (err: any) {
      console.warn("Gagal menyimpan opening banner ke Supabase:", err?.message || err);
    }
  };

  const handleDeleteOpeningBanner = async (id: string) => {
    setOpeningBanners(prev => prev.filter(b => b.id !== id));
    try {
      await deleteOpeningBannerFromSupabase(id);
    } catch (err: any) {
      console.warn("Gagal menghapus opening banner dari Supabase:", err?.message || err);
    }
  };

  const handleToggleOpeningBannerActive = async (id: string, active: boolean) => {
    let updatedBanner: OpeningBanner | null = null;
    setOpeningBanners(prev => prev.map(b => {
      if (b.id === id) {
        updatedBanner = { ...b, isActive: active, updatedAt: new Date().toISOString() };
        return updatedBanner;
      }
      return b;
    }));

    if (updatedBanner) {
      try {
        await upsertOpeningBannersToSupabase([updatedBanner]);
      } catch (err: any) {
        console.warn("Gagal memperbarui status aktif opening banner:", err?.message || err);
      }
    }
  };

  const handleAddMedia = (newMedia: MediaItem) => {
    setMediaItems(prev => [newMedia, ...prev]);
    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      upsertMediaToSupabase([newMedia]).catch(err => {
        console.warn("Failed to sync media item to Supabase:", err);
        if (isTableMissingError(err)) {
          setSupabaseStatus("missing_tables");
          setSupabaseErrorMsg(err.message || "Tabel 'media_items' belum terbuat di database.");
        }
      });
    }
  };

  const handleVotePoll = (optionId: string) => {
    let updatedPoll: Poll | null = null;
    setActivePoll(prev => {
      const updatedOptions = prev.options.map(opt => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        return opt;
      });
      updatedPoll = {
        ...prev,
        options: updatedOptions,
        totalVotes: prev.totalVotes + 1
      };
      return updatedPoll;
    });

    if (getIsSupabaseConfigured() && supabaseStatus === "success") {
      setTimeout(() => {
        if (updatedPoll) {
          upsertPollToSupabase(updatedPoll).catch(err => {
            console.warn("Failed to sync poll to Supabase:", err);
            if (isTableMissingError(err)) {
              setSupabaseStatus("missing_tables");
              setSupabaseErrorMsg(err.message || "Tabel 'polls' belum terbuat di database.");
            }
          });
        }
      }, 50);
    }
  };


  const handleUpdateRedaksiPin = (newPin: string) => {
    setRedaksiPin(newPin);
    try {
      safeLocalStorage.setItem("kabarnegara_redaksi_pin", newPin);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = unlockPassword.trim().toLowerCase();
    // Support custom PIN or default built-in credentials
    if (cleanPassword === redaksiPin.toLowerCase() || cleanPassword === "1234" || cleanPassword === "majalengka123" || cleanPassword === "admin" || cleanPassword === "majalengka") {
      setIsRedaksiUnlocked(true);
      setShowUnlockModal(false);
      setUnlockPassword("");
      setUnlockError("");
    } else {
      setUnlockError("Kata Sandi Redaksi salah. Hubungi Pemred atau coba lagi.");
    }
  };

  const helmetTitle = selectedArticle 
    ? `${selectedArticle.seo?.title || selectedArticle.title} | Majalengka Post`
    : currentCategory 
      ? `${currentCategory} | Majalengka Post`
      : "Majalengka Post - Portal Berita Terpercaya";

  const helmetDesc = selectedArticle
    ? selectedArticle.seo?.description || selectedArticle.summary || selectedArticle.subTitle || "Berita terpercaya dari Majalengka Post."
    : "Majalengka Post menyajikan berita terkini, akurat, dan terpercaya seputar Majalengka, Jawa Barat, Nasional, Politik, dan Ekonomi.";

  const helmetKeywords = selectedArticle
    ? selectedArticle.seo?.keywords || (Array.isArray(selectedArticle.tags) ? selectedArticle.tags.join(", ") : "") || "majalengka, berita, majalengka post"
    : "majalengka, berita, portal berita, jawa barat, politik, ekonomi";

  const helmetCanonical = selectedArticle
    ? `${getSiteOrigin()}/artikel/${slugify(selectedArticle.title)}`
    : `${getSiteOrigin()}/`;

  let helmetImage = selectedArticle?.coverImage || "/default-share.jpg";
  if (helmetImage && !helmetImage.startsWith("http") && !helmetImage.startsWith("/")) {
    helmetImage = `/${helmetImage}`;
  }
  const helmetFullImage = helmetImage.startsWith("http") ? helmetImage : `${getSiteOrigin()}${helmetImage}`;

  // Dynamically resolve logo URL using Vite's imported asset
  const resolvedLogoUrl = logoImg.startsWith("http") ? logoImg : `${getSiteOrigin()}${logoImg.startsWith("/") ? "" : "/"}${logoImg}`;

  // JSON-LD Organization Schema (specifically NewsMediaOrganization for search indexers)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${getSiteOrigin()}/#organization`,
    "name": "Majalengka Post",
    "alternateName": ["MajalengkaPost", "Portal Berita Majalengka Post"],
    "url": `${getSiteOrigin()}/`,
    "logo": {
      "@type": "ImageObject",
      "@id": `${getSiteOrigin()}/#logo`,
      "url": resolvedLogoUrl,
      "caption": "Majalengka Post Logo"
    },
    "sameAs": [
      "https://facebook.com/majalengkapost",
      "https://twitter.com/majalengkapost",
      "https://instagram.com/majalengkapost"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "editorial board",
      "email": "redaksi@majalengkapost.web.id"
    },
    "publishingPrinciples": `${getSiteOrigin()}/#about`
  };

  // JSON-LD BreadcrumbList Schema
  const breadcrumbElements = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": `${getSiteOrigin()}/`
    }
  ];

  if (selectedArticle) {
    const articleCategory = selectedArticle.category || currentCategory || "Berita";
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 2,
      "name": articleCategory,
      "item": `${getSiteOrigin()}/?category=${encodeURIComponent(articleCategory)}`
    });
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": selectedArticle.title,
      "item": helmetCanonical
    });
  } else if (currentCategory) {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 2,
      "name": currentCategory,
      "item": `${getSiteOrigin()}/?category=${encodeURIComponent(currentCategory)}`
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbElements
  };

  // JSON-LD NewsArticle Schema (Conditional)
  const newsArticleSchema = selectedArticle ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": helmetCanonical
    },
    "headline": selectedArticle.title.substring(0, 110),
    "description": selectedArticle.seo?.description || selectedArticle.summary || selectedArticle.subTitle || "Berita terpercaya dari Majalengka Post.",
    "image": [helmetFullImage],
    "datePublished": (() => {
      if (!selectedArticle.date) return new Date().toISOString();
      try {
        const d = new Date(selectedArticle.date);
        return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
      } catch (e) {
        return new Date().toISOString();
      }
    })(),
    "dateModified": (() => {
      if (!selectedArticle.date) return new Date().toISOString();
      try {
        const d = new Date(selectedArticle.date);
        return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
      } catch (e) {
        return new Date().toISOString();
      }
    })(),
    "author": [{
      "@type": "Person",
      "name": selectedArticle.author || "Redaksi Majalengka Post",
      "url": `${getSiteOrigin()}/`
    }],
    "publisher": {
      "@type": "NewsMediaOrganization",
      "@id": `${getSiteOrigin()}/#organization`,
      "name": "Majalengka Post",
      "logo": {
        "@type": "ImageObject",
        "url": resolvedLogoUrl
      }
    },
    "keywords": selectedArticle.seo?.keywords || (Array.isArray(selectedArticle.tags) ? selectedArticle.tags.join(", ") : "") || "majalengka, berita",
    "articleBody": selectedArticle.content || "",
    "wordCount": selectedArticle.content ? selectedArticle.content.trim().split(/\s+/).length : 0,
    "isAccessibleForFree": "True"
  } : null;

  if (currentPath === "/terms" || currentPath === "/privacy-policy") {
    return (
      <div className={`min-h-screen ${fontFamily} bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200 pb-20 lg:pb-0`}>
        {/* Dynamic Header */}
        <HeaderNav
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setSelectedArticle(null);
            setSearchQuery("");
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setSelectedArticle(null);
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          activeRole={activeRole}
          onSelectRole={setActiveRole}
          onToggleAdmin={() => {
            if (isRedaksiUnlocked) {
              setIsAdminView(!isAdminView);
            } else {
              setShowUnlockModal(true);
            }
          }}
          isAdminView={isRedaksiUnlocked && isAdminView}
          isRedaksiUnlocked={isRedaksiUnlocked}
          onLockRedaksi={() => {
            setIsRedaksiUnlocked(false);
            setIsAdminView(false);
          }}
          onOpenUnlockModal={() => setShowUnlockModal(true)}
          breakingNewsList={activeBreakingNews}
          valasRates={valasRates}
          isSubscribed={isSubscribed}
          notificationPermission={notificationPermission}
          onToggleNotifications={handleToggleNotifications}
          onWatchLiveStream={() => setShowLiveStreamModal(true)}
        />

        {/* Float/Absolute Theme Settings trigger button */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            id="btn-toggle-theme-panel"
            onClick={() => setShowThemePanel(!showThemePanel)}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl transition-all hover:scale-105"
          >
            <Palette className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Tema & Branding</span>
          </button>
          
          {showThemePanel && (
            <div className="absolute bottom-14 left-0 w-80 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="flex justify-between items-center px-3 py-1 border-b border-gray-100 dark:border-gray-850">
                <span className="text-xs font-bold text-gray-400">Branding Preset</span>
                <button onClick={() => setShowThemePanel(false)} className="text-xs text-gray-400 hover:text-black">✕</button>
              </div>
              <ThemeConfigurator
                currentTheme={currentTheme}
                onChangeTheme={setCurrentTheme}
                fontFamily={fontFamily}
                onChangeFont={setFontFamily}
                density={density}
                onChangeDensity={setDensity}
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
          {currentPath === "/terms" ? (
            <TermsPage onBackHome={() => {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }} />
          ) : (
            <PrivacyPolicyPage onBackHome={() => {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }} />
          )}
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    );
  }

  if (isMobileViewport) {
    return (
      <div className={`min-h-screen ${fontFamily} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
        <Helmet>
          <title>{helmetTitle}</title>
          <meta name="description" content={helmetDesc} />
          <meta name="keywords" content={helmetKeywords} />
          <link rel="canonical" href={helmetCanonical} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="theme-color" content={darkMode ? "#020617" : "#b91c1c"} />
          <link rel="manifest" href="/manifest.json" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content={selectedArticle ? "article" : "website"} />
          <meta property="og:site_name" content="Majalengka Post" />
          <meta property="og:title" content={helmetTitle} />
          <meta property="og:description" content={helmetDesc} />
          <meta property="og:image" content={helmetFullImage} />
          <meta property="og:url" content={helmetCanonical} />
          <meta property="og:locale" content="id_ID" />
          {selectedArticle && (
            <>
              <meta property="article:published_time" content={(() => {
                if (!selectedArticle.date) return new Date().toISOString();
                try {
                  const d = new Date(selectedArticle.date);
                  return isNaN(d.getTime()) ? selectedArticle.date : d.toISOString();
                } catch (e) {
                  return selectedArticle.date;
                }
              })()} />
              <meta property="article:author" content={selectedArticle.author || "Redaksi Majalengka Post"} />
              <meta property="article:section" content={selectedArticle.category || "Berita"} />
              {Array.isArray(selectedArticle.tags) && selectedArticle.tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
              ))}
            </>
          )}

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@majalengkapost" />
          <meta name="twitter:creator" content={selectedArticle?.author ? `@${slugify(selectedArticle.author)}` : "@majalengkapost"} />
          <meta name="twitter:title" content={helmetTitle} />
          <meta name="twitter:description" content={helmetDesc} />
          <meta name="twitter:image" content={helmetFullImage} />

          {/* Global Organization Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(organizationSchema)}
          </script>

          {/* Global BreadcrumbList Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>

          {/* Conditional NewsArticle Structured Data */}
          {newsArticleSchema && (
            <script type="application/ld+json">
              {JSON.stringify(newsArticleSchema)}
            </script>
          )}
        </Helmet>

        {isRedaksiUnlocked && isAdminView ? (
          <div className="pb-20">
            <div className="bg-red-700 text-white p-4 text-xs font-black uppercase tracking-wider flex justify-between items-center">
              <span>Admin View (Mobile)</span>
              <button onClick={() => setIsAdminView(false)} className="bg-white/20 px-2.5 py-1 rounded-md">Lihat Publik</button>
            </div>
            <CMSDashboard
              articles={articles}
              banners={banners}
              openingBanners={openingBanners}
              activeRole={activeRole}
              mediaItems={mediaItems}
              notifications={notifications}
              onAddArticle={handleAddArticle}
              onUpdateArticle={handleUpdateArticle}
              onDeleteArticle={handleDeleteArticle}
              onAddBanner={handleAddBanner}
              onUpdateBanner={handleUpdateBanner}
              onDeleteBanner={handleDeleteBanner}
              onSaveOpeningBanner={handleSaveOpeningBanner}
              onDeleteOpeningBanner={handleDeleteOpeningBanner}
              onToggleOpeningBannerActive={handleToggleOpeningBannerActive}
              valasRates={valasRates}
              onUpdateValasRates={setValasRates}
              onAddMedia={handleAddMedia}
              redaksiPin={redaksiPin}
              onUpdateRedaksiPin={handleUpdateRedaksiPin}
              companyProfiles={companyProfiles}
              onUpdateCompanyProfile={handleUpdateCompanyProfile}
              liveStreamActive={liveStreamActive}
              liveStreamTitle={liveStreamTitle}
              liveStreamViewerCount={liveStreamViewerCount}
              liveStreamType={liveStreamType}
              liveStreamUrl={liveStreamUrl}
              onUpdateLiveStreamSettings={handleUpdateLiveStreamSettings}
            />
          </div>
        ) : activeCompanyPage ? (
          <div className="pb-20">
            <CompanyProfile
              activePage={activeCompanyPage}
              profiles={companyProfiles}
              onClose={() => {
                setActiveCompanyPage(null);
                window.location.hash = "";
              }}
              onPageChange={(page) => {
                window.location.hash = page;
              }}
            />
          </div>
        ) : (
          <MobilePremiumApp
            articles={articles}
            banners={banners}
            openingBanners={openingBanners}
            valasRates={valasRates}
            currentCategory={currentCategory}
            onSelectCategory={setCurrentCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedArticle={selectedArticle}
            onSelectArticle={setSelectedArticle}
            activePoll={activePoll}
            onVotePoll={handleVotePoll}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            isRedaksiUnlocked={isRedaksiUnlocked}
            isAdminView={isAdminView}
            onToggleAdmin={() => setIsAdminView(!isAdminView)}
            onOpenUnlockModal={() => setShowUnlockModal(true)}
            onLockRedaksi={() => { setIsRedaksiUnlocked(false); setIsAdminView(false); }}
            redaksiPin={redaksiPin}
            mediaItems={mediaItems}
            onAddMedia={handleAddMedia}
            notifications={notifications}
            onAddArticle={handleAddArticle}
            currentTheme={currentTheme}
            fontFamily={fontFamily}
            isSubscribed={isSubscribed}
            notificationPermission={notificationPermission}
            onToggleNotifications={handleToggleNotifications}
            liveStreamActive={liveStreamActive}
            liveStreamTitle={liveStreamTitle}
            liveStreamViewerCount={liveStreamViewerCount}
            liveStreamType={liveStreamType}
            liveStreamUrl={liveStreamUrl}
            activeCameraFrame={activeCameraFrame}
          />
        )}

        {/* Unlock gate modal */}
        {showUnlockModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-scale-up">
              <button
                onClick={() => {
                  setShowUnlockModal(false);
                  setUnlockError("");
                  setUnlockPassword("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-red-600 mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base text-gray-900 dark:text-white uppercase tracking-wider">Otorisasi Redaksi</h3>
                <p className="text-xs text-gray-400 mt-1">Pembaca umum hanya dapat membaca berita. Masukkan kata sandi tim redaksi untuk mengaktifkan portal editor CMS.</p>
              </div>

              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kata Sandi Redaksi</label>
                  <input
                    type="password"
                    placeholder="Ketik kata sandi..."
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-gray-100"
                    autoFocus
                  />
                </div>

                {unlockError && (
                  <p className="text-red-500 font-bold text-[10px] text-center uppercase tracking-wider">{unlockError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all hover:shadow-red-600/20"
                >
                  Buka Akses Redaksi
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Opening Banner Modal for Mobile Viewport */}
        <OpeningBannerModal
          banners={openingBanners}
          currentPage={currentPath || (selectedArticle ? "article" : "home")}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${fontFamily} bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200 pb-20 lg:pb-0`}>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDesc} />
        <meta name="keywords" content={helmetKeywords} />
        <link rel="canonical" href={helmetCanonical} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={selectedArticle ? "article" : "website"} />
        <meta property="og:site_name" content="Majalengka Post" />
        <meta property="og:title" content={helmetTitle} />
        <meta property="og:description" content={helmetDesc} />
        <meta property="og:image" content={helmetFullImage} />
        <meta property="og:url" content={helmetCanonical} />
        <meta property="og:locale" content="id_ID" />
        {selectedArticle && (
          <>
            <meta property="article:published_time" content={(() => {
              if (!selectedArticle.date) return new Date().toISOString();
              try {
                const d = new Date(selectedArticle.date);
                return isNaN(d.getTime()) ? selectedArticle.date : d.toISOString();
              } catch (e) {
                return selectedArticle.date;
              }
            })()} />
            <meta property="article:author" content={selectedArticle.author || "Redaksi Majalengka Post"} />
            <meta property="article:section" content={selectedArticle.category || "Berita"} />
            {Array.isArray(selectedArticle.tags) && selectedArticle.tags.map(tag => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          </>
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@majalengkapost" />
        <meta name="twitter:creator" content={selectedArticle?.author ? `@${slugify(selectedArticle.author)}` : "@majalengkapost"} />
        <meta name="twitter:title" content={helmetTitle} />
        <meta name="twitter:description" content={helmetDesc} />
        <meta name="twitter:image" content={helmetFullImage} />

        {/* Global Organization Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* Global BreadcrumbList Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>

        {/* Conditional NewsArticle Structured Data */}
        {newsArticleSchema && (
          <script type="application/ld+json">
            {JSON.stringify(newsArticleSchema)}
          </script>
        )}
      </Helmet>
      
      {/* Dynamic spacing wrapper based on Density Setting */}
      <div className={`flex flex-col flex-1 ${
        density === "compact" ? "gap-2" : density === "spacious" ? "gap-6" : "gap-4"
      }`}>
        
        {/* Header Nav Panel */}
        <HeaderNav
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setSelectedArticle(null); // Back to category listing
            setSearchQuery("");
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setSelectedArticle(null);
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          activeRole={activeRole}
          onSelectRole={setActiveRole}
          onToggleAdmin={() => {
            if (isRedaksiUnlocked) {
              setIsAdminView(!isAdminView);
            } else {
              setShowUnlockModal(true);
            }
          }}
          isAdminView={isRedaksiUnlocked && isAdminView}
          isRedaksiUnlocked={isRedaksiUnlocked}
          onLockRedaksi={() => {
            setIsRedaksiUnlocked(false);
            setIsAdminView(false);
          }}
          onOpenUnlockModal={() => setShowUnlockModal(true)}
          breakingNewsList={activeBreakingNews}
          valasRates={valasRates}
          isSubscribed={isSubscribed}
          notificationPermission={notificationPermission}
          onToggleNotifications={handleToggleNotifications}
          onWatchLiveStream={() => setShowLiveStreamModal(true)}
        />

        {/* Float/Absolute Theme Settings trigger button */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            id="btn-toggle-theme-panel"
            onClick={() => setShowThemePanel(!showThemePanel)}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl transition-all hover:scale-105"
          >
            <Palette className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Tema & Branding</span>
          </button>
          
          {showThemePanel && (
            <div className="absolute bottom-14 left-0 w-80 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="flex justify-between items-center px-3 py-1 border-b border-gray-100 dark:border-gray-850">
                <span className="text-xs font-bold text-gray-400">Branding Preset</span>
                <button onClick={() => setShowThemePanel(false)} className="text-xs text-gray-400 hover:text-black">✕</button>
              </div>
              <ThemeConfigurator
                currentTheme={currentTheme}
                onChangeTheme={setCurrentTheme}
                fontFamily={fontFamily}
                onChangeFont={setFontFamily}
                density={density}
                onChangeDensity={setDensity}
              />
            </div>
          )}
        </div>

        {/* 3. Main Stage Container */}
        <div className="flex-1 w-full animate-fade-in">
          {isRedaksiUnlocked && isAdminView ? (
            
            // CMS EDITORIAL DASHBOARD MODE (Only accessible to unlocked redaksi)
            <CMSDashboard
              articles={articles}
              banners={banners}
              openingBanners={openingBanners}
              activeRole={activeRole}
              mediaItems={mediaItems}
              notifications={notifications}
              onAddArticle={handleAddArticle}
              onUpdateArticle={handleUpdateArticle}
              onDeleteArticle={handleDeleteArticle}
              onAddBanner={handleAddBanner}
              onUpdateBanner={handleUpdateBanner}
              onDeleteBanner={handleDeleteBanner}
              onSaveOpeningBanner={handleSaveOpeningBanner}
              onDeleteOpeningBanner={handleDeleteOpeningBanner}
              onToggleOpeningBannerActive={handleToggleOpeningBannerActive}
              valasRates={valasRates}
              onUpdateValasRates={setValasRates}
              onAddMedia={handleAddMedia}
              redaksiPin={redaksiPin}
              onUpdateRedaksiPin={handleUpdateRedaksiPin}
              companyProfiles={companyProfiles}
              onUpdateCompanyProfile={handleUpdateCompanyProfile}
              liveStreamActive={liveStreamActive}
              liveStreamTitle={liveStreamTitle}
              liveStreamViewerCount={liveStreamViewerCount}
              liveStreamType={liveStreamType}
              liveStreamUrl={liveStreamUrl}
              onUpdateLiveStreamSettings={handleUpdateLiveStreamSettings}
            />

          ) : activeCompanyPage ? (

            // STATIS COMPANY PROFILE PAGES VIEW (Susunan Redaksi, Karir, Kontak, Iklan)
            <CompanyProfile
              activePage={activeCompanyPage}
              profiles={companyProfiles}
              onClose={() => {
                setActiveCompanyPage(null);
                window.location.hash = "";
              }}
              onPageChange={(page) => {
                window.location.hash = page;
              }}
            />

          ) : (

            // PUBLIC PORTAL MODE (For general readers and locked state)
            <PublicPortal
              articles={articles}
              banners={banners}
              onUpdateBanner={handleUpdateBanner}
              valasRates={valasRates}
              currentCategory={currentCategory}
              onSelectCategory={setCurrentCategory}
              searchQuery={searchQuery}
              selectedArticle={selectedArticle}
              onSelectArticle={setSelectedArticle}
              activePoll={activePoll}
              onVotePoll={handleVotePoll}
            />

          )}
        </div>

      </div>

      {/* Global Footer */}
      <Footer />

      {/* ================= EDITORIAL UNLOCK / GATE MODAL ================= */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-scale-up">
            <button
              onClick={() => {
                setShowUnlockModal(false);
                setUnlockError("");
                setUnlockPassword("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-red-600 mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-gray-900 dark:text-white uppercase tracking-wider">Otorisasi Redaksi</h3>
              <p className="text-xs text-gray-400 mt-1">Pembaca umum hanya dapat membaca berita. Masukkan kata sandi tim redaksi untuk mengaktifkan portal editor CMS.</p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kata Sandi Redaksi</label>
                <input
                  type="password"
                  placeholder="Ketik kata sandi..."
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-gray-100"
                  autoFocus
                />
              </div>

              {unlockError && (
                <p className="text-red-500 font-bold text-[10px] text-center uppercase tracking-wider">{unlockError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all hover:shadow-red-600/20"
              >
                Buka Akses Redaksi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= PUBLIC LIVE STREAMING MODAL ================= */}
      {showLiveStreamModal && (
        <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-[250] p-3 sm:p-6 overflow-y-auto transition-colors duration-300 ${liveStreamTheme === "light" ? "bg-slate-100/90 text-slate-900" : "bg-slate-950/95 text-white"}`}>
          <div className={`rounded-3xl max-w-5xl w-full shadow-2xl relative overflow-hidden flex flex-col md:grid md:grid-cols-3 max-h-[92vh] border transition-colors duration-300 ${liveStreamTheme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}>
            
            {/* Close Button */}
            <button
              onClick={() => setShowLiveStreamModal(false)}
              className={`absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 ${liveStreamTheme === "light" ? "bg-slate-100 border border-slate-300 text-slate-600 hover:text-slate-900" : "bg-black/60 border border-slate-700 text-slate-300 hover:text-white"}`}
              title="Tutup Siaran"
            >
              ✕
            </button>

            {liveStreamActive ? (
              <>
                {/* Left/Main Column: Video Player & Metadata (Span 2) */}
                <div className="md:col-span-2 p-5 flex flex-col overflow-y-auto">
                  {/* Offline Mode Warning Banner */}
                  {isOfflineMode && (
                    <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-bold p-3 rounded-2xl mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Mode Cadangan: Koneksi server utama luring. Pengaturan & default lokal diaktifkan secara otomatis.</span>
                    </div>
                  )}

                  {/* Dynamic Real Video Player */}
                  <div ref={playerContainerRef} className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-lg group">
                    {liveStreamType === "youtube" ? (
                      <iframe
                        src={liveStreamUrl.includes("embed") ? `${liveStreamUrl}${liveStreamUrl.includes("?") ? "&" : "?"}autoplay=1&mute=1` : (() => {
                          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                          const match = liveStreamUrl.match(regExp);
                          if (match && match[2].length === 11) {
                            return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1`;
                          }
                          return liveStreamUrl;
                        })()}
                        title={liveStreamTitle}
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
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-950">
                          <div className="relative">
                            <div className="absolute -inset-1.5 bg-red-600 rounded-full blur opacity-40 animate-pulse"></div>
                            <div className="relative w-16 h-16 rounded-full bg-slate-900 border border-red-600 flex items-center justify-center shadow-inner">
                              <Tv className="w-7 h-7 text-red-500 animate-pulse" />
                            </div>
                          </div>

                          <div className="text-center px-4">
                            <p className="text-[10px] font-black tracking-[0.25em] text-red-500 uppercase">MAJALENGKA POST TV</p>
                            <p className="text-xs font-bold text-slate-300 mt-2">Transmisi belum dimulai...</p>
                            <p className="text-[10px] text-slate-500 mt-1">Siaran kamera web dari ruang redaksi akan muncul secara otomatis di sini.</p>
                          </div>
                        </div>
                      )
                    ) : (
                      // Custom direct video source (MP4 / HLS / WebM)
                      <video
                        src={liveStreamUrl}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-contain absolute inset-0 bg-slate-950"
                      />
                    )}

                    {/* Floating Reactions Overlay (Conditional) */}
                    {liveStreamFloatingComments && (
                      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
                        {floatingReactions.map((reaction) => (
                          <div
                            key={reaction.id}
                            className="absolute text-3xl reaction-item"
                            style={{
                              left: `${reaction.left}%`,
                              bottom: "12px",
                              "--rot": `${reaction.rotate}deg`,
                              transform: `scale(${reaction.scale})`,
                            } as React.CSSProperties}
                          >
                            {reaction.emoji}
                          </div>
                        ))}
                      </div>
                    )}

                    <style>{`
                      @keyframes reactionFloat {
                        0% {
                          transform: translateY(0) scale(0.3) rotate(0deg);
                          opacity: 0;
                        }
                        10% {
                          transform: translateY(-25px) scale(1.3) rotate(var(--rot));
                          opacity: 1;
                        }
                        100% {
                          transform: translateY(-240px) scale(0.8) rotate(calc(var(--rot) * 1.6));
                          opacity: 0;
                        }
                      }
                      .reaction-item {
                        animation: reactionFloat 2.3s cubic-bezier(0.08, 0.82, 0.17, 1) forwards;
                      }
                    `}</style>

                    {/* HUD - TOP LEFT: Live Indicator */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
                      <span className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider shadow-md">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                        LIVE
                      </span>
                      <span className="bg-black/60 text-slate-200 text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider border border-slate-800">
                        {liveStreamType === "camera" ? "WEBCAM PORTAL" : liveStreamType === "youtube" ? "YOUTUBE BROADCAST" : "CUSTOM STREAM"}
                      </span>
                    </div>

                    {/* HUD - TOP RIGHT: Viewer Count */}
                    <div className="absolute top-4 right-14 flex items-center gap-2 bg-black/60 text-slate-200 text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider border border-slate-800 z-10 pointer-events-none">
                      <span className="text-red-500">👁</span>
                      <span>{liveStreamViewersLocal} Pemirsa</span>
                    </div>
                  </div>

                  {/* Stream Info & Metadata Block */}
                  <div className="mt-4 flex-1 text-left">
                    <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest bg-red-950/40 px-2.5 py-1 rounded-md border border-red-900/40">
                      Majalengka Post TV
                    </span>
                    <h2 className={`text-lg sm:text-xl font-black uppercase tracking-wide mt-3 leading-snug ${liveStreamTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {liveStreamTitle}
                    </h2>
                    <p className={`text-xs mt-2 font-medium leading-relaxed ${liveStreamTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      Menyiarkan laporan aktual dan wawancara eksklusif langsung dari tempat kejadian. Didukung oleh jurnalisme investigatif tepercaya dan independen Majalengka Post.
                    </p>

                    {/* Interactive Player Settings Controls */}
                    <div className={`p-4 rounded-2xl border mt-5 text-left ${liveStreamTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'}`}>
                      <span className={`text-[10px] font-black uppercase tracking-wider block mb-3 ${liveStreamTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Pengaturan Siaran TV</span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* Theme Toggle */}
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-bold uppercase ${liveStreamTheme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Tema Layar</span>
                          <div className="flex items-center gap-1 bg-black/10 dark:bg-black/40 p-1 rounded-lg">
                            <button
                              onClick={() => {
                                setLiveStreamTheme("dark");
                                savePlayerSetting("mp_live_theme", "dark");
                              }}
                              className={`flex-1 text-[9px] font-black uppercase py-1 px-1.5 rounded transition-all ${liveStreamTheme === "dark" ? "bg-red-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                            >
                              Gelap
                            </button>
                            <button
                              onClick={() => {
                                setLiveStreamTheme("light");
                                savePlayerSetting("mp_live_theme", "light");
                              }}
                              className={`flex-1 text-[9px] font-black uppercase py-1 px-1.5 rounded transition-all ${liveStreamTheme === "light" ? "bg-red-600 text-white" : "text-slate-400 hover:text-slate-600"}`}
                            >
                              Terang
                            </button>
                          </div>
                        </div>

                        {/* Floating Comments Toggle */}
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-bold uppercase ${liveStreamTheme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Komentar Mengambang</span>
                          <button
                            onClick={() => {
                              const newVal = !liveStreamFloatingComments;
                              setLiveStreamFloatingComments(newVal);
                              savePlayerSetting("mp_live_floating_comments", newVal ? "true" : "false");
                            }}
                            className={`text-[9px] font-black uppercase py-2 px-2.5 rounded-lg border transition-all text-center ${liveStreamFloatingComments ? "bg-green-600/20 border-green-500/50 text-green-400 animate-pulse" : "bg-slate-800/40 border-slate-700/50 text-slate-400"}`}
                          >
                            {liveStreamFloatingComments ? "● Aktif" : "○ Nonaktif"}
                          </button>
                        </div>

                        {/* Quality Select */}
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-bold uppercase ${liveStreamTheme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Kualitas Siaran</span>
                          <div className="grid grid-cols-3 gap-1 bg-black/10 dark:bg-black/40 p-1 rounded-lg">
                            {["1080p", "720p", "480p"].map((q) => (
                              <button
                                key={q}
                                onClick={() => {
                                  setLiveStreamQuality(q);
                                  savePlayerSetting("mp_live_quality", q);
                                }}
                                className={`text-[8px] font-black py-1 rounded transition-all text-center ${liveStreamQuality === q ? "bg-red-600 text-white animate-pulse" : "text-slate-400 hover:text-white"}`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Fullscreen Trigger */}
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-bold uppercase ${liveStreamTheme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Ukuran Layar</span>
                          <button
                            onClick={handleToggleFullscreen}
                            className={`text-[9px] font-black uppercase py-2 px-2.5 rounded-lg border transition-all flex items-center justify-center gap-1.5 ${liveStreamFullscreen ? "bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-slate-800/40 border-slate-700/50 text-slate-400"}`}
                          >
                            <Maximize className="w-3 h-3 animate-pulse" />
                            {liveStreamFullscreen ? "Layar Penuh" : "Kecil"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Share Portal for Live Stream */}
                    <div className="border-t border-slate-800/80 mt-5 pt-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${liveStreamTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Bagikan Siaran Langsung Ini</span>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`*LIVE STREAMING*: *${liveStreamTitle}*\n\nTonton siaran langsung Majalengka Post TV sekarang:\n${window.location.origin}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={async () => {
                            try {
                              await safeFetchJson("/api/shares/increment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ articleId: "livestream", platform: "whatsapp" })
                              }, 0);
                            } catch {}
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider transition-all"
                        >
                          WhatsApp
                        </a>
                        
                        {/* Facebook */}
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={async () => {
                            try {
                              await safeFetchJson("/api/shares/increment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ articleId: "livestream", platform: "facebook" })
                              }, 0);
                            } catch {}
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider transition-all"
                        >
                          Facebook
                        </a>

                        {/* Twitter */}
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`LIVE STREAMING: ${liveStreamTitle}`)}&url=${encodeURIComponent(window.location.origin)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={async () => {
                            try {
                              await safeFetchJson("/api/shares/increment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ articleId: "livestream", platform: "twitter" })
                              }, 0);
                            } catch {}
                          }}
                          className="bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider transition-all"
                        >
                          Twitter/X
                        </a>

                        {/* Copy Link */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + "/?livetv=true");
                            alert("Tautan live streaming berhasil disalin ke papan klip!");
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase tracking-wider transition-all border border-slate-700"
                        >
                          <Copy className="w-3 h-3" />
                          Salin Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Chat Screen */}
                <div className="bg-slate-950 p-5 flex flex-col h-[380px] md:h-auto border-t md:border-t-0 md:border-l border-slate-800 overflow-hidden">
                  <div className="border-b border-slate-800 pb-3 mb-3 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-slate-200">
                        <MessageSquare className="w-4 h-4 text-red-500 animate-pulse" />
                        Obrolan Langsung
                      </h3>
                      {/* Live real-time viewer count from WS connection */}
                      <span className="text-[10px] text-red-500 font-extrabold flex items-center gap-1.5 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        {liveStreamViewersLocal} Pemirsa
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-0.5">Berkomentarlah secara positif dan dukung jurnalisme lokal.</p>

                    {/* Chat Name customizer */}
                    <div className="mt-2.5 p-2 bg-slate-900/40 rounded-lg border border-slate-900 flex items-center justify-between gap-2">
                      {isEditingUsername ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            maxLength={25}
                            value={tempUsername}
                            onChange={(e) => setTempUsername(e.target.value)}
                            placeholder="Ketik nama baru..."
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-red-500 flex-1 font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = tempUsername.trim();
                              if (trimmed) {
                                setChatUsername(trimmed);
                                try {
                                  safeLocalStorage.setItem("mp_chat_username", trimmed);
                                } catch {}
                              }
                              setIsEditingUsername(false);
                            }}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold text-[9px] px-2 py-1 rounded transition-colors"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingUsername(false)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] px-2 py-1 rounded transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] text-slate-400">
                            Nama Anda: <strong className="text-amber-400 font-bold uppercase">{chatUsername}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setTempUsername(chatUsername);
                              setIsEditingUsername(true);
                            }}
                            className="text-[9px] text-red-500 hover:text-red-400 underline font-black uppercase tracking-wider transition-colors"
                          >
                            Ubah Nama
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left scrollbar-thin scrollbar-thumb-slate-800">
                    {liveStreamChats.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-600 text-[10px] font-bold uppercase">
                        Belum ada pesan obrolan...
                      </div>
                    ) : (
                      liveStreamChats.map((msg) => {
                        const isMe = msg.name === chatUsername;
                        return (
                          <div key={msg.id} className="text-[11px] leading-relaxed animate-fade-in bg-slate-900/50 p-2 rounded-xl border border-slate-900">
                            <div className="flex items-center justify-between">
                              <span className={`font-black uppercase text-[10px] tracking-wide ${isMe ? "text-amber-400" : "text-red-400"}`}>
                                {msg.name} {isMe && " (Saya)"}
                              </span>
                              <span className="text-[9px] text-slate-600">{msg.time}</span>
                            </div>
                            <p className="text-slate-300 mt-0.5 font-medium">{msg.text}</p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Quick Reactions Bar & Emoji Picker Container */}
                  <div className="border-t border-slate-900 pt-2.5 mt-2.5 space-y-2 relative">
                    
                    {/* Emoji Picker Panel */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 animate-fade-in text-left">
                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800/60">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Pilih Emoji Chat</span>
                          <button 
                            type="button" 
                            onClick={() => setShowEmojiPicker(false)}
                            className="text-slate-500 hover:text-slate-300 text-[10px] font-bold"
                          >
                            Tutup ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-6 gap-2 max-h-[120px] overflow-y-auto scrollbar-thin">
                          {['😊', '🥰', '😍', '😘', '😜', '🤪', '🤔', '🤨', '🙄', '😬', '🤫', '😴', '😷', '😈', '👻', '💀', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😼'].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setNewLiveStreamChat(prev => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-xl p-1.5 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center active:scale-95"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Reactions list & Smiley Toggle */}
                    <div className="flex items-center justify-between gap-1.5 bg-slate-900/30 p-1.5 rounded-xl border border-slate-900/60">
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                        {['👍', '❤️', '😂', '🔥', '😮', '👏', '🎉', '💡'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => sendReaction(emoji)}
                            className="text-base px-2 py-1 bg-slate-950/50 hover:bg-slate-900 border border-slate-800/40 rounded-lg transition-all active:scale-90 flex items-center justify-center shrink-0 hover:border-slate-700"
                            title={`Kirim Reaksi ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      {/* Emoji Picker Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-1.5 rounded-lg border text-sm transition-all shrink-0 flex items-center justify-center ${showEmojiPicker ? "bg-red-950/40 border-red-900 text-red-400" : "bg-slate-950/50 border-slate-800/40 text-amber-400 hover:border-slate-700"}`}
                        title="Tampilkan Keyboard Emoji"
                      >
                        😊
                      </button>
                    </div>
                  </div>

                  {/* Input form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newLiveStreamChat.trim()) return;
                      
                      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({
                          type: "message",
                          name: chatUsername,
                          text: newLiveStreamChat
                        }));
                        setNewLiveStreamChat("");
                      } else {
                        alert("Koneksi obrolan terputus. Silakan coba sesaat lagi.");
                      }
                    }}
                    className="border-t border-slate-800 pt-3 mt-3 flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Tulis pesan obrolan..."
                      value={newLiveStreamChat}
                      onChange={(e) => setNewLiveStreamChat(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-red-500 text-white placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-3 py-2 flex items-center justify-center transition-all shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Offline State */
              <div className="md:col-span-3 p-10 flex flex-col items-center justify-center text-center space-y-5 min-h-[350px]">
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Tv className="w-8 h-8 opacity-40" />
                </div>
                
                <div className="space-y-2 max-w-md">
                  <h3 className="text-lg font-black uppercase tracking-wider text-slate-200">Siaran Langsung Offline</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Redaksi saat ini sedang tidak mengadakan siaran langsung. Silakan cek kembali nanti atau berlangganan pemberitahuan agar tidak melewatkan berita penting kami!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm justify-center pt-2">
                  <button
                    onClick={async () => {
                      await handleToggleNotifications();
                      alert("Terima kasih! Anda akan menerima pemberitahuan instan saat kami memulai Siaran Langsung.");
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-600/10 w-full sm:w-auto"
                  >
                    Aktifkan Notifikasi
                  </button>
                  <button
                    onClick={() => setShowLiveStreamModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all border border-slate-700 w-full sm:w-auto"
                  >
                    Kembali Ke Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= PROMPT AKTIFKAN NOTIFIKASI PWA ================= */}
      {showNotificationPrompt && notificationPermission === "default" && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:max-w-md bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950/50 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] animate-bounce-in flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-950/50 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Aktifkan Notifikasi Berita Baru</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-normal">
                Dapatkan pemberitahuan langsung di perangkat Anda setiap kali ada artikel atau berita baru terbit di Majalengka Post!
              </p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setShowNotificationPrompt(false);
                try {
                  sessionStorage.setItem("majalengkapost_notif_prompt_dismissed", "true");
                } catch (e) {
                  console.warn(e);
                }
              }}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Nanti Saja
            </button>
            <button
              onClick={async () => {
                setShowNotificationPrompt(false);
                try {
                  sessionStorage.setItem("majalengkapost_notif_prompt_dismissed", "true");
                } catch (e) {
                  console.warn(e);
                }
                const granted = await requestNotificationPermission();
                setNotificationPermission(getNotificationPermissionStatus());
                if (granted) {
                  setIsSubscribed(true);
                  try {
                    if ('serviceWorker' in navigator) {
                      const reg = await navigator.serviceWorker.ready;
                      reg.showNotification("Notifikasi Aktif!", {
                        body: "Terima kasih! Anda akan menerima notifikasi setiap ada berita baru.",
                        icon: "/favicon.png"
                      });
                    } else {
                      new Notification("Notifikasi Aktif!", {
                        body: "Terima kasih! Anda akan menerima notifikasi setiap ada berita baru.",
                        icon: "/favicon.png"
                      });
                    }
                  } catch (err) {
                    console.warn(err);
                  }
                }
              }}
              className="flex-1 py-2 bg-gradient-to-br from-[#FF3B30] via-[#E60023] to-[#B00020] border-t border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.98] transition-transform cursor-pointer"
            >
              Aktifkan
            </button>
          </div>
        </div>
      )}

      {/* ================= FIXED BOTTOM NAVIGATION (MOBILE/TABLET ONLY) ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 lg:hidden px-2 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex items-center justify-around">
        {/* Tab: Beranda */}
        <button
          onClick={() => {
            setActiveBottomTab("beranda");
            setSelectedArticle(null);
            setCurrentCategory("");
            setSearchQuery("");
            setIsAdminView(false);
            setShowCategoryModal(false);
            setShowProfileModal(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 gap-1 min-h-[48px] min-w-[54px] ${
            activeBottomTab === "beranda" && !showCategoryModal && !showProfileModal
              ? "text-red-600 dark:text-red-500 font-extrabold scale-105"
              : "text-slate-400 dark:text-slate-500 font-bold hover:text-slate-700"
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider">Beranda</span>
        </button>

        {/* Tab: Berita */}
        <button
          onClick={() => {
            setActiveBottomTab("berita");
            setSelectedArticle(null);
            setCurrentCategory("");
            setIsAdminView(false);
            setShowCategoryModal(false);
            setShowProfileModal(false);
            // Quick scroll to news cards list
            const element = document.querySelector("main");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 gap-1 min-h-[48px] min-w-[54px] ${
            activeBottomTab === "berita" && !showCategoryModal && !showProfileModal
              ? "text-red-600 dark:text-red-500 font-extrabold scale-105"
              : "text-slate-400 dark:text-slate-500 font-bold hover:text-slate-700"
          }`}
        >
          <Newspaper className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider">Berita</span>
        </button>

        {/* Tab: Video */}
        <button
          onClick={() => {
            setActiveBottomTab("video");
            setSelectedArticle(null);
            setCurrentCategory("Video");
            setIsAdminView(false);
            setShowCategoryModal(false);
            setShowProfileModal(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 gap-1 min-h-[48px] min-w-[54px] ${
            activeBottomTab === "video" && !showCategoryModal && !showProfileModal
              ? "text-red-600 dark:text-red-500 font-extrabold scale-105"
              : "text-slate-400 dark:text-slate-500 font-bold hover:text-slate-700"
          }`}
        >
          <Video className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider">Video</span>
        </button>

        {/* Tab: Kategori */}
        <button
          onClick={() => {
            setShowCategoryModal(true);
            setShowProfileModal(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 gap-1 min-h-[48px] min-w-[54px] ${
            showCategoryModal
              ? "text-red-600 dark:text-red-500 font-extrabold scale-105"
              : "text-slate-400 dark:text-slate-500 font-bold hover:text-slate-700"
          }`}
        >
          <Layers className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider">Kategori</span>
        </button>
      </div>

      {/* ================= CATEGORY SELECTION SLIDE-UP BOTTOM SHEET ================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 lg:hidden flex items-end justify-center animate-fade-in" onClick={() => setShowCategoryModal(false)}>
          <div 
            className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 w-full max-h-[85vh] overflow-y-auto shadow-2xl relative transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header notch line */}
            <div className="mx-auto w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mb-4 cursor-pointer" onClick={() => setShowCategoryModal(false)} />
            
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider">Pilih Kategori Berita</h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-8">
              {/* All Categories Option */}
              <button
                onClick={() => {
                  setCurrentCategory("");
                  setSelectedArticle(null);
                  setActiveBottomTab("beranda");
                  setShowCategoryModal(false);
                }}
                className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider rounded-2xl text-center transition-all border ${
                  currentCategory === ""
                    ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/25"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-850 hover:bg-slate-100"
                }`}
              >
                Semua Berita
              </button>

              {/* Special Video category option */}
              <button
                onClick={() => {
                  setCurrentCategory("Video");
                  setSelectedArticle(null);
                  setActiveBottomTab("video");
                  setShowCategoryModal(false);
                }}
                className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider rounded-2xl text-center transition-all border ${
                  currentCategory === "Video"
                    ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/25"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-850 hover:bg-slate-100"
                }`}
              >
                Liputan Video
              </button>

              {/* General categories map */}
              {["Nasional", "Politik", "Daerah", "Ekonomi", "Teknologi", "Kesehatan", "Olahraga", "Hiburan", "Lifestyle", "Religi", "Budaya", "Opini"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCurrentCategory(cat);
                    setSelectedArticle(null);
                    setActiveBottomTab("berita");
                    setShowCategoryModal(false);
                  }}
                  className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider rounded-2xl text-center transition-all border ${
                    currentCategory === cat
                      ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/25"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-850 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= PROFILE & SETTINGS SLIDE-UP BOTTOM SHEET ================= */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 lg:hidden flex items-end justify-center animate-fade-in" onClick={() => setShowProfileModal(false)}>
          <div 
            className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 w-full max-h-[85vh] overflow-y-auto shadow-2xl relative transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header notch line */}
            <div className="mx-auto w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mb-4 cursor-pointer" onClick={() => setShowProfileModal(false)} />

            <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider">Profil & Pengaturan Portal</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-5 pb-10">
              {/* App Info Card */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 font-bold text-lg shrink-0">
                  MP
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Majalengka Post</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Mobile App Version 2.4.0</p>
                </div>
              </div>

              {/* Utility Row: Dark Mode */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Mode Gelap (Dark Mode)</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                    darkMode ? "bg-red-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${darkMode ? "right-1" : "left-1"}`} />
                </button>
              </div>

              {/* Utility Row: Themes Presets */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Preset Warna Redaksi</span>
                <div className="grid grid-cols-4 gap-2">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setCurrentTheme(preset)}
                      className={`py-2 px-1 rounded-lg text-[9px] font-bold text-center transition-all truncate border ${
                        currentTheme.name === preset.name
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-red-500 shadow-xs"
                          : "bg-transparent text-slate-500 border-transparent hover:bg-white/5"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full mx-auto mb-1 border border-black/10" style={{ backgroundColor: preset.primary }} />
                      <span className="truncate block">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Utility Row: Supabase Status (Mobile/Tablet) */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                <div className="flex items-center justify-between mb-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supabase Cloud Sync</span>
                  {supabaseStatus === "success" && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                  {supabaseStatus === "syncing" && <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />}
                  {supabaseStatus === "missing_tables" && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                  {supabaseStatus === "error" && <span className="h-2 w-2 rounded-full bg-red-500" />}
                </div>

                {supabaseStatus === "unconfigured" && (
                  <p className="text-[10px] text-slate-500">Database belum dikonfigurasi (.env.example).</p>
                )}

                {supabaseStatus === "syncing" && (
                  <p className="text-[10px] text-slate-500">Menghubungkan ke database Supabase...</p>
                )}

                {supabaseStatus === "success" && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Terhubung & Sinkron Realtime</p>
                    <button
                      onClick={handleForceSync}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all"
                    >
                      Paksa Sinkron Sekarang
                    </button>
                  </div>
                )}

                {supabaseStatus === "missing_tables" && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold leading-tight">Database Terhubung, Tabel Belum Ada</p>
                    <button
                      onClick={() => {
                        setShowProfileModal(false);
                        setShowSqlModal(true);
                      }}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all"
                    >
                      Tampilkan Query SQL Setup
                    </button>
                  </div>
                )}

                {supabaseStatus === "error" && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-red-500 font-bold truncate">{supabaseErrorMsg || "Gagal Terhubung"}</p>
                    <button
                      onClick={handleForceSync}
                      className="w-full py-2 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all"
                    >
                      Coba Hubungkan Ulang
                    </button>
                  </div>
                )}
              </div>

              {/* Utility Row: Editorial Access Gate */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Otorisasi Tim Redaksi (CMS)</span>
                {isRedaksiUnlocked ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200">
                      <span>Status: <strong className="text-emerald-500">Unlocked (Redaktur)</strong></span>
                      <span className="font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-bold">PIN: {redaksiPin}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsAdminView(!isAdminView);
                          setShowProfileModal(false);
                        }}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all"
                      >
                        {isAdminView ? "Lihat Portal Publik" : "Masuk Dashboard CMS"}
                      </button>
                      <button
                        onClick={() => {
                          setIsRedaksiUnlocked(false);
                          setIsAdminView(false);
                        }}
                        className="py-3 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all"
                      >
                        Lock
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-slate-400 leading-normal mb-3">Gunakan PIN tim redaksi untuk membuka dashboard pengelola CMS, kelola berita, tata letak iklan, dll.</p>
                    <button
                      onClick={() => {
                        setShowUnlockModal(true);
                        setShowProfileModal(false);
                      }}
                      className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-red-500" />
                      <span>Masuk Otorisasi Redaksi</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUPABASE CLOUD STATUS FLOAT (DESKTOP ONLY) ================= */}
      <div className="fixed bottom-6 right-6 z-50 hidden lg:flex flex-col items-end gap-2 text-left">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 w-72 max-w-xs animate-fade-in text-slate-850 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white">Supabase Cloud</span>
            </div>
            {supabaseStatus === "success" && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
            {supabaseStatus === "syncing" && (
              <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin shrink-0" />
            )}
            {supabaseStatus === "missing_tables" && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
            {supabaseStatus === "error" && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </div>

          <div className="space-y-2">
            {supabaseStatus === "unconfigured" && (
              <div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2">Kunci API Supabase belum terdeteksi. Konfigurasikan file env Anda.</p>
                <div className="text-[9px] bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-1.5 rounded-lg border border-red-100/50 dark:border-red-950/50 font-bold">Unconfigured</div>
              </div>
            )}

            {supabaseStatus === "syncing" && (
              <p className="text-[10px] text-slate-400 leading-relaxed">Menghubungi dan memuat data terbaru dari server Supabase...</p>
            )}

            {supabaseStatus === "success" && (
              <div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2">Tersambung! Seluruh data artikel, iklan, media, dan polling tersinkronisasi otomatis secara realtime.</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={handleForceSync}
                    className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-100/50 dark:border-emerald-900/50 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Sekarang</span>
                  </button>
                </div>
              </div>
            )}

            {supabaseStatus === "missing_tables" && (
              <div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mb-1 leading-normal">Tabel Database Belum Ada!</p>
                <p className="text-[9px] text-slate-400 leading-normal mb-2 font-medium">Server terhubung, tetapi Anda perlu membuat struktur tabel PostgreSQL di SQL Editor Supabase Anda.</p>
                <button
                  onClick={() => setShowSqlModal(true)}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Lihat Kode SQL Setup</span>
                </button>
              </div>
            )}

            {supabaseStatus === "error" && (
              <div>
                <p className="text-[10px] text-red-500 font-bold mb-1">Gagal Terhubung</p>
                <p className="text-[9px] text-slate-400 leading-normal mb-2 truncate" title={supabaseErrorMsg}>{supabaseErrorMsg || "Periksa koneksi internet atau kredensial env Anda."}</p>
                <button
                  onClick={handleForceSync}
                  className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                >
                  Coba Hubungkan Ulang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= SUPABASE SQL SETUP DIALOG MODAL ================= */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative animate-scale-up text-left">
            <button
              onClick={() => {
                setShowSqlModal(false);
                setSqlCopied(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer text-lg font-bold p-1"
            >
              ✕
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Database className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">Setup Tabel PostgreSQL Supabase</h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                Supabase Anda terhubung dengan sukses! Sekarang, copy script SQL di bawah ini, buka dashboard Supabase Anda, masuk ke menu <strong className="text-slate-800 dark:text-white">SQL Editor</strong>, paste kode ini, lalu klik <strong className="text-slate-800 dark:text-white">Run</strong> untuk membuat tabel secara otomatis.
              </p>
            </div>

            <div className="relative bg-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800">
              <pre className="text-[10px] font-mono text-slate-300 max-h-60 overflow-y-auto leading-relaxed select-all scrollbar-thin">
                {SUPABASE_SQL_SCHEMA}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                  setSqlCopied(true);
                  setTimeout(() => setSqlCopied(false), 2000);
                }}
                className="absolute top-3 right-3 py-1.5 px-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {sqlCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-5 flex justify-between items-center">
              <a 
                href="https://supabase.com" 
                target="_blank" 
                referrerPolicy="no-referrer"
                rel="noreferrer"
                className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => {
                  setShowSqlModal(false);
                  setSqlCopied(false);
                }}
                className="py-2.5 px-5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Opening Banner / Splash Promo Modal */}
      <OpeningBannerModal
        banners={openingBanners}
        currentPage={currentPath || (typeof window !== "undefined" ? window.location.pathname : "/")}
      />
    </div>
  );
}

