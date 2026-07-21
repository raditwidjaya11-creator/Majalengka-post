import React, { useState, useEffect } from "react";
import { 
  BarChart3, LayoutList, FilePlus2, Image as ImageIcon, Send, Sliders, 
  Settings, RefreshCw, Sparkles, Check, Copy, User, HelpCircle, 
  MapPin, Clock, Eye, AlertCircle, Trash, Search, Folder, 
  Tag as TagIcon, CheckSquare, Bell, Megaphone, Smartphone, DollarSign,
  Briefcase, Activity, Calendar, ShieldCheck, ChevronRight, Upload
} from "lucide-react";
import { Article, ArticleStatus, UserRole, MediaItem, AdBanner, InternalNotification, AuditLog, ValasRate, OpeningBanner } from "../types";
import { CATEGORIES, REALTIME_ANALYTICS } from "../mockData";
import TiptapWordEditor from "./TiptapWordEditor";
import ArticlePreviewModal from "./ArticlePreviewModal";
import HorizontalBannerManager from "./HorizontalBannerManager";
import OpeningBannerManager from "./OpeningBannerManager";
import { CompanyProfilePage } from "./CompanyProfile";
import { uploadFileToSupabaseStorage } from "../lib/supabase";
// Removed SeoAnalyzer per user request: "jangan tampilkan sistem data se di dasshbor"


interface CMSDashboardProps {
  articles: Article[];
  banners: AdBanner[];
  openingBanners?: OpeningBanner[];
  activeRole: UserRole;
  mediaItems: MediaItem[];
  notifications: InternalNotification[];
  onAddArticle: (article: Article) => void;
  onUpdateArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onAddBanner: (banner: AdBanner) => void;
  onUpdateBanner: (banner: AdBanner) => void;
  onDeleteBanner: (id: string) => void;
  onSaveOpeningBanner?: (banner: OpeningBanner) => Promise<void>;
  onDeleteOpeningBanner?: (id: string) => Promise<void>;
  onToggleOpeningBannerActive?: (id: string, active: boolean) => Promise<void>;
  valasRates: ValasRate[];
  onUpdateValasRates: (rates: ValasRate[]) => void;
  onAddMedia?: (item: MediaItem) => void;
  redaksiPin: string;
  onUpdateRedaksiPin: (newPin: string) => void;
  companyProfiles?: CompanyProfilePage[];
  onUpdateCompanyProfile?: (updatedProfile: CompanyProfilePage) => void;
  liveStreamActive?: boolean;
  liveStreamTitle?: string;
  liveStreamViewerCount?: number;
  liveStreamType?: "youtube" | "camera" | "custom";
  liveStreamUrl?: string;
  onUpdateLiveStreamSettings?: (active: boolean, title: string, viewers: number, type: "youtube" | "camera" | "custom", url: string) => void;
}

const COVER_PRESETS = [
  {
    name: "Kantor Redaksi",
    url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800"
  },
  {
    name: "Sawah Terasering",
    url: "https://images.unsplash.com/photo-1582570776106-cfb29f0775d7?q=80&w=800"
  },
  {
    name: "Gedung Sate",
    url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=800"
  },
  {
    name: "Teknologi & AI",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800"
  },
  {
    name: "Infrastruktur",
    url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800"
  },
  {
    name: "Olahraga",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800"
  },
  {
    name: "Pasar Tradisional",
    url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800"
  }
];

const ROLE_TABS: Record<UserRole, Array<"analytics" | "workflow" | "editor" | "media" | "opening_banner" | "ads" | "alerts" | "settings" | "company">> = {
  [UserRole.SUPER_ADMIN]: ["analytics", "workflow", "editor", "media", "opening_banner", "ads", "alerts", "settings", "company"],
  [UserRole.PEMILIK]: ["analytics", "workflow", "media", "opening_banner", "ads", "company"],
  [UserRole.PEMIMPIN_REDAKSI]: ["analytics", "workflow", "editor", "media", "opening_banner", "alerts", "settings", "company"],
  [UserRole.REDAKTUR]: ["workflow", "editor", "media", "opening_banner", "company"],
  [UserRole.EDITOR]: ["workflow", "editor", "media", "company"],
  [UserRole.WARTAWAN]: ["workflow", "editor"],
  [UserRole.KONTRIBUTOR]: ["workflow", "editor"],
  [UserRole.FOTOGRAFER]: ["media"],
  [UserRole.VIDEOGRAFER]: ["media"],
  [UserRole.SOCIAL_MEDIA_ADMIN]: ["analytics", "workflow", "alerts"],
  [UserRole.IKLAN]: ["analytics", "ads", "opening_banner"],
  [UserRole.KEUANGAN]: ["analytics"],
};

export default function CMSDashboard({
  articles,
  banners,
  openingBanners = [],
  activeRole,
  mediaItems,
  notifications,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onSaveOpeningBanner,
  onDeleteOpeningBanner,
  onToggleOpeningBannerActive,
  valasRates,
  onUpdateValasRates,
  onAddMedia,
  redaksiPin,
  onUpdateRedaksiPin,
  companyProfiles = [],
  onUpdateCompanyProfile,
  liveStreamActive = true,
  liveStreamTitle = "Sidang Paripurna DPR & Peninjauan Lokasi Bencana Tol Majalengka",
  liveStreamViewerCount = 1340,
  liveStreamType = "youtube",
  liveStreamUrl = "https://www.youtube.com/embed/live_stream?channel=UCz3A9S7AecK9BTh40S77Dug",
  onUpdateLiveStreamSettings,
}: CMSDashboardProps) {
  
  // Dashboard view tabs
  const [activeTab, setActiveTab] = useState<"analytics" | "workflow" | "editor" | "media" | "opening_banner" | "ads" | "alerts" | "settings" | "company">("analytics");

  const allowedTabs = ROLE_TABS[activeRole] || ["analytics"];

  useEffect(() => {
    const allowed = ROLE_TABS[activeRole] || ["analytics"];
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
    }
  }, [activeRole, activeTab]);

  // Company profile editing states
  const [editingProfileId, setEditingProfileId] = useState<"redaksi" | "karir" | "kontak" | "iklan">("redaksi");
  const [editingContent, setEditingContent] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [showCompanyEditModal, setShowCompanyEditModal] = useState(false);

  useEffect(() => {
    if ((activeTab === "company" || showCompanyEditModal) && companyProfiles.length > 0) {
      const page = companyProfiles.find(p => p.id === editingProfileId);
      if (page) {
        setEditingContent(page.content);
        setEditingTitle(page.title);
      }
    }
  }, [editingProfileId, activeTab, showCompanyEditModal, companyProfiles]);

  // Media states
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [compressingId, setCompressingId] = useState<string | null>(null);
  const [watermarkedId, setWatermarkedId] = useState<string | null>(null);
  const [aiImagePrompt, setAiImagePrompt] = useState("");
  const [aiImageFolder, setAiImageFolder] = useState("Nasional");
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [aiImageError, setAiImageError] = useState<string | null>(null);

  // Editor Draft Form state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [bodyJson, setBodyJson] = useState<any>(null);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800");
  const [category, setCategory] = useState("Nasional");
  const [subCategory, setSubCategory] = useState("");
  const [location, setLocation] = useState("Jakarta");
  const [gpsLat, setGpsLat] = useState("-6.175392");
  const [gpsLng, setGpsLng] = useState("106.827153");
  const [tagsInput, setTagsInput] = useState("");

  const [publishSchedule, setPublishSchedule] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isHeadline, setIsHeadline] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isEditorialChoice, setIsEditorialChoice] = useState(false);
  
  // AI assistant states
  const [aiAction, setAiAction] = useState<string>("generate_title");
  const [aiTargetLang, setAiTargetLang] = useState<string>("English");
  const [aiStyle, setAiStyle] = useState<string>("formal");
  const [aiResult, setAiResult] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Banner manager states
  const [editingBanner, setEditingBanner] = useState<AdBanner | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [bannerForm, setBannerForm] = useState<Partial<AdBanner>>({
    title: "",
    position: "sidebar",
    type: "image",
    imageUrl: "",
    adUrl: "",
    htmlContent: "",
    active: true,
  });

  // Valas rates states
  const [editingValas, setEditingValas] = useState<ValasRate | null>(null);
  const [showValasForm, setShowValasForm] = useState(false);
  const [valasForm, setValasForm] = useState<Partial<ValasRate>>({
    code: "",
    rate: "",
    change: "",
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [isSyncingValas, setIsSyncingValas] = useState<boolean>(false);
  
  const handleAutoSyncValas = async () => {
    setIsSyncingValas(true);
    try {
      const res = await fetch("/api/valas/latest");
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Forex auto-sync API fetch error (status " + res.status + "):", errorText);
        triggerCmsMessage(`Gagal menghubungi API backend server (Status: ${res.status}).`);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Valas latest response is not JSON");
        triggerCmsMessage("Gagal menyinkronkan: Tanggapan dari server bukan format JSON yang valid.");
        return;
      }
      const data = await res.json();
      if (data && data.rates) {
        onUpdateValasRates(data.rates);
        triggerCmsMessage("Kurs Valas berhasil disinkronisasi otomatis dengan API terbaru!");
      } else {
        triggerCmsMessage("Gagal memperbarui Kurs: Format data API tidak valid.");
      }
    } catch (err: any) {
      console.error("Forex auto-sync failed:", err);
      triggerCmsMessage(`Terjadi kesalahan saat sinkronisasi: ${err.message || err}`);
    } finally {
      setIsSyncingValas(false);
    }
  };

  const [suggestedHeadlines, setSuggestedHeadlines] = useState<string[]>([]);
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState<boolean>(false);

  // Push notifications
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushTarget, setPushTarget] = useState({ web: true, android: false, ios: false, whatsapp: false, telegram: false });
  const [pushSent, setPushSent] = useState(false);
  const [cmsMessage, setCmsMessage] = useState<string | null>(null);

  const triggerCmsMessage = (msg: string) => {
    setCmsMessage(msg);
    setTimeout(() => {
      setCmsMessage(prev => prev === msg ? null : prev);
    }, 4500);
  };

  // PIN configuration states
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);

  // Live Streaming configuration states
  const [localLiveStreamActive, setLocalLiveStreamActive] = useState<boolean>(liveStreamActive);
  const [localLiveStreamTitle, setLocalLiveStreamTitle] = useState<string>(liveStreamTitle);
  const [localLiveStreamViewerCount, setLocalLiveStreamViewerCount] = useState<number>(liveStreamViewerCount);
  const [localLiveStreamType, setLocalLiveStreamType] = useState<"youtube" | "camera" | "custom">(liveStreamType);
  const [localLiveStreamUrl, setLocalLiveStreamUrl] = useState<string>(liveStreamUrl);
  const [liveStreamSuccess, setLiveStreamSuccess] = useState<boolean>(false);

  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcasterError, setBroadcasterError] = useState<string>("");
  const broadcasterVideoRef = React.useRef<HTMLVideoElement | null>(null);

  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [videoUploadError, setVideoUploadError] = useState<string>("");
  const [videoUploadSuccess, setVideoUploadSuccess] = useState<boolean>(false);

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 100MB for raw binary upload now!)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setVideoUploadError("Ukuran file video terlalu besar. Batas maksimal adalah 100MB.");
      return;
    }

    // Validate type (video files only)
    if (!file.type.startsWith("video/")) {
      setVideoUploadError("Format file salah. Silakan pilih file video (misal .mp4, .webm).");
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadError("");
    setVideoUploadSuccess(false);

    try {
      // Try raw binary upload first (extremely fast, memory-safe, supports up to 100MB)
      try {
        const response = await fetch("/api/livestream/upload-raw", {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "x-file-name": encodeURIComponent(file.name),
          },
          body: file, // Direct binary payload
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.url) {
            setLocalLiveStreamUrl(data.url);
            setVideoUploadSuccess(true);
            triggerCmsMessage(`✓ Berhasil mengunggah video "${file.name}"!`);
            
            // Auto-save settings on successful upload so the live stream updates instantly
            if (onUpdateLiveStreamSettings) {
              onUpdateLiveStreamSettings(
                localLiveStreamActive,
                localLiveStreamTitle,
                localLiveStreamViewerCount,
                "custom",
                data.url
              );
            }
            setIsUploadingVideo(false);
            return;
          }
        }
      } catch (rawErr) {
        console.warn("Raw binary upload failed, falling back to Base64", rawErr);
      }

      // Fallback: Base64 FileReader (limited to smaller files)
      if (file.size > 25 * 1024 * 1024) {
        throw new Error("File terlalu besar untuk diunggah via Base64. Harap gunakan koneksi jaringan yang lebih stabil.");
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        try {
          const response = await fetch("/api/livestream/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              videoData: base64Data,
              fileName: file.name
            })
          });

          const data = await response.json();
          if (data.success && data.url) {
            setLocalLiveStreamUrl(data.url);
            setVideoUploadSuccess(true);
            triggerCmsMessage(`✓ Berhasil mengunggah video "${file.name}" (Base64)!`);
            
            // Auto-save settings on successful upload
            if (onUpdateLiveStreamSettings) {
              onUpdateLiveStreamSettings(
                localLiveStreamActive,
                localLiveStreamTitle,
                localLiveStreamViewerCount,
                "custom",
                data.url
              );
            }
          } else {
            setVideoUploadError(data.error || "Gagal mengunggah file video.");
          }
        } catch (err: any) {
          setVideoUploadError("Gagal mengunggah file video: " + err.message);
        } finally {
          setIsUploadingVideo(false);
        }
      };

      reader.onerror = () => {
        setVideoUploadError("Gagal membaca file video.");
        setIsUploadingVideo(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setVideoUploadError("Error: " + err.message);
      setIsUploadingVideo(false);
    }
  };

  useEffect(() => {
    setLocalLiveStreamActive(liveStreamActive);
  }, [liveStreamActive]);

  useEffect(() => {
    setLocalLiveStreamTitle(liveStreamTitle);
  }, [liveStreamTitle]);

  useEffect(() => {
    setLocalLiveStreamViewerCount(liveStreamViewerCount);
  }, [liveStreamViewerCount]);

  useEffect(() => {
    setLocalLiveStreamType(liveStreamType);
  }, [liveStreamType]);

  useEffect(() => {
    setLocalLiveStreamUrl(liveStreamUrl);
  }, [liveStreamUrl]);

  // Webcam live broadcaster synchronization effect
  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: any = null;

    const startStreaming = async () => {
      try {
        setBroadcasterError("");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 180, frameRate: { max: 15 } },
          audio: false
        });

        if (broadcasterVideoRef.current) {
          broadcasterVideoRef.current.srcObject = stream;
          broadcasterVideoRef.current.play().catch(err => console.log("Play interrupted:", err));
        }

        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");

        intervalId = setInterval(async () => {
          if (broadcasterVideoRef.current && ctx) {
            ctx.drawImage(broadcasterVideoRef.current, 0, 0, 320, 180);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.5); // high compression for ultra speed
            try {
              await fetch("/api/livestream/frame", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ frame: dataUrl })
              });
            } catch (err) {
              console.warn("Failed to broadcast camera frame:", err);
            }
          }
        }, 500); // 2 frames per second is super fast, light-weight, and real-time!
      } catch (err: any) {
        console.error("Broadcasting activation failure:", err);
        setBroadcasterError("Gagal mengaktifkan Kamera Web: " + (err.message || err));
        setIsBroadcasting(false);
      }
    };

    if (isBroadcasting) {
      startStreaming();
    } else {
      // Clear current frame on server
      fetch("/api/livestream/frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame: "" })
      }).catch(() => {});
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isBroadcasting]);

  const handleLiveStreamSettingsChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateLiveStreamSettings) {
      onUpdateLiveStreamSettings(
        localLiveStreamActive,
        localLiveStreamTitle,
        localLiveStreamViewerCount,
        localLiveStreamType,
        localLiveStreamUrl
      );
      setLiveStreamSuccess(true);
      triggerCmsMessage("✓ Pengaturan Live Streaming berhasil diperbarui secara real-time!");
      setTimeout(() => setLiveStreamSuccess(false), 3000);
    }
  };

  // Audit Logs in state for transparency
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "log-1",
      userId: "user-1",
      userEmail: "wartawan@kabarnegara.co.id",
      role: UserRole.WARTAWAN,
      action: "BUAT_DRAFT",
      details: "Membuat draf artikel 'Kajian Kebijakan Pajak Karbon Industri'",
      timestamp: "2026-07-07 11:00"
    },
    {
      id: "log-2",
      userId: "user-2",
      userEmail: "editor@kabarnegara.co.id",
      role: UserRole.EDITOR,
      action: "REVIEW_MULA",
      details: "Memulai proses review draf suku bunga Bank Indonesia",
      timestamp: "2026-07-07 14:02"
    }
  ]);

  // Drag & drop and file upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      triggerCmsMessage("Harap pilih file gambar berformat JPG/JPEG!");
      return;
    }
    
    try {
      setCmsMessage("Sedang mengunggah gambar cover ke Supabase Storage...");
      const uploadedUrl = await uploadFileToSupabaseStorage(file, "media");
      setCoverImage(uploadedUrl);
      
      // Auto-add to Pustaka Media / Media Library
      if (onAddMedia) {
        const fileSizeKB = Math.round(file.size / 1024);
        const sizeStr = fileSizeKB > 1024 
          ? `${(fileSizeKB / 1024).toFixed(1)} MB` 
          : `${fileSizeKB} KB`;
          
        onAddMedia({
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: "photo",
          url: uploadedUrl,
          size: sizeStr,
          folder: category || "Nasional",
          tags: ["Upload", category].filter(Boolean),
          created_at: new Date().toISOString().split('T')[0]
        });
      }
      setCmsMessage("Foto cover berhasil disimpan ke Supabase!");
      setTimeout(() => setCmsMessage(null), 3000);
    } catch (err: any) {
      console.error("Gagal mengunggah foto cover:", err);
      triggerCmsMessage("Gagal mengunggah foto cover: " + err.message);
    }
  };

  // Handle Form Submission
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    
    const articlePayload: Article = {
      id: draftId || `art-${Date.now()}`,
      title,
      subTitle,
      summary,
      content,
      bodyJson,
      coverImage,
      galleryImages: [],
      author: "Rian Wijaya", // Wartawan profile name
      editor: "Sarah Amanda", // Assigned editor name
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      location,
      gpsCoords: gpsLat && gpsLng ? { lat: parseFloat(gpsLat), lng: parseFloat(gpsLng) } : undefined,
      category,
      subCategory: subCategory || undefined,
      tags,
      views: draftId ? (articles.find(a => a.id === draftId)?.views || 0) : 0,
      shares: draftId ? (articles.find(a => a.id === draftId)?.shares || 0) : 0,
      likes: draftId ? (articles.find(a => a.id === draftId)?.likes || 0) : 0,
      bookmarks: draftId ? (articles.find(a => a.id === draftId)?.bookmarks || 0) : 0,
      isBreaking,
      isHeadline,
      isTrending,
      isEditorialChoice,
      isFeatured: false,
      isSticky: false,
      status: draftId ? (articles.find(a => a.id === draftId)?.status || ArticleStatus.DRAFT) : ArticleStatus.DRAFT,
      scheduledPublish: publishSchedule || undefined,
      seo: {
        title: `${title} - Majalengka Post`,
        description: summary,
        keywords: tags.join(", "),
        canonicalUrl: `https://www.majalengkapost.co.id/${category.toLowerCase()}/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
      }
    };

    if (draftId) {
      onUpdateArticle(articlePayload);
      // Log audit
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        userId: "user-current",
        userEmail: "staf@kabarnegara.co.id",
        role: activeRole,
        action: "UPDATE_ARTIKEL",
        details: `Memperbarui berita "${title}"`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
      };
      setAuditLogs(prev => [newLog, ...prev]);
      setCmsMessage("Berita berhasil diperbarui dalam draf redaksi.");
      setTimeout(() => setCmsMessage(null), 4000);
    } else {
      onAddArticle(articlePayload);
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        userId: "user-current",
        userEmail: "staf@kabarnegara.co.id",
        role: activeRole,
        action: "CREATE_ARTIKEL",
        details: `Membuat berita draf baru "${title}"`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
      };
      setAuditLogs(prev => [newLog, ...prev]);
      setCmsMessage("Berita baru berhasil didaftarkan dalam workflow draf.");
      setTimeout(() => setCmsMessage(null), 4000);
    }

    // Reset Form
    handleClearForm();
  };

  const handleEditClick = (art: Article) => {
    setDraftId(art.id);
    setTitle(art.title);
    setSubTitle(art.subTitle || "");
    setSummary(art.summary);
    setContent(art.content);
    setBodyJson(art.bodyJson || null);
    setCoverImage(art.coverImage);
    setCategory(art.category);
    setSubCategory(art.subCategory || "");
    setLocation(art.location);
    setGpsLat(art.gpsCoords?.lat.toString() || "-6.175392");
    setGpsLng(art.gpsCoords?.lng.toString() || "106.827153");
    setTagsInput(art.tags.join(", "));
    setPublishSchedule(art.scheduledPublish || "");
    setIsBreaking(art.isBreaking);
    setIsHeadline(art.isHeadline);
    setIsTrending(art.isTrending);
    setIsEditorialChoice(art.isEditorialChoice);
    
    // Switch to editor tab
    setActiveTab("editor");
  };

  const handleClearForm = () => {
    setDraftId(null);
    setTitle("");
    setSubTitle("");
    setSummary("");
    setContent("");
    setBodyJson(null);
    setCategory("Nasional");
    setSubCategory("");
    setLocation("Jakarta");
    setTagsInput("");
    setPublishSchedule("");
    setIsBreaking(false);
    setIsHeadline(false);
    setIsTrending(false);
    setIsEditorialChoice(false);
    setCoverImage("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800");
    setSuggestedHeadlines([]);
    setIsGeneratingHeadlines(false);
  };
  
  // AI-powered Headline Suggestions Handler
  const handleSuggestHeadlines = async () => {
    const textToAnalyze = content || summary || title;
    if (!textToAnalyze) {
      setCmsMessage("Harap ketik isi berita atau ringkasan terlebih dahulu agar AI dapat menyarankan judul.");
      setTimeout(() => setCmsMessage(null), 5000);
      return;
    }

    setIsGeneratingHeadlines(true);
    setSuggestedHeadlines([]);

    try {
      const response = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_title",
          text: textToAnalyze
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Headline generation fetch error (status " + response.status + "):", errorText);
        throw new Error(`API call failed (Status: ${response.status})`);
      }

      const data = await response.json();
      const rawResult = data.result || "";
      
      // Parse raw output into clean headline strings
      const lines = rawResult.split(/\r?\n/);
      const parsed: string[] = [];
      
      for (let line of lines) {
        let trimmed = line.trim();
        if (!trimmed) continue;
        
        // Strip out leading numbering, bullet points, and quotes
        trimmed = trimmed.replace(/^[0-9]+[\.\)\s-]+\s*/, "");
        trimmed = trimmed.replace(/^[\-\*•]\s*/, "");
        trimmed = trimmed.replace(/^["'“‘]/, "").replace(/["'”’]$/, "");
        
        if (trimmed.length > 5) {
          parsed.push(trimmed);
        }
      }

      const finalHeadlines = parsed.slice(0, 3);
      if (finalHeadlines.length > 0) {
        setSuggestedHeadlines(finalHeadlines);
        setCmsMessage("3 rekomendasi judul berhasil dibuat oleh AI!");
      } else {
        const fallbackList = rawResult.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 5);
        if (fallbackList.length > 0) {
          setSuggestedHeadlines(fallbackList.slice(0, 3));
          setCmsMessage("Rekomendasi judul berhasil dimuat!");
        } else {
          setSuggestedHeadlines([rawResult]);
          setCmsMessage("Satu saran judul berhasil dibuat!");
        }
      }
      setTimeout(() => setCmsMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setCmsMessage("Gagal menyarankan judul. Silakan periksa koneksi atau coba lagi.");
      setTimeout(() => setCmsMessage(null), 5000);
    } finally {
      setIsGeneratingHeadlines(false);
    }
  };

  // Trigger Gemini AI Assistant
  const handleAiAssistantCall = async () => {
    const textToAnalyze = content || summary || title;
    if (!textToAnalyze) {
      setCmsMessage("Harap ketik isi berita, ringkasan, atau judul terlebih dahulu agar AI dapat menganalisis.");
      setTimeout(() => setCmsMessage(null), 5000);
      return;
    }

    setIsAiLoading(true);
    setAiResult("");

    try {
      const response = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: aiAction,
          text: textToAnalyze,
          options: {
            targetLang: aiTargetLang,
            style: aiStyle
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI assistant fetch error (status " + response.status + "):", errorText);
        setAiResult(`Gagal memanggil asisten AI (Status: ${response.status}). Silakan coba lagi.`);
        return;
      }

      const data = await response.json();
      setAiResult(data.result);
    } catch (err) {
      console.error(err);
      setAiResult("Gagal memanggil asisten AI. Silakan periksa jaringan.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quick Copy AI Result helper
  const handleCopyAiResult = () => {
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleGenerateAiImage = async () => {
    if (!aiImagePrompt.trim()) {
      setAiImageError("Harap masukkan deskripsi (prompt) gambar!");
      return;
    }

    setIsGeneratingAiImage(true);
    setAiImageError(null);

    try {
      // Use pollinations.ai to generate high-quality AI image
      const seed = Math.floor(Math.random() * 1000000);
      const url = `https://image.pollinations.ai/p/${encodeURIComponent(aiImagePrompt)}?width=800&height=450&seed=${seed}&nologo=true`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Gagal mengunduh gambar dari generator AI.");
      }
      const blob = await response.blob();
      
      const reader = new FileReader();
      const loadPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error("Gagal membaca file gambar sebagai Base64."));
        };
      });
      reader.readAsDataURL(blob);
      const base64Url = await loadPromise;

      if (onAddMedia) {
        const fileSizeKB = Math.round(blob.size / 1024);
        const sizeStr = fileSizeKB > 1024 
          ? `${(fileSizeKB / 1024).toFixed(1)} MB` 
          : `${fileSizeKB} KB`;

        onAddMedia({
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: aiImagePrompt.trim().substring(0, 45) || "AI Generated Image",
          type: "photo",
          url: base64Url,
          size: sizeStr,
          folder: aiImageFolder,
          tags: ["AI", aiImageFolder],
          created_at: new Date().toISOString().split('T')[0]
        });

        setAiImagePrompt("");
        setCmsMessage("Gambar AI berhasil dibuat & disimpan ke Supabase!");
        setTimeout(() => setCmsMessage(null), 3500);
      }
    } catch (err: any) {
      console.error(err);
      setAiImageError(err.message || "Gagal membuat gambar AI. Silakan coba lagi.");
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // Validate article metadata for zero-error publishing
  const getMissingMetadata = (art: Article): string[] => {
    const missing: string[] = [];
    if (!art.category || art.category.trim() === "") {
      missing.push("Kategori");
    }
    if (!art.tags || art.tags.filter(t => t.trim().length > 0).length === 0) {
      missing.push("Tags");
    }
    const isDefaultImage = art.coverImage?.includes("photo-1451187580459") || !art.coverImage;
    if (!art.coverImage || isDefaultImage) {
      missing.push("Featured Image (Gambar Sampul)");
    }
    if (!art.seo) {
      missing.push("SEO Metadata");
    } else {
      if (!art.seo.title || art.seo.title.trim() === "") {
        missing.push("SEO Meta Title");
      }
      if (!art.seo.description || art.seo.description.trim() === "") {
        missing.push("SEO Meta Description");
      }
      if (!art.seo.keywords || art.seo.keywords.trim() === "") {
        missing.push("SEO Keywords");
      }
    }
    return missing;
  };

  // Workflow status progress change
  const handleAdvanceStatus = (art: Article, nextStatus: ArticleStatus) => {
    if (nextStatus === ArticleStatus.PUBLISHED) {
      const missing = getMissingMetadata(art);
      if (missing.length > 0) {
        setCmsMessage(`Gagal mempublikasikan: Artikel masih kekurangan metadata (${missing.join(", ")})`);
        setTimeout(() => setCmsMessage(null), 5000);
        return;
      }
    }

    const updated = { ...art, status: nextStatus };
    onUpdateArticle(updated);

    // Audit logs entry
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: "user-current",
      userEmail: "staf@kabarnegara.co.id",
      role: activeRole,
      action: "ALUR_KERJA_UPDATE",
      details: `Mengubah status berita "${art.title}" menjadi ${nextStatus.replace("_", " ")}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Push sender
  const handleSendPushNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) return;

    setPushSent(true);
    setTimeout(() => {
      setPushTitle("");
      setPushBody("");
      setPushSent(false);
      setCmsMessage("Berita berhasil disiarkan melalui Push Notification multi-platform!");
      setTimeout(() => setCmsMessage(null), 5000);
    }, 2500);
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess(false);

    const trimmedPin = newPin.trim();
    if (trimmedPin.length < 4) {
      setPinError("Kata Sandi/PIN baru harus minimal 4 karakter.");
      return;
    }

    if (trimmedPin !== confirmPin.trim()) {
      setPinError("Konfirmasi PIN baru tidak cocok.");
      return;
    }

    onUpdateRedaksiPin(trimmedPin);
    setPinSuccess(true);
    setNewPin("");
    setConfirmPin("");
    setCmsMessage("Kata Sandi/PIN Redaksi berhasil diperbarui!");
    
    // Add entry to audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: "user-current",
      userEmail: "staf@kabarnegara.co.id",
      role: activeRole,
      action: "PIN_UPDATE",
      details: "Memperbarui PIN Otorisasi Redaksi Utama",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setTimeout(() => {
      setPinSuccess(false);
    }, 5000);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen">
      
      {/* Dynamic Non-Blocking Notification Banner */}
      {cmsMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-2xl border border-slate-800 flex items-center gap-2 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{cmsMessage}</span>
        </div>
      )}
      
      {/* CMS Sub Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-850 px-4 py-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-black font-mono">CMS REDAKSI UTAMA</span>
              <span className="text-xs text-gray-400 font-mono">Workspace ID:MjPost-725</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">Sistem Manajemen Redaksi Terintegrasi</h2>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
            <User className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Hak Akses: {activeRole.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list menu */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap border-b border-gray-200 dark:border-gray-800 pb-3 mb-6 scrollbar-hide">
          {([
            { id: "analytics", label: "Analitik Real-Time", icon: <BarChart3 className="w-4 h-4" /> },
            { id: "workflow", label: "Workflow Redaksi", icon: <LayoutList className="w-4 h-4" /> },
            { id: "editor", label: "Input Berita & AI", icon: <FilePlus2 className="w-4 h-4" /> },
            { id: "media", label: "Media Library", icon: <ImageIcon className="w-4 h-4" /> },
            { id: "opening_banner", label: "Banner Pembuka", icon: <Sparkles className="w-4 h-4" /> },
            { id: "ads", label: "Banner Iklan", icon: <Sliders className="w-4 h-4" /> },
            { id: "company", label: "Profil Perusahaan", icon: <Briefcase className="w-4 h-4" /> },
            { id: "alerts", label: "Push Notifikasi", icon: <Bell className="w-4 h-4" /> },
            { id: "settings", label: "Pengaturan PIN", icon: <Settings className="w-4 h-4" /> },
          ] as Array<{ id: "analytics" | "workflow" | "editor" | "media" | "opening_banner" | "ads" | "alerts" | "settings" | "company"; label: string; icon: React.ReactNode }>)
            .filter(tab => allowedTabs.includes(tab.id))
            .map(tab => (
               <button
                 key={tab.id}
                 id={`tab-${tab.id}`}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                   activeTab === tab.id
                     ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                     : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                 }`}
               >
                 {tab.icon}
                 <span>{tab.label}</span>
               </button>
            ))}
        </div>

        {/* ================= TAB 1: REAL-TIME ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Realtime upper banner stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-4 rounded-xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-bold uppercase">Visitor Real-Time</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-2xl font-black text-gray-950 dark:text-white mt-1">{REALTIME_ANALYTICS.realTimeVisitors}</p>
                <span className="text-[10px] text-emerald-500 font-bold">● Aktif membaca saat ini</span>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-4 rounded-xl shadow-xs">
                <span className="text-xs text-gray-400 font-bold uppercase">Visitor Hari Ini</span>
                <p className="text-2xl font-black text-gray-950 dark:text-white mt-1">{REALTIME_ANALYTICS.visitorsToday.toLocaleString()}</p>
                <span className="text-[10px] text-gray-400 font-medium">Bulan Ini: {REALTIME_ANALYTICS.visitorsThisMonth.toLocaleString()}</span>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-4 rounded-xl shadow-xs">
                <span className="text-xs text-gray-400 font-bold uppercase">Rasio Bounce Rate</span>
                <p className="text-2xl font-black text-gray-950 dark:text-white mt-1">{REALTIME_ANALYTICS.bounceRate}</p>
                <span className="text-[10px] text-gray-400 font-medium">Durasi Rerata: {REALTIME_ANALYTICS.avgDuration}</span>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-4 rounded-xl shadow-xs">
                <span className="text-xs text-gray-400 font-bold uppercase">Estimasi Hasil Iklan</span>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{REALTIME_ANALYTICS.adEarnings}</p>
                <span className="text-[10px] text-gray-400 font-medium">AdSense & Iklan Mandiri</span>
              </div>
            </div>

            {/* Custom SVG Charts Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: Referral Traffic sources (Custom SVG representation) */}
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-5 rounded-2xl">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Saluran Masuk Pengunjung</h4>
                <div className="space-y-4">
                  {REALTIME_ANALYTICS.trafficReferrals.map((ref) => (
                    <div key={ref.name}>
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span>{ref.name}</span>
                        <span>{ref.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${ref.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Geo Distribution Heatmap (Custom SVG representation) */}
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Distribusi Kota Pembaca</h4>
                  <div className="space-y-3">
                    {REALTIME_ANALYTICS.geoDistribution.map((geo, i) => (
                      <div key={geo.name} className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                          <span>{geo.name}</span>
                        </span>
                        <span className="font-bold font-mono">{geo.value} hits</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Micro SVG representation of city map */}
                <div className="mt-4 border-t border-gray-100 dark:border-gray-850 pt-3">
                  <div className="h-20 w-full bg-gray-50 dark:bg-gray-950 rounded flex items-center justify-center text-gray-400 text-[10px] font-mono">
                    🗺️ INDONESIA GEOGRAPHIC HEATMAP READY
                  </div>
                </div>
              </div>

              {/* Chart 3: Device / Browser Distributions */}
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-5 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Device Pengakses</h4>
                  <div className="flex items-center gap-1 h-6 rounded-lg overflow-hidden text-[9px] font-bold text-white text-center">
                    <div className="bg-red-600" style={{ width: "76%" }}>76% Mob</div>
                    <div className="bg-gray-800 dark:bg-gray-600" style={{ width: "20%" }}>20% PC</div>
                    <div className="bg-amber-500" style={{ width: "4%" }}>4% Tab</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Peramban (Browser)</h4>
                  <div className="space-y-2">
                    {REALTIME_ANALYTICS.browserDistribution.map((browser) => (
                      <div key={browser.name} className="flex justify-between items-center text-xs">
                        <span>{browser.name}</span>
                        <span className="font-bold font-mono">{browser.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: EDITORIAL WORKFLOW PIPELINE ================= */}
        {activeTab === "workflow" && (
          <div className="space-y-6">
            
            {/* Timeline Map Indicator */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-red-600" />
                Workflow Pipeline Redaksi Nasional
              </h4>
              <div className="flex flex-wrap items-center justify-between text-xs gap-y-4 max-w-4xl mx-auto py-2">
                {[
                  { name: "Draft", label: "Draf" },
                  { name: "Review Editor", label: "Review Editor" },
                  { name: "Revisi", label: "Revisi" },
                  { name: "Review Redaktur", label: "Review Redaktur" },
                  { name: "Persetujuan Pemred", label: "Persetujuan Pemred" },
                  { name: "Published", label: "Publish" }
                ].map((step, i) => (
                  <React.Fragment key={step.name}>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                        {i + 1}
                      </div>
                      <span className="font-bold text-[10px] text-gray-500 uppercase">{step.label}</span>
                    </div>
                    {i < 5 && <ChevronRight className="w-4 h-4 text-gray-300 hidden sm:block" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Pipeline Action boards */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Antrean Dokumen Jurnalistik</h4>
                <span className="text-xs text-gray-400 font-bold">Total: {articles.length} Dokumen</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-gray-950 text-[10px] font-bold uppercase text-gray-400 border-b border-gray-100 dark:border-gray-850">
                    <tr>
                      <th className="p-3">Judul Berita</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Wartawan / Editor</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi Alur Kerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                        <td className="p-3">
                          <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{art.title}</p>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {art.id}</span>
                        </td>
                        <td className="p-3">
                          <span className="bg-gray-100 dark:bg-gray-850 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded font-semibold">{art.category}</span>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{art.author}</p>
                          <p className="text-[10px] text-gray-400">Editor: {art.editor}</p>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                              art.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-800" :
                              art.status === "DRAFT" ? "bg-gray-100 text-gray-800" :
                              art.status === "REVIEW_EDITOR" ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {art.status.replace("_", " ")}
                            </span>
                            {getMissingMetadata(art).length > 0 ? (
                              <span className="text-[9px] text-red-600 dark:text-red-400 font-bold flex items-center gap-1 bg-red-50 dark:bg-red-950/20 px-1.5 py-0.5 rounded border border-red-100 dark:border-red-900/30 w-fit">
                                <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                                Metadata Belum Lengkap
                              </span>
                            ) : (
                              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30 w-fit">
                                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                                Metadata Valid ✓
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          <button
                            id={`btn-wf-preview-${art.id}`}
                            onClick={() => setPreviewArticle(art)}
                            className="bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 text-red-600 font-bold text-[10px] px-2.5 py-1.5 rounded transition-colors"
                          >
                            Preview
                          </button>
                          <button
                            id={`btn-wf-edit-${art.id}`}
                            onClick={() => handleEditClick(art)}
                            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-[10px] px-2.5 py-1.5 rounded text-gray-700 dark:text-gray-300"
                          >
                            Edit
                          </button>
 
                          {/* DRAFT */}
                          {art.status === ArticleStatus.DRAFT && (
                            [UserRole.WARTAWAN, UserRole.KONTRIBUTOR, UserRole.EDITOR, UserRole.REDAKTUR, UserRole.PEMIMPIN_REDAKSI, UserRole.SUPER_ADMIN, UserRole.PEMILIK].includes(activeRole) ? (
                              <button
                                id={`btn-wf-advance-${art.id}`}
                                onClick={() => handleAdvanceStatus(art, ArticleStatus.REVIEW_EDITOR)}
                                className="bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                              >
                                Kirim ke Editor ➔
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-semibold italic">Akses Penulis</span>
                            )
                          )}

                          {/* REVIEW_EDITOR */}
                          {art.status === ArticleStatus.REVIEW_EDITOR && (
                            [UserRole.EDITOR, UserRole.REDAKTUR, UserRole.PEMIMPIN_REDAKSI, UserRole.SUPER_ADMIN].includes(activeRole) ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleAdvanceStatus(art, ArticleStatus.REVISION)}
                                  className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                                >
                                  Minta Revisi
                                </button>
                                <button
                                  onClick={() => handleAdvanceStatus(art, ArticleStatus.REVIEW_REDAKTUR)}
                                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                                >
                                  Kirim ke Redaktur ➔
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold italic">Menunggu Tinjauan Editor</span>
                            )
                          )}

                          {/* REVISION */}
                          {art.status === ArticleStatus.REVISION && (
                            [UserRole.WARTAWAN, UserRole.KONTRIBUTOR, UserRole.EDITOR, UserRole.REDAKTUR, UserRole.PEMIMPIN_REDAKSI, UserRole.SUPER_ADMIN].includes(activeRole) ? (
                              <button
                                onClick={() => handleAdvanceStatus(art, ArticleStatus.REVIEW_EDITOR)}
                                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                              >
                                Kirim Ulang ke Editor ➔
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-semibold italic">Menunggu Revisi Penulis</span>
                            )
                          )}

                          {/* REVIEW_REDAKTUR */}
                          {art.status === ArticleStatus.REVIEW_REDAKTUR && (
                            [UserRole.REDAKTUR, UserRole.PEMIMPIN_REDAKSI, UserRole.SUPER_ADMIN].includes(activeRole) ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleAdvanceStatus(art, ArticleStatus.REVISION)}
                                  className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                                >
                                  Minta Revisi
                                </button>
                                <button
                                  onClick={() => handleAdvanceStatus(art, ArticleStatus.PEMRED_APPROVAL)}
                                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                                >
                                  Ajukan ke Pemred ➔
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold italic">Menunggu Tinjauan Redaktur</span>
                            )
                          )}

                          {/* PEMRED_APPROVAL */}
                          {art.status === ArticleStatus.PEMRED_APPROVAL && (
                            [UserRole.PEMIMPIN_REDAKSI, UserRole.SUPER_ADMIN, UserRole.PEMILIK].includes(activeRole) ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleAdvanceStatus(art, ArticleStatus.REVISION)}
                                  className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                                >
                                  Minta Revisi
                                </button>
                                {(() => {
                                  const missing = getMissingMetadata(art);
                                  if (missing.length > 0) {
                                    return (
                                      <div className="inline-block relative group">
                                        <button
                                          disabled
                                          type="button"
                                          className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold text-[10px] px-2.5 py-1.5 rounded cursor-not-allowed flex items-center gap-1 border border-gray-200 dark:border-gray-700"
                                        >
                                          <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                                          Publish Terkunci
                                        </button>
                                        <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-950 text-white text-[10px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 border border-gray-800 space-y-1.5">
                                          <p className="font-extrabold text-red-400 uppercase tracking-wider border-b border-gray-800 pb-1 text-left">Metadata Kurang Lengkap:</p>
                                          <ul className="list-disc list-inside space-y-1 text-gray-300 text-left">
                                            {missing.map((m, idx) => (
                                              <li key={idx}>{m}</li>
                                            ))}
                                          </ul>
                                          <p className="text-[9px] text-gray-400 pt-1 border-t border-gray-800 font-semibold leading-normal text-left">
                                            Klik "Edit" untuk melengkapi metadata.
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return (
                                    <button
                                      onClick={() => handleAdvanceStatus(art, ArticleStatus.PUBLISHED)}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                                    >
                                      Setujui & Publish ✓
                                    </button>
                                  );
                                })()}
                              </div>
                            ) : (
                              <span className="text-[10px] text-red-700 dark:text-red-400 font-semibold italic">Menunggu Approval Pemred</span>
                            )
                          )}

                          {/* PUBLISHED */}
                          {art.status === ArticleStatus.PUBLISHED && (
                            [UserRole.PEMIMPIN_REDAKSI, UserRole.SUPER_ADMIN, UserRole.PEMILIK, UserRole.REDAKTUR].includes(activeRole) ? (
                              <button
                                onClick={() => handleAdvanceStatus(art, ArticleStatus.ARCHIVED)}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                              >
                                Arsipkan
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Terbit</span>
                            )
                          )}

                          {/* ARCHIVED */}
                          {art.status === ArticleStatus.ARCHIVED && (
                            [UserRole.PEMIMPIN_REDAKSI, UserRole.SUPER_ADMIN, UserRole.PEMILIK].includes(activeRole) ? (
                              <button
                                onClick={() => handleAdvanceStatus(art, ArticleStatus.DRAFT)}
                                className="bg-slate-600 hover:bg-slate-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded transition-all"
                              >
                                Kembalikan ke Draf
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-semibold italic">Diarsipkan</span>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Internal notifications log */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Audit Logs & Activity Timeline</h4>
              <div className="space-y-3.5 max-h-52 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex gap-3 text-xs border-b border-gray-50 dark:border-gray-850 pb-2.5">
                    <span className="font-mono text-[10px] text-gray-400 shrink-0">{log.timestamp}</span>
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 dark:text-gray-200">[{log.role}] {log.userEmail}:</span>
                      <p className="text-gray-500 dark:text-gray-400 mt-0.5">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: NEWS CREATOR INPUT FORM & AI ASSISTANT ================= */}
        {activeTab === "editor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form Column */}
            <form onSubmit={handleSaveArticle} className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl space-y-5 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  {draftId ? "Edit Draf Berita" : "Tulis Artikel Berita Baru"}
                </h3>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider"
                >
                  Reset Form
                </button>
              </div>

              {/* Title and Subtitle */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Berita Utama</label>
                    <button
                      id="btn-suggest-headlines"
                      type="button"
                      onClick={handleSuggestHeadlines}
                      disabled={isGeneratingHeadlines}
                      className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGeneratingHeadlines ? 'animate-spin' : ''}`} />
                      {isGeneratingHeadlines ? "Menganalisis..." : "Saran Judul AI"}
                    </button>
                  </div>
                  <input
                    id="input-news-title"
                    type="text"
                    required
                    placeholder="Ketik judul berita atau klik 'Saran Judul AI' setelah mengisi berita..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none focus:border-red-600"
                  />
                  
                  {suggestedHeadlines.length > 0 && (
                    <div id="ai-headline-suggestions" className="mt-2 p-3 rounded-lg bg-red-50/40 dark:bg-red-950/10 border border-red-100/80 dark:border-red-950/40 animate-fadeIn">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-red-600" /> Rekomendasi Judul AI (SEO & Clickworthy)
                        </span>
                        <button
                          id="btn-clear-suggestions"
                          type="button"
                          onClick={() => setSuggestedHeadlines([])}
                          className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
                        >
                          Tutup
                        </button>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {suggestedHeadlines.map((headline, idx) => (
                          <button
                            id={`btn-apply-headline-${idx}`}
                            key={idx}
                            type="button; button-role"
                            onClick={() => {
                              setTitle(headline);
                              setCmsMessage(`Judul diubah ke: "${headline}"`);
                              setTimeout(() => setCmsMessage(null), 3000);
                            }}
                            className="w-full text-left p-2 text-xs rounded bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-850 hover:bg-red-50/20 dark:hover:bg-red-950/10 text-gray-700 dark:text-gray-300 transition-all flex justify-between items-center group font-medium"
                          >
                            <span className="flex-1 pr-2 line-clamp-1">{headline}</span>
                            <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Gunakan
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Sub Judul (Kicker)</label>
                  <input
                    id="input-news-subtitle"
                    type="text"
                    placeholder="Ketik penjelasan pendek atau sub judul..."
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none"
                  />
                </div>
              </div>

              {/* Category, Location, GPS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Kategori Berita</label>
                  <select
                    id="select-news-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Lokasi Liputan</label>
                  <input
                    id="input-news-location"
                    type="text"
                    required
                    placeholder="Contoh: Jakarta Pusat, Palembang"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">GPS Latitude & Longitude</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Lat"
                      value={gpsLat}
                      onChange={(e) => setGpsLat(e.target.value)}
                      className="w-1/2 text-[11px] p-2 rounded border border-gray-200 dark:border-gray-850 bg-gray-50 text-gray-800 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Lng"
                      value={gpsLng}
                      onChange={(e) => setGpsLng(e.target.value)}
                      className="w-1/2 text-[11px] p-2 rounded border border-gray-200 dark:border-gray-850 bg-gray-50 text-gray-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Lead */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Lead Berita / Ringkasan (5W + 1H)</label>
                <textarea
                  id="textarea-news-summary"
                  required
                  rows={2}
                  placeholder="Ketik ringkasan eksekutif 2-3 kalimat yang paling memikat pembaca..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none resize-none"
                />
              </div>

              {/* Rich Text Tiptap Microsoft Word-style Editor */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Isi Artikel Lengkap (Tiptap Word Editor)</label>
                  <span className="text-[10px] text-gray-400 font-mono">WYSIWYG Tiptap JSON Mode</span>
                </div>
                <TiptapWordEditor
                  initialValue={content}
                  onChange={(doc, html) => {
                    setContent(html);
                    setBodyJson(doc);
                  }}
                  onAutoSave={() => {
                    setCmsMessage("Draf berita disimpan otomatis ke draf redaksi.");
                    setTimeout(() => setCmsMessage(null), 3000);
                  }}
                  category={category}
                />
              </div>

              {/* Foto Cover / Image Upload Panel */}
              <div id="section-image-upload" className="flex flex-col gap-2.5 bg-gray-50/50 dark:bg-gray-950/20 p-4 rounded-xl border border-gray-150 dark:border-gray-850">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Foto Cover / Gambar Utama Berita</label>
                  {coverImage && (
                    <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 px-2 py-0.5 rounded font-bold font-mono">TAMPIL</span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Side: Drag & Drop Zone */}
                  <div
                    id="dropzone-cover-image"
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center transition-all min-h-[140px] ${
                      dragActive 
                        ? "border-red-600 bg-red-50 dark:bg-red-950/30" 
                        : "border-gray-200 dark:border-gray-850 bg-gray-50 dark:bg-gray-950 hover:bg-gray-100/50 dark:hover:bg-gray-900/50"
                    }`}
                  >
                    <input
                      id="input-file-upload"
                      type="file"
                      accept=".jpg,.jpeg,image/jpeg"
                      onChange={handleChange}
                      className="hidden"
                    />
                    
                    {coverImage ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                        <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label
                            htmlFor="input-file-upload"
                            className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            Ganti Foto
                          </label>
                          <button
                            id="btn-remove-cover-image"
                            type="button"
                            onClick={() => setCoverImage("")}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="input-file-upload"
                        className="w-full h-full min-h-[120px] flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2 animate-pulse" />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 text-center">
                          Tarik & lepas foto ke sini, atau <span className="text-red-600 hover:underline">pilih file</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Mendukung file JPG / JPEG</p>
                      </label>
                    )}
                  </div>

                  {/* Right Side: URL Input & Quick Presets */}
                  <div className="flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Atau Masukkan URL Gambar</span>
                      <div className="flex gap-2">
                        <input
                          id="input-news-cover-url"
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={coverImage.startsWith("data:") ? "" : coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="flex-1 text-xs p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none focus:border-red-600"
                        />
                        {coverImage && (
                          <button
                            id="btn-clear-cover-url"
                            type="button"
                            onClick={() => setCoverImage("")}
                            className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {coverImage.startsWith("data:") && (
                        <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">✓ Foto lokal berhasil diupload ke memori draf</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pilih Dari Galeri Rekomendasi</span>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {COVER_PRESETS.map((preset, index) => (
                          <button
                            id={`btn-preset-image-${index}`}
                            key={index}
                            type="button"
                            onClick={() => setCoverImage(preset.url)}
                            className={`flex-shrink-0 group relative w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
                              coverImage === preset.url ? "border-red-600 scale-95 shadow" : "border-transparent opacity-80 hover:opacity-100"
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/45 flex items-end p-1">
                              <span className="text-[8px] font-bold text-white leading-none truncate w-full">{preset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags, Publication Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tags (Pisahkan dengan koma)</label>
                  <input
                    id="input-news-tags"
                    type="text"
                    placeholder="AI, Birokrasi, Pembangunan"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Jadwal Publikasi Otomatis (Opsional)</label>
                  <input
                    type="datetime-local"
                    value={publishSchedule}
                    onChange={(e) => setPublishSchedule(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-850 outline-none"
                  />
                </div>
              </div>

              {/* Checkboxes parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-850">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-400">
                  <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} className="rounded text-red-600" />
                  <span>Breaking News</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-400">
                  <input type="checkbox" checked={isHeadline} onChange={(e) => setIsHeadline(e.target.checked)} className="rounded text-red-600" />
                  <span>Headline Utama</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-400">
                  <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="rounded text-red-600" />
                  <span>Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-400">
                  <input type="checkbox" checked={isEditorialChoice} onChange={(e) => setIsEditorialChoice(e.target.checked)} className="rounded text-red-600" />
                  <span>Pilihan Redaksi</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-2 items-center flex-wrap">
                {(() => {
                  const isCategoryValid = category && category.trim() !== "";
                  const isTagsValid = tagsInput && tagsInput.split(",").map(t => t.trim()).filter(Boolean).length > 0;
                  const isFeaturedImageValid = coverImage && coverImage.trim() !== "";
                  const isSeoValid = title && title.trim() !== "" && summary && summary.trim() !== "";
                  const isFormValidForPublish = isCategoryValid && isTagsValid && isFeaturedImageValid && isSeoValid;

                  return (
                    <>
                      {!isFormValidForPublish && (
                        <span className="text-[10px] text-red-500 font-bold mr-auto tracking-wide">
                          * Lengkapi kategori, tags, cover image, judul, dan ringkasan untuk menyimpan berita.
                        </span>
                      )}
                      
                      <button
                        type="button"
                        onClick={handleClearForm}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold text-xs px-5 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        Batal
                      </button>
                      
                      <button
                        id="btn-news-submit"
                        type="submit"
                        disabled={!isFormValidForPublish}
                        className={`font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm ${
                          isFormValidForPublish
                            ? "bg-red-600 hover:bg-red-500 text-white cursor-pointer hover:scale-[1.02]"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-300 dark:border-gray-750"
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span>{draftId ? "Simpan Perubahan" : "Buatkan Draf Berita"}</span>
                      </button>
                    </>
                  );
                })()}
              </div>
            </form>

            {/* Sidebar Column with multiple widgets */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Asisten Redaksi AI Card */}
              <div className="bg-gray-900 text-white border border-gray-800 p-5 rounded-2xl space-y-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sparkles className="w-20 h-20 text-red-500" />
                </div>
                
                <div className="flex items-center gap-1.5 border-b border-gray-800 pb-3">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Asisten Redaksi AI</h3>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Asisten kecerdasan buatan Majalengka Post bertenaga Gemini membantu jurnalis meningkatkan kualitas berita, tata bahasa baku, SEO metadata, hingga caption promosi media sosial instan.
                </p>

                {/* AI action selector */}
                <div className="space-y-3.5">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pilih Tindakan AI</label>
                    <select
                      id="select-ai-action"
                      value={aiAction}
                      onChange={(e) => setAiAction(e.target.value)}
                      className="text-xs p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-gray-200 outline-none"
                    >
                      <option value="generate_title">Buatkan 3 Judul Menarik</option>
                      <option value="generate_summary">Buatkan Ringkasan Berita</option>
                      <option value="correct_grammar">Koreksi Tata Bahasa & Baku</option>
                      <option value="change_style">Ubah Gaya Penulisan</option>
                      <option value="generate_seo">Buatkan SEO JSON Metadata</option>
                      <option value="generate_social">Buatkan Caption Media Sosial</option>
                      <option value="translation">Terjemahkan Berita</option>
                      <option value="plagiarism_check">Deteksi Plagiarisme</option>
                      <option value="sentiment_analysis">Analisis Sentimen Berita</option>
                      <option value="fact_check">Cek Fakta & Klaim Data</option>
                      <option value="eyd_correction">Koreksi EYD Detail</option>
                    </select>
                  </div>

                  {/* Conditional variables */}
                  {aiAction === "translation" && (
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bahasa Target</label>
                      <select
                        value={aiTargetLang}
                        onChange={(e) => setAiTargetLang(e.target.value)}
                        className="text-xs p-2.5 rounded bg-gray-950 border border-gray-850"
                      >
                        <option value="English">English (Inggris)</option>
                        <option value="Japanese">Japanese (Jepang)</option>
                        <option value="Arabic">Arabic (Arab)</option>
                        <option value="Mandarin">Mandarin (Cina)</option>
                      </select>
                    </div>
                  )}

                  {aiAction === "change_style" && (
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gaya Bahasa</label>
                      <select
                        value={aiStyle}
                        onChange={(e) => setAiStyle(e.target.value)}
                        className="text-xs p-2.5 rounded bg-gray-950 border border-gray-850"
                      >
                        <option value="formal">Formal & Lugas</option>
                        <option value="santai">Santai & Casual</option>
                        <option value="investigatif">Investigatif Tajam</option>
                        <option value="opini">Opini Persuasif</option>
                      </select>
                    </div>
                  )}

                  <button
                    id="btn-trigger-ai"
                    type="button"
                    disabled={isAiLoading}
                    onClick={handleAiAssistantCall}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                    <span>{isAiLoading ? "Sedang Memproses AI..." : "Jalankan Perintah AI"}</span>
                  </button>
                </div>

                {/* AI result visualization */}
                {aiResult && (
                  <div className="mt-4 border-t border-gray-850 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Hasil Generasi AI</span>
                      <button
                        type="button"
                        onClick={handleCopyAiResult}
                        className="text-[10px] font-bold text-amber-400 hover:text-white flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Disalin!" : "Salin Hasil"}</span>
                      </button>
                    </div>
                    <div className="bg-gray-950 p-3 rounded-lg border border-gray-850 max-h-72 overflow-y-auto">
                      <pre className="text-[11px] font-mono leading-relaxed text-gray-200 whitespace-pre-wrap">{aiResult}</pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Automated SEO Analyzer Widget has been removed per user instruction */}

            </aside>
          </div>
        )}

        {/* ================= TAB 4: MEDIA LIBRARY & WEBP COMPRESSOR ================= */}
        {activeTab === "media" && (
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl space-y-6 shadow-sm">
            
            {/* Header filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Pustaka Media Redaksi</h3>
                <p className="text-xs text-gray-400 mt-0.5">Watermark otomatis, konversi WebP, dan kompresi aset gambar.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1.5 flex-wrap">
                  {["All", "Nasional", "Infrastruktur", "Dokumen", "Pariwisata"].map((fold) => (
                    <button
                      key={fold}
                      onClick={() => setSelectedFolder(fold)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-colors ${
                        selectedFolder === fold
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                          : "border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {fold}
                    </button>
                  ))}
                </div>
                
                <label className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Foto (JPG)</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,image/jpeg"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
                          triggerCmsMessage("Harap pilih file gambar berformat JPG/JPEG!");
                          return;
                        }
                        try {
                          setCmsMessage("Mengunggah foto ke Supabase Storage...");
                          const uploadedUrl = await uploadFileToSupabaseStorage(file, "media");
                          if (onAddMedia) {
                            const fileSizeKB = Math.round(file.size / 1024);
                            const sizeStr = fileSizeKB > 1024 
                              ? `${(fileSizeKB / 1024).toFixed(1)} MB` 
                              : `${fileSizeKB} KB`;
                            onAddMedia({
                              id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                              name: file.name.replace(/\.[^/.]+$/, ""),
                              type: "photo",
                              url: uploadedUrl,
                              size: sizeStr,
                              folder: selectedFolder === "All" ? "Nasional" : selectedFolder,
                              tags: ["Pustaka", selectedFolder === "All" ? "Nasional" : selectedFolder],
                              created_at: new Date().toISOString().split('T')[0]
                            });
                            setCmsMessage("Foto berhasil ditambahkan ke Pustaka Media!");
                            setTimeout(() => setCmsMessage(null), 3000);
                          }
                        } catch (err: any) {
                          console.error("Gagal mengunggah foto ke Pustaka Media:", err);
                          triggerCmsMessage("Gagal mengunggah foto: " + err.message);
                        }
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* ================= AI IMAGE GENERATOR PANEL ================= */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900/60 dark:to-slate-900/40 border border-red-100/60 dark:border-red-950/40 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-100 dark:bg-red-950/60 rounded-lg text-red-600 dark:text-red-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">AI Image Generator</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Tulis prompt deskripsi gambar untuk membuat ilustrasi berita instan dan menyimpannya langsung ke database Supabase.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                <div className="md:col-span-7">
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-wider">Prompt Deskripsi Gambar</label>
                  <input
                    type="text"
                    value={aiImagePrompt}
                    onChange={(e) => setAiImagePrompt(e.target.value)}
                    placeholder="Contoh: Foto udara waduk Jatigede Majalengka saat matahari terbenam, drone shot, 4k..."
                    className="w-full text-xs bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3.5 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    disabled={isGeneratingAiImage}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-wider">Folder Kategori</label>
                  <select
                    value={aiImageFolder}
                    onChange={(e) => setAiImageFolder(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3.5 py-2 text-gray-900 dark:text-white focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    disabled={isGeneratingAiImage}
                  >
                    {["Nasional", "Infrastruktur", "Dokumen", "Pariwisata"].map((fold) => (
                      <option key={fold} value={fold}>{fold}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleGenerateAiImage}
                    disabled={isGeneratingAiImage || !aiImagePrompt.trim()}
                    className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-3.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs whitespace-nowrap h-[34px]"
                  >
                    {isGeneratingAiImage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Membuat...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Buat & Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {aiImageError && (
                <div className="text-[10px] text-red-600 font-semibold bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-md border border-red-100/30">
                  {aiImageError}
                </div>
              )}
            </div>

            {/* Media Items list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mediaItems.filter(m => selectedFolder === "All" || m.folder === selectedFolder).map((med) => (
                <div key={med.id} className="border border-gray-100 dark:border-gray-850 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between bg-gray-50/50 dark:bg-gray-950/40">
                  
                  {/* Preview container */}
                  <div className="h-32 bg-gray-200 dark:bg-gray-900 flex items-center justify-center overflow-hidden relative">
                    {med.type === "photo" ? (
                      <img src={med.url} alt={med.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Folder className="w-8 h-8 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{med.type}</span>
                      </div>
                    )}
                    {watermarkedId === med.id && (
                      <span className="bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded absolute bottom-2 left-2">
                        Watermark OK
                      </span>
                    )}
                  </div>

                  {/* Metadata and triggers */}
                  <div className="p-3">
                    <p className="font-bold text-xs text-gray-900 dark:text-white truncate" title={med.name}>{med.name}</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mt-1.5">
                      <span>Folder: {med.folder}</span>
                      <span>{med.size}</span>
                    </div>

                    {/* Resize, Watermark simulation buttons */}
                    {med.type === "photo" && (
                      <div className="grid grid-cols-2 gap-1.5 mt-3 border-t border-gray-150 dark:border-gray-800 pt-2.5">
                        <button
                          type="button"
                          disabled={compressingId === med.id}
                          onClick={() => {
                            setCompressingId(med.id);
                            setTimeout(() => {
                              setCompressingId(null);
                              triggerCmsMessage("Gambar berhasil dikompres ke format WebP (Mengurangi 45% ukuran file)!");
                            }, 1500);
                          }}
                          className="text-[10px] font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                        >
                          {compressingId === med.id ? "Kompres..." : "⚡ WebP Kompres"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWatermarkedId(med.id);
                            setCmsMessage("Watermark redaksi '© Majalengka Post' otomatis disematkan di pojok bawah gambar.");
                            setTimeout(() => setCmsMessage(null), 4000);
                          }}
                          className="text-[10px] font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                        >
                          💧 Watermark
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 4b: FLOATING OPENING BANNER / SPLASH PROMO ================= */}
        {activeTab === "opening_banner" && (
          <OpeningBannerManager
            banners={openingBanners}
            onSaveBanner={onSaveOpeningBanner || (async () => {})}
            onDeleteBanner={onDeleteOpeningBanner || (async () => {})}
            onToggleActive={onToggleOpeningBannerActive || (async () => {})}
          />
        )}

        {/* ================= TAB 5: BANNER ADVERTISEMENT & KURS VALAS MANAGER ================= */}
        {activeTab === "ads" && (
          <div className="space-y-6">
            
            {/* New Horizontal Banner Rotator Manager */}
            <HorizontalBannerManager
              banners={banners}
              onAddBanner={onAddBanner}
              onUpdateBanner={onUpdateBanner}
              onDeleteBanner={onDeleteBanner}
            />

            {/* Original Banner Ad Cards Grid for Non-horizontal Slots */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Manajemen Banner Iklan Slot Lainnya (Sidebar / Center)</h3>
                  <p className="text-xs text-gray-400 mt-1">Atur slot Google AdSense dan penempatan banner mandiri di sidebar kanan atau tengah artikel berita.</p>
                </div>
                <button
                  id="btn-add-ad"
                  type="button"
                  onClick={() => {
                    setEditingBanner(null);
                    setBannerForm({
                      title: "",
                      position: "sidebar",
                      type: "image",
                      imageUrl: "",
                      adUrl: "",
                      htmlContent: "",
                      active: true,
                    });
                    setShowBannerForm(true);
                  }}
                  className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Tambah Iklan Lain</span>
                </button>
              </div>

              {/* Only show non-horizontal (non-header) banners in this section */}
              {banners.filter(ban => ban.position !== "header").length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-4">Tidak ada iklan slot lainnya.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {banners.filter(ban => ban.position !== "header").map((ban) => (
                    <div key={ban.id} className="border border-gray-150 dark:border-gray-850 rounded-xl p-4 flex flex-col justify-between bg-white dark:bg-gray-950/40 shadow-sm relative group">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-black font-mono capitalize">Slot: {ban.position}</span>
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${ban.active ? "bg-emerald-500" : "bg-gray-300"}`}></span>
                            <span className="text-[10px] text-gray-400 capitalize">{ban.type}</span>
                          </div>
                        </div>
                        
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{ban.title}</h4>
                        
                        {ban.imageUrl && (
                          <div className="my-2 h-20 w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-880 relative">
                            <img src={ban.imageUrl} alt={ban.title} className="w-full h-full object-cover" />
                          </div>
                        )}

                        {/* Stats metrics */}
                        <div className="grid grid-cols-2 gap-2 mt-3 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-150 dark:border-gray-800 text-[11px] font-mono">
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-sans">Views</p>
                            <p className="font-bold text-gray-800 dark:text-gray-200">{ban.views?.toLocaleString() || 0}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-sans">Clicks (CTR)</p>
                            <p className="font-bold text-gray-800 dark:text-gray-200">
                              {ban.clicks?.toLocaleString() || 0} ({ban.views ? ((ban.clicks / ban.views) * 100).toFixed(1) : 0}%)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions (Toggle, Edit, Delete) */}
                      <div className="flex items-center justify-between border-t border-gray-150 dark:border-gray-800 pt-3 mt-4 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...ban, active: !ban.active };
                            onUpdateBanner(updated);
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                            ban.active 
                              ? "bg-emerald-600 text-white" 
                              : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {ban.active ? "Aktif" : "Nonaktif"}
                        </button>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBanner(ban);
                              setBannerForm({ ...ban });
                              setShowBannerForm(true);
                            }}
                            className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-500 hover:text-white px-2.5 py-1 rounded transition-all"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus iklan "${ban.title}"?`)) {
                                onDeleteBanner(ban.id);
                              }
                            }}
                            className="text-[10px] font-bold bg-red-500/10 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-500 hover:text-white p-1 rounded transition-all"
                            title="Hapus Iklan"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Currency Rates (Kurs Valas) */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4.5 h-4.5 text-emerald-500" />
                    Manajemen Kurs Valas (Running Marquee)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Tambahkan, perbarui, atau hapus mata uang asing untuk running text horizontal di bawah Breaking News.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoSyncValas}
                    disabled={isSyncingValas}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 font-bold text-xs px-4 py-2 rounded-lg border border-gray-150 dark:border-gray-800 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingValas ? "animate-spin" : ""}`} />
                    <span>{isSyncingValas ? "Sinkronisasi..." : "Sinkronisasi Otomatis"}</span>
                  </button>
                  <button
                    id="btn-add-valas"
                    type="button"
                    onClick={() => {
                      setEditingValas(null);
                      setValasForm({
                        code: "",
                        rate: "",
                        change: "",
                      });
                      setShowValasForm(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition-all flex items-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Tambah Kurs Valas</span>
                  </button>
                </div>
              </div>

              {/* Kurs Valas Table / List */}
              <div className="overflow-x-auto border border-gray-150 dark:border-gray-800 rounded-xl">
                <table className="w-full text-left text-xs font-medium text-gray-500 dark:text-gray-400 border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950/40 text-gray-400 uppercase text-[10px] font-black border-b border-gray-150 dark:border-gray-800">
                      <th className="px-4 py-3">Kode Valas</th>
                      <th className="px-4 py-3">Nilai (IDR Spot)</th>
                      <th className="px-4 py-3">Perubahan</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-gray-800/80">
                    {valasRates.map((val) => {
                      const isDown = val.change.startsWith("-");
                      return (
                        <tr key={val.code} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/20 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white font-mono text-sm">{val.code}</td>
                          <td className="px-4 py-3.5 font-bold text-gray-800 dark:text-gray-200 font-mono text-sm">{val.rate}</td>
                          <td className="px-4 py-3.5 font-mono">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              isDown 
                                ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400" 
                                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                            }`}>
                              {isDown ? "▼" : "▲"} {val.change}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingValas(val);
                                  setValasForm({ ...val });
                                  setShowValasForm(true);
                                }}
                                className="text-[11px] font-bold text-amber-500 hover:underline px-2"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Hapus kurs valas "${val.code}"?`)) {
                                    onUpdateValasRates(valasRates.filter(v => v.code !== val.code));
                                  }
                                }}
                                className="text-[11px] font-bold text-red-500 hover:underline px-2"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Banner Ad Modal Overlay */}
            {showBannerForm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      {editingBanner ? "Edit Banner Iklan" : "Tambah Banner Iklan Baru"}
                    </h3>
                    <button type="button" onClick={() => setShowBannerForm(false)} className="text-gray-400 hover:text-black dark:hover:text-white">✕</button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!bannerForm.title) {
                      triggerCmsMessage("Judul iklan harus diisi!");
                      return;
                    }
                    
                    if (editingBanner) {
                      // Update
                      onUpdateBanner({
                        ...editingBanner,
                        title: bannerForm.title,
                        position: bannerForm.position || "sidebar",
                        type: bannerForm.type || "image",
                        imageUrl: bannerForm.imageUrl || "",
                        adUrl: bannerForm.adUrl || "",
                        htmlContent: bannerForm.htmlContent || "",
                        active: bannerForm.active ?? true,
                      });
                    } else {
                      // Create
                      const newAdItem: AdBanner = {
                        id: `banner-${Date.now()}`,
                        title: bannerForm.title,
                        position: bannerForm.position || "sidebar",
                        type: bannerForm.type || "image",
                        imageUrl: bannerForm.imageUrl || "",
                        adUrl: bannerForm.adUrl || "",
                        htmlContent: bannerForm.htmlContent || "",
                        views: 0,
                        clicks: 0,
                        active: bannerForm.active ?? true,
                      };
                      onAddBanner(newAdItem);
                    }
                    setShowBannerForm(false);
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Judul Iklan / Kampanye</label>
                        <input
                          type="text"
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                          placeholder="e.g. Promo Ramadhan Berkah Majalengka"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Posisi Slot Banner</label>
                          <select
                            value={bannerForm.position}
                            onChange={(e) => setBannerForm({ ...bannerForm, position: e.target.value as any })}
                            className="w-full bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                          >
                            <option value="header">Header (Top Fullwidth)</option>
                            <option value="sidebar">Sidebar Right</option>
                            <option value="middle">Middle (Inside Article)</option>
                            <option value="bottom">Bottom (Page Footer)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Tipe Integrasi</label>
                          <select
                            value={bannerForm.type}
                            onChange={(e) => setBannerForm({ ...bannerForm, type: e.target.value as any })}
                            className="w-full bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                          >
                            <option value="image">Gambar Mandiri (URL)</option>
                            <option value="html">Custom HTML / AdSense</option>
                          </select>
                        </div>
                      </div>

                      {bannerForm.type === "image" ? (
                        <>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">URL Gambar Banner</label>
                            <input
                              type="text"
                              value={bannerForm.imageUrl}
                              onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                              className="w-full bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                              placeholder="https://example.com/banner-ad.jpg"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">URL Target Click (Redirect)</label>
                            <input
                              type="text"
                              value={bannerForm.adUrl}
                              onChange={(e) => setBannerForm({ ...bannerForm, adUrl: e.target.value })}
                              className="w-full bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                              placeholder="https://example.com/promo-target"
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">HTML Script / AdSense Code</label>
                          <textarea
                            value={bannerForm.htmlContent}
                            onChange={(e) => setBannerForm({ ...bannerForm, htmlContent: e.target.value })}
                            rows={4}
                            className="w-full bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                            placeholder="<div id='adsense'>...</div>"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-850 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowBannerForm(false)}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs px-4 py-2 rounded-lg"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
                        >
                          {editingBanner ? "Simpan Perubahan" : "Buat Iklan"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Kurs Valas Modal Overlay */}
            {showValasForm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl relative">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      {editingValas ? "Edit Kurs Valas" : "Tambah Kurs Valas Baru"}
                    </h3>
                    <button type="button" onClick={() => setShowValasForm(false)} className="text-gray-400 hover:text-black dark:hover:text-white">✕</button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!valasForm.code || !valasForm.rate || !valasForm.change) {
                      triggerCmsMessage("Semua kolom isian harus diisi!");
                      return;
                    }

                    if (editingValas) {
                      // Update
                      const updatedRates = valasRates.map(v => v.code === editingValas.code ? {
                        code: valasForm.code!,
                        rate: valasForm.rate!,
                        change: valasForm.change!,
                      } : v);
                      onUpdateValasRates(updatedRates);
                    } else {
                      // Create check if code exists
                      if (valasRates.some(v => v.code.toLowerCase() === valasForm.code!.toLowerCase())) {
                        triggerCmsMessage(`Kurs dengan kode "${valasForm.code}" sudah ada!`);
                        return;
                      }
                      const newValasItem: ValasRate = {
                        code: valasForm.code.toUpperCase(),
                        rate: valasForm.rate,
                        change: valasForm.change,
                      };
                      onUpdateValasRates([...valasRates, newValasItem]);
                    }
                    setShowValasForm(false);
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Kode Mata Uang</label>
                        <input
                          type="text"
                          value={valasForm.code}
                          onChange={(e) => setValasForm({ ...valasForm, code: e.target.value })}
                          disabled={!!editingValas}
                          className="w-full bg-gray-50 dark:bg-gray-950/80 disabled:opacity-60 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                          placeholder="e.g. AUD/IDR, USD/IDR"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Nilai Tukar Spot (IDR)</label>
                        <input
                          type="text"
                          value={valasForm.rate}
                          onChange={(e) => setValasForm({ ...valasForm, rate: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                          placeholder="e.g. 16.385,00"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Persentase Perubahan</label>
                        <input
                          type="text"
                          value={valasForm.change}
                          onChange={(e) => setValasForm({ ...valasForm, change: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 p-2 rounded-lg text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                          placeholder="e.g. +0,24% or -0,18%"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-850 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowValasForm(false)}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs px-4 py-2 rounded-lg"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
                        >
                          {editingValas ? "Simpan" : "Tambah"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 6: PUSH NOTIFICATIONS BROADCASTER ================= */}
        {activeTab === "alerts" && (
          <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone className="w-4.5 h-4.5 text-red-600" />
                Siaran Push Notification Cerdas
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Kirimkan notifikasi seketika ke seluruh perangkat pelanggan siber melalui saluran multi-platform.</p>
            </div>

            <form onSubmit={handleSendPushNotification} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Judul Notifikasi (Push Title)</label>
                <input
                  id="input-push-title"
                  type="text"
                  required
                  placeholder="Ketik judul breaking alert..."
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Isi Pesan Pendek</label>
                <textarea
                  id="textarea-push-body"
                  required
                  rows={2}
                  placeholder="Ketik pesan singkat padat yang memicu pembaca mengklik tautan berita..."
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none resize-none"
                />
              </div>

              {/* Target options checkboxes */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2.5">Platform Target Siaran</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                  {[
                    { id: "web", label: "Web Portal" },
                    { id: "android", label: "Android App" },
                    { id: "ios", label: "iOS Device" },
                    { id: "whatsapp", label: "WhatsApp" },
                    { id: "telegram", label: "Telegram Bot" }
                  ].map((plat) => (
                    <label key={plat.id} className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-2 rounded border border-gray-150 dark:border-gray-850">
                      <input
                        type="checkbox"
                        checked={(pushTarget as any)[plat.id]}
                        onChange={(e) => setPushTarget(prev => ({ ...prev, [plat.id]: e.target.checked }))}
                        className="rounded text-red-600"
                      />
                      <span>{plat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                id="btn-push-broadcast"
                type="submit"
                disabled={pushSent}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-400 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                {pushSent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{pushSent ? "Sedang Menyiarkan..." : "Kirim Siaran Notifikasi"}</span>
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 7: EDITORIAL ACCESS SECURITY SETTINGS ================= */}
        {activeTab === "settings" && (
          <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
            {/* Header & Status Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Settings className="w-4.5 h-4.5 text-amber-500" />
                  Keamanan Akses Redaksi
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Kelola kata sandi atau kode PIN yang digunakan oleh awak media untuk mengakses Dashboard CMS KabarNegara.</p>
              </div>

              {/* View Current PIN block */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PIN Redaksi Aktif</p>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-1">
                    {showCurrentPin ? (
                      <span className="font-mono bg-amber-100 dark:bg-amber-950/40 text-amber-600 px-2 py-0.5 rounded text-xs">
                        {redaksiPin}
                      </span>
                    ) : (
                      <span className="tracking-widest font-mono text-xs text-slate-400">••••</span>
                    )}
                  </p>
                </div>
                <button
                  id="btn-toggle-view-pin"
                  type="button"
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                  className="text-[10px] font-bold text-red-600 hover:text-red-700 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg shadow-xs transition-all uppercase tracking-wider"
                >
                  {showCurrentPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
                </button>
              </div>
            </div>

            {/* Change PIN Form */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Perbarui PIN / Sandi Redaksi</h4>
              
              <form onSubmit={handlePinChange} className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">PIN Baru</label>
                  <input
                    id="input-new-pin"
                    type="password"
                    required
                    maxLength={16}
                    placeholder="Masukkan PIN baru (min 4 karakter)..."
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Konfirmasi PIN Baru</label>
                  <input
                    id="input-confirm-pin"
                    type="password"
                    required
                    maxLength={16}
                    placeholder="Ulangi PIN baru..."
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none"
                  />
                </div>

                {pinError && (
                  <p className="text-red-500 font-bold text-[10px] uppercase tracking-wider text-center">{pinError}</p>
                )}

                {pinSuccess && (
                  <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-wider text-center">✓ PIN redaksi berhasil disimpan!</p>
                )}

                <button
                  id="btn-save-pin"
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan PIN Baru</span>
                </button>
              </form>
            </div>

            {/* Pengaturan Live Streaming Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4.5 h-4.5 text-red-600 animate-pulse" />
                    Pengaturan Siaran Langsung (Live Stream)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Atur status aktif siaran TV Majalengka Post, judul live feed, dan statistik penonton.</p>
                </div>
                {localLiveStreamActive ? (
                  <span className="text-[9px] bg-red-100 dark:bg-red-950/40 text-red-600 font-extrabold uppercase px-2 py-0.5 rounded-full tracking-widest animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                    ON AIR
                  </span>
                ) : (
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-950 text-slate-400 font-extrabold uppercase px-2 py-0.5 rounded-full tracking-widest">
                    OFFLINE
                  </span>
                )}
              </div>

              <form onSubmit={handleLiveStreamSettingsChange} className="space-y-4">
                {/* Switch Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status Live Stream</label>
                    <p className="text-[10px] text-slate-400 mt-0.5">Aktifkan untuk memunculkan portal video siaran langsung di web.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localLiveStreamActive}
                      onChange={(e) => {
                        setLocalLiveStreamActive(e.target.checked);
                        if (!e.target.checked) {
                          setIsBroadcasting(false);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-600"></div>
                  </label>
                </div>

                {/* Stream Type Selector */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-sans">Sumber Siaran (Stream Source)</label>
                  <select
                    value={localLiveStreamType}
                    onChange={(e) => setLocalLiveStreamType(e.target.value as any)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none focus:border-red-500 font-sans font-bold"
                    disabled={!localLiveStreamActive}
                  >
                    <option value="youtube">📺 YouTube Live Stream Embed</option>
                    <option value="camera">📹 Kamera Web Saya (Real Broadcast)</option>
                    <option value="custom">🔗 Video Custom / HLS (.m3u8 / .mp4)</option>
                  </select>
                </div>

                {/* Stream URL Input - Only shown if not camera */}
                {localLiveStreamType !== "camera" && (
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-sans">URL Tautan Siaran (Stream URL)</label>
                      <input
                        type="text"
                        required
                        placeholder={localLiveStreamType === "youtube" ? "Contoh: https://www.youtube.com/embed/live_stream?channel=..." : "Contoh: https://domain.com/live/stream.m3u8"}
                        value={localLiveStreamUrl}
                        onChange={(e) => setLocalLiveStreamUrl(e.target.value)}
                        className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none focus:border-red-500"
                        disabled={!localLiveStreamActive}
                      />
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        {localLiveStreamType === "youtube" 
                          ? "Gunakan tautan embed YouTube Live (contoh format: https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID atau https://www.youtube.com/embed/VIDEO_ID)"
                          : "Gunakan direct link file video publik (.mp4, .m3u8, .webm)"}
                      </p>
                    </div>

                    {/* Dedicated video file upload section for custom type */}
                    {localLiveStreamType === "custom" && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
                            📤 Unggah File Video Ke Server
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold">Max 100MB (Binary)</span>
                        </div>
                        
                        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-colors rounded-xl p-6 text-center cursor-pointer bg-white dark:bg-slate-950 flex flex-col items-center justify-center">
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime"
                            onChange={handleVideoFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploadingVideo || !localLiveStreamActive}
                          />
                          
                          {isUploadingVideo ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="animate-spin text-red-600 font-bold">⏳</span>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Sedang mengunggah video...</p>
                              <p className="text-[10px] text-slate-500">Mohon tunggu, file sedang dikompresi & diproses di server.</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="text-2xl">🎬</span>
                              <p className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Pilih File Video / Tarik Kemari
                              </p>
                              <p className="text-[10px] text-slate-500">Mendukung format MP4, WEBM, MOV, dll.</p>
                            </div>
                          )}
                        </div>

                        {videoUploadError && (
                          <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-lg border border-red-100 dark:border-red-950/50">
                            ⚠ {videoUploadError}
                          </div>
                        )}

                        {videoUploadSuccess && (
                          <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-lg border border-green-100 dark:border-green-950/50">
                            ✓ Video berhasil terunggah dan siap disiarkan! Pengaturan tersimpan secara real-time.
                          </div>
                        )}

                        {localLiveStreamUrl.startsWith("/uploads/") && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] bg-slate-100 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                              <span className="truncate mr-2">File aktif: {localLiveStreamUrl.split("/").pop()}</span>
                              <span className="text-red-500 font-bold text-[9px] uppercase tracking-wider shrink-0 bg-red-100 dark:bg-red-950/30 px-1.5 py-0.5 rounded">TERUNGGAH</span>
                            </div>

                            {/* Beautiful Video Preview Player for Admins */}
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">📺 Pratinjau Video Siaran Anda</span>
                              <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                                <video
                                  key={localLiveStreamUrl}
                                  src={localLiveStreamUrl}
                                  controls
                                  muted
                                  playsInline
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Webcam Broadcaster Control Panel */}
                {localLiveStreamActive && localLiveStreamType === "camera" && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-red-950/50 space-y-3.5 text-left text-white">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                        Live Studio Broadcaster
                      </span>
                      {isBroadcasting && (
                        <span className="text-[9px] bg-red-600 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                          ON AIR (WEBCAST)
                        </span>
                      )}
                    </div>

                    {/* Local video camera preview */}
                    <div className="relative aspect-video w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                      <video
                        ref={broadcasterVideoRef}
                        muted
                        playsInline
                        className={`w-full h-full object-cover transform -scale-x-100 ${isBroadcasting ? "block" : "hidden"}`}
                      />
                      {!isBroadcasting && (
                        <div className="text-center p-4">
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Kamera Web Belum Aktif</p>
                          <p className="text-slate-600 text-[10px] mt-1">Gunakan tombol di bawah untuk menyalakan kamera dan mulai mengudara.</p>
                        </div>
                      )}
                    </div>

                    {broadcasterError && (
                      <p className="text-red-500 text-[10px] font-bold uppercase text-center">{broadcasterError}</p>
                    )}

                    <div className="flex gap-2">
                      {!isBroadcasting ? (
                        <button
                          type="button"
                          onClick={() => setIsBroadcasting(true)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-[10px] uppercase py-2.5 rounded-lg tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          Mulai Siaran Kamera
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsBroadcasting(false)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-[10px] uppercase py-2.5 rounded-lg tracking-widest transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                        >
                          Hentikan Siaran Kamera
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Stream Title */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Judul / Topik Siaran Langsung</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sidang Paripurna DPR & Peninjauan Lokasi..."
                    value={localLiveStreamTitle}
                    onChange={(e) => setLocalLiveStreamTitle(e.target.value)}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none focus:border-red-500"
                    disabled={!localLiveStreamActive}
                  />
                </div>

                {/* Viewer Count */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Jumlah Penonton Terhitung (Pemirsa)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="Contoh: 1340"
                    value={localLiveStreamViewerCount}
                    onChange={(e) => setLocalLiveStreamViewerCount(Number(e.target.value))}
                    className="text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 outline-none focus:border-red-500"
                    disabled={!localLiveStreamActive}
                  />
                </div>

                {liveStreamSuccess && (
                  <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-wider text-center">✓ Pengaturan siaran berhasil disimpan & dipublikasikan!</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Pengaturan Siaran</span>
                </button>
              </form>
            </div>

            {/* Info / FAQ Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 p-4 rounded-xl space-y-2">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">💡 Petunjuk Penggunaan</h5>
              <ul className="text-[10px] text-slate-400 font-medium list-disc pl-4 space-y-1">
                <li>PIN custom yang Anda buat disimpan dengan aman di penyimpanan lokal peramban (localStorage).</li>
                <li>Menghidupkan siaran langsung akan menampilkan badge merah menyala di Header navigasi dan memunculkan tab khusus Live TV untuk pembaca portal.</li>
                <li>Statistik jumlah penonton akan terupdate secara real-time dan disimulasikan naik turun secara natural guna interaksi yang dinamis.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= TAB 8: COMPANY PROFILE EDITING ================= */}
        {activeTab === "company" && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Header banner */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-red-600" />
                  <span>Manajemen Profil Perusahaan</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">Perbarui susunan redaksi, karir, kontak, dan tarif iklan secara real-time. Perubahan langsung terlihat di portal pembaca.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCompanyEditModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-500/15 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Edit via Modal Popup</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Halaman:</span>
                  <select
                    value={editingProfileId}
                    onChange={(e) => setEditingProfileId(e.target.value as any)}
                    className="bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="redaksi">Susunan Redaksi</option>
                    <option value="karir">Karir Wartawan</option>
                    <option value="kontak">Hubungi Kami</option>
                    <option value="iklan">Tarif Pemasangan Iklan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Split Screen Editor & Preview */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              {/* Editor Block (Left) */}
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider font-sans">Editor HTML Konten</span>
                  <div className="flex items-center gap-1.5">
                    {profileSaveSuccess && (
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider animate-pulse">✓ Tersimpan!</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Judul Halaman</label>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 outline-none font-bold"
                      placeholder="Masukkan judul halaman..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Isi Halaman (HTML/Rich-Text)</label>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingContent(prev => prev + "<h2>Sub-judul Baru</h2>\n");
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[9px] font-bold rounded-md text-slate-600 dark:text-slate-300 transition-all"
                        >
                          + H2
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingContent(prev => prev + "<p>Masukkan paragraf teks di sini...</p>\n");
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[9px] font-bold rounded-md text-slate-600 dark:text-slate-300 transition-all"
                        >
                          + Paragraf
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingContent(prev => prev + "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n");
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[9px] font-bold rounded-md text-slate-600 dark:text-slate-300 transition-all"
                        >
                          + List
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingContent(prev => prev + '<div class="my-6 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-850 p-4 rounded-r-xl">\n  <h3 class="mt-0 font-bold">INFO PENTING</h3>\n  <p class="mb-0">Teks info di sini.</p>\n</div>\n');
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[9px] font-bold rounded-md text-slate-600 dark:text-slate-300 transition-all"
                        >
                          + Kotak Sorot
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full text-xs p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 outline-none font-mono leading-relaxed h-96 scrollbar-thin resize-y"
                      placeholder="Masukkan konten dengan tag HTML dasar..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateCompanyProfile) {
                        onUpdateCompanyProfile({
                          id: editingProfileId,
                          title: editingTitle,
                          content: editingContent,
                          lastUpdated: new Date().toISOString()
                        });
                        setProfileSaveSuccess(true);
                        setTimeout(() => setProfileSaveSuccess(false), 2000);
                      }
                    }}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-500/10 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Block (Right) */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-850 rounded-3xl p-6 space-y-4 max-h-[620px] overflow-y-auto scrollbar-thin">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 font-sans">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    Pratinjau Real-Time (Sisi Pembaca)
                  </span>
                  <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                </div>

                <div className="prose dark:prose-invert prose-red max-w-none text-slate-800 dark:text-slate-200">
                  <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight border-b border-gray-100 dark:border-gray-800 pb-2 mb-4 font-sans">{editingTitle || "Tanpa Judul"}</h1>
                  <div 
                    className="text-xs leading-relaxed space-y-4 font-normal"
                    dangerouslySetInnerHTML={{ __html: editingContent || "<p class='text-gray-400 italic'>Konten kosong. Tulis sesuatu di editor...</p>" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {previewArticle && (
        <ArticlePreviewModal
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
        />
      )}

      {showCompanyEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in text-left">
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 w-full max-w-5xl h-[85vh] flex flex-col space-y-4 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider font-sans">
                  Modal Editor Profil Perusahaan
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCompanyEditModal(false)} 
                className="text-gray-400 hover:text-black dark:hover:text-white bg-slate-50 dark:bg-slate-800 p-2 rounded-full cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Selector and Success Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-150 dark:border-gray-850">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase font-sans">Pilih Halaman Profil:</span>
                <select
                  value={editingProfileId}
                  onChange={(e) => setEditingProfileId(e.target.value as any)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="redaksi">Susunan Redaksi</option>
                  <option value="karir">Karir Wartawan</option>
                  <option value="kontak">Hubungi Kami</option>
                  <option value="iklan">Tarif Pemasangan Iklan</option>
                </select>
              </div>
              {profileSaveSuccess && (
                <span className="text-xs font-black text-emerald-500 uppercase tracking-wider animate-pulse flex items-center gap-1">
                  ✓ Berhasil Disimpan ke Supabase!
                </span>
              )}
            </div>

            {/* Split screen content editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
              
              {/* Left Column: Input and Textarea */}
              <div className="flex flex-col space-y-3 overflow-y-auto pr-1">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 font-sans">Judul Halaman</label>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 outline-none font-bold"
                    placeholder="Masukkan judul halaman..."
                  />
                </div>

                <div className="flex-1 flex flex-col min-h-[250px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest font-sans">Konten (Format HTML)</label>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingContent(prev => prev + "<h2>Sub-judul Baru</h2>\n")}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[9px] font-bold rounded text-slate-600 dark:text-slate-300"
                      >
                        + H2
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingContent(prev => prev + "<p>Masukkan paragraf baru di sini...</p>\n")}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[9px] font-bold rounded text-slate-600 dark:text-slate-300"
                      >
                        + Paragraf
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingContent(prev => prev + "<ul>\n  <li>Butir 1</li>\n  <li>Butir 2</li>\n</ul>\n")}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[9px] font-bold rounded text-slate-600 dark:text-slate-300"
                      >
                        + List
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingContent(prev => prev + '<div class="my-6 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-850 p-4 rounded-r-xl">\n  <h3 class="mt-0 font-bold">INFORMASI PENTING</h3>\n  <p class="mb-0">Keterangan penting di sini.</p>\n</div>\n')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[9px] font-bold rounded text-slate-600 dark:text-slate-300"
                      >
                        + Sorot
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full flex-1 text-xs p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 outline-none font-mono leading-relaxed resize-none overflow-y-auto"
                    placeholder="Tulis HTML di sini..."
                  />
                </div>
              </div>

              {/* Right Column: Live Preview */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-850 rounded-2xl p-5 overflow-y-auto flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 font-sans">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    Pratinjau Sisi Pembaca (Real-Time)
                  </span>
                  <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 px-2 py-0.5 rounded-full font-bold">PRATINJAU</span>
                </div>

                <div className="prose dark:prose-invert prose-red max-w-none text-slate-800 dark:text-slate-200 flex-1">
                  <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight border-b border-gray-100 dark:border-gray-800 pb-2 mb-3 font-sans">
                    {editingTitle || "Tanpa Judul"}
                  </h1>
                  <div 
                    className="text-xs leading-relaxed space-y-4 font-normal"
                    dangerouslySetInnerHTML={{ __html: editingContent || "<p class='text-gray-400 italic'>Konten kosong. Tulis sesuatu di editor...</p>" }}
                  />
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setShowCompanyEditModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-xs font-bold uppercase rounded-xl transition-all text-slate-700 dark:text-slate-300 font-sans"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onUpdateCompanyProfile) {
                    onUpdateCompanyProfile({
                      id: editingProfileId,
                      title: editingTitle,
                      content: editingContent,
                      lastUpdated: new Date().toISOString()
                    });
                    setProfileSaveSuccess(true);
                    setTimeout(() => setProfileSaveSuccess(false), 2000);
                  }
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-500/10 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                <Check className="w-4.5 h-4.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
