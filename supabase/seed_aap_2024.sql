-- AAP "Kejriwal Ki 10 Guarantees" – 2024 Lok Sabha elections
-- Party UUID: 406a1aee-c855-4b4a-911e-f0291d7dc5d4
-- Source: archive.aamaadmiparty.org, campaign materials 2024
-- 28 promises: 10 national headline guarantees + Delhi/governance platform

DO $$
DECLARE
  party_id  UUID := '406a1aee-c855-4b4a-911e-f0291d7dc5d4';
  m_id      UUID;
BEGIN

INSERT INTO manifestos (party_id, election_type, election_year, title, source_url, language, status)
VALUES (
  party_id, 'lok_sabha', 2024,
  'Kejriwal Ki 10 Guarantees – 2024',
  'https://archive.aamaadmiparty.org/ten-guarantees-of-kejriwal-to-the-country/',
  'en', 'published'
)
ON CONFLICT DO NOTHING
RETURNING id INTO m_id;

IF m_id IS NULL THEN
  SELECT id INTO m_id FROM manifestos WHERE party_id = party_id AND election_year = 2024 LIMIT 1;
END IF;

-- ─────────────────────────────────────────────────────────────────
-- THE 10 GUARANTEES (all headline)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO promises (party_id, manifesto_id, title, text, category, status, geography, is_headline, ordinal) VALUES

(party_id, m_id,
 '200 units of free electricity per month for poor households; 24-hour power supply nationwide',
 'AAP guarantees 24-hour electricity supply across India and free electricity up to 200 units per month for economically disadvantaged households, following the model successfully implemented in Delhi. Estimated national cost: ₹1.15 lakh crore.',
 'energy', 'not_yet_rated', 'national', true, 1),

(party_id, m_id,
 'Transform government schools nationwide to match private school quality; free education for every child',
 'AAP guarantees to transform every government school in India to provide world-class free education matching private schools in quality, replicating the Delhi model nationally. Total investment: ₹5 lakh crore (₹2.5 lakh crore each from Centre and states).',
 'education', 'not_yet_rated', 'national', true, 2),

(party_id, m_id,
 'Establish Mohalla Clinics in every village and neighbourhood; free healthcare for all citizens',
 'AAP guarantees to set up Mohalla Clinics in every village and urban neighbourhood across India providing free primary healthcare, and upgrade all district hospitals to world-class multispecialty facilities. Total investment: ₹5 lakh crore over 5 years.',
 'healthcare', 'not_yet_rated', 'national', true, 3),

(party_id, m_id,
 'Abolish Agnipath scheme; convert all existing Agniveer recruits to permanent positions',
 'AAP guarantees to discontinue the Agnipath short-term military recruitment scheme and convert all existing Agniveer recruits to permanent positions with full service conditions, career benefits, and pension entitlements.',
 'defence_security', 'not_yet_rated', 'national', true, 4),

(party_id, m_id,
 'Legal guarantee to MSP for all crops based on Swaminathan Commission recommendations',
 'AAP guarantees to provide a legal guarantee to Minimum Support Price (MSP) for all agricultural crops based on the Swaminathan Commission formula — cost of production C2 plus 50% margin — ensuring remunerative prices for every Indian farmer.',
 'agriculture', 'not_yet_rated', 'national', true, 5),

(party_id, m_id,
 'Grant full statehood to Delhi with complete powers over police and land',
 'AAP guarantees to grant full statehood to Delhi, giving its elected government complete control over all subjects including police, land, and public services — fulfilling the long-standing democratic aspiration of Delhi''s residents.',
 'governance', 'not_yet_rated', 'national', true, 6),

(party_id, m_id,
 'Generate 2 crore new jobs every year through systematic employment creation policies',
 'AAP guarantees to create more than 2 crore new jobs annually through industrial policy, skills development, startup support, and public investment in infrastructure, reversing rising unemployment among India''s youth.',
 'employment', 'not_yet_rated', 'national', true, 7),

(party_id, m_id,
 'Eliminate systemic corruption; dismantle BJP''s protectionist mechanisms for corrupt officials',
 'AAP guarantees to dismantle the systemic corruption that protects influential and corrupt officials, establish genuine accountability mechanisms, and ensure that no individual — however powerful — is above the law.',
 'governance', 'not_yet_rated', 'national', true, 8),

(party_id, m_id,
 'Simplify GST; streamline business regulations to enable easier industrial and commercial expansion',
 'AAP guarantees to simplify India''s complex GST regime, remove GST from PMLA regulations, and streamline business permits and administrative procedures to enable easier industrial and commercial expansion across the country.',
 'taxation', 'not_yet_rated', 'national', true, 9),

(party_id, m_id,
 'Reclaim Chinese-occupied Indian territory through sustained diplomatic and military efforts',
 'AAP guarantees to prioritise national security by reclaiming Indian territory occupied by China through sustained diplomatic pressure, international alliances, and granting unrestricted operational freedom to the Indian military.',
 'defence_security', 'not_yet_rated', 'national', true, 10),

-- ─────────────────────────────────────────────────────────────────
-- DELHI-SPECIFIC PLATFORM
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Clean Yamuna River to bathing quality',
 'AAP promises to clean the Yamuna River to bathing quality by completing sewage treatment infrastructure and stopping untreated effluent discharge — a commitment central to Delhi''s civic identity.',
 'environment', 'not_yet_rated', 'Delhi', false, 11),

(party_id, m_id,
 'Free bus travel for all women in Delhi',
 'AAP will provide free bus travel on all Delhi Transport Corporation (DTC) and cluster buses for every woman, regardless of income, as a safety, mobility, and economic empowerment measure.',
 'infrastructure', 'not_yet_rated', 'Delhi', false, 12),

(party_id, m_id,
 'Mahila Samman Yojana: ₹2,100 per month to every woman in Delhi',
 'AAP will provide ₹2,100 per month as a direct financial support to every woman in Delhi through the Mahila Samman Yojana, giving women financial independence and economic security.',
 'women_empowerment', 'not_yet_rated', 'Delhi', false, 13),

(party_id, m_id,
 'Free water up to 20,000 litres per month to every household',
 'AAP will continue and expand free water supply of up to 20,000 litres per month to every household in Delhi, ensuring that access to clean water is a universal right, not a commodity.',
 'infrastructure', 'not_yet_rated', 'Delhi', false, 14),

(party_id, m_id,
 'Free treatment for senior citizens at both government and private hospitals in Delhi',
 'AAP will provide free medical treatment to all senior citizens at both government and empanelled private hospitals in Delhi, covering OPD, diagnostics, medicines, and hospitalisation.',
 'healthcare', 'not_yet_rated', 'Delhi', false, 15),

(party_id, m_id,
 'Free education abroad for Dalit students from Delhi including tuition, travel, and accommodation',
 'AAP will cover all expenses — tuition fees, travel costs, and accommodation — for Dalit students from Delhi who pursue higher education abroad, eliminating financial barriers to global opportunities.',
 'education', 'not_yet_rated', 'Delhi', false, 16),

(party_id, m_id,
 '50% discount on Delhi Metro fares for students',
 'AAP will provide a 50% discount on Delhi Metro fares for all students, making public transport affordable and reducing the cost of commuting to schools, colleges, and coaching institutes.',
 'infrastructure', 'not_yet_rated', 'Delhi', false, 17),

(party_id, m_id,
 'Install CCTV cameras across all Delhi neighbourhoods and public spaces for safety',
 'AAP will complete the installation of CCTV cameras across all Delhi neighbourhoods, markets, and public spaces, building on the existing network to improve safety — especially for women — through real-time surveillance.',
 'governance', 'not_yet_rated', 'Delhi', false, 18),

(party_id, m_id,
 'Regularise all unauthorised colonies in Delhi and provide property rights to residents',
 'AAP will complete the regularisation of all unauthorised colonies in Delhi, granting residents legal property rights and allowing them to access infrastructure, utilities, and mortgage financing.',
 'housing', 'not_yet_rated', 'Delhi', false, 19),

(party_id, m_id,
 'Door-step delivery of all government services and documents in Delhi',
 'AAP will ensure door-step delivery of all government services, certificates, and documents in Delhi, eliminating the need for citizens to visit government offices and reducing corruption in service delivery.',
 'governance', 'not_yet_rated', 'Delhi', false, 20),

-- ─────────────────────────────────────────────────────────────────
-- NATIONAL PLATFORM (additional)
-- ─────────────────────────────────────────────────────────────────

(party_id, m_id,
 'Waive educational loans for all students across India',
 'AAP will implement a one-time nationwide waiver of all outstanding educational loans to relieve the debt burden on millions of young people and allow them to start their careers without financial handicap.',
 'education', 'not_yet_rated', 'national', false, 21),

(party_id, m_id,
 'Implement national online gambling prohibition law to protect youth from addiction',
 'AAP will enact a strong nationwide law prohibiting online gambling platforms that target youth, recognising the social and financial harm caused by unregulated online betting and gaming platforms.',
 'governance', 'not_yet_rated', 'national', false, 22),

(party_id, m_id,
 'Repeal Citizenship Amendment Act (CAA) as discriminatory to religious minorities',
 'AAP will repeal the Citizenship Amendment Act (CAA) on grounds that it introduces religion as a basis for citizenship — discriminating against Muslim minorities — and undermines India''s secular constitutional framework.',
 'governance', 'not_yet_rated', 'national', false, 23),

(party_id, m_id,
 'Increase MGNREGA wages to ₹400 per day and expand the programme',
 'AAP will raise wages under MGNREGA to ₹400 per day and expand the programme to provide rural households with at least 150 days of guaranteed employment per year, strengthening the rural safety net.',
 'employment', 'not_yet_rated', 'national', false, 24),

(party_id, m_id,
 'Conduct comprehensive caste census for evidence-based reservation and welfare policies',
 'AAP will conduct a comprehensive nationwide caste census to gather socio-economic data on all communities, ensuring that reservation policies and welfare programmes are based on accurate, current evidence.',
 'governance', 'not_yet_rated', 'national', false, 25);

END $$;
