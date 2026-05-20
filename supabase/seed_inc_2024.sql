-- INC Nyay Patra 2024 – Lok Sabha manifesto
-- Party UUID: 36032d6f-92b5-46a8-b762-5ab14f8b97b9
-- Source: manifesto.inc.in, released 4 April 2024
-- 46 promises across 5 Nyay pillars + additional sections

DO $$
DECLARE
  party_id  UUID := '36032d6f-92b5-46a8-b762-5ab14f8b97b9';
  m_id      UUID;
BEGIN

-- Create manifesto record
INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, status)
VALUES (
  party_id, 'lok_sabha', 2024,
  'Nyay Patra 2024',
  'https://manifesto.inc.in/',
  'en', 'published'
)
ON CONFLICT DO NOTHING
RETURNING id INTO m_id;

IF m_id IS NULL THEN
  SELECT id INTO m_id FROM manifestos WHERE party_id = party_id AND election_year = 2024 LIMIT 1;
END IF;

-- ─────────────────────────────────────────────────────────────────
-- YUVA NYAY (Youth Justice)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO promises (party_id, manifesto_id, title, text, category, status, geography, is_headline, ordinal) VALUES

(party_id, m_id,
 'Right to Apprenticeship Act: paid one-year apprenticeship for every graduate under 25',
 'Congress will enact a Right to Apprenticeship Act guaranteeing a one-year apprenticeship with a private or public sector company to every diploma holder or college graduate below the age of 25. Apprentices will receive ₹1 lakh per year as a stipend.',
 'employment', 'not_yet_rated', 'national', true, 1),

(party_id, m_id,
 'Fill 30 lakh central government vacancies in sanctioned posts',
 'Congress will fill nearly 30 lakh vacancies in sanctioned posts at various levels in the central government, educational institutions, medical institutions, and Armed Police Forces on a priority basis.',
 'employment', 'not_yet_rated', 'national', true, 2),

(party_id, m_id,
 'Write off all outstanding student educational loans as of 15 March 2024',
 'Congress will write off all educational loans — both principal and unpaid interest — as of March 15, 2024, as a one-time measure of relief for young people burdened by debt.',
 'education', 'not_yet_rated', 'national', true, 3),

(party_id, m_id,
 'Abolish all application fees for central government examinations and posts',
 'Congress will eliminate fees for applications to all central government examinations and posts so that economic hardship does not prevent youth from competing for public employment.',
 'governance', 'not_yet_rated', 'national', false, 4),

(party_id, m_id,
 'Fast-track courts for question paper leak cases with monetary compensation',
 'Congress will set up fast-track courts to handle cases related to question paper leaks and other examination frauds, and pay monetary compensation to candidates whose examinations were compromised.',
 'governance', 'not_yet_rated', 'national', false, 5),

(party_id, m_id,
 'Restructure Fund of Funds: 50% distributed equally across districts for entrepreneurs under 40',
 'Congress will restructure the government Fund of Funds so that 50% of the allocation is distributed equally across all districts, with priority to entrepreneurs under 40 years of age.',
 'economy', 'not_yet_rated', 'national', false, 6),

(party_id, m_id,
 'Sports scholarships of ₹10,000 per month for athletes under 21',
 'Congress will provide sports scholarships of ₹10,000 per month to athletes under 21 years of age to nurture sporting talent and support young champions.',
 'sports', 'not_yet_rated', 'national', false, 7),

-- ─────────────────────────────────────────────────────────────────
-- NAARI NYAY (Women''s Justice)
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Mahalaxmi Scheme: ₹1 lakh per year direct cash transfer to oldest woman in every poor family',
 'Congress will launch the Mahalakshmi scheme to provide an unconditional cash transfer of ₹1 lakh per year directly into the bank account of the oldest woman in every poor Indian household, empowering women with financial independence.',
 'social_welfare', 'not_yet_rated', 'national', true, 8),

(party_id, m_id,
 '50% of all central government jobs reserved for women starting 2025',
 'Congress will ensure that one-half (50%) of all central government jobs are reserved for women starting from 2025, and will actively appoint women to senior positions including judges, secretaries, police officers, and board directors.',
 'women_empowerment', 'not_yet_rated', 'national', true, 9),

(party_id, m_id,
 'One-third reservation for women in State Assemblies (2025) and Lok Sabha (2029)',
 'Congress will implement one-third reservation for women in State Assemblies in the next round of assembly elections (2025 onward) and extend this to Lok Sabha from the 2029 general election.',
 'governance', 'not_yet_rated', 'national', true, 10),

(party_id, m_id,
 'Double central government budget contribution to ASHA workers, Anganwadi workers, and mid-day meal cooks',
 'Congress will double the central government''s share of wages and honoraria for frontline workers — ASHA workers, Anganwadi workers, and mid-day meal cooks — recognising their essential role in public health and nutrition.',
 'women_empowerment', 'not_yet_rated', 'national', false, 11),

(party_id, m_id,
 'Establish Savitribai Phule women''s hostels in every district; expand credit access for women-led SHGs',
 'Congress will establish Savitribai Phule working women''s hostels in every district and substantially increase institutional credit to women and Self Help Groups to support women''s economic participation.',
 'women_empowerment', 'not_yet_rated', 'national', false, 12),

(party_id, m_id,
 'Enforce "Same Work, Same Wages" to eliminate gender-based wage discrimination',
 'Congress will enforce the principle of Same Work, Same Wages to prevent discrimination in wages on the basis of gender across all sectors of employment, public and private.',
 'women_empowerment', 'not_yet_rated', 'national', false, 13),

(party_id, m_id,
 'Review all discriminatory laws against women in first year; appoint Adhikar Maitri paralegal in every Panchayat',
 'Congress will review all laws discriminatory to women in the first year of a Congress government, and appoint an Adhikar Maitri (paralegal worker) in every Panchayat to educate women on their rights and support legal action.',
 'governance', 'not_yet_rated', 'national', false, 14),

-- ─────────────────────────────────────────────────────────────────
-- KISAAN NYAY (Farmer''s Justice)
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Legal guarantee to MSP for all crops at Swaminathan Commission C2+50% formula',
 'Congress will enact a law providing a legal guarantee to Minimum Support Price (MSP) for all crops at the formula recommended by the Swaminathan Commission — cost of production C2 plus 50% margin — ensuring farmers receive remunerative prices.',
 'agriculture', 'not_yet_rated', 'national', true, 15),

(party_id, m_id,
 'Comprehensive farm loan waiver for all farmers',
 'Congress will implement a comprehensive waiver of farm loans for all farmers across India, providing relief from the debt burden that has driven agrarian distress and farmer suicides.',
 'agriculture', 'not_yet_rated', 'national', true, 16),

(party_id, m_id,
 'Settle all crop insurance claims within 30 days; pay crop loss compensation directly to farmers within 30 days',
 'Congress will reform crop insurance so that all claims are settled within 30 days, and compensation for crop loss is paid directly into farmers'' bank accounts within 30 days of assessment.',
 'agriculture', 'not_yet_rated', 'national', false, 17),

(party_id, m_id,
 'Remove GST from all agricultural commodities; set farmer-friendly import-export policy',
 'Congress will remove GST from all agricultural commodities and inputs, and formulate an import-export policy that protects Indian farmers from unfair competition and price crashes due to sudden imports.',
 'agriculture', 'not_yet_rated', 'national', false, 18),

(party_id, m_id,
 'Resolve all pending Forest Rights Act claims within 1 year; review rejected claims within 6 months',
 'Congress will resolve all pending claims under the Forest Rights Act within one year and review all rejected claims within six months, securing the land and livelihood rights of adivasi and forest-dwelling communities.',
 'tribal_affairs', 'not_yet_rated', 'national', false, 19),

(party_id, m_id,
 'Double agricultural R&D funding in 5 years; revive agricultural extension services',
 'Congress will double the funding for research and development in agriculture within five years and revive the agricultural extension services network to bring new knowledge and technology directly to farmers.',
 'agriculture', 'not_yet_rated', 'national', false, 20),

(party_id, m_id,
 'Double value of dairy and poultry output within 5 years',
 'Congress will provide targeted support to double the value of output in dairying and poultry within five years, boosting incomes for millions of rural households dependent on livestock.',
 'agriculture', 'not_yet_rated', 'national', false, 21),

(party_id, m_id,
 'Establish one government agricultural college per district',
 'Congress will establish a government agricultural college in every district to build agricultural knowledge, conduct applied research, and provide technical support to local farming communities.',
 'agriculture', 'not_yet_rated', 'national', false, 22),

-- ─────────────────────────────────────────────────────────────────
-- SHRAMIK NYAY (Workers'' Justice)
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Set national minimum wage at ₹400 per day; raise MGNREGA wages to ₹400 per day',
 'Congress will guarantee a national minimum wage of ₹400 per day for all workers and simultaneously raise wages under the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) to ₹400 per day.',
 'employment', 'not_yet_rated', 'national', true, 23),

(party_id, m_id,
 'Enact law protecting gig workers and unorganised sector workers with social security',
 'Congress will enact legislation specifying and protecting the rights of gig workers and unorganised workers, and substantially enhance their social security coverage including health insurance, provident fund, and accident benefits.',
 'employment', 'not_yet_rated', 'national', false, 24),

(party_id, m_id,
 'Launch urban employment programme guaranteeing work for urban poor in infrastructure renewal',
 'Congress will launch a new urban employment programme guaranteeing work for the urban poor in the reconstruction and renewal of urban infrastructure such as roads, drains, public buildings, and green spaces.',
 'employment', 'not_yet_rated', 'national', false, 25),

(party_id, m_id,
 'Double Anganwadi workforce and create 14 lakh additional care economy jobs',
 'Congress will double the number of Anganwadi workers across India and create an additional 14 lakh jobs in the care economy, recognising the critical role of childcare and nutrition workers.',
 'social_welfare', 'not_yet_rated', 'national', false, 26),

(party_id, m_id,
 'Enact laws protecting domestic workers and migrant workers with basic legal rights',
 'Congress will enact legislation to regulate the employment of domestic workers and migrant workers, granting them basic legal protections, minimum wages, and social security entitlements.',
 'employment', 'not_yet_rated', 'national', false, 27),

(party_id, m_id,
 'Expand Indira Canteens offering subsidised nutritious meals for urban poor',
 'Congress will expand Indira Canteens offering subsidised nutritious meals to urban and peri-urban poor, modelled on the successful Indira Canteens established in Karnataka and Rajasthan.',
 'social_welfare', 'not_yet_rated', 'national', false, 28),

-- ─────────────────────────────────────────────────────────────────
-- HISSEDARI NYAY (Equity / Participation Justice)
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Conduct comprehensive nationwide socio-economic caste census',
 'Congress will conduct a comprehensive nationwide caste census to enumerate the population, their socio-economic conditions, and representation in governance institutions — providing the factual foundation for equitable policy and reservations.',
 'governance', 'not_yet_rated', 'national', true, 29),

(party_id, m_id,
 'Remove 50% constitutional cap on SC/ST/OBC reservations in jobs and education',
 'Congress will amend the Constitution to remove the judicially imposed 50% cap on reservations for Scheduled Castes, Scheduled Tribes, and Other Backward Classes in government jobs and educational institutions.',
 'social_welfare', 'not_yet_rated', 'national', true, 30),

(party_id, m_id,
 'Fill all backlog SC/ST/OBC reserved vacancies within 1 year',
 'Congress will fill all accumulated backlog vacancies reserved for Scheduled Castes, Scheduled Tribes, and OBCs at all levels of government within one year of coming to power.',
 'social_welfare', 'not_yet_rated', 'national', false, 31),

(party_id, m_id,
 'Double scholarship funds for OBC, SC, and ST students in higher education',
 'Congress will double scholarship funds available to students from Other Backward Classes, Scheduled Castes, and Scheduled Tribes, with particular focus on higher education support.',
 'education', 'not_yet_rated', 'national', false, 32),

(party_id, m_id,
 'Pay ₹30 lakh compensation to families of sanitation workers who died in sewers or septic tanks',
 'Congress will ensure that ₹30 lakh is paid as compensation to the families of all sanitation workers who died while manually cleaning sewers and septic tanks, acknowledging the sacrifice of these workers.',
 'social_welfare', 'not_yet_rated', 'national', false, 33),

(party_id, m_id,
 'Raise monthly pension for senior citizens, widows, and persons with disabilities to ₹1,000',
 'Congress will raise the central government''s contribution to pensions for senior citizens, widows, and persons with disabilities from the current ₹200–500 per month to ₹1,000 per month.',
 'social_welfare', 'not_yet_rated', 'national', false, 34),

(party_id, m_id,
 'Enact legislation recognising civil unions for LGBTQIA+ persons',
 'Congress will bring legislation to recognise civil unions for LGBTQIA+ persons following wide national consultation, affirming dignity and equal rights for all citizens regardless of sexual orientation or gender identity.',
 'governance', 'not_yet_rated', 'national', false, 35),

-- ─────────────────────────────────────────────────────────────────
-- HEALTH
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Universal free healthcare at all public facilities covering diagnosis, treatment, medicines, and surgery',
 'Congress will make healthcare universal and free at all public health centres including hospitals, clinics, and primary health centres — covering examination, diagnostics, treatment, surgery, medicines, rehabilitation, and palliative care.',
 'healthcare', 'not_yet_rated', 'national', true, 36),

(party_id, m_id,
 'Cashless health insurance coverage up to ₹25 lakhs per family (Rajasthan model)',
 'Congress will extend cashless health insurance coverage of up to ₹25 lakhs per family to all Indians, modelled on the universal health scheme implemented in Rajasthan during the Congress government.',
 'healthcare', 'not_yet_rated', 'national', false, 37),

(party_id, m_id,
 'Increase health budget to 4% of total government expenditure by 2028–29',
 'Congress will increase the government''s health budget to 4% of total expenditure by 2028–29, reversing years of under-investment in public healthcare infrastructure and personnel.',
 'healthcare', 'not_yet_rated', 'national', false, 38),

(party_id, m_id,
 'One government medical college in every district; fill all medical vacancies within 3 years',
 'Congress will establish one government medical college-cum-hospital in every district of India and fill all vacant medical and paramedical posts within three years to address healthcare worker shortages.',
 'healthcare', 'not_yet_rated', 'national', false, 39),

(party_id, m_id,
 'Achieve 100% immunisation of all children within 5 years; expand mid-day meals through Class XII',
 'Congress will run a mission to achieve 100% full immunisation of all children within five years, and expand the mid-day meal programme to cover students through Class XII, improving nutrition and school attendance.',
 'healthcare', 'not_yet_rated', 'national', false, 40),

-- ─────────────────────────────────────────────────────────────────
-- EDUCATION
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Amend RTE Act to make public school education free and compulsory from Class I to Class XII',
 'Congress will amend the Right to Education Act to extend free and compulsory public school education from Class I through Class XII, ensuring no child is denied secondary education due to poverty.',
 'education', 'not_yet_rated', 'national', false, 41),

(party_id, m_id,
 'Make NEET and CUET optional for state institutions; revisit NEP with state governments',
 'Congress will make centralised national entrance exams (NEET and CUET) optional for state educational institutions and revisit the National Education Policy in genuine consultation with state governments.',
 'education', 'not_yet_rated', 'national', false, 42),

(party_id, m_id,
 'Establish one community college per tehsil/taluk for job-focused diplomas; one skills institute per district',
 'Congress will establish one community college offering job-focused diploma courses per tehsil/taluk, and at least one Skills Training Institute per district for youth aged 18–29, creating accessible pathways to employment.',
 'education', 'not_yet_rated', 'national', false, 43),

-- ─────────────────────────────────────────────────────────────────
-- ECONOMY, DEFENCE & GOVERNANCE
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Abolish Agnipath scheme and restore normal Armed Forces recruitment',
 'Congress will abolish the Agnipath scheme and resume normal Armed Forces recruitment with full service conditions and long-term career prospects, ensuring security of service for India''s soldiers.',
 'defence_security', 'not_yet_rated', 'national', false, 44),

(party_id, m_id,
 'Raise manufacturing to 20% of GDP in 5 years; double GDP within 10 years',
 'Congress will pursue industrial policies to raise manufacturing''s share of GDP from 14% to 20% within five years and double India''s overall GDP within ten years, creating millions of productive jobs.',
 'economy', 'not_yet_rated', 'national', false, 45),

(party_id, m_id,
 'Abolish Angel Tax; limit Union cess and surcharges to 5% of gross tax revenues',
 'Congress will eliminate the Angel Tax on startup investments, limit Union cess and surcharges to 5% of gross tax revenues, and maintain stable personal income tax rates throughout its term to support entrepreneurs and taxpayers.',
 'taxation', 'not_yet_rated', 'national', false, 46);

END $$;
