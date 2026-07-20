-- MAJALENGKA POST - DATABASE SCHEMA MIGRATION SQL FOR SUPABASE POSTGRESQL
-- Copy and run this script inside your Supabase SQL Editor to initialize all tables and policies.

-- 1. Table: articles
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "subTitle" TEXT,
  summary TEXT,
  content TEXT,
  "bodyJson" JSONB,
  "coverImage" TEXT,
  "galleryImages" JSONB,
  "videoUrl" TEXT,
  "audioUrl" TEXT,
  author TEXT,
  editor TEXT,
  photographer TEXT,
  videographer TEXT,
  date TEXT,
  time TEXT,
  location TEXT,
  "gpsCoords" JSONB,
  category TEXT,
  "subCategory" TEXT,
  tags JSONB,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  "isBreaking" BOOLEAN DEFAULT false,
  "isHeadline" BOOLEAN DEFAULT false,
  "isTrending" BOOLEAN DEFAULT false,
  "isEditorialChoice" BOOLEAN DEFAULT false,
  "isFeatured" BOOLEAN DEFAULT false,
  "isSticky" BOOLEAN DEFAULT false,
  status TEXT,
  "scheduledPublish" TEXT,
  seo JSONB
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON articles;
DROP POLICY IF EXISTS "Allow public write" ON articles;
CREATE POLICY "Allow public read" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON articles FOR ALL USING (true);


-- 2. Table: banners
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  position TEXT,
  type TEXT,
  "adUrl" TEXT,
  "imageUrl" TEXT,
  "htmlContent" TEXT,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON banners;
DROP POLICY IF EXISTS "Allow public write" ON banners;
CREATE POLICY "Allow public read" ON banners FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON banners FOR ALL USING (true);


-- 3. Table: media_items
CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  url TEXT,
  size TEXT,
  folder TEXT,
  tags JSONB,
  created_at TEXT
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON media_items;
DROP POLICY IF EXISTS "Allow public write" ON media_items;
CREATE POLICY "Allow public read" ON media_items FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON media_items FOR ALL USING (true);


-- 4. Table: polls
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB,
  "totalVotes" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON polls;
DROP POLICY IF EXISTS "Allow public write" ON polls;
CREATE POLICY "Allow public read" ON polls FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON polls FOR ALL USING (true);


-- 5. Table: valas_rates
CREATE TABLE IF NOT EXISTS valas_rates (
  code TEXT PRIMARY KEY,
  rate TEXT NOT NULL,
  change TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE valas_rates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON valas_rates;
DROP POLICY IF EXISTS "Allow public write" ON valas_rates;
CREATE POLICY "Allow public read" ON valas_rates FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON valas_rates FOR ALL USING (true);


-- 6. Table: company_info
CREATE TABLE IF NOT EXISTS company_info (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  last_updated TEXT
);

-- Enable Row Level Security & Create Access Policies
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON company_info;
DROP POLICY IF EXISTS "Allow public write" ON company_info;
CREATE POLICY "Allow public read" ON company_info FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON company_info FOR ALL USING (true);


-- 7. Seed Data: company_info
INSERT INTO company_info (id, title, content, last_updated) VALUES
(
  'redaksi',
  'Susunan Redaksi',
  '<h2>Susunan Redaksi & Manajemen Majalengka Post</h2><p>Berdasarkan Keputusan Menteri Hukum dan HAM Republik Indonesia serta ketentuan Undang-Undang Nomor 40 Tahun 1999 tentang Pers, berikut adalah struktur organisasi, pengurus, dan dewan redaksi dari <strong>PT Majalengka Post Media</strong>:</p><div class="my-6 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-850 p-4 rounded-r-xl"><h3 class="mt-0 font-bold">PENERBIT</h3><p class="mb-0"><strong>PT Majalengka Post Media</strong><br/>SK Kemenkumham RI No: AHU-0034912.AH.01.01.Tahun 2026</p></div><h3>DEWAN DIREKSI & MANAJEMEN</h3><ul><li><strong>Pemimpin Umum / Penanggung Jawab:</strong> Radit Widjaya, S.I.Kom.</li><li><strong>Direktur Utama:</strong> Dr. H. Ahmad Fauzi, M.M.</li><li><strong>Direktur Keuangan:</strong> Rina Kartika, S.E.</li><li><strong>Direktur Bisnis & Kemitraan:</strong> Hendra Lesmana, M.B.A.</li></ul><h3>DEWAN REDAKSI</h3><ul><li><strong>Pemimpin Redaksi / Penanggung Jawab Redaksi:</strong> Sarah Amanda, M.Si. (Sertifikasi Wartawan Utama Dewan Pers)</li><li><strong>Redaktur Pelaksana:</strong> Rian Wijaya</li><li><strong>Redaktur Senior:</strong> Bambang Soetedjo, Elok Sulastri</li><li><strong>Editor Bahasa:</strong> Diana Putri, S.Hum.</li></ul><h3>REPORTER & TIM KREATIF</h3><ul><li><strong>Reporter Lapangan:</strong> Budi Santoso, Cecep Hermawan, Linda Novita, Taufik Hidayat</li><li><strong>Jurnalis Foto (Fotografer):</strong> Deni Ramdani</li><li><strong>Jurnalis Video & Sosmed:</strong> Gilang Ramadhan, Anisa Fitri</li><li><strong>IT & System Administrator:</strong> Fajar Nugraha, S.Kom.</li></ul><h3>ALAMAT KANTOR REDAKSI</h3><p>Gedung Graha Pers Majalengka Post<br/>Jl. KH. Abdul Halim No. 12, Kelurahan Majalengka Kulon,<br/>Kecamatan Majalengka, Kabupaten Majalengka, Jawa Barat 45418<br/>Email: redaksi@majalengkapost.co.id | Telp: (0233) 281450</p><hr class="my-6 border-gray-200 dark:border-gray-800" /><p class="text-xs text-gray-505 font-medium"><em>Wartawan Majalengka Post selalu dibekali dengan tanda pengenal (Kartu Pers) yang masih berlaku dan namanya tercantum dalam boks redaksi ini dalam menjalankan tugas jurnalistik. Wartawan Majalengka Post dilarang meminta atau menerima imbalan dalam bentuk apa pun dari narasumber.</em></p>',
  '2026-07-14T04:00:00Z'
),
(
  'karir',
  'Karir Wartawan',
  '<h2>Bergabunglah Bersama Keluarga Besar Majalengka Post</h2><p>Apakah Anda memiliki integritas tinggi, ketertarikan mendalam pada dunia jurnalistik, dan ingin berkontribusi aktif dalam mencerdaskan masyarakat melalui informasi tepercaya? <strong>Majalengka Post</strong> membuka kesempatan berkarir bagi para profesional muda, lulusan baru, maupun jurnalis berpengalaman untuk bergabung bersama kami.</p><h3>MENGAPA BERGABUNG DENGAN KAMI?</h3><p>Majalengka Post adalah media siber terdepan di wilayah Ciayumajakuning (Cirebon, Indramayu, Majalengka, Kuningan). Kami menawarkan:</p><ul><li>Lingkungan kerja yang dinamis, kolaboratif, dan menjunjung tinggi kode etik jurnalistik.</li><li>Program pelatihan berkala langsung dari redaktur senior dan sertifikasi kompetensi Dewan Pers.</li><li>Skema remunerasi yang kompetitif, tunjangan operasional, asuransi kesehatan (BPJS), serta bonus performa berbasis performansi artikel.</li></ul><h3>LOWONGAN YANG SEDANG DIBUKA</h3><div class="space-y-4 my-6"><div class="border border-gray-200 dark:border-gray-850 p-4 rounded-xl"><h4 class="m-0 text-red-600 dark:text-red-400 font-bold">1. Reporter Daerah (Majalengka & Sekitarnya)</h4><p class="text-sm text-gray-500 my-1">Status: Kontrak / Full-time | Lokasi penugasan: Kabupaten Majalengka</p><ul class="text-sm mt-2 mb-0"><li>Pendidikan minimal D3/S1 semua jurusan (diutamakan Jurnalistik, Komunikasi, atau Ilmu Sosial).</li><li>Memiliki kendaraan pribadi dan gawai/smartphone yang memadai untuk reportase cepat.</li><li>Menguasai bahasa daerah lokal dan memiliki jejaring narasumber yang luas merupakan nilai tambah.</li></ul></div><div class="border border-gray-200 dark:border-gray-850 p-4 rounded-xl"><h4 class="m-0 text-red-600 dark:text-red-400 font-bold">2. Fotografer Jurnalistik / Fotojurnalis</h4><p class="text-sm text-gray-500 my-1">Status: Part-time / Freelance | Lokasi penugasan: Wilayah Jawa Barat</p><ul class="text-sm mt-2 mb-0"><li>Memiliki kamera DSLR/Mirrorless profesional dan menguasai teknik fotografi luar ruangan.</li><li>Mampu menangkap momen bernilai berita tinggi dan menulis deskripsi foto (caption) yang informatif.</li></ul></div></div><h3>PROSES REKRUTMEN</h3><ol><li><strong>Pendaftaran Online:</strong> Isi formulir lamaran cepat di bawah halaman ini.</li><li><strong>Seleksi Administrasi & Portofolio:</strong> Evaluasi CV, karya tulis, atau portofolio visual Anda oleh redaktur pelaksana.</li><li><strong>Tes Tulis & Wawancara:</strong> Menguji wawasan umum, kemampuan penulisan berita, dan wawancara dengan Pemimpin Redaksi.</li><li><strong>OJT (On-the-Job Training):</strong> Pelatihan lapangan selama 1 bulan dengan pendampingan mentor jurnalis senior.</li></ol>',
  '2026-07-14T04:00:00Z'
),
(
  'kontak',
  'Hubungi Kami',
  '<h2>Hubungi Redaksi & Manajemen Majalengka Post</h2><p>Kami sangat menghargai setiap masukan, kritik, saran, pertanyaan, hak koreksi, maupun penawaran kerja sama dari Anda. Silakan hubungi kami melalui saluran komunikasi resmi berikut:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8"><div class="bg-gray-50 dark:bg-gray-850 p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3"><h4 class="mt-0 font-bold text-red-600 dark:text-red-400">KANTOR REDAKSI UTAMA</h4><p class="text-sm leading-relaxed mb-0"><strong>PT Majalengka Post Media</strong><br/>Gedung Graha Pers Majalengka Post, Lt. 1-2<br/>Jl. KH. Abdul Halim No. 12, Kelurahan Majalengka Kulon,<br/>Kecamatan Majalengka, Kabupaten Majalengka, Jawa Barat 45418</p></div><div class="bg-gray-50 dark:bg-gray-850 p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2"><h4 class="mt-0 font-bold text-red-600 dark:text-red-400">SALURAN KOMUNIKASI</h4><p class="text-sm mb-0"><strong>Email Redaksi:</strong> redaksi@majalengkapost.co.id</p><p class="text-sm mb-0"><strong>Email Iklan & Bisnis:</strong> marketing@majalengkapost.co.id</p><p class="text-sm mb-0"><strong>Telepon/Fax:</strong> (0233) 281450</p><p class="text-sm mb-0"><strong>Hotline WhatsApp:</strong> +62 812-3456-7890</p></div></div><h3>HAK JAWAB & HAK KOREKSI</h3><p>Bagi pembaca yang ingin menyampaikan hak koreksi terhadap kesalahan penulisan nama, data, atau kekeliruan fakta dalam pemberitaan kami, silakan kirimkan email resmi dengan melampirkan tautan (link) artikel yang dimaksud beserta koreksi faktual yang sah. Redaksi akan segera melakukan koreksi dalam waktu cepat setelah verifikasi dilakukan.</p>',
  '2026-07-14T04:00:00Z'
),
(
  'iklan',
  'Tarif Pemasangan Iklan',
  '<h2>Media Kit & Tarif Pemasangan Iklan 2026</h2><p>Majalengka Post menyediakan berbagai ruang strategis untuk promosi bisnis, instansi pemerintah, UMKM, maupun kampanye sosial Anda. Dengan jutaan impresi halaman setiap bulannya, iklan Anda akan menjangkau audiens tertarget secara efektif.</p><h3>DAFTAR TARIF IKLAN BANNER (DISPLAY ADS)</h3><p>Berikut adalah tarif sewa space banner iklan di website utama Majalengka Post:</p><table class="w-full border-collapse my-6 text-sm"><thead><tr class="bg-gray-150 dark:bg-gray-800 text-left"><th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Posisi Banner</th><th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Dimensi (Pixel)</th><th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Tarif / Minggu</th><th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Tarif / Bulan</th></tr></thead><tbody><tr><td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Header Premium Banner (Top)</td><td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">728 x 90</td><td class="p-3 border border-gray-200 dark:border-gray-700">Rp 1.500.000</td><td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 5.000.000</td></tr><tr class="bg-gray-50/50 dark:bg-gray-850/20"><td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Sidebar Rectangle Banner</td><td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">300 x 250</td><td class="p-3 border border-gray-200 dark:border-gray-700">Rp 800.000</td><td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 2.800.000</td></tr><tr><td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">In-Article Center Banner</td><td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">640 x 100</td><td class="p-3 border border-gray-200 dark:border-gray-700">Rp 1.000.000</td><td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 3.500.000</td></tr><tr class="bg-gray-50/50 dark:bg-gray-850/20"><td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Pop-up Interstitial Ads</td><td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">600 x 400</td><td class="p-3 border border-gray-200 dark:border-gray-700">Rp 2.500.000</td><td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 8.500.000</td></tr></tbody></table><h3>IKLAN ARTIKEL (ADVERTORIAL / SPONSORED CONTENT)</h3><p>Kami juga melayani penulisan artikel advertorial/promosi produk yang dioptimasi SEO oleh tim redaksi kami. Artikel akan tayang permanen di portal Majalengka Post, diarsipkan dalam kategori yang sesuai, dan disebarluaskan via akun sosial media resmi kami.</p><ul><li><strong>Tarif Advertorial Mandiri:</strong> Rp 1.500.000 / artikel (Materi naskah dari pengiklan).</li><li><strong>Tarif Advertorial Liputan:</strong> Rp 2.500.000 / artikel (Tim jurnalis kami langsung meliput ke lokasi Anda seputar Majalengka).</li></ul><h3>HUBUNGI TIM PEMASANGAN IKLAN</h3><p>Untuk pemesanan space iklan, negoisasi kontrak jangka panjang, atau konsultasi kampanye advertorial, silakan hubungi marketing representatif kami:</p><p><strong>Hotline Marketing:</strong> +62 853-9876-5432 (Call/WA)<br/><strong>Email Pemasaran:</strong> marketing@majalengkapost.co.id</p>',
  '2026-07-14T04:00:00Z'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  last_updated = EXCLUDED.last_updated;


