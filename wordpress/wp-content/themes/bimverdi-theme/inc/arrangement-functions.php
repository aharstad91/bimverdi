<?php
/**
 * Helper Functions for Arrangement System
 *
 * Funksjoner for å sjekke medlemsstatus, påmeldinger, kapasitet, etc.
 */

/**
 * Sjekk om bruker er medlem
 *
 * @return bool True hvis bruker er innlogget (forenklet versjon for MVP)
 */
function bv_user_is_medlem() {
    return is_user_logged_in();
}

/**
 * Hent antall påmeldte til et arrangement
 *
 * @param int $post_id Arrangement post ID
 * @return int Antall påmeldte
 */
function bv_get_pameldte_count($post_id) {
    // Hent Gravity Forms form ID fra ACF
    $form_id = get_field('gf_form_id', $post_id);

    if (!$form_id || !class_exists('GFAPI')) {
        return 0;
    }

    // Hent alle entries for dette skjemaet som har arrangement_id = $post_id
    $search_criteria = [
        'status'        => 'active',
        'field_filters' => [
            [
                'key'   => 'arrangement_id',
                'value' => $post_id,
            ],
        ],
    ];

    $entries = GFAPI::get_entries($form_id, $search_criteria);

    return is_array($entries) ? count($entries) : 0;
}

/**
 * Sjekk om arrangement er fullbooket
 *
 * @param int $post_id Arrangement post ID
 * @return bool True hvis fullbooket
 */
function bv_is_arrangement_full($post_id) {
    $maks_deltakere = get_field('maks_deltakere', $post_id);

    // 0 = ubegrenset
    if (empty($maks_deltakere) || $maks_deltakere == 0) {
        return false;
    }

    $pameldte_count = bv_get_pameldte_count($post_id);

    return $pameldte_count >= $maks_deltakere;
}

/**
 * Sjekk om bruker er påmeldt arrangement
 *
 * @param int $post_id Arrangement post ID
 * @return bool True hvis bruker er påmeldt
 */
function bv_user_is_registered($post_id) {
    if (!is_user_logged_in()) {
        return false;
    }

    $user = wp_get_current_user();
    $user_email = $user->user_email;

    $form_id = get_field('gf_form_id', $post_id);

    if (!$form_id || !class_exists('GFAPI')) {
        return false;
    }

    // Søk etter entries med brukerens e-post
    $search_criteria = [
        'status'        => 'active',
        'field_filters' => [
            [
                'key'   => 'arrangement_id',
                'value' => $post_id,
            ],
        ],
    ];

    $entries = GFAPI::get_entries($form_id, $search_criteria);

    if (!is_array($entries)) {
        return false;
    }

    // Sjekk om brukerens e-post finnes i entries
    foreach ($entries as $entry) {
        // Anta at e-post-feltet har field_id = 3 (eller finn dynamisk)
        foreach ($entry as $key => $value) {
            if (is_numeric($key) && strtolower($value) === strtolower($user_email)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Hent status-label på norsk
 *
 * @param string $status Status verdi
 * @return string Norsk status-tekst
 */
function bv_get_status_label($status) {
    $labels = [
        'kommende'          => 'Kommende',
        'paamelding_aapen'  => 'Påmelding åpen',
        'fullbooket'        => 'Fullbooket',
        'avlyst'            => 'Avlyst',
    ];

    return isset($labels[$status]) ? $labels[$status] : ucfirst($status);
}

/**
 * Hent format-ikon
 *
 * @param string $format Møteformat (fysisk/digitalt/hybrid)
 * @return string Emoji eller tekst
 */
function bv_get_format_icon($format) {
    $icons = [
        'fysisk'   => '📍',
        'digitalt' => '💻',
        'hybrid'   => '🔄',
    ];

    return isset($icons[$format]) ? $icons[$format] : '';
}

/**
 * Formater dato på norsk
 *
 * @param string $date Dato (YYYYMMDD format fra ACF)
 * @return string Formatert dato
 */
function bv_format_date($date) {
    if (empty($date)) {
        return '';
    }

    // ACF returnerer dato i YYYYMMDD format
    $timestamp = strtotime($date);

    if (!$timestamp) {
        return $date;
    }

    // Norsk datoformat: 15. januar 2025
    $norwegian_months = [
        1 => 'januar', 2 => 'februar', 3 => 'mars', 4 => 'april',
        5 => 'mai', 6 => 'juni', 7 => 'juli', 8 => 'august',
        9 => 'september', 10 => 'oktober', 11 => 'november', 12 => 'desember'
    ];

    $day = date('j', $timestamp);
    $month = $norwegian_months[(int)date('n', $timestamp)];
    $year = date('Y', $timestamp);

    return "{$day}. {$month} {$year}";
}

/**
 * Sjekk om påmeldingsfrist har passert
 *
 * @param int $post_id Arrangement post ID
 * @return bool True hvis frist har passert
 */
function bv_is_registration_closed($post_id) {
    $frist = get_field('pameldingsfrist', $post_id);

    if (empty($frist)) {
        return false;
    }

    $frist_timestamp = strtotime($frist);
    $now = current_time('timestamp');

    return $now > $frist_timestamp;
}
