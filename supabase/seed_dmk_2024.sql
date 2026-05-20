-- DMK 2024 Lok Sabha manifesto
-- Party UUID: 40de02cd-1e58-4157-bc11-b8090f5f73b8
-- Source: dmk.in/en/resources/manifesto/, thenewsminute.com, released 2024
-- 30 promises: federalism, Tamil identity, economy, welfare, constitutional reforms

DO $$
DECLARE
  party_id  UUID := '40de02cd-1e58-4157-bc11-b8090f5f73b8';
  m_id      UUID;
BEGIN

INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, status)
VALUES (
  party_id, 'lok_sabha', 2024,
  'DMK Manifesto 2024 – Lok Sabha',
  'https://www.dmk.in/en/resources/manifesto/',
  'en', 'published'
)
ON CONFLICT DO NOTHING
RETURNING id INTO m_id;

IF m_id IS NULL THEN
  SELECT id INTO m_id FROM manifestos WHERE party_id = party_id AND election_year = 2024 LIMIT 1;
END IF;

-- ─────────────────────────────────────────────────────────────────
-- EDUCATION & EXAMINATIONS (headline)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO promises (party_id, manifesto_id, title, text, category, status, geography, is_headline, ordinal) VALUES

(party_id, m_id,
 'Scrap NEET; allow Tamil Nadu and all states to design their own medical entrance exams',
 'DMK will abolish the National Eligibility cum Entrance Test (NEET) and restore the right of Tamil Nadu and all states to conduct their own medical entrance examinations, arguing that NEET disadvantages rural and Tamil-medium students.',
 'education', 'not_yet_rated', 'national', true, 1),

(party_id, m_id,
 'Abolish the National Education Policy (NEP) as an imposition on state education systems',
 'DMK will repeal the National Education Policy (NEP) of 2020, which it considers a centralised imposition on state education systems, and replace it with an education policy developed in consultation with all state governments.',
 'education', 'not_yet_rated', 'national', true, 2),

-- ─────────────────────────────────────────────────────────────────
-- CONSTITUTIONAL REFORMS (headline)
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Repeal Citizenship Amendment Act (CAA) as unconstitutional and discriminatory',
 'DMK will repeal the Citizenship Amendment Act (CAA) which introduces religion as a basis for citizenship, violating the secular spirit of the Indian Constitution and discriminating against Muslim refugees.',
 'governance', 'not_yet_rated', 'national', true, 3),

(party_id, m_id,
 'Reject Uniform Civil Code (UCC); protect personal laws of minority communities',
 'DMK will block implementation of any Uniform Civil Code (UCC), arguing that it would override the personal laws of minority communities and is a violation of the constitutional right to religious freedom and cultural autonomy.',
 'governance', 'not_yet_rated', 'national', true, 4),

(party_id, m_id,
 'Remove Article 361 to end Governors'' immunity from criminal prosecution',
 'DMK will amend or repeal Article 361 of the Constitution, which protects Governors from criminal proceedings during their tenure — an immunity that DMK argues is misused to allow partisan interference in state governance.',
 'governance', 'not_yet_rated', 'national', true, 5),

(party_id, m_id,
 'Abolish or severely restrict Article 356 (President''s Rule) to protect state democracy',
 'DMK will amend Article 356 to severely restrict the misuse of President''s Rule to dismiss democratically elected state governments, protecting the federal structure and state autonomy that the Constitution guarantees.',
 'governance', 'not_yet_rated', 'national', true, 6),

-- ─────────────────────────────────────────────────────────────────
-- DEFENCE & ECONOMIC (headline)
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Withdraw Agnipath scheme; restore permanent recruitment in Armed Forces',
 'DMK will withdraw the Agnipath short-term military recruitment scheme and reintroduce permanent service recruitment in the Indian Armed Forces with full pension, career progression, and service benefits for all recruits.',
 'defence_security', 'not_yet_rated', 'national', true, 7),

(party_id, m_id,
 'Legal guarantee to MSP for all crops at Swaminathan Commission C2+50% formula',
 'DMK will adopt the recommendations of the M.S. Swaminathan Committee and ensure a legal guarantee to Minimum Support Price (MSP) for all agricultural crops at the cost of production C2 plus 50% margin.',
 'agriculture', 'not_yet_rated', 'national', true, 8),

(party_id, m_id,
 'Reduce LPG to ₹500; petrol to ₹75/litre; diesel to ₹65/litre',
 'DMK will reduce the price of LPG cooking gas cylinders to ₹500, petrol to ₹75 per litre, and diesel to ₹65 per litre by rationalising central taxes and cess levied on petroleum products.',
 'economy', 'not_yet_rated', 'national', true, 9),

-- ─────────────────────────────────────────────────────────────────
-- TAMIL IDENTITY & FEDERALISM (headline)
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Ensure Tamil Nadu retains all 39 Lok Sabha seats in the delimitation exercise',
 'DMK will use its parliamentary strength to ensure that Tamil Nadu does not lose any of its 39 Lok Sabha seats in the forthcoming delimitation exercise — protecting the political representation of Tamil Nadu despite slower population growth.',
 'governance', 'not_yet_rated', 'Tamil Nadu', true, 10),

(party_id, m_id,
 'Grant Indian citizenship to Sri Lankan Tamil refugees living in Tamil Nadu',
 'DMK will pursue legislation and executive action to grant Indian citizenship to Sri Lankan Tamil refugees who have been living in Tamil Nadu for decades, ending decades of uncertainty and providing them legal rights and security.',
 'social_welfare', 'not_yet_rated', 'Tamil Nadu', true, 11),

(party_id, m_id,
 'Declare Tamil as co-official language for Union offices in Tamil Nadu',
 'DMK will secure recognition of Tamil as a co-official language for all Union government offices operating in Tamil Nadu, ensuring Tamil-speaking citizens can access central government services in their mother tongue.',
 'governance', 'not_yet_rated', 'Tamil Nadu', true, 12),

-- ─────────────────────────────────────────────────────────────────
-- WELFARE & SOCIAL POLICY
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 '₹1,000 monthly stipend for all women in Tamil Nadu',
 'DMK will implement a monthly stipend of ₹1,000 for all women in Tamil Nadu, providing a regular source of financial support and empowerment for women across all income levels.',
 'women_empowerment', 'not_yet_rated', 'Tamil Nadu', false, 13),

(party_id, m_id,
 'Waive outstanding educational loans for all students',
 'DMK will implement a comprehensive waiver of outstanding educational loans for all students, releasing young people from debt that inhibits their career choices and economic participation.',
 'education', 'not_yet_rated', 'national', false, 14),

(party_id, m_id,
 'Conduct caste census every 5 years for evidence-based policy and reservation',
 'DMK will legislate for a comprehensive caste census to be conducted every five years, ensuring that reservations, welfare programmes, and development schemes are based on accurate and up-to-date socio-economic data.',
 'governance', 'not_yet_rated', 'national', false, 15),

(party_id, m_id,
 'Allocate 3% of national GDP to public healthcare',
 'DMK will secure legislation requiring the central government to allocate at least 3% of national GDP to public health infrastructure, personnel, and services — substantially increasing India''s historically low health expenditure.',
 'healthcare', 'not_yet_rated', 'national', false, 16),

(party_id, m_id,
 'Establish new AIIMS hospitals in four Tamil Nadu districts',
 'DMK will push the central government to establish All India Institute of Medical Sciences (AIIMS) hospitals in four under-served Tamil Nadu districts, improving access to tertiary healthcare for Tamil Nadu''s population.',
 'healthcare', 'not_yet_rated', 'Tamil Nadu', false, 17),

(party_id, m_id,
 'Implement free school breakfast programme in all government schools nationally',
 'DMK will expand the free school breakfast scheme — already implemented in Tamil Nadu — to all government schools across India, improving child nutrition, school attendance, and learning outcomes.',
 'social_welfare', 'not_yet_rated', 'national', false, 18),

(party_id, m_id,
 'Establish a permanent bench of the Supreme Court in Chennai',
 'DMK will pursue constitutional and legislative steps to establish a permanent bench of the Supreme Court of India in Chennai, reducing the burden of litigants from South India who must travel to Delhi for Supreme Court hearings.',
 'governance', 'not_yet_rated', 'national', false, 19),

-- ─────────────────────────────────────────────────────────────────
-- ECONOMY & TAXATION
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Exempt essential food items — rice, wheat, oil, pulses — from GST',
 'DMK will legislate to permanently exempt essential food items including rice, wheat, edible oil, and pulses from the Goods and Services Tax (GST), reducing the cost of living for ordinary families.',
 'taxation', 'not_yet_rated', 'national', false, 20),

(party_id, m_id,
 'Introduce national online gambling prohibition law to protect youth',
 'DMK will enact a comprehensive national law prohibiting online gambling and betting platforms, protecting youth from addiction and the associated financial ruin and family breakdown.',
 'governance', 'not_yet_rated', 'national', false, 21),

(party_id, m_id,
 'Stop Mekedatu Dam construction to protect Tamil Nadu''s water rights in Cauvery',
 'DMK will use its parliamentary strength to prevent Karnataka from constructing the Mekedatu dam across the Cauvery River, which Tamil Nadu argues would reduce water flow to delta farmers and violate the Cauvery Water Disputes Tribunal award.',
 'agriculture', 'not_yet_rated', 'Tamil Nadu', false, 22),

-- ─────────────────────────────────────────────────────────────────
-- FEDERALISM & FINANCIAL DEVOLUTION
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Increase states'' share of central tax revenues from 41% to 50%',
 'DMK will advocate for the Finance Commission to increase states'' share of the divisible pool of central taxes from 41% to 50%, giving state governments greater fiscal autonomy to fund their own development priorities.',
 'economy', 'not_yet_rated', 'national', false, 23),

(party_id, m_id,
 'Equal funding for development of all Indian state languages alongside Hindi',
 'DMK will ensure equal central government funding for the development, promotion, and preservation of all recognised Indian state languages — challenging the perceived prioritisation of Hindi over other languages.',
 'governance', 'not_yet_rated', 'national', false, 24),

(party_id, m_id,
 'Remove centralised control over state police; return policing to State List',
 'DMK will push for constitutional amendments to restore full policing powers to state governments, removing central interference in law enforcement which it argues undermines state autonomy and democratic governance.',
 'governance', 'not_yet_rated', 'national', false, 25),

-- ─────────────────────────────────────────────────────────────────
-- SOCIAL JUSTICE & RIGHTS
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Enshrine rights of transgender persons with full legal protections and welfare support',
 'DMK will legislate comprehensive legal protections and welfare entitlements for transgender persons, including reservation in education and government jobs, healthcare support, and repeal of discriminatory provisions in existing laws.',
 'social_welfare', 'not_yet_rated', 'national', false, 26),

(party_id, m_id,
 'Implement Swaminathan Commission recommendations for fisherfolk welfare',
 'DMK will implement the Swaminathan Commission''s recommendations for fisherfolk welfare including insurance, compensation for loss of equipment, safety at sea, and support for families of fisherfolk who die or go missing.',
 'agriculture', 'not_yet_rated', 'Tamil Nadu', false, 27),

(party_id, m_id,
 'Provide farm loan waivers and debt relief for Tamil Nadu farmers',
 'DMK will implement comprehensive farm loan waivers and debt relief for all Tamil Nadu farmers, addressing the agrarian distress that has led to debt suicides and land abandonment in rural Tamil Nadu.',
 'agriculture', 'not_yet_rated', 'Tamil Nadu', false, 28),

(party_id, m_id,
 'Remove NEET exemption barriers; implement Tamil Nadu''s state legislation on admissions',
 'DMK will ensure that Tamil Nadu''s state legislation on medical admissions — passed twice by the Tamil Nadu Assembly — receives Presidential assent, implementing a merit-based state admission system without NEET.',
 'education', 'not_yet_rated', 'Tamil Nadu', false, 29),

(party_id, m_id,
 'Ensure OBC communities receive their fair share of central government jobs and education seats',
 'DMK will ensure that Other Backward Classes receive their constitutionally mandated fair share in central government employment and central educational institutions, pushing for accurate OBC enumeration in the caste census.',
 'social_welfare', 'not_yet_rated', 'national', false, 30);

END $$;
