-- Seed data: 4 major Indian political parties
-- Run after migration 0001_init.sql

insert into parties (slug, name, name_translations, short_name, level, founded_year, color_hex, website_url) values
(
  'bjp',
  'Bharatiya Janata Party',
  '{"hi":"भारतीय जनता पार्टी","ta":"பாரதிய ஜனதா கட்சி","te":"భారతీయ జనతా పార్టీ","bn":"ভারতীয় জনতা পার্টি","mr":"भारतीय जनता पार्टी","gu":"ભારતીય જનતા પાર્ટી","kn":"ಭಾರತೀಯ ಜನತಾ ಪಕ್ಷ","ml":"ഭാരതീയ ജനതാ പാർട്ടി"}',
  'BJP',
  'national',
  1980,
  '#FF6B00',
  'https://www.bjp.org'
),
(
  'inc',
  'Indian National Congress',
  '{"hi":"भारतीय राष्ट्रीय कांग्रेस","ta":"இந்திய தேசிய காங்கிரஸ்","te":"భారత జాతీయ కాంగ్రెస్","bn":"ভারতীয় জাতীয় কংগ্রেস","mr":"भारतीय राष्ट्रीय काँग्रेस","gu":"ભારતીય રાષ્ટ્રીય કૉંગ્રેસ","kn":"ಭಾರತೀಯ ರಾಷ್ಟ್ರೀಯ ಕಾಂಗ್ರೆಸ್","ml":"ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസ്"}',
  'INC',
  'national',
  1885,
  '#19AAED',
  'https://www.inc.in'
),
(
  'aap',
  'Aam Aadmi Party',
  '{"hi":"आम आदमी पार्टी","ta":"ஆம் ஆத்மி கட்சி","te":"ఆమ్ ఆద్మీ పార్టీ","bn":"আম আদমি পার্টি","mr":"आम आदमी पार्टी","gu":"આમ આદમી પાર્ટી","kn":"ಆಮ್ ಆದ್ಮಿ ಪಕ್ಷ","ml":"ആം ആദ്മി പാർട്ടി"}',
  'AAP',
  'national',
  2012,
  '#2196F3',
  'https://www.aamaadmiparty.org'
),
(
  'dmk',
  'Dravida Munnetra Kazhagam',
  '{"hi":"द्रविड़ मुनेत्र कड़गम","ta":"திராவிட முன்னேற்றக் கழகம்","te":"ద్రవిడ మున్నేట్ర కళగం","kn":"ದ್ರವಿಡ ಮುನ್ನೇಟ್ರ ಕಳಗಂ","ml":"ദ്രാവിഡ മുന്നേറ്റ കഴകം"}',
  'DMK',
  'state',
  1949,
  '#E32636',
  'https://www.dmk.in'
);
