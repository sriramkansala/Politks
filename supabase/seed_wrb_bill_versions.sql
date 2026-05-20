-- ──────────────────────────────────────────────────────────────────────────────
-- BMW-032: WRB Bill Versions Seed — CAB-108/2008 vs CAB-128/2023
-- Clause text is substantively accurate to the actual bills; simplified for
-- readability. Source: PRS Legislative Research (CC-BY 4.0).
-- ──────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  wrb_2008   uuid;
  wrb_2023   uuid;
  ver_2008   uuid := 'cc000001-0000-0000-0000-000000000001';
  ver_2023   uuid := 'cc000001-0000-0000-0000-000000000002';
BEGIN
  SELECT id INTO wrb_2008 FROM bills WHERE slug = 'wrb-2008';
  SELECT id INTO wrb_2023 FROM bills WHERE slug = 'wrb-2023';

  IF wrb_2008 IS NULL OR wrb_2023 IS NULL THEN
    RAISE EXCEPTION 'WRB bills not found — run seed_wrb_forensic.sql first';
  END IF;

  -- ── Bill Versions ──────────────────────────────────────────────────────────
  INSERT INTO bill_versions (id, bill_id, version_label, version_date, source_url) VALUES
    (ver_2008, wrb_2008, 'CAB-108/2008 — As introduced in Rajya Sabha', '2008-05-06',
     'https://prsindia.org/billtrack/the-constitution-one-hundred-and-eighth-amendment-bill-2008'),
    (ver_2023, wrb_2023, 'CAB-128/2023 — As passed by both Houses', '2023-09-21',
     'https://prsindia.org/billtrack/the-constitution-one-hundred-and-twenty-eighth-amendment-bill-2023')
  ON CONFLICT (id) DO NOTHING;

  -- ── CAB-108/2008 Clauses ───────────────────────────────────────────────────
  INSERT INTO bill_clauses
    (bill_version_id, clause_number, clause_title, clause_text, topic_tags, ordinal)
  VALUES

  (ver_2008, '1', 'Short title and commencement',
   'This Act may be called the Constitution (One Hundred and Eighth Amendment) Act. It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint.',
   ARRAY['commencement','title'], 1),

  (ver_2008, '2', 'Amendment of article 239AA',
   'In article 239AA of the Constitution, in clause (2), in sub-clause (b), the following proviso shall be inserted, namely:— "Provided that not less than one-third (including the number of seats reserved for women belonging to the Scheduled Castes) of the total number of seats in the Legislative Assembly of the National Capital Territory of Delhi shall be reserved for women by rotation and such rotation of reserved seats shall be determined by such authority and in such manner as the Parliament may, by law, provide."',
   ARRAY['delhi','reservation','rotation'], 2),

  (ver_2008, '3', 'Insertion of new article 330A — Reservation of seats for women in House of the People',
   'After article 330 of the Constitution, the following article shall be inserted, namely:— "330A. Reservation of seats for women in the House of the People.— (1) As nearly as may be, one-third of the total number of seats reserved under article 330 for the Scheduled Castes and the Scheduled Tribes respectively shall be reserved by rotation for women belonging to the Scheduled Castes or the Scheduled Tribes, as the case may be. (2) As nearly as may be, one-third of the total number of seats in the House of the People shall be reserved for women. (3) The seats reserved for women under this article shall be allotted by rotation to different constituencies in the State or Union territory and such rotation shall be determined by such authority and in such manner as Parliament may by law provide."',
   ARRAY['lok_sabha','women','reservation','rotation'], 3),

  (ver_2008, '4', 'Insertion of new article 332A — Reservation of seats for women in State Legislative Assemblies',
   'After article 332 of the Constitution, the following article shall be inserted, namely:— "332A. Reservation of seats for women in State Legislative Assemblies.— (1) As nearly as may be, one-third of the total number of seats reserved under article 332 for the Scheduled Castes and the Scheduled Tribes respectively in the Legislative Assembly of every State shall be reserved by rotation for women belonging to the Scheduled Castes or the Scheduled Tribes, as the case may be. (2) As nearly as may be, one-third of the total number of seats in the Legislative Assembly of every State shall be reserved for women. (3) The seats reserved for women under this article shall be allotted by rotation to different constituencies in the State and such rotation shall be determined by such authority and in such manner as the Legislature of the State may, by law, provide."',
   ARRAY['state_assembly','women','reservation','rotation'], 4),

  (ver_2008, '5', 'Amendment of article 334',
   'In article 334 of the Constitution, for the words "sixty years", the words "sixty years or until the expiry of the period specified in clause (1) of article 330A or clause (1) of article 332A, whichever is later" shall be substituted.',
   ARRAY['sunset','termination'], 5);

  -- ── CAB-128/2023 Clauses ───────────────────────────────────────────────────
  INSERT INTO bill_clauses
    (bill_version_id, clause_number, clause_title, clause_text, topic_tags,
     is_poison_pill, attribution_note, ordinal)
  VALUES

  (ver_2023, '1', 'Short title and commencement',
   'This Act may be called the Constitution (One Hundred and Sixth Amendment) Act, 2023. It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint.',
   ARRAY['commencement','title'], false, null, 1),

  (ver_2023, '2', 'Amendment of article 239AA',
   'In article 239AA of the Constitution, in clause (2), in sub-clause (b), the following proviso shall be inserted, namely:— "Provided that not less than one-third (including the number of seats reserved for women belonging to the Scheduled Castes) of the total number of seats in the Legislative Assembly of the National Capital Territory of Delhi shall be reserved for women by rotation and such rotation of reserved seats shall be determined by such authority and in such manner as the Parliament may, by law, provide."',
   ARRAY['delhi','reservation','rotation'], false, null, 2),

  (ver_2023, '3', 'Insertion of new article 330A — Reservation of seats for women in House of the People',
   'After article 330 of the Constitution, the following article shall be inserted, namely:— "330A. Reservation of seats for women in the House of the People.— (1) As nearly as may be, one-third of the total number of seats reserved under article 330 for the Scheduled Castes and the Scheduled Tribes respectively shall be reserved by rotation for women belonging to the Scheduled Castes or the Scheduled Tribes, as the case may be. (2) As nearly as may be, one-third of the total number of seats in the House of the People shall be reserved for women. (3) The seats reserved for women under this article shall be allotted by rotation to different constituencies in the State or Union territory and such rotation shall be determined by such authority and in such manner as Parliament may by law provide."',
   ARRAY['lok_sabha','women','reservation','rotation'], false, null, 3),

  (ver_2023, '4', 'Insertion of new article 332A — Reservation of seats for women in State Legislative Assemblies',
   'After article 332 of the Constitution, the following article shall be inserted, namely:— "332A. Reservation of seats for women in State Legislative Assemblies.— (1) As nearly as may be, one-third of the total number of seats reserved under article 332 for the Scheduled Castes and the Scheduled Tribes respectively in the Legislative Assembly of every State shall be reserved by rotation for women belonging to the Scheduled Castes or the Scheduled Tribes, as the case may be. (2) As nearly as may be, one-third of the total number of seats in the Legislative Assembly of every State shall be reserved for women. (3) The seats reserved for women under this article shall be allotted by rotation to different constituencies in the State and such rotation shall be determined by such authority and in such manner as the Legislature of the State may, by law, provide."',
   ARRAY['state_assembly','women','reservation','rotation'], false, null, 4),

  -- ▼ ARTICLE 334A — THE POISON PILL — new in 2023, absent from 2008
  (ver_2023, '5', 'Insertion of new article 334A — Commencement of reservation',
   'After article 334 of the Constitution, the following article shall be inserted, namely:— "334A. Reservation under articles 330A and 332A to have effect after commencement and census figures publication.— Notwithstanding anything contained in articles 330A and 332A, the reservation of seats for women under the said articles shall be effective after the date of publication of the figures of the first census taken after the commencement of the Constitution (One Hundred and Sixth Amendment) Act, 2023 and the subsequent delimitation of constituencies based on such census figures: Provided that such reservation shall cease to have effect on the expiration of a period of fifteen years from the date on which such reservation first becomes effective under this article."',
   ARRAY['commencement','census','delimitation','sunset'],
   true,
   'Article 334A was inserted by the NDA government during the 2023 revision and was absent from every prior WRB bill. It ties the activation of reservation to the completion of (a) the first post-2026 census, and (b) a subsequent delimitation exercise — both of which have no fixed deadline. Opposition parties including AAP, TMC, and AIMIM argued this embeds an indefinite delay into the law. The provision was defended by Law Minister Arjun Ram Meghwal and Finance Minister Nirmala Sitharaman as procedurally necessary. PRS estimates effective implementation no earlier than 2029-2034.',
   5),

  (ver_2023, '6', 'Amendment of article 334',
   'In article 334 of the Constitution, for the words "sixty years", the following shall be substituted, namely:— "sixty years or until the expiry of the period mentioned in article 334A, whichever is later".',
   ARRAY['sunset','termination'], false,
   'Article 334 was amended to reference the new Article 334A rather than specifying a direct 60-year sunset, linking the termination of women''s reservation to the Article 334A commencement mechanism.',
   6);

  RAISE NOTICE 'WRB bill versions seed complete: 2 versions, 11 clauses total.';
END $$;
