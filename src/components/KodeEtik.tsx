import React from "react";
import { Helmet } from "react-helmet-async";
import { Award, CheckCircle2, ShieldAlert, Heart, HeartOff, UserCheck, EyeOff, Scale } from "lucide-react";

export default function KodeEtik() {
  const articlesList = [
    {
      num: "Pasal 1",
      title: "Independen, Akurat, Berimbang & Tidak Beriktikad Buruk",
      description: "Wartawan Indonesia bersikap independen, menghasilkan berita yang akurat, berimbang, dan tidak beriktikad buruk.",
      points: [
        "Independen berarti memberitakan peristiwa atau fakta sesuai dengan suara hati nurani tanpa campur tangan, paksaan, dan intervensi dari pihak lain, termasuk pemilik perusahaan pers.",
        "Akurat berarti dipercaya benar sesuai keadaan objektif ketika peristiwa terjadi.",
        "Berimbang berarti semua pihak mendapat kesempatan setara secara proporsional.",
        "Tidak beriktikad buruk berarti tidak ada niat secara sengaja dan semata-mata untuk menimbulkan kerugian pihak lain."
      ]
    },
    {
      num: "Pasal 2",
      title: "Cara Profesional dalam Melaksanakan Tugas",
      description: "Wartawan Indonesia menempuh cara-cara yang profesional dalam melaksanakan tugas jurnalistik.",
      points: [
        "Menunjukkan identitas diri yang sah kepada narasumber.",
        "Menghormati hak privasi narasumber.",
        "Menghindari plagiarisme atau penjiplakan karya pers.",
        "Menghasilkan karya jurnalistik berdasarkan pengujian informasi secara langsung di lapangan."
      ]
    },
    {
      num: "Pasal 3",
      title: "Uji Informasi, Fakta vs Opini, Praduga Tak Bersalah",
      description: "Wartawan Indonesia selalu menguji informasi, memberitakan secara berimbang, tidak mencampurkan fakta dan opini yang menghakimi, serta menerapkan asas praduga tak bersalah.",
      points: [
        "Menguji informasi berarti melakukan check and recheck tentang kebenaran informasi itu.",
        "Tidak menghakimi berarti tidak membuat kesimpulan bersalah atau tendensius secara sepihak sebelum adanya putusan hukum tetap.",
        "Asas praduga tak bersalah berarti memperlakukan seseorang sebagai orang yang belum bersalah hingga diputus oleh pengadilan."
      ]
    },
    {
      num: "Pasal 4",
      title: "Larangan Berita Bohong, Fitnah, Sadis, dan Cabul",
      description: "Wartawan Indonesia tidak membuat berita bohong, fitnah, sadis, dan cabul.",
      points: [
        "Bohong berarti sesuatu yang sudah diketahui oleh wartawan sebagai hal yang tidak sesuai dengan fakta.",
        "Fitnah berarti tuduhan tanpa dasar yang merusak nama baik atau martabat seseorang.",
        "Sadis berarti kejam, tidak mengenal belas kasihan, atau menggambarkan kekerasan ekstrem secara vulgar.",
        "Cabul berarti penggambaran tingkah laku seksual secara erotis yang melanggar norma kesopanan publik."
      ]
    },
    {
      num: "Pasal 5",
      title: "Perlindungan Identitas Anak & Korban Asusila",
      description: "Wartawan Indonesia tidak menyebutkan dan menyiarkan identitas korban kejahatan susila dan tidak menyebutkan identitas anak yang menjadi pelaku kejahatan.",
      points: [
        "Identitas meliputi segala data, nama, alamat, foto, wajah, sekolah, dan nama orang tua yang dapat menuntun publik untuk melacak keberadaan korban atau anak pelaku pidana.",
        "Anak adalah seseorang yang berusia di bawah 18 tahun dan belum menikah."
      ]
    },
    {
      num: "Pasal 6",
      title: "Larangan Penyalahgunaan Profesi dan Menerima Suap",
      description: "Wartawan Indonesia tidak menyalahgunakan profesi dan tidak menerima suap.",
      points: [
        "Menyalahgunakan profesi berarti mengambil keuntungan pribadi, memeras narasumber, atau mengancam demi materi.",
        "Suap berarti segala bentuk pemberian berupa uang, barang, atau fasilitas dari pihak lain yang mempengaruhi independensi keredaksian."
      ]
    },
    {
      num: "Pasal 7",
      title: "Hak Tolak, Embargo, Off The Record, dan Latar Belakang",
      description: "Wartawan Indonesia memiliki hak tolak untuk melindungi narasumber yang tidak bersedia diketahui identitas maupun keberadaannya, menghargai ketentuan embargo, informasi latar belakang, dan off the record sesuai dengan kesepakatan.",
      points: [
        "Hak tolak digunakan untuk melindungi keselamatan narasumber.",
        "Embargo adalah penundaan pemuatan berita sesuai permintaan narasumber.",
        "Off the record adalah informasi yang tidak boleh dipublikasikan ke publik melainkan hanya sebagai latar belakang pemahaman wartawan."
      ]
    },
    {
      num: "Pasal 8",
      title: "Anti-Diskriminasi dan Menghormati Martabat Manusia",
      description: "Wartawan Indonesia tidak menulis atau menyiarkan berita berdasarkan prasangka atau diskriminasi terhadap seseorang atas dasar perbedaan suku, ras, warna kulit, agama, jenis kelamin, dan bahasa, serta tidak merendahkan martabat orang lemah, miskin, sakit, cacat jiwa atau cacat jasmani.",
      points: [
        "Prasangka adalah sikap menghakimi atau meremehkan sekelompok orang berdasarkan stereotip.",
        "Menolak segala bentuk tulisan yang bersifat rasis, misoginis, homophobic, atau diskriminatif terhadap kaum marjinal."
      ]
    },
    {
      num: "Pasal 9",
      title: "Menghormati Kehidupan Pribadi (Privasi)",
      description: "Wartawan Indonesia menghormati hak narasumber tentang kehidupan pribadinya, kecuali untuk kepentingan publik.",
      points: [
        "Kehidupan pribadi adalah hal-hal yang berkaitan dengan keluarga, hubungan perkawinan, kesehatan, dan hobi yang tidak berhubungan dengan jabatan publik atau tindak pidana hukum.",
        "Kepentingan publik membenarkan pembukaan privasi apabila terkait korupsi, penyalahgunaan kekuasaan, atau ancaman kesehatan masyarakat."
      ]
    },
    {
      num: "Pasal 10",
      title: "Segera Mencabut, Meralat, dan Meminta Maaf",
      description: "Wartawan Indonesia segera mencabut, meralat, dan memperbaiki berita yang keliru dan tidak akurat disertai dengan permintaan maaf kepada pembaca, pendengar, dan atau pemirsa.",
      points: [
        "Pencabutan dan ralat wajib dilakukan sesegera mungkin setelah kekeliruan diketahui tanpa menunda-nunda.",
        "Permintaan maaf yang tulus wajib dicantumkan dalam kotak catatan redaksi demi asas transparansi pers."
      ]
    },
    {
      num: "Pasal 11",
      title: "Melayani Hak Jawab dan Hak Koreksi secara Proporsional",
      description: "Wartawan Indonesia melayani hak jawab dan hak koreksi secara proporsional.",
      points: [
        "Hak jawab dan hak koreksi dipenuhi secepatnya sesuai kesepakatan dan standar Dewan Pers.",
        "Proporsional berarti penempatan berita ralat atau hak jawab diposisikan seimbang dengan berita awal yang dipermasalahkan."
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>Kode Etik Jurnalistik - Portal Berita Majalengka Post</title>
        <meta name="description" content="Kode Etik Jurnalistik Dewan Pers yang dipatuhi dan dijunjung tinggi oleh seluruh jurnalis, wartawan, dan redaksi Majalengka Post." />
        <link rel="canonical" href={`${window.location.origin}/#kode-etik`} />
        <meta property="og:title" content="Kode Etik Jurnalistik - Majalengka Post" />
        <meta property="og:description" content="Ketaatan wartawan Majalengka Post terhadap Kode Etik Jurnalistik demi jurnalisme yang independen, akurat, dan tepercaya." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/#kode-etik`} />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
        <a href="#" className="hover:text-red-600 transition-colors">Beranda</a>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-semibold">Kode Etik Jurnalistik</span>
      </div>

      <div className="prose prose-slate max-w-none dark:prose-invert prose-red">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Dalam mewujudkan kemerdekaan pers dan memenuhi hak publik untuk memperoleh informasi yang benar, seluruh wartawan, editor, jurnalis foto, videografer, dan jajaran redaksi <strong>Majalengka Post</strong> wajib menjunjung tinggi, memahami, dan mematuhi <strong>Kode Etik Jurnalistik (KEJ)</strong> yang ditetapkan oleh Dewan Pers Republik Indonesia.
        </p>

        <div className="my-6 p-4 bg-red-50 dark:bg-red-950/10 border-l-4 border-red-600 rounded-r-xl">
          <p className="text-xs font-bold text-red-900 dark:text-red-300 m-0">
            Sanksi Tegas Redaksi: Melanggar salah satu pasal Kode Etik Jurnalistik di bawah ini merupakan pelanggaran berat profesi yang dapat berujung pada pencabutan kartu pers jurnalis Majalengka Post dan pemutusan hubungan kemitraan kerja.
          </p>
        </div>

        {/* 11 Pasal List Layout */}
        <div className="space-y-6 mt-8">
          {articlesList.map((art, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900/40 border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <span className="inline-flex items-center justify-center px-3.5 py-1.5 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-black text-xs uppercase tracking-wider rounded-xl shrink-0 w-fit">
                  {art.num}
                </span>
                <div className="space-y-3 flex-1">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-0 mb-1 leading-tight">
                    {art.title}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed italic">
                    "{art.description}"
                  </p>
                  <div className="bg-gray-50 dark:bg-slate-950/40 p-4 rounded-xl border border-gray-100 dark:border-gray-850">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0 mb-2">Penjelasan & Aplikasi Lapangan:</h4>
                    <ul className="list-disc pl-4 text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                      {art.points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Remarks */}
        <div className="mt-8 pt-6 border-t border-gray-150 dark:border-gray-800 text-center space-y-4">
          <Award className="w-10 h-10 text-red-600 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white my-0">Penutup dan Komitmen</h3>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Kode Etik Jurnalistik ini adalah nafas utama pengabdian profesi jurnalis Majalengka Post. Melalui kepatuhan mutlak pada kode etik ini, kami menjaga marwah pers sebagai tiang keempat demokrasi yang senantiasa berpihak pada kebenaran fakta demi kemaslahatan masyarakat Majalengka dan bangsa Indonesia.
          </p>
        </div>
      </div>
    </div>
  );
}
