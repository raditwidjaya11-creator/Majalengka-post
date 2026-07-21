-- ==============================================================================
-- SQL Script for Banner Opening / Floating Splash Promo
-- Database Support: PostgreSQL, MySQL / MariaDB, SQLite
-- Portal Berita Majalengka Post
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. POSTGRESQL SCHEMA
-- ------------------------------------------------------------------------------

-- Create Enum Types for PostgreSQL
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opening_banner_position') THEN
        CREATE TYPE opening_banner_position AS ENUM ('center', 'bottom_right', 'bottom_left', 'fullscreen');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opening_banner_animation') THEN
        CREATE TYPE opening_banner_animation AS ENUM ('fade', 'zoom', 'slide_up', 'bounce');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opening_banner_interval') THEN
        CREATE TYPE opening_banner_interval AS ENUM ('always', '1h', '6h', '12h', '24h');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opening_banner_page_target') THEN
        CREATE TYPE opening_banner_page_target AS ENUM ('home', 'dashboard', 'all', 'article');
    END IF;
END $$;

-- Create Table: opening_banners (PostgreSQL)
CREATE TABLE IF NOT EXISTS opening_banners (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    button_text VARCHAR(100) DEFAULT 'Baca Selengkapnya',
    button_link TEXT DEFAULT '#',
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'published',
    start_date TIMESTAMP WITH TIME ZONE NULL,
    end_date TIMESTAMP WITH TIME ZONE NULL,
    display_position VARCHAR(50) DEFAULT 'center',
    animation VARCHAR(50) DEFAULT 'zoom',
    animation_duration NUMERIC(3,2) DEFAULT 0.40,
    overlay_color VARCHAR(20) DEFAULT '#000000',
    overlay_opacity NUMERIC(3,2) DEFAULT 0.65,
    display_interval VARCHAR(20) DEFAULT 'always',
    display_frequency VARCHAR(50) DEFAULT 'once_per_session',
    display_delay_seconds INT DEFAULT 1,
    auto_close_seconds INT NULL,
    blur_backdrop BOOLEAN DEFAULT TRUE,
    show_once BOOLEAN DEFAULT FALSE,
    page_target VARCHAR(50) DEFAULT 'all',
    sort_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast query filtering on active & scheduled banners
CREATE INDEX IF NOT EXISTS idx_opening_banners_active_status ON opening_banners (is_active, status, sort_order);
CREATE INDEX IF NOT EXISTS idx_opening_banners_schedule ON opening_banners (start_date, end_date);


-- ------------------------------------------------------------------------------
-- 2. MYSQL / MARIADB SCHEMA
-- ------------------------------------------------------------------------------

/*
CREATE TABLE IF NOT EXISTS `opening_banners` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` TEXT NULL,
    `image_url` TEXT NOT NULL,
    `button_text` VARCHAR(100) DEFAULT 'Baca Selengkapnya',
    `button_link` TEXT DEFAULT '#',
    `is_active` TINYINT(1) DEFAULT 1,
    `status` ENUM('published', 'draft') DEFAULT 'published',
    `start_date` DATETIME NULL,
    `end_date` DATETIME NULL,
    `display_position` ENUM('center', 'bottom_right', 'bottom_left', 'fullscreen') DEFAULT 'center',
    `animation` ENUM('fade', 'zoom', 'slide_up', 'bounce') DEFAULT 'zoom',
    `animation_duration` DECIMAL(3,2) DEFAULT 0.40,
    `overlay_color` VARCHAR(20) DEFAULT '#000000',
    `overlay_opacity` DECIMAL(3,2) DEFAULT 0.65,
    `display_interval` ENUM('always', '1h', '6h', '12h', '24h') DEFAULT 'always',
    `display_frequency` VARCHAR(50) DEFAULT 'once_per_session',
    `display_delay_seconds` INT DEFAULT 1,
    `auto_close_seconds` INT NULL,
    `blur_backdrop` TINYINT(1) DEFAULT 1,
    `show_once` TINYINT(1) DEFAULT 0,
    `page_target` ENUM('home', 'dashboard', 'all', 'article') DEFAULT 'all',
    `sort_order` INT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_active_sort` (`is_active`, `status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/


-- ------------------------------------------------------------------------------
-- 3. INITIAL SAMPLE DATA INSERTS (POSTGRESQL / MYSQL COMPATIBLE)
-- ------------------------------------------------------------------------------

INSERT INTO opening_banners (
    id, title, subtitle, image_url, button_text, button_link,
    is_active, status, display_position, animation, animation_duration,
    overlay_color, overlay_opacity, display_interval, display_frequency,
    display_delay_seconds, blur_backdrop, page_target, sort_order,
    created_at, updated_at
) VALUES (
    'banner-opening-welcome-2026',
    'Selamat Datang di Portal Berita Utama Majalengka Post',
    'Dapatkan akses eksklusif laporan khusus, liputan mendalam, dan siaran berita terkini langsung di perangkat Anda.',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200',
    'Baca Laporan Khusus',
    '/kategori/nasional',
    TRUE,
    'published',
    'center',
    'zoom',
    0.40,
    '#000000',
    0.65,
    'always',
    'once_per_session',
    1,
    TRUE,
    'all',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    image_url = EXCLUDED.image_url,
    button_text = EXCLUDED.button_text,
    button_link = EXCLUDED.button_link,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- ------------------------------------------------------------------------------
-- 4. USEFUL ANALYTICS & MONITORING QUERIES
-- ------------------------------------------------------------------------------

-- Get all currently active banners eligible for display
SELECT 
    id, 
    title, 
    image_url, 
    button_text, 
    button_link, 
    display_position, 
    animation,
    blur_backdrop
FROM opening_banners
WHERE is_active = TRUE 
  AND status = 'published'
  AND (start_date IS NULL OR start_date <= NOW())
  AND (end_date IS NULL OR end_date >= NOW())
ORDER BY sort_order ASC, created_at DESC;
