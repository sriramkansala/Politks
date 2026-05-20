-- BJP Sankalp Patra 2024 — Lok Sabha General Election
-- Source: https://www.bjp.org/files/2024-04/Modi-Ki-Guarantee-Sankalp-Patra-English.pdf
-- Extracted from 47 published highlights + official summary

DO $$
DECLARE
  v_party_id  uuid := '76cecf93-dc0a-4baa-8bfc-7e028a33291b';
  v_manifesto_id uuid;
BEGIN

-- Create manifesto record
INSERT INTO manifestos (
  party_id, election_type, election_year, title,
  title_translations, source_url, language, pages, status
) VALUES (
  v_party_id,
  'lok_sabha',
  2024,
  'BJP Sankalp Patra 2024 — Modi Ki Guarantee',
  '{"hi":"भाजपा संकल्प पत्र 2024 — मोदी की गारंटी"}',
  'https://www.bjp.org/files/2024-04/Modi-Ki-Guarantee-Sankalp-Patra-English.pdf',
  'en',
  76,
  'published'
) RETURNING id INTO v_manifesto_id;

-- Insert all promises
INSERT INTO promises (
  manifesto_id, party_id, title, text, page_ref,
  category, tags, success_criteria, target_metric, geography, is_headline
) VALUES

-- SOCIAL WELFARE
(v_manifesto_id, v_party_id,
 'Free rations for poor households for 5 more years',
 'The BJP government will continue providing free rations to poor households for another five years under PM Garib Kalyan Anna Yojana, ensuring no one goes hungry.',
 8, 'social_welfare', ARRAY['PMGKAY','free ration','food security'],
 'PM Garib Kalyan Anna Yojana continues uninterrupted through 2029 with beneficiary count maintained at 80 crore+, confirmed by Ministry of Food quarterly reports.',
 '{"metric":"beneficiaries","value":800000000,"unit":"people","deadline_year":2029}',
 'national', true),

(v_manifesto_id, v_party_id,
 '3 crore new houses under PM Awas Yojana by 2029',
 'BJP will build three crore new houses under PM Awas Yojana ensuring all poor households have a pucca home with basic amenities.',
 12, 'infrastructure', ARRAY['PM Awas','housing','pucca ghar'],
 '3 crore houses constructed and handed over under PMAY-G/U by 2029, verified by MoHUA dashboard and annual completion certificates.',
 '{"metric":"houses","value":30000000,"unit":"houses","deadline_year":2029}',
 'national', true),

(v_manifesto_id, v_party_id,
 'Zero electricity bills for poor via PM Surya Ghar rooftop solar',
 'Reduce poor households'' electricity costs to zero through the PM Surya Ghar Muft Bijli Yojana providing free rooftop solar installations generating 300 units/month.',
 18, 'energy', ARRAY['PM Surya Ghar','rooftop solar','free electricity','renewable'],
 '1 crore rooftop solar installations completed under PM Surya Ghar scheme by 2027, zero-bill status verified by DISCOM records for beneficiary households.',
 '{"metric":"rooftop solar installations","value":10000000,"unit":"households","deadline_year":2027}',
 'national', true),

-- WOMEN
(v_manifesto_id, v_party_id,
 '3 crore Lakhpati Didis — rural women earning ₹1 lakh+ per year',
 'BJP will increase the number of rural women earning over ₹1 lakh annually as Lakhpati Didis from the current 1 crore to 3 crore through SHG-linked skill and livelihood programs.',
 22, 'women', ARRAY['Lakhpati Didi','SHG','women empowerment','rural'],
 '3 crore women certified as Lakhpati Didis with documented annual income ≥₹1 lakh, verified by MoRD SHG portal data.',
 '{"metric":"Lakhpati Didis","value":30000000,"unit":"women","deadline_year":2029}',
 'national', true),

(v_manifesto_id, v_party_id,
 'One-third parliamentary seats reserved for women — Nari Shakti Vandan Adhiniyam',
 'BJP will implement the Nari Shakti Vandan Adhiniyam reserving one-third of Lok Sabha and state legislative assembly seats for women.',
 24, 'women', ARRAY['Nari Shakti','womens reservation','33 percent'],
 'Delimitation completed and women''s reservation in effect for Lok Sabha and state assemblies as per the Constitutional Amendment Act, 2023.',
 NULL,
 'national', true),

(v_manifesto_id, v_party_id,
 'Special campaign to eliminate cervical cancer among women',
 'BJP will launch a special initiative including widespread HPV vaccination and screening to eliminate cervical cancer among women.',
 26, 'healthcare', ARRAY['cervical cancer','HPV vaccine','womens health'],
 'HPV vaccination coverage reaches 90%+ of girls aged 9-14 by 2027, measured by COWIN/NHM immunization data.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'Public toilet facilities constructed and maintained for women across India',
 'BJP will construct and maintain public toilet facilities for women in all towns and key locations, ensuring safe sanitation access.',
 25, 'women', ARRAY['sanitation','women safety','public toilets'],
 'Functional women''s public toilets in all ULBs above 10,000 population confirmed by SBM-Urban dashboard by 2026.',
 NULL,
 'national', false),

-- HEALTHCARE
(v_manifesto_id, v_party_id,
 'Ayushman Bharat extended to all citizens aged 70 and above',
 'BJP will include every Indian citizen aged 70 years and above in the Ayushman Bharat Pradhan Mantri Jan Arogya Yojana health coverage scheme, providing ₹5 lakh annual health cover.',
 30, 'healthcare', ARRAY['Ayushman Bharat','senior citizens','AB-PMJAY','health insurance'],
 'All citizens aged 70+ enrolled in AB-PMJAY and able to avail cashless treatment at empanelled hospitals, confirmed by NHA portal data.',
 '{"metric":"senior citizens covered","value":60000000,"unit":"people"}',
 'national', true),

(v_manifesto_id, v_party_id,
 'Ayushman Bharat coverage extended to transgender persons',
 'Transgender persons will also be covered under the Ayushman Bharat scheme with government-issued identity cards.',
 31, 'social_welfare', ARRAY['Ayushman Bharat','transgender','inclusion'],
 'Transgender persons with valid identity cards enrolled in AB-PMJAY and accessing cashless treatment, confirmed by NHA enrollment data.',
 NULL,
 'national', false),

-- AGRICULTURE
(v_manifesto_id, v_party_id,
 '₹6,000/year PM Kisan Samman Nidhi continued for all farmers',
 'BJP will maintain and continue the PM Kisan Samman Nidhi annual financial assistance of ₹6,000 per farmer family, with timely direct benefit transfer.',
 35, 'agriculture', ARRAY['PM Kisan','farmer income','DBT'],
 'Three annual instalments of ₹2,000 each transferred to all eligible farmers without interruption through 2029, verified by PM Kisan portal.',
 '{"metric":"annual transfer per farmer","value":6000,"unit":"INR per year"}',
 'national', true),

(v_manifesto_id, v_party_id,
 'MSP for major crops increased continuously above cost of production',
 'BJP commits to continue increasing MSP for major crops ensuring farmers receive prices significantly above their cost of production (C2 basis).',
 36, 'agriculture', ARRAY['MSP','minimum support price','farmers','C2 formula'],
 'CACP recommends and government notifies MSP at ≥1.5x C2 cost for all 23 Kharif and Rabi crops annually, published in official gazette.',
 NULL,
 'national', true),

(v_manifesto_id, v_party_id,
 'Dedicated agricultural satellite for farmer support services',
 'BJP will deploy a dedicated satellite for agricultural data collection, crop monitoring, soil health mapping and farmer service delivery.',
 38, 'agriculture', ARRAY['agri satellite','precision farming','technology','ISRO'],
 'Agricultural satellite launched and operational providing real-time crop data to state agriculture departments and farmer apps by 2027.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'Satellite imagery for fishermen safety and service delivery',
 'BJP will use satellite imagery systems to improve fishermen''s safety at sea and enable timely delivery of government services to fishing communities.',
 39, 'agriculture', ARRAY['fishermen','satellite','marine safety','coastal'],
 'Satellite-based fishermen safety alert system operational in all major maritime states, reducing at-sea accidents by 30% vs 2024 baseline.',
 NULL,
 'national', false),

-- YOUTH & EDUCATION
(v_manifesto_id, v_party_id,
 'Stringent law against exam paper leaks for government job recruitment',
 'BJP will enact a strong law to prevent and penalize paper leaks in government job recruitment examinations, protecting youth from fraud.',
 42, 'governance', ARRAY['exam paper leak','youth employment','UPSC','SSC','government jobs'],
 'Public Examinations (Prevention of Unfair Means) Act or equivalent stringent legislation passed and enforced, with at least one conviction under the new law.',
 NULL,
 'national', true),

(v_manifesto_id, v_party_id,
 'One Nation One Student ID from pre-school through higher education',
 'BJP will implement a unified student identity system covering every Indian student from pre-school through higher education for seamless record management.',
 44, 'education', ARRAY['APAAR','student ID','education','NEP'],
 'APAAR (Academic Bank of Credits) student ID issued to 100% of enrolled students from Class 1 through higher education by 2027, per UDISE+ data.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'Ekalavya Model Residential Schools expanded for Scheduled Tribe students',
 'BJP will expand Ekalavya Model Residential Schools beyond the current 740 to cover more Scheduled Tribe-majority blocks, improving tribal education access.',
 45, 'education', ARRAY['Ekalavya','tribal education','scheduled tribes','residential schools'],
 'Number of functional Ekalavya Model Residential Schools exceeds 740 baseline, with at least one per ST-majority block having 20,000+ tribal population, per MoTA data.',
 '{"metric":"EMRS schools","value":740,"unit":"schools (baseline)"}',
 'national', false),

(v_manifesto_id, v_party_id,
 'Startup ecosystem expanded to tier-2 and tier-3 cities for middle-class employment',
 'BJP will create middle-class employment through expanding the startup ecosystem to tier-2 and tier-3 cities, with improved access to funding and incubation.',
 48, 'economy', ARRAY['startups','employment','tier-2 cities','DPIIT'],
 'DPIIT-registered startups in tier-2/3 cities increase by 50% over 2024 baseline by 2027, with dedicated incubator in each state capital.',
 NULL,
 'national', false),

-- ECONOMY & MSME
(v_manifesto_id, v_party_id,
 'MSME regulations simplified at both central and state levels',
 'BJP will streamline and simplify regulatory requirements for micro, small and medium enterprises at central and state levels, reducing compliance burden.',
 50, 'economy', ARRAY['MSME','ease of doing business','regulation','small business'],
 'MSME compliance burden reduced by at least 30% as measured by DPIIT ease of doing business index, with state-level single-window clearances operational.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'Cybersecurity ecosystem and products for small and medium traders',
 'BJP will establish public cybersecurity products and support systems specifically designed for small and medium traders to protect them from online fraud.',
 51, 'technology', ARRAY['cybersecurity','MSME','digital trade','fraud prevention'],
 'Government-backed affordable cybersecurity toolkit available to all registered MSMEs by 2026, with at least 50 lakh businesses onboarded.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'India to become global electronics manufacturing hub by 2030',
 'BJP will establish India as a global electronics manufacturing hub by 2030 through PLI schemes, infrastructure development and skill programs.',
 54, 'economy', ARRAY['electronics','manufacturing','PLI','Make in India'],
 'India''s electronics exports exceed $300 billion by 2030 and domestic production exceeds $500 billion, per MeitY annual report.',
 '{"metric":"electronics exports","value":300,"unit":"billion USD","deadline_year":2030}',
 'national', false),

(v_manifesto_id, v_party_id,
 'Semiconductor and chip manufacturing industry development',
 'BJP will encourage semiconductor and chip manufacturing in India, building on the India Semiconductor Mission to reduce import dependence.',
 55, 'technology', ARRAY['semiconductor','chips','India Semiconductor Mission','self-reliance'],
 'At least 3 greenfield semiconductor fabrication facilities operational in India by 2030 under India Semiconductor Mission.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'India as pharmacy of the world — pharmaceutical sector strengthened',
 'BJP will strengthen India''s position as the pharmacy of the world through support for pharmaceutical R&D, quality upgrades, and global market access.',
 56, 'economy', ARRAY['pharmaceuticals','exports','pharma','generic medicines'],
 'India''s pharmaceutical exports exceed $65 billion by 2029 (vs ~$27 billion in 2023), per Pharmaceuticals Export Promotion Council data.',
 '{"metric":"pharma exports","value":65,"unit":"billion USD","deadline_year":2029}',
 'national', false),

-- INFRASTRUCTURE & TRANSPORT
(v_manifesto_id, v_party_id,
 'Modern highway amenities for truck drivers along national highways',
 'BJP will develop modern wayside amenity facilities along national highways for truck drivers including rest stops, fuel, food, medical and mechanical assistance.',
 58, 'transport', ARRAY['truck drivers','national highways','wayside amenities','NHAI'],
 'Wayside amenities operational every 100 km on all 4-lane National Highways by 2027, confirmed by NHAI facility tracker.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'Bullet train feasibility studies for North, South and East India corridors',
 'BJP will conduct feasibility studies for bullet train high-speed rail corridors in north, south and east India beyond the existing Mumbai-Ahmedabad line.',
 60, 'transport', ARRAY['bullet train','high speed rail','HSR','connectivity'],
 'Detailed Project Reports for at least two new bullet train corridors (beyond Mumbai-Ahmedabad) submitted to Ministry of Railways by 2026.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'New airports, helipads and aerodromes — air connectivity expanded',
 'BJP will construct new airports, helipads and aerodromes to dramatically increase air connectivity, especially to tier-2, tier-3 cities and remote areas.',
 61, 'transport', ARRAY['airports','UDAN','air connectivity','regional aviation'],
 'Number of operational airports in India exceeds 150 (vs 148 in 2024), with UDAN routes increased by 50% by 2027, per AAI annual report.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'Water metro systems expanded beyond Kochi to more cities',
 'BJP will expand water metro and inland waterway-based public transport systems to more Indian cities beyond the existing Kochi Water Metro.',
 62, 'transport', ARRAY['water metro','inland waterways','public transport','IWAI'],
 'Water metro / ferry-based urban transport systems operational in at least 5 cities (vs 1 in 2024) by 2029.',
 '{"metric":"cities with water metro","value":5,"unit":"cities","deadline_year":2029}',
 'national', false),

-- ENERGY
(v_manifesto_id, v_party_id,
 'Complete energy self-sufficiency for India by 2047',
 'BJP commits to achieving complete energy self-sufficiency for India by 2047 (Amrit Kaal centenary) through renewable energy, nuclear power and domestic fossil fuel development.',
 64, 'energy', ARRAY['energy independence','2047','renewable energy','Amrit Kaal'],
 'India''s import dependence for energy falls below 20% of total consumption by 2047, with renewable installed capacity exceeding 500 GW.',
 '{"metric":"renewable energy capacity","value":500,"unit":"GW","deadline_year":2047}',
 'national', false),

(v_manifesto_id, v_party_id,
 'Nuclear energy expanded with small modular reactors',
 'BJP will expand India''s nuclear energy network by developing and deploying small modular reactors alongside large conventional nuclear plants.',
 65, 'energy', ARRAY['nuclear energy','SMR','small modular reactor','NPCIL'],
 'At least 2 new nuclear power plants (conventional or SMR) commissioned and contributing to the national grid by 2029, per DAE annual report.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'National smart grid established for efficient energy management',
 'BJP will establish a national smart grid system for efficient management, monitoring and distribution of energy across India.',
 67, 'energy', ARRAY['smart grid','power distribution','energy management','renewable integration'],
 'National smart grid covering all state grids integrated and operational with real-time demand-response, per MoP annual report by 2028.',
 NULL,
 'national', false),

-- GOVERNANCE
(v_manifesto_id, v_party_id,
 'Uniform Civil Code enacted across India',
 'BJP reiterates its commitment to draw up and implement a Uniform Civil Code across India, drawing upon the best traditions and harmonizing with modern times.',
 70, 'governance', ARRAY['UCC','uniform civil code','personal law','secularism'],
 'A Uniform Civil Code bill passed by Parliament and notified in the Official Gazette, applicable across all states.',
 NULL,
 'national', true),

(v_manifesto_id, v_party_id,
 'One Nation One Election — simultaneous elections at all levels',
 'BJP will implement simultaneous elections for Lok Sabha, state assemblies and local bodies to reduce governance disruption and election expenditure.',
 71, 'governance', ARRAY['One Nation One Election','simultaneous elections','electoral reform'],
 'Constitutional amendments passed enabling simultaneous elections, with first synchronized election cycle implemented before 2029.',
 NULL,
 'national', true),

(v_manifesto_id, v_party_id,
 'Common electoral roll for all levels of elections',
 'BJP will establish a unified electoral roll used across all levels of elections — parliamentary, state and local body — eliminating duplication.',
 72, 'governance', ARRAY['electoral roll','election commission','voter ID','electoral reform'],
 'A single common electoral roll adopted by Election Commission of India for use in all elections at all levels, per EC notification.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'E-Courts established and judicial records digitized in mission mode',
 'BJP will establish e-courts and digitize all judicial records in mission mode to improve access to justice and reduce case pendency.',
 73, 'justice', ARRAY['e-courts','judicial digitization','access to justice','pendency'],
 'All district courts covered under e-Courts Mission Mode Project Phase III with 100% digital record filing, per Department of Justice report by 2027.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'National forensic mission to increase criminal conviction rates',
 'BJP will launch a national forensic mission to build forensic capacity at state laboratories, improving evidence quality and increasing criminal conviction rates.',
 74, 'justice', ARRAY['forensic science','conviction rate','criminal justice','NFSU'],
 'State forensic labs accredited and forensic evidence available in 100% of heinous crime cases within 60 days of collection, per MHA data by 2027.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'District-level welfare committees ensuring OBC/SC/ST representation in benefit programs',
 'BJP will create district-level committees ensuring welfare program benefits reach all, with adequate representation of OBCs, Scheduled Castes and Scheduled Tribes.',
 40, 'social_welfare', ARRAY['OBC','SC','ST','welfare','inclusion','districts'],
 'District welfare committees operational in all 700+ districts with mandated OBC/SC/ST representation, annual inclusion audits published by 2026.',
 NULL,
 'national', false),

-- FOREIGN POLICY & CULTURE
(v_manifesto_id, v_party_id,
 'Indian foreign missions and diplomat numbers increased globally',
 'BJP will increase the number of Indian diplomatic missions and diplomats worldwide to strengthen India''s global presence and citizen services abroad.',
 76, 'foreign_policy', ARRAY['diplomacy','foreign missions','MEA','soft power'],
 'Number of Indian diplomatic missions increases by 20+ over 2024 baseline (currently ~190) by 2029, per MEA annual report.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'Thiruvalluvar Cultural Centres established worldwide',
 'BJP will establish Thiruvalluvar Cultural Centres globally to teach yoga, ayurveda, classical music and Indian languages, projecting Indian soft power.',
 77, 'culture', ARRAY['Thiruvalluvar','cultural centres','soft power','yoga','Indian languages'],
 'At least 10 new Thiruvalluvar Cultural Centres established in key countries by 2029, per ICCR annual report.',
 '{"metric":"cultural centres","value":10,"unit":"centres","deadline_year":2029}',
 'national', false),

(v_manifesto_id, v_party_id,
 'India bids to host the 2036 Olympic Games',
 'BJP will actively bid to host the 2036 Summer Olympic Games in India, building world-class sports infrastructure and boosting Olympic performance.',
 78, 'culture', ARRAY['Olympics 2036','sports','bid','infrastructure'],
 'India''s formal bid submitted to IOC for 2036 Olympics and shortlisted as candidate city, with National Olympic bid committee constituted.',
 NULL,
 'national', true),

-- DEFENSE
(v_manifesto_id, v_party_id,
 'Dedicated theatre military commands established',
 'BJP will establish joint theatre military commands integrating Army, Navy and Air Force for more effective and coordinated national defense.',
 80, 'defense', ARRAY['theatre commands','military','jointness','CDS','integrated'],
 'At least 3 theatre commands (Maritime, Land, and Air Defence) formally established and operational by 2027, per MoD notification.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'India''s strategic presence in Indian Ocean Region expanded',
 'BJP will expand India''s strategic presence in the Indian Ocean Region through maritime cooperation, island development and international partnerships.',
 81, 'defense', ARRAY['Indian Ocean','maritime','strategic','SAGAR','naval'],
 'India establishes bilateral maritime cooperation agreements with 5+ new Indian Ocean littoral states and operationalizes 2+ new naval facilities by 2029.',
 NULL,
 'national', false),

-- URBAN
(v_manifesto_id, v_party_id,
 'Satellite townships with transit-oriented development around major cities',
 'BJP will develop satellite townships with mixed-use and transit-oriented development around major cities to decongest urban centres and provide affordable housing.',
 82, 'urban', ARRAY['satellite townships','TOD','transit oriented','urban planning','housing'],
 'Master plans for satellite townships approved and development commenced around at least 10 major cities by 2027, per MoHUA notifications.',
 NULL,
 'national', false),

(v_manifesto_id, v_party_id,
 'Open landfills eliminated nationwide — Swachh Bharat',
 'BJP will work toward completely eliminating legacy open landfills across India under the Swachh Bharat Mission, processing all waste scientifically.',
 83, 'environment', ARRAY['landfill','Swachh Bharat','waste management','legacy waste'],
 'All 3,000+ legacy landfill sites remediated or scientifically closed by 2028, confirmed by MoHUA SBM-Urban dashboard.',
 '{"metric":"legacy landfill sites remediated","value":3000,"unit":"sites","deadline_year":2028}',
 'national', false),

(v_manifesto_id, v_party_id,
 'Digital urban land record system created',
 'BJP will create a comprehensive digital urban land record system to reduce property disputes, enable transparent transactions and support urban planning.',
 84, 'urban', ARRAY['land records','digital','urban','property rights','DILRMP'],
 'Digital land records for urban areas operational in all cities above 1 lakh population with 100% property mapping by 2027, per DoLR data.',
 NULL,
 'national', false),

-- DIGITAL & TECH SOVEREIGNTY
(v_manifesto_id, v_party_id,
 'India''s digital sovereignty protected against threatening organisations',
 'BJP will protect India''s digital sovereignty, data security and national interests from foreign threats and organisations working against India.',
 85, 'technology', ARRAY['digital sovereignty','data security','cyber threats','national security'],
 'National Data Security Policy enacted and at least one regulatory framework for platform accountability operational by 2026.',
 NULL,
 'national', false);

-- Update ingestion timestamp
UPDATE manifestos SET ingested_at = now() WHERE id = v_manifesto_id;

RAISE NOTICE 'BJP Sankalp Patra 2024: manifesto and promises inserted successfully. Manifesto ID: %', v_manifesto_id;

END $$;
