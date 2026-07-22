import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Sparkles, ArrowRight, Volume2 } from "lucide-react";
import { OpeningBanner, OpeningBannerPageTarget } from "../types";
import { safeLocalStorage } from "../lib/safeStorage";

interface OpeningBannerModalProps {
  banners: OpeningBanner[];
  currentPage?: OpeningBannerPageTarget | string;
  previewBanner?: OpeningBanner | null; // For CMS Live Preview
  onClosePreview?: () => void;
}

export default function OpeningBannerModal({
  banners,
  currentPage = "home",
  previewBanner = null,
  onClosePreview
}: OpeningBannerModalProps) {
  const [activeBanner, setActiveBanner] = useState<OpeningBanner | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Normalize currentPage string to OpeningBannerPageTarget
  const normalizedPage = useCallback((): string => {
    if (!currentPage) return "home";
    if (currentPage.includes("dashboard") || currentPage.includes("cms")) return "dashboard";
    if (currentPage.includes("article") || currentPage.includes("berita")) return "article";
    return "home";
  }, [currentPage]);

  // Determine if a banner should be displayed
  const checkEligibility = useCallback((banner: OpeningBanner): boolean => {
    if (!banner.isActive) return false;
    if (banner.status && banner.status === "draft") return false;

    const page = normalizedPage();

    // Check targetPages array or pageTarget string
    if (banner.targetPages && Array.isArray(banner.targetPages) && banner.targetPages.length > 0) {
      if (!banner.targetPages.includes("all") && !banner.targetPages.includes(page as any)) {
        return false;
      }
    } else if (banner.pageTarget && banner.pageTarget !== "all" && banner.pageTarget !== page) {
      return false;
    }

    const now = new Date().getTime();

    // Schedule check (Start Date)
    if (banner.startDate) {
      const startTime = new Date(banner.startDate).getTime();
      if (!isNaN(startTime) && now < startTime) return false;
    }

    // Schedule check (End Date)
    if (banner.endDate) {
      const endTime = new Date(banner.endDate).getTime();
      if (!isNaN(endTime) && now > endTime) return false;
    }

    // Display Frequency Check (once_per_session)
    if (banner.displayFrequency === "once_per_session") {
      try {
        const sessionSeen = sessionStorage.getItem(`mp_banner_session_seen_${banner.id}`);
        if (sessionSeen) return false;
      } catch (e) {
        // Fallback to safeLocalStorage
      }
    }

    // Show once / Interval check
    const storageKey = `mp_opening_banner_seen_${banner.id}`;
    const lastSeen = safeLocalStorage.getItem(storageKey);

    if (banner.showOnce && lastSeen) {
      return false;
    }

    if (banner.displayInterval && banner.displayInterval !== "always" && lastSeen) {
      const lastSeenTime = parseInt(lastSeen, 10);
      if (!isNaN(lastSeenTime)) {
        let intervalMs = 0;
        switch (banner.displayInterval) {
          case "1h": intervalMs = 1 * 60 * 60 * 1000; break;
          case "6h": intervalMs = 6 * 60 * 60 * 1000; break;
          case "12h": intervalMs = 12 * 60 * 60 * 1000; break;
          case "24h": intervalMs = 24 * 60 * 60 * 1000; break;
        }
        if (now - lastSeenTime < intervalMs) {
          return false;
        }
      }
    }

    return true;
  }, [normalizedPage]);

  // Main Effect to select banner & handle display delay
  useEffect(() => {
    if (previewBanner) {
      setActiveBanner(previewBanner);
      setIsOpen(true);
      setImageLoaded(false);
      return;
    }

    if (!banners || banners.length === 0) {
      setActiveBanner(null);
      setIsOpen(false);
      return;
    }

    // Filter & sort active banners
    const eligible = banners
      .filter(checkEligibility)
      .sort((a, b) => (a.sortOrder || 1) - (b.sortOrder || 1));

    if (eligible.length > 0) {
      const selected = eligible[0];
      setActiveBanner(selected);

      // On mobile screens or normal load, apply delay timer so splash screen or initial load finishes first
      const delaySeconds = selected.displayDelaySeconds !== undefined ? selected.displayDelaySeconds : 1;
      const delayMs = Math.max(delaySeconds * 1000, 800);

      const timer = setTimeout(() => {
        setIsOpen(true);
        setImageLoaded(false);
      }, delayMs);

      return () => clearTimeout(timer);
    } else {
      setActiveBanner(null);
      setIsOpen(false);
    }
  }, [banners, previewBanner, checkEligibility]);

  // Handle Auto Close timer if configured
  useEffect(() => {
    if (isOpen && activeBanner && activeBanner.autoCloseSeconds && activeBanner.autoCloseSeconds > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, activeBanner.autoCloseSeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeBanner]);

  const handleClose = () => {
    if (activeBanner && !previewBanner) {
      const storageKey = `mp_opening_banner_seen_${activeBanner.id}`;
      safeLocalStorage.setItem(storageKey, Date.now().toString());
      try {
        sessionStorage.setItem(`mp_banner_session_seen_${activeBanner.id}`, "true");
      } catch (e) {
        // ignore
      }
    }
    setIsOpen(false);
    if (previewBanner && onClosePreview) {
      onClosePreview();
    }
  };

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !activeBanner) return null;

  // Animation variants
  const getAnimationVariants = () => {
    const duration = activeBanner.animationDuration || 0.4;
    const anim = activeBanner.animation || activeBanner.animationStyle || "zoom";

    switch (anim) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration } },
          exit: { opacity: 0, transition: { duration: 0.2 } }
        };
      case "slide_up":
      case "slide":
        return {
          initial: { opacity: 0, y: 80 },
          animate: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
          exit: { opacity: 0, y: 40, transition: { duration: 0.2 } }
        };
      case "bounce":
        return {
          initial: { opacity: 0, scale: 0.6 },
          animate: { opacity: 1, scale: [0.6, 1.05, 1], transition: { duration: duration + 0.1 } },
          exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
        };
      case "zoom":
      default:
        return {
          initial: { opacity: 0, scale: 0.85 },
          animate: { opacity: 1, scale: 1, transition: { duration, ease: [0.16, 1, 0.3, 1] } },
          exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
        };
    }
  };

  // Alignment classes based on displayPosition
  const getPositionClasses = () => {
    switch (activeBanner.displayPosition) {
      case "bottom_right":
        return "items-center justify-center sm:items-end sm:justify-end p-3.5 sm:p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6";
      case "bottom_left":
        return "items-center justify-center sm:items-end sm:justify-start p-3.5 sm:p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6";
      case "fullscreen":
        return "items-center justify-center p-2 sm:p-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:pb-4";
      case "center":
      default:
        return "items-center justify-center p-3.5 sm:p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6";
    }
  };

  const getCardSizeClasses = () => {
    if (activeBanner.displayPosition === "fullscreen") {
      return "w-full max-w-4xl max-h-[calc(100vh-100px)] sm:max-h-[92vh] overflow-y-auto";
    }
    return "w-[90vw] max-w-xs sm:max-w-md md:max-w-lg max-h-[calc(100vh-120px)] sm:max-h-[88vh] overflow-y-auto";
  };

  // Convert hex color + opacity to rgba for overlay
  const getOverlayStyle = () => {
    const hex = activeBanner.overlayColor === "dark" ? "#000000" : (activeBanner.overlayColor || "#000000");
    const opacity = activeBanner.overlayOpacity !== undefined ? activeBanner.overlayOpacity : 0.65;
    
    let r = 0, g = 0, b = 0;
    if (hex.startsWith("#")) {
      const clean = hex.replace("#", "");
      if (clean.length === 3) {
        r = parseInt(clean[0] + clean[0], 16);
        g = parseInt(clean[1] + clean[1], 16);
        b = parseInt(clean[2] + clean[2], 16);
      } else if (clean.length === 6) {
        r = parseInt(clean.substring(0, 2), 16);
        g = parseInt(clean.substring(2, 4), 16);
        b = parseInt(clean.substring(4, 6), 16);
      }
    }
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`
    };
  };

  const displaySubtitle = activeBanner.subtitle || activeBanner.subTitle;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[999999] flex overflow-y-auto antialiased select-none" 
          id="opening-banner-modal-root"
        >
          {/* Backdrop Blur + Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 backdrop-blur-md transition-all cursor-pointer"
            style={getOverlayStyle()}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className={`relative w-full h-full flex ${getPositionClasses()} pointer-events-none z-10 my-auto`}>
            <motion.div
              {...getAnimationVariants()}
              className={`relative bg-white dark:bg-gray-900 rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 pointer-events-auto transition-colors flex flex-col ${getCardSizeClasses()}`}
              onClick={(e) => e.stopPropagation()}
              id="opening-banner-card"
            >
              {/* Touch Drag Indicator Bar for Mobile */}
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden opacity-60" />

              {/* Close Button X (Touch Friendly) */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-all duration-200 transform hover:scale-105 active:scale-90 border border-white/20 shadow-lg cursor-pointer"
                title="Tutup Banner (ESC)"
                aria-label="Tutup Banner"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner Image with Lazy Loading Shimmer */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-600 animate-bounce" />
                  </div>
                )}
                <img
                  src={activeBanner.imageUrl}
                  alt={activeBanner.title}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  loading="eager"
                  decoding="async"
                />
                
                {/* Gradient overlay at image bottom for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                
                {previewBanner && (
                  <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] sm:text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    PREVIEW PROMO
                  </div>
                )}
              </div>

              {/* Banner Body Content */}
              <div className="p-3.5 sm:p-6 space-y-2.5 sm:space-y-4 text-left flex-1 flex flex-col justify-between overflow-y-auto min-h-0">
                <div className="space-y-2">
                  {activeBanner.title && (
                    <h3 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-snug line-clamp-3">
                      {activeBanner.title}
                    </h3>
                  )}

                  {displaySubtitle && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal line-clamp-4">
                      {displaySubtitle}
                    </p>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-2 flex flex-col xs:flex-row items-stretch sm:items-center gap-2.5">
                  {activeBanner.buttonLink && activeBanner.buttonLink !== "#" ? (
                    <a
                      href={activeBanner.buttonLink}
                      target={activeBanner.buttonLink.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all cursor-pointer min-h-[44px]"
                    >
                      <span>{activeBanner.buttonText || activeBanner.buttonText || "Baca Selengkapnya"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={handleClose}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all cursor-pointer min-h-[44px]"
                    >
                      <span>{activeBanner.buttonText || "Baca Selengkapnya"}</span>
                    </button>
                  )}

                  <button
                    onClick={handleClose}
                    className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
