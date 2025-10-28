<?php
/**
 * BIMVerdi Theme Functions
 *
 * Registers Custom Post Types and enables CORS for headless setup
 */

// Enable CORS for REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        return $value;
    });
}, 15);

// Register Custom Post Types
function bimverdi_register_post_types() {

    // Deltakere (tidligere Medlemsbedrifter)
    register_post_type('deltakere', [
        'labels' => [
            'name' => 'Deltakere',
            'singular_name' => 'Deltaker',
            'add_new' => 'Legg til ny',
            'add_new_item' => 'Legg til ny deltaker',
            'edit_item' => 'Rediger deltaker',
            'view_item' => 'Vis deltaker',
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'rest_base' => 'deltakere',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-building',
        'show_in_graphql' => true,
        'graphql_single_name' => 'deltaker',
        'graphql_plural_name' => 'deltakere',
    ]);

    // Verktøy
    register_post_type('tools', [
        'labels' => [
            'name' => 'Verktøy',
            'singular_name' => 'Verktøy',
            'add_new' => 'Legg til nytt',
            'add_new_item' => 'Legg til nytt verktøy',
            'edit_item' => 'Rediger verktøy',
            'view_item' => 'Vis verktøy',
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'rest_base' => 'tools',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-admin-tools',
        'show_in_graphql' => true,
        'graphql_single_name' => 'tool',
        'graphql_plural_name' => 'tools',
    ]);

    // Caser
    register_post_type('cases', [
        'labels' => [
            'name' => 'Caser',
            'singular_name' => 'Case',
            'add_new' => 'Legg til ny',
            'add_new_item' => 'Legg til ny case',
            'edit_item' => 'Rediger case',
            'view_item' => 'Vis case',
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'rest_base' => 'cases',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-chart-bar',
        'show_in_graphql' => true,
        'graphql_single_name' => 'case',
        'graphql_plural_name' => 'cases',
    ]);

    // Arrangementer (Prosjekter/Events)
    register_post_type('events', [
        'labels' => [
            'name' => 'Arrangementer',
            'singular_name' => 'Arrangement',
            'add_new' => 'Legg til nytt',
            'add_new_item' => 'Legg til nytt arrangement',
            'edit_item' => 'Rediger arrangement',
            'view_item' => 'Vis arrangement',
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'rest_base' => 'events',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-calendar-alt',
        'show_in_graphql' => true,
        'graphql_single_name' => 'event',
        'graphql_plural_name' => 'events',
    ]);
}
add_action('init', 'bimverdi_register_post_types');

// Add theme support
function bimverdi_theme_support() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
}
add_action('after_setup_theme', 'bimverdi_theme_support');

// Include ACF Field Groups
require_once get_template_directory() . '/acf-fields.php';

// Include Arrangement CPT and Functions
require_once get_template_directory() . '/inc/arrangement-cpt.php';
require_once get_template_directory() . '/inc/arrangement-functions.php';

// Enable ACF REST API support
add_filter('acf/settings/rest_api_enabled', '__return_true');
add_filter('acf/rest_api/field_settings/show_in_rest', '__return_true');

// Disable Gutenberg for custom post types to avoid REST API conflicts
// To re-enable: just comment out or remove this filter
add_filter('use_block_editor_for_post_type', function($is_enabled, $post_type) {
    $disabled_post_types = ['deltakere', 'tools', 'cases', 'events'];

    if (in_array($post_type, $disabled_post_types)) {
        return false;
    }
    return $is_enabled;
}, 10, 2);
