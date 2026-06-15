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
