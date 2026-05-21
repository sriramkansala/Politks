-- Additional major Indian parties — 2024 Lok Sabha manifestos
-- Adds: CPI(M), CPI, AITC/TMC, SP, NCP(SP), Shiv Sena (UBT), YSRCP, BSP
-- Idempotent: inserts parties if missing, then attaches manifesto + promises.
-- Run AFTER 0001_init.sql.

-- ── 1. Parties ────────────────────────────────────────────────────────────
INSERT INTO parties (slug, name, short_name, level, founded_year, color_hex, website_url)
VALUES
  ('cpim',    'Communist Party of India (Marxist)',                         'CPI(M)',   'national', 1964, '#C8102E', 'https://cpim.org'),
  ('cpi',     'Communist Party of India',                                    'CPI',      'national', 1925, '#D32F2F', 'https://www.communistparty.in'),
  ('aitc',    'All India Trinamool Congress',                                'AITC',     'national', 1998, '#20603D', 'https://aitcofficial.org'),
  ('sp',      'Samajwadi Party',                                             'SP',       'state',    1992, '#E60026', 'https://samajwadiparty.in'),
  ('ncp-sp',  'Nationalist Congress Party (Sharadchandra Pawar)',            'NCP(SP)',  'national', 1999, '#0066B3', 'https://ncpspeaks.org'),
  ('shs-ubt', 'Shiv Sena (Uddhav Balasaheb Thackeray)',                      'SHS(UBT)', 'state',    1966, '#F58220', 'https://shivsenaubt.in'),
  ('ysrcp',   'Yuvajana Sramika Rythu Congress Party',                       'YSRCP',    'state',    2011, '#0F9D58', 'https://www.ysrcongress.com'),
  ('bsp',     'Bahujan Samaj Party',                                         'BSP',      'national', 1984, '#22409A', 'https://www.bspindia.org')
ON CONFLICT (slug) DO NOTHING;

-- ── 2. Manifestos + Promises ──────────────────────────────────────────────

-- CPI(M)
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'cpim';
  INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024, 'CPI(M) 18th Lok Sabha Election Manifesto 2024',
          'https://cpim.org/wp-content/uploads/old/documents/election_manifesto_english_april_2024.pdf', 'en', 54, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, category, tags, target_metric, geography, is_headline) VALUES
  (v_mf, v_party, 'Right to Work as a constitutional right',
   'Include the Right to Work as a constitutional right and urgently fill vacancies in government and PSU posts.',
   'employment', ARRAY['right to work'], NULL, 'national', true),
  (v_mf, v_party, 'Education budget = 6% of GDP',
   'Raise budgetary allocation for education to at least 6% of GDP.',
   'education', ARRAY['education spend'],
   '{"metric":"education spend","value":6,"unit":"percent of GDP"}'::jsonb, 'national', true),
  (v_mf, v_party, 'Reverse PSU privatization',
   'Revisit and reverse privatization of public sector undertakings to protect economic sovereignty.',
   'economy', ARRAY['PSU','privatization'], NULL, 'national', true),
  (v_mf, v_party, 'Restore Old Pension Scheme',
   'Restore the Old Pension Scheme for all government employees, including paramilitary.',
   'social_welfare', ARRAY['OPS'], NULL, 'national', false),
  (v_mf, v_party, 'Scrap CAA',
   'Repeal the Citizenship Amendment Act and abandon NRC plans nationwide.',
   'secularism', ARRAY['CAA','NRC'], NULL, 'national', false),
  (v_mf, v_party, 'MGNREGA: 200 days at Rs 700',
   'Increase MGNREGA work guarantee to 200 days a year with a minimum wage of Rs 700.',
   'employment', ARRAY['MGNREGA'],
   '{"metric":"wage","value":700,"unit":"INR/day"}'::jsonb, 'national', true),
  (v_mf, v_party, 'Wealth and inheritance tax',
   'Introduce wealth and inheritance tax on the super-rich and raise corporate tax to fund welfare.',
   'economy', ARRAY['taxation','inequality'], NULL, 'national', false),
  (v_mf, v_party, 'Women''s reservation immediately',
   'Implement one-third women''s reservation in Lok Sabha and state assemblies immediately.',
   'women', ARRAY['women''s reservation'], NULL, 'national', false),
  (v_mf, v_party, 'Remove 50% reservation cap',
   'Lift the 50% ceiling on SC/ST/OBC reservations.',
   'social_welfare', ARRAY['reservations'], NULL, 'national', false),
  (v_mf, v_party, 'ED/CBI under parliamentary oversight',
   'Bring the ED, CBI and other central agencies under parliamentary oversight to curb misuse.',
   'governance', ARRAY['ED','CBI'], NULL, 'national', false);
END $$;

-- CPI
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'cpi';
  INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024, 'CPI Lok Sabha 2024 Manifesto',
          'https://www.communistparty.in/post/cpi-manifesto-2024', 'en', 40, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, category, tags, target_metric, geography, is_headline) VALUES
  (v_mf, v_party, 'Restore Old Pension Scheme',
   'Complete restoration of the Old Pension Scheme for all government employees.',
   'social_welfare', ARRAY['OPS'], NULL, 'national', true),
  (v_mf, v_party, 'Scrap CAA',
   'Abolish the Citizenship Amendment Act.',
   'secularism', ARRAY['CAA'], NULL, 'national', true),
  (v_mf, v_party, 'ED & CBI under Parliament',
   'Bring the ED and CBI under the purview of Parliament to ensure impartiality.',
   'governance', ARRAY['ED','CBI'], NULL, 'national', true),
  (v_mf, v_party, 'MGNREGA: 200 days at Rs 700',
   'Increase MGNREGA minimum wage to Rs 700 and available work days to 200 per year.',
   'employment', ARRAY['MGNREGA'],
   '{"metric":"wage","value":700,"unit":"INR/day"}'::jsonb, 'national', true),
  (v_mf, v_party, 'Abolish Governor''s office',
   'Abolish the office of Governor to strengthen federalism.',
   'federalism', ARRAY['governor'], NULL, 'national', false),
  (v_mf, v_party, 'Reinstate Planning Commission',
   'Dismantle NITI Aayog and reinstate the Planning Commission.',
   'governance', ARRAY['planning commission'], NULL, 'national', false),
  (v_mf, v_party, 'Wealth, inheritance & higher corporate tax',
   'Introduce wealth tax, inheritance tax and higher corporate tax to address inequality.',
   'economy', ARRAY['taxation'], NULL, 'national', false),
  (v_mf, v_party, 'Reservations in private sector',
   'Ensure reservations for SC/ST/OBC in the private sector.',
   'social_welfare', ARRAY['reservations'], NULL, 'national', false),
  (v_mf, v_party, 'Remove 50% reservation cap',
   'Remove the 50% ceiling on reservations to enable proportionate representation.',
   'social_welfare', ARRAY['reservations'], NULL, 'national', false);
END $$;

-- AITC / TMC
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'aitc';
  INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024, 'Didir Shopoth — AITC Lok Sabha Manifesto 2024',
          'https://aitcofficial.org/manifesto/', 'en', 36, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, category, tags, target_metric, geography, is_headline) VALUES
  (v_mf, v_party, 'MGNREGA: 100 days at Rs 400',
   'Guarantee 100 days of work at Rs 400/day to every job-card holder.',
   'employment', ARRAY['MGNREGA'],
   '{"metric":"wage","value":400,"unit":"INR/day"}'::jsonb, 'national', true),
  (v_mf, v_party, '1-year paid apprenticeship for graduates',
   'One-year apprenticeship with monthly stipend to every graduate/diploma holder under 25.',
   'employment', ARRAY['apprenticeship'], NULL, 'national', true),
  (v_mf, v_party, 'Kanyashree extended nationwide',
   'Extend the Kanyashree scholarship-for-girls scheme to every state across India.',
   'women', ARRAY['Kanyashree'], NULL, 'national', true),
  (v_mf, v_party, 'Withdraw CAA, stop NRC, oppose UCC',
   'Withdraw CAA, halt NRC process and oppose imposition of a Uniform Civil Code.',
   'secularism', ARRAY['CAA','NRC','UCC'], NULL, 'national', true),
  (v_mf, v_party, 'Universal housing',
   'Guarantee a pucca home to every Indian family without one.',
   'infrastructure', ARRAY['housing'], NULL, 'national', false),
  (v_mf, v_party, 'Free LPG cylinders',
   'Provide free LPG cylinders to BPL families.',
   'social_welfare', ARRAY['LPG'], NULL, 'national', false),
  (v_mf, v_party, 'Assured MSP for farmers',
   'Legally assured MSP for all major crops.',
   'agriculture', ARRAY['MSP'], NULL, 'national', false),
  (v_mf, v_party, 'SC/ST/OBC scholarships',
   'Expand scholarships for SC, ST and OBC students.',
   'education', ARRAY['scholarships'], NULL, 'national', false),
  (v_mf, v_party, 'Restore J&K statehood',
   'Restore full statehood to Jammu & Kashmir.',
   'federalism', ARRAY['J&K'], NULL, 'national', false),
  (v_mf, v_party, 'Caste census',
   'Conduct a nationwide caste census.',
   'social_welfare', ARRAY['caste census'], NULL, 'national', false);
END $$;

-- Samajwadi Party
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'sp';
  INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024, 'Hamara Adhikar — Janata Ka Mangpatra (SP Lok Sabha Manifesto 2024)',
          'https://samajwadiparty.in/images/MANIFESTO_2024.pdf', 'en', 28, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, category, tags, target_metric, geography, is_headline) VALUES
  (v_mf, v_party, 'Caste census by 2025',
   'Conduct a nationwide caste census by 2025 and roll out social-justice measures by 2029.',
   'social_welfare', ARRAY['caste census','PDA'],
   '{"metric":"deadline","value":2025,"unit":"year","deadline_year":2025}'::jsonb, 'national', true),
  (v_mf, v_party, 'Free education KG to PG for girls',
   'Free education for girls from KG to post-graduation in government institutions.',
   'education', ARRAY['girls','free education'], NULL, 'national', true),
  (v_mf, v_party, 'Education budget = 6% of GDP',
   'Raise education budget from 3% to 6% of GDP.',
   'education', ARRAY['education spend'],
   '{"metric":"education spend","value":6,"unit":"percent of GDP"}'::jsonb, 'national', false),
  (v_mf, v_party, 'Urban Employment Guarantee Act',
   'Enact urban-employment-guarantee law modeled on MGNREGA in first parliamentary session.',
   'employment', ARRAY['urban MGNREGA'], NULL, 'national', true),
  (v_mf, v_party, 'Fill all vacant government posts',
   'Immediately fill every vacant position across central government and PSUs.',
   'employment', ARRAY['jobs'], NULL, 'national', false),
  (v_mf, v_party, 'MSP guarantee on Swaminathan formula',
   'Legally guarantee MSP on all crops using the Swaminathan formula.',
   'agriculture', ARRAY['MSP','Swaminathan'], NULL, 'national', true),
  (v_mf, v_party, 'Scrap Agniveer',
   'Scrap the Agniveer scheme and resume regular recruitment to armed forces.',
   'governance', ARRAY['Agnipath'], NULL, 'national', false),
  (v_mf, v_party, 'Restore Old Pension Scheme',
   'Reinstate the Old Pension Scheme for all government employees including paramilitary.',
   'social_welfare', ARRAY['OPS'], NULL, 'national', false),
  (v_mf, v_party, 'Women BPL pension of Rs 3,000/month',
   'Monthly pension of up to Rs 3,000 for women from BPL families.',
   'women', ARRAY['pension'],
   '{"metric":"monthly pension","value":3000,"unit":"INR/month"}'::jsonb, 'national', false);
END $$;

-- NCP (SP)
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'ncp-sp';
  INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024, 'Shapath Patra — NCP(SP) Lok Sabha Manifesto 2024',
          'https://www.deccanherald.com/elections/india/lok-sabha-polls-2024-ncp-sp-unveils-manifesto-favours-caste-census-stresses-on-welfare-of-farmers-women-lgbtq-community-2993974', 'en', 22, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, category, tags, target_metric, geography, is_headline) VALUES
  (v_mf, v_party, 'LPG cylinder at Rs 500',
   'Cap LPG cylinder price at Rs 500, subsidised by government if necessary.',
   'social_welfare', ARRAY['LPG'],
   '{"metric":"LPG price","value":500,"unit":"INR/cylinder"}'::jsonb, 'national', true),
  (v_mf, v_party, 'Restructure petrol & diesel tax',
   'Restructure central excise on petrol and diesel to reduce pump prices.',
   'economy', ARRAY['fuel'], NULL, 'national', false),
  (v_mf, v_party, '50% reservation for women in jobs',
   '50% reservation for women in government and public-sector jobs.',
   'women', ARRAY['women''s reservation'],
   '{"metric":"reservation","value":50,"unit":"percent"}'::jsonb, 'national', true),
  (v_mf, v_party, 'Nationwide caste census',
   'Conduct a nationwide socio-economic and caste census.',
   'social_welfare', ARRAY['caste census'], NULL, 'national', true),
  (v_mf, v_party, 'Scrap Agnipath',
   'Scrap the Agnipath scheme; restore regular defence recruitment.',
   'governance', ARRAY['Agnipath'], NULL, 'national', false),
  (v_mf, v_party, 'Farmers'' welfare commission',
   'Dedicated statutory commission for farmers'' welfare.',
   'agriculture', ARRAY['farmers'], NULL, 'national', false),
  (v_mf, v_party, 'Full statehood for J&K',
   'Restore full statehood to Jammu & Kashmir.',
   'federalism', ARRAY['J&K'], NULL, 'national', false),
  (v_mf, v_party, 'Reject one-nation-one-election',
   'Reject ''One Nation, One Election'' as undermining federalism.',
   'federalism', ARRAY['ONOE'], NULL, 'national', false),
  (v_mf, v_party, 'Review CAA, NRC, UAPA',
   'Review and reform CAA, NRC, UAPA and laws conflicting with constitutional principles.',
   'secularism', ARRAY['CAA','UAPA'], NULL, 'national', false),
  (v_mf, v_party, 'Welfare for LGBTQ community',
   'Welfare measures and anti-discrimination protections for LGBTQ community.',
   'social_welfare', ARRAY['LGBTQ'], NULL, 'national', false);
END $$;

-- Shiv Sena (UBT)
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'shs-ubt';
  INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024, 'Vachan Nama — SHS(UBT) Lok Sabha Manifesto 2024',
          'https://blog.mumbaivotes.com/wp-content/uploads/2024/05/SHSUBT_LS2024_Manifesto_Design_Full.pdf', 'en', 30, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, category, tags, target_metric, geography, is_headline) VALUES
  (v_mf, v_party, 'Farm loan waiver and revised crop insurance',
   'Farm-loan waiver and revision of crop-insurance conditions for farmers.',
   'agriculture', ARRAY['loan waiver'], NULL, 'national', true),
  (v_mf, v_party, 'GST-free farm equipment & seeds',
   'Exempt agricultural equipment and seeds from GST.',
   'agriculture', ARRAY['GST'], NULL, 'national', false),
  (v_mf, v_party, 'Stable price of 5 essential goods',
   'Keep prices of wheat, rice, oil, pulses and sugar stable for five years.',
   'economy', ARRAY['inflation','essentials'], NULL, 'national', true),
  (v_mf, v_party, 'District-level jobs for rural youth',
   'Employment opportunities at district level to curb rural-to-urban migration.',
   'employment', ARRAY['rural jobs'], NULL, 'national', false),
  (v_mf, v_party, 'Eco-friendly industries only',
   'Permit only eco-friendly projects and industries in Maharashtra.',
   'environment', ARRAY['environment'], NULL, 'national', false),
  (v_mf, v_party, 'Scrap Dharavi redevelopment project',
   'Scrap the current Dharavi redevelopment project; redesign after resident consultation.',
   'infrastructure', ARRAY['Dharavi','Mumbai'], NULL, 'national', true),
  (v_mf, v_party, 'Rs 25 lakh cashless health cover',
   'Cashless medical treatment of up to Rs 25 lakh/year per family.',
   'healthcare', ARRAY['insurance'],
   '{"metric":"health cover","value":2500000,"unit":"INR/family/year"}'::jsonb, 'national', true);
END $$;

-- YSRCP
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'ysrcp';
  INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024, 'Navaratnalu Plus — YSRCP Manifesto 2024',
          'https://www.business-standard.com/elections/lok-sabha-election/ls-polls-pension-increase-vizag-as-executive-capital-in-ysrcp-manifesto-124042700556_1.html', 'en', 16, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, category, tags, target_metric, geography, is_headline) VALUES
  (v_mf, v_party, 'Pension hike to Rs 3,500/month by 2029',
   'Raise welfare pension from Rs 3,000 to Rs 3,250 by Jan 2028 and Rs 3,500 by Jan 2029.',
   'social_welfare', ARRAY['pension'],
   '{"metric":"pension","value":3500,"unit":"INR/month","deadline_year":2029}'::jsonb, 'national', true),
  (v_mf, v_party, 'Visakhapatnam as executive capital',
   'Make Visakhapatnam the executive capital of Andhra Pradesh.',
   'federalism', ARRAY['Vizag','capital'], NULL, 'national', true),
  (v_mf, v_party, 'Amma Vodi raised to Rs 17,000',
   'Raise annual Amma Vodi support from Rs 15,000 to Rs 17,000.',
   'education', ARRAY['Amma Vodi'],
   '{"metric":"support","value":17000,"unit":"INR/year"}'::jsonb, 'national', false),
  (v_mf, v_party, 'YSR Cheyutha doubled to Rs 1.5 lakh',
   'Double YSR Cheyutha benefit from Rs 75,000 to Rs 1.5 lakh across four phases.',
   'women', ARRAY['Cheyutha'],
   '{"metric":"benefit","value":150000,"unit":"INR/4 years"}'::jsonb, 'national', false),
  (v_mf, v_party, 'Farmer insurance raised to Rs 16,000',
   'Increase Rythu Bharosa input subsidy/insurance from Rs 13,500 to Rs 16,000 per acre.',
   'agriculture', ARRAY['Rythu Bharosa'],
   '{"metric":"input subsidy","value":16000,"unit":"INR/acre"}'::jsonb, 'national', false),
  (v_mf, v_party, 'Polavaram & 17 medical colleges',
   'Complete Polavaram project along with 17 medical colleges, 10 fishing harbours and Bhogapuram airport.',
   'infrastructure', ARRAY['Polavaram'], NULL, 'national', true),
  (v_mf, v_party, 'Separate panchayats for SC-majority villages',
   'Create separate panchayats in villages with significant SC population and at least 500 houses.',
   'dalit_adivasi', ARRAY['panchayat','SC'], NULL, 'national', false);
END $$;

-- BSP
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'bsp';
  INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, status)
  VALUES (v_party, 'lok_sabha', 2024, 'BSP 2024 Election Agenda (no formal manifesto)',
          'https://www.business-standard.com/elections/lok-sabha-election/bsp-supremo-mayawati-promises-to-work-for-statehood-for-western-up-124041400653_1.html', 'en', 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, category, tags, target_metric, geography, is_headline) VALUES
  (v_mf, v_party, 'Separate state for Western UP',
   'Take concrete steps to carve out a separate state from Western Uttar Pradesh districts.',
   'federalism', ARRAY['Western UP','statehood'], NULL, 'national', true),
  (v_mf, v_party, 'Allahabad HC bench in Meerut',
   'Establish a bench of the Allahabad High Court in Meerut for Western UP.',
   'justice', ARRAY['HC bench'], NULL, 'national', true),
  (v_mf, v_party, 'Permanent govt jobs for unemployed',
   'Provide permanent government jobs to unemployed Dalits, Muslims, the poor and youth.',
   'employment', ARRAY['jobs','SC'], NULL, 'national', true),
  (v_mf, v_party, 'Fair price for sugarcane farmers',
   'Ensure remunerative sugarcane prices and clear pending arrears within 14 days.',
   'agriculture', ARRAY['sugarcane'], NULL, 'national', false),
  (v_mf, v_party, 'SC/ST/OBC representation in tickets',
   'Give appropriate share to SCs, OBCs and minorities in candidate selection and governance.',
   'dalit_adivasi', ARRAY['representation'], NULL, 'national', false),
  (v_mf, v_party, 'Restore Old Pension Scheme',
   'Restore the Old Pension Scheme for all government employees.',
   'social_welfare', ARRAY['OPS'], NULL, 'national', false);
END $$;
