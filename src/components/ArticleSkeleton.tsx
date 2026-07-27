import React from "react";

export const ArticleSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse" id="article-skeleton">
      {/* Main Article Content Column */}
      <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Back button skeleton */}
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-md"></div>

        {/* Category & Subcategory badge skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-red-200/60 dark:bg-red-950/40 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        {/* Headline / Title skeleton (2 lines) */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
        </div>

        {/* Subtitle / Excerpt skeleton */}
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>

        {/* Author metadata & date row */}
        <div className="flex items-center justify-between border-y border-gray-100 dark:border-gray-800 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
            <div className="space-y-2">
              <div className="h-3 w-28 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-3 w-36 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
          {/* View count & reading time skeleton */}
          <div className="hidden sm:flex gap-3">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>

        {/* Share buttons placeholder */}
        <div className="flex gap-2 py-1">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>

        {/* Main Cover Image skeleton */}
        <div className="space-y-2">
          <div className="w-full h-72 sm:h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-3 w-2/3 mx-auto bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        {/* Article Body Paragraphs */}
        <div className="space-y-4 pt-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>

          <div className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl my-6 border-l-4 border-gray-300 dark:border-gray-700 p-4 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>

          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-10/12"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
      </div>

      {/* Sidebar Column Skeleton */}
      <div className="lg:col-span-4 space-y-6 hidden lg:block">
        {/* Widget 1: Popular news */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Widget 2: Poll / Banner */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3">
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;
