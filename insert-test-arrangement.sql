-- Insert test arrangement for BIMVerdi Arrangement MVP
-- Dette scriptet oppretter et test-arrangement med alle nødvendige ACF-felt

-- Insert post
INSERT INTO wp_posts (
    post_author,
    post_date,
    post_date_gmt,
    post_content,
    post_title,
    post_excerpt,
    post_status,
    post_name,
    post_type,
    post_modified,
    post_modified_gmt,
    to_ping,
    pinged,
    post_content_filtered
) VALUES (
    1,
    NOW(),
    UTC_TIMESTAMP(),
    '<p>Velkommen til vårt første BIMtech-møte for 2025!</p>

<p>Dette møtet fokuserer på praktisk bruk av digital tvilling-teknologi i BIM-prosjekter. Vi vil se på:</p>

<ul>
<li>Hva er en digital tvilling?</li>
<li>Praktiske eksempler fra norske prosjekter</li>
<li>Verktøy og plattformer</li>
<li>Utfordringer og muligheter</li>
</ul>

<p>Møtet passer for alle som jobber med BIM og er nysgjerrige på fremtidens digitale løsninger.</p>

<h3>Program:</h3>
<ul>
<li>09:00 - Velkommen og introduksjon</li>
<li>09:15 - Presentasjon: Digital tvilling i praksis</li>
<li>10:00 - Pause</li>
<li>10:15 - Case-gjennomgang</li>
<li>11:00 - Diskusjon og spørsmål</li>
<li>11:30 - Avslutning</li>
</ul>',
    'BIMtech-møte: Digital tvilling i praksis',
    'Lær om digital tvilling-teknologi og hvordan den brukes i moderne BIM-prosjekter. Praktiske eksempler og case-studier.',
    'publish',
    'bimtech-mote-digital-tvilling-i-praksis',
    'bv_arrangement',
    NOW(),
    UTC_TIMESTAMP(),
    '',
    '',
    ''
);

-- Get the post ID
SET @post_id = LAST_INSERT_ID();

-- Set arrangement type (BIMtech-møte)
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT @post_id, term_taxonomy_id, 0
FROM wp_term_taxonomy
WHERE taxonomy = 'arrangement_type' AND term_id = (
    SELECT term_id FROM wp_terms WHERE name = 'BIMtech-møte' LIMIT 1
);

-- Insert ACF fields
-- dato_start
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'dato_start', '20250115');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_dato_start', 'field_arrangement_dato_start');

-- tidspunkt_start
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'tidspunkt_start', '09:00');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_tidspunkt_start', 'field_arrangement_tidspunkt_start');

-- pameldingsfrist
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'pameldingsfrist', '2025-01-10 23:59:00');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_pameldingsfrist', 'field_arrangement_pameldingsfrist');

-- moteformat
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'moteformat', 'hybrid');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_moteformat', 'field_arrangement_moteformat');

-- adresse
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'adresse', 'Dronning Eufemias gate 16');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_adresse', 'field_arrangement_adresse');

-- poststed
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'poststed', 'Oslo');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_poststed', 'field_arrangement_poststed');

-- digital_link
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'digital_link', 'https://teams.microsoft.com/l/meetup-join/example');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_digital_link', 'field_arrangement_digital_link');

-- maks_deltakere
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'maks_deltakere', '30');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_maks_deltakere', 'field_arrangement_maks_deltakere');

-- kun_for_medlemmer
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'kun_for_medlemmer', '1');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_kun_for_medlemmer', 'field_arrangement_kun_for_medlemmer');

-- arrangement_status
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'arrangement_status', 'paamelding_aapen');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_arrangement_status', 'field_arrangement_status');

-- gf_form_id (settes til 0 inntil Gravity Forms er konfigurert)
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, 'gf_form_id', '0');
INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (@post_id, '_gf_form_id', 'field_arrangement_gf_form_id');

-- Output success message
SELECT 
    CONCAT('✅ Test arrangement created with ID: ', @post_id) AS message,
    CONCAT('http://localhost:8888/bimverdi/wordpress/arrangement/', post_name) AS url
FROM wp_posts 
WHERE ID = @post_id;
