import React from "react";
import { Helmet } from "react-helmet-async";
import { Shield, CheckCircle2, AlertTriangle, Scale, BookOpen } from "lucide-react";

export default function PedomanMediaSiber() {
  return (
    <div className="space-y-8 animate-fade-in text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>Pedoman Media Siber - Portal Berita Majalengka Post</title>
        <meta name="description" content="Pedoman Pemberitaan Media Siber resmi yang dijalankan oleh portal berita Majalengka Post, sesuai dengan ketentuan Dewan Pers Indonesia." />
        <link rel="canonical" href={`${window.location.origin}/#pedoman`} />
        <meta property="og:title" content="Pedoman Media Siber - Majalengka Post" />
        <meta property="og:description" content="Pedoman resmi pemberitaan media siber sesuai standar Dewan Pers demi kemerdekaan pers dan jurnalisme beretika." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/#pedoman`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Pedoman Media Siber - Majalengka Post" />
        <meta name="twitter:description" content="Pedoman Pemberitaan Media Siber Dewan Pers yang diterapkan oleh Majalengka Post." />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
        <a href="#" className="hover:text-red-600 transition-colors">Beranda</a>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-semibold">Pedoman Media Siber</span>
      </div>

      <div className="prose prose-slate max-w-none dark:prose-invert prose-red">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi manusia yang dilindungi oleh Pancasila, Undang-Undang Dasar 1945, dan Deklarasi Universal Hak Asasi Manusia PBB. Kehadiran media siber di Indonesia juga merupakan bagian dari sarana mewujudkan kemerdekaan tersebut.
        </p>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <strong>Majalengka Post</strong> (PT Majalengka Post Media) sebagai portal berita siber profesional berkomitmen penuh dalam menjalankan operasional jurnalisme yang kredibel, akuntabel, dan berimbang dengan berpedoman sepenuhnya pada <strong>Pedoman Pemberitaan Media Siber</strong> yang ditetapkan oleh Dewan Pers Republik Indonesia.
        </p>

        <div className="my-8 border-l-4 border-red-600 bg-red-50/50 dark:bg-red-950/10 p-4 rounded-r-xl">
          <p className="text-xs italic text-red-800 dark:text-red-300 font-medium m-0">
            "Seluruh pengelolaan, produksi, dan distribusi informasi di portal Majalengka Post tunduk sepenuhnya pada peraturan perundang-undangan pers nasional serta standar jurnalisme profesional Dewan Pers."
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Scale className="w-5 h-5 text-red-600" />
              1. Kemerdekaan Pers
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Kemerdekaan pers dilindungi undang-undang sebagai perwujudan kedaulatan rakyat. Majalengka Post bebas dari segala bentuk intimidasi, penyensoran, pemaksaan kehendak, atau campur tangan dari pihak luar redaksi dalam menentukan kebijakan keredaksian demi menyajikan berita yang objektif kepada publik.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <CheckCircle2 className="w-5 h-5 text-red-600" />
              2. Verifikasi dan Keberimbangan Berita
            </h3>
            <div className="space-y-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              <p>Pada prinsipnya setiap berita wajib melalui proses verifikasi yang ketat sebelum dipublikasikan. Berita yang dapat merugikan reputasi pihak atau lembaga lain memerlukan verifikasi guna memenuhi prinsip keadilan serta keberimbangan (cover both sides).</p>
              <p>Jika verifikasi fakta belum memungkinkan karena kendala waktu atau narasumber belum dapat dikonfirmasi, berita dapat ditayangkan dengan ketentuan:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Berita memuat materi dengan kepentingan publik yang mendesak.</li>
                <li>Sumber informasi pertama memiliki kredibilitas tinggi dan terpercaya.</li>
                <li>Subjek berita yang wajib dikonfirmasi telah diupayakan untuk dihubungi secara maksimal, namun belum berhasil dijangkau.</li>
                <li>Redaksi wajib mencantumkan keterangan di dalam tubuh berita bahwa materi tersebut masih memerlukan verifikasi lebih lanjut yang sedang diupayakan dalam waktu secepatnya.</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              3. Berita Ralat, Koreksi, dan Hak Jawab
            </h3>
            <div className="space-y-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              <p>Ralat, koreksi, dan hak jawab wajib dilakukan secara proporsional mengacu pada Undang-Undang Pers dan Pedoman Hak Jawab Dewan Pers.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Setiap ralat, koreksi, maupun hak jawab wajib ditautkan (hyperlinked) secara langsung pada berita orisinal yang mengalami pembaruan.</li>
                <li>Di bagian atas atau bawah berita yang diperbaiki, wajib ditambahkan "Catatan Redaksi" yang memaparkan secara transparan tanggal, waktu, serta materi yang diperbaiki atau diklarifikasi.</li>
                <li>Permintaan ralat, koreksi, dan hak jawab dari pembaca dilayani secara gratis tanpa biaya apa pun.</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              4. Pencabutan Berita
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Berita yang sudah dipublikasikan tidak boleh dicabut hanya karena adanya intervensi atau penyensoran dari pihak luar redaksi. Pencabutan berita hanya dapat dilakukan dalam kondisi sangat khusus, seperti melanggar hak cipta secara fatal, mengancam perlindungan masa depan anak di bawah umur, melanggar asas privasi korban kejahatan seksual, atau berdasarkan instruksi dan rekomendasi formal tertulis dari Dewan Pers.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <BookOpen className="w-5 h-5 text-red-600" />
              5. Isi Buatan Pengguna (User Generated Content)
            </h3>
            <div className="space-y-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              <p>Segala bentuk isi buatan pengguna seperti komentar pembaca, forum diskusi, opini, foto, maupun video merupakan tanggung jawab pribadi masing-masing pengguna. Namun, Majalengka Post berhak melakukan moderasi guna mencegah konten negatif melanggar etika publik:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dilarang mengunggah materi berbau SARA, ujaran kebencian, fitnah, kebohongan publik, atau pornografi.</li>
                <li>Redaksi berhak menghapus konten pengguna yang dilaporkan melanggar etika dalam waktu selambat-lambatnya 2 x 24 jam setelah laporan pengaduan diverifikasi.</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              6. Penggunaan Foto dan Video
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Penggunaan foto dan video dalam berita wajib mencantumkan sumber hak cipta atau kredit gambar secara transparan. Ilustrasi atau dokumentasi yang bukan berasal dari kejadian langsung wajib diberi label "Foto Ilustrasi" agar tidak membingungkan atau menyesatkan pembaca mengenai fakta di lapangan.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              7. Perlindungan Anak
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Majalengka Post memegang teguh prinsip perlindungan terhadap hak anak di bawah umur (di bawah usia 18 tahun dan belum menikah). Redaksi dilarang keras mempublikasikan nama, inisial, alamat rumah, sekolah, wajah, foto, atau detail informasi apa pun yang dapat mengungkap identitas anak yang menjadi pelaku, saksi, maupun korban tindak pidana kejahatan.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              8. Perlindungan Korban
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Identitas korban kejahatan asusila, kekerasan seksual, atau tindak diskriminasi sosial berat dilarang keras dipublikasikan. Penulisan nama korban wajib disamarkan dalam bentuk inisial atau samaran, dan lokasi kediaman atau keluarga korban tidak boleh digambarkan secara rinci guna menghindari stigmatisasi sosial.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              9. Sumber Anonim
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Penggunaan sumber tanpa nama (anonim) hanya diperbolehkan apabila narasumber tersebut berada dalam ancaman keselamatan fisik, ancaman kehilangan pekerjaan, atau risiko hukum berat lainnya. Keputusan penggunaan sumber anonim wajib dikoordinasikan secara ketat dan disetujui oleh Pemimpin Redaksi dengan tetap menguji validitas informasi secara mendalam.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              10. Larangan Berita Bohong
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Seluruh redaktur, wartawan, dan kontributor Majalengka Post dilarang keras merekayasa fakta atau sengaja menyebarkan berita bohong (hoaks), rumor tanpa konfirmasi, fitnah, gosip, desas-desus, atau informasi manipulatif yang dapat menimbulkan kepanikan sosial, perpecahan bangsa, atau pembodohan publik.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              11. Larangan Plagiarisme
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Wartawan Majalengka Post wajib menghormati karya intelektual sesama jurnalis dan institusi pers lainnya. Menyalin, menduplikasi, atau menjiplak tulisan, berita, maupun media tanpa menyebutkan sumber rujukan orisinal secara jelas dan eksplisit (plagiarisme) adalah pelanggaran berat etika jurnalistik yang tidak ditoleransi.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              12. Tanggung Jawab Redaksi
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Tanggung jawab atas semua konten berita yang dipublikasikan di Majalengka Post sepenuhnya berada di bawah kendali Pemimpin Redaksi. Hal-hal yang berada di luar keredaksian atau konten komersial seperti iklan banner, artikel advertorial berbayar, dan kerja sama sponsor diatur terpisah, namun tetap wajib mematuhi etika periklanan Indonesia.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              13. Penyelesaian Sengketa Pers
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Setiap perselisihan atau sengketa akibat pemuatan berita atau keberatan dari pembaca akan diselesaikan melalui mekanisme hak jawab, ralat, mediasi, atau merujuk langsung kepada Dewan Pers sesuai dengan koridor hukum Undang-Undang Nomor 40 Tahun 1999 tentang Pers secara damai dan profesional.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-150 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              14. Penutup
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-0">
              Pedoman Pemberitaan Media Siber ini disusun demi kepentingan publik, kemerdekaan pers, dan menjaga martabat jurnalisme siber yang bermutu di Indonesia. Majalengka Post berkomitmen penuh secara berkelanjutan untuk mengedukasi seluruh kru redaksi agar patuh terhadap pedoman ini dalam setiap derap langkah peliputan.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
