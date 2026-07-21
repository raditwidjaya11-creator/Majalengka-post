import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { OpeningBanner, OpeningBannerPageTarget } from "../types";
import { safeLocalStorage } from "../lib/safeStorage";

interface OpeningBannerModalProps {
  banners: OpeningBanner[];
  currentPage?: OpeningBannerPageTarget;
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

  // Determine if a banner should be displayed
  const checkEligibility = useCallback((banner: OpeningBanner): boolean => {
    if (!banner.isActive) return false;
    if (banner.status && banner.status === "draft") return false;

    // Page target check
    if (banner.pageTarget !== "all" && banner.pageTarget !== currentPage) {
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
  }, [currentPage]);

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
      setActiveBanner(eligible[0]);
      setIsOpen(true);
      setImageLoaded(false);
    } else {
      setActiveBanner(null);
      setIsOpen(false);
    }
  }, [banners, previewBanner, checkEligibility]);

  const handleClose = () => {
    if (activeBanner && !previewBanner) {
      const storageKey = `mp_opening_banner_seen_${activeBanner.id}`;
      safeLocalStorage.setItem(storageKey, Date.now().toString());
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
  }, [isOpen, activeBanner, previewBanner]);

  if (!isOpen || !activeBanner) return null;

  // Animation variants
  const getAnimationVariants = () => {
    const duration = activeBanner.animationDuration || 0.4;
    switch (activeBanner.animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration } },
          exit: { opacity: 0, transition: { duration: 0.2 } }
        };
      case "slide_up":
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
        return "items-end justify-end p-4 sm:p-6";
      case "bottom_left":
        return "items-end justify-start p-4 sm:p-6";
      case "fullscreen":
        return "items-center justify-center p-2 sm:p-4";
      case "center":
      default:
        return "items-center justify-center p-4 sm:p-6";
    }
  };

  const getCardSizeClasses = () => {
    if (activeBanner.displayPosition === "fullscreen") {
      return "w-full max-w-4xl max-h-[92vh] overflow-y-auto";
    }
    return "w-full max-w-md sm:max-w-lg";
  };

  // Convert hex color + opacity to rgba for overlay
  const getOverlayStyle = () => {
    const hex = activeBanner.overlayColor || "#000000";
    const opacity = activeBanner.overlayOpacity !== undefined ? activeBanner.overlayOpacity : 0.65;
    
    // Parse hex
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex overflow-y-auto antialiased select-none" id="opening-banner-modal-root">
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
          <div className={`relative w-full h-full flex ${getPositionClasses()} pointer-events-none z-10`}>
            <motion.div
              {...getAnimationVariants()}
              className={`relative bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 pointer-events-auto transition-colors ${getCardSizeClasses()}`}
              onClick={(e) => e.stopPropagation()}
              id="opening-banner-card"
            >
              {/* Close Button X */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20 shadow-md"
                title="Tutup Banner (ESC)"
                aria-label="Tutup Banner"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner Image with Lazy Loading Shimmer */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-gray-100 dark:bg-gray-800 overflow-hidden">
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
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                
                {previewBanner && (
                  <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE PREVIEW CMS
                  </div>
                )}
              </div>

              {/* Banner Body Content */}
              <div className="p-5 sm:p-6 space-y-3 sm:space-y-4 text-left">
                {activeBanner.title && (
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
                    {activeBanner.title}
                  </h3>
                )}

                {activeBanner.subtitle && (
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                    {activeBanner.subtitle}
                  </p>
                )}

                {/* Actions Bar */}
                <div className="pt-2 flex items-center gap-3">
                  {activeBanner.buttonLink && activeBanner.buttonLink !== "#" ? (
                    <a
                      href={activeBanner.buttonLink}
                      target={activeBanner.buttonLink.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm sm:text-base shadow-lg shadow-red-600/25 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>{activeBanner.buttonText || "Baca Selengkapnya"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={handleClose}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm sm:text-base shadow-lg shadow-red-600/25 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>{activeBanner.buttonText || "Baca Selengkapnya"}</span>
                    </button>
                  )}

                  <button
                    onClick={handleClose}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
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
