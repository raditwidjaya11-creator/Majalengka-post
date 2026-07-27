import React, { useState, useEffect } from "react";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt?: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  showShimmer?: boolean;
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt = "",
  className = "w-full h-full object-cover",
  containerClassName = "",
  fallbackSrc = "/android-chrome-512x512.png"
  showShimmer = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-850 ${containerClassName}`}
    >
      {/* Shimmer / Skeleton Placeholder background */}
      {showShimmer && !isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-750 dark:to-slate-800 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-red-600 animate-spin opacity-40" />
        </div>
      )}

      {/* Actual Image with Blur-Up transition */}
      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={props.loading || "lazy"}
        decoding={props.decoding || "async"}
        className={`${className} transition-all duration-500 ease-out ${
          isLoaded
            ? "blur-0 scale-100 opacity-100"
            : "blur-md scale-105 opacity-60"
        }`}
        {...props}
      />
    </div>
  );
};

export default BlurImage;
