-- ============================================================================
-- FULL DATABASE SETUP for a fresh Supabase instance
-- Generated from supabase/migrations/*.sql (all 7 migrations, in order).
-- Paste this whole file into the SQL Editor of the new instance and run it.
--
-- PREREQUISITE — do this FIRST, before running this script:
--   In Supabase Studio → Authentication → Users → Add user, create the admin
--   login (email: audifirdi@gmail.com, set a password, auto-confirm). The
--   admin_users seed below looks that email up in auth.users; if the user
--   does not exist yet the seed silently inserts nothing, and you would have
--   to re-run the "insert into public.admin_users ..." statement afterwards.
--
-- Everything here is idempotent (create if not exists / on conflict do
-- nothing / drop policy if exists), so re-running the script is safe.
--
-- Creates:
--   * Tables: admin_users, translation_messages, blog_authors,
--     blog_categories, blog_tags, blog_posts, blog_post_tags,
--     blog_references, blog_post_views  (all with RLS enabled + policies)
--   * Functions: is_admin(), set_updated_at(), record_post_view(),
--     get_popular_posts()
--   * Storage bucket: blog-assets (public read, admin-only write)
--   * Data: full i18n translation catalog + blog author/category/tag seeds
-- ============================================================================


-- ============================================================================
-- SOURCE: 20260610090000_cms_translations.sql
-- ============================================================================

-- CMS for i18n translation messages.
--
-- Two tables:
--   * admin_users         — who is allowed to edit translations
--   * translation_messages — the editable message catalog (namespace/key/locale)
--
-- Security model (see Supabase RLS checklist):
--   * translation_messages is publicly readable (the marketing site renders it
--     for anonymous visitors) but only admins may write.
--   * admin_users is private: a signed-in user may read only their own row to
--     learn whether they are an admin. Membership is managed via SQL only.

-- ---------------------------------------------------------------------------
-- admin_users
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- A signed-in user can check whether they themselves are an admin.
drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self"
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policies: membership is only ever changed by trusted
-- SQL (migrations / dashboard), never by the Data API.

-- ---------------------------------------------------------------------------
-- is_admin() helper
-- ---------------------------------------------------------------------------
-- SECURITY INVOKER (the default): it runs with the caller's privileges and
-- respects RLS. Because the admin_users SELECT policy above lets a user see
-- their own row, this returns true only for genuine admins. No SECURITY
-- DEFINER is needed, so there is no RLS-bypass surface.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- translation_messages
-- ---------------------------------------------------------------------------
create table if not exists public.translation_messages (
  id         uuid primary key default gen_random_uuid(),
  namespace  text not null,
  key        text not null,
  locale     text not null check (locale in ('id', 'en')),
  value      text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  unique (namespace, key, locale)
);

alter table public.translation_messages enable row level security;

create index if not exists translation_messages_locale_idx
  on public.translation_messages (locale);

-- Keep updated_at fresh on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists translation_messages_set_updated_at on public.translation_messages;
create trigger translation_messages_set_updated_at
  before update on public.translation_messages
  for each row
  execute function public.set_updated_at();

-- Public read: the site renders translations for everyone.
drop policy if exists "translation_messages_select_public" on public.translation_messages;
create policy "translation_messages_select_public"
  on public.translation_messages
  for select
  to anon, authenticated
  using (true);

-- Writes are admin-only. UPDATE needs both USING and WITH CHECK so a row can
-- never be edited into a state that fails the admin check.
drop policy if exists "translation_messages_insert_admin" on public.translation_messages;
create policy "translation_messages_insert_admin"
  on public.translation_messages
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "translation_messages_update_admin" on public.translation_messages;
create policy "translation_messages_update_admin"
  on public.translation_messages
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "translation_messages_delete_admin" on public.translation_messages;
create policy "translation_messages_delete_admin"
  on public.translation_messages
  for delete
  to authenticated
  using (public.is_admin());

-- Explicit Data API grants (RLS still gates which rows are visible/editable).
grant select on public.translation_messages to anon, authenticated;
grant insert, update, delete on public.translation_messages to authenticated;
grant select on public.admin_users to authenticated;

-- ---------------------------------------------------------------------------
-- Seed the admin. The auth user must already exist (created in Supabase Auth).
-- ---------------------------------------------------------------------------
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'audifirdi@gmail.com'
on conflict (user_id) do nothing;


-- ============================================================================
-- SOURCE: 20260610090100_seed_translations.sql
-- ============================================================================

-- AUTO-GENERATED by scripts/generate-translations-seed.mjs — do not edit by hand.
-- Seeds public.translation_messages from messages/{id,en}.json.
-- Re-runnable: existing (namespace, key, locale) rows are kept as-is.

insert into public.translation_messages (namespace, key, locale, value) values
  ('Meta', 'title', 'id', 'SUME Group — Infrastruktur Mekanikal & Elektrikal untuk Fasilitas Mission-Critical'),
  ('Meta', 'description', 'id', 'SUME merancang, memasang, dan memelihara sistem kelistrikan, pendinginan, dan monitoring yang menjaga data center, properti komersial, dan fasilitas industri tetap beroperasi — tanpa gangguan.'),
  ('Meta', 'ogImageAlt', 'id', 'SUME Group — Infrastruktur Mekanikal & Elektrikal'),
  ('Header', 'getInTouch', 'id', 'Hubungi Kami'),
  ('Header', 'homeAria', 'id', 'Beranda SUME Group'),
  ('Header', 'openMenu', 'id', 'Buka menu navigasi'),
  ('Header', 'closeMenu', 'id', 'Tutup menu navigasi'),
  ('LocaleSwitcher', 'label', 'id', 'Bahasa'),
  ('LocaleSwitcher', 'id', 'id', 'Indonesia'),
  ('LocaleSwitcher', 'en', 'id', 'English'),
  ('Footer', 'tagline', 'id', 'Infrastruktur Mekanikal & Elektrikal untuk Fasilitas Mission-Critical.'),
  ('Footer', 'solutions', 'id', 'Solusi'),
  ('Footer', 'company', 'id', 'Perusahaan'),
  ('Footer', 'offices', 'id', 'Kantor'),
  ('Footer', 'contact', 'id', 'Kontak'),
  ('Footer', 'about', 'id', 'Tentang'),
  ('Footer', 'projects', 'id', 'Proyek'),
  ('Footer', 'privacy', 'id', 'Kebijakan Privasi'),
  ('Footer', 'terms', 'id', 'Ketentuan Layanan'),
  ('Footer', 'copyright', 'id', '© {year} {brand} · {legal}. Seluruh hak cipta dilindungi.'),
  ('Hero', 'exploreSolutions', 'id', 'Jelajahi Solusi Kami'),
  ('Hero', 'talkToTeam', 'id', 'Hubungi Tim Kami'),
  ('Hero', 'slideAria', 'id', 'Tampilkan slide {label}'),
  ('Hero', 'slide1Label', 'id', 'Kelistrikan'),
  ('Hero', 'slide1Title', 'id', 'Daya Kritis, Direkayasa untuk Uptime'),
  ('Hero', 'slide1Subtitle', 'id', 'Standby generation, fuel monitoring, dan solar — dibangun untuk fasilitas yang tidak boleh padam.'),
  ('Hero', 'slide2Label', 'id', 'Pendinginan'),
  ('Hero', 'slide2Title', 'id', 'Pendinginan yang Andal di Bawah Beban'),
  ('Hero', 'slide2Subtitle', 'id', 'Solusi HVAC dan chiller yang direkayasa untuk beban termal berdensitas tinggi secara terus-menerus.'),
  ('Hero', 'slide3Label', 'id', 'Monitoring'),
  ('Hero', 'slide3Title', 'id', 'Visibilitas Total atas Infrastruktur Kritis'),
  ('Hero', 'slide3Subtitle', 'id', 'Fuel monitoring, flow metering, dan surveillance dalam satu gambaran operasional.'),
  ('Hero', 'slide4Label', 'id', 'Terintegrasi'),
  ('Hero', 'slide4Title', 'id', 'Satu Mitra, Infrastruktur End-to-End'),
  ('Hero', 'slide4Subtitle', 'id', 'Dari desain, commissioning, hingga operasi — dihadirkan sebagai satu lingkup tanggung jawab.'),
  ('Home', 'tagline', 'id', '<strong>Infrastruktur mekanikal & elektrikal</strong> untuk fasilitas mission-critical.'),
  ('Home', 'description', 'id', 'SUME merancang, memasang, dan memelihara sistem kelistrikan, pendinginan, dan monitoring yang menjaga data center, properti komersial, dan fasilitas industri tetap beroperasi — tanpa gangguan.'),
  ('Home', 'exploreSolutions', 'id', 'Solusi Kami'),
  ('Home', 'solutionsHeading', 'id', 'Dirancang untuk lingkungan yang tidak menoleransi downtime.'),
  ('Home', 'solutionsBody', 'id', 'Lingkup mekanikal & elektrikal yang lengkap — dirancang, dikerjakan, dan dipelihara oleh satu mitra yang bertanggung jawab penuh.'),
  ('Home', 'exploreSolution', 'id', 'Lihat solusi'),
  ('Home', 'dataCenterEyebrow', 'id', 'Infrastruktur Data Center'),
  ('Home', 'dataCenterHeading', 'id', 'Dirancang untuk tuntutan data center.'),
  ('Home', 'dataCenterBody', 'id', 'Kelistrikan, pendinginan, monitoring, dan keamanan — direkayasa untuk operasi 24/7 tanpa toleransi terhadap downtime.'),
  ('Home', 'dataCenterCta', 'id', 'Lihat Kapabilitas Data Center Kami'),
  ('Home', 'whyEyebrow', 'id', 'Mengapa SUME Group'),
  ('Home', 'whyHeading', 'id', 'Empat alasan klien enterprise memilih satu mitra yang bertanggung jawab penuh.'),
  ('Home', 'trustedBy', 'id', 'Dipercaya oleh Organisasi Terkemuka'),
  ('Home', 'closingHeading', 'id', 'Mari wujudkan infrastruktur Anda.'),
  ('Home', 'closingBody', 'id', 'Dari sistem kelistrikan mission-critical hingga lingkungan data center, kami membangun infrastruktur yang dirancang untuk performa, keandalan, dan uptime.'),
  ('Home', 'closingCta', 'id', 'Minta Konsultasi'),
  ('Home', 'stat1Value', 'id', '2014'),
  ('Home', 'stat1Label', 'id', 'Tahun Beroperasi'),
  ('Home', 'stat2Value', 'id', '185'),
  ('Home', 'stat2Label', 'id', 'Proyek Diselesaikan'),
  ('Home', 'stat3Value', 'id', '3'),
  ('Home', 'stat3Label', 'id', 'Negara'),
  ('Home', 'stat4Value', 'id', 'ISO'),
  ('Home', 'stat4Label', 'id', 'Tersertifikasi & Terakreditasi'),
  ('Home', 'solution1Title', 'id', 'Kelistrikan & Energi'),
  ('Home', 'solution1Description', 'id', 'Genset · solar PV · fuel monitoring · pemeliharaan mesin.'),
  ('Home', 'solution2Title', 'id', 'Precision Cooling'),
  ('Home', 'solution2Description', 'id', 'Chiller · VRF · optimisasi · Cooling-as-a-Service.'),
  ('Home', 'solution3Title', 'id', 'Monitoring & Keamanan'),
  ('Home', 'solution3Description', 'id', 'Flow metering · CCTV · smart control.'),
  ('Home', 'solution4Title', 'id', 'M&E Terintegrasi'),
  ('Home', 'solution4Description', 'id', 'Desain · pasang · commissioning · pemeliharaan.'),
  ('Home', 'why1Title', 'id', 'Rekam Jejak Terbukti'),
  ('Home', 'why1Description', 'id', '+ proyek di fasilitas komersial, industri & mission-critical.'),
  ('Home', 'why2Title', 'id', 'Tersertifikasi & Terakreditasi'),
  ('Home', 'why2Description', 'id', 'Standar mutu, lingkungan & keselamatan ISO 9001 / 14001 / 45001.'),
  ('Home', 'why3Title', 'id', 'Klien Ternama'),
  ('Home', 'why3Description', 'id', 'Samsung · Yonex · Santika · RE/MAX · Mega Bekasi Hypermall.'),
  ('Home', 'why4Title', 'id', 'Tanggung Jawab End-to-End'),
  ('Home', 'why4Description', 'id', 'Satu mitra untuk desain, pengerjaan, dan pemeliharaan seumur pakai.'),
  ('Projects', 'all', 'id', 'Semua'),
  ('Projects', 'empty', 'id', 'Tidak ada proyek pada kategori ini.'),
  ('Projects', 'learnMore', 'id', 'Selengkapnya'),
  ('Projects', 'noImage', 'id', 'Tidak ada gambar detail untuk proyek ini.'),
  ('Projects', 'viewDetailAria', 'id', 'Lihat detail proyek {title}'),
  ('Projects', 'closeAria', 'id', 'Tutup pratinjau proyek'),
  ('Projects', 'categoryCommercial', 'id', 'Komersial'),
  ('Projects', 'categoryIndustrial', 'id', 'Industri'),
  ('Projects', 'categoryHospitality', 'id', 'Perhotelan'),
  ('Projects', 'categoryGovernment', 'id', 'Pemerintahan'),
  ('Projects', 'categoryRetail', 'id', 'Ritel'),
  ('Projects', 'categoryTechnology', 'id', 'Teknologi'),
  ('ConsultationForm', 'fullName', 'id', 'Nama Lengkap'),
  ('ConsultationForm', 'fullNamePlaceholder', 'id', 'Nama lengkap Anda'),
  ('ConsultationForm', 'company', 'id', 'Perusahaan'),
  ('ConsultationForm', 'companyPlaceholder', 'id', 'Perusahaan Anda'),
  ('ConsultationForm', 'email', 'id', 'Alamat Email'),
  ('ConsultationForm', 'emailPlaceholder', 'id', 'anda@perusahaan.com'),
  ('ConsultationForm', 'facilityType', 'id', 'Jenis Fasilitas'),
  ('ConsultationForm', 'facilitySelect', 'id', 'Pilih jenis fasilitas'),
  ('ConsultationForm', 'facilityDataCenter', 'id', 'Data Center'),
  ('ConsultationForm', 'facilityCommercial', 'id', 'Gedung Komersial'),
  ('ConsultationForm', 'facilityIndustrial', 'id', 'Fasilitas Industri'),
  ('ConsultationForm', 'facilityOther', 'id', 'Lainnya'),
  ('ConsultationForm', 'message', 'id', 'Pesan'),
  ('ConsultationForm', 'messagePlaceholder', 'id', 'Jelaskan kebutuhan Anda — lingkup, lokasi, jadwal…'),
  ('ConsultationForm', 'agreement', 'id', 'Dengan mengirim formulir ini, Anda menyetujui <link>Kebijakan Privasi</link> kami. Kami tidak akan membagikan informasi Anda kepada pihak ketiga.'),
  ('ConsultationForm', 'success', 'id', 'Terima kasih — kami akan menghubungi Anda dalam satu hari kerja.'),
  ('ConsultationForm', 'sending', 'id', 'Mengirim…'),
  ('ConsultationForm', 'submit', 'id', 'Minta Konsultasi'),
  ('ConsultationForm', 'facilityPrefix', 'id', 'Jenis fasilitas'),
  ('ConsultationForm', 'errorFallback', 'id', 'Gagal mengirim pesan. Silakan coba lagi.'),
  ('ContactForm', 'fullName', 'id', 'Nama Lengkap'),
  ('ContactForm', 'fullNamePlaceholder', 'id', 'Budi Santoso'),
  ('ContactForm', 'email', 'id', 'Alamat Email'),
  ('ContactForm', 'emailPlaceholder', 'id', 'budi@perusahaan.com'),
  ('ContactForm', 'phone', 'id', 'Nomor Telepon'),
  ('ContactForm', 'phonePlaceholder', 'id', '+62 ...'),
  ('ContactForm', 'company', 'id', 'Perusahaan'),
  ('ContactForm', 'companyPlaceholder', 'id', 'Organisasi Anda'),
  ('ContactForm', 'message', 'id', 'Pesan'),
  ('ContactForm', 'messagePlaceholder', 'id', 'Apa yang bisa kami bantu?'),
  ('ContactForm', 'sending', 'id', 'Mengirim...'),
  ('ContactForm', 'sent', 'id', 'Pesan Terkirim'),
  ('ContactForm', 'send', 'id', 'Kirim Pertanyaan'),
  ('ContactForm', 'errorFallback', 'id', 'Gagal mengirim pesan. Silakan coba lagi.'),
  ('AboutPage', 'metaTitle', 'id', 'Tentang'),
  ('AboutPage', 'metaDescription', 'id', 'Satu dekade membangun yang tidak boleh gagal. PT. SUME (Solusi Utama Mekanikal Elektrikal) menghadirkan sistem kelistrikan, pendinginan, monitoring, dan keamanan terintegrasi untuk fasilitas yang beroperasi sepanjang waktu.'),
  ('AboutPage', 'headerEyebrow', 'id', 'Tentang SUME Group'),
  ('AboutPage', 'headerTitle', 'id', 'Satu Dekade Membangun yang Tidak Boleh Gagal.'),
  ('AboutPage', 'headerDescription', 'id', 'Sistem di balik sebuah bangunan — kelistrikan, pendinginan, dan kontrolnya — layak mendapat ketelitian yang sama dengan struktur bangunannya.'),
  ('AboutPage', 'whoWeAreEyebrow', 'id', 'Siapa Kami'),
  ('AboutPage', 'whoWeAreHeading', 'id', 'Merekayasa infrastruktur yang tidak boleh gagal.'),
  ('AboutPage', 'whoWeAreBody', 'id', '<p>PT. SUME (Solusi Utama Mekanikal Elektrikal) bermula sebagai kontraktor mekanikal dan elektrikal dengan satu keyakinan sederhana: bahwa sistem di balik sebuah bangunan — kelistrikan, pendinginan, dan kontrolnya — layak mendapat ketelitian yang sama dengan struktur bangunannya.</p><p>Selama <strong>10+</strong> tahun, keyakinan itu tumbuh menjadi kapabilitas M&E yang menyeluruh. Yang bermula dari instalasi gedung komersial kini berkembang ke infrastruktur kritis — di mana SUME menghadirkan <strong>sistem kelistrikan, pendinginan, monitoring, dan keamanan terintegrasi</strong> untuk fasilitas yang beroperasi sepanjang waktu.</p><p>Kini, SUME melayani klien di seluruh Indonesia dan kawasan, didukung kantor di Singapura dan Myanmar, serta ekosistem kapabilitas spesialis yang mencakup standby power, energi surya, precision cooling, dan monitoring cerdas.</p>'),
  ('AboutPage', 'journeyEyebrow', 'id', 'Perjalanan Kami'),
  ('AboutPage', 'journeyHeading', 'id', 'Dari kontraktor M&E menjadi mitra infrastruktur kritis.'),
  ('AboutPage', 'journeyNote', 'id', 'Tanggal tonggak waktu masih akan dikonfirmasi sebelum peluncuran.'),
  ('AboutPage', 'milestone1Event', 'id', 'PT. SUME didirikan sebagai kontraktor mekanikal & elektrikal.'),
  ('AboutPage', 'milestone2Event', 'id', 'Pemeliharaan Proyek Megabekasi Hypermall dan Broad Chiller.'),
  ('AboutPage', 'milestone3Event', 'id', 'Berkembang ke pembangkitan daya dan sistem standby.'),
  ('AboutPage', 'milestone4Event', 'id', 'Membuka kehadiran regional (Singapura, Myanmar).'),
  ('AboutPage', 'milestone5Event', 'id', 'Menambah kapabilitas solar PV dan Cooling-as-a-Service.'),
  ('AboutPage', 'milestone6Event', 'id', 'Memasuki segmen data center / mission-critical.'),
  ('AboutPage', 'apartEyebrow', 'id', 'Yang Membedakan Kami'),
  ('AboutPage', 'apartHeading', 'id', 'Mengapa klien enterprise memilih SUME.'),
  ('AboutPage', 'apart1Title', 'id', 'Tanggung Jawab End-to-End'),
  ('AboutPage', 'apart1Body', 'id', 'Satu mitra untuk desain, pengadaan, instalasi, commissioning, dan pemeliharaan seumur pakai — tanpa celah koordinasi.'),
  ('AboutPage', 'apart2Title', 'id', 'Tersertifikasi & Terakreditasi'),
  ('AboutPage', 'apart2Body', 'id', 'Standar mutu, lingkungan, dan keselamatan ISO 9001 / 14001 / 45001, dengan akreditasi EDGE dan BNSP.'),
  ('AboutPage', 'apart3Title', 'id', 'Klien Ternama'),
  ('AboutPage', 'apart3Body', 'id', 'Dipercaya oleh Samsung, Yonex, Santika, RE/MAX, dan Mega Bekasi Hypermall, serta banyak lainnya di kawasan ini.'),
  ('AboutPage', 'apart4Title', 'id', 'Jangkauan Regional'),
  ('AboutPage', 'apart4Body', 'id', 'Berkantor pusat di Jakarta dengan kantor di Singapura dan Myanmar — dihadirkan dan didukung secara lokal.'),
  ('AboutPage', 'certsEyebrow', 'id', 'Sertifikasi & Akreditasi'),
  ('AboutPage', 'certsHeading', 'id', 'Standar yang terbukti, bukan sekadar klaim.'),
  ('AboutPage', 'certsBody', 'id', 'Sistem manajemen mutu, lingkungan, dan keselamatan yang mendukung setiap proyek yang kami kerjakan.'),
  ('AboutPage', 'cert1Name', 'id', 'Manajemen Mutu'),
  ('AboutPage', 'cert1Detail', 'id', 'ISO 9001'),
  ('AboutPage', 'cert2Name', 'id', 'Manajemen Lingkungan'),
  ('AboutPage', 'cert2Detail', 'id', 'ISO 14001'),
  ('AboutPage', 'cert3Name', 'id', 'Keselamatan & Kesehatan Kerja'),
  ('AboutPage', 'cert3Detail', 'id', 'ISO 45001'),
  ('AboutPage', 'cert4Name', 'id', 'Kepatuhan Produk Internasional'),
  ('AboutPage', 'cert4Detail', 'id', 'CE / EAC / Sertifikasi Industri'),
  ('AboutPage', 'ctaTitle', 'id', 'Mari wujudkan infrastruktur Anda.'),
  ('AboutPage', 'ctaBody', 'id', 'Bicarakan dengan tim kami tentang kebutuhan kelistrikan, pendinginan, monitoring, atau lingkup M&E lengkap Anda.'),
  ('AboutPage', 'ctaButton', 'id', 'Hubungi Kami'),
  ('SolutionsPage', 'metaTitle', 'id', 'Solusi'),
  ('SolutionsPage', 'metaDescription', 'id', 'Lingkup mekanikal & elektrikal lengkap — kelistrikan & energi, precision cooling, monitoring & keamanan, serta kontrak M&E terintegrasi untuk fasilitas mission-critical.'),
  ('SolutionsPage', 'headerEyebrow', 'id', 'Solusi'),
  ('SolutionsPage', 'headerTitle', 'id', 'Lingkup Mekanikal & Elektrikal yang Lengkap.'),
  ('SolutionsPage', 'headerDescription', 'id', 'Direkayasa untuk lingkungan yang tidak menoleransi downtime — didukung jaringan kapabilitas spesialis yang diandalkan fasilitas mission-critical.'),
  ('SolutionsPage', 'pillar1Tagnum', 'id', '01 — Kelistrikan'),
  ('SolutionsPage', 'pillar1Eyebrow', 'id', 'Kelistrikan & Energi'),
  ('SolutionsPage', 'pillar1Title', 'id', 'Tulang punggung setiap fasilitas kritis.'),
  ('SolutionsPage', 'pillar1Lead', 'id', 'Daya utama dan standby yang direkayasa untuk operasi berkelanjutan, dengan monitoring dan pemeliharaan yang menjaga keandalannya sepanjang masa pakai.'),
  ('SolutionsPage', 'pillar1Cap1Title', 'id', 'Genset Standby & Prime'),
  ('SolutionsPage', 'pillar1Cap1Body', 'id', 'Genset diesel & gas Yuchai; konfigurasi containerized dan site-built, disesuaikan dengan beban fasilitas.'),
  ('SolutionsPage', 'pillar1Cap2Title', 'id', 'Sistem Solar PV'),
  ('SolutionsPage', 'pillar1Cap2Body', 'id', 'Desain dan instalasi rooftop dan ground-mount, dihadirkan bersama Powerbrain; 50+ MWp terpasang.'),
  ('SolutionsPage', 'pillar1Cap3Title', 'id', 'Sistem Fuel Monitoring'),
  ('SolutionsPage', 'pillar1Cap3Body', 'id', 'Deteksi level, konsumsi, dan pencurian bahan bakar secara real-time, didukung instrumentasi Ramus.'),
  ('SolutionsPage', 'pillar1Cap4Title', 'id', 'Pemeliharaan & Overhaul Mesin'),
  ('SolutionsPage', 'pillar1Cap4Body', 'id', 'Suku cadang resmi dan overhaul untuk mesin darat dan marine IHI / Niigata melalui Ramoco.'),
  ('SolutionsPage', 'pillar2Tagnum', 'id', '02 — Pendinginan'),
  ('SolutionsPage', 'pillar2Eyebrow', 'id', 'Precision Cooling & HVAC'),
  ('SolutionsPage', 'pillar2Title', 'id', 'Pendinginan yang andal di bawah beban.'),
  ('SolutionsPage', 'pillar2Lead', 'id', 'Pendinginan menyerap sebagian besar listrik sebuah fasilitas. Salah menanganinya berarti biaya membengkak setiap bulan.'),
  ('SolutionsPage', 'pillar2GroupAirTitle', 'id', 'Pendinginan Udara'),
  ('SolutionsPage', 'pillar2Cap1Title', 'id', 'Chiller Plant & Sistem VRF'),
  ('SolutionsPage', 'pillar2Cap1Body', 'id', 'Midea, Broad, dan Hisense untuk beban pendinginan komersial dan berdensitas tinggi.'),
  ('SolutionsPage', 'pillar2Cap2Title', 'id', 'Optimisasi & Retrofit Chiller'),
  ('SolutionsPage', 'pillar2Cap2Body', 'id', 'Otomasi plant, retrofit VSD, rewinding pompa. Pada satu plant 3×550 TR, kami menaikkan efisiensi dari 1,10 menjadi 0,77 kW/TR.'),
  ('SolutionsPage', 'pillar2Cap3Title', 'id', 'Cooling-as-a-Service'),
  ('SolutionsPage', 'pillar2Cap3Body', 'id', 'Klien tidak membayar di muka. Powerbrain mendanai, memasang, dan mengoperasikan sistem pendingin; kinerjanya dijamin secara kontraktual dan didukung performance bond setara asuransi, diukur terhadap standar IPMVP.'),
  ('SolutionsPage', 'pillar2GroupLiquidTitle', 'id', 'Pendinginan Cair (Data Center & Komputasi Berdensitas Tinggi)'),
  ('SolutionsPage', 'pillar2Cap4Title', 'id', 'Maglev Active CDU'),
  ('SolutionsPage', 'pillar2Cap4Body', 'id', 'Chiller maglev dan CDU Midea yang terintegrasi dalam satu sasis. Menghemat lebih dari 50% ruang lantai. PUE di bawah 1,2.'),
  ('SolutionsPage', 'pillar2Cap5Title', 'id', 'Industrial-Grade CDU'),
  ('SolutionsPage', 'pillar2Cap5Body', 'id', 'Kapasitas pendinginan hingga 2.600 kW, dibangun untuk operasi 24/7 di lingkungan rak hyperscale.'),
  ('SolutionsPage', 'pillar2Cap6Title', 'id', 'Liquid-Cooling Terminals'),
  ('SolutionsPage', 'pillar2Cap6Body', 'id', 'Pendinginan langsung tingkat chip dan prosesor untuk beban termal ekstrem di rak.'),
  ('SolutionsPage', 'pillar2Cap7Title', 'id', 'Air-Fluid Synergy'),
  ('SolutionsPage', 'pillar2Cap7Body', 'id', 'Arsitektur hibrida Midea yang menyelaraskan pendingin presisi udara dengan pendinginan cair tingkat rak.'),
  ('SolutionsPage', 'pillar2CatalogCta', 'id', 'Lihat katalog lengkap produk data center Midea'),
  ('SolutionsPage', 'pillar3Tagnum', 'id', '03 — Monitoring'),
  ('SolutionsPage', 'pillar3Eyebrow', 'id', 'Monitoring & Keamanan'),
  ('SolutionsPage', 'pillar3Title', 'id', 'Visibilitas total atas infrastruktur kritis.'),
  ('SolutionsPage', 'pillar3Lead', 'id', 'Infrastruktur kritis membutuhkan visibilitas konstan. Kami mengintegrasikan instrumentasi dan surveillance ke dalam satu tampilan operasional terpadu.'),
  ('SolutionsPage', 'pillar3Cap1Title', 'id', 'Flow Metering'),
  ('SolutionsPage', 'pillar3Cap1Body', 'id', 'Meter Emerson dan Endress+Hauser untuk monitoring chilled-water dan proses, diintegrasikan oleh Ramus.'),
  ('SolutionsPage', 'pillar3Cap2Title', 'id', 'Sistem Surveillance'),
  ('SolutionsPage', 'pillar3Cap2Body', 'id', 'Solusi surveillance KINGSAT melalui Ramus.'),
  ('SolutionsPage', 'pillar3Cap3Title', 'id', 'Smart Control & Monitoring'),
  ('SolutionsPage', 'pillar3Cap3Body', 'id', 'Monitoring terpusat untuk sistem kelistrikan, pendinginan, dan bahan bakar.'),
  ('SolutionsPage', 'aftersalesTitle', 'id', 'Layanan Purnajual — Mesin IHI / Niigata'),
  ('SolutionsPage', 'aftersalesBody', 'id', 'Keandalan tidak berhenti saat commissioning. Sistem mesin didukung program purnajual terstruktur yang dihadirkan bersama pabrikan.'),
  ('SolutionsPage', 'aftersalesPoint1Bold', 'id', '8 insinyur Indonesia bersertifikat'),
  ('SolutionsPage', 'aftersalesPoint1Rest', 'id', ' yang dilatih di Niigata Power Systems, Jepang.'),
  ('SolutionsPage', 'aftersalesPoint2Bold', 'id', '20+ tahun'),
  ('SolutionsPage', 'aftersalesPoint2Rest', 'id', ' pengalaman gabungan dalam pemeliharaan, overhaul, dan troubleshooting — mesin marine dan darat.'),
  ('SolutionsPage', 'aftersalesPoint3Bold', 'id', 'Insinyur Niigata khusus'),
  ('SolutionsPage', 'aftersalesPoint3Rest', 'id', ' dari Customer Support Center untuk wilayah Indonesia — troubleshooting, supervisi, dan overhaul.'),
  ('SolutionsPage', 'aftersalesPoint4Bold', 'id', 'Kunjungan rutin tahunan'),
  ('SolutionsPage', 'aftersalesPoint4Rest', 'id', ' ke setiap pelanggan di Indonesia oleh principal.'),
  ('SolutionsPage', 'aftersalesPoint5Bold', 'id', 'Saluran komunikasi terbuka'),
  ('SolutionsPage', 'aftersalesPoint5Rest', 'id', ' antara pabrikan dan pelanggan untuk klarifikasi atau troubleshooting apa pun.'),
  ('SolutionsPage', 'aftersalesPoint6Bold', 'id', 'Laporan lapangan per kasus'),
  ('SolutionsPage', 'aftersalesPoint6Rest', 'id', ' — detail foto, temuan, dan rekomendasi pabrikan.'),
  ('SolutionsPage', 'yuchaiEyebrow', 'id', 'Kelistrikan & Energi · Yuchai'),
  ('SolutionsPage', 'yuchaiHeading', 'id', 'Di dalam pabrik industri Yuchai.'),
  ('SolutionsPage', 'yuchaiBody', 'id', 'Tulang punggung manufaktur di balik genset yang kami pasok dan commissioning — menengok ke dalam pabrik industri Yuchai, tempat mesin diesel dan gas yang menggerakkan fasilitas kritis diproduksi.'),
  ('SolutionsPage', 'yuchaiCta', 'id', 'Jelajahi Kelistrikan & Energi'),
  ('SolutionsPage', 'integratedEyebrow', 'id', 'Kontrak M&E Terintegrasi'),
  ('SolutionsPage', 'integratedHeading', 'id', 'Satu mitra, bukan belasan vendor.'),
  ('SolutionsPage', 'integratedBody', 'id', 'Inti SUME: satu kontraktor yang bertanggung jawab penuh atas seluruh lingkup mekanikal dan elektrikal — <strong>desain, pengadaan, instalasi, commissioning, dan pemeliharaan berkelanjutan.</strong>

Di saat sebagian besar proyek harus mengoordinasikan banyak spesialis, SUME menghadirkan seluruh siklus hidup M&E dalam satu garis tanggung jawab — mengurangi risiko, menyederhanakan pengerjaan, dan menjaga setiap sistem kritis tetap selaras.'),
  ('SolutionsPage', 'brandsEyebrow', 'id', 'Kapabilitas & Brand'),
  ('SolutionsPage', 'brandsHeading', 'id', 'Nama-nama spesialis di balik setiap solusi.'),
  ('SolutionsPage', 'brandsBody', 'id', 'Teknologi dan kapabilitas yang diandalkan fasilitas mission-critical — dihadirkan sebagai satu jaringan yang terhubung.'),
  ('SolutionsPage', 'ctaTitle', 'id', 'Diskusikan kebutuhan Anda.'),
  ('SolutionsPage', 'ctaBody', 'id', 'Ceritakan tentang fasilitas Anda — kelistrikan, pendinginan, monitoring, atau lingkup M&E lengkap. Tim engineering kami akan menilai dan merespons.'),
  ('SolutionsPage', 'ctaButton', 'id', 'Diskusikan Kebutuhan Anda'),
  ('DataCenterPage', 'metaTitle', 'id', 'Data Center'),
  ('DataCenterPage', 'metaDescription', 'id', 'Dirancang untuk tuntutan data center. SUME menghadirkan dan menjaga infrastruktur kelistrikan, pendinginan, monitoring, dan keamanan yang menopang fasilitas mission-critical 24/7.'),
  ('DataCenterPage', 'heroTitle', 'id', 'Dirancang untuk Tuntutan Data Center.'),
  ('DataCenterPage', 'heroBody', 'id', 'Data center beroperasi 24/7 tanpa toleransi terhadap downtime. Setiap sistem — kelistrikan, pendinginan, monitoring, keamanan — harus bekerja terus-menerus dan dipelihara tanpa gangguan. SUME menghadirkan dan menjaga infrastruktur tersebut.'),
  ('DataCenterPage', 'heroCtaPrimary', 'id', 'Diskusikan Fasilitas Anda'),
  ('DataCenterPage', 'heroCtaSecondary', 'id', 'Jelajahi Solusi Kami'),
  ('DataCenterPage', 'liquidEyebrow', 'id', 'Liquid Cooling & CDU'),
  ('DataCenterPage', 'liquidHeading', 'id', 'Liquid Cooling untuk Data Center Generasi Berikutnya'),
  ('DataCenterPage', 'liquidIntro', 'id', 'Beban kerja AI dan klaster GPU berdensitas tinggi menghasilkan panas yang tidak mampu ditangani pendinginan udara konvensional dalam skala besar. Portofolio liquid cooling Midea — dipasok dan dipasang oleh SUME — menjawab tantangan ini secara langsung, dan menjadi lapisan paling mutakhir dari kapabilitas precision cooling yang dipetakan di bawah ini.'),
  ('DataCenterPage', 'liquidCard1Title', 'id', 'Maglev Active CDU'),
  ('DataCenterPage', 'liquidCard1Spec', 'id', 'PUE < 1,2'),
  ('DataCenterPage', 'liquidCard1Body', 'id', 'Unit unggulan Midea menggabungkan chiller magnetic-bearing (maglev) dan coolant distribution unit dalam satu sasis — tanpa oli, tanpa keausan bearing, lebih senyap. Memangkas kebutuhan ruang lantai data center lebih dari 50%.'),
  ('DataCenterPage', 'liquidCard2Title', 'id', 'Industrial-Grade CDU'),
  ('DataCenterPage', 'liquidCard2Spec', 'id', 'Hingga 2.600 kW'),
  ('DataCenterPage', 'liquidCard2Body', 'id', 'Kapasitas pendinginan hingga 2.600 kW per unit, dibangun untuk operasi 24/7 berkelanjutan pada rak superkomputer dan deret server berdensitas tinggi.'),
  ('DataCenterPage', 'liquidCard3Title', 'id', 'Liquid-Cooling Terminals'),
  ('DataCenterPage', 'liquidCard3Spec', 'id', 'Level chip'),
  ('DataCenterPage', 'liquidCard3Body', 'id', 'Pendinginan langsung pada level chip dan prosesor — menghilangkan beban termal di sumbernya sebelum menjadi masalah seluruh fasilitas.'),
  ('DataCenterPage', 'liquidCard4Title', 'id', 'Air-Fluid Synergy Architecture'),
  ('DataCenterPage', 'liquidCard4Spec', 'id', 'Hibrida'),
  ('DataCenterPage', 'liquidCard4Body', 'id', 'Mengoordinasikan precision air conditioning dengan liquid cooling level rak dalam satu sistem terkelola, sehingga fasilitas dapat beralih ke rasio liquid cooling yang lebih tinggi secara bertahap tanpa mengganggu infrastruktur yang ada.'),
  ('DataCenterPage', 'liquidCta', 'id', 'Lihat Katalog Produk Lengkap'),
  ('DataCenterPage', 'mappingEyebrow', 'id', 'Pemetaan Kapabilitas'),
  ('DataCenterPage', 'mappingHeading', 'id', 'Setiap kebutuhan data center, dipetakan ke kapabilitas SUME.'),
  ('DataCenterPage', 'mappingBody', 'id', 'Satu mitra M&E yang menghadirkan lingkup infrastruktur lengkap — dari standby power dan precision cooling hingga monitoring, keamanan, dan pemeliharaan jangka panjang.'),
  ('DataCenterPage', 'mappingThNeed', 'id', 'Kebutuhan Data Center'),
  ('DataCenterPage', 'mappingThCapability', 'id', 'Kapabilitas SUME'),
  ('DataCenterPage', 'whyEyebrow', 'id', 'Mengapa Ini Penting'),
  ('DataCenterPage', 'whyHeading', 'id', 'Keputusan infrastruktur yang menentukan uptime.'),
  ('DataCenterPage', 'scopeEyebrow', 'id', 'Lingkup Infrastruktur Lengkap'),
  ('DataCenterPage', 'scopeHeading', 'id', 'Yang SUME hadirkan untuk klien data center.'),
  ('DataCenterPage', 'scopeBody', 'id', 'Dari desain awal hingga pemeliharaan seumur pakai — lingkup mekanikal dan elektrikal lengkap di bawah satu mitra yang bertanggung jawab penuh.'),
  ('DataCenterPage', 'scopeViewCapability', 'id', 'Lihat kapabilitas'),
  ('DataCenterPage', 'ctaTitle', 'id', 'Standby power, precision cooling — uptime terjamin.'),
  ('DataCenterPage', 'ctaBody', 'id', 'SUME mendukung fasilitas yang menggerakkan infrastruktur digital Indonesia. Ceritakan tentang fasilitas dan kebutuhan Anda.'),
  ('DataCenterPage', 'ctaPrimary', 'id', 'Diskusikan Fasilitas Anda'),
  ('DataCenterPage', 'ctaSecondary', 'id', 'Jelajahi Solusi Kami'),
  ('MideaDataCenterPage', 'metaTitle', 'id', 'Solusi Pendinginan Data Center Midea'),
  ('MideaDataCenterPage', 'metaDescription', 'id', 'Liquid cooling efisiensi tinggi sepanjang siklus hidup untuk lingkungan komputasi mission-critical — Maglev Active CDU, CDU industrial-grade, liquid-cooling terminal, dan arsitektur air-fluid synergy, dipasok dan dipasang oleh SUME.'),
  ('MideaDataCenterPage', 'heroEyebrow', 'id', 'Midea · Pendinginan Data Center'),
  ('MideaDataCenterPage', 'heroTitle', 'id', 'Solusi Pendinginan Data Center Midea'),
  ('MideaDataCenterPage', 'heroBody', 'id', 'Liquid cooling efisiensi tinggi sepanjang siklus hidup untuk lingkungan komputasi mission-critical.'),
  ('MideaDataCenterPage', 'overviewEyebrow', 'id', 'Solusi Kontrol Suhu'),
  ('MideaDataCenterPage', 'overviewHeading', 'id', 'Dua arsitektur liquid cooling, direkayasa untuk menekan PUE.'),
  ('MideaDataCenterPage', 'overviewBody', 'id', 'Midea Building Technologies menghadirkan solusi kontrol suhu liquid cooling efisiensi tinggi sepanjang siklus hidup yang dirancang khusus untuk data center. Portofolio produk liquid cooling kami menampilkan dua arsitektur—pendinginan air bersuhu tinggi (high-temperature water cooling) dan pendinginan air bersuhu rendah (low-temperature water cooling)—yang dirancang untuk menurunkan PUE dengan efisiensi pertukaran panas yang luar biasa.'),
  ('MideaDataCenterPage', 'overviewImage', 'id', '/midea/water-cooling-architectures.webp'),
  ('MideaDataCenterPage', 'overviewImageAlt', 'id', 'Solusi pendinginan air bersuhu tinggi dan rendah Midea untuk data center'),
  ('MideaDataCenterPage', 'catalogEyebrow', 'id', 'Katalog Produk'),
  ('MideaDataCenterPage', 'catalogHeading', 'id', 'Jajaran lengkap liquid cooling Midea.'),
  ('MideaDataCenterPage', 'catalogBody', 'id', 'Dari CDU maglev hingga terminal level chip — platform pendinginan berdensitas tinggi yang direkayasa untuk AI dan komputasi hyperscale, bersumber langsung dari katalog resmi Midea.'),
  ('MideaDataCenterPage', 'catalogImage', 'id', '/midea/datacenter-catalog.webp'),
  ('MideaDataCenterPage', 'catalogImageAlt', 'id', 'Katalog produk liquid cooling data center Midea'),
  ('MideaDataCenterPage', 'catalogCaption', 'id', 'Sumber: katalog data center resmi Midea.'),
  ('MideaDataCenterPage', 'productsEyebrow', 'id', 'Rentang Produk'),
  ('MideaDataCenterPage', 'productsHeading', 'id', 'Empat fondasi untuk pendinginan berdensitas tinggi.'),
  ('MideaDataCenterPage', 'productsBody', 'id', 'Portofolio modular yang menskala dari satu rak hingga satu hall hyperscale penuh.'),
  ('MideaDataCenterPage', 'card1Title', 'id', 'Maglev Active CDU'),
  ('MideaDataCenterPage', 'card1Body', 'id', 'Chiller maglev + CDU terintegrasi. Hemat ruang 50%+. PUE < 1,2.'),
  ('MideaDataCenterPage', 'card2Title', 'id', 'Industrial-Grade CDU'),
  ('MideaDataCenterPage', 'card2Body', 'id', 'Hingga 2.600 kW. Operasi 24/7 untuk lingkungan hyperscale.'),
  ('MideaDataCenterPage', 'card3Title', 'id', 'Liquid-Cooling Terminals'),
  ('MideaDataCenterPage', 'card3Body', 'id', 'Pendinginan langsung level chip untuk beban panas rak ekstrem.'),
  ('MideaDataCenterPage', 'card4Title', 'id', 'Air-Fluid Synergy'),
  ('MideaDataCenterPage', 'card4Body', 'id', 'Arsitektur hibrida udara + cairan untuk transisi DC bertahap.'),
  ('MideaDataCenterPage', 'ctaTitle', 'id', 'Tertarik dengan liquid cooling Midea untuk fasilitas Anda?'),
  ('MideaDataCenterPage', 'ctaBody', 'id', 'Ceritakan tentang lingkungan komputasi Anda — densitas rak, kapasitas, dan jadwal. SUME akan menyusun konfigurasi liquid cooling Midea yang tepat.'),
  ('MideaDataCenterPage', 'ctaButton', 'id', 'Hubungi Kami'),
  ('MideaDataCenterPage', 'backToSolutions', 'id', 'Kembali ke Solusi'),
  ('MideaDataCenterPage', 'backToDataCenter', 'id', 'Kembali ke Data Center'),
  ('ProjectsPage', 'metaTitle', 'id', 'Proyek'),
  ('ProjectsPage', 'metaDescription', 'id', 'Proyek-proyek terpilih di fasilitas komersial, industri, dan mission-critical — menghadirkan infrastruktur kelistrikan, pendinginan, monitoring, dan M&E terintegrasi.'),
  ('ProjectsPage', 'headerEyebrow', 'id', 'Karya Kami'),
  ('ProjectsPage', 'headerTitle', 'id', 'Proyek Terpilih'),
  ('ProjectsPage', 'headerDescription', 'id', 'Rekam jejak di fasilitas komersial, industri, dan mission-critical — menghadirkan infrastruktur kelistrikan, pendinginan, monitoring, dan M&E terintegrasi.'),
  ('ProjectsPage', 'portfolioEyebrow', 'id', 'Portofolio Proyek'),
  ('ProjectsPage', 'portfolioHeading', 'id', 'Menghadirkan infrastruktur lintas industri dan wilayah.'),
  ('ProjectsPage', 'portfolioBody', 'id', 'Dari retrofit precision cooling hingga kontrak M&E terintegrasi — dibangun untuk fasilitas yang beroperasi tanpa gangguan.'),
  ('ProjectsPage', 'resultsEyebrow', 'id', 'Hasil Terbukti'),
  ('ProjectsPage', 'resultsHeading', 'id', 'Precision Cooling — Hasil yang Terukur'),
  ('ProjectsPage', 'resultsBody', 'id', 'Pendinginan adalah beban energi terbesar di fasilitas berdensitas tinggi mana pun. Hasil ini menunjukkan kapabilitas chiller dan efisiensi energi yang SUME hadirkan untuk lingkungan kritis.'),
  ('ProjectsPage', 'tableProject', 'id', 'Proyek'),
  ('ProjectsPage', 'tableLocation', 'id', 'Lokasi'),
  ('ProjectsPage', 'tableCoolingCapacity', 'id', 'Kapasitas Pendinginan'),
  ('ProjectsPage', 'tableScope', 'id', 'Lingkup'),
  ('ProjectsPage', 'powerEyebrow', 'id', 'Kapabilitas Kelistrikan & Mesin'),
  ('ProjectsPage', 'powerHeading', 'id', 'Keandalan Kelistrikan yang Dapat Anda Verifikasi'),
  ('ProjectsPage', 'powerBody', 'id', 'Backup power tidak bisa ditawar demi uptime. Kapabilitas mesin SUME dibangun di atas layanan resmi dan bersertifikat — didukung para insinyur yang dilatih langsung di Jepang.'),
  ('ProjectsPage', 'ctaTitle', 'id', 'Mari wujudkan infrastruktur Anda.'),
  ('ProjectsPage', 'ctaBody', 'id', 'Dari sistem kelistrikan mission-critical hingga lingkungan data center, kami membangun infrastruktur yang dirancang untuk performa, keandalan, dan uptime.'),
  ('ProjectsPage', 'ctaButton', 'id', 'Minta Konsultasi'),
  ('ContactPage', 'metaTitle', 'id', 'Kontak'),
  ('ContactPage', 'metaDescription', 'id', 'Mari wujudkan infrastruktur Anda. Baik Anda sedang membangun fasilitas baru maupun mengoptimalkan yang sudah ada, tim kami siap menilai kebutuhan Anda.'),
  ('ContactPage', 'headerEyebrow', 'id', 'Kontak'),
  ('ContactPage', 'headerTitle', 'id', 'Mari Wujudkan Infrastruktur Anda.'),
  ('ContactPage', 'headerDescription', 'id', 'Baik Anda sedang membangun fasilitas baru maupun mengoptimalkan yang sudah ada, tim kami siap menilai kebutuhan Anda.'),
  ('ContactPage', 'infoHeading', 'id', 'Hubungi Kami'),
  ('ContactPage', 'infoBody', 'id', 'Hubungi tim kami langsung atau gunakan formulir — kami merespons dalam satu hari kerja.'),
  ('ContactPage', 'formHeading', 'id', 'Minta Konsultasi'),
  ('ContactPage', 'mapEyebrow', 'id', 'Kantor Pusat'),
  ('ContactPage', 'mapHeading', 'id', 'Kantor Pusat Kami di Jakarta'),
  ('ContactPage', 'contactHeading', 'id', 'Hubungi Kami'),
  ('ContactPage', 'contactBody', 'id', 'Siap memulai proyek engineering Anda berikutnya? Para ahli kami siap memberikan konsultasi mendetail untuk kebutuhan M&E spesifik Anda.'),
  ('RegionalPage', 'metaTitle', 'id', 'Kehadiran Regional'),
  ('RegionalPage', 'metaDescription', 'id', 'Jangkauan regional di Asia Tenggara. Kantor-kantor yang menopang pengerjaan di Indonesia, Singapura, dan Myanmar — dengan engineering, distribusi, dan pemeliharaan di lapangan.'),
  ('RegionalPage', 'headerEyebrow', 'id', 'Kehadiran Regional'),
  ('RegionalPage', 'headerTitle', 'id', 'Jangkauan Regional di Asia Tenggara.'),
  ('RegionalPage', 'headerDescription', 'id', 'Kantor-kantor yang menopang pengerjaan di Indonesia, Singapura, dan Myanmar — mendukung klien di seluruh kawasan dengan engineering, distribusi, dan pemeliharaan di lapangan.'),
  ('RegionalPage', 'officesEyebrow', 'id', 'Kantor Kami'),
  ('RegionalPage', 'officesHeading', 'id', 'Kehadiran engineering, dibangun di tempat klien kami beroperasi.'),
  ('RegionalPage', 'officesBody', 'id', 'Berkantor pusat di Jakarta dengan kantor regional di seluruh Asia Tenggara — dihadirkan dan didukung secara lokal, di mana pun fasilitas beroperasi.'),
  ('RegionalPage', 'ctaTitle', 'id', 'Beroperasi lintas kawasan? Mari wujudkan fasilitas Anda berikutnya bersama.'),
  ('RegionalPage', 'ctaBody', 'id', 'Bicarakan dengan tim regional kami tentang kebutuhan kelistrikan, pendinginan, monitoring, atau M&E Anda.'),
  ('RegionalPage', 'ctaButton', 'id', 'Hubungi Tim Regional Kami'),
  ('RegionalMap', 'mapAria', 'id', 'Peta kantor regional'),
  ('RegionalMap', 'badgeHq', 'id', 'HQ'),
  ('RegionalMap', 'badgeOffice', 'id', 'Kantor'),
  ('Meta', 'title', 'en', 'SUME Group — Mechanical & Electrical Infrastructure for Mission-Critical Facilities'),
  ('Meta', 'description', 'en', 'SUME designs, installs, and maintains the power, cooling, and monitoring systems that keep data centers, commercial properties, and industrial facilities running — without interruption.'),
  ('Meta', 'ogImageAlt', 'en', 'SUME Group — Mechanical & Electrical Infrastructure'),
  ('Header', 'getInTouch', 'en', 'Get in Touch'),
  ('Header', 'homeAria', 'en', 'SUME Group home'),
  ('Header', 'openMenu', 'en', 'Open navigation menu'),
  ('Header', 'closeMenu', 'en', 'Close navigation menu'),
  ('LocaleSwitcher', 'label', 'en', 'Language'),
  ('LocaleSwitcher', 'id', 'en', 'Indonesia'),
  ('LocaleSwitcher', 'en', 'en', 'English'),
  ('Footer', 'tagline', 'en', 'Mechanical & Electrical Infrastructure for Mission-Critical Facilities.'),
  ('Footer', 'solutions', 'en', 'Solutions'),
  ('Footer', 'company', 'en', 'Company'),
  ('Footer', 'offices', 'en', 'Offices'),
  ('Footer', 'contact', 'en', 'Contact'),
  ('Footer', 'about', 'en', 'About'),
  ('Footer', 'projects', 'en', 'Projects'),
  ('Footer', 'privacy', 'en', 'Privacy Policy'),
  ('Footer', 'terms', 'en', 'Terms of Service'),
  ('Footer', 'copyright', 'en', '© {year} {brand} · {legal}. All rights reserved.'),
  ('Hero', 'exploreSolutions', 'en', 'Explore Our Solutions'),
  ('Hero', 'talkToTeam', 'en', 'Talk to Our Team'),
  ('Hero', 'slideAria', 'en', 'Show {label} slide'),
  ('Hero', 'slide1Label', 'en', 'Power'),
  ('Hero', 'slide1Title', 'en', 'Critical Power, Engineered for Uptime'),
  ('Hero', 'slide1Subtitle', 'en', 'Standby generation, fuel monitoring, and solar — built for facilities that cannot afford to go dark.'),
  ('Hero', 'slide2Label', 'en', 'Cooling'),
  ('Hero', 'slide2Title', 'en', 'Cooling That Performs Under Load'),
  ('Hero', 'slide2Subtitle', 'en', 'HVAC and chiller solutions engineered for continuous, high-density thermal loads.'),
  ('Hero', 'slide3Label', 'en', 'Monitoring'),
  ('Hero', 'slide3Title', 'en', 'Total Visibility Over Critical Infrastructure'),
  ('Hero', 'slide3Subtitle', 'en', 'Fuel monitoring, flow metering, and surveillance in one operational picture.'),
  ('Hero', 'slide4Label', 'en', 'Integrated'),
  ('Hero', 'slide4Title', 'en', 'One Partner, End-to-End Infrastructure'),
  ('Hero', 'slide4Subtitle', 'en', 'From design to commissioning to operation — delivered as a single accountable scope.'),
  ('Home', 'tagline', 'en', '<strong>Mechanical & electrical infrastructure</strong> for mission-critical facilities.'),
  ('Home', 'description', 'en', 'SUME designs, installs, and maintains the power, cooling, and monitoring systems that keep data centers, commercial properties, and industrial facilities running — without interruption.'),
  ('Home', 'exploreSolutions', 'en', 'Our Solutions'),
  ('Home', 'solutionsHeading', 'en', 'Built for environments where downtime is not an option.'),
  ('Home', 'solutionsBody', 'en', 'A complete mechanical & electrical scope — engineered, delivered, and maintained under one accountable partner.'),
  ('Home', 'exploreSolution', 'en', 'Explore solution'),
  ('Home', 'dataCenterEyebrow', 'en', 'Data Center Infrastructure'),
  ('Home', 'dataCenterHeading', 'en', 'Built for the demands of the data center.'),
  ('Home', 'dataCenterBody', 'en', 'Power, cooling, monitoring, and security — engineered for 24/7 operation with zero tolerance for downtime.'),
  ('Home', 'dataCenterCta', 'en', 'See Our Data Center Capabilities'),
  ('Home', 'whyEyebrow', 'en', 'Why SUME Group'),
  ('Home', 'whyHeading', 'en', 'Four reasons enterprise clients choose a single accountable partner.'),
  ('Home', 'trustedBy', 'en', 'Trusted by Leading Organizations'),
  ('Home', 'closingHeading', 'en', 'Let''s engineer your infrastructure.'),
  ('Home', 'closingBody', 'en', 'From mission-critical power systems to data center environments, we build infrastructure designed for performance, reliability, and uptime.'),
  ('Home', 'closingCta', 'en', 'Request a Consultation'),
  ('Home', 'stat1Value', 'en', '2014'),
  ('Home', 'stat1Label', 'en', 'Years of Operation'),
  ('Home', 'stat2Value', 'en', '185'),
  ('Home', 'stat2Label', 'en', 'Projects Delivered'),
  ('Home', 'stat3Value', 'en', '3'),
  ('Home', 'stat3Label', 'en', 'Countries'),
  ('Home', 'stat4Value', 'en', 'ISO'),
  ('Home', 'stat4Label', 'en', 'Certified & Accredited'),
  ('Home', 'solution1Title', 'en', 'Power & Energy'),
  ('Home', 'solution1Description', 'en', 'Generators · solar PV · fuel monitoring · engine maintenance.'),
  ('Home', 'solution2Title', 'en', 'Precision Cooling'),
  ('Home', 'solution2Description', 'en', 'Chillers · VRF · optimization · Cooling-as-a-Service.'),
  ('Home', 'solution3Title', 'en', 'Monitoring & Security'),
  ('Home', 'solution3Description', 'en', 'Flow metering · CCTV · smart control.'),
  ('Home', 'solution4Title', 'en', 'Integrated M&E'),
  ('Home', 'solution4Description', 'en', 'Design · install · commission · maintain.'),
  ('Home', 'why1Title', 'en', 'Proven Track Record'),
  ('Home', 'why1Description', 'en', '+ projects across commercial, industrial & mission-critical facilities.'),
  ('Home', 'why2Title', 'en', 'Certified & Accredited'),
  ('Home', 'why2Description', 'en', 'ISO 9001 / 14001 / 45001 quality, environmental & safety standards.'),
  ('Home', 'why3Title', 'en', 'Recognized Clients'),
  ('Home', 'why3Description', 'en', 'Samsung · Yonex · Santika · RE/MAX · Mega Bekasi Hypermall.'),
  ('Home', 'why4Title', 'en', 'End-to-End Accountability'),
  ('Home', 'why4Description', 'en', 'One partner across design, delivery, and lifetime maintenance.'),
  ('Projects', 'all', 'en', 'All'),
  ('Projects', 'empty', 'en', 'No projects found in this category.'),
  ('Projects', 'learnMore', 'en', 'Learn more'),
  ('Projects', 'noImage', 'en', 'No detailed image available for this project.'),
  ('Projects', 'viewDetailAria', 'en', 'View {title} project detail'),
  ('Projects', 'closeAria', 'en', 'Close project preview'),
  ('Projects', 'categoryCommercial', 'en', 'Commercial'),
  ('Projects', 'categoryIndustrial', 'en', 'Industrial'),
  ('Projects', 'categoryHospitality', 'en', 'Hospitality'),
  ('Projects', 'categoryGovernment', 'en', 'Government'),
  ('Projects', 'categoryRetail', 'en', 'Retail'),
  ('Projects', 'categoryTechnology', 'en', 'Technology'),
  ('ConsultationForm', 'fullName', 'en', 'Full Name'),
  ('ConsultationForm', 'fullNamePlaceholder', 'en', 'Your full name'),
  ('ConsultationForm', 'company', 'en', 'Company'),
  ('ConsultationForm', 'companyPlaceholder', 'en', 'Your company'),
  ('ConsultationForm', 'email', 'en', 'Email Address'),
  ('ConsultationForm', 'emailPlaceholder', 'en', 'you@company.com'),
  ('ConsultationForm', 'facilityType', 'en', 'Facility Type'),
  ('ConsultationForm', 'facilitySelect', 'en', 'Select facility type'),
  ('ConsultationForm', 'facilityDataCenter', 'en', 'Data Center'),
  ('ConsultationForm', 'facilityCommercial', 'en', 'Commercial Building'),
  ('ConsultationForm', 'facilityIndustrial', 'en', 'Industrial Facility'),
  ('ConsultationForm', 'facilityOther', 'en', 'Other'),
  ('ConsultationForm', 'message', 'en', 'Message'),
  ('ConsultationForm', 'messagePlaceholder', 'en', 'Describe your requirements — scope, location, timeline…'),
  ('ConsultationForm', 'agreement', 'en', 'By submitting this form, you agree to our <link>Privacy Policy</link>. We will not share your information with third parties.'),
  ('ConsultationForm', 'success', 'en', 'Thank you — we''ll be in touch within one business day.'),
  ('ConsultationForm', 'sending', 'en', 'Sending…'),
  ('ConsultationForm', 'submit', 'en', 'Request a Consultation'),
  ('ConsultationForm', 'facilityPrefix', 'en', 'Facility type'),
  ('ConsultationForm', 'errorFallback', 'en', 'Failed to send message. Please try again.'),
  ('ContactForm', 'fullName', 'en', 'Full Name'),
  ('ContactForm', 'fullNamePlaceholder', 'en', 'John Doe'),
  ('ContactForm', 'email', 'en', 'Email Address'),
  ('ContactForm', 'emailPlaceholder', 'en', 'john@company.com'),
  ('ContactForm', 'phone', 'en', 'Phone Number'),
  ('ContactForm', 'phonePlaceholder', 'en', '+62 ...'),
  ('ContactForm', 'company', 'en', 'Company'),
  ('ContactForm', 'companyPlaceholder', 'en', 'Your Organization'),
  ('ContactForm', 'message', 'en', 'Message'),
  ('ContactForm', 'messagePlaceholder', 'en', 'How can we help you?'),
  ('ContactForm', 'sending', 'en', 'Sending...'),
  ('ContactForm', 'sent', 'en', 'Message Sent'),
  ('ContactForm', 'send', 'en', 'Send Inquiry'),
  ('ContactForm', 'errorFallback', 'en', 'Failed to send message. Please try again.'),
  ('AboutPage', 'metaTitle', 'en', 'About'),
  ('AboutPage', 'metaDescription', 'en', 'A decade of building what cannot fail. PT. SUME (Solusi Utama Mekanikal Elektrikal) delivers integrated power, cooling, monitoring, and security systems for facilities that operate around the clock.'),
  ('AboutPage', 'headerEyebrow', 'en', 'About SUME Group'),
  ('AboutPage', 'headerTitle', 'en', 'A Decade of Building What Cannot Fail.'),
  ('AboutPage', 'headerDescription', 'en', 'The systems behind a building — its power, its cooling, its controls — deserve the same rigor as the structure itself.'),
  ('AboutPage', 'whoWeAreEyebrow', 'en', 'Who We Are'),
  ('AboutPage', 'whoWeAreHeading', 'en', 'Engineering the infrastructure that cannot afford to fail.'),
  ('AboutPage', 'whoWeAreBody', 'en', '<p>PT. SUME (Solusi Utama Mekanikal Elektrikal) began as a mechanical and electrical contractor with a simple conviction: that the systems behind a building — its power, its cooling, its controls — deserve the same rigor as the structure itself.</p><p>Over <strong>10+</strong> years, that conviction has grown into a comprehensive M&E capability. What started with commercial building installations has expanded into critical infrastructure — where SUME now delivers <strong>integrated power, cooling, monitoring, and security systems</strong> for facilities that operate around the clock.</p><p>Today, SUME serves clients across Indonesia and the region, supported by offices in Singapore and Myanmar, and an ecosystem of specialized capabilities spanning standby power, solar energy, precision cooling, and intelligent monitoring.</p>'),
  ('AboutPage', 'journeyEyebrow', 'en', 'Our Journey'),
  ('AboutPage', 'journeyHeading', 'en', 'From M&E contractor to critical infrastructure partner.'),
  ('AboutPage', 'journeyNote', 'en', 'Milestone dates to be confirmed before launch.'),
  ('AboutPage', 'milestone1Event', 'en', 'PT. SUME founded as a mechanical & electrical contractor.'),
  ('AboutPage', 'milestone2Event', 'en', 'Megabekasi Hypermall Project Maintenance dan BroadChiller.'),
  ('AboutPage', 'milestone3Event', 'en', 'Expanded into power generation and standby systems.'),
  ('AboutPage', 'milestone4Event', 'en', 'Established regional presence (Singapore, Myanmar).'),
  ('AboutPage', 'milestone5Event', 'en', 'Added solar PV and Cooling-as-a-Service capabilities.'),
  ('AboutPage', 'milestone6Event', 'en', 'Entered data center / mission-critical segment.'),
  ('AboutPage', 'apartEyebrow', 'en', 'What Sets Us Apart'),
  ('AboutPage', 'apartHeading', 'en', 'Why enterprise clients choose SUME.'),
  ('AboutPage', 'apart1Title', 'en', 'End-to-End Accountability'),
  ('AboutPage', 'apart1Body', 'en', 'One partner across design, procurement, installation, commissioning, and lifetime maintenance — no coordination gaps.'),
  ('AboutPage', 'apart2Title', 'en', 'Certified & Accredited'),
  ('AboutPage', 'apart2Body', 'en', 'ISO 9001 / 14001 / 45001 quality, environmental, and safety standards, with EDGE and BNSP accreditation.'),
  ('AboutPage', 'apart3Title', 'en', 'Recognized Clients'),
  ('AboutPage', 'apart3Body', 'en', 'Trusted by Samsung, Yonex, Santika, RE/MAX, and Mega Bekasi Hypermall, among others across the region.'),
  ('AboutPage', 'apart4Title', 'en', 'Regional Reach'),
  ('AboutPage', 'apart4Body', 'en', 'Headquartered in Jakarta with offices in Singapore and Myanmar — delivered and supported locally.'),
  ('AboutPage', 'certsEyebrow', 'en', 'Certifications & Accreditation'),
  ('AboutPage', 'certsHeading', 'en', 'Standards verified, not just stated.'),
  ('AboutPage', 'certsBody', 'en', 'Quality, environmental, and safety management systems backing every project we deliver.'),
  ('AboutPage', 'cert1Name', 'en', 'Quality Management'),
  ('AboutPage', 'cert1Detail', 'en', 'ISO 9001'),
  ('AboutPage', 'cert2Name', 'en', 'Environmental Management'),
  ('AboutPage', 'cert2Detail', 'en', 'ISO 14001'),
  ('AboutPage', 'cert3Name', 'en', 'Occupational Health & Safety'),
  ('AboutPage', 'cert3Detail', 'en', 'ISO 45001'),
  ('AboutPage', 'cert4Name', 'en', 'International Product Compliance'),
  ('AboutPage', 'cert4Detail', 'en', 'CE / EAC / Industry Certifications'),
  ('AboutPage', 'ctaTitle', 'en', 'Let''s engineer your infrastructure.'),
  ('AboutPage', 'ctaBody', 'en', 'Talk to our team about your power, cooling, monitoring, or full M&E requirements.'),
  ('AboutPage', 'ctaButton', 'en', 'Get in Touch'),
  ('SolutionsPage', 'metaTitle', 'en', 'Solutions'),
  ('SolutionsPage', 'metaDescription', 'en', 'The full mechanical & electrical scope — power & energy, precision cooling, monitoring & security, and integrated M&E contracting for mission-critical facilities.'),
  ('SolutionsPage', 'headerEyebrow', 'en', 'Solutions'),
  ('SolutionsPage', 'headerTitle', 'en', 'The Full Mechanical & Electrical Scope.'),
  ('SolutionsPage', 'headerDescription', 'en', 'Engineered for environments where downtime is not an option — drawing on a network of specialist capabilities that mission-critical facilities depend on.'),
  ('SolutionsPage', 'pillar1Tagnum', 'en', '01 — Power'),
  ('SolutionsPage', 'pillar1Eyebrow', 'en', 'Power & Energy'),
  ('SolutionsPage', 'pillar1Title', 'en', 'The backbone of any critical facility.'),
  ('SolutionsPage', 'pillar1Lead', 'en', 'Primary and standby power engineered for continuous operation, with the monitoring and maintenance to keep it reliable across its full life.'),
  ('SolutionsPage', 'pillar1Cap1Title', 'en', 'Standby & Prime Generators'),
  ('SolutionsPage', 'pillar1Cap1Body', 'en', 'Yuchai diesel & gas gensets; containerized and site-built configurations, sized to facility load.'),
  ('SolutionsPage', 'pillar1Cap2Title', 'en', 'Solar PV Systems'),
  ('SolutionsPage', 'pillar1Cap2Body', 'en', 'Rooftop and ground-mount design and installation, delivered with Powerbrain; 50+ MWp installed.'),
  ('SolutionsPage', 'pillar1Cap3Title', 'en', 'Fuel Monitoring Systems'),
  ('SolutionsPage', 'pillar1Cap3Body', 'en', 'Real-time fuel level, consumption, and theft detection, powered by Ramus instrumentation.'),
  ('SolutionsPage', 'pillar1Cap4Title', 'en', 'Engine Maintenance & Overhaul'),
  ('SolutionsPage', 'pillar1Cap4Body', 'en', 'Authorized spare parts and overhaul for IHI / Niigata land and marine engines through Ramoco.'),
  ('SolutionsPage', 'pillar2Tagnum', 'en', '02 — Cooling'),
  ('SolutionsPage', 'pillar2Eyebrow', 'en', 'Precision Cooling & HVAC'),
  ('SolutionsPage', 'pillar2Title', 'en', 'Cooling that performs under load.'),
  ('SolutionsPage', 'pillar2Lead', 'en', 'Cooling is where most of a facility''s electricity goes. Getting it wrong costs money every month.'),
  ('SolutionsPage', 'pillar2GroupAirTitle', 'en', 'Air Cooling'),
  ('SolutionsPage', 'pillar2Cap1Title', 'en', 'Chiller Plants & VRF Systems'),
  ('SolutionsPage', 'pillar2Cap1Body', 'en', 'Midea, Broad, and Hisense for high-density and commercial cooling loads.'),
  ('SolutionsPage', 'pillar2Cap2Title', 'en', 'Chiller Optimization & Retrofit'),
  ('SolutionsPage', 'pillar2Cap2Body', 'en', 'Plant automation, VSD retrofits, pump rewinding. On one 3×550 TR plant, we took efficiency from 1.10 to 0.77 kW/TR.'),
  ('SolutionsPage', 'pillar2Cap3Title', 'en', 'Cooling-as-a-Service'),
  ('SolutionsPage', 'pillar2Cap3Body', 'en', 'The client pays nothing upfront. Powerbrain finances, installs, and operates the cooling system; performance is contractually guaranteed and backed by an insurance-grade performance bond, measured against the IPMVP standard.'),
  ('SolutionsPage', 'pillar2GroupLiquidTitle', 'en', 'Liquid Cooling (Data Center & High-Density Compute)'),
  ('SolutionsPage', 'pillar2Cap4Title', 'en', 'Maglev Active CDU'),
  ('SolutionsPage', 'pillar2Cap4Body', 'en', 'Midea''s integrated maglev chiller and CDU in a single chassis. Saves over 50% floor space. PUE below 1.2.'),
  ('SolutionsPage', 'pillar2Cap5Title', 'en', 'Industrial-Grade CDU'),
  ('SolutionsPage', 'pillar2Cap5Body', 'en', 'Up to 2,600 kW cooling capacity, built for 24/7 continuous operation across hyperscale rack environments.'),
  ('SolutionsPage', 'pillar2Cap6Title', 'en', 'Liquid-Cooling Terminals'),
  ('SolutionsPage', 'pillar2Cap6Body', 'en', 'Direct chip and processor-level cooling for extreme thermal loads at the rack.'),
  ('SolutionsPage', 'pillar2Cap7Title', 'en', 'Air-Fluid Synergy'),
  ('SolutionsPage', 'pillar2Cap7Body', 'en', 'Midea''s hybrid architecture coordinating precision air conditioning with rack-level liquid cooling.'),
  ('SolutionsPage', 'pillar2CatalogCta', 'en', 'See full Midea data center product catalog'),
  ('SolutionsPage', 'pillar3Tagnum', 'en', '03 — Monitoring'),
  ('SolutionsPage', 'pillar3Eyebrow', 'en', 'Monitoring & Security'),
  ('SolutionsPage', 'pillar3Title', 'en', 'Total visibility over critical infrastructure.'),
  ('SolutionsPage', 'pillar3Lead', 'en', 'Critical infrastructure requires constant visibility. We integrate instrumentation and surveillance into a unified operational view.'),
  ('SolutionsPage', 'pillar3Cap1Title', 'en', 'Flow Metering'),
  ('SolutionsPage', 'pillar3Cap1Body', 'en', 'Emerson and Endress+Hauser meters for chilled-water and process monitoring, integrated by Ramus.'),
  ('SolutionsPage', 'pillar3Cap2Title', 'en', 'Surveillance Systems'),
  ('SolutionsPage', 'pillar3Cap2Body', 'en', 'KINGSAT surveillance solutions through Ramus.'),
  ('SolutionsPage', 'pillar3Cap3Title', 'en', 'Smart Control & Monitoring'),
  ('SolutionsPage', 'pillar3Cap3Body', 'en', 'Centralized monitoring of power, cooling, and fuel systems.'),
  ('SolutionsPage', 'aftersalesTitle', 'en', 'Aftersales Service — IHI / Niigata Engines'),
  ('SolutionsPage', 'aftersalesBody', 'en', 'Reliability does not end at commissioning. Engine systems are backed by a structured aftersales program delivered with the manufacturer.'),
  ('SolutionsPage', 'aftersalesPoint1Bold', 'en', '8 certified Indonesian engineers'),
  ('SolutionsPage', 'aftersalesPoint1Rest', 'en', ' trained in Niigata Power Systems, Japan.'),
  ('SolutionsPage', 'aftersalesPoint2Bold', 'en', '20+ years'),
  ('SolutionsPage', 'aftersalesPoint2Rest', 'en', ' combined experience in maintenance, overhaul, and troubleshooting — marine and land-use engines.'),
  ('SolutionsPage', 'aftersalesPoint3Bold', 'en', 'Dedicated Niigata engineers'),
  ('SolutionsPage', 'aftersalesPoint3Rest', 'en', ' from the Customer Support Center for the Indonesian region — troubleshooting, supervision, and overhaul.'),
  ('SolutionsPage', 'aftersalesPoint4Bold', 'en', 'Annual courtesy visits'),
  ('SolutionsPage', 'aftersalesPoint4Rest', 'en', ' to each customer in Indonesia by the principal.'),
  ('SolutionsPage', 'aftersalesPoint5Bold', 'en', 'Open communication channel'),
  ('SolutionsPage', 'aftersalesPoint5Rest', 'en', ' between manufacturer and customer for any clarification or troubleshooting.'),
  ('SolutionsPage', 'aftersalesPoint6Bold', 'en', 'Case-by-case field reports'),
  ('SolutionsPage', 'aftersalesPoint6Rest', 'en', ' — photo details, findings, and manufacturer recommendations.'),
  ('SolutionsPage', 'yuchaiEyebrow', 'en', 'Power & Energy · Yuchai'),
  ('SolutionsPage', 'yuchaiHeading', 'en', 'Inside the Yuchai industrial plant.'),
  ('SolutionsPage', 'yuchaiBody', 'en', 'The manufacturing backbone behind the gensets we supply and commission — a look inside Yuchai''s industrial plant, where the diesel and gas engines that power critical facilities are built.'),
  ('SolutionsPage', 'yuchaiCta', 'en', 'Explore Power & Energy'),
  ('SolutionsPage', 'integratedEyebrow', 'en', 'Integrated M&E Contracting'),
  ('SolutionsPage', 'integratedHeading', 'en', 'One partner, not a dozen vendors.'),
  ('SolutionsPage', 'integratedBody', 'en', 'SUME''s core: a single accountable contractor across the full mechanical and electrical scope — <strong>design, procurement, installation, commissioning, and ongoing maintenance.</strong>

Where most projects coordinate across many specialists, SUME delivers the entire M&E lifecycle under one line of accountability — reducing risk, simplifying delivery, and keeping every critical system aligned.'),
  ('SolutionsPage', 'brandsEyebrow', 'en', 'Capabilities & Brands'),
  ('SolutionsPage', 'brandsHeading', 'en', 'The specialist names behind every solution.'),
  ('SolutionsPage', 'brandsBody', 'en', 'The technologies and capabilities that mission-critical facilities depend on — delivered as one connected network.'),
  ('SolutionsPage', 'ctaTitle', 'en', 'Discuss your requirements.'),
  ('SolutionsPage', 'ctaBody', 'en', 'Tell us about your facility — power, cooling, monitoring, or full M&E scope. Our engineering team will assess and respond.'),
  ('SolutionsPage', 'ctaButton', 'en', 'Discuss Your Requirements'),
  ('DataCenterPage', 'metaTitle', 'en', 'Data Center'),
  ('DataCenterPage', 'metaDescription', 'en', 'Built for the demands of the data center. SUME delivers and sustains the power, cooling, monitoring, and security infrastructure that mission-critical facilities run on 24/7.'),
  ('DataCenterPage', 'heroTitle', 'en', 'Built for the Demands of the Data Center.'),
  ('DataCenterPage', 'heroBody', 'en', 'Data centers run 24/7 with zero tolerance for downtime. Every system — power, cooling, monitoring, security — must perform continuously and be maintained without disruption. SUME delivers and sustains that infrastructure.'),
  ('DataCenterPage', 'heroCtaPrimary', 'en', 'Discuss Your Facility'),
  ('DataCenterPage', 'heroCtaSecondary', 'en', 'Explore Our Solutions'),
  ('DataCenterPage', 'liquidEyebrow', 'en', 'Liquid Cooling & CDU'),
  ('DataCenterPage', 'liquidHeading', 'en', 'Liquid Cooling for the Next Generation of Data Centers'),
  ('DataCenterPage', 'liquidIntro', 'en', 'AI workloads and high-density GPU clusters generate heat that conventional air cooling cannot handle at scale. Midea''s liquid cooling portfolio — supplied and installed by SUME — addresses this directly, and forms the most advanced layer of the precision cooling capability mapped out below.'),
  ('DataCenterPage', 'liquidCard1Title', 'en', 'Maglev Active CDU'),
  ('DataCenterPage', 'liquidCard1Spec', 'en', 'PUE < 1.2'),
  ('DataCenterPage', 'liquidCard1Body', 'en', 'Midea''s flagship unit combines a magnetic-bearing (maglev) chiller and a coolant distribution unit in a single chassis — no oil, no bearing wear, lower noise. Cuts data center floor space by over 50%.'),
  ('DataCenterPage', 'liquidCard2Title', 'en', 'Industrial-Grade CDU'),
  ('DataCenterPage', 'liquidCard2Spec', 'en', 'Up to 2,600 kW'),
  ('DataCenterPage', 'liquidCard2Body', 'en', 'Cooling capacity up to 2,600 kW per unit, built for 24/7 continuous operation across supercomputer racks and high-density server rows.'),
  ('DataCenterPage', 'liquidCard3Title', 'en', 'Liquid-Cooling Terminals'),
  ('DataCenterPage', 'liquidCard3Spec', 'en', 'Chip-level'),
  ('DataCenterPage', 'liquidCard3Body', 'en', 'Direct chip and processor-level cooling — removing thermal load at the source before it becomes a facility-wide problem.'),
  ('DataCenterPage', 'liquidCard4Title', 'en', 'Air-Fluid Synergy Architecture'),
  ('DataCenterPage', 'liquidCard4Spec', 'en', 'Hybrid'),
  ('DataCenterPage', 'liquidCard4Body', 'en', 'Coordinates precision air conditioning with rack-level liquid cooling in one managed system, so facilities move progressively toward higher liquid-cooling ratios without disrupting existing infrastructure.'),
  ('DataCenterPage', 'liquidCta', 'en', 'View Full Product Catalog'),
  ('DataCenterPage', 'mappingEyebrow', 'en', 'Capability Mapping'),
  ('DataCenterPage', 'mappingHeading', 'en', 'Every data center need, matched to a SUME capability.'),
  ('DataCenterPage', 'mappingBody', 'en', 'A single M&E partner delivering the full infrastructure scope — from standby power and precision cooling to monitoring, security, and long-term maintenance.'),
  ('DataCenterPage', 'mappingThNeed', 'en', 'Data Center Need'),
  ('DataCenterPage', 'mappingThCapability', 'en', 'SUME Capability'),
  ('DataCenterPage', 'whyEyebrow', 'en', 'Why It Matters'),
  ('DataCenterPage', 'whyHeading', 'en', 'The infrastructure decisions that determine uptime.'),
  ('DataCenterPage', 'scopeEyebrow', 'en', 'Full Infrastructure Scope'),
  ('DataCenterPage', 'scopeHeading', 'en', 'What SUME delivers for data center clients.'),
  ('DataCenterPage', 'scopeBody', 'en', 'From initial design through lifetime maintenance — the full mechanical and electrical scope under one accountable partner.'),
  ('DataCenterPage', 'scopeViewCapability', 'en', 'View capability'),
  ('DataCenterPage', 'ctaTitle', 'en', 'Standby power, precision cooling — uptime assured.'),
  ('DataCenterPage', 'ctaBody', 'en', 'SUME supports the facilities that power Indonesia''s digital infrastructure. Tell us about your facility and requirements.'),
  ('DataCenterPage', 'ctaPrimary', 'en', 'Discuss Your Facility'),
  ('DataCenterPage', 'ctaSecondary', 'en', 'Explore Our Solutions'),
  ('MideaDataCenterPage', 'metaTitle', 'en', 'Midea Data Center Cooling Solutions'),
  ('MideaDataCenterPage', 'metaDescription', 'en', 'Full-lifecycle, high-efficiency liquid cooling for mission-critical compute environments — Maglev Active CDU, industrial-grade CDUs, liquid-cooling terminals, and air-fluid synergy architecture, supplied and installed by SUME.'),
  ('MideaDataCenterPage', 'heroEyebrow', 'en', 'Midea · Data Center Cooling'),
  ('MideaDataCenterPage', 'heroTitle', 'en', 'Midea Data Center Cooling Solutions'),
  ('MideaDataCenterPage', 'heroBody', 'en', 'Full-lifecycle, high-efficiency liquid cooling for mission-critical compute environments.'),
  ('MideaDataCenterPage', 'overviewEyebrow', 'en', 'Temperature Control Solutions'),
  ('MideaDataCenterPage', 'overviewHeading', 'en', 'Two liquid cooling architectures, engineered to cut PUE.'),
  ('MideaDataCenterPage', 'overviewBody', 'en', 'Midea Building Technologies provides full-lifecycle, high-efficiency liquid cooling temperature control solutions tailored for data centers. Our liquid cooling product portfolio features two architectures—high-temperature water cooling and low-temperature water cooling—designed to reduce PUE with exceptional heat exchange efficiency.'),
  ('MideaDataCenterPage', 'overviewImage', 'en', '/midea/water-cooling-architectures.webp'),
  ('MideaDataCenterPage', 'overviewImageAlt', 'en', 'Midea high-temperature and low-temperature water cooling solutions for data centers'),
  ('MideaDataCenterPage', 'catalogEyebrow', 'en', 'Product Catalog'),
  ('MideaDataCenterPage', 'catalogHeading', 'en', 'The complete Midea liquid cooling lineup.'),
  ('MideaDataCenterPage', 'catalogBody', 'en', 'From maglev CDUs to chip-level terminals — the high-density cooling platform engineered for AI and hyperscale compute, sourced directly from Midea''s official catalog.'),
  ('MideaDataCenterPage', 'catalogImage', 'en', '/midea/datacenter-catalog.webp'),
  ('MideaDataCenterPage', 'catalogImageAlt', 'en', 'Midea data center liquid cooling product catalog'),
  ('MideaDataCenterPage', 'catalogCaption', 'en', 'Source: Midea''s official data center catalog.'),
  ('MideaDataCenterPage', 'productsEyebrow', 'en', 'Product Range'),
  ('MideaDataCenterPage', 'productsHeading', 'en', 'Four building blocks for high-density cooling.'),
  ('MideaDataCenterPage', 'productsBody', 'en', 'A modular portfolio that scales from a single rack to a full hyperscale hall.'),
  ('MideaDataCenterPage', 'card1Title', 'en', 'Maglev Active CDU'),
  ('MideaDataCenterPage', 'card1Body', 'en', 'Integrated maglev chiller + CDU. 50%+ space saving. PUE < 1.2.'),
  ('MideaDataCenterPage', 'card2Title', 'en', 'Industrial-Grade CDU'),
  ('MideaDataCenterPage', 'card2Body', 'en', 'Up to 2,600 kW. 24/7 operation for hyperscale environments.'),
  ('MideaDataCenterPage', 'card3Title', 'en', 'Liquid-Cooling Terminals'),
  ('MideaDataCenterPage', 'card3Body', 'en', 'Direct chip-level cooling for extreme rack heat loads.'),
  ('MideaDataCenterPage', 'card4Title', 'en', 'Air-Fluid Synergy'),
  ('MideaDataCenterPage', 'card4Body', 'en', 'Hybrid air + liquid architecture for progressive DC transition.'),
  ('MideaDataCenterPage', 'ctaTitle', 'en', 'Interested in Midea liquid cooling for your facility?'),
  ('MideaDataCenterPage', 'ctaBody', 'en', 'Tell us about your compute environment — rack density, capacity, and timeline. SUME will scope the right Midea liquid cooling configuration.'),
  ('MideaDataCenterPage', 'ctaButton', 'en', 'Get in Touch'),
  ('MideaDataCenterPage', 'backToSolutions', 'en', 'Back to Solutions'),
  ('MideaDataCenterPage', 'backToDataCenter', 'en', 'Back to Data Center'),
  ('ProjectsPage', 'metaTitle', 'en', 'Projects'),
  ('ProjectsPage', 'metaDescription', 'en', 'Selected projects across commercial, industrial, and mission-critical facilities — delivering power, cooling, monitoring, and integrated M&E infrastructure.'),
  ('ProjectsPage', 'headerEyebrow', 'en', 'Our Work'),
  ('ProjectsPage', 'headerTitle', 'en', 'Selected Projects'),
  ('ProjectsPage', 'headerDescription', 'en', 'A track record across commercial, industrial, and mission-critical facilities — delivering power, cooling, monitoring, and integrated M&E infrastructure.'),
  ('ProjectsPage', 'portfolioEyebrow', 'en', 'Project Portfolio'),
  ('ProjectsPage', 'portfolioHeading', 'en', 'Delivering infrastructure across industries and geographies.'),
  ('ProjectsPage', 'portfolioBody', 'en', 'From precision cooling retrofits to integrated M&E contracting — built for facilities that operate without interruption.'),
  ('ProjectsPage', 'resultsEyebrow', 'en', 'Proven Results'),
  ('ProjectsPage', 'resultsHeading', 'en', 'Precision Cooling — Measured Outcomes'),
  ('ProjectsPage', 'resultsBody', 'en', 'Cooling is the single largest energy load in any high-density facility. These results demonstrate the chiller and energy-efficiency capability SUME brings to critical environments.'),
  ('ProjectsPage', 'tableProject', 'en', 'Project'),
  ('ProjectsPage', 'tableLocation', 'en', 'Location'),
  ('ProjectsPage', 'tableCoolingCapacity', 'en', 'Cooling Capacity'),
  ('ProjectsPage', 'tableScope', 'en', 'Scope'),
  ('ProjectsPage', 'powerEyebrow', 'en', 'Power & Engine Capability'),
  ('ProjectsPage', 'powerHeading', 'en', 'Power Reliability You Can Verify'),
  ('ProjectsPage', 'powerBody', 'en', 'Backup power is non-negotiable for uptime. SUME''s engine capability is built on authorized, certified service — backed by engineers trained directly in Japan.'),
  ('ProjectsPage', 'ctaTitle', 'en', 'Let''s engineer your infrastructure.'),
  ('ProjectsPage', 'ctaBody', 'en', 'From mission-critical power systems to data center environments, we build infrastructure designed for performance, reliability, and uptime.'),
  ('ProjectsPage', 'ctaButton', 'en', 'Request a Consultation'),
  ('ContactPage', 'metaTitle', 'en', 'Contact'),
  ('ContactPage', 'metaDescription', 'en', 'Let''s engineer your infrastructure. Whether you''re building a new facility or optimizing an existing one, our team is ready to assess your requirements.'),
  ('ContactPage', 'headerEyebrow', 'en', 'Contact'),
  ('ContactPage', 'headerTitle', 'en', 'Let''s Engineer Your Infrastructure.'),
  ('ContactPage', 'headerDescription', 'en', 'Whether you''re building a new facility or optimizing an existing one, our team is ready to assess your requirements.'),
  ('ContactPage', 'infoHeading', 'en', 'Get in Touch'),
  ('ContactPage', 'infoBody', 'en', 'Reach our team directly or use the form — we respond within one business day.'),
  ('ContactPage', 'formHeading', 'en', 'Request a Consultation'),
  ('ContactPage', 'mapEyebrow', 'en', 'Headquarters'),
  ('ContactPage', 'mapHeading', 'en', 'Our Jakarta Headquarters'),
  ('ContactPage', 'contactHeading', 'en', 'Get in Touch'),
  ('ContactPage', 'contactBody', 'en', 'Ready to start your next engineering project? Our experts are here to provide a detailed consultation for your specific M&E needs.'),
  ('RegionalPage', 'metaTitle', 'en', 'Regional Presence'),
  ('RegionalPage', 'metaDescription', 'en', 'Regional reach across Southeast Asia. Offices anchoring delivery in Indonesia, Singapore, and Myanmar — with on-the-ground engineering, distribution, and lifetime maintenance.'),
  ('RegionalPage', 'headerEyebrow', 'en', 'Regional Presence'),
  ('RegionalPage', 'headerTitle', 'en', 'Regional Reach Across Southeast Asia.'),
  ('RegionalPage', 'headerDescription', 'en', 'Offices anchoring delivery in Indonesia, Singapore, and Myanmar — supporting clients across the region with on-the-ground engineering, distribution, and lifetime maintenance.'),
  ('RegionalPage', 'officesEyebrow', 'en', 'Our Offices'),
  ('RegionalPage', 'officesHeading', 'en', 'Engineering presence, built where our clients operate.'),
  ('RegionalPage', 'officesBody', 'en', 'Headquartered in Jakarta with regional offices across Southeast Asia — delivered and supported locally, wherever the facility runs.'),
  ('RegionalPage', 'ctaTitle', 'en', 'Operating across the region? Let''s engineer your next facility together.'),
  ('RegionalPage', 'ctaBody', 'en', 'Talk to our regional team about your power, cooling, monitoring, or M&E requirements.'),
  ('RegionalPage', 'ctaButton', 'en', 'Contact Our Regional Team'),
  ('RegionalMap', 'mapAria', 'en', 'Regional offices map'),
  ('RegionalMap', 'badgeHq', 'en', 'HQ'),
  ('RegionalMap', 'badgeOffice', 'en', 'Office')
on conflict (namespace, key, locale) do nothing;


-- ============================================================================
-- SOURCE: 20260612000001_remove_orphan_translations.sql
-- ============================================================================

delete from translation_messages
where namespace = 'AboutPage'
  and key in ('missionP1', 'missionP2', 'missionP3');

delete from translation_messages
where namespace = 'SolutionsPage'
  and key in ('integratedP1', 'integratedP2');


-- ============================================================================
-- SOURCE: 20260612000002_remove_orphan_home_translations.sql
-- ============================================================================

delete from translation_messages
where namespace = 'Home'
  and key in (
    'positioningHeadingStrong',
    'positioningHeadingRest',
    'positioningBody',
    'solutionsEyebrow',
    'contactHeading',
    'contactBody'
  );


-- ============================================================================
-- SOURCE: 20260615120000_update_solutions_cooling_copy.sql
-- ============================================================================

-- Updates the Precision Cooling & HVAC pillar copy (SolutionsPage) to the
-- Air Cooling / Liquid Cooling structure. Unlike the do-nothing seed, this
-- migration intentionally overwrites the few existing keys whose copy changed,
-- and inserts the new sub-group + liquid-cooling capability keys, so the CMS
-- (Supabase) matches messages/{id,en}.json for this section.

insert into public.translation_messages (namespace, key, locale, value) values
  ('SolutionsPage', 'pillar2Lead', 'id', 'Pendinginan menyerap sebagian besar listrik sebuah fasilitas. Salah menanganinya berarti biaya membengkak setiap bulan.'),
  ('SolutionsPage', 'pillar2GroupAirTitle', 'id', 'Pendinginan Udara'),
  ('SolutionsPage', 'pillar2Cap1Body', 'id', 'Midea, Broad, dan Hisense untuk beban pendinginan komersial dan berdensitas tinggi.'),
  ('SolutionsPage', 'pillar2Cap2Body', 'id', 'Otomasi plant, retrofit VSD, rewinding pompa. Pada satu plant 3×550 TR, kami menaikkan efisiensi dari 1,10 menjadi 0,77 kW/TR.'),
  ('SolutionsPage', 'pillar2Cap3Body', 'id', 'Klien tidak membayar di muka. Powerbrain mendanai, memasang, dan mengoperasikan sistem pendingin; kinerjanya dijamin secara kontraktual dan didukung performance bond setara asuransi, diukur terhadap standar IPMVP.'),
  ('SolutionsPage', 'pillar2GroupLiquidTitle', 'id', 'Pendinginan Cair (Data Center & Komputasi Berdensitas Tinggi)'),
  ('SolutionsPage', 'pillar2Cap4Title', 'id', 'Maglev Active CDU'),
  ('SolutionsPage', 'pillar2Cap4Body', 'id', 'Chiller maglev dan CDU Midea yang terintegrasi dalam satu sasis. Menghemat lebih dari 50% ruang lantai. PUE di bawah 1,2.'),
  ('SolutionsPage', 'pillar2Cap5Title', 'id', 'Industrial-Grade CDU'),
  ('SolutionsPage', 'pillar2Cap5Body', 'id', 'Kapasitas pendinginan hingga 2.600 kW, dibangun untuk operasi 24/7 di lingkungan rak hyperscale.'),
  ('SolutionsPage', 'pillar2Cap6Title', 'id', 'Liquid-Cooling Terminals'),
  ('SolutionsPage', 'pillar2Cap6Body', 'id', 'Pendinginan langsung tingkat chip dan prosesor untuk beban termal ekstrem di rak.'),
  ('SolutionsPage', 'pillar2Cap7Title', 'id', 'Air-Fluid Synergy'),
  ('SolutionsPage', 'pillar2Cap7Body', 'id', 'Arsitektur hibrida Midea yang menyelaraskan pendingin presisi udara dengan pendinginan cair tingkat rak.'),
  ('SolutionsPage', 'pillar2CatalogCta', 'id', 'Lihat katalog lengkap produk data center Midea'),
  ('SolutionsPage', 'pillar2Lead', 'en', 'Cooling is where most of a facility''s electricity goes. Getting it wrong costs money every month.'),
  ('SolutionsPage', 'pillar2GroupAirTitle', 'en', 'Air Cooling'),
  ('SolutionsPage', 'pillar2Cap1Body', 'en', 'Midea, Broad, and Hisense for high-density and commercial cooling loads.'),
  ('SolutionsPage', 'pillar2Cap2Body', 'en', 'Plant automation, VSD retrofits, pump rewinding. On one 3×550 TR plant, we took efficiency from 1.10 to 0.77 kW/TR.'),
  ('SolutionsPage', 'pillar2Cap3Body', 'en', 'The client pays nothing upfront. Powerbrain finances, installs, and operates the cooling system; performance is contractually guaranteed and backed by an insurance-grade performance bond, measured against the IPMVP standard.'),
  ('SolutionsPage', 'pillar2GroupLiquidTitle', 'en', 'Liquid Cooling (Data Center & High-Density Compute)'),
  ('SolutionsPage', 'pillar2Cap4Title', 'en', 'Maglev Active CDU'),
  ('SolutionsPage', 'pillar2Cap4Body', 'en', 'Midea''s integrated maglev chiller and CDU in a single chassis. Saves over 50% floor space. PUE below 1.2.'),
  ('SolutionsPage', 'pillar2Cap5Title', 'en', 'Industrial-Grade CDU'),
  ('SolutionsPage', 'pillar2Cap5Body', 'en', 'Up to 2,600 kW cooling capacity, built for 24/7 continuous operation across hyperscale rack environments.'),
  ('SolutionsPage', 'pillar2Cap6Title', 'en', 'Liquid-Cooling Terminals'),
  ('SolutionsPage', 'pillar2Cap6Body', 'en', 'Direct chip and processor-level cooling for extreme thermal loads at the rack.'),
  ('SolutionsPage', 'pillar2Cap7Title', 'en', 'Air-Fluid Synergy'),
  ('SolutionsPage', 'pillar2Cap7Body', 'en', 'Midea''s hybrid architecture coordinating precision air conditioning with rack-level liquid cooling.'),
  ('SolutionsPage', 'pillar2CatalogCta', 'en', 'See full Midea data center product catalog')
on conflict (namespace, key, locale) do update set value = excluded.value;


-- ============================================================================
-- SOURCE: 20260702090000_blog.sql
-- ============================================================================

-- Blog feature — schema, RLS, storage, and seed.
--
-- Mirrors the security model established in 20260610090000_cms_translations.sql:
--   * Public (anon) may READ published content only.
--   * All writes are admin-only, gated by the existing public.is_admin() helper.
--   * Explicit Data API GRANTs are required — new public tables are no longer
--     auto-exposed to the anon/authenticated roles (see supabase/config.toml).
--
-- Reuses existing helpers from the translations migration:
--   * public.is_admin()      — SECURITY INVOKER admin check (respects RLS)
--   * public.set_updated_at()— keeps updated_at fresh on UPDATE
--
-- Tables (all snake_case, blog_ prefixed):
--   blog_authors, blog_categories, blog_tags, blog_posts,
--   blog_post_tags (junction), blog_references, blog_post_views (analytics)

-- ===========================================================================
-- Reusable published-visibility predicate is inlined in each policy/function:
--   is_draft = false
--   and published_at is not null and published_at <= now()
--   and (scheduled_at is null or scheduled_at <= now())
-- A post is public only once it is not a draft, its publish time has passed,
-- and any schedule time has passed. now() is evaluated per query, so scheduled
-- posts appear automatically once cached reads revalidate (see src/lib/blog.ts).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- blog_authors
-- ---------------------------------------------------------------------------
create table if not exists public.blog_authors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  photo      text,
  bio        text,
  linkedin   text,
  email      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_authors enable row level security;

drop trigger if exists blog_authors_set_updated_at on public.blog_authors;
create trigger blog_authors_set_updated_at
  before update on public.blog_authors
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blog_categories
-- ---------------------------------------------------------------------------
create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.blog_categories enable row level security;

drop trigger if exists blog_categories_set_updated_at on public.blog_categories;
create trigger blog_categories_set_updated_at
  before update on public.blog_categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blog_tags
-- ---------------------------------------------------------------------------
create table if not exists public.blog_tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

alter table public.blog_tags enable row level security;

-- ---------------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  thumbnail        text,
  content          text not null default '',
  excerpt          text,
  meta_title       text,
  meta_description text,
  author_id        uuid references public.blog_authors (id) on delete set null,
  category_id      uuid references public.blog_categories (id) on delete set null,
  reading_time     int not null default 0,
  views            int not null default 0,
  featured         boolean not null default false,
  is_draft         boolean not null default true,
  published_at     timestamptz,
  scheduled_at     timestamptz,
  internal_links   jsonb not null default '[]'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists blog_posts_category_id_idx  on public.blog_posts (category_id);
create index if not exists blog_posts_author_id_idx    on public.blog_posts (author_id);
create index if not exists blog_posts_featured_idx     on public.blog_posts (featured);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blog_post_tags (many-to-many)
-- ---------------------------------------------------------------------------
create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id  uuid not null references public.blog_tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.blog_post_tags enable row level security;
create index if not exists blog_post_tags_tag_id_idx on public.blog_post_tags (tag_id);

-- ---------------------------------------------------------------------------
-- blog_references (article citations)
-- ---------------------------------------------------------------------------
create table if not exists public.blog_references (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.blog_posts (id) on delete cascade,
  title       text not null,
  url         text not null,
  accessed_at timestamptz,
  position    int not null default 0
);

alter table public.blog_references enable row level security;
create index if not exists blog_references_post_id_idx on public.blog_references (post_id);

-- ---------------------------------------------------------------------------
-- blog_post_views (append-only analytics for "popular last 30 days")
-- ---------------------------------------------------------------------------
create table if not exists public.blog_post_views (
  id        bigint generated always as identity primary key,
  post_id   uuid not null references public.blog_posts (id) on delete cascade,
  viewed_at timestamptz not null default now()
);

alter table public.blog_post_views enable row level security;
create index if not exists blog_post_views_viewed_at_idx      on public.blog_post_views (viewed_at);
create index if not exists blog_post_views_post_viewed_at_idx on public.blog_post_views (post_id, viewed_at);

-- ===========================================================================
-- RLS policies
-- ===========================================================================

-- blog_posts: public sees published; admins see everything. The two SELECT
-- policies are OR-combined, so an admin (authenticated) sees drafts too.
drop policy if exists "blog_posts_select_published" on public.blog_posts;
create policy "blog_posts_select_published"
  on public.blog_posts
  for select
  to anon, authenticated
  using (
    is_draft = false
    and published_at is not null and published_at <= now()
    and (scheduled_at is null or scheduled_at <= now())
  );

drop policy if exists "blog_posts_select_admin" on public.blog_posts;
create policy "blog_posts_select_admin"
  on public.blog_posts
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "blog_posts_insert_admin" on public.blog_posts;
create policy "blog_posts_insert_admin"
  on public.blog_posts for insert to authenticated
  with check (public.is_admin());

drop policy if exists "blog_posts_update_admin" on public.blog_posts;
create policy "blog_posts_update_admin"
  on public.blog_posts for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog_posts_delete_admin" on public.blog_posts;
create policy "blog_posts_delete_admin"
  on public.blog_posts for delete to authenticated
  using (public.is_admin());

-- Taxonomy + junction + references: publicly readable (catalog data, not
-- sensitive), admin-only writes. This matches the simple, proven model used by
-- translation_messages.
do $$
declare
  t text;
begin
  foreach t in array array[
    'blog_authors', 'blog_categories', 'blog_tags', 'blog_post_tags', 'blog_references'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_select_public', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_select_public', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_insert_admin', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin())',
      t || '_insert_admin', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_update_admin', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_update_admin', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_delete_admin', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin())',
      t || '_delete_admin', t
    );
  end loop;
end $$;

-- blog_post_views: no public read/write. Admins may read for analytics; writes
-- happen only through the SECURITY DEFINER record_post_view() function below.
drop policy if exists "blog_post_views_select_admin" on public.blog_post_views;
create policy "blog_post_views_select_admin"
  on public.blog_post_views for select to authenticated
  using (public.is_admin());

-- ===========================================================================
-- Functions
-- ===========================================================================

-- Records a view for a published post: appends an event row (for the 30-day
-- popularity window) and bumps the denormalized total counter. SECURITY DEFINER
-- so anonymous visitors can call it without any table-level write grant; it only
-- ever touches these two tables and only for a post that is actually public.
create or replace function public.record_post_view(p_slug text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_post_id uuid;
begin
  select id into v_post_id
  from public.blog_posts
  where slug = p_slug
    and is_draft = false
    and published_at is not null and published_at <= now()
    and (scheduled_at is null or scheduled_at <= now());

  if v_post_id is null then
    return;
  end if;

  insert into public.blog_post_views (post_id) values (v_post_id);
  update public.blog_posts set views = views + 1 where id = v_post_id;
end;
$$;

-- Returns published posts ordered by view count within the last p_days days.
-- SECURITY DEFINER so anon can rank by the private blog_post_views table without
-- being able to read it directly; published-only filter is enforced inside.
create or replace function public.get_popular_posts(p_days int default 30, p_limit int default 5)
returns setof public.blog_posts
language sql
stable
security definer
set search_path = ''
as $$
  select p.*
  from public.blog_posts p
  left join public.blog_post_views v
    on v.post_id = p.id
   and v.viewed_at >= now() - make_interval(days => p_days)
  where p.is_draft = false
    and p.published_at is not null and p.published_at <= now()
    and (p.scheduled_at is null or p.scheduled_at <= now())
  group by p.id
  order by count(v.id) desc, p.published_at desc
  limit p_limit;
$$;

-- ===========================================================================
-- Data API grants (RLS still gates which rows are visible/editable)
-- ===========================================================================
grant select on public.blog_posts      to anon, authenticated;
grant select on public.blog_authors    to anon, authenticated;
grant select on public.blog_categories to anon, authenticated;
grant select on public.blog_tags       to anon, authenticated;
grant select on public.blog_post_tags  to anon, authenticated;
grant select on public.blog_references to anon, authenticated;

grant insert, update, delete on public.blog_posts      to authenticated;
grant insert, update, delete on public.blog_authors    to authenticated;
grant insert, update, delete on public.blog_categories to authenticated;
grant insert, update, delete on public.blog_tags       to authenticated;
grant insert, update, delete on public.blog_post_tags  to authenticated;
grant insert, update, delete on public.blog_references to authenticated;

grant select on public.blog_post_views to authenticated;

grant execute on function public.record_post_view(text) to anon, authenticated;
grant execute on function public.get_popular_posts(int, int) to anon, authenticated;

-- ===========================================================================
-- Storage bucket: blog-assets (public read, admin-only write)
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('blog-assets', 'blog-assets', true)
on conflict (id) do nothing;

drop policy if exists "blog_assets_read_public" on storage.objects;
create policy "blog_assets_read_public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'blog-assets');

drop policy if exists "blog_assets_insert_admin" on storage.objects;
create policy "blog_assets_insert_admin"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-assets' and public.is_admin());

drop policy if exists "blog_assets_update_admin" on storage.objects;
create policy "blog_assets_update_admin"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-assets' and public.is_admin())
  with check (bucket_id = 'blog-assets' and public.is_admin());

drop policy if exists "blog_assets_delete_admin" on storage.objects;
create policy "blog_assets_delete_admin"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-assets' and public.is_admin());

-- ===========================================================================
-- Seed: one author + starter categories/tags (idempotent).
-- Content is Indonesian (the blog is ID-only).
-- ===========================================================================
insert into public.blog_authors (name, slug, bio, email)
values (
  'Tim Redaksi SUME',
  'tim-redaksi-sume',
  'Tim editorial PT. Solusi Utama Mekanikal Elektrikal (SUME) yang membahas solusi mekanikal, elektrikal, dan data center.',
  'projects@sumeid.com'
)
on conflict (slug) do nothing;

insert into public.blog_categories (name, slug, description)
values
  ('Data Center',            'data-center',            'Wawasan seputar perancangan, operasi, dan keandalan data center.'),
  ('Kelistrikan & Energi',   'kelistrikan-energi',     'Topik kelistrikan, efisiensi energi, dan keandalan daya.'),
  ('Precision Cooling',      'precision-cooling',      'Sistem pendingin presisi untuk fasilitas kritikal.'),
  ('Insight Industri',       'insight-industri',       'Tren dan analisis industri mekanikal & elektrikal.')
on conflict (slug) do nothing;

insert into public.blog_tags (name, slug)
values
  ('Data Center',       'data-center'),
  ('Efisiensi Energi',  'efisiensi-energi'),
  ('Keandalan',         'keandalan'),
  ('Precision Cooling', 'precision-cooling')
on conflict (slug) do nothing;


-- ============================================================================
-- SOURCE: 20260703090000_footer_copyright_drop_legal.sql
-- ============================================================================

-- Drops the {legal} placeholder from the footer copyright line. The legal
-- entity name is no longer shown, so the CMS-managed Footer.copyright value is
-- overwritten in place (unlike the do-nothing seed). The footer still passes an
-- empty `legal` arg, so any lingering fallback string renders without error and
-- this cleaned value shows no dangling "·" separator.

insert into public.translation_messages (namespace, key, locale, value) values
  ('Footer', 'copyright', 'id', '© {year} {brand}. Seluruh hak cipta dilindungi.'),
  ('Footer', 'copyright', 'en', '© {year} {brand}. All rights reserved.')
on conflict (namespace, key, locale) do update set value = excluded.value;


-- ============================================================================
-- Post-setup (not part of the original migrations)
-- ============================================================================

-- Defensive re-grant: the admin UI calls is_admin() via supabase.rpc(). Default
-- Postgres privileges already allow this, but some self-hosted instances strip
-- PUBLIC execute from functions, so grant it explicitly.
grant execute on function public.is_admin() to authenticated;

-- Verification: run this output check after the script finishes.
-- admin_users must be 1 — if it is 0, the auth user did not exist yet; create
-- it (see prerequisite at the top), then re-run:
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'audifirdi@gmail.com'
--   on conflict (user_id) do nothing;
select 'admin_users' as tbl, count(*)::text as row_count from public.admin_users
union all select 'translation_messages', count(*)::text from public.translation_messages
union all select 'blog_authors',    count(*)::text from public.blog_authors
union all select 'blog_categories', count(*)::text from public.blog_categories
union all select 'blog_tags',       count(*)::text from public.blog_tags
union all select 'blog_posts',      count(*)::text from public.blog_posts
union all select 'bucket:blog-assets', count(*)::text from storage.buckets where id = 'blog-assets';
