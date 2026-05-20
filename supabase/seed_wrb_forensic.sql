-- ──────────────────────────────────────────────────────────────────────────────
-- BMW v2: Women's Reservation Bill Forensic Seed (1996 → 2023)
-- The canonical worked example: 6 bills, 27 years, 1 poison-pill clause.
-- ──────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  -- Party IDs
  bjp_id    uuid;
  inc_id    uuid;
  aap_id    uuid;

  -- MP IDs
  mp_geeta     uuid := 'aa000001-0000-0000-0000-000000000001';
  mp_spyadav   uuid := 'aa000001-0000-0000-0000-000000000002';
  mp_owaisi    uuid := 'aa000001-0000-0000-0000-000000000003';
  mp_jaleel    uuid := 'aa000001-0000-0000-0000-000000000004';
  mp_meghwal   uuid := 'aa000001-0000-0000-0000-000000000005';
  mp_nirmala   uuid := 'aa000001-0000-0000-0000-000000000006';

  -- Bill IDs
  wrb_1996  uuid := 'bb000001-0000-0000-0000-000000000001';
  wrb_1998  uuid := 'bb000001-0000-0000-0000-000000000002';
  wrb_1999  uuid := 'bb000001-0000-0000-0000-000000000003';
  wrb_2008  uuid := 'bb000001-0000-0000-0000-000000000004';
  wrb_2023  uuid := 'bb000001-0000-0000-0000-000000000005';

  -- Promise IDs (from existing seeds — resolved by title)
  women_promise_bjp  uuid;
  women_promise_inc  uuid;

BEGIN

  -- Resolve party IDs
  SELECT id INTO bjp_id FROM parties WHERE slug = 'bjp';
  SELECT id INTO inc_id FROM parties WHERE slug = 'inc';
  SELECT id INTO aap_id FROM parties WHERE slug = 'aap';

  -- Resolve women's reservation promises from existing seed data
  SELECT id INTO women_promise_bjp FROM promises
    WHERE party_id = bjp_id AND title ILIKE '%women%reservation%' LIMIT 1;
  SELECT id INTO women_promise_inc FROM promises
    WHERE party_id = inc_id AND title ILIKE '%women%reservation%' LIMIT 1;

  -- ── MPs ────────────────────────────────────────────────────────────────────
  INSERT INTO mps (id, name, party_name, house, constituency, state_code, term_start, term_end) VALUES
    (mp_geeta,   'Geeta Mukherjee',          'CPI',   'lok_sabha',   'Panskura',   'WB', '1989-01-01', '1999-01-01'),
    (mp_spyadav, 'Surendra Prakash Yadav',   'RJD',   'lok_sabha',   'Buxar',      'BR', '1996-01-01', '1999-01-01'),
    (mp_owaisi,  'Asaduddin Owaisi',         'AIMIM', 'lok_sabha',   'Hyderabad',  'TS', '2004-01-01', NULL),
    (mp_jaleel,  'Syed Imtiaz Jaleel',       'AIMIM', 'lok_sabha',   'Aurangabad', 'MH', '2019-01-01', '2024-01-01'),
    (mp_meghwal, 'Arjun Ram Meghwal',        NULL,    'lok_sabha',   'Bikaner',    'RJ', '2009-01-01', NULL),
    (mp_nirmala, 'Nirmala Sitharaman',       NULL,    'rajya_sabha', NULL,         'KA', '2016-01-01', NULL)
  ON CONFLICT (id) DO NOTHING;

  -- Link Meghwal and Sitharaman to BJP
  UPDATE mps SET party_id = bjp_id WHERE id IN (mp_meghwal, mp_nirmala);

  -- ── Bills ──────────────────────────────────────────────────────────────────
  INSERT INTO bills (id, slug, title, short_title, bill_number, bill_type,
    house_introduced, introduced_date, mover_party_id, ministry,
    current_stage, outcome,
    lok_sabha_ayes, lok_sabha_noes, rajya_sabha_ayes, rajya_sabha_noes,
    assent_date, claude_summary) VALUES

    (wrb_1996, 'wrb-1996',
     'The Constitution (81st Amendment) Bill, 1996',
     'Women''s Reservation Bill 1996', 'CAB-81/1996', 'constitutional',
     'lok_sabha', '1996-09-12', NULL, 'Ministry of Law and Justice',
     7, 'lapsed', NULL, NULL, NULL, NULL, NULL,
     'First attempt at 33% reservation for women in Parliament. Referred to the Geeta Mukherjee Joint Parliamentary Committee, which received 102 memoranda. Lapsed with the dissolution of the 11th Lok Sabha.'),

    (wrb_1998, 'wrb-1998',
     'The Constitution (84th Amendment) Bill, 1998',
     'Women''s Reservation Bill 1998', 'CAB-84/1998', 'constitutional',
     'lok_sabha', '1998-01-01', bjp_id, 'Ministry of Law and Justice',
     6, 'lapsed', NULL, NULL, NULL, NULL, NULL,
     'Re-introduced by Vajpayee government. RJD MP Surendra Prakash Yadav snatched the bill from Law Minister and tore it at the Speaker''s table. The "Yadav triumvirate" (Mulayam, Lalu, Sharad) opposed on OBC-quota grounds. Lapsed with 12th LS dissolution.'),

    (wrb_1999, 'wrb-1999',
     'The Constitution (85th Amendment) Bill, 1999',
     'Women''s Reservation Bill 1999', 'CAB-85/1999', 'constitutional',
     'lok_sabha', '1999-12-23', bjp_id, 'Ministry of Law and Justice',
     6, 'lapsed', NULL, NULL, NULL, NULL, NULL,
     'Re-introduced by Law Minister Ram Jethmalani on 23 Dec 1999. Did not progress past introduction. Lapsed with the 13th Lok Sabha.'),

    (wrb_2008, 'wrb-2008',
     'The Constitution (108th Amendment) Bill, 2008',
     'Women''s Reservation Bill 2008', 'CAB-108/2008', 'constitutional',
     'rajya_sabha', '2008-05-06', inc_id, 'Ministry of Law and Justice',
     11, 'lapsed',
     NULL, NULL, 186, 1, NULL,
     'Strategically introduced in Rajya Sabha by UPA-II to prevent lapse on LS dissolution. Passed Rajya Sabha 9 March 2010 (186-1). Dissent note by SP''s Virendra Bhatia and Shailendra Kumar demanding OBC sub-quota. Never tabled in Lok Sabha; lapsed with 15th LS (2014) and again with 16th LS (2019).'),

    (wrb_2023, 'wrb-2023',
     'The Constitution (128th Amendment) Bill, 2023',
     'Women''s Reservation Act 2023', 'CAB-128/2023', 'constitutional',
     'lok_sabha', '2023-09-19', bjp_id, 'Ministry of Law and Justice',
     16, 'passed',
     454, 2, 214, 0, '2023-09-28',
     'Introduced in the new Parliament building by Law Minister Arjun Ram Meghwal. Passed Lok Sabha 454-2 (only AIMIM''s Owaisi and Jaleel voted against). Passed Rajya Sabha 214-0. Presidential assent by Droupadi Murmu 28 Sep 2023. Effective implementation linked to post-2026 census and subsequent delimitation via Article 334A — estimated 2029-2034.')

  ON CONFLICT (slug) DO NOTHING;

  -- Set predecessor chain
  UPDATE bills SET predecessor_bill_id = wrb_1996 WHERE id = wrb_1998;
  UPDATE bills SET predecessor_bill_id = wrb_1998 WHERE id = wrb_1999;
  UPDATE bills SET predecessor_bill_id = wrb_1999 WHERE id = wrb_2008;
  UPDATE bills SET predecessor_bill_id = wrb_2008 WHERE id = wrb_2023;

  -- Link promises to the 2023 bill
  UPDATE bills SET promise_ids = ARRAY[women_promise_bjp, women_promise_inc]::uuid[]
    WHERE id = wrb_2023 AND women_promise_bjp IS NOT NULL;

  -- ── Stage Events ────────────────────────────────────────────────────────────

  -- WRB 1996 events
  INSERT INTO stage_events (bill_id, stage, stage_label, event_date, house, description, source_url, source_label, verbatim_quote, verbatim_speaker_name) VALUES

  (wrb_1996, 1, 'Manifesto Promise', '1996-01-01', NULL,
   'Women''s 33% reservation appears in all major party manifestos for the 1996 general election including Congress and BJP.',
   NULL, NULL, NULL, NULL),

  (wrb_1996, 6, 'Introduction in Parliament', '1996-09-12', 'lok_sabha',
   'United Front government introduces CAB-81/1996 in Lok Sabha on 12 September 1996, the first ever bill to reserve 33% of parliamentary seats for women.',
   'https://eparlib.sansad.in', 'Lok Sabha Debates', NULL, NULL),

  (wrb_1996, 7, 'Committee Referral', '1996-09-12', 'lok_sabha',
   'Bill referred to a Joint Parliamentary Committee of 31 members chaired by Geeta Mukherjee (CPI, Panskura, West Bengal). Committee received 102 memoranda from women''s organizations. Reported seven recommendations on 9 Dec 1996.',
   'https://eparlib.sansad.in', 'JPC Report 1996', NULL, NULL),

  (wrb_1996, 16, 'Post-Enactment Lifecycle', '1997-01-01', NULL,
   'Bill lapses with dissolution of the 11th Lok Sabha. None of the JPC''s seven recommendations are debated on the floor. Women''s reservation remains unlegislated.',
   NULL, 'Lapse record', NULL, NULL);

  -- WRB 1998 events
  INSERT INTO stage_events (bill_id, stage, stage_label, event_date, house, description, source_url, source_label, verbatim_quote, verbatim_speaker_name) VALUES

  (wrb_1998, 6, 'Introduction in Parliament', '1998-01-01', 'lok_sabha',
   'Vajpayee NDA government re-introduces bill. Floor disruption: RJD MP Surendra Prakash Yadav snatches the bill from Law Minister M. Thambidurai and tears it at the Speaker''s table. TMC''s Mamata Banerjee physically restrained SP''s Daroga Prasad Saroj.',
   'https://en.wikipedia.org/wiki/Women%27s_Reservation_Bill_(India)', 'Wikipedia / Outlook',
   'The present form of Women''s Reservation Bill can only be passed in the Lok Sabha over my dead body. We want reservation within reservation.',
   'Lalu Prasad Yadav (RJD)'),

  (wrb_1998, 16, 'Post-Enactment Lifecycle', '1999-01-01', NULL,
   'Bill lapses with dissolution of the 12th Lok Sabha. The "Yadav triumvirate" (Mulayam Singh Yadav, Lalu Prasad Yadav, Sharad Yadav) had successfully blocked consideration by demanding OBC sub-quota within the 33%.',
   NULL, 'Lapse record', NULL, NULL);

  -- WRB 2008 events
  INSERT INTO stage_events (bill_id, stage, stage_label, event_date, house, description, source_url, source_label, verbatim_quote, verbatim_speaker_name) VALUES

  (wrb_2008, 6, 'Introduction in Parliament', '2008-05-06', 'rajya_sabha',
   'UPA-II strategically introduces CAB-108/2008 in the Rajya Sabha (which does not dissolve with the Lok Sabha) to prevent lapse. Bill referred to the Standing Committee on Personnel, Public Grievances, Law and Justice.',
   'https://eparlib.sansad.in', 'Rajya Sabha records', NULL, NULL),

  (wrb_2008, 7, 'Committee Referral', '2009-12-14', 'rajya_sabha',
   'Standing Committee 36th Report adopted 14 Dec 2009, presented to Rajya Sabha 17 Dec 2009. Chaired by Jayanthi Natarajan (INC). Recommended passage "without further delay." Dissent note by SP''s Virendra Bhatia and Shailendra Kumar demanding OBC sub-quota and capping reservation at 20%.',
   'https://eparlib.sansad.in', '36th Standing Committee Report',
   'The question of reservation within reservation for OBC women & some minorities generated great discussion in the Committee... The Committee is of the view, that this matter should be considered by Government.',
   'Standing Committee on Law and Justice'),

  (wrb_2008, 11, 'Inter-House Passage', '2010-03-09', 'rajya_sabha',
   'Rajya Sabha passes the Women''s Reservation Bill 186-1. It is never tabled in the Lok Sabha by the UPA government despite the ruling coalition holding enough seats.',
   'https://eparlib.sansad.in', 'Rajya Sabha vote record', NULL, NULL),

  (wrb_2008, 16, 'Post-Enactment Lifecycle', '2014-01-01', NULL,
   'Bill lapses with dissolution of the 15th Lok Sabha (2014) after sitting in limbo for four years without being brought to the Lok Sabha floor. Lapses again with 16th LS (2019). A 13-year stall in the lower house.',
   NULL, 'Lapse record', NULL, NULL);

  -- WRB 2023 events
  INSERT INTO stage_events (bill_id, stage, stage_label, event_date, house, description, source_url, source_label, verbatim_quote, verbatim_speaker_name) VALUES

  (wrb_2023, 5, 'Cabinet Approval', '2023-09-18', NULL,
   'Union Cabinet approves the Women''s Reservation Bill one day before its introduction in the new Parliament building. No pre-legislative consultation process observed.',
   'https://pib.gov.in', 'PIB press release', NULL, NULL),

  (wrb_2023, 6, 'Introduction in Parliament', '2023-09-19', 'lok_sabha',
   'Law Minister Arjun Ram Meghwal introduces CAB-128/2023 in the new Parliament building (Sansad Bhavan). Bill proposes inserting Articles 330A and 332A (and 334A) into the Constitution.',
   'https://sansad.in/ls', 'Lok Sabha records', NULL, NULL),

  (wrb_2023, 10, 'Voting Splits', '2023-09-20', 'lok_sabha',
   'Lok Sabha votes 454-2 in favour. The only dissenting votes come from AIMIM''s Asaduddin Owaisi (Hyderabad) and Syed Imtiaz Jaleel (Aurangabad). Near-complete cross-party consensus on the headline bill.',
   'https://sansad.in/ls', 'Lok Sabha division list',
   'Muslim women account for 7% of the national population but their representation in legislative bodies is just 0.7%. This bill fails them.',
   'Asaduddin Owaisi (AIMIM)'),

  (wrb_2023, 11, 'Inter-House Passage', '2023-09-21', 'rajya_sabha',
   'Rajya Sabha passes the bill 214-0. Unanimous passage with no member voting against.',
   'https://sansad.in/rs', 'Rajya Sabha division list', NULL, NULL),

  (wrb_2023, 12, 'Presidential Assent', '2023-09-28', NULL,
   'President Droupadi Murmu grants assent to the Constitution (106th Amendment) Act, 2023 on 28 September 2023.',
   'https://egazette.gov.in', 'Gazette of India', NULL, NULL),

  (wrb_2023, 13, 'Gazette + Rules', '2023-09-28', NULL,
   'Act notified in the Gazette of India as the Constitution (One Hundred and Sixth Amendment) Act, 2023. Article 334A links effective implementation to completion of the first census post-commencement and a subsequent delimitation exercise.',
   'https://egazette.gov.in', 'Gazette notification',
   'Notwithstanding anything in Article 334, the provisions of this Part relating to reservation of seats for women shall cease to have effect on the expiration of a period of 15 years from the date of commencement of this Act.',
   'Article 334A, Constitution (106th Amendment) Act 2023'),

  (wrb_2023, 14, 'Implementation', '2026-04-16', NULL,
   'Union Ministry of Law and Justice issues gazette notification bringing the Act "into force" on 16 April 2026 — but the 33% reservation itself remains inoperative pending the post-2026 census and a fresh delimitation exercise. Effective representation not expected before 2029-2034.',
   'https://egazette.gov.in', 'Gazette notification April 2026', NULL, NULL);

  -- ── Issue Graph Edges ───────────────────────────────────────────────────────
  INSERT INTO issue_graph_edges (source_type, source_id, source_label, target_type, target_id, target_label, edge_type, description, confidence) VALUES

  -- Ancestry chain
  ('bill', wrb_1996, 'WRB 1996', 'bill', wrb_1998, 'WRB 1998', 'superseded_by',
   '1996 bill lapsed with 11th LS dissolution; 1998 bill is its immediate re-introduction by the incoming Vajpayee government.', 1.0),
  ('bill', wrb_1998, 'WRB 1998', 'bill', wrb_1999, 'WRB 1999', 'superseded_by',
   '1998 bill lapsed with 12th LS dissolution; 1999 bill re-introduced by Ram Jethmalani.', 1.0),
  ('bill', wrb_1999, 'WRB 1999', 'bill', wrb_2008, 'WRB 2008', 'superseded_by',
   '1999 bill lapsed with 13th LS dissolution; 2008 UPA-II version moved strategically to Rajya Sabha.', 1.0),
  ('bill', wrb_2008, 'WRB 2008', 'bill', wrb_2023, 'WRB 2023', 'superseded_by',
   '2008 bill lapsed with 15th and 16th LS dissolutions; the 2023 NDA version finally broke the deadlock.', 1.0),

  -- Yadav triumvirate blocking
  ('mp', mp_spyadav, 'Surendra Prakash Yadav (RJD)', 'bill', wrb_1998, 'WRB 1998', 'blocked_by',
   'Yadav tore the bill on the floor of the Lok Sabha, triggering pandemonium. The RJD/SP/JD-U bloc demanded OBC sub-quota within the 33% — a demand strategically used to prevent passage.', 0.95),

  -- OBC demand edge
  ('bill', wrb_1998, 'WRB 1998', 'bill', wrb_2008, 'WRB 2008', 'linked_to',
   'The OBC sub-quota demand that derailed 1998-1999 bills continued to be raised by the SP dissent note in the 2008 Standing Committee, blocking its Lok Sabha tabling.', 0.9),

  -- Poison pill insertion in 2023
  ('bill', wrb_2023, 'WRB 2023 (Article 334A)', 'bill', wrb_2008, 'WRB 2008', 'amended_by',
   'Article 334A — the delimitation precondition — was absent from the 2008 Bill. Its insertion in 2023 achieves symbolic passage while delaying operational reservation by an estimated 6-11 years (census + delimitation).', 0.85),
  ('bill', wrb_2023, 'WRB 2023', 'bill', wrb_1996, 'WRB 1996', 'descended_from',
   '27-year legislative lineage from the first 1996 JPC bill through six attempts. The 2023 Act is the culmination of the same constitutional amendment objective.', 1.0),

  -- Owaisi dissent
  ('mp', mp_owaisi, 'Asaduddin Owaisi (AIMIM)', 'bill', wrb_2023, 'WRB 2023', 'opposed_by',
   'One of only two MPs to vote against the 2023 bill. Argued the bill excludes OBC and Muslim women whose representation (0.7% of Parliament) is far below their 7% population share.', 1.0),

  -- Meghwal / government endorsement
  ('mp', mp_meghwal, 'Arjun Ram Meghwal (BJP)', 'bill', wrb_2023, 'WRB 2023', 'endorsed_by',
   'Law Minister Arjun Ram Meghwal moved the bill in the new Parliament building and shepherded it through both houses in 48 hours.', 1.0),

  -- Sitharaman defending Article 334A
  ('mp', mp_nirmala, 'Nirmala Sitharaman (BJP)', 'bill', wrb_2023, 'WRB 2023', 'endorsed_by',
   'Nirmala Sitharaman defended the delimitation-linked Article 334A in Rajya Sabha on 21 September 2023, characterising it as procedurally necessary rather than a delay mechanism.', 0.9),

  -- Geeta Mukherjee JPC connection
  ('mp', mp_geeta, 'Geeta Mukherjee (CPI)', 'bill', wrb_1996, 'WRB 1996', 'linked_to',
   'Chaired the 31-member JPC that evaluated the 1996 bill and made 7 recommendations including a 15-year sunset clause and sub-reservation for OBC women "after OBC reservation is extended constitutionally."', 1.0),

  -- 2008 RS passage but LS stall
  ('bill', wrb_2008, 'WRB 2008', 'bill', wrb_2008, 'WRB 2008 (LS stall)', 'blocked_by',
   'Despite passing Rajya Sabha 186-1 in March 2010, the UPA-II government never tabled the bill in the Lok Sabha — a political decision driven by coalition arithmetic with SP, RJD, and BSP whose support was conditional on no women''s reservation.', 0.85);

  -- ── Promise Ancestry ─────────────────────────────────────────────────────────
  IF women_promise_bjp IS NOT NULL THEN
    INSERT INTO promise_ancestry (promise_id, ancestor_name, ancestor_year, ancestor_govt, relationship_note, sort_order) VALUES
    (women_promise_bjp, '73rd Constitutional Amendment — 33% Panchayat Reservation', 1992, 'Congress (Narasimha Rao)', 'Established the precedent of 33% reservation for women in Panchayati Raj institutions. The same ratio (not 50%) was used in all Parliamentary WRB drafts.', 1),
    (women_promise_bjp, '74th Constitutional Amendment — 33% Municipality Reservation', 1993, 'Congress (Narasimha Rao)', 'Extended the 33% women''s reservation to urban local bodies. Together with the 73rd Amendment, created the constitutional basis for expanding it to Parliament.', 2),
    (women_promise_bjp, 'Sarojini Naidu Committee on Women''s Status', 1974, 'Congress (Indira Gandhi)', 'The 1974 Committee on the Status of Women in India (CSWI) recommended reservation as a temporary measure to bring women into mainstream political life — the intellectual precursor to all WRB bills.', 3),
    (women_promise_bjp, 'Constituent Assembly Debates on Women''s Rights', 1946, 'Constituent Assembly', 'Hansa Mehta and other women delegates to the Constituent Assembly argued for constitutional provisions ensuring women''s political representation. Article 243D (1992) finally implemented this.', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  RAISE NOTICE 'WRB forensic seed complete: 6 MPs, 5 bills, stage events, graph edges, ancestry records.';

END $$;
