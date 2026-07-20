import { Article, ArticleStatus, Comment, AdBanner, MediaItem, InternalNotification, Poll } from "./types";

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
    id: "about",
    title: "Tentang Kami",
    content: `
      <h2>Mengenal Lebih Dekat Portal Berita Majalengka Post</h2>
      <p>Selamat datang di <strong>Majalengka Post</strong>, portal berita siber independen dan tepercaya yang berdedikasi tinggi dalam menyajikan informasi terkini, berimbang, dan edukatif seputar wilayah Kabupaten Majalengka, Jawa Barat, serta berita nasional pilihan yang relevan bagi masyarakat.</p>

      <div class="my-6 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-850 p-5 rounded-r-xl">
        <h3 class="mt-0 font-bold text-red-600 dark:text-red-400">Jurnalisme Terpercaya Berbasis Keunggulan Lokal</h3>
        <p class="mb-0 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Didirikan pada pertengahan tahun 2026 di bawah bendera <strong>PT Majalengka Post Media</strong>, kami lahir dari visi untuk menghadirkan arus informasi yang jernih di tengah derasnya peredaran hoaks dan disinformasi digital. Kami percaya bahwa setiap kecamatan di Majalengka memiliki cerita, potensi, dan aspirasi berharga yang layak disuarakan ke panggung nasional.
        </p>
      </div>

      <h3>VISI & MISI KAMI</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="p-4 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Visi Perusahaan</h4>
          <p class="text-xs text-gray-500 leading-relaxed mb-0">
            Menjadi media siber multiplatform terdepan, tepercaya, dan paling berpengaruh di wilayah Jawa Barat yang mencerdaskan kehidupan bangsa, menjaga integritas publik, serta memajukan potensi ekonomi dan kebudayaan daerah secara berkelanjutan.
          </p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Misi Utama</h4>
          <ul class="text-xs text-gray-500 pl-4 space-y-1 mb-0 leading-relaxed">
            <li>Menghasilkan produk jurnalistik independen, objektif, berimbang, dan berpegang teguh pada Kode Etik Jurnalistik serta Pedoman Media Siber.</li>
            <li>Mengangkat potensi lokal Majalengka (sektor pariwisata, budaya, UMKM, pertanian) demi akselerasi pembangunan daerah.</li>
            <li>Mengembangkan teknologi siber inovatif yang memudahkan akses interaksi informasi publik (termasuk fitur asisten AI interaktif).</li>
          </ul>
        </div>
      </div>

      <h3>NILAI-NILAI UTAMA (CORE VALUES)</h3>
      <p>Dalam menjalankan operasional redaksi sehari-hari, seluruh jurnalis dan manajemen Majalengka Post wajib memegang teguh nilai-nilai berikut:</p>
      <ul>
        <li><strong>Akurasi Tanpa Kompromi:</strong> Kecepatan menyajikan berita sangat penting, namun akurasi dan kebenaran fakta di atas segalanya. Proses verifikasi berlapis wajib dilalui sebelum berita tayang.</li>
        <li><strong>Independensi Redaksi:</strong> Bebas dari segala bentuk intervensi politik maupun tekanan kepentingan bisnis komersial tertentu guna menjamin imparsialitas berita.</li>
        <li><strong>Keberpihakan pada Publik:</strong> Kami selalu berpihak pada kebenaran, keadilan sosial, transparansi pemerintahan, dan hak-hak asasi warga negara.</li>
        <li><strong>Inovasi Digital:</strong> Terus mengadaptasi perkembangan teknologi guna menghadirkan pengalaman membaca berita yang ramah pengguna, berwawasan modern, dan interaktif.</li>
      </ul>

      <h3>ASPEK LEGALITAS PERUSAHAAN</h3>
      <p>Majalengka Post dioperasikan secara profesional dan sah di bawah hukum Republik Indonesia:</p>
      <ul>
        <li><strong>Badan Hukum:</strong> PT Majalengka Post Media</li>
        <li><strong>Nomor Keputusan Kemenkumham:</strong> AHU-0034912.AH.01.01.Tahun 2026</li>
        <li><strong>Sertifikasi Pers:</strong> Sedang dalam proses verifikasi administrasi dan faktual Dewan Pers Indonesia</li>
        <li><strong>Pedoman Operasional:</strong> Mengikuti Pedoman Pemberitaan Media Siber Dewan Pers</li>
      </ul>
    `,
    lastUpdated: "2026-07-17T08:00:00Z"
  },
  {
    id: "redaksi",
    title: "Susunan Redaksi",
    content: `
      <h2>Struktur Redaksi & Organisasi Majalengka Post</h2>
      <p>PT Majalengka Post Media mengedepankan tata kelola pers yang akuntabel, transparan, dan profesional. Di bawah ini adalah susunan Dewan Manajemen, Dewan Redaksi, serta personil operasional kami:</p>
      
      <div class="my-6 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-850 p-4 rounded-r-xl">
        <h3 class="mt-0 font-bold text-red-600 dark:text-red-400">PENERBIT</h3>
        <p class="mb-0 text-sm"><strong>PT Majalengka Post Media</strong><br/>Surat Keputusan Menkumham RI No: <strong>AHU-0034912.AH.01.01.Tahun 2026</strong></p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div class="p-5 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 font-bold text-red-600 dark:text-red-400">DEWAN DIREKSI & MANAJEMEN</h4>
          <ul class="text-sm pl-4 space-y-1 mb-0">
            <li><strong>Pemimpin Umum / Penanggung Jawab:</strong> Radit Widjaya, S.I.Kom.</li>
            <li><strong>Direktur Utama:</strong> Dr. H. Ahmad Fauzi, M.M.</li>
            <li><strong>Direktur Keuangan:</strong> Rina Kartika, S.E.</li>
            <li><strong>Direktur Bisnis & Kemitraan:</strong> Hendra Lesmana, M.B.A.</li>
          </ul>
        </div>
        
        <div class="p-5 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 font-bold text-red-600 dark:text-red-400">DEWAN REDAKSI UTAMA</h4>
          <ul class="text-sm pl-4 space-y-1 mb-0">
            <li><strong>Pemimpin Redaksi / Penanggung Jawab Redaksi:</strong> Sarah Amanda, M.Si. (Sertifikasi Wartawan Utama Dewan Pers)</li>
            <li><strong>Redaktur Pelaksana:</strong> Rian Wijaya, S.Sos.</li>
            <li><strong>Redaktur Senior:</strong> Bambang Soetedjo, Elok Sulastri</li>
            <li><strong>Editor Bahasa:</strong> Diana Putri, S.Hum.</li>
          </ul>
        </div>
      </div>

      <h3>STAF JURNALIS & TIM KREATIF</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div class="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold text-xs uppercase">Reporter Lapangan</h4>
          <ul class="text-xs text-gray-500 pl-4 space-y-1 mb-0">
            <li>Budi Santoso (Kec. Majalengka)</li>
            <li>Cecep Hermawan (Kec. Kadipaten)</li>
            <li>Linda Novita (Kec. Jatiwangi)</li>
            <li>Taufik Hidayat (Kec. Talaga)</li>
          </ul>
        </div>
        <div class="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold text-xs uppercase">Visual & Multimedia</h4>
          <ul class="text-xs text-gray-500 pl-4 space-y-1 mb-0">
            <li>Deni Ramdani (Jurnalis Foto)</li>
            <li>Gilang Ramadhan (Videografer)</li>
            <li>Anisa Fitri (Admin Media Sosial)</li>
          </ul>
        </div>
        <div class="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold text-xs uppercase">Teknologi & Infrastruktur</h4>
          <ul class="text-xs text-gray-500 pl-4 space-y-1 mb-0">
            <li>Fajar Nugraha, S.Kom. (Sysadmin)</li>
            <li>Andi Wijaya, B.Sc. (Developer)</li>
          </ul>
        </div>
      </div>

      <h3>ETIKA PROFESI JURNALIS</h3>
      <p class="text-sm">
        Dalam menjalankan tugas jurnalistik di lapangan, seluruh wartawan <strong>Majalengka Post</strong> wajib:
      </p>
      <ul>
        <li>Membawa kartu tanda pengenal pers resmi yang ditandatangani oleh Pemimpin Redaksi dan masih berlaku.</li>
        <li>Namanya wajib tercantum secara resmi di dalam kotak boks Redaksi di atas.</li>
        <li><strong>DILARANG KERAS</strong> meminta, mengisyaratkan, atau menerima imbalan dalam bentuk uang, barang, fasilitas, atau jasa apa pun dari narasumber (anti-gratifikasi pers).</li>
        <li>Menghormati hak privasi narasumber, menolak menyebarkan berita yang belum terverifikasi (hoaks), dan menghindari fitnah atau pencemaran nama baik.</li>
      </ul>
    `,
    lastUpdated: "2026-07-17T08:00:00Z"
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
      <p>Apakah Anda memiliki pertanyaan seputar pemberitaan, keluhan, hak jawab, hak koreksi, rilis pers, permohonan peliputan, atau penawaran kerja sama iklan? Tim kami siap melayani Anda secara profesional.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div class="bg-gray-50 dark:bg-gray-850 p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
          <h4 class="mt-0 font-bold text-red-600 dark:text-red-400 uppercase">Gedung Redaksi Utama</h4>
          <p class="text-sm leading-relaxed mb-0">
            <strong>PT Majalengka Post Media</strong><br/>
            Graha Pers Majalengka Post, Lantai 1 & 2<br/>
            Jalan K.H. Abdul Halim No. 120, Kelurahan Majalengka Kulon,<br/>
            Kecamatan Majalengka, Kabupaten Majalengka, Jawa Barat 45411<br/>
            <span class="text-xs text-gray-500"><em>(Belakang Alun-Alun Kabupaten Majalengka)</em></span>
          </p>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-850 p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
          <h4 class="mt-0 font-bold text-red-600 dark:text-red-400 uppercase">Saluran Komunikasi</h4>
          <p class="text-sm mb-0">✉️ <strong>Surel Redaksi:</strong> redaksi@majalengkapost.web.id</p>
          <p class="text-sm mb-0">✉️ <strong>Surel Bisnis & Iklan:</strong> iklan@majalengkapost.web.id</p>
          <p class="text-sm mb-0">📞 <strong>Telepon Kantor:</strong> (0233) 281450</p>
          <p class="text-sm mb-0">💬 <strong>WhatsApp Redaksi:</strong> +62 811-2345-6789</p>
        </div>
      </div>

      <h3>HAK JAWAB & MEKANISME KOREKSI</h3>
      <p>Majalengka Post sangat menjunjung tinggi Undang-Undang Nomor 40 Tahun 1999 tentang Pers serta Kode Etik Jurnalistik. Apabila terjadi kekeliruan dalam penulisan nama, jabatan, fakta, atau data lain dalam berita kami, pembaca berhak mengajukan Hak Jawab dan Hak Koreksi secara resmi:</p>
      <ol>
        <li>Kirimkan email ke alamat <strong>redaksi@majalengkapost.web.id</strong> dengan subjek <strong>"HAK JAWAB / KOREKSI BERITA - [Judul Berita]"</strong>.</li>
        <li>Lampirkan link/tautan berita asli yang bermasalah.</li>
        <li>Tuliskan secara objektif poin-poin yang keliru beserta bukti fakta pembanding atau klarifikasi yang sah.</li>
        <li>Sertakan kartu identitas resmi pelapor (KTP / SIM).</li>
      </ol>
      <p class="text-xs text-gray-500"><em>*Redaksi akan memverifikasi dan wajib menerbitkan klarifikasi/ralat berita dalam waktu paling lambat 1x24 jam demi keadilan informasi siber.</em></p>
    `,
    lastUpdated: "2026-07-17T08:00:00Z"
  },
  {
    id: "iklan",
    title: "Tarif Pemasangan Iklan",
    content: `
      <h2>Media Kit & Tarif Pemasangan Iklan Resmi 2026</h2>
      <p>Maksimalkan jangkauan bisnis, instansi pemerintah, partai politik, hingga UMKM Anda melalui portal media terpercaya <strong>Majalengka Post</strong>. Dengan statistik lalu lintas yang terus bertumbuh pesat di wilayah Ciayumajakuning (Cirebon, Indramayu, Majalengka, Kuningan) dan Jawa Barat, kampanye promosi Anda akan tersalurkan secara optimal kepada segmen audiens yang tepat.</p>

      <h3>MENGAPA BERIKLAN DI MAJALENGKA POST?</h3>
      <ul>
        <li><strong>Audiens Lokal Tertarget:</strong> Mayoritas pembaca kami merupakan masyarakat aktif, profesional, pelaku usaha, akademisi, dan pengambil kebijakan di Jawa Barat.</li>
        <li><strong>Kepercayaan Tinggi (High Credibility):</strong> Berita kami yang independen dan berimbang membangun kepercayaan pembaca yang kuat terhadap segala informasi yang kami rilis, termasuk iklan produk Anda.</li>
        <li><strong>Optimasi SEO Cepat:</strong> Iklan advertorial yang dipublikasikan di portal kami terindeks dengan cepat di Google Search karena reputasi otoritas domain situs yang baik.</li>
      </ul>

      <h3>DAFTAR TARIF SPASI IKLAN BANNER (DISPLAY ADS)</h3>
      <div class="overflow-x-auto my-6">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-gray-150 dark:bg-gray-800 text-left">
              <th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Posisi Spasi Banner</th>
              <th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Dimensi (Pixel)</th>
              <th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Tarif / Minggu</th>
              <th class="p-3 border border-gray-200 dark:border-gray-700 font-bold">Tarif / Bulan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Header Premium Banner (Top Page)</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">728 x 90</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700">Rp 1.500.000</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 5.000.000</td>
            </tr>
            <tr class="bg-gray-50/50 dark:bg-gray-850/20">
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Sidebar Sticky Rectangle Banner</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">300 x 250</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700">Rp 800.000</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 2.800.000</td>
            </tr>
            <tr>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">In-Article Center Banner (Tengah Berita)</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">640 x 100</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700">Rp 1.000.000</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 3.500.000</td>
            </tr>
            <tr class="bg-gray-50/50 dark:bg-gray-850/20">
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-medium">Pop-up Interstitial Ads (Sambut Pembaca)</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-mono">600 x 400</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700">Rp 2.500.000</td>
              <td class="p-3 border border-gray-200 dark:border-gray-700 font-bold text-red-600 dark:text-red-400">Rp 8.500.000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>KONTEN SPONSOR (ADVERTORIAL / SPONSORED ARTICLE)</h3>
      <p>Bagi Anda yang memerlukan promosi mendalam seperti pengenalan produk, profil perusahaan (company profile), sosialisasi kebijakan instansi pemerintah, atau laporan acara, kami menyediakan slot penulisan artikel sponsor eksklusif:</p>
      <ul>
        <li><strong>Paket Advertorial Mandiri (Naskah Siap Pakai):</strong> Rp 1.500.000 per penerbitan (Artikel permanen, maksimal 3 link keluar, 5 foto pendukung, dibagikan ke seluruh akun medsos resmi kami).</li>
        <li><strong>Paket Advertorial Eksklusif (Liputan Jurnalis):</strong> Rp 2.500.000 per liputan (Tim reporter dan fotografer kami akan berkunjung langsung ke lokasi Anda seputar Majalengka untuk liputan eksklusif dan pembuatan konten berita berkualitas).</li>
      </ul>

      <h3>HUBUNGI TIM PEMASARAN KAMI</h3>
      <p>Hubungi bagian marketing untuk konsultasi format kampanye, paket kustomisasi diskon jangka panjang, atau pengiriman dokumen legalitas kerja sama:</p>
      <div class="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 text-xs sm:text-sm font-semibold space-y-2 mt-2">
        <p>✉️ <strong>Alamat Surel Marketing:</strong> iklan@majalengkapost.web.id</p>
        <p>📞 <strong>Hotline WhatsApp Marketing:</strong> +62 811-9876-5432 (Fast Response)</p>
        <p>🕒 <strong>Jam Kerja Layanan:</strong> Senin - Sabtu, 08:00 - 17:00 WIB</p>
      </div>
    `,
    lastUpdated: "2026-07-17T08:00:00Z"
  },
  {
    id: "pedoman",
    title: "Pedoman Media Siber",
    content: `
      <h2>Pedoman Pemberitaan Media Siber</h2>
      <p>Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi manusia yang dilindungi Pancasila, Undang-Undang Dasar 1945, dan Deklarasi Universal Hak Asasi Manusia PBB. Kehadiran media siber di Indonesia juga merupakan bagian dari kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers.</p>
      <p>Media siber memiliki karakter khusus sehingga memerlukan pedoman agar pengelolaannya dapat dilaksanakan secara profesional, memenuhi fungsi, hak, dan kewajibannya sesuai Undang-Undang Nomor 40 Tahun 1999 tentang Pers dan Kode Etik Jurnalistik. Untuk itu Dewan Pers bersama organisasi pers, pengelola media siber, dan masyarakat menyusun Pedoman Pemberitaan Media Siber sebagai berikut:</p>

      <h3>1. Ruang Lingkup</h3>
      <ul>
        <li><strong>Media Siber</strong> adalah segala bentuk media yang menggunakan wahana siber dan melaksanakan kegiatan jurnalistik, serta memenuhi persyaratan Undang-Undang Pers dan Standar Perusahaan Pers yang ditetapkan Dewan Pers.</li>
        <li><strong>Isi Buatan Pengguna (User Generated Content)</strong> adalah segala isi yang dibuat dan atau diunggah oleh pengguna media siber, antara lain berupa komentar, opini, foto, atau video.</li>
      </ul>

      <h3>2. Verifikasi dan Keberimbangan Berita</h3>
      <ul>
        <li>Pada prinsipnya setiap berita harus melalui proses verifikasi terlebih dahulu sebelum dipublikasikan.</li>
        <li>Berita yang dapat merugikan pihak lain memerlukan verifikasi pada kesempatan pertama guna memenuhi prinsip keberimbangan dan keadilan.</li>
        <li>Jika verifikasi belum dimungkinkan, berita dapat dipublikasikan dengan syarat:
          <ul>
            <li>Berita mengandung kepentingan publik yang mendesak.</li>
            <li>Sumber informasi pertama adalah sumber yang jelas kredibilitasnya dan tepercaya.</li>
            <li>Subjek berita yang harus dikonfirmasi belum berhasil dihubungi atau tidak dapat dikonfirmasi.</li>
            <li>Diberikan penjelasan di dalam tubuh berita bahwa berita tersebut masih memerlukan verifikasi lebih lanjut yang sedang diupayakan dalam waktu secepatnya.</li>
          </ul>
        </li>
      </ul>

      <h3>3. Isi Buatan Pengguna (User Generated Content/UGC)</h3>
      <p>Media siber wajib mencantumkan syarat dan ketentuan mengenai Isi Buatan Pengguna yang tidak bertentangan dengan UU Pers dan Kode Etik Jurnalistik. Pengguna bertanggung jawab penuh atas konten yang diunggahnya, namun media siber wajib melakukan moderasi dan segera menghapus isi yang dilaporkan melanggar ketentuan hukum atau etika dalam waktu selambat-lambatnya 2 x 24 jam.</p>

      <h3>4. Ralat, Koreksi, dan Hak Jawab</h3>
      <ul>
        <li>Ralat, koreksi, dan hak jawab mengacu pada Undang-Undang Pers, Kode Etik Jurnalistik, dan Pedoman Hak Jawab yang ditetapkan Dewan Pers.</li>
        <li>Ralat, koreksi dan atau hak jawab wajib ditautkan (linked) pada berita yang diralat, dikoreksi atau yang diberi hak jawab.</li>
        <li>Di setiap berita yang diralat, dikoreksi, atau diberi hak jawab wajib dicantumkan waktu pembaruan serta keterangan rincian materi yang diperbaiki.</li>
      </ul>

      <h3>5. Pencabutan Berita</h3>
      <p>Berita yang sudah dipublikasikan tidak dapat dicabut karena alasan penyensoran dari pihak luar redaksi, kecuali terkait masalah hak cipta, perlindungan masa depan anak (SARA/kesusilaan anak), atau atas rekomendasi resmi dari Dewan Pers.</p>
    `,
    lastUpdated: "2026-07-17T08:00:00Z"
  },
  {
    id: "kode-etik",
    title: "Kode Etik Jurnalistik",
    content: `
      <h2>Kode Etik Jurnalistik (KEJ) Dewan Pers</h2>
      <p>Kemerdekaan pers adalah sarana masyarakat untuk memperoleh informasi dan memenuhi kebutuhan berkomunikasi. Dalam mewujudkan kemeradkaan pers itu, wartawan Indonesia menyadari adanya tanggung jawab sosial dan mematuhi aturan profesi yang tertuang dalam 11 Pasal Kode Etik Jurnalistik:</p>

      <div class="grid grid-cols-1 gap-4 my-6">
        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 1: Independen & Akurat</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia bersikap independen, menghasilkan berita yang akurat, berimbang, dan tidak beriktikad buruk.</p>
        </div>
        
        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 2: Cara Profesional</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia menempuh cara-cara yang profesional dalam melaksanakan tugas jurnalistik.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 3: Uji Informasi</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia selalu menguji informasi, memberitakan secara berimbang, tidak mencampurkan fakta dan opini yang menghakimi, serta menerapkan asas praduga tak bersalah.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 4: Hindari Kebohongan & SARA</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia tidak membuat berita bohong, fitnah, sadis, dan cabul.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 5: Lindungi Identitas Anak/Korban</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia tidak menyebutkan dan menyiarkan identitas korban kejahatan susila dan tidak menyebutkan identitas anak yang menjadi pelaku kejahatan.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 6: Anti-Suap & Integritas</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia tidak menyalahgunakan profesi dan tidak menerima suap.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 7: Hak Tolak</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia memiliki hak tolak untuk melindungi narasumber yang tidak bersedia diketahui identitas maupun keberadaannya, menghargai ketentuan embargo, informasi latar belakang, dan off the record sesuai dengan kesepakatan.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 8: Anti-Diskriminasi</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia tidak menulis atau menyiarkan berita berdasarkan prasangka atau diskriminasi terhadap seseorang atas dasar perbedaan suku, ras, warna kulit, agama, jenis kelamin, dan bahasa, serta tidak merendahkan martabat orang lemah, miskin, sakit, cacat jiwa atau cacat jasmani.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 9: Hormati Kehidupan Pribadi</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia menghormati hak narasumber tentang kehidupan pribadinya, kecuali untuk kepentingan publik.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 10: Ralat Segera</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia segera mencabut, meralat, dan memperbaiki berita yang keliru dan tidak akurat disertai dengan permintaan maaf kepada pembaca, pendengar, dan atau pemirsa.</p>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 text-red-600 dark:text-red-400 font-bold">Pasal 11: Hak Jawab & Koreksi</h4>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-0">Wartawan Indonesia melayani hak jawab dan hak koreksi secara proporsional.</p>
        </div>
      </div>
    `,
    lastUpdated: "2026-07-17T08:00:00Z"
  },
  {
    id: "hak-jawab",
    title: "Hak Jawab Pembaca",
    content: `
      <h2>Pedoman Hak Jawab Pembaca</h2>
      <p>Hak Jawab merupakan hak konstitusional yang dijamin oleh Undang-Undang Nomor 40 Tahun 1999 tentang Pers kepada setiap individu atau kelompok yang dirugikan oleh suatu pemberitaan. Di Majalengka Post, kami memperlakukan setiap aduan dan permohonan hak jawab dengan sangat serius demi menjamin keadilan informasi siber.</p>

      <h3>Definisi Hak Jawab</h3>
      <div class="p-4 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-850 rounded-r-xl my-4 text-sm italic">
        "Hak Jawab adalah hak seseorang atau sekelompok orang untuk memberikan tanggapan atau sanggahan terhadap pemberitaan berupa fakta yang merugikan nama baiknya." (Pasal 1 angka 11 UU Pers No. 40/1999)
      </div>

      <h3>Tujuan & Mekanisme Pengajuan</h3>
      <p>Tujuan Hak Jawab adalah untuk meluruskan kekeliruan fakta dalam berita, memberikan sudut pandang alternatif, serta memulihkan nama baik subjek berita secara proporsional. Berikut adalah langkah-langkah resmi mengajukan Hak Jawab:</p>
      
      <div class="my-6 space-y-4">
        <div class="flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-red-600 font-bold flex items-center justify-center shrink-0">1</div>
          <div>
            <h4 class="mt-0 mb-1 font-bold text-sm">Menyiapkan Dokumen Tertulis</h4>
            <p class="text-xs text-gray-500 mb-0">Tuliskan secara jelas bagian berita mana yang disanggah (seperti nama, kutipan, kronologis kejadian) disertai dengan alasan pembanding yang faktual dan sah.</p>
          </div>
        </div>
        <div class="flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-red-600 font-bold flex items-center justify-center shrink-0">2</div>
          <div>
            <h4 class="mt-0 mb-1 font-bold text-sm">Menyertakan Identitas Diri</h4>
            <p class="text-xs text-gray-500 mb-0">Lampirkan foto kartu identitas (KTP/SIM/Paspor) yang sah dari pihak yang mengajukan hak jawab. Jika mengatasnamakan institusi, sertakan surat kuasa resmi berkop surat organisasi.</p>
          </div>
        </div>
        <div class="flex gap-4 items-start">
          <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-red-600 font-bold flex items-center justify-center shrink-0">3</div>
          <div>
            <h4 class="mt-0 mb-1 font-bold text-sm">Kirim ke Surel Resmi Redaksi</h4>
            <p class="text-xs text-gray-500 mb-0">Kirimkan dokumen tersebut ke surel utama kami di <strong>redaksi@majalengkapost.web.id</strong> dengan subjek email <strong>[PENGAJUAN HAK JAWAB - JUDUL ARTIKEL]</strong>.</p>
          </div>
        </div>
      </div>

      <h3>Ketentuan Pemuatan Hak Jawab</h3>
      <ul>
        <li>Redaksi Majalengka Post akan memverifikasi materi hak jawab maksimal 24 jam setelah surel diterima.</li>
        <li>Apabila pengajuan dinyatakan valid dan sesuai fakta, hak jawab akan ditayangkan pada artikel berita yang bersangkutan (ditautkan langsung) serta diterbitkan sebagai artikel berita ralat baru secara gratis.</li>
        <li>Hak jawab dapat ditolak jika isinya mengandung unsur fitnah, pencemaran nama baik pihak lain yang tidak berdasar, melanggar SARA, atau dikirimkan lebih dari 2 bulan sejak berita orisinal ditayangkan.</li>
      </ul>
    `,
    lastUpdated: "2026-07-17T08:00:00Z"
  },
  {
    id: "koreksi",
    title: "Koreksi & Ralat Berita",
    content: `
      <h2>Kebijakan Koreksi & Ralat Berita</h2>
      <p>Majalengka Post selalu berupaya menyajikan berita yang akurat dan kredibel. Namun, sebagai lembaga pers manusiawi, kami menyadari adanya potensi terjadinya kekeliruan teknis, salah ketik, atau kesalahan interpretasi data di lapangan. Kebijakan ini mengatur bagaimana ralat, koreksi, dan pembaruan berita diproses secara transparan demi akuntabilitas publik.</p>

      <h3>Perbedaan Ralat dan Koreksi</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 font-bold text-red-600 dark:text-red-400">1. Ralat Berita (Technical Typo)</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-0">Merujuk pada perbaikan kesalahan kecil yang tidak mengubah substansi berita secara krusial, seperti salah ketik (typo), kesalahan penulisan gelar, nama tempat, atau keterangan gambar (caption).</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 class="mt-0 font-bold text-red-600 dark:text-red-400">2. Koreksi Berita (Substantive Error)</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-0">Merujuk pada perbaikan kesalahan fatal yang menyangkut fakta hukum, angka statistik, kutipan narasumber yang keliru, atau kronologi utama yang dapat merugikan reputasi narasumber atau publik.</p>
        </div>
      </div>

      <h3>Standard Operating Procedure (SOP) Perbaikan</h3>
      <p>Setiap berita yang mengalami perbaikan, baik berupa ralat maupun koreksi, akan melalui prosedur sebagai berikut:</p>
      <ol>
        <li><strong>Keterangan Pembaruan:</strong> Redaksi tidak akan menghapus artikel secara diam-diam. Di bagian atas atau bawah berita yang diperbaiki wajib dicantumkan kotak keterangan ralat (Catatan Redaksi).</li>
        <li><strong>Format Catatan Redaksi:</strong> Kotak tersebut bertuliskan contoh: <em>"Catatan Redaksi: Artikel ini telah mengalami ralat pada tanggal 17 Juli 2026 pukul 10:00 WIB untuk memperbaiki penulisan nama narasumber yang sebelumnya tertulis 'Andi' menjadi 'Andri'. Redaksi memohon maaf atas kekeliruan tersebut."</em></li>
        <li><strong>Sinkronisasi Multiplatform:</strong> Tim IT kami akan memastikan cache website segera dibersihkan agar versi terbaru langsung terbaca oleh mesin pencari Google dan media sosial pembaca.</li>
      </ol>

      <h3>Saluran Pengaduan Ralat Berita</h3>
      <p>Jika Anda menemukan kesalahan penulisan atau fakta dalam artikel kami, jangan ragu untuk melaporkannya kepada tim redaksi melalui:</p>
      <ul>
        <li><strong>Surel Pengaduan:</strong> redaksi@majalengkapost.web.id</li>
        <li><strong>Formulir Kontak:</strong> Hubungi kami di tab menu Kontak Resmi atau chat langsung ke WhatsApp Redaksi di +62 811-2345-6789.</li>
      </ul>
    `,
    lastUpdated: "2026-07-17T08:00:00Z"
  }
];

