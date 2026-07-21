import { Article, ArticleStatus, Comment, AdBanner, MediaItem, InternalNotification, Poll, OpeningBanner } from "./types.js";

export const CATEGORIES = [
  "Nasional", "Politik", "Pemerintahan", "Daerah", "Hukum", "Kriminal", 
  "Ekonomi", "Bisnis", "Properti", "Infrastruktur", "Investasi", "UMKM", 
  "Perbankan", "Teknologi", "Startup", "AI", "Pendidikan", "Kesehatan", 
  "Lingkungan", "Energi", "Pertanian", "Perikanan", "Pariwisata", "Otomotif", 
  "Olahraga", "Esports", "Hiburan", "Lifestyle", "Fashion", "Kuliner", 
  "Travel", "Internasional", "Religi", "Budaya", "Komunitas", "Opini", 
  "Editorial", "Advertorial"
];

export const SHOLAT_SCHEDULE = {
  city: "Majalengka",
  Subuh: "04:38",
  Dzuhur: "11:56",
  Ashar: "15:18",
  Maghrib: "17:53",
  Isya: "19:07"
};

export const CURRENCY_RATES = [
  { code: "USD/IDR", rate: "16.385,00", change: "-0,18%" },
  { code: "EUR/IDR", rate: "17.654,20", change: "+0,24%" },
  { code: "SGD/IDR", rate: "12.115,80", change: "-0,08%" },
  { code: "JPY/IDR", rate: "101,42", change: "+0,32%" },
  { code: "CNY/IDR", rate: "2.248,50", change: "-0,15%" }
];

export const STOCK_MARKET = [
  { code: "IHSG", value: "7.291,48", change: "+0,58%", trend: "up" },
  { code: "TLKM", value: "3.140", change: "-0,95%", trend: "down" },
  { code: "BBCA", value: "10.150", change: "+1,25%", trend: "up" },
  { code: "GOTO", value: "52", change: "-1,89%", trend: "down" },
  { code: "ADRO", value: "2.910", change: "+2,46%", trend: "up" }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Akselerasi Transformasi AI Nasional: Menuju Birokrasi Cerdas 2030",
    subTitle: "Pemerintah luncurkan Blueprint Integrasi AI di seluruh sektor pelayanan publik untuk memangkas birokrasi berbelit.",
    summary: "Kementerian Pendayagunaan Aparatur Negara merilis cetak biru baru mengenai pemanfaatan AI generatif untuk pelayanan publik. Sistem ini diproyeksikan menghemat anggaran operasional hingga 35% dan memangkas waktu tunggu layanan sipil secara instan.",
    content: `
      <p><strong>Majalengka, Majalengka Post</strong> — Pemerintah Indonesia resmi meluncurkan Cetak Biru (Blueprint) Transformasi AI Nasional yang diproyeksikan menjadi pilar utama reformasi birokrasi menuju Indonesia Emas 2045. Langkah strategis ini dipimpin langsung oleh Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) bekerjasama dengan konsorsium teknologi nasional.</p>
      
      <p>Melalui implementasi kecerdasan buatan, berbagai dokumen perizinan, administrasi kependudukan, hingga pengelolaan bantuan sosial akan diproses secara otomatis menggunakan AI generatif terlatih. Hal ini diharapkan mampu menekan tingkat korupsi struktural, meningkatkan efisiensi fiskal, serta memangkas proses administrasi yang selama ini memakan waktu mingguan menjadi hanya hitungan menit.</p>
      
      <figure class="my-6">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" alt="Artificial Intelligence" class="rounded-lg w-full" />
        <figcaption class="text-xs text-gray-500 mt-2 text-center">Visualisasi Pusat Komputasi Nasional yang terintegrasi AI. (Foto: Unsplash)</figcaption>
      </figure>

      <h3>Efisiensi Anggaran dan Transparansi</h3>
      <p>Menteri PANRB menyatakan bahwa integrasi kecerdasan buatan dalam layanan sipil bukan berarti memangkas peran manusia, melainkan mengalihkan tugas-tugas administratif repetitif ke dalam sistem otomatis. Hal ini memungkinkan aparatur sipil negara (ASN) fokus pada penyelesaian masalah-masalah sosial yang membutuhkan empati dan pengambilan keputusan strategis tingkat tinggi.</p>
      
      <blockquote>
        "Dengan AI, kita bisa mendeteksi tumpang tindih anggaran secara real-time dan menganalisis efektivitas penyaluran bantuan sosial langsung kepada masyarakat miskin secara presisi."
      </blockquote>

      <h3>Tantangan Keamanan Siber</h3>
      <p>Kendati menawarkan segudang kemudahan, para ahli teknologi mengingatkan pemerintah tentang risiko kedaulatan data dan keamanan siber. Menanggapi hal tersebut, Kementerian Komunikasi dan Informatika menegaskan bahwa seluruh infrastruktur AI ini akan berjalan di atas Server Data Center Nasional (PDN) yang telah dilengkapi enkripsi enkripsi kuantum terkini guna mencegah kebocoran data sensitif warga negara.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    author: "Rian Wijaya",
    editor: "Sarah Amanda",
    photographer: "Budi Santoso",
    date: "2026-07-07",
    time: "09:15",
    location: "Jakarta Pusat",
    gpsCoords: { lat: -6.175392, lng: 106.827153 },
    category: "Nasional",
    subCategory: "Pemerintahan",
    tags: ["AI", "Birokrasi", "PANRB", "Teknologi", "Indonesia Cerdas"],
    views: 12450,
    shares: 842,
    likes: 1950,
    bookmarks: 420,
    isBreaking: true,
    isHeadline: true,
    isTrending: true,
    isEditorialChoice: true,
    isFeatured: true,
    isSticky: true,
    status: ArticleStatus.PUBLISHED,
    seo: {
      title: "Blueprint AI Nasional Reformasi Birokrasi Indonesia - Majalengka Post",
      description: "Pemerintah meluncurkan cetak biru AI nasional untuk memangkas birokrasi pelayanan publik demi efisiensi fiskal dan transparansi publik.",
      keywords: "AI nasional, birokrasi cerdas, PANRB, Indonesia emas, reformasi birokrasi",
      canonicalUrl: "https://www.majalengkapost.co.id/nasional/akselerasi-transformasi-ai"
    }
  },
  {
    id: "art-2",
    title: "Tol Trans-Sumatera Ruas Terakhir Resmi Tersambung Penuh Bulan Ini",
    subTitle: "Menghubungkan Lampung hingga Aceh, proyek infrastruktur raksasa ini rampung 6 bulan lebih awal dari target.",
    summary: "Proyek Strategis Nasional (PSN) Jalan Tol Trans-Sumatera (JTTS) akhirnya menyentuh babak akhir. Konektivitas penuh ini diprediksi akan memotong biaya logistik regional hingga 40% dan merangsang pertumbuhan kawasan ekonomi baru.",
    content: `
      <p><strong>Palembang, Majalengka Post</strong> — Kabar gembira bagi mobilitas logistik dan pariwisata di pulau Sumatera. Ruas tol terakhir yang menghubungkan seluruh koridor utama dari Bakauheni (Lampung) hingga Banda Aceh dipastikan siap beroperasi penuh dan diresmikan oleh Presiden pertengahan bulan ini.</p>
      <p>Proyek multi-tahun ini menjadi salah satu warisan pembangunan infrastruktur terbesar dekade ini. Dengan total panjang mencapai lebih dari 2.800 kilometer, tol ini memangkas waktu tempuh perjalanan darat lintas pulau secara drastis dari yang semula memakan waktu 80 jam kini hanya berkisar 32 jam.</p>
      <p>Badan Pengatur Jalan Tol (BPJT) menyebutkan percepatan penyelesaian ini didukung oleh metode konstruksi modern serta lancarnya proses pembebasan lahan yang melibatkan kolaborasi aktif pemerintah daerah dan masyarakat setempat.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
    galleryImages: [],
    author: "Dewi Lestari",
    editor: "Hendra Setiawan",
    photographer: "Anton Nugroho",
    date: "2026-07-06",
    time: "14:20",
    location: "Palembang",
    gpsCoords: { lat: -2.990934, lng: 104.756554 },
    category: "Infrastruktur",
    subCategory: "Pembangunan",
    tags: ["Infrastruktur", "Tol Sumatera", "Logistik", "Pembangunan"],
    views: 8940,
    shares: 312,
    likes: 840,
    bookmarks: 145,
    isBreaking: false,
    isHeadline: false,
    isTrending: true,
    isEditorialChoice: false,
    isFeatured: true,
    isSticky: false,
    status: ArticleStatus.PUBLISHED,
    seo: {
      title: "Tol Trans Sumatera Resmi Tersambung Penuh - Majalengka Post",
      description: "Jalan Tol Trans-Sumatera selesai lebih cepat dari target, siap pangkas biaya logistik sumatera hingga 40%.",
      keywords: "tol sumatera, infrastruktur, logistik nasional, jalan tol",
      canonicalUrl: "https://www.majalengkapost.co.id/infrastruktur/tol-trans-sumatera"
    }
  },
  {
    id: "art-3",
    title: "Inovasi Motor Listrik Hybrid Lokal Sabet Penghargaan Desain Terbaik di Jenewa",
    subTitle: "Karya anak bangsa menonjolkan efisiensi energi ganda serta kearifan lokal bodi berbahan serat kelapa alami.",
    summary: "Sebuah startup otomotif asal Bandung berhasil membawa pulang medali emas di ajang Swiss Automotive Design Awards. Motor listrik pintar ini mengintegrasikan teknologi solar cell fleksibel dengan sasis aerodinamis ramah lingkungan.",
    content: `
      <p><strong>Bandung, Majalengka Post</strong> — Kebanggaan kembali diukir oleh talenta muda Indonesia di kancah global. Motor listrik pintar bermerek 'Suryakencana Hybrid' yang diproduksi oleh startup lokal asal Bandung sukses merebut penghargaan prestisius 'Best Eco-Innovation' di Geneva Motor Show.</p>
      <p>Kelebihan utama motor ini terletak pada sel surya fleksibel yang tertanam pada fairing bodi, yang mampu mengisi daya baterai secara mandiri saat diparkir di tempat terbuka. Tidak hanya itu, sasis sekunder bodi memanfaatkan material komposit serat kelapa alami yang sangat ringan namun memiliki kekuatan benturan setara serat karbon.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    galleryImages: [],
    author: "Fajar Nugraha",
    editor: "Sarah Amanda",
    date: "2026-07-07",
    time: "07:30",
    location: "Bandung",
    category: "Otomotif",
    subCategory: "Kendaraan Listrik",
    tags: ["Motor Listrik", "Karya Anak Bangsa", "Otomotif", "Go Green"],
    views: 11020,
    shares: 950,
    likes: 2130,
    bookmarks: 560,
    isBreaking: false,
    isHeadline: true,
    isTrending: false,
    isEditorialChoice: true,
    isFeatured: false,
    isSticky: false,
    status: ArticleStatus.PUBLISHED,
    seo: {
      title: "Motor Listrik Hybrid Lokal Menang Desain di Jenewa - Majalengka Post",
      description: "Suryakencana Hybrid, motor listrik karya anak bangsa berbahan serat kelapa raih medali emas desain terbaik di Swiss.",
      keywords: "motor listrik, hybrid lokal, penghargaan otomotif, inovasi hijau",
      canonicalUrl: "https://www.majalengkapost.co.id/otomotif/motor-listrik-hybrid-lokal"
    }
  },
  {
    id: "art-4",
    title: "Menggali Potensi Wisata Desa Adat Wae Rebo yang Memikat Dunia",
    subTitle: "Eksotisme desa di atas awan NTT yang terus menjaga tradisi leluhur di tengah arus modernisasi global.",
    summary: "Wae Rebo menjadi role model nasional dalam pengelolaan pariwisata berkelanjutan (sustainable tourism) berbasis komunitas adat. Pendapatan pariwisata sepenuhnya dikelola untuk pendidikan anak desa dan pelestarian rumah adat Mbaru Niang.",
    content: `
      <p><strong>Manggarai, Majalengka Post</strong> — Berada di ketinggian 1.200 meter di atas permukaan laut, Desa Adat Wae Rebo di Flores, NTT, terus memancarkan pesona mistisnya bagi pelancong dunia. Menariknya, desa ini menerapkan kuota kunjungan ketat demi melestarikan tatanan adat serta ekosistem pegunungan sekitarnya.</p>
      <p>Sistem pariwisata berkelanjutan di Wae Rebo mengedepankan keterlibatan penuh warga lokal. Turis tidak sekadar menginap, melainkan ikut menjalani aktivitas harian warga, mulai dari memetik kopi khas Manggarai, memasak dengan kayu bakar, hingga mengikuti ritual penghormatan leluhur.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    galleryImages: [],
    author: "Gisela Maria",
    editor: "Hendra Setiawan",
    date: "2026-07-05",
    time: "10:00",
    location: "Manggarai Barat",
    category: "Pariwisata",
    subCategory: "Budaya",
    tags: ["Wae Rebo", "Pariwisata Berkelanjutan", "NTT", "Pesona Indonesia"],
    views: 6530,
    shares: 198,
    likes: 470,
    bookmarks: 189,
    isBreaking: false,
    isHeadline: false,
    isTrending: false,
    isEditorialChoice: false,
    isFeatured: false,
    isSticky: false,
    status: ArticleStatus.PUBLISHED,
    seo: {
      title: "Pesona Wisata Adat Wae Rebo Berkelanjutan - Majalengka Post",
      description: "Menengok keberhasilan Desa Adat Wae Rebo menjaga warisan adat budaya berpadu dengan pariwisata berkelanjutan dunia.",
      keywords: "wae rebo, ntt, pesona indonesia, pariwisata berkelanjutan",
      canonicalUrl: "https://www.majalengkapost.co.id/pariwisata/wisata-wae-rebo"
    }
  },
  {
    id: "art-5",
    title: "Draft Berita: Rencana Kebijakan Pajak Karbon Industri Manufaktur",
    subTitle: "Kajian mendalam penerapan tarif karbon per ton CO2 ekuivalen untuk mendorong industri beralih ke energi ramah lingkungan.",
    summary: "Artikel ini membahas draf awal regulasi pajak emisi karbon bagi pelaku industri skala besar guna memenuhi target Net Zero Emission Indonesia pada tahun 2060.",
    content: "<p>Kementerian Keuangan bekerjasama dengan Kementerian Lingkungan Hidup merampungkan draf regulasi pajak karbon industri. Skema ini menetapkan tarif progresif yang akan didistribusikan langsung ke dalam proyek-proyek restorasi hutan gambut nasional...</p>",
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800",
    galleryImages: [],
    author: "Rian Wijaya",
    editor: "Sarah Amanda",
    date: "2026-07-07",
    time: "11:00",
    location: "Jakarta",
    category: "Ekonomi",
    tags: ["Pajak Karbon", "Kemenkeu", "Green Energy", "Ekonomi Hijau"],
    views: 0,
    shares: 0,
    likes: 0,
    bookmarks: 0,
    isBreaking: false,
    isHeadline: false,
    isTrending: false,
    isEditorialChoice: false,
    isFeatured: false,
    isSticky: false,
    status: ArticleStatus.DRAFT,
    seo: {
      title: "Kajian Pajak Karbon Manufaktur - Majalengka Post",
      description: "Draf kajian kebijakan pengenaan tarif progresif pajak karbon manufaktur.",
      keywords: "pajak karbon, ekonomi hijau, emisi industri",
      canonicalUrl: ""
    }
  },
  {
    id: "art-6",
    title: "Menanti Keputusan Strategis Suku Bunga Acuan Bank Indonesia",
    subTitle: "Analisis pasar finansial menjelang pengumuman BI-Rate dalam merespon kebijakan Federal Reserve.",
    summary: "Pelaku pasar dan perbankan mengantisipasi keputusan Rapat Dewan Gubernur Bank Indonesia terkait suku bunga acuan guna menjaga stabilitas nilai tukar Rupiah di tengah volatilitas pasar global.",
    content: "<p>Jakarta — Rapat Dewan Gubernur Bank Indonesia (RDG-BI) yang berlangsung pekan ini menjadi sorotan utama para analis pasar keuangan nasional. Tingginya ketidakpastian suku bunga bank sentral global mendorong BI mengambil langkah-langkah pre-emptive guna memastikan stabilitas nilai tukar tetap terjaga dengan baik...</p>",
    coverImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800",
    galleryImages: [],
    author: "Indra Kusuma",
    editor: "Hendra Setiawan",
    date: "2026-07-07",
    time: "14:00",
    location: "Jakarta",
    category: "Ekonomi",
    subCategory: "Perbankan",
    tags: ["Bank Indonesia", "Suku Bunga", "Rupiah", "Finansial"],
    views: 120,
    shares: 4,
    likes: 12,
    bookmarks: 3,
    isBreaking: false,
    isHeadline: false,
    isTrending: false,
    isEditorialChoice: false,
    isFeatured: false,
    isSticky: false,
    status: ArticleStatus.REVIEW_EDITOR,
    seo: {
      title: "Analisis Suku Bunga Bank Indonesia RDG - Majalengka Post",
      description: "Menanti rilis kebijakan suku bunga terbaru Bank Indonesia untuk memperkuat ketahanan rupiah.",
      keywords: "bi-rate, suku bunga, bank indonesia, kebijakan moneter",
      canonicalUrl: ""
    }
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "comm-1",
    articleId: "art-1",
    user: "Bambang Sugiharto",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
    content: "Langkah yang sangat bagus! Birokrasi kita memang butuh guncangan digitalisasi seperti ini agar tidak berbelit-belit lagi. Semoga sistem keamanannya benar-benar terjaga.",
    timestamp: "2026-07-07 10:20",
    likes: 45,
    reported: false,
    sentiment: "positive",
    isModerated: true,
    replies: [
      {
        id: "comm-1-r1",
        articleId: "art-1",
        user: "Sarah Amanda (Editor)",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
        content: "Terima kasih atas tanggapannya Pak Bambang. Benar, keamanan data kedaulatan digital memang menjadi fokus diskusi utama para panelis siber saat ini.",
        timestamp: "2026-07-07 10:45",
        likes: 15,
        reported: false,
        sentiment: "positive",
        isModerated: true,
        replies: []
      }
    ]
  },
  {
    id: "comm-2",
    articleId: "art-1",
    user: "Gita Lovisa",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150",
    content: "Saya agak khawatir tentang nasib pegawai administrasi golongan bawah. Apakah mereka akan terkena PHK massal atau ada pelatihan transisi karir?",
    timestamp: "2026-07-07 11:15",
    likes: 28,
    reported: false,
    sentiment: "neutral",
    isModerated: true,
    replies: []
  }
];

export const INITIAL_BANNERS: AdBanner[] = [
  {
    id: "ban-head",
    title: "Sponsor Utama - Kemudahan Berinvestasi Reksadana",
    position: "header",
    type: "internal",
    adUrl: "https://www.majalengkapost.co.id/iklan-investasi",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&h=120&auto=format&fit=crop",
    views: 45200,
    clicks: 1240,
    active: true
  },
  {
    id: "ban-side",
    title: "Gadget Masa Kini - Diskon Spesial 2026",
    position: "sidebar",
    type: "internal",
    adUrl: "https://www.majalengkapost.co.id/iklan-gadget",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&h=600&auto=format&fit=crop",
    views: 28100,
    clicks: 650,
    active: true
  },
  {
    id: "ban-mid",
    title: "Solusi Cloud Nasional Terbaik",
    position: "center",
    type: "html",
    adUrl: "https://www.majalengkapost.co.id/iklan-cloud",
    htmlContent: `
      <div class="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span class="text-xs bg-cyan-500 font-bold px-2 py-1 rounded text-gray-950">SPONSORED</span>
          <h4 class="text-xl font-bold mt-2">Nusantara Cloud Server</h4>
          <p class="text-xs text-gray-300">Infrastruktur cloud karya anak bangsa dengan jaminan uptime 99.99% dan kedaulatan data 100% lokal.</p>
        </div>
        <a href="https://www.majalengkapost.co.id/iklan-cloud" target="_blank" class="bg-cyan-400 hover:bg-cyan-300 text-gray-950 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors">
          Coba Gratis 30 Hari
        </a>
      </div>
    `,
    views: 18900,
    clicks: 432,
    active: true
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "med-1",
    name: "pusat_data_nasional_2026.webp",
    type: "photo",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    size: "154 KB",
    folder: "Nasional",
    tags: ["data center", "nasional", "cyber"],
    created_at: "2026-07-07 08:30"
  },
  {
    id: "med-2",
    name: "peresmian_tol_trans_sumatera.webp",
    type: "photo",
    url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800",
    size: "245 KB",
    folder: "Infrastruktur",
    tags: ["tol", "sumatera", "pembangunan"],
    created_at: "2026-07-06 14:00"
  },
  {
    id: "med-3",
    name: "katalog_suryakencana_motor.pdf",
    type: "pdf",
    url: "#",
    size: "2.4 MB",
    folder: "Dokumen",
    tags: ["katalog", "motor listrik", "brosur"],
    created_at: "2026-07-07 07:15"
  },
  {
    id: "med-4",
    name: "video_promosi_wisata_waerebo.mp4",
    type: "video",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    size: "18.5 MB",
    folder: "Pariwisata",
    tags: ["waerebo", "video promo", "ntt"],
    created_at: "2026-07-05 09:30"
  }
];

export const INITIAL_NOTIFICATIONS: InternalNotification[] = [
  {
    id: "not-1",
    title: "Berita Baru Dikirim oleh Wartawan",
    message: "Wartawan Rian Wijaya mengirim artikel 'Kajian Kebijakan Pajak Karbon Industri' untuk direview.",
    timestamp: "2026-07-07 11:02",
    category: "workflow",
    read: false
  },
  {
    id: "not-2",
    title: "Revisi Diperlukan",
    message: "Editor Sarah Amanda meminta revisi tata bahasa untuk judul berita motor hybrid.",
    timestamp: "2026-07-07 08:15",
    category: "workflow",
    read: true
  },
  {
    id: "not-3",
    title: "Deadline Artikel Opini",
    message: "Pengingat: Artikel opini mingguan dari Redaktur harus diterbitkan sebelum pukul 17:00 hari ini.",
    timestamp: "2026-07-07 07:00",
    category: "deadline",
    read: false
  }
];

export const INITIAL_POLL: Poll = {
  id: "poll-1",
  question: "Bagaimana tanggapan Anda mengenai rencana digitalisasi penuh seluruh birokrasi pemerintahan menggunakan AI?",
  options: [
    { id: "opt-1", text: "Sangat setuju, ini memangkas pungli dan antrean", votes: 485 },
    { id: "opt-2", text: "Setuju, asalkan keamanan siber data pribadi dijamin", votes: 612 },
    { id: "opt-3", text: "Ragu-ragu, takut terjadi kebocoran data siber lagi", votes: 215 },
    { id: "opt-4", text: "Tidak setuju, lebih baik mengoptimalkan SDM yang ada", votes: 94 }
  ],
  totalVotes: 1406,
  active: true
};

export const REALTIME_ANALYTICS = {
  realTimeVisitors: 342,
  bounceRate: "28.4%",
  avgDuration: "3m 45s",
  totalViews: 84920,
  visitorsToday: 14250,
  visitorsThisMonth: 425900,
  visitorsThisYear: 5120400,
  adEarnings: "Rp 42.850.000",
  trafficReferrals: [
    { name: "Google Search", percentage: 48, value: "48%" },
    { name: "Direct", percentage: 22, value: "22%" },
    { name: "Facebook & IG", percentage: 15, value: "15%" },
    { name: "X (Twitter)", percentage: 10, value: "10%" },
    { name: "WhatsApp & Telegram", percentage: 5, value: "5%" }
  ],
  deviceDistribution: [
    { name: "Mobile (Smartphone)", percentage: 76 },
    { name: "Desktop (PC/Laptop)", percentage: 20 },
    { name: "Tablet", percentage: 4 }
  ],
  browserDistribution: [
    { name: "Google Chrome", percentage: 64 },
    { name: "Safari (iOS/macOS)", percentage: 22 },
    { name: "Samsung Internet", percentage: 8 },
    { name: "Mozilla Firefox", percentage: 4 },
    { name: "Edge & Others", percentage: 2 }
  ],
  geoDistribution: [
    { name: "Jakarta", value: 4200 },
    { name: "Surabaya", value: 1850 },
    { name: "Bandung", value: 1620 },
    { name: "Medan", value: 1100 },
    { name: "Makassar", value: 850 },
    { name: "Yogyakarta", value: 780 }
  ]
};

export const DEFAULT_COMPANY_PROFILES = [
  {
    id: "redaksi",
    title: "Susunan Redaksi",
    content: `
      <h2>Susunan Redaksi & Manajemen Majalengka Post</h2>
      <p>Berdasarkan Keputusan Menteri Hukum dan HAM Republik Indonesia serta ketentuan Undang-Undang Nomor 40 Tahun 1999 tentang Pers, berikut adalah struktur organisasi, pengurus, dan dewan redaksi dari <strong>PT Majalengka Post Media</strong>:</p>
      
      <div class="my-6 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-850 p-4 rounded-r-xl">
        <h3 class="mt-0 font-bold">PENERBIT</h3>
        <p class="mb-0"><strong>PT Majalengka Post Media</strong><br/>SK Kemenkumham RI No: AHU-0034912.AH.01.01.Tahun 2026</p>
      </div>

      <h3>DEWAN DIREKSI & MANAJEMEN</h3>
      <ul>
        <li><strong>Pemimpin Umum / Penanggung Jawab:</strong> Radit Widjaya, S.I.Kom.</li>
        <li><strong>Direktur Utama:</strong> Dr. H. Ahmad Fauzi, M.M.</li>
        <li><strong>Direktur Keuangan:</strong> Rina Kartika, S.E.</li>
        <li><strong>Direktur Bisnis & Kemitraan:</strong> Hendra Lesmana, M.B.A.</li>
      </ul>

      <h3>DEWAN REDAKSI</h3>
      <ul>
        <li><strong>Pemimpin Redaksi / Penanggung Jawab Redaksi:</strong> Sarah Amanda, M.Si. (Sertifikasi Wartawan Utama Dewan Pers)</li>
        <li><strong>Redaktur Pelaksana:</strong> Rian Wijaya</li>
        <li><strong>Redaktur Senior:</strong> Bambang Soetedjo, Elok Sulastri</li>
        <li><strong>Editor Bahasa:</strong> Diana Putri, S.Hum.</li>
      </ul>

      <h3>REPORTER & TIM KREATIF</h3>
      <ul>
        <li><strong>Reporter Lapangan:</strong> Budi Santoso, Cecep Hermawan, Linda Novita, Taufik Hidayat</li>
        <li><strong>Jurnalis Foto (Fotografer):</strong> Deni Ramdani</li>
        <li><strong>Jurnalis Video & Sosmed:</strong> Gilang Ramadhan, Anisa Fitri</li>
        <li><strong>IT & System Administrator:</strong> Fajar Nugraha, S.Kom.</li>
      </ul>

      <h3>ALAMAT KANTOR REDAKSI</h3>
      <p>Gedung Graha Pers Majalengka Post<br/>Jl. KH. Abdul Halim No. 12, Kelurahan Majalengka Kulon,<br/>Kecamatan Majalengka, Kabupaten Majalengka, Jawa Barat 45418<br/>Email: redaksi@majalengkapost.co.id | Telp: (0233) 281450</p>
      
      <hr class="my-6 border-gray-200 dark:border-gray-800" />
      <p class="text-xs text-gray-550 font-medium"><em>Wartawan Majalengka Post selalu dibekali dengan tanda pengenal (Kartu Pers) yang masih berlaku dan namanya tercantum dalam boks redaksi ini dalam menjalankan tugas jurnalistik. Wartawan Majalengka Post dilarang meminta atau menerima imbalan dalam bentuk apa pun dari narasumber.</em></p>
    `,
    lastUpdated: "2026-07-14T04:00:00Z"
  },
  {
    id: "karir",
    title: "Karir Wartawan",
    content: `
      <h2>Bergabunglah Bersama Keluarga Besar Majalengka Post</h2>
      <p>Apakah Anda memiliki integritas tinggi, ketertarikan mendalam pada dunia jurnalistik, dan ingin berkontribusi aktif dalam mencerdaskan masyarakat melalui informasi tepercaya? <strong>Majalengka Post</strong> membuka kesempatan berkarir bagi para profesional muda, lulusan baru, maupun jurnalis berpengalaman untuk bergabung bersama kami.</p>

      <h3>MENGAPA BERGABUNG DENGAN KAMI?</h3>
      <p>Majalengka Post adalah media siber terdepan di wilayah Ciayumajakuning (Cirebon, Indramayu, Majalengka, Kuningan). Kami menawarkan:</p>
      <ul>
        <li>Lingkungan kerja yang dinamis, kolaboratif, dan menjunjung tinggi kode etik jurnalistik.</li>
        <li>Program pelatihan berkala langsung dari redaktur senior dan sertifikasi kompetensi Dewan Pers.</li>
        <li>Skema remunerasi yang kompetitif, tunjangan operasional, asuransi kesehatan (BPJS), serta bonus performa berbasis performansi artikel.</li>
      </ul>

      <h3>LOWONGAN YANG SEDANG DIBUKA</h3>
      
      <div class="space-y-4 my-6">
        <div class="border border-gray-200 dark:border-gray-850 p-4 rounded-xl">
          <h4 class="m-0 text-red-600 dark:text-red-400 font-bold">1. Reporter Daerah (Majalengka & Sekitarnya)</h4>
          <p class="text-sm text-gray-500 my-1">Status: Kontrak / Full-time | Lokasi penugasan: Kabupaten Majalengka</p>
          <ul class="text-sm mt-2 mb-0">
            <li>Pendidikan minimal D3/S1 semua jurusan (diutamakan Jurnalistik, Komunikasi, atau Ilmu Sosial).</li>
            <li>Memiliki kendaraan pribadi dan gawai/smartphone yang memadai untuk reportase cepat.</li>
            <li>Menguasai bahasa daerah lokal dan memiliki jejaring narasumber yang luas merupakan nilai tambah.</li>
          </ul>
        </div>

        <div class="border border-gray-200 dark:border-gray-850 p-4 rounded-xl">
          <h4 class="m-0 text-red-600 dark:text-red-400 font-bold">2. Fotografer Jurnalistik / Fotojurnalis</h4>
          <p class="text-sm text-gray-500 my-1">Status: Part-time / Freelance | Lokasi penugasan: Wilayah Jawa Barat</p>
          <ul class="text-sm mt-2 mb-0">
            <li>Memiliki kamera DSLR/Mirrorless profesional dan menguasai teknik fotografi luar ruangan.</li>
            <li>Mampu menangkap momen bernilai berita tinggi dan menulis deskripsi foto (caption) yang informatif.</li>
          </ul>
        </div>
      </div>

      <h3>PROSES REKRUTMEN</h3>
      <ol>
        <li><strong>Pendaftaran Online:</strong> Isi formulir lamaran cepat di bawah halaman ini.</li>
        <li><strong>Seleksi Administrasi & Portofolio:</strong> Evaluasi CV, karya tulis, atau portofolio visual Anda oleh redaktur pelaksana.</li>
        <li><strong>Tes Tulis & Wawancara:</strong> Menguji wawasan umum, kemampuan penulisan berita, dan wawancara dengan Pemimpin Redaksi.</li>
        <li><strong>OJT (On-the-Job Training):</strong> Pelatihan lapangan selama 1 bulan dengan pendampingan mentor jurnalis senior.</li>
      </ol>
    `,
    lastUpdated: "2026-07-14T04:00:00Z"
  },
  {
    id: "kontak",
    title: "Hubungi Kami",
    content: `
      <h2>Hubungi Redaksi & Manajemen Majalengka Post</h2>
      <p>Kami sangat menghargai setiap masukan, kritik, saran, pertanyaan, hak koreksi, maupun penawaran kerja sama dari Anda. Silakan hubungi kami melalui saluran komunikasi resmi berikut:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div class="bg-gray-50 dark:bg-gray-850 p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
          <h4 class="mt-0 font-bold text-red-600 dark:text-red-400">KANTOR REDAKSI UTAMA</h4>
          <p class="text-sm leading-relaxed mb-0">
            <strong>PT Majalengka Post Media</strong><br/>
            Gedung Graha Pers Majalengka Post, Lt. 1-2<br/>
            Jl. KH. Abdul Halim No. 12, Kelurahan Majalengka Kulon,<br/>
            Kecamatan Majalengka, Kabupaten Majalengka, Jawa Barat 45418
          </p>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-850 p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
          <h4 class="mt-0 font-bold text-red-600 dark:text-red-400">SALURAN KOMUNIKASI</h4>
          <p class="text-sm mb-0"><strong>Email Redaksi:</strong> redaksi@majalengkapost.co.id</p>
          <p class="text-sm mb-0"><strong>Email Iklan & Bisnis:</strong> marketing@majalengkapost.co.id</p>
          <p class="text-sm mb-0"><strong>Telepon/Fax:</strong> (0233) 281450</p>
          <p class="text-sm mb-0"><strong>Hotline WhatsApp:</strong> +62 812-3456-7890</p>
        </div>
      </div>

      <h3>HAK JAWAB & HAK KOREKSI</h3>
      <p>Bagi pembaca yang ingin menyampaikan hak koreksi terhadap kesalahan penulisan nama, data, atau kekeliruan fakta dalam pemberitaan kami, silakan kirimkan email resmi dengan melampirkan tautan (link) artikel yang dimaksud beserta koreksi faktual yang sah. Redaksi akan segera melakukan koreksi dalam waktu cepat setelah verifikasi dilakukan.</p>
    `,
    lastUpdated: "2026-07-14T04:00:00Z"
  },
  {
    id: "iklan",
    title: "Tarif Pemasangan Iklan",
    content: `
      <h2>Media Kit & Tarif Pemasangan Iklan 2026</h2>
      <p>Majalengka Post menyediakan berbagai ruang strategis untuk promosi bisnis, instansi pemerintah, UMKM, maupun kampanye sosial Anda. Dengan jutaan impresi halaman setiap bulannya, iklan Anda akan menjangkau audiens tertarget secara efektif.</p>

      <h3>DAFTAR TARIF IKLAN BANNER (DISPLAY ADS)</h3>
      <p>Berikut adalah tarif sewa space banner iklan di website utama Majalengka Post:</p>
      
      <table class="w-full border-collapse my-6 text-sm">
        <thead>
          <tr class="bg-gray-150 dark:bg-gray-800 text-left">
            <th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Posisi Banner</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Dimensi (Pixel)</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Tarif / Minggu</th>
            <th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Tarif / Bulan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Header Premium Banner (Top)</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">728 x 90</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700">Rp 1.500.000</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 5.000.000</td>
          </tr>
          <tr class="bg-gray-50/50 dark:bg-gray-850/20">
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Sidebar Rectangle Banner</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">300 x 250</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700">Rp 800.000</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 2.800.000</td>
          </tr>
          <tr>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">In-Article Center Banner</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">640 x 100</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700">Rp 1.000.000</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 3.500.000</td>
          </tr>
          <tr class="bg-gray-50/50 dark:bg-gray-850/20">
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Pop-up Interstitial Ads</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">600 x 400</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700">Rp 2.500.000</td>
            <td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 8.500.000</td>
          </tr>
        </tbody>
      </table>

      <h3>IKLAN ARTIKEL (ADVERTORIAL / SPONSORED CONTENT)</h3>
      <p>Kami juga melayani penulisan artikel advertorial/promosi produk yang dioptimasi SEO oleh tim redaksi kami. Artikel akan tayang permanen di portal Majalengka Post, diarsipkan dalam kategori yang sesuai, dan disebarluaskan via akun sosial media resmi kami.</p>
      <ul>
        <li><strong>Tarif Advertorial Mandiri:</strong> Rp 1.500.000 / artikel (Materi naskah dari pengiklan).</li>
        <li><strong>Tarif Advertorial Liputan:</strong> Rp 2.500.000 / artikel (Tim jurnalis kami langsung meliput ke lokasi Anda seputar Majalengka).</li>
      </ul>

      <h3>HUBUNGI TIM PEMASANGAN IKLAN</h3>
      <p>Untuk pemesanan space iklan, negoisasi kontrak jangka panjang, atau konsultasi kampanye advertorial, silakan hubungi marketing representatif kami:</p>
      <p><strong>Hotline Marketing:</strong> +62 853-9876-5432 (Call/WA)<br/><strong>Email Pemasaran:</strong> marketing@majalengkapost.co.id</p>
    `,
    lastUpdated: "2026-07-14T04:00:00Z"
  }
];

export const INITIAL_OPENING_BANNERS: OpeningBanner[] = [
  {
    id: "banner-opening-1",
    title: "Selamat Datang di Majalengka Post",
    subtitle: "Dapatkan berita terupdate, akurat, dan terpercaya seputar Majalengka & Nasional langsung di genggaman Anda.",
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Jelajahi Berita Terbaru",
    buttonLink: "#latest-news",
    isActive: true,
    status: "published",
    startDate: null,
    endDate: null,
    displayPosition: "center",
    animation: "zoom",
    animationDuration: 0.4,
    overlayColor: "#000000",
    overlayOpacity: 0.65,
    displayInterval: "always",
    showOnce: false,
    pageTarget: "all",
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
