<?php
/**
 * Custom Post Type: Arrangement (bv_arrangement)
 * 
 * Registrerer CPT for arrangementer med taxonomy
 */

// Register Custom Post Type: bv_arrangement
function bv_register_arrangement_cpt() {
    $labels = [
        'name'                  => 'Arrangementer',
        'singular_name'         => 'Arrangement',
        'menu_name'             => 'Arrangementer',
        'add_new'               => 'Legg til nytt',
        'add_new_item'          => 'Legg til nytt arrangement',
        'edit_item'             => 'Rediger arrangement',
        'new_item'              => 'Nytt arrangement',
        'view_item'             => 'Vis arrangement',
        'view_items'            => 'Vis arrangementer',
        'search_items'          => 'Søk arrangementer',
        'not_found'             => 'Ingen arrangementer funnet',
        'not_found_in_trash'    => 'Ingen arrangementer funnet i papirkurv',
        'all_items'             => 'Alle arrangementer',
        'archives'              => 'Arrangement-arkiv',
        'attributes'            => 'Arrangement-attributter',
    ];

    $args = [
        'labels'                => $labels,
        'public'                => true,
        'publicly_queryable'    => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'query_var'             => true,
        'rewrite'               => ['slug' => 'arrangement'],
        'capability_type'       => 'post',
        'has_archive'           => true,
        'hierarchical'          => false,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-calendar-alt',
        'show_in_rest'          => true,
        'rest_base'             => 'arrangement',
        'supports'              => ['title', 'editor', 'thumbnail', 'excerpt'],
        'show_in_graphql'       => true,
        'graphql_single_name'   => 'arrangement',
        'graphql_plural_name'   => 'arrangementer',
    ];

    register_post_type('bv_arrangement', $args);
}
add_action('init', 'bv_register_arrangement_cpt');

// Register Taxonomy: arrangement_type
function bv_register_arrangement_taxonomy() {
    $labels = [
        'name'              => 'Arrangement-typer',
        'singular_name'     => 'Arrangement-type',
        'search_items'      => 'Søk arrangement-typer',
        'all_items'         => 'Alle arrangement-typer',
        'parent_item'       => 'Overordnet arrangement-type',
        'parent_item_colon' => 'Overordnet arrangement-type:',
        'edit_item'         => 'Rediger arrangement-type',
        'update_item'       => 'Oppdater arrangement-type',
        'add_new_item'      => 'Legg til ny arrangement-type',
        'new_item_name'     => 'Ny arrangement-type',
        'menu_name'         => 'Arrangement-typer',
    ];

    $args = [
        'labels'            => $labels,
        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud'     => false,
        'show_in_rest'      => true,
        'rest_base'         => 'arrangement_type',
        'show_in_graphql'   => true,
        'graphql_single_name' => 'arrangementType',
        'graphql_plural_name' => 'arrangementTypes',
    ];

    register_taxonomy('arrangement_type', ['bv_arrangement'], $args);
}
add_action('init', 'bv_register_arrangement_taxonomy');

// Insert default arrangement types
function bv_insert_default_arrangement_types() {
    // Only run once
    if (get_option('bv_arrangement_types_inserted')) {
        return;
    }

    $types = [
        'BIMtech-møte',
        'Seminar',
        'Workshop',
        'Konferanse',
        'Nettverksmøte',
    ];

    foreach ($types as $type) {
        if (!term_exists($type, 'arrangement_type')) {
            wp_insert_term($type, 'arrangement_type');
        }
    }

    update_option('bv_arrangement_types_inserted', true);
}
add_action('init', 'bv_insert_default_arrangement_types', 20);
