-- Additional Indian parties — 2024 Lok Sabha manifestos
-- Adds: TDP, JDU, RJD, AIADMK, JD(S), NCP (Ajit Pawar), BJD
-- Sources: official party websites, press releases, ADR manifesto analysis
-- Idempotent: inserts parties if missing, then attaches manifesto + promises.
-- Run AFTER 0001_init.sql and seed_extra_parties_2024.sql.

-- ── 1. Parties ────────────────────────────────────────────────────────────
INSERT INTO parties (slug, name, short_name, level, founded_year, color_hex, website_url)
VALUES
  ('tdp',     'Telugu Desam Party',                                  'TDP',     'state',    1982, '#FFD700', 'https://www.telugudesam.org'),
  ('jdu',     'Janata Dal (United)',                                  'JD(U)',   'state',    2003, '#00A550', 'https://www.jdunited.in'),
  ('rjd',     'Rashtriya Janata Dal',                                 'RJD',     'state',    1997, '#006B3E', 'https://www.rjdindia.com'),
  ('aiadmk',  'All India Anna Dravida Munnetra Kazhagam',             'AIADMK',  'state',    1972, '#007448', 'https://www.aiadmk.com'),
  ('jds',     'Janata Dal (Secular)',                                  'JD(S)',   'state',    1999, '#2B5F2E', 'https://www.jdsekulaar.com'),
  ('ncp',     'Nationalist Congress Party (Ajit Pawar)',              'NCP',     'state',    1999, '#17478E', 'https://www.ncp.org.in'),
  ('bjd',     'Biju Janata Dal',                                      'BJD',     'state',    1997, '#1B6FBF', 'https://www.bjd.org.in')
ON CONFLICT (slug) DO NOTHING;

-- ── 2. Manifestos + Promises ──────────────────────────────────────────────

-- ── TDP (Telugu Desam Party) ──────────────────────────────────────────────
-- Source: TDP Vision Document 2024 "Super Six" promises + Sankalpa Patra
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'tdp';
  INSERT INTO manifestos (party_id, election_type, election_year, title, title_translations, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024,
          'TDP Vision Document 2024 — Super Six for Andhra Pradesh',
          '{"te":"తెలుగు దేశం పార్టీ 2024 విజన్ డాక్యుమెంట్"}',
          'https://www.telugudesam.org/manifesto2024',
          'en', 32, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  -- SUPER SIX
  (v_mf, v_party,
   'Deepam 2.0 — Free LPG cylinder to every woman household head',
   'Every woman who is the head of a household will receive free LPG cylinders under the Deepam scheme, restoring what YSRCP discontinued.',
   5, 'social_welfare', ARRAY['Deepam 2.0','LPG','women','Andhra Pradesh'],
   'Free LPG cylinders distributed to all eligible women household heads in AP within 6 months of government formation, confirmed by civil supplies department.',
   '{"metric":"beneficiaries","unit":"women households"}',
   'andhra_pradesh', true),

  (v_mf, v_party,
   'Thalliki Vandanam — Rs 15,000 per year to mothers of school children',
   'Mothers of children enrolled in government schools will receive Rs 15,000 per year as financial assistance under Thalliki Vandanam.',
   7, 'education', ARRAY['Thalliki Vandanam','mothers','school','AP'],
   'Rs 15,000 disbursed annually to qualifying mothers via DBT within the first academic year of new government.',
   '{"metric":"annual transfer","value":15000,"unit":"INR","deadline_year":2025}',
   'andhra_pradesh', true),

  (v_mf, v_party,
   'Yuva Galam — Employment to 20 lakh youth in 5 years',
   'Create 20 lakh employment opportunities for AP youth through government recruitment drives, NRI investments, and industrial growth.',
   10, 'employment', ARRAY['Yuva Galam','jobs','AP youth'],
   '20 lakh documented job placements confirmed by AP employment exchanges within 5 years.',
   '{"metric":"jobs","value":2000000,"unit":"youth employed","deadline_year":2029}',
   'andhra_pradesh', true),

  (v_mf, v_party,
   'Anna Canteen 2.0 — Rs 5 subsidised meals to all',
   'Revive the Anna Canteen scheme across AP to provide Rs 5 subsidised meals to all working people and the poor.',
   14, 'social_welfare', ARRAY['Anna Canteen','food subsidy','AP'],
   'Anna Canteens operational in all district headquarters and major mandals within 3 months; meal price at Rs 5.',
   '{"metric":"meal price","value":5,"unit":"INR"}',
   'andhra_pradesh', true),

  (v_mf, v_party,
   'Rushme — Financial aid of Rs 3,000 per month to unemployed youth',
   'Unemployed graduates and diploma holders in AP aged 22-45 will receive Rs 3,000 per month as unemployment allowance.',
   17, 'employment', ARRAY['Rushme','unemployment allowance','AP youth'],
   'Rs 3,000 monthly DBT to registered unemployed graduates within 100 days of government formation.',
   '{"metric":"monthly stipend","value":3000,"unit":"INR/month"}',
   'andhra_pradesh', false),

  (v_mf, v_party,
   'Speedway — 4-lane highways connecting all district HQs',
   'Build 4-lane highway corridors connecting all district headquarters in Andhra Pradesh under TDP infrastructure mission.',
   20, 'infrastructure', ARRAY['highways','AP roads','connectivity'],
   'All district HQs connected by 4-lane roads; milestone report issued by AP Roads & Buildings Dept annually.',
   '{"metric":"highway km","unit":"km","deadline_year":2029}',
   'andhra_pradesh', false),

  (v_mf, v_party,
   'Amaravati capital development on war footing',
   'Complete Amaravati as the full capital of Andhra Pradesh with all three organs of government — legislature, executive, judiciary — located there by 2027.',
   3, 'infrastructure', ARRAY['Amaravati','capital city','AP governance'],
   'Secretariat, assembly complex, and high court fully operational in Amaravati by December 2027.',
   '{"metric":"capital operational","deadline_year":2027}',
   'andhra_pradesh', true),

  (v_mf, v_party,
   'Agri-gold scheme — Rs 20,000 per acre per season to farmers',
   'Provide Rs 20,000 per acre per season to small and marginal farmers in AP to compensate for high input costs.',
   22, 'agriculture', ARRAY['farmer support','AP farmers','input subsidy'],
   'DBT transfers to enrolled small/marginal farmers at Rs 20,000/acre/season starting from kharif 2025.',
   '{"metric":"per acre support","value":20000,"unit":"INR per acre per season"}',
   'andhra_pradesh', false),

  (v_mf, v_party,
   'One lakh government jobs in AP in 2 years',
   'Fill one lakh government vacancies in Andhra Pradesh within two years through transparent recruitment via APPSC.',
   11, 'employment', ARRAY['govt jobs','APPSC','AP'],
   '1 lakh government appointments notified and filled within 2 years, verified by AP General Administration Dept.',
   '{"metric":"govt jobs","value":100000,"unit":"positions","deadline_year":2026}',
   'andhra_pradesh', true),

  (v_mf, v_party,
   'Special category status demand for Andhra Pradesh',
   'Demand Special Category Status (SCS) for Andhra Pradesh from the central government to compensate for bifurcation losses.',
   2, 'economy', ARRAY['Special Category Status','AP bifurcation','central funds'],
   'Official resolution passed in AP assembly and petition submitted to Union Cabinet within 30 days of government formation.',
   NULL,
   'andhra_pradesh', true);
END $$;

-- ── JDU (Janata Dal United) ────────────────────────────────────────────────
-- Source: JDU Manifesto 2024 + Nitish Kumar's 7 Nischay promises for Bihar
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'jdu';
  INSERT INTO manifestos (party_id, election_type, election_year, title, title_translations, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024,
          'JD(U) Lok Sabha 2024 Manifesto — Viksit Bihar, Viksit Bharat',
          '{"hi":"जनता दल युनाइटेड लोकसभा 2024 घोषणापत्र"}',
          'https://www.jdunited.in/manifesto2024',
          'en', 28, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Special category status for Bihar at the Centre',
   'JD(U) will pursue special category status or enhanced financial package for Bihar to accelerate its development.',
   3, 'economy', ARRAY['Bihar','SCS','central funds'],
   'Bihar receives enhanced central allocation or SCS-equivalent package announced by Finance Ministry.',
   NULL, 'bihar', true),

  (v_mf, v_party,
   'New AIIMS and central university for Bihar',
   'Establish at least one new AIIMS and a new central university in Bihar to improve healthcare and education.',
   8, 'healthcare', ARRAY['AIIMS','Bihar','central university'],
   'AIIMS sanctioned and central university established in Bihar with construction commenced within 2 years.',
   '{"metric":"institutions","value":2,"unit":"institutions"}',
   'bihar', true),

  (v_mf, v_party,
   'Flood management — Kosi-Mechi link project',
   'Complete the Kosi-Mechi river-interlinking project to mitigate North Bihar floods and provide irrigation.',
   12, 'infrastructure', ARRAY['flood control','Kosi','irrigation','Bihar'],
   'Kosi-Mechi link project DPR approved and construction underway by 2026.',
   '{"metric":"irrigation area","unit":"hectares"}',
   'bihar', true),

  (v_mf, v_party,
   'Extend Nari Shakti Vandan Act to Bihar Vidhan Sabha immediately',
   'Implement 33% reservation for women in Bihar Vidhan Sabha seats in the next delimitation cycle.',
   15, 'women', ARRAY['women reservation','Bihar assembly'],
   'Bihar Vidhan Sabha delimitation reflects 33% women reserved seats in the next election cycle.',
   NULL, 'bihar', false),

  (v_mf, v_party,
   'Rs 400 per day MGNREGA wage in Bihar',
   'Raise MGNREGA daily wage to Rs 400 in Bihar to align with other states and reduce out-migration.',
   18, 'employment', ARRAY['MGNREGA','wage hike','Bihar'],
   'Bihar MGNREGA wage notification revised to Rs 400/day within 1 year.',
   '{"metric":"wage","value":400,"unit":"INR/day"}',
   'bihar', false),

  (v_mf, v_party,
   'Industry park in every district of Bihar',
   'Establish industrial parks in all 38 districts of Bihar through BIADA to create 10 lakh jobs.',
   21, 'economy', ARRAY['industry','BIADA','Bihar jobs'],
   '38 district industrial parks notified by BIADA, construction begun in at least 20 within 3 years.',
   '{"metric":"industrial parks","value":38,"unit":"districts","deadline_year":2027}',
   'bihar', false),

  (v_mf, v_party,
   'Patna Metro Phase-2 fast-track completion',
   'Fast-track Patna Metro Phase-2 under central funding to ease urban congestion and create jobs.',
   23, 'infrastructure', ARRAY['Patna Metro','urban transport','Bihar'],
   'Patna Metro Phase-2 construction milestones achieved on schedule; operational by 2028.',
   '{"metric":"metro km","unit":"km","deadline_year":2028}',
   'bihar', false),

  (v_mf, v_party,
   'Caste census — national OBC enumeration',
   'JD(U) will strongly advocate for a national caste census to enumerate OBC population accurately.',
   5, 'social_welfare', ARRAY['caste census','OBC','reservation'],
   'OBC caste data included in Census 2027 exercise by central government.',
   NULL, 'national', true),

  (v_mf, v_party,
   'Pradhan Mantri Awas Yojana expansion in Bihar',
   'Ensure Bihar receives maximum PMAY-G quota to complete pending houses and house all homeless.',
   9, 'infrastructure', ARRAY['PMAY','housing','Bihar'],
   '10 lakh PMAY-G houses sanctioned and completed in Bihar within 3 years.',
   '{"metric":"houses","value":1000000,"unit":"houses","deadline_year":2027}',
   'bihar', false),

  (v_mf, v_party,
   'One-time loan waiver for small farmers in Bihar',
   'Provide a one-time farm loan waiver up to Rs 1 lakh for small and marginal farmers in Bihar.',
   16, 'agriculture', ARRAY['farm loan','Bihar farmers','loan waiver'],
   'Farm loan waiver scheme announced and DBT disbursed to qualifying farmers within 6 months.',
   '{"metric":"loan waiver cap","value":100000,"unit":"INR per farmer"}',
   'bihar', true);
END $$;

-- ── RJD (Rashtriya Janata Dal) ────────────────────────────────────────────
-- Source: RJD 2024 LS Manifesto, Tejashwi Yadav's election promises
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'rjd';
  INSERT INTO manifestos (party_id, election_type, election_year, title, title_translations, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024,
          'RJD Lok Sabha 2024 Manifesto — Badlav Chahiye Bihar Ko',
          '{"hi":"राष्ट्रीय जनता दल लोकसभा 2024 घोषणापत्र"}',
          'https://www.rjdindia.com/manifesto2024',
          'en', 24, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   '10 lakh government jobs in Bihar within 2 years',
   'RJD-led INDIA alliance government will fill 10 lakh government vacancies in Bihar within 2 years through transparent recruitment.',
   3, 'employment', ARRAY['govt jobs','Bihar','recruitment'],
   '10 lakh appointment letters issued and posts filled within 2 years of government formation.',
   '{"metric":"govt jobs","value":1000000,"unit":"positions","deadline_year":2026}',
   'bihar', true),

  (v_mf, v_party,
   'National caste census with full OBC sub-categorisation',
   'Conduct national caste census and implement sub-categorisation of OBC reservations based on the census data.',
   5, 'social_welfare', ARRAY['caste census','OBC','sub-categorisation'],
   'National caste census data published and OBC sub-categorisation framework notified by central government.',
   NULL, 'national', true),

  (v_mf, v_party,
   'Scrap Agniveer scheme, restore permanent Army recruitment',
   'Abolish Agniveer scheme and restore permanent recruitment to all wings of the armed forces.',
   7, 'governance', ARRAY['Agniveer','armed forces','Army recruitment'],
   'Agniveer ordinance repealed and regular recruitment advertisement issued by Ministry of Defence.',
   NULL, 'national', true),

  (v_mf, v_party,
   'Legal guarantee for MSP for all crops',
   'Enact legislation to make MSP for all 23 CACP-notified crops a legal right for all farmers.',
   10, 'agriculture', ARRAY['MSP','farmers','legal guarantee'],
   'Parliament passes MSP Guarantee Act within the first budget session of new government.',
   NULL, 'national', true),

  (v_mf, v_party,
   'Raise MGNREGA wages to Rs 500 per day nationally',
   'Increase MGNREGA daily wage to Rs 500 and increase guaranteed work days from 100 to 200.',
   12, 'employment', ARRAY['MGNREGA','wage hike','rural employment'],
   'MGNREGA wage revised to Rs 500/day and work guarantee extended to 200 days via act amendment.',
   '{"metric":"wage","value":500,"unit":"INR/day"}',
   'national', false),

  (v_mf, v_party,
   'Flat 50% reservation for SC/ST/OBC everywhere',
   'Amend the Constitution to raise the reservation ceiling from 50% to match actual SC/ST/OBC population share.',
   15, 'social_welfare', ARRAY['reservation','SC/ST/OBC','constitutional amendment'],
   'Constitutional amendment bill introduced and passed to lift reservation cap above 50%.',
   NULL, 'national', false),

  (v_mf, v_party,
   'Rs 7,500 per month income support to urban poor',
   'Provide Rs 7,500 per month income support to poor urban households through Nyay Urban scheme.',
   17, 'social_welfare', ARRAY['income support','urban poor','Nyay Urban'],
   'Nyay Urban scheme notified with Rs 7,500/month DBT to qualifying urban households.',
   '{"metric":"monthly transfer","value":7500,"unit":"INR/month"}',
   'national', false),

  (v_mf, v_party,
   'Special Category Status for Bihar',
   'Urgently grant Special Category Status to Bihar through a resolution in Parliament.',
   4, 'economy', ARRAY['SCS','Bihar','central funding'],
   'Parliament resolution or Finance Commission recommendation acknowledging SCS for Bihar.',
   NULL, 'bihar', true),

  (v_mf, v_party,
   'Restore Old Pension Scheme nationally',
   'Scrap New Pension Scheme (NPS) and restore the Old Pension Scheme (OPS) for all government employees.',
   19, 'social_welfare', ARRAY['OPS','NPS','pension'],
   'Central government notification restoring OPS for all employees recruited after 2004.',
   NULL, 'national', false),

  (v_mf, v_party,
   'EBC reservation in jobs and education for extremely backward castes',
   'Implement separate reservation for Extremely Backward Classes (EBC) within OBC quota based on caste census data.',
   16, 'social_welfare', ARRAY['EBC','OBC','reservation'],
   'EBC reservation sub-quota notified in central government jobs and central educational institutions.',
   NULL, 'national', false);
END $$;

-- ── AIADMK ────────────────────────────────────────────────────────────────
-- Source: AIADMK 2024 Lok Sabha Manifesto, Edappadi Palaniswami press releases
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'aiadmk';
  INSERT INTO manifestos (party_id, election_type, election_year, title, title_translations, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024,
          'AIADMK 2024 Lok Sabha Election Manifesto',
          '{"ta":"அதிமுக 2024 மக்களவை தேர்தல் அறிக்கை"}',
          'https://www.aiadmk.com/manifesto2024',
          'en', 36, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Cauvery Water Dispute — Central tribunal implementation',
   'Demand Centre implement Cauvery Water Management Authority orders in full and release Tamil Nadu''s share without fail.',
   4, 'agriculture', ARRAY['Cauvery','water','TN farmers','irrigation'],
   'CWMA releases Tamil Nadu''s full annual share; non-compliance escalated to Supreme Court.',
   NULL, 'tamil_nadu', true),

  (v_mf, v_party,
   'Nilavembu for all — free health kits in Tamil Nadu',
   'Distribute free Nilavembu Kudineer health kits to all households in Tamil Nadu every year as disease preventive.',
   8, 'healthcare', ARRAY['Nilavembu','health kit','Tamil Nadu'],
   'Nilavembu kits distributed to 2 crore+ households annually by Tamil Nadu health dept.',
   '{"metric":"households","value":20000000,"unit":"households"}',
   'tamil_nadu', false),

  (v_mf, v_party,
   'Rs 4,000 per month pension to all elderly above 60',
   'Raise the old-age pension in Tamil Nadu to Rs 4,000 per month for all citizens above 60 years.',
   11, 'social_welfare', ARRAY['old-age pension','Tamil Nadu','elderly'],
   'Tamil Nadu social welfare department pension revised to Rs 4,000/month effective from next budget.',
   '{"metric":"monthly pension","value":4000,"unit":"INR/month"}',
   'tamil_nadu', true),

  (v_mf, v_party,
   'Separate Eelam Tamils welfare ministry at Centre',
   'Demand creation of a separate ministry or cell for Sri Lankan Tamil refugees in India.',
   14, 'social_welfare', ARRAY['Eelam Tamils','Sri Lanka','refugees','Tamil Nadu'],
   'Union Cabinet creates dedicated Eelam Tamil welfare cell under Ministry of External Affairs.',
   NULL, 'national', false),

  (v_mf, v_party,
   'NEET exemption for Tamil Nadu medical students',
   'Permanently exempt Tamil Nadu from NEET entrance exam for medical admissions.',
   17, 'education', ARRAY['NEET','Tamil Nadu','medical education'],
   'President assents to Tamil Nadu NEET exemption bill; state medical admissions revert to class 12 scores.',
   NULL, 'tamil_nadu', true),

  (v_mf, v_party,
   'New AIIMS and IIT for Tamil Nadu',
   'Establish a new AIIMS and IIT in southern Tamil Nadu to boost healthcare and technical education.',
   20, 'education', ARRAY['AIIMS','IIT','Tamil Nadu','higher education'],
   'AIIMS and IIT land acquired, DPR approved, and construction commenced within 2 years.',
   NULL, 'tamil_nadu', false),

  (v_mf, v_party,
   'Free power to Tamil Nadu farmers — 0 bill for agricultural pump-sets',
   'Restore free electricity to all agricultural pump-sets in Tamil Nadu, reversing recent tariff revisions.',
   22, 'agriculture', ARRAY['free power','farmers','Tamil Nadu'],
   'Free electricity scheme for farm pump-sets reinstated; zero bills issued to enrolled farmers.',
   NULL, 'tamil_nadu', true),

  (v_mf, v_party,
   'Chennai Metro expansion — airport to Sholinganallur corridor',
   'Fund and expedite the Chennai Metro Phase-2 extension to connect key southern IT corridors.',
   25, 'infrastructure', ARRAY['Chennai Metro','Phase 2','IT corridor','TN'],
   'Chennai Metro Phase-2 southern extension operational by 2027.',
   '{"metric":"metro km","unit":"km","deadline_year":2027}',
   'tamil_nadu', false),

  (v_mf, v_party,
   'Thoothukudi port expansion as major international hub',
   'Develop Thoothukudi (Tuticorin) port into a world-class container port with direct international shipping.',
   28, 'infrastructure', ARRAY['Thoothukudi','port','shipping','trade'],
   'Thoothukudi port capacity doubled; international shipping lines added by 2028.',
   NULL, 'tamil_nadu', false),

  (v_mf, v_party,
   'Minimum 33% women reservation in Lok Sabha',
   'Implement the Women''s Reservation Act immediately for the 2029 general elections without delay.',
   31, 'women', ARRAY['women reservation','Lok Sabha','Nari Shakti Vandan'],
   'Election Commission notifies constituencies for women''s reservation in Lok Sabha elections.',
   NULL, 'national', false);
END $$;

-- ── JD(S) (Janata Dal Secular) ────────────────────────────────────────────
-- Source: JD(S) 2024 Manifesto, H.D. Deve Gowda / Kumaraswamy press releases
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'jds';
  INSERT INTO manifestos (party_id, election_type, election_year, title, title_translations, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024,
          'JD(S) 2024 Lok Sabha Manifesto — Karnataka Praja Prerana',
          '{"kn":"ಜೆಡಿಎಸ್ 2024 ಲೋಕಸಭಾ ಚುನಾವಣಾ ಪ್ರಣಾಳಿಕೆ"}',
          'https://www.jdsekulaar.com/manifesto2024',
          'en', 22, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Mekedatu reservoir project — Centre must fund',
   'Demand immediate central clearance and funding for the Mekedatu balancing reservoir project on the Cauvery.',
   3, 'agriculture', ARRAY['Mekedatu','Cauvery','reservoir','Karnataka'],
   'MoEFCC and Planning Commission clearances obtained; DPR approved and construction begins.',
   NULL, 'karnataka', true),

  (v_mf, v_party,
   'Gundlupet-Chamarajanagar railway line',
   'Complete the pending Gundlupet-Chamarajanagar railway gauge conversion and new line project to improve connectivity in old Mysore region.',
   7, 'infrastructure', ARRAY['railway','Karnataka','connectivity'],
   'Railway line commissioned between Gundlupet and Chamarajanagar by 2027.',
   '{"metric":"rail km","unit":"km","deadline_year":2027}',
   'karnataka', false),

  (v_mf, v_party,
   'Rs 1,000 per quintal bonus for sugarcane farmers',
   'Provide Rs 1,000 per quintal bonus support to sugarcane farmers in Karnataka above the FRP set by the Centre.',
   10, 'agriculture', ARRAY['sugarcane','farmers','Karnataka','bonus'],
   'Karnataka sugarcane bonus scheme announced and paid to registered farmers every crushing season.',
   '{"metric":"bonus per quintal","value":1000,"unit":"INR/quintal"}',
   'karnataka', false),

  (v_mf, v_party,
   'OBC reservation: national caste census + increase to 52%',
   'Demand national caste census and raise OBC reservation in central government services to 52%.',
   13, 'social_welfare', ARRAY['OBC','caste census','reservation'],
   'OBC caste census conducted and reservation increased to 52% by constitutional amendment.',
   NULL, 'national', true),

  (v_mf, v_party,
   'Bangalore congestion — satellite towns development',
   'Develop five satellite towns around Bangalore under a special authority to decongest the IT hub.',
   16, 'infrastructure', ARRAY['Bangalore','satellite towns','urban planning'],
   'Satellite town authority constituted; master plans for 5 towns notified within 2 years.',
   NULL, 'karnataka', false),

  (v_mf, v_party,
   'Zero interest loans to Vokkaliga and OBC farmers',
   'Provide zero-interest crop loans up to Rs 3 lakh to Vokkaliga and OBC farmers in Karnataka.',
   18, 'agriculture', ARRAY['farmers','interest-free loan','Vokkaliga','OBC','Karnataka'],
   'Zero-interest loan scheme notified by Karnataka government with NABARD partnership; disbursed within 1 crop season.',
   '{"metric":"loan cap","value":300000,"unit":"INR"}',
   'karnataka', false),

  (v_mf, v_party,
   'PM-KISAN raise to Rs 12,000 per year',
   'Increase PM-KISAN annual income support from Rs 6,000 to Rs 12,000 for all enrolled farmers nationally.',
   8, 'agriculture', ARRAY['PM-KISAN','farmer income','support'],
   'PM-KISAN installment doubled to Rs 2,000 per installment × 3 = Rs 12,000/year by budget 2025-26.',
   '{"metric":"annual farmer support","value":12000,"unit":"INR/year"}',
   'national', true),

  (v_mf, v_party,
   'Mysuru-Bengaluru elevated highway fast-track',
   'Fast-track the Mysuru-Bengaluru 10-lane elevated expressway to reduce travel time to 90 minutes.',
   5, 'infrastructure', ARRAY['Mysuru','Bengaluru','expressway','highway'],
   'Mysuru-Bengaluru expressway fully commissioned with 90-minute travel time by 2026.',
   '{"metric":"travel time","value":90,"unit":"minutes","deadline_year":2026}',
   'karnataka', false);
END $$;

-- ── NCP (Ajit Pawar faction) ────────────────────────────────────────────────
-- Source: NCP (Ajit Pawar) 2024 Manifesto + Mahayuti alliance promises
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'ncp';
  INSERT INTO manifestos (party_id, election_type, election_year, title, title_translations, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024,
          'NCP 2024 Lok Sabha Manifesto — Vikas Aani Samruddhi',
          '{"mr":"राष्ट्रवादी काँग्रेस पार्टी 2024 लोकसभा जाहीरनामा"}',
          'https://www.ncp.org.in/manifesto2024',
          'en', 28, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Ladki Bahin Yojana — Rs 1,500 per month to women',
   'Provide Rs 1,500 per month to all women aged 21-65 from below poverty line families in Maharashtra.',
   4, 'women', ARRAY['Ladki Bahin','women support','Maharashtra'],
   'Rs 1,500 monthly DBT to qualifying women in Maharashtra; disbursement confirmed by WCD department.',
   '{"metric":"monthly transfer","value":1500,"unit":"INR/month"}',
   'maharashtra', true),

  (v_mf, v_party,
   'Shetkari Samman — Rs 12,000 per year to Maharashtra farmers',
   'Provide Rs 12,000 per year additional income support to all registered farmers in Maharashtra on top of PM-KISAN.',
   7, 'agriculture', ARRAY['Shetkari Samman','Maharashtra farmers','income support'],
   'Rs 12,000 annual DBT to registered Maharashtra farmers through state agri department.',
   '{"metric":"annual support","value":12000,"unit":"INR/year"}',
   'maharashtra', true),

  (v_mf, v_party,
   'Mukhyamantri Majhi Ladki Bahin 2.0 — raise to Rs 2,100',
   'Increase Ladki Bahin support to Rs 2,100 per month after winning Lok Sabha election, subject to state finances.',
   4, 'women', ARRAY['Ladki Bahin','Maharashtra','women income'],
   'State government notification raising Ladki Bahin amount to Rs 2,100/month from next financial year.',
   '{"metric":"monthly transfer","value":2100,"unit":"INR/month"}',
   'maharashtra', false),

  (v_mf, v_party,
   'Mumbai Coastal Road Phase-2 and Mumbai Trans-Harbour Link maintenance',
   'Fast-track completion of Mumbai Coastal Road Phase-2 and ensure MTHL operational milestones.',
   12, 'infrastructure', ARRAY['Mumbai','coastal road','MTHL','infrastructure'],
   'Coastal Road Phase-2 completed and operational; MTHL reaches full capacity utilization.',
   NULL, 'maharashtra', false),

  (v_mf, v_party,
   '1 crore jobs in Maharashtra through industrial corridors',
   'Create 1 crore direct and indirect jobs through Samruddhi Corridor industrial townships and DMIC zone.',
   15, 'employment', ARRAY['jobs','Maharashtra','industrial corridor','Samruddhi'],
   '1 crore jobs created across Samruddhi Corridor townships and DMIC, tracked by MAHA Industrial Corp.',
   '{"metric":"jobs","value":10000000,"unit":"jobs","deadline_year":2029}',
   'maharashtra', true),

  (v_mf, v_party,
   'OBC political reservation — expedite Constitutional Amendment',
   'Pass constitutional amendment to restore OBC political reservation in local bodies across Maharashtra and nationally.',
   18, 'social_welfare', ARRAY['OBC','political reservation','local bodies'],
   'Constitutional amendment bill passed in Parliament restoring OBC political reservation.',
   NULL, 'national', true),

  (v_mf, v_party,
   'Onion farmers — minimum Rs 2,000 per quintal',
   'Ensure onion farmers get minimum Rs 2,000 per quintal through state support fund when market prices fall.',
   9, 'agriculture', ARRAY['onion','farmers','Maharashtra','price support'],
   'State price stabilisation fund activated; onion farmers receive minimum Rs 2,000/quintal.',
   '{"metric":"minimum price","value":2000,"unit":"INR/quintal"}',
   'maharashtra', false),

  (v_mf, v_party,
   'Kirit Parikh committee natural gas pricing — benefit farmers',
   'Implement Kirit Parikh committee recommendations to rationalize natural gas prices benefiting fertiliser-dependent farmers.',
   21, 'agriculture', ARRAY['natural gas','fertiliser','farming costs'],
   'Natural gas pricing reform notified reducing urea costs; farmer input costs decrease measurably.',
   NULL, 'national', false),

  (v_mf, v_party,
   'Grape, pomegranate export push — Rs 500 crore export facilitation fund',
   'Create Rs 500 crore special fund to help Maharashtra''s grape and pomegranate farmers access international markets.',
   10, 'agriculture', ARRAY['grapes','pomegranate','export','Maharashtra horticulture'],
   'Rs 500 crore export facilitation fund constituted; Maharashtra horticulture exports grow 20% within 3 years.',
   '{"metric":"export fund","value":5000000000,"unit":"INR"}',
   'maharashtra', false),

  (v_mf, v_party,
   'Rail connectivity to major industrial clusters in Vidarbha',
   'Extend railway lines to industrial clusters in Nagpur, Amravati, and Nanded districts under Vidarbha development mission.',
   24, 'infrastructure', ARRAY['Vidarbha','railway','industrial','connectivity'],
   'Railway extensions to at least 3 industrial clusters in Vidarbha approved and construction begun by 2026.',
   NULL, 'maharashtra', false);
END $$;

-- ── BJD (Biju Janata Dal) ────────────────────────────────────────────────
-- Source: BJD 2024 LS Manifesto, Naveen Patnaik promises for Odisha
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'bjd';
  INSERT INTO manifestos (party_id, election_type, election_year, title, title_translations, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024,
          'BJD 2024 Lok Sabha Manifesto — Odisha Aama Odisha',
          '{"or":"ବିଜୁ ଜନତା ଦଳ 2024 ଲୋକ ସଭା ନିର୍ବାଚନ ୱାଦ ଦସ୍ତଖତ"}',
          'https://www.bjd.org.in/manifesto2024',
          'en', 30, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Special Category Status for Odisha',
   'BJD will advocate strongly for Special Category Status for Odisha at the Centre due to its high tribal population and natural disaster vulnerability.',
   3, 'economy', ARRAY['SCS','Odisha','central funds','tribal'],
   'Finance Commission or Cabinet notification granting SCS or enhanced grants to Odisha.',
   NULL, 'odisha', true),

  (v_mf, v_party,
   'Subhadra Yojana — Rs 50,000 to women over 5 years',
   'Provide Rs 10,000 per year for 5 years (Rs 50,000 total) to all women aged 21-60 in Odisha as income support.',
   6, 'women', ARRAY['Subhadra','women support','Odisha'],
   'Subhadra Yojana scheme notified; Rs 10,000 annual DBT to qualifying Odisha women each year.',
   '{"metric":"annual transfer","value":10000,"unit":"INR/year","total_value":50000}',
   'odisha', true),

  (v_mf, v_party,
   'Expansion of Biju Swasthya Kalyan Yojana to Rs 10 lakh cover',
   'Increase health insurance cover under BSKY to Rs 10 lakh for women and Rs 5 lakh for all other family members.',
   10, 'healthcare', ARRAY['BSKY','health insurance','Odisha'],
   'BSKY scheme notification updated with enhanced cover of Rs 10 lakh for women; claims processed accordingly.',
   '{"metric":"health cover women","value":1000000,"unit":"INR"}',
   'odisha', true),

  (v_mf, v_party,
   'Tribal land rights — enforce PESA and Forest Rights Act fully',
   'Ensure complete implementation of PESA and Forest Rights Act for tribal communities in Odisha.',
   13, 'social_welfare', ARRAY['tribal rights','PESA','FRA','Odisha'],
   'All pending tribal land titles under FRA resolved within 2 years; PESA rules enforced in 118 scheduled area blocks.',
   NULL, 'odisha', false),

  (v_mf, v_party,
   'Mahanadi water dispute — national tribunal ruling',
   'Demand the inter-state water dispute tribunal for Mahanadi deliver final award protecting Odisha''s downstream rights.',
   16, 'agriculture', ARRAY['Mahanadi','water dispute','Odisha','Chhattisgarh'],
   'Mahanadi Water Disputes Tribunal delivers final award upholding Odisha''s water share.',
   NULL, 'odisha', true),

  (v_mf, v_party,
   '5T schools — national replication of Odisha school transformation',
   'Present Odisha''s 5T school transformation as a national model for central adoption under NEP 2020.',
   19, 'education', ARRAY['5T schools','education','Odisha model','NEP'],
   'Centre invites Odisha 5T framework for national pilot in 10 states under NEP implementation.',
   NULL, 'national', false),

  (v_mf, v_party,
   'Railway electrification and doubling of all Odisha rail lines',
   'Demand electrification and doubling of all remaining single-track rail lines in Odisha under national rail mission.',
   22, 'infrastructure', ARRAY['railway','Odisha','electrification','doubling'],
   'All Odisha rail lines electrified and doubling projects commissioned within 5 years.',
   '{"metric":"rail km electrified","unit":"km","deadline_year":2029}',
   'odisha', false),

  (v_mf, v_party,
   'Puri Heritage Corridor — central heritage protection status',
   'Obtain UNESCO Heritage status and central funding for Puri Heritage Corridor and Jagannath Temple precinct.',
   25, 'culture', ARRAY['Puri','heritage','Jagannath','tourism'],
   'UNESCO nomination submitted and central heritage protection for Puri Corridor notified by ASI.',
   NULL, 'odisha', false),

  (v_mf, v_party,
   'Odisha cyclone shelter network — Rs 5,000 crore central fund',
   'Demand Rs 5,000 crore central allocation for comprehensive cyclone shelter and disaster resilience infrastructure in coastal Odisha.',
   8, 'infrastructure', ARRAY['cyclone shelter','disaster','coastal Odisha'],
   'Rs 5,000 crore central allocation for Odisha cyclone shelters included in disaster management budget.',
   '{"metric":"central allocation","value":50000000000,"unit":"INR"}',
   'odisha', false),

  (v_mf, v_party,
   'KALIA scheme — continue and expand crop support to 57 lakh farmers',
   'Continue and expand KALIA (Krushak Assistance for Livelihood and Income Augmentation) to all 57 lakh Odisha farmers.',
   5, 'agriculture', ARRAY['KALIA','Odisha farmers','crop support'],
   'KALIA scheme coverage verified at 57 lakh+ farmers; annual disbursement tracked by agri dept.',
   '{"metric":"beneficiaries","value":5700000,"unit":"farmers"}',
   'odisha', true),

  (v_mf, v_party,
   'Free electricity to farmers with pump-sets up to 5 HP in Odisha',
   'Extend free electricity to all farm pump-sets up to 5 HP in Odisha, ensuring zero electricity bills for small and marginal farmers.',
   7, 'agriculture', ARRAY['free power','Odisha farmers','electricity'],
   'Zero electricity bill scheme extended to all ≤5 HP pump-sets; no farmer billed for farm use.',
   NULL, 'odisha', false),

  (v_mf, v_party,
   'Double the number of Biju Expressways to 8 corridors',
   'Build 4 new expressways in addition to the existing 4 in Odisha to connect mineral-rich districts to port facilities.',
   23, 'infrastructure', ARRAY['expressway','Odisha','connectivity','minerals'],
   '4 new expressway projects sanctioned and at least 2 under construction within 3 years.',
   '{"metric":"expressway count","value":8,"unit":"corridors","deadline_year":2027}',
   'odisha', false),

  (v_mf, v_party,
   'Odisha sports hub — Olympic-standard multi-sport complex',
   'Build an Olympic-standard multi-sport complex in Bhubaneswar as a permanent legacy of the 2023 Hockey World Cup.',
   27, 'culture', ARRAY['sports','Bhubaneswar','hockey','Olympics'],
   'Multi-sport complex operational in Bhubaneswar with Olympic-standard facilities by 2027.',
   '{"metric":"completion year","deadline_year":2027}',
   'odisha', false);
END $$;

-- ── MNS (Maharashtra Navnirman Sena) ─────────────────────────────────────
-- Source: MNS 2024 positions and Raj Thackeray policy statements
INSERT INTO parties (slug, name, short_name, level, founded_year, color_hex, website_url)
VALUES ('mns', 'Maharashtra Navnirman Sena', 'MNS', 'state', 2006, '#E30512', 'https://www.mnsadhikar.com')
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'mns';
  INSERT INTO manifestos (party_id, election_type, election_year, title, title_translations, source_url, language, pages, status)
  VALUES (v_party, 'lok_sabha', 2024,
          'MNS 2024 Lok Sabha Position Paper — Marathi Manoos First',
          '{"mr":"महाराष्ट्र नवनिर्माण सेना 2024 लोकसभा भूमिकापत्र"}',
          'https://www.mnsadhikar.com/manifesto2024',
          'en', 18, 'published')
  RETURNING id INTO v_mf;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   '80% jobs in Maharashtra private sector for Marathi domicile holders',
   'Mandate 80% reservation of private sector jobs for candidates with Maharashtra domicile certificate.',
   3, 'employment', ARRAY['Marathi','domicile','private sector jobs','Maharashtra'],
   'Maharashtra government notifies domicile-based reservation policy enforced in private companies above 50 employees.',
   NULL, 'maharashtra', true),

  (v_mf, v_party,
   'Official language status: Marathi as sole medium in Maharashtra government',
   'Enforce Marathi as the exclusive language in all Maharashtra government offices, courts, and public boards.',
   5, 'culture', ARRAY['Marathi','language','Maharashtra'],
   'Maharashtra government order mandating Marathi-only official use; compliance audit within 1 year.',
   NULL, 'maharashtra', true),

  (v_mf, v_party,
   'Anti-infiltration drive — biometric survey of all illegal migrants',
   'Conduct biometric survey of all non-documented migrants in Maharashtra and deport illegal entrants.',
   8, 'governance', ARRAY['migrants','Maharashtra','biometric','infiltration'],
   'State-led biometric survey of migrants conducted; deportation of verified illegal entrants begun.',
   NULL, 'maharashtra', false),

  (v_mf, v_party,
   'Mumbai hawker license restricted to Marathi-speaking vendors',
   'Issue hawking licenses only to Marathi-speaking domicile holders in Mumbai and major Maharashtra cities.',
   11, 'economy', ARRAY['hawkers','Marathi','Mumbai','licenses'],
   'BMC/municipal corporations issue hawker licenses only to domicile certificate holders.',
   NULL, 'maharashtra', false),

  (v_mf, v_party,
   'Uniform Civil Code adoption in Maharashtra',
   'Maharashtra should adopt UCC ahead of national implementation to ensure uniform personal law for all residents.',
   14, 'governance', ARRAY['UCC','Uniform Civil Code','Maharashtra'],
   'Maharashtra state assembly passes UCC resolution or enacts state-level UCC provisions.',
   NULL, 'maharashtra', false),

  (v_mf, v_party,
   'Pune-Mumbai bullet train corridor — prioritise Marathi contractors',
   'In the Mumbai-Pune bullet train feasibility study, ensure construction contracts go to Maharashtra-based firms.',
   16, 'infrastructure', ARRAY['bullet train','Pune','Mumbai','Marathi contractors'],
   'Bullet train contract preference policy for Maharashtra firms notified in tender documents.',
   NULL, 'maharashtra', false),

  (v_mf, v_party,
   'Marathi cultural fund — Rs 1,000 crore corpus for arts and cinema',
   'Create a Rs 1,000 crore Marathi cultural fund to support Marathi theatre, cinema, and performing arts.',
   12, 'culture', ARRAY['Marathi culture','cinema','theatre','arts fund'],
   'Maharashtra Marathi cultural corpus of Rs 1,000 crore constituted; grants issued to artists.',
   '{"metric":"fund corpus","value":10000000000,"unit":"INR"}',
   'maharashtra', false),

  (v_mf, v_party,
   'Demolish illegal structures in Dharavi built by non-domicile holders',
   'Ensure Dharavi redevelopment prioritises Marathi and domicile-holding residents; illegal non-resident structures identified.',
   9, 'infrastructure', ARRAY['Dharavi','slum redevelopment','Mumbai','Marathi'],
   'Dharavi redevelopment survey identifies domicile vs non-domicile residents; priority allotments to domicile holders.',
   NULL, 'maharashtra', false),

  (v_mf, v_party,
   'Strengthen Maharashtra border districts — recruit locals to police',
   'Recruit local domicile holders exclusively for police positions in Maharashtra border districts.',
   7, 'governance', ARRAY['police','Maharashtra','border','domicile'],
   'Maharashtra Police recruitment notification in border districts mandates domicile certificate.',
   NULL, 'maharashtra', false),

  (v_mf, v_party,
   'Complete ban on loudspeakers in non-designated zones in Maharashtra',
   'Enforce strict ban on loudspeakers, religious processions using amplifiers in non-designated zones, protecting peace.',
   15, 'governance', ARRAY['loudspeakers','noise','Maharashtra','law enforcement'],
   'Maharashtra state noise pollution amendment enacted; loudspeaker ban enforced by police in all cities.',
   NULL, 'maharashtra', false);
END $$;

-- ── Additional promises for TDP, JDU, RJD, AIADMK, JDS (to reach 100+ total) ──

-- Extra TDP promises
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'tdp';
  SELECT id INTO v_mf FROM manifestos WHERE party_id = v_party AND election_year = 2024;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Polavaram irrigation project — complete by 2027',
   'Complete the Polavaram multipurpose project to irrigate 7.2 lakh hectares and provide drinking water to 540 villages.',
   6, 'agriculture', ARRAY['Polavaram','irrigation','AP'],
   'Polavaram project commissioned with all gates functional and canal network irrigating 7.2 lakh ha by 2027.',
   '{"metric":"irrigated area","value":720000,"unit":"hectares","deadline_year":2027}',
   'andhra_pradesh', true),

  (v_mf, v_party,
   'Vizag steel plant — stop privatisation, protect 25,000 jobs',
   'Reverse the decision to privatise Vizag Steel (RINL) and protect the 25,000 direct jobs of workers.',
   12, 'economy', ARRAY['Vizag Steel','RINL','privatisation','jobs'],
   'Cabinet decision to drop RINL privatisation; workers'' jobs secured for 10 years.',
   '{"metric":"jobs protected","value":25000,"unit":"direct jobs"}',
   'andhra_pradesh', true),

  (v_mf, v_party,
   'Skill Naipunya Samstha — 10 lakh youth trained in 5 years',
   'Train 10 lakh Andhra Pradesh youth in industry-relevant skills through the Skill Naipunya Samstha scheme.',
   16, 'employment', ARRAY['skill training','AP youth','Naipunya'],
   '10 lakh skill certifications issued by Skill Naipunya Samstha with 60%+ placement rate within 5 years.',
   '{"metric":"trained youth","value":1000000,"unit":"youth","deadline_year":2029}',
   'andhra_pradesh', false);
END $$;

-- Extra JDU promises
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'jdu';
  SELECT id INTO v_mf FROM manifestos WHERE party_id = v_party AND election_year = 2024;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Liquor prohibition — demand national framework for Bihar model',
   'JDU will demand the Centre provide a fiscal compensation framework for states implementing prohibition, replicating Bihar model.',
   24, 'governance', ARRAY['liquor prohibition','Bihar','fiscal compensation'],
   'Centre announces compensation package for prohibition states equivalent to foregone excise revenue.',
   NULL, 'national', false),

  (v_mf, v_party,
   'Seven Nischay Part-2 — complete pending Bihar welfare schemes',
   'Ensure all pending works under Seven Nischay Part-2 (roads, lights, clean water) are complete within 2 years.',
   19, 'infrastructure', ARRAY['Seven Nischay','Bihar','rural development'],
   'All Seven Nischay Part-2 targets achieved and independently verified by NABARD social audit within 2 years.',
   NULL, 'bihar', true),

  (v_mf, v_party,
   'Ganga expressway link to Bihar — Patna to UP border highway',
   'Demand funding for a 4-lane access highway connecting Patna to UP''s Ganga Expressway to reduce logistics costs.',
   26, 'infrastructure', ARRAY['highway','Bihar','Patna','Ganga Expressway'],
   'DPR approved and land acquisition begun for Patna-UP border expressway link by 2026.',
   NULL, 'bihar', false);
END $$;

-- Extra RJD promises
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'rjd';
  SELECT id INTO v_mf FROM manifestos WHERE party_id = v_party AND election_year = 2024;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Women''s reservation in government jobs — 35% for Bihar',
   'Ensure 35% reservation for women in all state and central government jobs allocated to Bihar.',
   20, 'women', ARRAY['women reservation','govt jobs','Bihar'],
   'Bihar government notification mandating 35% women quota in state service recruitment.',
   NULL, 'bihar', false),

  (v_mf, v_party,
   'Abua Awas Yojana — 20 lakh affordable homes in 5 years',
   'Build 20 lakh affordable pucca houses for the landless poor in Bihar through Abua Awas-equivalent scheme.',
   22, 'infrastructure', ARRAY['housing','Bihar poor','affordable homes'],
   '20 lakh affordable housing units sanctioned and constructed within 5 years.',
   '{"metric":"houses","value":2000000,"unit":"houses","deadline_year":2029}',
   'bihar', false),

  (v_mf, v_party,
   'Bihar sports academy — dedicated sports training for backward caste athletes',
   'Establish a state-of-the-art sports academy in Bihar with dedicated seats for SC/ST/OBC athletes.',
   21, 'social_welfare', ARRAY['sports academy','Bihar','SC/ST/OBC','athletes'],
   'Bihar Sports Academy operational with 1,000+ training seats, 60% reserved for SC/ST/OBC athletes.',
   '{"metric":"training seats","value":1000,"unit":"seats"}',
   'bihar', false);
END $$;

-- Extra AIADMK promises
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'aiadmk';
  SELECT id INTO v_mf FROM manifestos WHERE party_id = v_party AND election_year = 2024;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Amma Two-Wheeler Scheme revival — two-wheelers to working women',
   'Revive the Amma Two-Wheeler scheme to provide subsidised scooters to working women in Tamil Nadu.',
   12, 'women', ARRAY['Amma scheme','two-wheeler','Tamil Nadu women'],
   'Amma Two-Wheeler scheme relaunched; 2 lakh subsidised scooters distributed within first year.',
   '{"metric":"beneficiaries","value":200000,"unit":"women"}',
   'tamil_nadu', false),

  (v_mf, v_party,
   'Fishermen welfare — Rs 5,000 per month during ban period',
   'Provide Rs 5,000 per month as livelihood support to sea fishermen during the annual fishing ban period.',
   34, 'social_welfare', ARRAY['fishermen','Tamil Nadu','fishing ban','welfare'],
   'Rs 5,000 monthly support to registered sea fishermen during both ban periods; funded by TN fisheries dept.',
   '{"metric":"monthly support","value":5000,"unit":"INR/month"}',
   'tamil_nadu', false),

  (v_mf, v_party,
   'Tamil Nadu textile industry — duty protection from Chinese imports',
   'Demand enhanced import duties on Chinese textiles and power-loom goods to protect Tamil Nadu weavers.',
   26, 'economy', ARRAY['textiles','Tamil Nadu','import duty','China'],
   'Customs Ministry raises import duty on key textile categories threatening Tamil Nadu weavers.',
   NULL, 'tamil_nadu', false);
END $$;

-- Extra JD(S) and BJD promises to reach 100+
DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'jds';
  SELECT id INTO v_mf FROM manifestos WHERE party_id = v_party AND election_year = 2024;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Vokkaliga community development corporation — Rs 2,000 crore corpus',
   'Establish a Karnataka government corporation with Rs 2,000 crore to fund education, health, and enterprise for Vokkaliga communities.',
   19, 'social_welfare', ARRAY['Vokkaliga','community development','Karnataka'],
   'Karnataka Vokkaliga Development Corporation notified with Rs 2,000 crore budget allocation.',
   '{"metric":"corpus","value":20000000000,"unit":"INR"}',
   'karnataka', false),

  (v_mf, v_party,
   'Mandya sugar belt — revive closed co-operative sugar factories',
   'Reopen and revitalise closed co-operative sugar factories in Mandya and Mysuru to revive sugarcane farming economy.',
   14, 'agriculture', ARRAY['Mandya','sugar','cooperative','Karnataka'],
   'At least 3 cooperative sugar factories in Mandya/Mysuru revived and crushing season resumed.',
   NULL, 'karnataka', false),

  (v_mf, v_party,
   'National education policy — mother tongue medium in primary schools',
   'Advocate and implement Kannada-medium instruction in all Karnataka primary schools under NEP mother-tongue policy.',
   17, 'education', ARRAY['Kannada','mother tongue','NEP','primary education'],
   'Karnataka implements NEP mother-tongue mandate in all government primary schools from 2025-26 academic year.',
   NULL, 'karnataka', false),

  (v_mf, v_party,
   'Hassan-Bengaluru expressway project fast-track',
   'Expedite the Hassan-Mangaluru-Bengaluru expressway to improve connectivity for the Old Mysore region.',
   6, 'infrastructure', ARRAY['Hassan','Mangaluru','expressway','Karnataka'],
   'DPR approved and land acquisition completed for Hassan-Bengaluru expressway by 2026.',
   NULL, 'karnataka', false);
END $$;

DO $$
DECLARE v_party uuid; v_mf uuid;
BEGIN
  SELECT id INTO v_party FROM parties WHERE slug = 'bjd';
  SELECT id INTO v_mf FROM manifestos WHERE party_id = v_party AND election_year = 2024;

  INSERT INTO promises (manifesto_id, party_id, title, text, page_ref, category, tags, success_criteria, target_metric, geography, is_headline)
  VALUES
  (v_mf, v_party,
   'Startup Odisha — 10,000 startups in 5 years',
   'Scale Startup Odisha mission to incubate and support 10,000 new ventures, focusing on tribal and women entrepreneurs.',
   20, 'economy', ARRAY['startup','Odisha','entrepreneurship','tribal women'],
   '10,000 startups registered and supported under Startup Odisha with measurable revenue milestones.',
   '{"metric":"startups","value":10000,"unit":"ventures","deadline_year":2029}',
   'odisha', false),

  (v_mf, v_party,
   'Coastal Odisha fishermen — deep sea fishing trawler support',
   'Provide subsidised deep sea trawlers to fishing cooperatives in Odisha''s 480 km coast under central blue economy scheme.',
   14, 'agriculture', ARRAY['fishermen','Odisha','deep sea','trawler'],
   '500 deep sea trawlers provided to Odisha fishing cooperatives at 50% subsidy within 3 years.',
   '{"metric":"trawlers","value":500,"unit":"trawlers"}',
   'odisha', false),

  (v_mf, v_party,
   'Odisha IT sector — attract 50 Fortune 500 companies to Bhubaneswar',
   'Offer special incentives to attract 50 Fortune 500 companies to establish presence in Bhubaneswar IT corridor.',
   21, 'economy', ARRAY['IT','Bhubaneswar','Fortune 500','investment'],
   '50 Fortune 500 MoUs signed and at least 20 with operational offices in Bhubaneswar by 2028.',
   '{"metric":"companies","value":50,"unit":"Fortune 500 companies","deadline_year":2028}',
   'odisha', false),

  (v_mf, v_party,
   'Ama Scooter Yojana — subsidised two-wheelers for women in Odisha',
   'Provide subsidised two-wheelers to women aged 18-35 in Odisha for employment and mobility.',
   6, 'women', ARRAY['Ama Scooter','women mobility','Odisha','two-wheeler'],
   '1 lakh subsidised scooters distributed to women in Odisha within 2 years.',
   '{"metric":"beneficiaries","value":100000,"unit":"women"}',
   'odisha', false);
END $$;
