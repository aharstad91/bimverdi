<?php
/**
 * Arrangement REST API Endpoints
 *
 * Provides REST API endpoints for arrangement registration from Next.js frontend
 *
 * @package BimVerdi
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register REST API routes
 */
add_action('rest_api_init', function () {
    register_rest_route('bimverdi/v1', '/arrangement/(?P<id>\d+)/register', [
        'methods' => 'POST',
        'callback' => 'bv_handle_arrangement_registration',
        'permission_callback' => '__return_true', // Public endpoint
        'args' => [
            'id' => [
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
                'sanitize_callback' => 'absint',
            ],
        ],
    ]);

    // Check if user is registered for an arrangement
    register_rest_route('bimverdi/v1', '/arrangement/(?P<id>\d+)/check-registration', [
        'methods' => 'GET',
        'callback' => 'bv_check_arrangement_registration',
        'permission_callback' => '__return_true', // Public endpoint
        'args' => [
            'id' => [
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
                'sanitize_callback' => 'absint',
            ],
            'email' => [
                'validate_callback' => function($param) {
                    return is_email($param);
                },
                'sanitize_callback' => 'sanitize_email',
            ],
        ],
    ]);
});

/**
 * Handle arrangement registration
 *
 * @param WP_REST_Request $request Full data about the request
 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure
 */
function bv_handle_arrangement_registration($request) {
    $post_id = $request->get_param('id');
    $data = $request->get_json_params();

    // Validate that we have data
    if (empty($data)) {
        return new WP_Error(
            'no_data',
            'Ingen data mottatt',
            ['status' => 400]
        );
    }

    // 1. Validate arrangement exists and is published
    $arrangement = get_post($post_id);
    if (!$arrangement || $arrangement->post_type !== 'bv_arrangement' || $arrangement->post_status !== 'publish') {
        return new WP_Error(
            'invalid_arrangement',
            'Arrangement ikke funnet',
            ['status' => 404]
        );
    }

    // 2. Check arrangement status
    $arrangement_status = get_field('arrangement_status', $post_id);
    if ($arrangement_status === 'avlyst') {
        return new WP_Error(
            'cancelled',
            'Dette arrangementet er avlyst',
            ['status' => 400]
        );
    }

    // 3. Check registration deadline
    if (bv_is_registration_closed($post_id)) {
        return new WP_Error(
            'deadline_passed',
            'Påmeldingsfristen har gått ut',
            ['status' => 400]
        );
    }

    // 4. Check if arrangement is full
    if (bv_is_arrangement_full($post_id)) {
        return new WP_Error(
            'full',
            'Dette arrangementet er fullt booket',
            ['status' => 400]
        );
    }

    // 5. Check member-only restriction
    $kun_for_medlemmer = get_field('kun_for_medlemmer', $post_id);
    if ($kun_for_medlemmer && !bv_user_is_medlem()) {
        return new WP_Error(
            'members_only',
            'Dette arrangementet er kun for medlemmer',
            ['status' => 403]
        );
    }

    // 6. Validate form data
    $validation_errors = [];

    // Navn (required)
    if (empty($data['navn']) || strlen(trim($data['navn'])) < 2) {
        $validation_errors['navn'] = 'Navn er påkrevd (minst 2 tegn)';
    }

    // E-post (required, valid format)
    if (empty($data['epost'])) {
        $validation_errors['epost'] = 'E-post er påkrevd';
    } elseif (!is_email($data['epost'])) {
        $validation_errors['epost'] = 'Ugyldig e-postadresse';
    }

    // Telefon (required, basic validation)
    if (empty($data['telefon'])) {
        $validation_errors['telefon'] = 'Telefon er påkrevd';
    } elseif (strlen(preg_replace('/[^0-9]/', '', $data['telefon'])) < 8) {
        $validation_errors['telefon'] = 'Telefonnummer må ha minst 8 siffer';
    }

    // Vilkår (required checkbox)
    if (empty($data['vilkar']) || $data['vilkar'] !== true) {
        $validation_errors['vilkar'] = 'Du må godta vilkårene for påmelding';
    }

    if (!empty($validation_errors)) {
        return new WP_Error(
            'validation_failed',
            'Validering feilet',
            [
                'status' => 400,
                'errors' => $validation_errors
            ]
        );
    }

    // 7. Check if user is already registered (by email)
    $epost = sanitize_email($data['epost']);
    if (bv_user_is_registered_by_email($post_id, $epost)) {
        return new WP_Error(
            'already_registered',
            'Du er allerede påmeldt dette arrangementet',
            ['status' => 400]
        );
    }

    // 8. Get Gravity Forms form ID from ACF
    $form_id = get_field('gf_form_id', $post_id);
    if (!$form_id) {
        error_log('BimVerdi: No Gravity Forms ID set for arrangement ' . $post_id);
        return new WP_Error(
            'no_form',
            'Påmeldingsskjema er ikke konfigurert',
            ['status' => 500]
        );
    }

    // 9. Check if Gravity Forms is available
    if (!class_exists('GFAPI')) {
        error_log('BimVerdi: Gravity Forms API not available');
        return new WP_Error(
            'gf_not_available',
            'Påmeldingssystem er ikke tilgjengelig',
            ['status' => 500]
        );
    }

    // 10. Get form to map field IDs
    $form = GFAPI::get_form($form_id);
    if (!$form) {
        error_log('BimVerdi: Gravity Forms form ' . $form_id . ' not found');
        return new WP_Error(
            'form_not_found',
            'Påmeldingsskjema ikke funnet',
            ['status' => 500]
        );
    }

    // 11. Map form data to Gravity Forms field IDs
    $field_map = bv_get_gf_field_map($form);

    $entry_data = [
        'form_id' => $form_id,
        'created_by' => get_current_user_id(),
    ];

    // Map fields
    if (isset($field_map['arrangement_id'])) {
        $entry_data[$field_map['arrangement_id']] = $post_id;
    }
    if (isset($field_map['navn'])) {
        $entry_data[$field_map['navn']] = sanitize_text_field($data['navn']);
    }
    if (isset($field_map['epost'])) {
        $entry_data[$field_map['epost']] = $epost;
    }
    if (isset($field_map['telefon'])) {
        $entry_data[$field_map['telefon']] = sanitize_text_field($data['telefon']);
    }
    if (isset($field_map['bedrift']) && !empty($data['bedrift'])) {
        $entry_data[$field_map['bedrift']] = sanitize_text_field($data['bedrift']);
    }
    if (isset($field_map['kommentarer']) && !empty($data['kommentarer'])) {
        $entry_data[$field_map['kommentarer']] = sanitize_textarea_field($data['kommentarer']);
    }
    if (isset($field_map['vilkar'])) {
        $entry_data[$field_map['vilkar']] = 'Godtatt';
    }

    // 12. Submit to Gravity Forms
    $entry_id = GFAPI::add_entry($entry_data);

    if (is_wp_error($entry_id)) {
        error_log('BimVerdi: Gravity Forms submission failed: ' . $entry_id->get_error_message());
        return new WP_Error(
            'submission_failed',
            'Påmelding feilet. Vennligst prøv igjen.',
            ['status' => 500]
        );
    }

    // 13. Send notifications
    GFAPI::send_notifications($form, $entry_data, 'form_submission');

    // 14. Log success
    error_log('BimVerdi: Arrangement registration successful - Entry ID: ' . $entry_id . ', Arrangement ID: ' . $post_id . ', Email: ' . $epost);

    // 15. Return success response
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Påmelding vellykket! Du vil motta en bekreftelse på e-post.',
        'entry_id' => $entry_id,
    ], 200);
}

/**
 * Get Gravity Forms field map by field labels/admin labels
 *
 * @param array $form Gravity Forms form array
 * @return array Field map (label => field_id)
 */
function bv_get_gf_field_map($form) {
    $field_map = [];

    if (empty($form['fields']) || !is_array($form['fields'])) {
        return $field_map;
    }

    foreach ($form['fields'] as $field) {
        $label = strtolower(trim($field['label']));
        $admin_label = !empty($field['adminLabel']) ? strtolower(trim($field['adminLabel'])) : '';

        // Map by label or admin label
        if ($label === 'arrangement id' || $admin_label === 'arrangement_id') {
            $field_map['arrangement_id'] = $field['id'];
        } elseif ($label === 'navn' || $label === 'fullt navn') {
            $field_map['navn'] = $field['id'];
        } elseif ($label === 'e-post' || $label === 'epost' || $field['type'] === 'email') {
            $field_map['epost'] = $field['id'];
        } elseif ($label === 'telefon' || $label === 'telefonnummer' || $field['type'] === 'phone') {
            $field_map['telefon'] = $field['id'];
        } elseif ($label === 'bedrift' || $label === 'organisasjon') {
            $field_map['bedrift'] = $field['id'];
        } elseif ($label === 'kommentarer' || $label === 'melding' || $admin_label === 'kommentarer') {
            $field_map['kommentarer'] = $field['id'];
        } elseif (strpos($label, 'vilkår') !== false || strpos($label, 'samtykke') !== false) {
            $field_map['vilkar'] = $field['id'];
        }
    }

    return $field_map;
}

/**
 * Check if user is registered for an arrangement
 *
 * @param WP_REST_Request $request Full data about the request
 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure
 */
function bv_check_arrangement_registration($request) {
    $post_id = $request->get_param('id');
    $email = $request->get_param('email');

    if (empty($email)) {
        return new WP_REST_Response([
            'registered' => false,
        ], 200);
    }

    $is_registered = bv_user_is_registered_by_email($post_id, $email);

    return new WP_REST_Response([
        'registered' => $is_registered,
    ], 200);
}

/**
 * Check if user is registered by email
 *
 * @param int $post_id Arrangement post ID
 * @param string $email Email address
 * @return bool True if registered, false otherwise
 */
function bv_user_is_registered_by_email($post_id, $email) {
    // Get form ID
    $form_id = get_field('gf_form_id', $post_id);
    if (!$form_id || !class_exists('GFAPI')) {
        return false;
    }

    // Get form to find email field ID
    $form = GFAPI::get_form($form_id);
    if (!$form) {
        return false;
    }

    $field_map = bv_get_gf_field_map($form);
    if (empty($field_map['epost']) || empty($field_map['arrangement_id'])) {
        return false;
    }

    // Search for entries with this email and arrangement ID
    $search_criteria = [
        'status' => 'active',
        'field_filters' => [
            'mode' => 'all',
            [
                'key' => (string)$field_map['arrangement_id'],
                'value' => $post_id,
            ],
            [
                'key' => (string)$field_map['epost'],
                'value' => $email,
            ],
        ],
    ];

    $entries = GFAPI::get_entries($form_id, $search_criteria);

    return !empty($entries) && !is_wp_error($entries);
}
